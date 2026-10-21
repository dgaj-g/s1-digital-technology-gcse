# S2 U5CA Guide — BUILD PROGRESS (Opus 5.5 medium, from 18 Oct 2026)

Design log head (from /Users/damiengartland/Desktop/Claude Work/S2 U5CA Guide/_design/PROGRESS.md): design PASSED his second look 18 Oct 2026 18:10; ch00 + ch07 (27 screens) pass every gate; proto/img empty; sample unzipped in the dummy OneDrive (Route A).

## Paths
- Repo clone: /Users/damiengartland/Sites/s1-dt-gcse (branch s2-u5ca-guide)
- Folder: /Users/damiengartland/Sites/s1-dt-gcse/s2-u5ca-guide
- Private deploy: /Users/damiengartland/Desktop/Claude Work/S2 U5CA Guide/_platform/deploy/
- Design: /Users/damiengartland/Desktop/Claude Work/S2 U5CA Guide/_design

## Log
- 18 Oct 2026 · 18:25 · window checked (Opus 5.5 medium after his picker change; 5h 40%, week 39%). Clone done, branch s2-u5ca-guide, folders made.
- FINDING: proto/cw.js is standalone (localStorage s2:*, own header). AS cw.js is window.CW.mount(host,{base,api}) driven by A2 app.js (cw:ticks:/cw:done:/cw:at: synced from apiCw state). Build must wrap the proto renderer as window.CW with the api hooks + add op had (server CW_OPS, cwView_ h, app.js cwApply).
- 18 Oct 2026 · 18:17 · build-s2.js written + runs clean (Index.html 279 KB, Code.gs 43.6 KB, 28 slots). dev-server.js ported (port 8851, /cw/ = content, /fonts/). Literal colours in cw.css/style.css moved to tokens-s2.css. NEXT: gates/gates.py (static G1-G4,G6-G8b,G11-G13), g_browser.js (G5,G12,G14), g9, g10, t-apicw (G15), run.sh + controls.
- 18 Oct 2026 · 20:16 · ch09 DONE: 18 screens; cold read r1 both readers agreed on 4 rewrites (class, six-of-twelve, group panel), fixed; G12 tallest 2200; rest note + four-choices back fixed; run.sh ALL GREEN.
- 18 Oct 2026 · 20:28 · ch10 DONE: 12 screens (plan 11→12: the 70-line button needs 7 parts of ≤12 typed lines). Cold read r1: both agreed on 2-1 title + how to get the try-it scores, fixed. Machine numbers stay visible at rest. ALL GREEN.
- 18 Oct 20:45 ch11 Save to file: 5 stages 9 screens (plan 8→9); record-line drawn added; G6 strip now required only when code holds names; cold read r1 fixes applied (grey clash, titles, line-jump note, yours wording); ALL GREEN. Commit next.
- 18 Oct 21:00 ch12 The report: 15 screens, cold read 2 readers fixes applied (Debug folder how-to, Items how-to, parts-number yours, 5-3 title), record-line + three-quotes drawn, run.sh ALL GREEN. Sample bug noted for Damien: save line starts with surname but report labels parts[0] Forename; sample Items carry trailing spaces.
- 18 Oct 21:13 ch13 Help buttons: 5 screens (plan 4→5), one open + folded code per form; check_content now reads code inside folds and matches form+method (two btnHelpReactionTest_Click); G6 ignores words in quote marks; names strip may carry its own title; literals 13 added; cold read fixes (3-1, 3-2 titles, 3-3 grey-panel row); run.sh ALL GREEN.
- 18 Oct 2026 · ch14 done: 10 screens, hidden until 1-13; cold read A+B, fixes to 2-2 where, 3-2 negative row, 5-1 else if + grey-panel line + yours, 5-2 concrete scores; G12 and look.js now open 14 as a pupil who has done 1-13 (162 screens, tallest 2200px); run.sh ALL GREEN, every control red. Next: captures F1-F21, P1-P3.
- 18 Oct · captures F1-F21 done (45 PNGs), captions fixed, landing index.html + pop-up built, G11 counts P1/P3 (owed after deploy). run.sh ALL GREEN. Next: own look 1500/390, G-MOVE, SIT_REPORT.
- 18 Oct 22:50 own look 330 shots 0 problems; G-MOVE fixed (7 controls screens); stale-banner stamp fixed (a2ssd- prefix); SIT_REPORT.md written; run.sh ALL GREEN. Next: PR + his deploy steps.
- 19 Oct 2026: merged (PR #1, #2), deployed Apps Script V1 (build a36a5cfc), /exec on landing. Owed: his Allow + staffPasscode property, T1–T6 live, P1/P3.
- 19 Oct: landing pictures P1 (Review permissions) and P3 (Select all + Continue) taken from his real sign-in; pop-up lines match the real flow (no Advanced line; tick Select all). Owner gets in by email, so no staffPasscode needed (only him).
- 19 Oct 2026 07:54 — Version 2 deployed (build s2-2026-10-19-f59ed921, same /exec). Live as owner: chapter 1 Open stays in the page (hash-link fix), a tick survives reload (1/14, Carry on), no stale-build line, staff Coursework grid shows 1/14 with the gold frame. T3–T6 covered by the dev-server gate run (PASS); T5/T6 cannot be driven from the owner's UI. PR #3 open, awaiting his word to merge.
- 19 Oct 10:05 (Fable window, his word to carry on): ch12 report columns fixed in code card + caption + F18 picture (Surname then Forename). Ship check found G7 red: Items now taught in ch02, Convert.ToInt32 in ch05, "event handler" dropped from words.txt (banned phrase). run.sh ALL GREEN, every control red. PR #4 merged; Pages serves the new ch12.json and f18-1.png. No Apps Script redeploy needed (content fetched from Pages; Index.html unchanged). Sample program: frmReport.cs column order + frmReport.Designer.cs "Intermediate " trailing space fixed in both copies, _design/U5CA Sample Solution.zip rebuilt. Live checks as Damien on /exec?class=S2-26-27: no-copy (no selection, toast, clipboard untouched) PASS; chapter 0 marked done, staff grid shows green 2/2 PASS; "I did this already" + Undo on ch1 syncs both ways PASS; the bonus-chapter reveal was NOT walked live (would need all 13 chapters marked had on his record) — covered by gate G14. Left on his word: help-button count (8 vs 9) and the soft P1 landing picture. Classroom post: _platform/CLASSROOM_POST_19OCT2026.md.

## 21 Oct 2026 — EASE REBUILD (Fable 5.1 xhigh, in this session on his word; usage stops overridden)
His rulings today: (1) Q4/Q5 blurred, too much per screen, "video" jumps, weak class needs signposting throughout; (2) not just ch7, the
whole platform; (3) standing lens "does this actually make sense for a student?"; (4) build ALL THREE ROUNDS here in Fable, "great care
must be taken to get it correct this time". Audit + plan: /Users/damiengartland/Desktop/Claude Work/S2 U5CA Guide/_design/EASE_AUDIT_21OCT2026.md
Spec (binding, written next): _design/EASE_SPEC_21OCT2026.md. Order: spec → gates (G-SIGN tools/check_signposting.py + fold gate) with
controls that FAIL → round 1 shell (src/cw.js, cw.css, strings) → round 2 ch07.json pilot → round 3 ch01–ch14 → two cold readers → PRs.
Screen ids stay STABLE (openers get id "s-0", split second halves "k-b") so pupil ticks keep; openers are foot "next" so tick totals keep.
One Apps Script deploy at the end (shell); content is Pages-fetched. Dev: node tools/dev-server.js (8851), class S2-G5-58756, pupil9@c2ken.net.
- 14:49 — EASE_SPEC_21OCT2026.md WRITTEN (13 KB) in _design/. Decisions: screen ids renumbered per stage, openers `k-0` (route regex untouched); ticks are block ids so progress keeps; index stage = [id,title,stepCount,thing]. Next: gates (tools/check_signposting.py G-SIGN, G-FOLD in g_browser.js, G12 1600/1300) with controls, then shell.

## 21 Oct 2026 15:03 — GATES BUILT (step 3 done)
- tools/check_signposting.py (G-SIGN S1–S11) exits 1 on current content: 643 problems. Every SIGN control (gates/plant.py SIGN S1..S11) red with --only.
- gates/g_browser.js: GFOLD (first heavy block ≤ 700 px at 1366×768) red on current content (8 over, deepest 901 px); its control red (planted 500 px div). G12 now 1600/1300: red (tallest 2200). `tallest` statement restored after the comment bug.
- gates/run.sh carries G-SIGN, GFOLD and the 11 SIGN controls. Dev server 8851 up.
- METER 15:03 · context 116k · 5h 12% · week 62% (Fable 67%) · calls 58
- NEXT: round 1 shell (src/cw.js, cw.css, strings-s2.json) per EASE_SPEC §3.
