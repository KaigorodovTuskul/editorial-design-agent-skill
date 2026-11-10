import {readJson,assert} from './utils.mjs';
import {fileURLToPath} from 'node:url';
const presets=readJson(fileURLToPath(new URL('../config/design-presets.json',import.meta.url)));
const slideTypes=new Set(['cover','thesis','metrics','chart','comparison','table','risk','closing','section']);
export function normalize(source,{unattended=false}={}){
  assert(source&&typeof source==='object'&&!Array.isArray(source),'Input must be an object');
  assert(source.meta&&typeof source.meta.title==='string'&&source.meta.title.trim(),'meta.title is required');
  assert(['illustrative','verified'].includes(source.meta.dataStatus),'meta.dataStatus must be illustrative or verified');
  if(source.meta.dataStatus==='verified'){
    assert(Array.isArray(source.meta.sources)&&source.meta.sources.length>0,'Verified publication requires meta.sources');
    assert(source.meta.approvedForRelease===true,'Verified publication requires meta.approvedForRelease=true after factual review');
  }
  assert(Array.isArray(source.slides)&&source.slides.length>0,'At least one slide required');
  assert(source.slides.length<=80,'Maximum 80 presentation slides per build');
  const design={...presets.defaults,...source.design};
  assert(presets.themes[design.theme],`Unknown design.theme: ${design.theme}`);
  assert(presets.fonts[design.font],`Unknown design.font: ${design.font}`);
  assert(['airy','balanced','dense'].includes(design.density),`Unknown design.density: ${design.density}`);
  if(!unattended&&!source.design?.approved){
    throw new Error('Design selection not approved. Ask user for theme/font, then set design.approved=true; or use --unattended and log defaults.');
  }
  const ids=new Set();
  for(const [i,s] of source.slides.entries()){
    assert(s&&slideTypes.has(s.kind),`slides[${i}].kind must be one of ${[...slideTypes].join(', ')}`);
    assert(s.id&&/^[a-z0-9_-]{2,48}$/.test(s.id),`slides[${i}].id must be stable slug`);
    assert(!ids.has(s.id),`Duplicate slide id ${s.id}`);ids.add(s.id);
    assert(typeof s.title==='string'&&s.title.trim(),`slides[${i}].title required`);
    if(s.kind==='metrics')assert(Array.isArray(s.metrics)&&s.metrics.length>=2&&s.metrics.length<=4,`Slide ${s.id} requires 2–4 metrics`);
    if(s.kind==='chart'){
      assert(s.chart&&['line','bars'].includes(s.chart.type),`Slide ${s.id}: unsupported chart`);
      assert(Array.isArray(s.chart.values)&&s.chart.values.length>=2&&s.chart.values.length<=16,`Slide ${s.id} chart values required (2–16)`);
      assert(s.chart.values.every(x=>Number.isFinite(Number(x))),`Slide ${s.id}: nonnumeric chart value`);
      assert(!s.chart.labels||s.chart.labels.length===s.chart.values.length,`Slide ${s.id}: chart labels mismatched`);
    }
    if(s.kind==='table')assert(Array.isArray(s.rows)&&s.rows.length<=9&&Array.isArray(s.columns)&&s.columns.length<=6,`Slide ${s.id} table must contain <=9 rows and <=6 columns`);
  }
  return { ...source, design, palette:presets.themes[design.theme], font:presets.fonts[design.font] };
}
export {presets};
