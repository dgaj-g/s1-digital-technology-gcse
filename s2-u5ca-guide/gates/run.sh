#!/bin/zsh
# S2 gates (DESIGN_SPEC 14): every gate must print PASS, every control must print FAIL. Writes gates/T_REPORT.txt.
#   zsh s2-u5ca-guide/gates/run.sh          dev check (unbuilt chapters and untaken pictures listed, not counted)
#   S2_SHIP=1 zsh s2-u5ca-guide/gates/run.sh   the ship check: G4 and G11 count them too
# Needs the dev server on 8851:  nohup node s2-u5ca-guide/tools/dev-server.js 8851 > s2-u5ca-guide/gates/_out/dev.log 2>&1 &
G=${0:A:h}; D=${G:h}; cd "$D/.." || exit 2
export NODE_PATH=$(npm root -g)
OUT="$G/_out"; mkdir -p "$OUT"; R="$OUT/run.txt"; : > "$R"
red=0
line() { printf '%s\n' "$1" | tee -a "$R"; }
gate() {  # gate <name> <cmd...>   must pass
  local n=$1; shift
  if "$@" > "$OUT/$n.log" 2>&1; then line "PASS  $n"; else line "FAIL  $n   (see gates/_out/$n.log)"; red=1; fi
}
ctl() {   # ctl <name> <cmd...>    must fail
  local n=$1; shift
  if "$@" > "$OUT/ctl-$n.log" 2>&1; then line "GREEN control $n   — the gate did not catch its planted fault"; red=1; else line "red   control $n"; fi
}
line "S2 gates $(date '+%d %b %Y %H:%M')${S2_SHIP:+  [ship check]}"
gate check_content python3 -I s2-u5ca-guide/tools/check_content.py
for g in G1 G2 G4 G6 G7 G8b G11 G12s G13; do gate $g python3 -I s2-u5ca-guide/gates/gates.py $g; done
gate G9  python3 -I s2-u5ca-guide/gates/g9_tokens.py
gate G10 python3 -I s2-u5ca-guide/gates/g10_privacy.py
gate G5+G12+G14 node s2-u5ca-guide/gates/g_browser.js
gate G15 node s2-u5ca-guide/gates/t-apicw.js
cp "$G/T_REPORT.txt" "$OUT/T15.txt" 2>/dev/null
cmp() { python3 -I s2-u5ca-guide/gates/plant.py $1 > /dev/null || return 0; }
line "-- controls (each must be red)"
for g in G1 G2 G4 G6 G7 G8b G12s G13; do cmp $g; ctl $g env S2_CONTENT="$G/_ctl/$g" python3 -I s2-u5ca-guide/gates/gates.py $g; done
for g in G3 G8; do cmp $g; ctl $g env S2_CONTENT="$G/_ctl/$g" python3 -I s2-u5ca-guide/tools/check_content.py; done
cmp G11; ctl G11 env S2_SHIP=1 S2_CONTENT="$G/_ctl/G11" python3 -I s2-u5ca-guide/gates/gates.py G11
ctl G9  python3 -I s2-u5ca-guide/gates/g9_tokens.py --control
ctl G10 python3 -I s2-u5ca-guide/gates/g10_privacy.py --control
for g in G5 G12 G14; do ctl $g node s2-u5ca-guide/gates/g_browser.js $g --control; done
ctl G15 node s2-u5ca-guide/gates/t-apicw.js --control
line "$([ $red = 0 ] && echo 'ALL GREEN, every control red' || echo 'RED: something above needs fixing')"
{ cat "$R"; echo; echo '---- G15 server test'; cat "$OUT/T15.txt"; echo; echo '---- browser gates'; cat "$OUT/G5+G12+G14.log"; } > "$G/T_REPORT.txt"
exit $red
