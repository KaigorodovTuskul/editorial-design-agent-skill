import {readFileSync, existsSync, mkdirSync} from 'node:fs';
import {join,resolve} from 'node:path';
import {spawnSync} from 'node:child_process';
const root=resolve(import.meta.dirname,'..');
const dep=JSON.parse(readFileSync(join(root,'config/dependencies.json'),'utf8')).hallmark;
const folder=join(root,'vendor/hallmark');
const run=(cmd,args,cwd=root)=>{const x=spawnSync(cmd,args,{cwd,stdio:'inherit'});if(x.status!==0)throw new Error(`Command failed: ${cmd} ${args.join(' ')}`);};
if(!existsSync(join(folder,'.git'))){mkdirSync(join(root,'vendor'),{recursive:true});run('git',['clone','--filter=blob:none',dep.repository,folder]);}
run('git',['fetch','origin',dep.commit],folder);
run('git',['checkout','--detach',dep.commit],folder);
console.log(`Hallmark installed at ${dep.commit}`);
