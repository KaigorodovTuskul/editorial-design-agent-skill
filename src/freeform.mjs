/** Copy an agent-authored, unrestricted slide project. There are no fixed slide templates. */
import {readFileSync,writeFileSync,mkdirSync,readdirSync,copyFileSync,statSync,existsSync,rmSync} from 'node:fs';
import {basename,join,resolve,relative,extname} from 'node:path';
import {presets} from './validate.mjs';
import {assert} from './utils.mjs';

function copyTree(from,to){
  mkdirSync(to,{recursive:true});
  for(const item of readdirSync(from,{withFileTypes:true})){
    if(item.name.startsWith('.'))continue;
    if(item.isDirectory())copyTree(join(from,item.name),join(to,item.name));
    else if(item.isFile())copyFileSync(join(from,item.name),join(to,item.name));
  }
}
export function prepareFreeform(source,out,{unattended=false}={}){
  const root=resolve(source),dest=resolve(out);
  const sourceConfig=join(root,'project.json');
  assert(existsSync(sourceConfig),'Freeform project must have project.json');
  const raw=JSON.parse(readFileSync(sourceConfig,'utf8'));
  assert(typeof raw.meta?.title==='string'&&raw.meta.title.trim(),'project.json meta.title required');
  assert(['illustrative','verified'].includes(raw.meta?.dataStatus),'project.json meta.dataStatus required');
  const design={...presets.defaults,...raw.design};
  assert(presets.themes[design.theme],`Unknown theme ${design.theme}`);
  assert(presets.fonts[design.font],`Unknown font ${design.font}`);
  assert(unattended||design.approved===true,'Ask for palette/font choice first, then set design.approved=true, or run unattended');
  const slideDir=join(root,'slides');
  assert(existsSync(slideDir),'Freeform project requires slides/*.html');
  const files=readdirSync(slideDir).filter(x=>/^\d+[-_].+\.html$/i.test(x)).sort();
  assert(files.length>=1&&files.length<=80,'Provide 1–80 numbered HTML slides, e.g. 01-cover.html');
  for(const file of files){
    const html=readFileSync(join(slideDir,file),'utf8');
    assert(/<section\b[^>]*class=["'][^"']*\bslide\b/.test(html),`${file}: include <section class="slide">`);
    assert(/data-editable=["']true["']/.test(html),`${file}: mark at least one editable text item`);
    assert(!/<script\b/i.test(html),`${file}: static source only; render decorative SVG/CSS without runtime scripts`);
    assert(!/(?:src|href)\s*=\s*["'](?:https?:|data:text\/html)/i.test(html),`${file}: externally loaded content forbidden in offline/reproducible build`);
  }
  mkdirSync(dest,{recursive:true});
  // A changed source invalidates previously approved design/parity evidence.
  for(const stale of ['publication-browser.pdf','pptx-verify-report.json','qa-reviews.json',
                      'pptx-render','parity-diffs']){
    rmSync(join(dest,stale),{recursive:true,force:true});
  }
  copyTree(slideDir,join(dest,'slides'));
  if(existsSync(join(root,'assets')))copyTree(join(root,'assets'),join(dest,'assets'));
  // Copy source plan and build metadata for reproducibility.
  const doc={meta:raw.meta,design,palette:presets.themes[design.theme],font:presets.fonts[design.font],
    slides:files.map((name,index)=>({id:basename(name,'.html'),kind:'freeform',title:raw.pages?.[index]?.title||basename(name,'.html')})),
    sourceMode:'agent-authored-freeform',quality:raw.quality||{}};
  writeFileSync(join(dest,'normalized.json'),JSON.stringify(doc,null,2));
  const manifest={out:dest,htmlFiles:files.map(x=>join(dest,'slides',x)),
    slideIds:doc.slides.map(x=>x.id),fontFamily:doc.font.css,sourceMode:'agent-authored-freeform'};
  writeFileSync(join(dest,'render-manifest.json'),JSON.stringify(manifest,null,2));
  writeFileSync(join(dest,'source-project.json'),JSON.stringify(raw,null,2));
  const listing=doc.slides.map((s,i)=>`<a href="slides/${files[i]}"><span>${String(i+1).padStart(2,'0')}</span>${s.title}</a>`).join('');
  writeFileSync(join(dest,'index.html'),`<!doctype html><html lang="ru"><meta charset="UTF-8"><title>Editorial Preview</title><style>body{font-family:Arial;background:#eef1f6;max-width:1100px;margin:4rem auto}a{display:block;padding:1rem;border-bottom:1px solid #c7cdd6;color:#162840;text-decoration:none}span{margin-right:30px;color:#517699}</style><h1>${raw.meta.title.replace(/</g,'&lt;')}</h1>${listing}</html>`);
  return {doc,manifest,htmlFiles:manifest.htmlFiles};
}
