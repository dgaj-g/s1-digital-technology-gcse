#!/usr/bin/env python3
"""G-READ readback packets (SPEC 7a.8). Builds readback/<round>/<A|B>/ with the pupil-visible text of every screen of ch00 and ch07
(no goal sentences) and asks the cold reader to say each screen back. The hidden goals go to readback/<round>/GOALS.tsv, outside A and B."""
import json, os, re, sys
HERE = os.path.dirname(os.path.abspath(__file__)); D = os.path.dirname(HERE)
rnd = sys.argv[1] if len(sys.argv) > 1 else 'r1'
only = set(sys.argv[2].split(',')) if len(sys.argv) > 2 else None
out = os.path.join(D, 'readback', rnd); os.makedirs(out, exist_ok=True)
ST = json.load(open(os.path.join(D, 'src', 'strings-s2.json')))
def t(k): return ST.get(k, k)
def clean(s): return re.sub(r"\[\[([^|\]]+)\|\d+\]\]", r"\1", s or '')
def block(b, lines):
    if 'p' in b: lines.append(clean(b['p']))
    elif 'watch' in b: lines.append(t('watch.label') + ' ' + clean(b['watch']))
    elif 'words' in b:
        lines.append(clean(b.get('intro', '')))
        for w in b['words']: lines.append('  ' + w[0] + ' = ' + clean(w[1]))
    elif 'drawn' in b: lines.append('[Animated picture: %s]  Caption: %s' % (b['drawn']['alt'], clean(b['drawn']['say'])))
    elif 'flow' in b:
        f = b['flow']; lines.append('[Animated diagram of %s. Panels switched on: %s.%s]' % (f['form'], ', '.join(f['lit']), (' Then %s switches on.' % ', '.join(f['then'])) if f.get('then') else ''))
        if f.get('before'): lines.append('  Caption first: ' + clean(f['before']))
        lines.append('  Caption: ' + clean(f['say'])); lines.append('  Under it: ' + t('fixed.flow'))
    elif 'frames' in b:
        lines.append('[Picture strip: %s]' % clean(b['frames']['title']))
        for i, f in enumerate(b['frames']['frames']): lines.append('  picture %d: %s' % (i + 1, clean(f['say'])))
    elif 'steps' in b:
        for s in b['steps']:
            lines.append('STEP %s. %s' % (s['id'].split('.')[-1], clean(s['do'])))
            lines.append('  ' + t('step.see') + ' ' + clean(s['see']))
            for w in s.get('wrong', []): lines.append('  ' + t('step.wrong') + ' ' + clean(w[0]) + ' -> ' + clean(w[1]))
    elif 'check' in b:
        tryIt = any(r['expect'] != 'have' for r in b['check'])
        lines.append('[List of checks: %s]  %s' % (t('check.try.title') if tryIt else t('check.have.title'), t('check.try.intro') if tryIt else t('check.have.intro')))
        for r in b['check']:
            lab = {'must': t('check.must') + '. ', 'mustnot': t('check.mustNot') + '. '}.get(r['expect'], '')
            lines.append('  [tick box] %s%s' % (lab, clean(r['what'])))
            lines.append('    How: ' + clean(r['how'])); lines.append('    %s: %s%s' % (t('check.fix'), clean(r['fix']), ('  [button: %s]' % t('check.have.go')) if r.get('go') else ''))
    elif 'code' in b:
        c = b['code']
        lines.append('[CODE CARD. %s. %s]' % (t('code.kindType') if c['kind'] == 'type' else t('code.kindRead'), clean(c['title'])))
        if c.get('where'): lines.append('  Where: ' + clean(c['where']))
        lines.append('  ' + c['text'].replace('\n', '\n  '))
        for i, pl in enumerate(c['partLines']): lines.append('  Part %d (lines %d to %d). %s: %s' % (i + 1, pl[0], pl[1], clean(pl[2]), clean(pl[3])))
        if c.get('yours'): lines.append('  ' + clean(c['yours']))
        if c.get('names'): lines.append('  [Names in this code: %s]  %s' % (', '.join(c['names']), t('fixed.names')))
        if c.get('isense'): lines.append('  [IntelliSense animation: typing the first letters of %s and picking it from the list]' % c['isense'][0])
    elif 'box' in b:
        x = b['box']; lines.append('[Fold-out box, closed until clicked: %s]' % clean(x['title']))
        if x.get('text'): lines.append('  ' + clean(x['text']))
        for sb in x.get('blocks', []):
            sub = []; block(sb, sub); lines.extend('  ' + l for l in sub)
    elif 'isense' in b: lines.append('[IntelliSense animation: types %s, a list drops down, %s is picked]' % (b['isense']['typed'], b['isense']['pick']))
    elif 'names' in b: lines.append('[Names strip: %s]  %s' % (', '.join(b['names']['list']), t('fixed.names')))
FOOT = {'next': t('foot.next'), 'done': t('foot.done'), 'have': t('foot.have'), 'chapter-done': t('foot.chapterDone').replace('{n}', 'N')}
rows, tr, goals = [], [], []
for name in ('ch00.json', 'ch07.json'):
    ch = json.load(open(os.path.join(D, 'content', name)))
    tr.append('\n# Chapter %d. %s\nUnder the title: %s\nTop bar of every chapter screen: a gold button "%s" that goes back to the home page.\n' % (ch['n'], clean(ch['title']), clean(ch['one']), t('home.where')))
    for s in ch['stages']:
        tr.append('\n## Stage %s. %s' % (s['id'], clean(s['title'])))
        for sc in s['screens']:
            key = '%s#%s-%s' % (name.replace('.json', ''), s['id'], sc['id'])
            if only and key not in only: continue
            tr.append('\n### Screen %s. %s' % (key, clean(sc['title'])))
            lines = []
            for b in sc['blocks']: block(b, lines)
            tr.extend(lines); tr.append('[Big button at the foot: %s]' % FOOT.get(sc['foot'], sc['foot']))
            rows.append((key, clean(sc['title']))); goals.append((key, sc.get('goal', '')))
head = '''# What the reader sees
This is the pupil-visible text of a login-gated web guide, read on a school PC beside Visual Studio 2019 (or in a browser tab beside the Programming Environment tab).
The reader is a Year 12 pupil (15 or 16) in a very weak GCSE Digital Technology class. Many have missed lessons. They are creating their own C# Windows Forms program (a login form, a data entry form, a quiz, a reaction test, a report) for their controlled assessment. The guide shows MY example program (the teacher's). The pupil's program has different control names.
Words this pupil has met in class: form, control, button, text box, panel, radio button, number box, label, group box, code, Design tab, code tab, Solution Explorer, Properties window, green Start arrow, property, IntelliSense, Enabled, Visible, switched off, switched on. The Load event is NEW to them; chapter 7 is where they meet it.
A screen is one card with a title, some text or one big block (steps, a code card, a diagram, a picture strip, a list of checks) and a big button at the foot. Text in [square brackets] describes a picture, animation or card the pupil sees but is not itself text.
'''
for sub in ('A', 'B'):
    d = os.path.join(out, sub); os.makedirs(d, exist_ok=True)
    open(os.path.join(d, 'strings-to-judge.txt'), 'w').write(''.join('%s\t%s\n' % r for r in rows))
    open(os.path.join(d, 'transcript.md'), 'w').write(head + '\n'.join(tr) + '\n')
    open(os.path.join(d, 'COLD_READ_CHECKLIST.md'), 'w').write('''# Readback checklist (G-READ)
For EACH screen listed in strings-to-judge.txt, read that screen's full text in transcript.md as the pupil named in the transcript head, then answer:
1. SAY IT BACK. In one short line, in a weak Year 12's own words, what does this screen want me to do or to understand? If you cannot say, write "CAN'T SAY" and why.
2. WORDS. List every word or phrase on the screen that this pupil would not know, as it is written, other than the C# code itself and the control names in code font. The words in the transcript head are known. A word explained on the same screen, before or where it is used, is known. An empty list is the normal answer.
3. STUCK. Is there a place on this screen where the pupil would not know what to do next? Name it in a few words, or write "no".
4. TITLE. Does the title alone tell the pupil the goal of the screen, in words they use? YES or NO.
A screen PASSES when the readback is a real sentence (not CAN'T SAY), WORDS is empty, STUCK is "no" and TITLE is YES. Otherwise REWRITE.
''')
    open(os.path.join(d, 'PROMPT.txt'), 'w').write('''Register: a Year 12 pupil (15 or 16) in a very weak GCSE CCEA Digital Technology class with many absences, reading the guide beside Visual Studio 2019.
Read the transcript head first, then every screen in strings-to-judge.txt (one screen per line: key TAB title) at its place in transcript.md.
Judge each screen by COLD_READ_CHECKLIST.md. Do not guess what the author meant: judge only what is on the screen.
Every readback is written by hand, one screen at a time, from that screen's own text. A readback must NOT repeat or paraphrase the title, must NOT be a template ("do what the screen says"), and must name the concrete thing the screen is about (which form or button, what the code does, what the pupil will see). Two screens with the same readback sentence make the whole file void and it is sent back. Do not generate readbacks with a script.
Write verdicts.jsonl: one JSON object per screen, keys exactly: "path" (the key copied character for character), "verdict" ("PASS" or "REWRITE"), "readback" (your one line), "words" (list of strings), "stuck" (string), "title" ("YES" or "NO"), "why" (one line, empty when PASS).
Then write COLD_READ_REPORT.md: counts, then every REWRITE screen with its why, one line each.
Reply with two lines: counts of PASS/REWRITE, and the path of verdicts.jsonl.
''')
open(os.path.join(out, 'GOALS.tsv'), 'w').write(''.join('%s\t%s\n' % g for g in goals))
print(len(rows), 'screens;', len(tr), 'transcript lines;', out)
