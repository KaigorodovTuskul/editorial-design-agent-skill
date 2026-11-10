import test from 'node:test';import assert from 'node:assert/strict';
import {mkdtempSync,writeFileSync,readFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';import {join} from 'node:path';
import {recordReview,release} from '../src/release.mjs';
const write=(dir,name,data)=>writeFileSync(join(dir,name),JSON.stringify(data));
test('review cycles require evidence and sequential numbering',()=>{
 const dir=mkdtempSync(join(tmpdir(),'editorial-review-'));
 try{
  write(dir,'render-report.json',{slideCount:2});writeFileSync(join(dir,'contact-sheet.png'),'fake image content');
  write(dir,'release-status.json',{state:'NOT_READY',reasons:['Mandatory agent/human visual review not yet completed'],visualCyclesRequired:2});
  const review={reviewer:'Independent reviewer',summary:'Inspected both pages',inspectedSlides:[1,2],findings:[]};
  assert.throws(()=>recordReview(dir,2,review),/Expected review cycle/);
  assert.equal(recordReview(dir,1,review).cycle,1);
  assert.equal(recordReview(dir,2,review).cycle,2);
  assert.equal(JSON.parse(readFileSync(join(dir,'qa-reviews.json'),'utf8')).length,2);
 }finally{rmSync(dir,{recursive:true,force:true});}
});
test('release is NOT_READY when approvals or Hallmark are missing',()=>{
 const dir=mkdtempSync(join(tmpdir(),'editorial-release-'));
 try{
  write(dir,'normalized.json',{meta:{dataStatus:'illustrative',sources:[],approvedForRelease:false}});
  write(dir,'render-report.json',{font:{status:'missing'},findings:[]});
  write(dir,'hallmark-report.json',{status:'MISSING'});
  const status=release(dir,{approvedBy:'Reviewer',approvedAt:'2026-11-10',confirmedFacts:true,confirmedVisuals:true});
  assert.equal(status.state,'NOT_READY');assert.ok(status.problems.some(x=>x.includes('Hallmark')));
 }finally{rmSync(dir,{recursive:true,force:true});}
});
