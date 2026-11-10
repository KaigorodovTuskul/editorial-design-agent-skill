import {escapeHtml,field} from './utils.mjs';
export function chartSvg(spec,chartId){
  const values=spec.values.map(Number), max=Math.max(...values),min=Math.min(...values);
  const low=spec.zeroBaseline?Math.min(0,min):(min>=0?Math.max(0,min-(max-min)*0.14):min-(max-min)*0.1);
  const high=max+(max-low)*0.13||1;
  const w=1130,h=455, pad={l:25,r:28,t:28,b:25};
  const X=i=>pad.l+i*(w-pad.l-pad.r)/Math.max(1,values.length-1);
  const Y=n=>pad.t+(high-n)/(high-low)*(h-pad.t-pad.b);
  let parts=[];
  for(let k=0;k<5;k++){const y=pad.t+k*(h-pad.t-pad.b)/4;parts.push(`<path d="M ${pad.l} ${y.toFixed(2)} H ${w-pad.r}" class="grid-rule"/>`);}
  if(spec.type==='bars'){
    const spacing=(w-pad.l-pad.r)/values.length,bw=spacing*0.58;
    values.forEach((v,i)=>{const x=pad.l+i*spacing+spacing*0.21;const top=Y(v),bottom=Y(Math.max(0,low));parts.push(`<rect x="${x.toFixed(2)}" y="${Math.min(top,bottom).toFixed(2)}" width="${bw.toFixed(2)}" height="${Math.max(2,Math.abs(bottom-top)).toFixed(2)}" class="${i===values.length-1?'chart-bar-accent':'chart-bar'}"/>`);});
  }else{
    const points=values.map((v,i)=>`${X(i).toFixed(2)},${Y(v).toFixed(2)}`).join(' ');
    parts.push(`<polyline points="${points}" class="chart-line"/>`);
    values.forEach((v,i)=>parts.push(`<circle cx="${X(i).toFixed(2)}" cy="${Y(v).toFixed(2)}" r="${i===values.length-1?10:6}" class="${i===values.length-1?'chart-dot-accent':'chart-dot'}"/>`));
  }
  return `<div class="chart-body"><svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" role="img" aria-label="${escapeHtml(spec.description||'Financial chart')}" class="chart-svg">${parts.join('')}</svg><div class="chart-labels">${(spec.labels||values.map((_,i)=>String(i+1))).map((label,i)=>`<div class="chart-label">${field(label,'x-label')}</div>`).join('')}</div></div>`;
}
