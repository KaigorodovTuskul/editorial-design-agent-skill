import test from 'node:test';
import assert from 'node:assert/strict';
import {critiqueVisualScore} from '../src/visual-system.mjs';
const slide=(i)=>({mode:['lighter','refined','darker'][i%3],role:'evidence',claim:'A supported claim',silhouette:`original-${i}`,graphicFamily:`family-${i}`,reason:'Connects the evidence to hierarchy',effectSignature:`effect-${i}`,icons:[]});
test('varied visual score has no findings',()=>{
 assert.equal(critiqueVisualScore({pages:Array.from({length:7},(_,i)=>slide(i))}).length,0);
});
test('repeated visual language is detectable but warnings are advisory',()=>{
 const pages=Array.from({length:7},(_,i)=>({...slide(i),silhouette:'copy',graphicFamily:'ribbon',effectSignature:'same'}));
 const findings=critiqueVisualScore({pages});
 assert.ok(findings.some(x=>x.code==='LOW_VARIETY'));
 assert.ok(findings.some(x=>x.code==='REPEATED_EFFECT'));
 assert.ok(findings.every(x=>x.severity!=='error'));
});
test('missing fields and incorrect mode trigger errors',()=>{
 const findings=critiqueVisualScore({pages:[{mode:'random',role:'section'}]});
 assert.ok(findings.some(x=>x.code==='MODE'));
 assert.ok(findings.some(x=>x.severity==='error'));
});

test('Crystal Cobalt supports four distinct tonal modes and rejects Azure-only modes',()=>{
 const modes=['atmospheric-dark','analytical-light','data-night','mixed-strategic'];
 const pages=modes.map((mode,i)=>({...slide(i),mode}));
 assert.equal(critiqueVisualScore({theme:'crystal-cobalt-enterprise',pages}).filter(x=>x.severity==='error').length,0);
 assert.ok(critiqueVisualScore({theme:'crystal-cobalt-enterprise',pages:[{...slide(0),mode:'lighter'}]}).some(x=>x.code==='MODE'));
});
