import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,mkdirSync,writeFileSync,existsSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {listThemeSeeds,copySeedsToProject,copyThemeSeeds} from '../src/seeds.mjs';

test('Crystal Cobalt is registered with actual local vector assets',()=>{
 const s=listThemeSeeds('crystal-cobalt-enterprise');
 assert.equal(s.available,true);
 assert.ok(s.files.length>=18);
 for(const part of ['backgrounds/','objects/','elements/','icons/'])assert.ok(s.files.some(x=>x.startsWith(part)));
});

test('copying seeds into a project never changes the project design',()=>{
 const temp=mkdtempSync(join(tmpdir(),'editorial-seeds-'));
 try{
  writeFileSync(join(temp,'project.json'),JSON.stringify({design:{theme:'azure-iris-unified'}}));
  const result=copySeedsToProject('crystal-cobalt-enterprise',temp);
  assert.equal(result.available,true);
  assert.ok(existsSync(join(temp,'assets','seeds','crystal-cobalt','objects','optical-loop.svg')));
  assert.ok(result.count>=18);
  const again=copySeedsToProject('crystal-cobalt-enterprise',temp);
  assert.equal(again.count,0);
 }finally{rmSync(temp,{force:true,recursive:true})}
});
