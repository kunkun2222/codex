"""Remove the baked-in flashlight using adjacent tabletop texture."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter

assets = Path(__file__).resolve().parents[1] / 'game' / 'assets'
for lighting in ('on', 'off'):
    image = Image.open(assets / f'living-room-v3-{lighting}.png').convert('RGB')
    box = (1080, 750, 1325, 858)
    patch = image.crop((970, 750, 1080, 858)).resize((245, 108), Image.Resampling.BICUBIC)
    mask = Image.new('L', patch.size)
    ImageDraw.Draw(mask).rounded_rectangle((8, 7, 237, 100), radius=16, fill=255)
    mask = mask.filter(ImageFilter.GaussianBlur(5))
    image.paste(patch, box[:2], mask)
    image.save(assets / f'living-room-v3-{lighting}-no-flashlight.webp', quality=94)
