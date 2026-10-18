#!/usr/bin/env python3
"""Builds a cold-read packet (strings-to-judge.txt + transcript.md) from ch00/ch07/strings-s2.json into coldread/<round>/<A|B>/."""
import json, os, re, shutil, sys
HERE = os.path.dirname(os.path.abspath(__file__)); D = os.path.dirname(HERE)
rnd = sys.argv[1] if len(sys.argv) > 1 else 'r1'
out = os.path.join(D, 'coldread', rnd); os.makedirs(out, exist_ok=True)
rows, tr = [], []
def add(path, text):
    text = re.sub(r"\[\[([^|\]]+)\|\d+\]\]", r"\1", text)
    rows.append((path, text)); return text
def block(b, p, out_):
    if "p" in b: out_.append(add(p + "/p", b["p"]))
    elif "watch" in b: out_.append("WATCH OUT · " + add(p + "/watch", b["watch"]))
    elif "words" in b:
        out_.append("[Words box] " + add(p + "/words.intro", b.get("intro", "")))
        for i, w in enumerate(b["words"]): out_.append("  " + w[0] + " = " + add(p + "/words[%d]" % i, w[1]))
    elif "drawn" in b: out_.append("[Drawn animated picture: %s] caption: %s" % (b["drawn"]["alt"], add(p + "/drawn.say", b["drawn"]["say"])))
    elif "flow" in b: out_.append("[Panel diagram of %s, lit: %s, then: %s] caption: %s" % (b["flow"]["form"], ", ".join(b["flow"]["lit"]), ", ".join(b["flow"]["then"]), add(p + "/flow.say", b["flow"]["say"])))
    elif "frames" in b:
        out_.append("[Picture strip: %s]" % add(p + "/frames.title", b["frames"]["title"]))
        for i, f in enumerate(b["frames"]["frames"]): out_.append("  frame %d: %s" % (i + 1, add(p + "/frames[%d].say" % i, f["say"])))
    elif "steps" in b:
        for i, s in enumerate(b["steps"]):
            out_.append("STEP %s · %s" % (s["id"].split(".")[-1], add(p + "/steps[%d].do" % i, s["do"])))
            out_.append("  You should see: " + add(p + "/steps[%d].see" % i, s["see"]))
            for j, w in enumerate(s.get("wrong", [])): out_.append("  If it goes wrong · %s → %s" % (add(p + "/steps[%d].wrong[%d].q" % (i, j), w[0]), add(p + "/steps[%d].wrong[%d].a" % (i, j), w[1])))
    elif "check" in b:
        for i, r in enumerate(b["check"]):
            lab = {"have": "HAVE YOU GOT THIS?", "must": "TRY IT · Must happen", "mustnot": "TRY IT · Must NOT happen"}[r["expect"]]
            out_.append("%s · %s" % (lab, add(p + "/check[%d].what" % i, r["what"])))
            out_.append("  How: " + add(p + "/check[%d].how" % i, r["how"]))
            out_.append("  If not: " + add(p + "/check[%d].fix" % i, r["fix"]))
    elif "code" in b:
        c = b["code"]
        out_.append("[CODE CARD · %s · %s]" % ({"type": "Type this", "read": "Read this"}[c["kind"]], add(p + "/code.title", c["title"])))
        if c.get("where"): out_.append("  Where: " + add(p + "/code.where", c["where"]))
        out_.append("  " + c["text"].replace("\n", "\n  "))
        for i, pl in enumerate(c["partLines"]):
            out_.append("  part %d (lines %d–%d) · %s: %s" % (i + 1, pl[0], pl[1], add(p + "/code.part[%d].h" % i, pl[2]), add(p + "/code.part[%d].m" % i, pl[3])))
        if c.get("yours"): out_.append("  YOURS WILL BE DIFFERENT · " + add(p + "/code.yours", c["yours"]))
        out_.append("  Names in this code: " + ", ".join(c["names"]))
    elif "box" in b:
        x = b["box"]; out_.append("[Fold-out box: %s]" % add(p + "/box.title", x["title"]))
        if x.get("text"): out_.append("  " + add(p + "/box.text", x["text"]))
        for i, sb in enumerate(x.get("blocks", [])): block(sb, p + "/box[%d]" % i, out_)
    elif "isense" in b: out_.append("[IntelliSense animation: types %s, list of %d names, picks %s]" % (b["isense"]["typed"], len(b["isense"]["list"]), b["isense"]["pick"]))
    elif "names" in b: out_.append("[Names strip: %s]" % ", ".join(b["names"]["list"]))
for name in ("ch00.json", "ch07.json"):
    ch = json.load(open(os.path.join(D, "content", name)))
    tr.append("\n# Chapter %d · %s\nOne line under the title: %s\n" % (ch["n"], add(name + "#title", ch["title"]), add(name + "#one", ch["one"])))
    for s in ch["stages"]:
        tr.append("\n## Stage %s · %s" % (s["id"], add(name + "#stage%s.title" % s["id"], s["title"])))
        for sc in s["screens"]:
            p = name + "#" + s["id"] + "-" + sc["id"]
            tr.append("\n### Screen %s-%s · %s   (foot button: %s)" % (s["id"], sc["id"], add(p + "/title", sc["title"]), {"next": "Next ›", "done": "I've done this ✓", "have": "I have all of this ✓", "chapter-done": "Chapter is done — back to the checklist"}[sc["foot"]]))
            lines = []
            for i, b in enumerate(sc["blocks"]): block(b, p + "/b%d" % i, lines)
            tr.extend(lines)
st = json.load(open(os.path.join(D, "src", "strings-s2.json")))
tr.append("\n# Fixed strings of the shell (home page, chapter foot, code cards, pop-up before Google's permission screen)\n")
for k, v in st.items():
    if k.startswith("_"): continue
    tr.append("- %s: %s" % (k, add("strings-s2.json#" + k, v)))
ix = json.load(open(os.path.join(D, "content", "index.json")))
tr.append("\n# Home page (the checklist)\n")
tr.append("Intro: " + add("index.json#intro", ix["intro"])); tr.append("Header: " + add("index.json#header", ix["header"]))
for c in ix["chapters"]: tr.append("- Card %d · %s — %s" % (c["n"], add("index.json#ch%s.title" % c["id"], c["title"]), add("index.json#ch%s.one" % c["id"], c["one"])))
head = """# Where each string appears
The guide is a login-gated web page, read on a school PC beside Visual Studio 2019, or in a browser tab switched with the Programming Environment tab.
The reader is a Year 12 pupil in a very weak GCSE Digital Technology class, many of whom have missed lessons. They are finishing the coded front end of a C# Windows Forms program (login, data entry, quiz, reaction test, report) for their controlled assessment.
The home page is a checklist of 15 chapter cards. A chapter is a row of stages; each stage is a few screens; each screen has one job and a big button at the foot (Next, or I've done this ✓, which ticks the screen).
The guide shows OUR example program; the pupil's own program has different control names. Code cards cannot be copied: the pupil types every line in Visual Studio. "The notebook" is the guide's plain name for the Global class, introduced in chapter 3.
Chapter 0 is the start-here chapter. Chapter 7 is the prototype chapter, read by a pupil who has done chapters 1 to 6 (login, data entry front end, Global class, pupil details, average, first three quiz questions).
"""
if len(sys.argv) > 2:
    prev = dict(l.rstrip("\n").split("\t", 1) for l in open(os.path.join(D, "coldread", sys.argv[2], "A", "strings-to-judge.txt")))
    extra = set(sys.argv[3].split(",")) if len(sys.argv) > 3 else set()
    rows = [r for r in rows if prev.get(r[0]) != r[1] or r[0] in extra]
for sub in ("A", "B"):
    d = os.path.join(out, sub); os.makedirs(d, exist_ok=True)
    open(os.path.join(d, "strings-to-judge.txt"), "w").write("\n".join("%s\t%s" % r for r in rows) + "\n")
    open(os.path.join(d, "transcript.md"), "w").write(head + "\n".join(tr) + "\n")
    for f in ("PROMPT.txt", "COLD_READ_CHECKLIST.md"):
        src = os.path.join(out, f)
        if os.path.exists(src): shutil.copy(src, d)
print(len(rows), "strings;", len(tr), "transcript lines;", out)
