#!/usr/bin/env node
import {readFileSync} from 'node:fs';
import {critiqueVisualScore} from '../src/visual-system.mjs';
const file=process.argv[2];
if(!file){console.error('Usage: node scripts/check-visual-plan.mjs <visual-plan.json>');process.exit(2);}
try{
  const findings=critiqueVisualScore(JSON.parse(readFileSync(file,'utf8')));
  console.log(JSON.stringify({file,findings,counts:{errors:findings.filter(x=>x.severity==='error').length,warnings:findings.filter(x=>x.severity==='warning').length}},null,2));
  if(findings.some(x=>x.severity==='error')) process.exitCode=2;
}catch(e){console.error(e.message);process.exitCode=2;}
