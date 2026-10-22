"""Refresh the bundled UI font after changing copy (requires fonttools[woff])."""
from pathlib import Path
from fontTools import subset

root = Path(__file__).resolve().parents[1]
source = root / 'node_modules/@fontsource/lxgw-wenkai/files/lxgw-wenkai-latin-500-normal.woff2'
text = ''.join(p.read_text() for p in (root / 'src').glob('*') if p.suffix in ('.js', '.css'))
text += (root / 'index.html').read_text()
text += ''.join(chr(i) for i in range(32, 127))
options = subset.Options()
options.flavor = 'woff2'
font = subset.load_font(str(source), options)
subsetter = subset.Subsetter(options=options)
subsetter.populate(text=text)
subsetter.subset(font)
subset.save_font(font, str(root / 'public/fonts/twilight-wenkai.woff2'), options)
