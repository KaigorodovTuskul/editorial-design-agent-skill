/** A low-cost advisory art-direction checker, not a constrained template engine. */
export const MODES = new Set(['lighter','refined','darker']);
export const MODES_BY_THEME = {
 'crystal-cobalt-enterprise':new Set(['atmospheric-dark','analytical-light','data-night','mixed-strategic']),
 'azure-iris-unified':MODES,
};
const compact = v => String(v || '').trim();

/** Returns advisory findings; no generative model, no fabricated facts. */
export function critiqueVisualScore(score,theme=score?.theme || 'azure-iris-unified') {
  const allowed=MODES_BY_THEME[theme] || MODES;
  const pages = Array.isArray(score?.pages) ? score.pages : [];
  const findings = [];
  if (pages.length === 0) return [{severity:'error',code:'EMPTY_SCORE',message:'Visual score has no pages.'}];
  const seen = new Map();
  for (let i = 0; i < pages.length; i++) {
    const p = pages[i];
    if (!allowed.has(p.mode)) findings.push({severity:'error',page:i+1,code:'MODE',message:`Choose one of ${[...allowed].join(', ')} for ${theme}.`});
    for (const field of ['role','claim','silhouette','graphicFamily','reason']) {
      if (!compact(p[field])) findings.push({severity:'error',page:i+1,code:'MISSING_'+field.toUpperCase(),message:`Missing ${field}`});
    }
    const visual = compact(p.graphicFamily).toLowerCase();
    const sil = compact(p.silhouette).toLowerCase();
    if (!visual || !sil) continue;
    const key = `${visual}/${sil}`;
    seen.set(key,(seen.get(key)||0)+1);
    if (i && key === `${compact(pages[i-1]?.graphicFamily).toLowerCase()}/${compact(pages[i-1]?.silhouette).toLowerCase()}`) {
      findings.push({severity:'warning',page:i+1,code:'ADJACENT_REPETITION',message:'Two consecutive pages repeat identical art direction; defend or redesign.'});
    }
    if (i && compact(p.effectSignature) && compact(p.effectSignature)===compact(pages[i-1]?.effectSignature)) {
      findings.push({severity:'warning',page:i+1,code:'REPEATED_EFFECT',message:'Consecutive pages reuse the same effect signature.'});
    }
    if (Array.isArray(p.icons) && p.icons.length > 4) {
      findings.push({severity:'warning',page:i+1,code:'ICON_OVERUSE',message:'Too many symbolic icons; check they convey real content.'});
    }
    if (p.graphicFamily==='gradient-only' && !p.reason?.toLowerCase().includes('meaning')) {
      findings.push({severity:'note',page:i+1,code:'DECORATIVE_ONLY',message:'Gradient cannot be the whole design concept; inspect the story-first composition.'});
    }
  }
  const distinctSilhouettes = new Set(pages.map(x=>compact(x.silhouette).toLowerCase()).filter(Boolean)).size;
  if (pages.length >= 7 && distinctSilhouettes < Math.min(5, Math.ceil(pages.length * .55))) {
    findings.push({severity:'warning',code:'LOW_VARIETY',message:`Only ${distinctSilhouettes} distinct silhouettes in ${pages.length} pages; art-direct more distinct scenes.`});
  }
  if (pages.length >= 6 && new Set(pages.map(x=>x.mode)).size === 1) {
    findings.push({severity:'note',code:'TONAL_MONOTONY',message:'All pages use the same color mode; check for deliberate visual pacing.'});
  }
  return findings;
}
