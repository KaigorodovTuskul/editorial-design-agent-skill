import {readFileSync} from 'node:fs';
export const escapeHtml=(value)=>String(value??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
export const readJson=(p)=>JSON.parse(readFileSync(p,'utf8'));
export function assert(condition,message){if(!condition)throw new Error(message);}
export function field(value,classes='',extra=''){
  const text=escapeHtml(value).replace(/\n/g,'<br>');
  return `<span data-editable="true" class="editable ${classes}" ${extra}>${text}</span>`;
}
export function clamp(n,min,max){return Math.max(min,Math.min(max,n));}
export function rgbaToHex(v){const parts=String(v).match(/[\d.]+/g)||[];return parts.slice(0,3).map(x=>Math.round(Number(x)).toString(16).padStart(2,'0')).join('').toUpperCase()||'192F50';}
