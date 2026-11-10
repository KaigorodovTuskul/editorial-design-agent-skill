#!/usr/bin/env node
/** Hybrid PPTX exporter: one raster artwork layer + true editable native text.
 * The agent must author single-line editable DOM nodes for highest fidelity.
 * No baked/duplicate text in artwork; no fake parity guarantee.
 */
const fs=require('node:fs');
const path=require('node:path');
const pptxgen=require('pptxgenjs');
const W=13.333333333,H=7.5,PX_TO_IN=W/1920,PX_TO_PT=72*PX_TO_IN;
function color(value){
  const v=String(value||'');
  if(v[0]==='#')return v.slice(1,7).toUpperCase();
  const m=v.match(/rgba?\(([^)]+)\)/i);
  if(m){const x=m[1].split(',').map(z=>parseFloat(z));return x.slice(0,3).map(z=>Math.max(0,Math.min(255,Math.round(z))).toString(16).padStart(2,'0')).join('').toUpperCase();}
  return '192F50';
}
function fontName(css, fallback='Arimo'){
  if(!css)return fallback;
  const head=css.split(',')[0].trim().replace(/^["']|["']$/g,'');
  return head||fallback;
}
function pptxShape(field,doc){
  const b=field.box,s=field.style;
  const pt=parseFloat(s.fontSize)*PX_TO_PT;
  if(!Number.isFinite(pt)||pt<1)return null;
  const fw=Number(s.fontWeight);
  const originalW=b.w*PX_TO_IN;
  const extendedW=Math.min(W-b.x*PX_TO_IN+0.01,Math.max(b.w*1.58,b.w+130)*PX_TO_IN);
  const anchoring=s.textAlign==='right'?-1:s.textAlign==='center'?-0.5:0;
  const leftX=Math.max(0,b.x*PX_TO_IN+(extendedW-originalW)*anchoring);
  const lines=(field.text.match(/\n/g)||[]).length+1;
  return {
    // Native Office text is often wider than Chromium even for the same font.
    // The box is deliberately enlarged to preserve a single visual line; the font is not shrunk.
    x:leftX,y:b.y*PX_TO_IN,w:extendedW,h:Math.max(b.h,parseFloat(s.fontSize)*1.50)*PX_TO_IN,
    fontFace:s.resolvedFont||fontName(s.fontFamily,doc.font?.pptx||'Arimo'),fontSize:pt,
    bold:fw>=600,color:color(s.color),breakLine:false,
    margin:0,valign:'top',align:['left','center','right','justify'].includes(s.textAlign)?s.textAlign:'left',
    // Intentionally no fit/shrink/autofit. Dynamic text shrinking changes layout and is forbidden.
    rotate:0,transparency:0,
    ...(s.fontStyle==='italic'?{italic:true}:{}),
    ...(s.letterSpacing&&s.letterSpacing!=='normal'&&Number.isFinite(parseFloat(s.letterSpacing))?{charSpacing:parseFloat(s.letterSpacing)*PX_TO_PT}:{}),
    ...(lines>1?{lineSpacingMultiple:1.0}:{}),
  };
}
async function exportPptx(out,doc){
  const report=JSON.parse(fs.readFileSync(path.join(out,'render-report.json'),'utf8'));
  const pptx=new pptxgen();
  pptx.defineLayout({name:'EDITORIAL_WIDE',width:W,height:H});pptx.layout='EDITORIAL_WIDE';
  pptx.author='Editorial Design Engine';pptx.subject='Hybrid editable presentation';pptx.title=doc.meta.title;
  pptx.lang=doc.meta.language||'ru';pptx.company=doc.meta.publisher||'';
  let total=0,editableFonts=new Set(),multiline=0;
  const problems=[];
  for(const entry of report.slides){
    const slide=pptx.addSlide();
    const bg=path.join(out,entry.background);
    if(!fs.existsSync(bg))throw new Error(`Missing background ${bg}`);
    slide.addImage({path:bg,x:0,y:0,w:W,h:H});
    for(const field of entry.fields){
      if(!field.text||field.box.w<=0||field.box.h<=0)continue;
      const shape=pptxShape(field,doc);
      if(!shape){problems.push({slide:entry.index,text:field.text,reason:'Invalid font size'});continue;}
      if(field.text.includes('\n')){multiline++;problems.push({slide:entry.index,text:field.text.slice(0,55),reason:'Multi-line field may reflow differently in PPTX'});}
      editableFonts.add(shape.fontFace);
      slide.addText(field.text,shape);
      total++;
    }
  }
  await pptx.writeFile({fileName:path.join(out,'publication-editable.pptx')});
  const result={mode:'raster-background-plus-editable-text',slides:report.slideCount,editableFields:total,
    fontFamilies:[...editableFonts],multilineFields:multiline,issues:problems,editableText:true,editableCharts:false,
    parity:'UNVERIFIED',notes:['No text is baked into the background where data-editable=true.',
      'Visual parity must be confirmed by reopening the PPTX with a target renderer.',
      'Recipient PowerPoint must have the same fonts; changed values do not update raster charts.']};
  fs.writeFileSync(path.join(out,'pptx-export-report.json'),JSON.stringify(result,null,2));
  console.log(`Hybrid PPTX: ${report.slideCount} slides, ${total} native text shapes, ${multiline} multiline warnings`);
}
if(require.main===module){
  const [out,json]=process.argv.slice(2);
  if(!out||!json){console.error('Usage: node export-pptx.cjs <output> <normalized-json>');process.exit(2);}
  exportPptx(path.resolve(out),JSON.parse(fs.readFileSync(json,'utf8'))).catch(e=>{console.error(e.stack||e);process.exit(1)});
}
module.exports={exportPptx,color,fontName,pptxShape};
