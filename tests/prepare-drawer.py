"""Retouch the key with adjacent drawer wood; keep camera and lighting fixed."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter

assets = Path(__file__).resolve().parents[1] / 'game' / 'assets'
image = Image.open(assets / 'sewing-drawer-key-v1.png').convert('RGB')
# The source patch is bare wood directly below the key, before the drawer lip.
box = (840, 310, 1095, 430)
patch = image.crop((840, 425, 1095, 545))
mask = Image.new('L', patch.size)
ImageDraw.Draw(mask).rounded_rectangle((8, 8, 247, 112), radius=24, fill=255)
mask = mask.filter(ImageFilter.GaussianBlur(7))
image.paste(patch, box[:2], mask)
image.save(assets / 'sewing-drawer-empty-v1.webp', quality=94)
