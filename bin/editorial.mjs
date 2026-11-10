#!/usr/bin/env node
import {readFileSync,writeFileSync,mkdirSync,existsSync} from 'node:fs';
import {resolve,join,dirname} from 'node:path';
import {spawnSync} from 'node:child_process';
import {normalize,presets} from '../src/validate.mjs';
import {renderSlide,renderIndex} from '../src/render.mjs';
import {prepareFreeform} from '../src/freeform.mjs';
import {checkHallmark} from '../src/hallmark.mjs';
import {recordReview,release} from '../src/release.mjs';
const repo=resolve(import.meta.dirname,'..');
function usage(){console.log(`Editorial Design Engine v0.2.0\n\nUsage:\n  editorial themes\n  editorial build-html <freeform-project-dir> [--out <dir>] [--allow-unverified]
  editorial verify <build-dir>
  editorial build <input.json> [--out <dir>] [--unattended] [--allow-unverified]\n  editorial render <build-dir>\n  editorial export-pptx <build-dir>\n  editorial review <build-dir> --cycle 1 --notes review-notes.json\n  editorial release <build-dir> --approval human-approval.json\n\nStrict builds require a design approval, Hallmark installed, clean geometry and model-led visual review before publishing.\n--allow-unverified is for demos only; it NEVER means READY.`);}
const args=process.argv.slice(2);
const command=args.shift();
const flag=(name)=>{const i=args.indexOf(name);if(i===-1)return false;args.splice(i,1);return true;};
const valueFlag=(name,fallback)=>{const i=args.indexOf(name);if(i===-1)return fallback;const value=args[i+1];args.splice(i,2);return value;};
function write(file,data){writeFileSync(file,JSON.stringify(data,null,2),'utf8');}
function run(cmd,argv,cwd=repo){const p=spawnSync(cmd,argv,{cwd,stdio:'inherit',env:process.env});if(p.status!==0)throw new Error(`${cmd} failed (${p.status})`);}
try{
  if(!command||command==='help'){usage();process.exit(0);}
  if(command==='themes'){
    console.log('Themes:');for(const [id,v] of Object.entries(presets.themes))console.log(`  ${id} — ${v.name}`);
    console.log('Fonts:');for(const [id,v] of Object.entries(presets.fonts))console.log(`  ${id} — ${v.name}`);
    process.exit(0);
  }
  if(command==='build-html'){
    const input=args.shift();if(!input)throw new Error('Project folder required');
    const out=resolve(valueFlag('--out','outputs/freeform'));
    const unattended=flag('--unattended'),allowUnverified=flag('--allow-unverified');
    const {doc,manifest,htmlFiles}=prepareFreeform(input,out,{unattended});
    run(process.env.EDITORIAL_PYTHON||'python',['python/render.py',join(out,'render-manifest.json')]);
    run(process.execPath,['src/export-pptx.cjs',out,join(out,'normalized.json')]);
    const hallmark=checkHallmark(out,htmlFiles);
    const report=JSON.parse(readFileSync(join(out,'render-report.json'),'utf8'));
    const status={createdAt:new Date().toISOString(),state:'NOT_READY',reasons:[],
      visualCyclesCompleted:0,visualCyclesRequired:2,nextStep:'Run visual reviews; run editorial verify; factual approval required'};
    if(hallmark.status!=='PASS')status.reasons.push('Hallmark audit not passed: '+hallmark.status);
    if(!report.geometryPass)status.reasons.push('DOM geometry findings');
    if(report.font.status!=='pass')status.reasons.push('Selected primary font not installed: '+doc.font.css);
    status.reasons.push('Visual review and PPTX parity verification required');
    if(doc.meta.dataStatus!=='verified')status.reasons.push('Illustrative reference data, not approved for distribution');
    write(join(out,'release-status.json'),status);
    console.log('Freeform publication created at '+out+'; release status NOT_READY');
    if(!allowUnverified&&(hallmark.status!=='PASS'||!report.geometryPass))process.exitCode=2;
  }else if(command==='verify'){
    const target=resolve(args.shift()||'outputs/freeform');
    run(process.env.EDITORIAL_PYTHON||'python',['python/verify_pptx.py',join(target,'publication-editable.pptx'),'--out',target,'--visual','--strict','--pair-pdf']);
    const test=JSON.parse(readFileSync(join(target,'pptx-verify-report.json'),'utf8'));
    const statusFile=join(target,'release-status.json');
    if(existsSync(statusFile)){
      const status=JSON.parse(readFileSync(statusFile,'utf8'));
      status.pptxVisualParity=test.visual_parity;
      status.pairedPdf=test.paired_pdf;
      status.reasons=status.reasons.map(x=>x==='Visual review and PPTX parity verification required'?'Mandatory visual review rounds not completed':x);
      if(test.visual_parity!=='PASS')status.reasons.push('Native PPTX parity blocked by roundtrip test');
      write(statusFile,status);
    }
  }else if(command==='build'){
    const input=args.shift();if(!input)throw new Error('Input JSON required');
    const out=resolve(valueFlag('--out','outputs/publication'));
    const unattended=flag('--unattended'),allowUnverified=flag('--allow-unverified');
    const source=JSON.parse(readFileSync(resolve(input),'utf8'));
    const doc=normalize(source,{unattended});
    mkdirSync(join(out,'slides'),{recursive:true});
    const files=[];
    doc.slides.forEach((s,i)=>{const dest=join(out,'slides',`slide-${String(i+1).padStart(2,'0')}.html`);writeFileSync(dest,renderSlide(doc,s,i));files.push(dest)});
    writeFileSync(join(out,'index.html'),renderIndex(doc));write(join(out,'normalized.json'),doc);
    const manifest={out,htmlFiles:files,slideIds:doc.slides.map(s=>s.id),fontFamily:doc.font.css};
    write(join(out,'render-manifest.json'),manifest);
    run(process.env.EDITORIAL_PYTHON||'python',['python/render.py',join(out,'render-manifest.json')]);
    run(process.execPath,['src/export-pptx.cjs',out,join(out,'normalized.json')]);
    const hallmark=checkHallmark(out,files);
    const report=JSON.parse(readFileSync(join(out,'render-report.json'),'utf8'));
    const status={createdAt:new Date().toISOString(),state:'NOT_READY',
      reasons:[],visualCyclesCompleted:0,visualCyclesRequired:2,
      nextStep:'Inspect contact-sheet.png, run two visual review/fix cycles, verify exported PPTX then set reviewed state using release checklist.'};
    if(hallmark.status!=='PASS')status.reasons.push(`Hallmark: ${hallmark.status}`);
    if(!report.geometryPass)status.reasons.push('P0 geometry failure');
    if(report.font.status==='missing')status.reasons.push(`Requested font not installed: ${doc.font.css}`);
    status.reasons.push('Mandatory agent/human visual review not yet completed');
    if(doc.meta.dataStatus==='illustrative')status.reasons.push('Illustrative sample data — not for public release');
    write(join(out,'release-status.json'),status);
    console.log(`\nArtifacts created at ${out}\nRelease status: NOT_READY (${status.reasons.join('; ')})`);
    if(!allowUnverified&&(hallmark.status!=='PASS'||!report.geometryPass))process.exitCode=2;
  }else if(command==='render'){
    const target=resolve(args[0]||'outputs/publication');
    run(process.env.EDITORIAL_PYTHON||'python',['python/render.py',join(target,'render-manifest.json')]);
  }else if(command==='export-pptx'){
    const target=resolve(args[0]||'outputs/publication');
    run(process.execPath,['src/export-pptx.cjs',target,join(target,'normalized.json')]);
  }else if(command==='review'){
    const target=resolve(args.shift()||'outputs/publication');
    const cycle=Number(valueFlag('--cycle','0'));
    const notesFile=valueFlag('--notes',null);
    if(!notesFile)throw new Error('--notes JSON file required');
    const note=recordReview(target,cycle,JSON.parse(readFileSync(resolve(notesFile),'utf8')));
    console.log(`Visual review ${note.cycle} recorded. Release not yet approved.`);
  }else if(command==='release'){
    const target=resolve(args.shift()||'outputs/publication');
    const file=valueFlag('--approval',null);
    if(!file)throw new Error('--approval JSON required');
    const result=release(target,JSON.parse(readFileSync(resolve(file),'utf8')));
    console.log(`Release status: ${result.state}${result.problems.length?' — '+result.problems.join('; '):''}`);
    if(result.state!=='READY')process.exitCode=2;
  }else throw new Error(`Unknown command ${command}`);
}catch(error){console.error(`Error: ${error.stack||error}`);process.exitCode=1;}
