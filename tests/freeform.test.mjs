import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,rmSync,readFileSync,readdirSync,writeFileSync,cpSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {prepareFreeform} from '../src/freeform.mjs';
const repo=new URL('../examples/editorial-reference/',import.meta.url);

test('freeform author pages copy without any fixed slide types or HTML layout conversion',()=>{
 const td=mkdtempSync(join(tmpdir(),'editorial-freeform-'));
 try{
   const {doc,htmlFiles}=prepareFreeform(repo.pathname,join(td,'output'));
   assert.equal(doc.sourceMode,'agent-authored-freeform');
   assert.equal(doc.slides.length,7);
   assert.equal(htmlFiles.length,7);
   assert.ok(readFileSync(htmlFiles[0],'utf8').includes('cover-orbit'));
   assert.ok(readFileSync(htmlFiles[5],'utf8').includes('bridge-item'));
 }finally{rmSync(td,{recursive:true,force:true});}
});

test('freeform rejects unapproved design decisions in interactive mode',()=>{
 const td=mkdtempSync(join(tmpdir(),'editorial-design-'));
 try{
   cpSync(repo.pathname,join(td,'source'),{recursive:true});
   const p=join(td,'source','project.json');const j=JSON.parse(readFileSync(p,'utf8'));j.design.approved=false;writeFileSync(p,JSON.stringify(j));
   assert.throws(()=>prepareFreeform(join(td,'source'),join(td,'out')),/Ask for palette\/font choice/);
   assert.equal(prepareFreeform(join(td,'source'),join(td,'out'),{unattended:true}).doc.design.theme,'arctic-editorial');
 }finally{rmSync(td,{recursive:true,force:true});}
});

test('freeform rejects embedded scripts and remote resources',()=>{
 const td=mkdtempSync(join(tmpdir(),'editorial-security-'));
 try{
   cpSync(repo.pathname,join(td,'source'),{recursive:true});
   const p=join(td,'source','slides',readdirSync(join(td,'source','slides'))[0]);
   writeFileSync(p,readFileSync(p,'utf8')+'<script>alert(1)</script>');
   assert.throws(()=>prepareFreeform(join(td,'source'),join(td,'out')),/static source only/);
 }finally{rmSync(td,{recursive:true,force:true});}
});

test('stale parity and review evidence is invalidated when rebuilding author source',()=>{
 const td=mkdtempSync(join(tmpdir(),'editorial-evidence-'));
 try{
   const out=join(td,'out');prepareFreeform(repo.pathname,out);
   writeFileSync(join(out,'qa-reviews.json'),'[]');writeFileSync(join(out,'publication-browser.pdf'),'stale');
   prepareFreeform(repo.pathname,out);
   assert.throws(()=>readFileSync(join(out,'qa-reviews.json')));
   assert.throws(()=>readFileSync(join(out,'publication-browser.pdf')));
 }finally{rmSync(td,{recursive:true,force:true});}
});
