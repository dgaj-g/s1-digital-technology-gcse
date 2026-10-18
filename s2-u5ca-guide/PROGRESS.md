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
