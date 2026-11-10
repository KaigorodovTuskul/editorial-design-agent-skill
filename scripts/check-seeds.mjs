#!/usr/bin/env node
import {existsSync, readFileSync} from 'node:fs';
import {join} from 'node:path';
import {listThemeSeeds} from '../src/seeds.mjs';
const s=listThemeSeeds('crystal-cobalt-enterprise');
if(!s.available)throw new Error('Crystal Cobalt seeds not installed');
const categories=['backgrounds/','objects/','elements/','icons/'];
for(const c of categories){if(!s.files.some(x=>x.startsWith(c)))throw new Error('Missing seed category: '+c)}
let errors=[];
for(const file of s.files){
 const x=readFileSync(join(s.root,file),'utf8');
 if(!x.includes('<svg')||!x.includes('</svg>'))errors.push(`${file}: invalid svg shell`);
 if(/<script|<foreignObject|(?:href|src)=["'](?:https?:|\/\/)/i.test(x))errors.push(`${file}: external or executable content`);
 if(!x.includes('viewBox'))errors.push(`${file}: viewBox missing`);
}
for(const path of ['manifest.json','gradients.css','tokens.json','README.md']){
 if(!existsSync(join(s.root,path)))errors.push(`Root asset missing ${path}`);
}
if(errors.length){console.error(errors.join('\n'));process.exit(1);}
console.log(`OK — ${s.files.length} original seeded SVG files, 4 categories, no remote/executable content.`);
