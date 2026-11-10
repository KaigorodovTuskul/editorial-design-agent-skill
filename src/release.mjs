import {createHash} from 'node:crypto';
import {readFileSync,writeFileSync,existsSync} from 'node:fs';
import {join} from 'node:path';
import {assert,readJson} from './utils.mjs';
const read=(out,p)=>readJson(join(out,p));
const save=(out,p,v)=>writeFileSync(join(out,p),JSON.stringify(v,null,2));
const digest=(p)=>createHash('sha256').update(readFileSync(p)).digest('hex');
export function recordReview(out,cycle,notes){
  assert(Number.isInteger(cycle)&&cycle>=1&&cycle<=3,'Visual review cycle must be 1, 2, or 3');
  assert(typeof notes.reviewer==='string'&&notes.reviewer.trim(),'Reviewer identity required');
  assert(typeof notes.summary==='string'&&notes.summary.trim(),'Visual review summary required');
  assert(Array.isArray(notes.inspectedSlides)&&notes.inspectedSlides.length>0,'List inspected slides');
  assert(Array.isArray(notes.findings),'Include findings array (can be empty)');
  const prior=existsSync(join(out,'qa-reviews.json'))?read(out,'qa-reviews.json'):[];
  assert(prior.length===cycle-1,`Expected review cycle ${prior.length+1} next`);
  const report=read(out,'render-report.json');
  assert(notes.inspectedSlides.every(n=>Number.isInteger(n)&&n>0&&n<=report.slideCount),'Invalid inspected slide number');
  const entry={cycle,reviewer:notes.reviewer,summary:notes.summary,
    inspectedSlides:notes.inspectedSlides,findings:notes.findings,
    contactSheetSha256:digest(join(out,'contact-sheet.png')),
    evidence:'contact-sheet.png',reviewedAt:new Date().toISOString()};
  prior.push(entry);save(out,'qa-reviews.json',prior);
  const status=read(out,'release-status.json');
  status.visualCyclesCompleted=prior.length;
  status.reasons=status.reasons.filter(x=>!x.includes('visual review not yet completed'));
  if(prior.length<2)status.reasons.push(`Visual review cycles incomplete: ${prior.length}/2`);
  else status.reasons.push('Visual reviews recorded; release signoff still required');
  save(out,'release-status.json',status);
  return entry;
}
export function release(out,approval){
  const problems=[];
  const doc=read(out,'normalized.json');
  const report=read(out,'render-report.json');
  const hallmark=read(out,'hallmark-report.json');
  const reviews=existsSync(join(out,'qa-reviews.json'))?read(out,'qa-reviews.json'):[];
  const pptx=existsSync(join(out,'pptx-verify-report.json'))?read(out,'pptx-verify-report.json'):null;
  if(doc.meta.dataStatus!=='verified'||doc.meta.approvedForRelease!==true)problems.push('Content not source-verified and approved');
  if(!Array.isArray(doc.meta.sources)||doc.meta.sources.length<1)problems.push('Missing factual sources');
  if(hallmark.status!=='PASS')problems.push(`Hallmark status: ${hallmark.status}`);
  if(report.font.status!=='pass')problems.push('Selected font not confirmed as installed');
  if(report.findings.some(f=>['P0','P1'].includes(f.severity)))problems.push('Unresolved serious geometry or font issues');
  if(reviews.length<2)problems.push('Fewer than two actual visual review cycles recorded');
  if(reviews.length>=2&&reviews.at(-1).findings.some(x=>['P0','P1'].includes(x.severity)))problems.push('Critical or major visual defects remain in last review');
  if(!pptx||!pptx.has_editable_text||!pptx.background_per_slide)problems.push('PPTX shape verification missing/failed');
  if(!pptx||pptx.visual_parity!=='PASS'||pptx.release_grade!==true||pptx.paired_pdf!==true)problems.push('PPTX-to-PDF visual parity not passed in target renderer');
  if(!existsSync(join(out,'publication.pdf'))||!existsSync(join(out,'publication-editable.pptx')))problems.push('Deliverables missing');
  if(!approval||typeof approval.approvedBy!=='string'||!approval.approvedBy.trim()||typeof approval.approvedAt!=='string'||!approval.approvedAt||approval.confirmedFacts!==true||approval.confirmedVisuals!==true)problems.push('Named human content/visual approval required');
  const result={state:problems.length?'NOT_READY':'READY',createdAt:new Date().toISOString(),problems,
    visualCyclesCompleted:reviews.length,approvedBy:problems.length?null:approval.approvedBy};
  save(out,'release-status.json',result);
  return result;
}
