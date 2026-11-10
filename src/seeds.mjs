/** Original, local-only, reusable visual seed assets. No untrusted remote fetches. */
import {readFileSync,existsSync,cpSync,mkdirSync,readdirSync,statSync,copyFileSync} from 'node:fs';
import {resolve,join,relative,sep} from 'node:path';
import {presets} from './validate.mjs';
const root=resolve(import.meta.dirname,'..');
export function themeSeedRoot(theme){
  const preset=presets.themes[theme];
  if(!preset)throw new Error(`Unknown theme: ${theme}`);
  const seedPath=preset.seedPath;
  if(!seedPath)return null;
  const path=resolve(root,seedPath);
  if(!path.startsWith(root+sep))throw new Error('Unsafe theme seedPath');
  if(!existsSync(join(path,'manifest.json')))throw new Error(`Seed manifest missing: ${path}`);
  return path;
}
export function listThemeSeeds(theme){
  const from=themeSeedRoot(theme);
  if(!from)return {theme,available:false,files:[]};
  const manifest=JSON.parse(readFileSync(join(from,'manifest.json'),'utf8'));
  for(const item of manifest.files){
    if(!/^[\w/-]+\.svg$/.test(item.path)||item.path.includes('..'))throw new Error('Unsafe seed path: '+item.path);
    if(!existsSync(join(from,item.path)))throw new Error('Missing source asset: '+item.path);
  }
  return {theme,available:true,root:from,manifest,files:manifest.files.map(f=>f.path)};
}
function copySeedTree(from,to,{overwrite=false}={}){
  mkdirSync(to,{recursive:true});
  let count=0;
  for(const item of readdirSync(from,{withFileTypes:true})){
    const src=join(from,item.name),dest=join(to,item.name);
    if(item.isSymbolicLink())throw new Error('Symlinks are not permitted in seeds');
    if(item.isDirectory())count+=copySeedTree(src,dest,{overwrite});
    if(item.isFile()&&(!existsSync(dest)||overwrite)){copyFileSync(src,dest);count++;}
  }
  return count;
}
export function copyThemeSeeds(theme,outputAssets,{overwrite=false}={}){
  const source=themeSeedRoot(theme);
  if(!source)return {available:false,count:0};
  listThemeSeeds(theme);
  const folder=join(outputAssets,'seeds',theme==='crystal-cobalt-enterprise'?'crystal-cobalt':theme);
  const count=copySeedTree(source,folder,{overwrite});
  return {available:true,folder,count};
}
export function copySeedsToProject(theme,projectRoot){
  const project=resolve(projectRoot);
  if(!existsSync(join(project,'project.json')))throw new Error('Expected project.json inside the project; refusing to modify an unrelated folder');
  return copyThemeSeeds(theme,join(project,'assets'));
}
