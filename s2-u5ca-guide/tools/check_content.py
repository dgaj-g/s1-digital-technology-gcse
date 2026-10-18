#!/usr/bin/env python3
"""Content checks for S2 chapter JSON (gate G-WORDS + structure): partLines cover every line once, the language law of
DESIGN_SPEC 7a, word marks, tick ids, a hidden goal on every screen. Also scans index.json and src/strings-s2.json."""
import json, re, os, sys
HERE = os.path.dirname(os.path.abspath(__file__)); D = os.path.dirname(HERE)
C = os.environ.get('S2_CONTENT') or os.path.join(D, 'content')
BANNED = re.compile(r"\b(simply|just|obviously|easy|easily|quick|quickly)\b", re.I)
# 7a.3 banned words. Each is (regex, allowed-in-files). "method" may appear only in the user-defined-method chapter, dumbed down.
LAW = [
 (re.compile(r"\bmethods?\b", re.I), ("ch10.json", "index 10")),
 (re.compile(r"\bevent handlers?\b", re.I), ()),
 (re.compile(r"(?<!Load )\bevents?\b"), ()),
 (re.compile(r"\bblocks? of code\b", re.I), ()),
 (re.compile(r"\bfront[ -]end\b", re.I), ()),
 (re.compile(r"\bcoded\b", re.I), ()),
 (re.compile(r"\b(our|we|us)\b", re.I), ()),
 (re.compile(r"On this screen you"), ()),
 (re.compile(r"(?<!Properties )\bwindows?\b", re.I), ()),
 (re.compile(r"\b(login|quiz|data entry|report|reaction test|test) screens?\b", re.I), ()),
 (re.compile(r"\b(finish|finished|finishes|finishing|missed|catch up|catch-up)\b", re.I), ()),
 (re.compile(r"(?<!code )\bbehind\b", re.I), ()),
 (re.compile(r"\bnotebook\b", re.I), ()),
 (re.compile(r"\b(un)?lock(ed|s|ing)?\b", re.I), ()),
]
problems = []
SKIP = ("text", "img", "alt", "id", "lang", "names", "isense", "list", "typed", "pick", "go", "form", "method", "lit", "then",
        "color", "kind", "expect", "foot", "prev", "next", "methods", "cards", "glossary", "snippet", "from", "to", "goal", "w", "h", "marks")
def prose(ch):
    """yield (where, text) for every pupil-facing prose string."""
    def walk(n, where):
        if isinstance(n, dict):
            for k, v in n.items():
                if k in SKIP: continue
                if k == "partLines":
                    for pl in v: yield (where + "/part", pl[2]); yield (where + "/part", pl[3])
                    continue
                if k == "words":
                    for w in v: yield (where + "/word", w[1])
                    continue
                if isinstance(v, str): yield (where + "/" + k, v)
                else: yield from walk(v, where + "/" + k)
        elif isinstance(n, list):
            for i, x in enumerate(n): yield from walk(x, where + "[%d]" % i)
    for s in ch["stages"]:
        yield ("stage %s/title" % s["id"], s["title"])
        for sc in s["screens"]:
            yield from walk(sc["blocks"], "%s-%s" % (s["id"], sc["id"]))
            yield ("%s-%s/title" % (s["id"], sc["id"]), sc["title"])
    yield ("chapter/title", ch["title"]); yield ("chapter/one", ch["one"])
def sentences(t):
    t = re.sub(r"\[\[(.+?)\|\d+\]\]", r"\1", t)
    return [x.strip() for x in re.split(r"(?<=[.!?])\s+", t) if x.strip()]
def law(name, where, t, nwords=None):
    if BANNED.search(t): problems.append((name, where, "banned word", BANNED.search(t).group(0)))
    for rx, ok in LAW:
        m = rx.search(t)
        if m and name not in ok: problems.append((name, where, "7a banned", m.group(0), t[:50]))
    tt = re.sub(r"\[\[[^\]]+\]\]", "", t)
    if "—" in tt or ";" in tt: problems.append((name, where, "dash or semicolon", t[:60]))
    if "(" in tt and "()" not in tt: problems.append((name, where, "bracket", t[:60]))
    for s in sentences(t):
        n = len(s.split())
        if n > 16: problems.append((name, where, "%d words" % n, s[:70]))
    if nwords is not None:
        for m in re.finditer(r"\[\[(.+?)\|(\d+)\]\]", t):
            if int(m.group(2)) >= nwords: problems.append((name, where, "word index out of range", m.group(0)))
        if re.search(r"\[\[[^\]|]+\]\]", t): problems.append((name, where, "mark without index", t[:60]))
NAMES = json.load(open(os.path.join(C, "names.json")))
IDX0 = json.load(open(os.path.join(C, "index.json")))
for name in ["ch%s.json" % c["id"] for c in IDX0["chapters"] if c["built"]]:
    ch = json.load(open(os.path.join(C, name)))
    nwords = sum(len(b["words"]) for s in ch["stages"] for sc in s["screens"] for b in sc["blocks"] if "words" in b)
    for where, t in prose(ch): law(name, where, t, nwords)
    for s in ch["stages"]:
        for sc in s["screens"]:
            sid = "%s-%s" % (s["id"], sc["id"])
            if not sc.get("goal", "").strip(): problems.append((name, sid, "no goal", ""))
            big = [k for b in sc["blocks"] for k in b if k in ("code", "frames", "controls") or (k == "steps" and (len(b[k]) > 1 or any(x.get("img") for x in b[k])))]
            if len(big) > 1: problems.append((name, sid, "two big blocks", " ".join(big)))
            KNOWN = {"p", "watch", "words", "intro", "drawn", "flow", "frames", "isense", "names", "steps", "controls", "yours", "check", "box", "code"}
            for b in sc["blocks"]:
                if not (set(b) & KNOWN) or set(b) - KNOWN: problems.append((name, sid, "block the renderer does not draw", " ".join(sorted(set(b) - KNOWN)) or "empty"))
            for b in sc["blocks"]:
                if "code" in b:
                    c = b["code"]; n = c["text"].count("\n") + 1
                    cov = [0] * n; lo = c.get("from", 1)
                    for pl in c["partLines"]:
                        for i in range(pl[0], pl[1] + 1):
                            j = i - lo
                            if 0 <= j < n: cov[j] += 1
                            else: problems.append((name, c["id"], "part line outside slice", pl[:3]))
                    if any(x != 1 for x in cov): problems.append((name, c["id"], "coverage", cov))
                    typed = sum(pl[1] - pl[0] + 1 for pl in c["partLines"] if len(pl) < 5)
                    if c["kind"] == "type" and typed > 12: problems.append((name, c["id"], "typed lines", typed))
                    if "form" in c:
                        src = open(os.path.join(C, "code", c["form"], c["method"] + ".cs")).read().rstrip("\n").split("\n")
                        if "\n".join(src[c["from"] - 1:c["to"]]) != c["text"]: problems.append((name, c["id"], "text differs from source", ""))
                    for nm in c["names"] + c["isense"]:
                        if nm not in NAMES: problems.append((name, c["id"], "name not in names.json", nm))
                if "flow" in b:
                    for nm in b["flow"]["lit"] + b["flow"]["then"]:
                        if nm not in NAMES: problems.append((name, "flow", "name not in names.json", nm))
                if "names" in b:
                    for nm in b["names"]["list"]:
                        if nm not in NAMES: problems.append((name, sid, "name not in names.json", nm))
    if True:
        for form, meth in ch.get("methods", []):
            src = open(os.path.join(C, "code", form, meth + ".cs")).read().rstrip("\n").split("\n")
            cov = [0] * len(src)
            for s in ch["stages"]:
                for sc in s["screens"]:
                    for b in sc["blocks"]:
                        if "code" in b and b["code"].get("method") == meth:
                            for i in range(b["code"]["from"], b["code"]["to"] + 1): cov[i - 1] += 1
            if any(x != 1 for x in cov): problems.append((name, meth, "method coverage", cov))
            else: print("  %s: all %d lines shown exactly once" % (meth, len(src)))
    print(name, "checked")
idx = json.load(open(os.path.join(C, "index.json")))
law("index.json", "intro", idx["intro"]); law("index.json", "header", idx["header"])
for c in idx["chapters"]:
    nm = "index " + str(c["n"])
    law(nm, "title", c["title"]); law(nm, "one", c["one"])
    for s in c["stages"]: law(nm, "stage " + s[0], s[1])
    if c["built"]:
        ch = json.load(open(os.path.join(C, "ch%s.json" % c["id"])))
        if [s["id"] for s in ch["stages"]] != [s[0] for s in c["stages"]]: problems.append(("index", c["id"], "stage ids", ""))
strings = json.load(open(os.environ.get("S2_STRINGS") or os.path.join(D, "src", "strings-s2.json")))
for k, v in strings.items():
    if not k.startswith("_"): law("strings-s2.json", k, v)
for p in problems: print("PROBLEM", *p)
print("problems:", len(problems))
sys.exit(1 if problems else 0)
