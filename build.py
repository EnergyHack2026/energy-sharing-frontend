#!/usr/bin/env python3
"""Zloží jeden samostatný súbor zdielna.html z rozdelených css/ a js/ súborov.

Zdroj ostáva rozdelený (index.html + css/ + js/ + assets/). Tento súbor sa dá
otvoriť aj samostatne – napr. priamo zo zipu alebo poslať e-mailom.
Spustenie:  python3 build.py
"""
import base64, os, re

root = os.path.dirname(os.path.abspath(__file__))
read = lambda p: open(os.path.join(root, p), encoding='utf-8').read()

def data_uri(path):
    b = open(os.path.join(root, path), 'rb').read()
    mime = 'image/jpeg' if path.endswith('.jpg') else 'image/svg+xml' if path.endswith('.svg') else 'image/png'
    return 'data:' + mime + ';base64,' + base64.b64encode(b).decode()

logos = {p: data_uri(p) for p in ('assets/zse.png', 'assets/vse.png', 'assets/hero-bg.jpg', 'assets/zse-logo.svg', 'assets/vse-logo.png', 'assets/iwattik.png', 'assets/iwatt-banner.png', 'assets/partner-kaviaren.jpg', 'assets/partner-pekaren.jpg', 'assets/partner-kvetinarstvo.jpg', 'assets/partner-bistro.jpg', 'assets/shop-virtualna-bateria.jpg', 'assets/shop-wallbox.jpg', 'assets/shop-tepelne-cerpadlo.jpg', 'assets/shop-fotovoltika.jpg')}
# hra Slnečný deň → js/game-data.js (base64; otvára sa v iframe cez srcdoc, funguje aj zo samostatného súboru)
game = os.path.join(root, 'game', 'slnecny-den.html')
if os.path.exists(game):
    data = base64.b64encode(open(game, 'rb').read()).decode()
    open(os.path.join(root, 'js', 'game-data.js'), 'w', encoding='utf-8', newline='\n').write(
        "'use strict';\n/* generované z game/slnecny-den.html cez build.py – needitovať ručne */\nconst GAME_B64='" + data + "';\n")
html = read('index.html')

# CSS: <link rel="stylesheet" href="css/x.css"> → <style>…</style>
html = re.sub(r'<link rel="stylesheet" href="(css/[^"]+)">',
              lambda m: '<style>\n' + read(m.group(1)) + '\n</style>', html)
# JS: <script src="js/x.js"></script> → <script>…</script>
def inline_js(m):
    code = read(m.group(1))
    assert '</script' not in code.lower(), m.group(1)
    return '<script>\n/* ' + m.group(1) + ' */\n' + code + '\n</script>'
html = re.sub(r'<script src="(js/[^"]+)"></script>', inline_js, html)
# PWA (manifest, service worker) iba v rozdelenej verzii – samostatný súbor ich nepotrebuje
html = re.sub(r'<link rel="(manifest|apple-touch-icon)"[^>]*>\n?', '', html)
html = html.replace('<script>\n/* js/core.js */', '<script>window.__STANDALONE=true</script>\n<script>\n/* js/core.js */', 1)
# logá (v core.js aj v <link rel=icon>)
for p, uri in logos.items():
    html = html.replace(p, uri)
html = html.replace('otvorte <code>index.html</code> z rozbaleného priečinka (nie priamo zo zipu) – alebo otvorte samostatný súbor <code>zdielna.html</code>, ktorý funguje aj sám.',
                    'skúste stránku obnoviť alebo otvoriť v inom prehliadači (Chrome, Edge, Firefox, Safari).')

open(os.path.join(root, 'zdielna.html'), 'w', encoding='utf-8').write(html)
print('zdielna.html', round(len(html) / 1024), 'kB')
