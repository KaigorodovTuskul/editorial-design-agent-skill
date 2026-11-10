import {existsSync,readFileSync,writeFileSync} from 'node:fs';
import {resolve,join} from 'node:path';
import {spawnSync} from 'node:child_process';
const root=resolve(import.meta.dirname,'..');
export function checkHallmark(out,htmlPaths){
  const config=JSON.parse(readFileSync(join(root,'config/dependencies.json'),'utf8')).hallmark;
  const script=join(root,config.executable);
  const result={dependency:'Nutlope/hallmark',commit:config.commit,required:true,installed:existsSync(script),
    status:'NOT_RUN',exitCode:null,details:'',scope:'editorial-publication',warnings:[]};
  if(!result.installed){result.status='MISSING';result.details='Run npm run setup:hallmark. No production release is allowed without Hallmark.';}
  else {
    const proc=spawnSync(process.execPath,[script,...htmlPaths,'--genre','editorial','--render','--json'],{encoding:'utf8',maxBuffer:12*1024*1024,timeout:240000});
    result.exitCode=proc.status;
    result.details=((proc.stdout||'')+'\n'+(proc.stderr||'')).slice(0,65000);
    result.status=proc.status===0?'PASS':proc.error?'ERROR':'FINDINGS';
    if(proc.error)result.warnings.push(String(proc.error));
  }
  writeFileSync(join(out,'hallmark-report.json'),JSON.stringify(result,null,2));
  return result;
}
