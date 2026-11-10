#!/usr/bin/env python3
"""Deterministic Chromium screenshots, text extraction, PDF and geometry QA.

This script deliberately does not claim to perform artistic review. Agent-led visual
review of the generated contact sheet is required by SKILL.md.
"""
import argparse
import json
import math
import os
import re
import html as html_module
import shutil
import subprocess
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont
from playwright.sync_api import sync_playwright
from pypdf import PdfReader, PdfWriter

SLIDE_W, SLIDE_H = 1920, 1080


def locate_chrome():
    override = os.environ.get('EDITORIAL_CHROMIUM_PATH')
    if override:
        return override
    for item in ('chromium', 'chromium-browser', 'google-chrome', 'google-chrome-stable'):
        found = shutil.which(item)
        if found:
            return found
    return None  # Playwright-managed Chromium


def installed_font(family):
    fc = shutil.which('fc-match')
    if not fc:
        return {'status': 'unchecked', 'reason': 'fontconfig not installed; review fonts manually'}
    output = subprocess.run([fc, '-f', '%{family}', family], capture_output=True, text=True, timeout=8)
    actual = output.stdout.strip()
    return {'status': 'pass' if family.lower() in actual.lower() else 'missing', 'requested': family, 'resolved': actual}


def contact_sheet(image_paths, dest):
    cols = 3
    tile_w = 555
    tile_h = 360
    rows = math.ceil(len(image_paths) / cols)
    sheet = Image.new('RGB', (cols * tile_w, rows * tile_h), '#e9eff6')
    draw = ImageDraw.Draw(sheet)
    for i, image_path in enumerate(image_paths):
        with Image.open(image_path) as source:
            source = source.convert('RGB')
            source.thumbnail((tile_w - 26, tile_h - 55), Image.Resampling.LANCZOS)
            x = (i % cols) * tile_w + 13
            y = (i // cols) * tile_h + 16
            sheet.paste(source, (x, y))
            draw.text((x, y + 307), f'Slide {i+1:02d}', fill='#192F50')
    sheet.save(dest, optimize=True)


def geometry(fields):
    findings = []
    for f in fields:
        rect = f['box']
        if rect['x'] < -1 or rect['y'] < -1 or rect['x'] + rect['w'] > SLIDE_W + 1 or rect['y'] + rect['h'] > SLIDE_H + 1:
            findings.append({'severity': 'P0', 'type': 'out_of_bounds', 'element': f['text'][:45], 'box': rect})
        if f['overflowX'] or f['overflowY']:
            findings.append({'severity': 'P0', 'type': 'text_overflow', 'element': f['text'][:45]})
    for i, a in enumerate(fields):
        for b in fields[i+1:]:
            q, r = a['box'], b['box']
            intersect_w = min(q['x'] + q['w'], r['x'] + r['w']) - max(q['x'], r['x'])
            intersect_h = min(q['y'] + q['h'], r['y'] + r['h']) - max(q['y'], r['y'])
            if intersect_w > 4 and intersect_h > 4:
                intersect_area = intersect_w * intersect_h
                smaller = min(q['w'] * q['h'], r['w'] * r['h'])
                if smaller > 0 and intersect_area / smaller > 0.16:
                    findings.append({'severity':'P1', 'type':'editable_text_overlap', 'elements':[a['text'][:30],b['text'][:30]]})
    return findings


JS_FIELDS = r'''() => Array.from(document.querySelectorAll('[data-editable="true"]')).map((node,index)=>{
 const r=node.getBoundingClientRect(),c=getComputedStyle(node);
 return {index,text:node.innerText.trim(),box:{x:r.left,y:r.top,w:r.width,h:r.height},
 style:{fontSize:c.fontSize,fontFamily:c.fontFamily,fontWeight:c.fontWeight,fontStyle:c.fontStyle,color:c.color,
 lineHeight:c.lineHeight,letterSpacing:c.letterSpacing,textAlign:c.textAlign,
 verticalAlign:c.verticalAlign,fontVariationSettings:c.fontVariationSettings,textTransform:c.textTransform,whiteSpace:c.whiteSpace},
 overflowX:c.overflowX!=='visible'&&node.scrollWidth>node.clientWidth+3,overflowY:c.overflowY!=='visible'&&node.scrollHeight>node.clientHeight+3};
})'''


def load_offline_html(file):
    """Inline local relative CSS; Chromium file:// navigation is blocked in some sandboxes."""
    file=Path(file)
    html=file.read_text(encoding='utf-8')
    pattern=r'<link\s+rel=["\']stylesheet["\']\s+href=["\']([^"\']+)["\']\s*/?>'
    def inline(match):
        name=match.group(1)
        if name.startswith(('http:', 'https:', 'data:', '/')):
            raise ValueError('External/absolute CSS is forbidden in deterministic rendering')
        p=(file.parent/name).resolve()
        if not p.is_file():raise FileNotFoundError(f'Stylesheet {p} not found')
        return '<style>\n'+p.read_text(encoding='utf-8')+'\n</style>'
    return re.sub(pattern,inline,html,flags=re.I)


def render(config):
    out=Path(config['out']).resolve()
    out.mkdir(parents=True,exist_ok=True)
    image_dir=out/'images'
    image_dir.mkdir(exist_ok=True)
    specs=[]
    screenshots=[]
    pdf_paths=[]
    chrome=locate_chrome()
    with sync_playwright() as playwright:
        params={'headless':True, 'args':['--no-sandbox', '--disable-dev-shm-usage']}
        if chrome:
            params['executable_path']=chrome
        browser=playwright.chromium.launch(**params)
        page=browser.new_page(viewport={'width':SLIDE_W,'height':SLIDE_H},device_scale_factor=1)
        page.emulate_media(media='screen')
        for index,html_path in enumerate(config['htmlFiles']):
            num=index+1
            page.set_content(load_offline_html(html_path),wait_until='load')
            page.evaluate('async () => { await document.fonts.ready; await Promise.all(Array.from(document.images).map(img => img.complete ? Promise.resolve() : new Promise(resolve => {img.onload=resolve; img.onerror=resolve;}))); }')
            page.locator('.slide').wait_for()
            fields=page.evaluate(JS_FIELDS)
            # Record a fontconfig-verified family for LibreOffice parity (and warn on fallback).
            # This is not silently treated as a match for the user-selected font.
            for f in fields:
                families=[x.strip().strip("\"'") for x in f['style'].get('fontFamily','').split(',')]
                family=families[0]
                actual=''
                for candidate in families:
                    match=installed_font(candidate)
                    if match.get('status')=='pass':
                        actual=match.get('resolved',candidate).split(',')[0]
                        break
                f['style']['resolvedFont']=actual or family
                f['style']['requestedFont']=family
            full=image_dir/f'slide-{num:02d}.png'
            background=image_dir/f'slide-{num:02d}-background.png'
            page.screenshot(path=str(full),animations='disabled',caret='hide')
            page.screenshot(path=str(background),animations='disabled',caret='hide',style='[data-editable="true"] { visibility: hidden !important; }')
            screenshots.append(full)
            pdf_part=out/f'.slide-{num:02d}.pdf'
            page.pdf(path=str(pdf_part),width='13.333333in',height='7.5in',print_background=True,
                     margin={'top':'0','bottom':'0','left':'0','right':'0'},scale=2/3,
                     prefer_css_page_size=False)
            pdf_paths.append(pdf_part)
            issues=geometry(fields)
            specs.append({'index':num,'slideId':config['slideIds'][index],
                          'background':str(background.relative_to(out)),
                          'full':str(full.relative_to(out)),
                          'fields':fields,'findings':issues})
        browser.close()
    writer=PdfWriter()
    for part in pdf_paths:
        reader=PdfReader(str(part))
        if len(reader.pages)!=1:
            raise RuntimeError(f'Unexpected PDF pagination ({len(reader.pages)} pages) in {part.name}')
        writer.add_page(reader.pages[0])
    pdf_file=out/'publication.pdf'
    with pdf_file.open('wb') as stream:
        writer.write(stream)
    for part in pdf_paths:
        part.unlink()
    sheet=out/'contact-sheet.png'
    contact_sheet(screenshots,sheet)
    font_result=installed_font(config['fontFamily'])
    findings=[{**f,'slide':s['index']} for s in specs for f in s['findings']]
    if font_result['status']=='missing':
        findings.append({'severity':'P1','type':'font_missing','detail':font_result})
    report={
      'version':'0.2.0','format':'1920x1080','slideCount':len(specs),
      'font':font_result,'slides':specs,'findings':findings,
      'contactSheet':'contact-sheet.png','pdf':'publication.pdf',
      'geometryPass':not any(f['severity']=='P0' for f in findings),
      'visualReview':{'status':'pending','note':'Screenshots must be inspected by an agent or human; this script does not perform visual review'},
    }
    (out/'render-report.json').write_text(json.dumps(report,indent=2,ensure_ascii=False),encoding='utf-8')
    print(json.dumps({'slideCount':len(specs),'pdf':str(pdf_file),'contactSheet':str(sheet),
                      'geometryIssues':len(findings),'font':font_result},ensure_ascii=False))


if __name__=='__main__':
    parser=argparse.ArgumentParser()
    parser.add_argument('manifest')
    args=parser.parse_args()
    render(json.loads(Path(args.manifest).read_text(encoding='utf-8')))
