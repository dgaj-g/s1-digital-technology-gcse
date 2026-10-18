#!/usr/bin/env python3
"""G10 privacy (DESIGN_SPEC 11), after as/gates/g10_demo_privacy.py.
1. No picture under content/img holds an email address, the dummy account's name, "c2ken", a real name or a title bar
   (OCR with tesseract; the words to refuse are in BAD below plus banned.txt).
2. No sample solution file is published: no .sln, .csproj, .exe, .dll, .pdb, .resx or .cs under s2-u5ca-guide except the
   git-ignored content/code/ truth files, and no "Sample Solution" zip.
python3 -I gates/g10_privacy.py [--control]   the control writes a picture showing a VS title bar with an email: must FAIL"""
import os, re, subprocess, sys, tempfile
G = os.path.dirname(os.path.abspath(__file__)); D = os.path.dirname(G)
BAD = [r'[\w.+-]+@[\w-]+\.[\w.]+', r'dschhouse', r'c2ken', r'dgartland', r'Gartland', r'\bMicrosoft Visual Studio\b', r'Sign in']
BAD += [re.escape(w.strip()) for w in open(os.path.join(G, 'banned.txt')) if w.strip()]
RX = re.compile('|'.join(BAD), re.I)
problems, pics = [], []
for root, ds, fs in os.walk(D):
    ds[:] = [d for d in ds if d not in ('.git', 'node_modules', '_ctl', '_out')]
    rel = os.path.relpath(root, D)
    for f in fs:
        ext = os.path.splitext(f)[1].lower()
        if ext in ('.sln', '.csproj', '.exe', '.dll', '.pdb', '.resx') or (ext == '.cs' and not rel.startswith(os.path.join('content', 'code'))):
            problems.append('sample file published: %s' % os.path.join(rel, f))
        if ext == '.zip' and 'sample' in f.lower(): problems.append('sample zip published: %s' % os.path.join(rel, f))
        if ext in ('.png', '.jpg', '.jpeg') and rel.startswith(os.path.join('content', 'img')): pics.append(os.path.join(root, f))
if '--control' in sys.argv:
    t = os.path.join(tempfile.mkdtemp(), 'ctl.png')   # PIL lives in the user site, which -I hides: draw it in a plain python3
    subprocess.run(['python3', '-c', "import sys\nfrom PIL import Image, ImageDraw, ImageFont\nim = Image.new('RGB', (900, 120), 'white')\n"
        "ImageDraw.Draw(im).text((20, 40), 'U5CA - Microsoft Visual Studio   pupil7@c2ken.net', fill='black', font=ImageFont.truetype('/System/Library/Fonts/Helvetica.ttc', 32))\nim.save(sys.argv[1])", t], check=True)
    pics.append(t)
for p in pics:
    txt = subprocess.run(['tesseract', p, '-', '--psm', '11'], capture_output=True, text=True).stdout
    m = RX.search(txt)
    if m: problems.append('%s shows "%s"' % (os.path.relpath(p, D), m.group(0)))
for p in problems[:20]: print('  ' + p)
print('G10 privacy: %s (%d pictures read, %d problems)%s' % ('FAIL' if problems else 'PASS', len(pics), len(problems), ' [control]' if '--control' in sys.argv else ''))
sys.exit(1 if problems else 0)
