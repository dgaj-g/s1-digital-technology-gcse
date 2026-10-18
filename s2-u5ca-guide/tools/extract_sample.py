"""Reads the U5CA Sample Solution and writes:
   content/controls.json   every control on every form: type, text, position, size, parent, extras
   content/code/<form>/<method>.cs   every method body, de-dented, exactly as in the sample
   content/code/<form>/_head.txt     the using lines + class-level fields of that form
Run again after ANY change to the sample copy. The gates compare guide code against these files."""
import re, json, pathlib
SRC = pathlib.Path("/Users/damiengartland/Desktop/Claude Work/S2 U5CA Guide/U5CA Sample Solution/U5CASampleSolution")
OUT = pathlib.Path("/Users/damiengartland/Desktop/Claude Work/S2 U5CA Guide/_design/content")
forms = {}
for dp in sorted(SRC.glob("frm*.Designer.cs")):
    form = dp.stem.replace(".Designer", "")
    d = dp.read_text(encoding="utf-8-sig")
    ctl = {}
    for t, n in re.findall(r'private System\.Windows\.Forms\.(\w+) (\w+);', d):
        ctl[n] = {"type": t}
    for n, k, v in re.findall(r'this\.(\w+)\.(Location|Size|Text|Interval|PasswordChar|Enabled|Visible|Minimum|Maximum|Value|Checked|Multiline|ReadOnly|ForeColor|BackColor|TextAlign|Image|ImageLocation|SizeMode|Font|UseVisualStyleBackColor|BorderStyle|DropDownStyle|RowHeadersVisible|AllowUserToAddRows|AutoSizeColumnsMode) = ([^;]*);', d):
        if n not in ctl: continue
        v = v.strip()
        m = re.match(r'new System\.Drawing\.(?:Point|Size)\((-?\d+), (-?\d+)\)', v)
        if m: v = [int(m.group(1)), int(m.group(2))]
        elif v.startswith('"'): v = json.loads(v) if '\\' not in v else v.strip('"')
        elif v in ("true", "false"): v = (v == "true")
        elif re.fullmatch(r'-?\d+', v): v = int(v)
        else: v = v.replace("System.Windows.Forms.", "").replace("System.Drawing.", "")
        key = {"Location": "loc", "Size": "size", "Text": "text"}.get(k, k[0].lower() + k[1:])
        ctl[n][key] = v
    for n, items in re.findall(r'this\.(\w+)\.Items\.AddRange\(new object\[\] \{([^}]*)\}', d):
        if n in ctl: ctl[n]["items"] = re.findall(r'"([^"]*)"', items)
    for p, c in re.findall(r'this\.(\w+)\.Controls\.Add\(this\.(\w+)\);', d):
        if c in ctl: ctl[c]["parent"] = p
    for c in re.findall(r'^\s*this\.Controls\.Add\(this\.(\w+)\);', d, re.M):
        if c in ctl: ctl[c]["parent"] = form
    for n, h in re.findall(r'this\.(\w+)\.(?:Click|Tick|SelectedIndexChanged|Load) \+= new [\w.]+\(this\.(\w+)\);', d):
        if n in ctl: ctl[n]["handler"] = h
    size = re.search(r'this\.ClientSize = new System\.Drawing\.Size\((\d+), (\d+)\);', d)
    text = re.search(r'^\s*this\.Text = "([^"]*)";', d, re.M)
    load = re.search(r'this\.Load \+= new System\.EventHandler\(this\.(\w+)\);', d)
    forms[form] = {"size": [int(size.group(1)), int(size.group(2))] if size else None,
                   "text": text.group(1) if text else "", "load": load.group(1) if load else None,
                   "controls": ctl}
(OUT / "controls.json").write_text(json.dumps(forms, indent=1, ensure_ascii=False), encoding="utf-8")
# ---- methods ----
def dedent(block):
    lines = block.split("\n")
    ind = min((len(l) - len(l.lstrip()) for l in lines if l.strip()), default=0)
    return "\n".join(l[ind:] if l.strip() else "" for l in lines).rstrip() + "\n"
count = 0
for cs in sorted(SRC.glob("*.cs")):
    if cs.name.endswith(".Designer.cs") or cs.name == "Program.cs": continue
    s = cs.read_text(encoding="utf-8-sig")
    unit = cs.stem
    od = OUT / "code" / unit; od.mkdir(parents=True, exist_ok=True)
    for f in od.glob("*"): f.unlink()
    heads = re.findall(r'^using [^;]+;', s, re.M)
    fields = re.findall(r'^\s*(?:private|public) (?:static )?(?!void|string CalculateGroup)[\w<>\[\]]+ \w+(?: = [^;]*)?;', s, re.M)
    (od / "_head.txt").write_text("\n".join(heads) + "\n\n" + "\n".join(l.strip() for l in fields) + "\n", encoding="utf-8")
    for m in re.finditer(r'^([ \t]*)(?:private|public) (?:static )?(?:void|string|int|double|bool) (\w+)\([^)]*\)\s*\n', s, re.M):
        name = m.group(2)
        i = s.index("{", m.end())
        depth = 0; j = i
        while True:
            if s[j] == "{": depth += 1
            elif s[j] == "}":
                depth -= 1
                if depth == 0: break
            j += 1
        block = s[m.start():j + 1]
        (od / f"{name}.cs").write_text(dedent(block), encoding="utf-8")
        count += 1
print("forms:", {f: len(v["controls"]) for f, v in forms.items()})
print("methods written:", count)
for f, v in forms.items():
    print(f, v["size"], repr(v["text"]), "| load:", v["load"])
    for n, c in v["controls"].items():
        if c.get("parent") == f or c["type"] in ("Timer",):
            kids = [k for k, kc in v["controls"].items() if kc.get("parent") == n]
            print("   ", c["type"], n, c.get("loc"), c.get("size"), repr(c.get("text", ""))[:40], ("-> " + ", ".join(kids)) if kids else "")
