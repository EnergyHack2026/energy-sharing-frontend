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
    return 'data:image/png;base64,' + base64.b64encode(b).decode()

logos = {p: data_uri(p) for p in ('assets/zse.png', 'assets/vse.png')}
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
