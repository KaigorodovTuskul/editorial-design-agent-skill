#!/usr/bin/env python3
"""Verify native editable shapes + actual PPTX-to-PDF-to-PNG visual similarity.
The visual thresholds are configurable but a release always requires a real roundtrip.
LibreOffice is an indicative test renderer, not a guarantee for arbitrary MS Office installations.
"""
import argparse
import json
import os
import shutil
import subprocess
import tempfile
import zipfile
import xml.etree.ElementTree as ET
from pathlib import Path

import numpy as np
from PIL import Image, ImageChops, ImageEnhance

W,H=1920,1080


def inspect_shapes(ppt):
    with zipfile.ZipFile(ppt,'r') as archive:
        files=sorted((n for n in archive.namelist() if n.startswith('ppt/slides/slide') and n.endswith('.xml')),
             key=lambda p:int(Path(p).stem.replace('slide','')))
        out=[]
        ns={'p':'http://schemas.openxmlformats.org/presentationml/2006/main',
            'a':'http://schemas.openxmlformats.org/drawingml/2006/main'}
        for name in files:
            root=ET.fromstring(archive.read(name))
            out.append({'slide':len(out)+1,'editable_text_shapes':len(root.findall('.//p:sp',ns)),
                'background_pictures':len(root.findall('.//p:pic',ns))})
        return out


def make_diff(golden,actual,path):
    d=ImageChops.difference(golden,actual)
    d=ImageEnhance.Contrast(d).enhance(4)
    d.save(path)


def compare(golden,pptx_png,fields):
    ref=np.asarray(golden,dtype=np.int16)
    target=np.asarray(pptx_png,dtype=np.int16)
    delta=np.abs(ref-target).mean(axis=2)
    mask=np.zeros((H,W),dtype=bool)
    for f in fields:
        b=f['box']
        # Expand mask to cover antialias overhang and cross-renderer baseline differences.
        x=max(0,int(b['x']-14)); y=max(0,int(b['y']-14))
        xx=min(W,int(b['x']+b['w']+14)); yy=min(H,int(b['y']+b['h']+14))
        if xx>x and yy>y:mask[y:yy,x:xx]=True
    ink_error=float(np.mean(delta[mask])) if np.any(mask) else 0
    bg_error=float(np.mean(delta[~mask])) if np.any(~mask) else 0
    # The font/position test uses only the intended text regions, not blank margins.
    return {
        'total_mae':round(float(delta.mean()),3),
        'text_region_mae':round(ink_error,3),
        'background_mae':round(bg_error,3),
        'pixels_over_30_pct':round(float((delta>30).mean())*100,3),
        'text_region_coverage_pct':round(float(mask.mean())*100,2),
    }


def verify(ppt,out,visual=False,strict=False,thresholds=None,pair_pdf=False):
    out=Path(out).resolve();ppt=Path(ppt).resolve()
    shapes=inspect_shapes(ppt)
    report={'version':'0.2.0','slides':len(shapes),'native_shapes':shapes,'paired_pdf':False,
        'has_editable_text':all(x['editable_text_shapes']>0 for x in shapes),
        'background_per_slide':all(x['background_pictures']==1 for x in shapes),
        'visual_parity':'NOT_RUN',
        'thresholds':thresholds or {'total_mae':7.0,'text_region_mae':21.5,'background_mae':3.0}}
    if visual:
        lo=shutil.which('libreoffice') or shutil.which('soffice')
        if not lo:
            report['visual_parity']='UNAVAILABLE'
            report['error']='LibreOffice is not installed; no claims of visual identity possible'
        else:
            with tempfile.TemporaryDirectory(prefix='editorial-hybrid-') as td:
                td=Path(td)
                profile=td/'lo-profile'
                cmd=[lo,f'-env:UserInstallation={profile.as_uri()}','--headless','--convert-to','pdf','--outdir',str(td),str(ppt)]
                proc=subprocess.run(cmd,capture_output=True,text=True,timeout=180)
                pdf=td/(ppt.stem+'.pdf')
                if proc.returncode or not pdf.exists():
                    report['visual_parity']='ERROR';report['error']=(proc.stdout+'\n'+proc.stderr)[-1800:]
                else:
                    import fitz
                    doc=fitz.open(pdf)
                    render_report=json.loads((out/'render-report.json').read_text())
                    (out/'pptx-render').mkdir(exist_ok=True)
                    (out/'parity-diffs').mkdir(exist_ok=True)
                    per=[]
                    for i,page in enumerate(doc):
                        pix=page.get_pixmap(matrix=fitz.Matrix(W/page.rect.width,H/page.rect.height),alpha=False)
                        actual=Image.frombytes('RGB',(pix.width,pix.height),pix.samples)
                        if actual.size!=(W,H):actual=actual.resize((W,H),Image.Resampling.LANCZOS)
                        actual.save(out/'pptx-render'/f'slide-{i+1:02d}.png',optimize=True)
                        golden=Image.open(out/'images'/f'slide-{i+1:02d}.png').convert('RGB')
                        fields=render_report['slides'][i]['fields']
                        metrics=compare(golden,actual,fields)
                        # Averages alone can miss an obvious broken paragraph. Look for
                        # genuinely split native lines, using the text layer of the
                        # roundtripped PDF; no OCR is involved.
                        wraps=[];unsearchable=[]
                        alltexts=[f['text'] for f in fields]
                        for f in fields:
                            q=f['text']
                            if len(q)<18 or len(q.split())<3 or alltexts.count(q)>1 or '\n' in q:
                                continue
                            rectangles=page.search_for(q)
                            if len(rectangles)>1:
                                tops={round(box.y0,1) for box in rectangles}
                                if len(tops)>1:
                                    wraps.append({'text':q[:75],'line_count':len(tops)})
                            elif len(rectangles)==0:
                                unsearchable.append(q[:75])
                        metrics['native_line_wraps']=wraps
                        metrics['text_search_uncertain']=unsearchable
                        make_diff(golden,actual,out/'parity-diffs'/f'slide-{i+1:02d}-diff.png')
                        metrics['slide']=i+1
                        metrics['pass']=all(metrics[k]<=report['thresholds'][k] for k in report['thresholds']) and not wraps
                        per.append(metrics)
                    report['visual_parity']='PASS' if len(per)==len(shapes) and all(x['pass'] for x in per) else 'FAIL'
                    report['metrics']=per
                    if report['visual_parity']=='PASS' and pair_pdf:
                        # One rendering authority for the final handoff: the visual PDF and
                        # editable PPTX come from exactly the same native Office layout.
                        # Preserve browser-pure PDF as a separate comparison artifact.
                        target=out/'publication.pdf'
                        original=out/'publication-browser.pdf'
                        if target.exists() and not original.exists():
                            shutil.copy2(target,original)
                        shutil.copy2(pdf,target)
                        report['paired_pdf']=True
                        report['paired_pdf_renderer']='LibreOffice'
                        report['paired_pdf_note']='Published PDF is the native PPTX renderer output. Original Chromium PDF is preserved as publication-browser.pdf.'
    report['release_grade']=bool(report['has_editable_text'] and report['background_per_slide'] and report['visual_parity']=='PASS')
    (out/'pptx-verify-report.json').write_text(json.dumps(report,indent=2,ensure_ascii=False),encoding='utf-8')
    print(json.dumps({'visual_parity':report['visual_parity'],'paired_pdf':report['paired_pdf'],'slides':len(shapes),
       'metrics':report.get('metrics'),'shape_checks':report['has_editable_text'] and report['background_per_slide']},ensure_ascii=False))
    if strict and not report['release_grade']:raise SystemExit(2)
    if not report['has_editable_text'] or not report['background_per_slide']:raise SystemExit(2)
    return report

if __name__=='__main__':
    parser=argparse.ArgumentParser()
    parser.add_argument('file');parser.add_argument('--out');parser.add_argument('--visual',action='store_true');parser.add_argument('--strict',action='store_true')
    parser.add_argument('--pair-pdf',action='store_true',help='On verified parity, create the final PDF from the same PPTX rendering and preserve Chromium PDF separately')
    parser.add_argument('--max-total',type=float,default=7.0)
    parser.add_argument('--max-text',type=float,default=21.5)
    parser.add_argument('--max-background',type=float,default=3.0)
    args=parser.parse_args()
    verify(args.file,args.out or str(Path(args.file).parent),visual=args.visual,strict=args.strict,
           thresholds={'total_mae':args.max_total,'text_region_mae':args.max_text,'background_mae':args.max_background},pair_pdf=args.pair_pdf)
