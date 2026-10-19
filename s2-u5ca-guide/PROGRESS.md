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
