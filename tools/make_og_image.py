# 生成 og-image.png（1200x630 社交分享卡片），风格与网站一致：深色 navy + 荧光绿 + 代码窗口
# 只在需要重新生成时手动运行：python tools/make_og_image.py
from PIL import Image, ImageDraw, ImageFont

W, H = 1200, 630
BG = (10, 25, 47)        # #0a192f
NAVY = (17, 34, 64)      # #112240
BORDER = (35, 53, 84)    # #233554
GREEN = (100, 255, 218)  # #64ffda
WHITE = (230, 241, 255)  # #e6f1ff
SLATE = (136, 146, 176)  # #8892b0

img = Image.new("RGB", (W, H), BG)
d = ImageDraw.Draw(img)

# 右上角淡绿光晕：叠加一层大的半透明圆
glow = Image.new("L", (W, H), 0)
gd = ImageDraw.Draw(glow)
gd.ellipse([650, -300, 1400, 380], fill=14)
green_layer = Image.new("RGB", (W, H), GREEN)
img.paste(green_layer, (0, 0), glow)

mono = "C:/Windows/Fonts/consola.ttf"
mono_b = "C:/Windows/Fonts/consolab.ttf"
yahei = "C:/Windows/Fonts/msyh.ttc"
yahei_b = "C:/Windows/Fonts/msyhbd.ttc"

# 代码窗口
wx, wy, ww, wh = 620, 150, 500, 330
d.rounded_rectangle([wx, wy, wx + ww, wy + wh], radius=12, fill=NAVY, outline=BORDER, width=2)
# 标题栏三个圆点
for i, c in enumerate([(255, 95, 86), (255, 189, 46), (39, 201, 63)]):
    d.ellipse([wx + 22 + i * 26, wy + 18, wx + 36 + i * 26, wy + 32], fill=c)
d.text((wx + ww - 22, wy + 14), "liuli@github: ~", font=ImageFont.truetype(mono, 16), fill=SLATE, anchor="ra")

f_prompt = ImageFont.truetype(mono_b, 19)
f_body = ImageFont.truetype(mono, 19)
# 中文没有等宽字形，含中文的片段用雅黑，尺寸与英文行对齐
f_body_cn = ImageFont.truetype(yahei, 18)
f_key = ImageFont.truetype(yahei_b, 17)
lines = [
    [("$ ", "prompt"), ("whoami", "body")],
    [("琉璃 — 大学生 · 比赛选手", "key_cn")],
    [("$ ", "prompt"), ("cat interests.json", "body")],
    [("{", "body")],
    [('  "爬虫": ', "key"), ('"抓取 · 清洗 · 入库",', "body_cn")],
    [('  "可视化": ', "key"), ('"把数据画出来"', "body_cn")],
    [("}", "body")],
]
y = wy + 58
for parts in lines:
    x = wx + 26
    for text, kind in parts:
        color = {"prompt": GREEN, "key": WHITE, "key_cn": WHITE, "body": (168, 178, 209), "body_cn": (168, 178, 209)}[kind]
        font = {"prompt": f_prompt, "key": f_key, "key_cn": f_key, "body": f_body, "body_cn": f_body_cn}[kind]
        d.text((x, y), text, font=font, fill=color)
        x += d.textlength(text, font=font)
    y += 34

# 左侧文字
d.text((90, 170), "你好，我是", font=ImageFont.truetype(yahei, 30), fill=GREEN)
d.text((84, 220), "琉璃", font=ImageFont.truetype(yahei_b, 96), fill=WHITE)
d.text((90, 352), "大学生 · 比赛选手 · 爬虫与可视化玩家", font=ImageFont.truetype(yahei, 24), fill=SLATE)
d.text((90, 415), "把想法做成能用的东西：", font=ImageFont.truetype(yahei, 26), fill=SLATE)
d.text((90, 458), "爬虫 · 数据可视化 · 开源小工具", font=ImageFont.truetype(yahei, 26), fill=SLATE)

# 底部网址
d.text((90, 552), "liuli-meng.github.io", font=ImageFont.truetype(mono, 24), fill=GREEN)

img.save("og-image.png", optimize=True)
print("og-image.png generated:", img.size)
