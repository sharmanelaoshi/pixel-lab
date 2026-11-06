#!/usr/bin/env python3
"""Build the single-file game: inlines fonts (base64) and JS into golden-spoon.html."""
import base64, pathlib
root = pathlib.Path(__file__).parent
shell = (root / 'src/shell.html').read_text(encoding='utf-8')
js = (root / 'src/art.js').read_text(encoding='utf-8') + '\n' + (root / 'src/game.js').read_text(encoding='utf-8')
b64 = lambda p: base64.b64encode((root / p).read_bytes()).decode('ascii')
out = (shell.replace('@@FONT_PP@@', b64('fonts/pp.woff2'))
            .replace('@@FONT_PF@@', b64('fonts/pf.woff2'))
            .replace('@@JS@@', js))
assert 'boring' not in out.lower(), 'forbidden word found'
(root / 'golden-spoon.html').write_text(out, encoding='utf-8')
print('built golden-spoon.html', len(out) // 1024, 'KB')
