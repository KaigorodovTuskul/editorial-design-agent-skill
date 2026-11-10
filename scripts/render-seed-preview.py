#!/usr/bin/env python3
"""Render a visual inventory for original Crystal Cobalt SVG seeds in Chromium."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import base64, html
root=Path(__file__).resolve().parents[1]
folder=root/'seeds/crystal-cobalt'
def img(rel,style=''):
    p=folder/rel
    blob=base64.b64encode(p.read_bytes()).decode()
    return f'<img src="data:image/svg+xml;base64,{blob}" style="{style}" alt="{html.escape(rel)}">'
backgrounds=['atmospheric-dark','aurora-magenta','analytical-light','data-night','mixed-strategic']
objects=['optical-loop','faceted-glass','faceted-growth-arrow']
elements=['contour-field','orbital-arcs']
icons=['balance','treasury','growth','operations','risk','liquidity','client','digital']
parts=['''<!doctype html><html><head><style>
*{box-sizing:border-box}body{margin:0;background:#F2F5FB;font:16px Arial;color:#16233C;padding:32px}h1{font-size:32px;margin:4px 0 5px}p{color:#52627E;margin:0 0 24px}h2{font-size:20px;margin:28px 0 12px}.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}.tile{border-radius:11px;overflow:hidden;box-shadow:0 2px 12px #26417B19;background:white;border:1px solid #DFE6F2}.tile img{width:100%;height:205px;object-fit:cover;display:block}.lab{font-size:14px;font-weight:700;padding:10px 14px}.objects{display:flex;gap:16px}.object{background:linear-gradient(135deg,#0E192C,#0D2456);border-radius:12px;width:33.33%;height:235px;display:flex;flex-direction:column;align-items:center;justify-content:center}.object img{height:172px;max-width:92%}.object span{color:#fff;font-size:13px}.icons{display:flex;gap:8px}.ico{flex:1;text-align:center;background:#132743;padding:17px 4px;border-radius:10px;color:#D4E6FF;font-size:12px}.ico img{width:44px;height:44px;display:block;margin:0 auto 9px}
</style></head><body><h1>Crystal Cobalt Enterprise</h1><p>Original SVG seed library · reusable design assets, not extracted from the bank reference PDF</p><h2>Full-frame underlays</h2><div class="grid">''']
for n in backgrounds:parts.append(f'<div class="tile">{img("backgrounds/"+n+".svg")}<div class="lab">{n}</div></div>')
parts+=['</div><h2>Optical objects</h2><div class="objects">']
for n in objects:parts.append(f'<div class="object">{img("objects/"+n+".svg")}<span>{n}</span></div>')
parts+=['</div><h2>Semantic SVG pictograms</h2><div class="icons">']
for n in icons:parts.append(f'<div class="ico">{img("icons/"+n+".svg")}{n}</div>')
parts+=['</div></body></html>']
with sync_playwright() as p:
    b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
    page=b.new_page(viewport={'width':1550,'height':1180},device_scale_factor=1)
    page.set_content(''.join(parts));page.evaluate('document.fonts.ready')
    out=folder/'preview.png';page.screenshot(path=str(out),full_page=True)
    b.close()
print(out)
