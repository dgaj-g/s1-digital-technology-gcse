/* Activity 2 — Tuck Shop Kitchen. HQ_GAME_DESIGN 2 (deck section B). Sources: TB p16, TB p17, TB p19; PP formulae, replication, functions and reference rows (2018 to 2026). */
/* the tuck shop sheet (DECK_STORYBOARD): columns A–E, rows 1–7, plus I1 (charity share) and B18 (euros for each £1) */
const TS={A:['Item','Crisps','Juice','Apple','Bar','Water','Total'],B:['Cost price',0.40,0.55,0.20,0.60,0.30,''],C:['Sell price',0.80,1.00,0.50,1.00,0.70,''],
  D:['Sold',120,90,60,75,110,455],E:['Profit',48,40.5,18,30,44,180.5]};
const TS_EXTRA={I1:0.5,B18:1.21};
function tsGet(c,r){const k=c+r;if(k in TS_EXTRA)return TS_EXTRA[k];const v=TS[c]&&TS[c][r-1];return typeof v==='number'?v:0;}
const tsEmpty=(c,r)=>!(c+r in TS_EXTRA)&&!(TS[c]&&TS[c][r-1]!==undefined&&TS[c][r-1]!=='');
/* each recipe: the formula for row 2 as text pieces and references; pin = the pins that make it fill down correctly */
const FH_RECIPES=[
  {col:'E',head:'Profit',dp:2,ask:'Fill in the Profit column. Profit is (sell price minus cost price) times the number sold.',
   toks:['=(',['C',2],'-',['B',2],')*',['D',2]],pin:[0,0,0],calc:(g,[c,b,d])=>(g(c)-g(b))*g(d)},
  {col:'F',head:'To charity',dp:2,ask:'Half of each item’s profit goes to charity. The charity share, 0.5, is in cell I1.',
   toks:['=',['E',2],'*',['I',1]],pin:[0,1],calc:(g,[e,i])=>g(e)*g(i)},
  {col:'F',head:'Share of sales',dp:2,ask:'What share of all the items sold was each item? Divide its Sold number by the total sold in D7.',
   toks:['=',['D',2],'/',['D',7]],pin:[0,1],calc:(g,[d,t])=>g(t)===0?'#DIV/0!':g(d)/g(t)},
  {col:'F',head:'Sold so far',dp:0,ask:'A running total: how many items have been sold so far, counting down the list from Crisps?',
   toks:['=SUM(',['D',2],':',['D',2],')'],pin:[1,0],calc:(g,[a,b])=>{let s=0;for(let r=Math.min(a.r,b.r);r<=Math.max(a.r,b.r);r++)s+=tsGet('D',r);return s;}},
  {col:'F',head:'Profit in euros',dp:2,ask:'A partner school in France wants each profit in euros. The exchange rate, 1.21 euros for each £1, is in cell B18.',
   toks:['=',['E',2],'*',['B',18]],pin:[0,1],calc:(g,[e,x])=>g(e)*g(x)}];
let FH=null;
function sim_fill(area,finish){
  FH={i:0,done:{}};
  gmOpen(area,{title:'Fill handle',icon:'🍪',stages:['Five recipes'],lives:3,finish,bot:'👩‍🍳'});
  gmBanner('The tuck shop kitchen','Each recipe is a formula in row 2. Before you fill it down to row 6, decide which cell references must stay put: tap a reference to pin it with $. Then fill down and watch every row work out its own answer. Red answers cost a life.','🍪 Start cooking',fhRecipe);
}
const fhRefs=R=>R.toks.filter(t=>Array.isArray(t));
const fhTxt=(c,r,pin)=>pin?`$${c}$${r}`:`${c}${r}`;
/* the formula as it would be in row n with the given pins */
function fhFormula(R,pins,n){let k=0;return R.toks.map(t=>{if(!Array.isArray(t))return t;const p=pins[k++];return fhTxt(t[0],p?t[1]:t[1]+n-2,p);}).join('');}
function fhValue(R,pins,n){const refs=fhRefs(R).map((t,k)=>({c:t[0],r:pins[k]?t[1]:t[1]+n-2}));return R.calc(q=>tsGet(q.c,q.r),refs);}
/* round half up the way a spreadsheet shows it: 40.50 x 1.21 = 49.005 shows as 49.01 */
const fhShow=(R,v)=>typeof v==='string'?v:(Math.round(v*Math.pow(10,R.dp)+1e-6)/Math.pow(10,R.dp)).toFixed(R.dp);
function fhRecipe(){
  GM.state='play';gmMsg('');
  const R=FH_RECIPES[FH.i];FH.pins=R.pin.map(()=>0);
  $('gmMain').innerHTML=`<div class="gm-q">🍪 Recipe ${FH.i+1} of ${FH_RECIPES.length}: ${R.ask}</div>
<div class="fh-bar"><span class="fh-name">${R.col}2</span><span class="fh-fx">fx</span><span class="fh-f" id="fhF"></span></div>
<div class="fh-hint">Tap a cell reference above to pin it with $. Tap it again to unpin it.</div>
<div class="fh-wrap"><div class="gm-panel fh-sheet">${fhSheet(R)}</div>
<div class="gm-panel fh-side"><div class="vs-h">Other cells</div><div class="fh-x"><b>I1</b> Charity share <span>0.5</span></div><div class="fh-x"><b>B18</b> Euros for each £1 <span>1.21</span></div><div class="fh-x muted"><b>I2 to I6</b> empty</div><div class="fh-x muted"><b>D8</b>, <b>B19</b> and below: empty</div></div></div>
<div class="gm-btns"><button class="btn btn-primary" id="fhGo">⬇️ Fill down to row 6</button></div>`;
  fhDrawF();
  $('fhGo').onclick=fhFill;
}
function fhSheet(R){
  const cols=['A','B','C','D','E'].concat(R.col==='F'?['F']:[]);
  const head=c=>c===R.col?R.head:TS[c][0];
  const cell=(c,r)=>{
    if(c===R.col&&r>=2&&r<=6)return `<td class="fh-t" id="fh_${r}">${r===2?'<i>?</i>':''}</td>`;
    if(c==='F'||(c==='E'&&R.col==='E'))return '<td></td>';
    const v=TS[c][r-1];return `<td>${typeof v==='number'?(c==='D'?v:v.toFixed(2)):v}</td>`;
  };
  return `<table class="gm-tbl fh-tbl"><tr><th></th>${cols.map(c=>`<th>${c}</th>`).join('')}</tr><tr><th>1</th>${cols.map(c=>`<td class="fh-h">${head(c)}</td>`).join('')}</tr>
${[2,3,4,5,6,7].map(r=>`<tr><th>${r}</th>${cols.map(c=>r===7&&c===R.col?'<td></td>':cell(c,r)).join('')}</tr>`).join('')}</table>`;
}
function fhDrawF(){
  const R=FH_RECIPES[FH.i];let k=0;
  $('fhF').innerHTML=R.toks.map(t=>{if(!Array.isArray(t))return `<span>${t}</span>`;const j=k++;return `<button class="fh-chip${FH.pins[j]?' on':''}" data-k="${j}">${FH.pins[j]?'📌':''}${fhTxt(t[0],t[1],FH.pins[j])}</button>`;}).join('');
  document.querySelectorAll('.fh-chip').forEach(b=>b.onclick=()=>{if(GM.state!=='play')return;FH.pins[+b.dataset.k]^=1;sfx('tick');fhDrawF();});
}
function fhFill(){
  if(GM.state!=='play')return;GM.state='fill';
  const R=FH_RECIPES[FH.i];$('fhGo').disabled=true;document.querySelectorAll('.fh-chip').forEach(b=>b.disabled=true);
  let n=2;
  const step=()=>{
    if(!GM||GM.state!=='fill')return;
    if(n>6)return fhJudge();
    const v=fhValue(R,FH.pins,n);
    $('fh_'+n).innerHTML=`<code>${fhFormula(R,FH.pins,n)}</code><b>${fhShow(R,v)}</b>`;$('fh_'+n).classList.add('in');sfx('tick');
    n++;setTimeout(step,RM?80:420);
  };
  step();
}
function fhJudge(){
  GM.state='fb';
  const R=FH_RECIPES[FH.i],refs=fhRefs(R),bad=[];
  for(let n=2;n<=6;n++){
    const got=fhValue(R,FH.pins,n),want=fhValue(R,R.pin,n);
    if(typeof got==='string'||Math.abs(got-want)>1e-9){bad.push(n);$('fh_'+n).classList.add('bad');}else $('fh_'+n).classList.add('ok');
  }
  if(!bad.length){
    sfx('good');say(['Delicious! 🍪','Perfect batch!','Chef’s kiss! 👌'][FH.i%3]);
    const pinned=refs.filter((t,k)=>FH.pins[k]).map(t=>t[0]+t[1]);
    gmMsg(`Right. Every row worked out its own answer. ${pinned.length?`${pinned.join(' and ')} stayed put because ${pinned.length>1?'they were':'it was'} pinned with $ (an absolute reference); the other references moved down one row at a time (relative references).`:'Nothing needed pinning: every reference moved down one row at a time, so each row used its own numbers (relative references).'}`,'correct');
    FH.i++;
    return gmGo(FH.i<FH_RECIPES.length?'Next recipe →':'Finish →',FH.i<FH_RECIPES.length?fhRecipe:()=>gmEnd(gmStars(GM.lives,3),'The kitchen is spotless','Every recipe filled down correctly. You chose which references move and which stay put.'));
  }
  const out=gmLose();say('Burnt! 🔥');
  const why=refs.map((t,k)=>{
    const [c,r]=t;
    if(R.pin[k]&&!FH.pins[k])return `${c}${r} was not pinned, so it slid down to ${c}${r+1}, ${c}${r+2} and so on${tsEmpty(c,r+1)?', which are empty':''}.`;
    if(!R.pin[k]&&FH.pins[k])return `${c}${r} was pinned, so every row used ${c}${r} again instead of its own row.`;
    return '';
  }).filter(Boolean).join(' ');
  gmMsg(`Wrong answers (red): ${bad.length} out of 5. ${why} Look at the formulas in the red cells.`,'wrong');
  if(out)return gmGo('See what happened →',()=>gmEnd(0,'The batch is burnt','Too many rows came out wrong. Read the lessons on relative and absolute references again, then have another go.'));
  gmGo('Try this recipe again →',fhRecipe);
}
/* ---------- Formula Bar: type real formulas; the sheet works them out, then a stock check changes a number to test them ---------- */
const FB_START={A1:'Item',B1:'Cost price',C1:'Sell price',D1:'Sold',E1:'Profit',
  A2:'Crisps',B2:0.40,C2:0.80,D2:120,A3:'Juice',B3:0.55,C3:1.00,D3:90,A4:'Apple',B4:0.20,C4:0.50,D4:60,
  A5:'Bar',B5:0.60,C5:1.00,D5:75,A6:'Water',B6:0.30,C6:0.70,D6:110,
  E3:'=(C3-B3)*D3',E4:'=(C4-B4)*D4',E5:'=(C5-B5)*D5',E6:'=(C6-B6)*D6',A7:'Total',A9:'Mean sold',A10:'Highest price',A11:'Lowest sold'};
const FB_NAME={2:'Crisps',3:'Juice',4:'Apple',5:'Bar',6:'Water'},FB_COLN={B:'cost price',C:'sell price',D:'number sold'};
const FB_TICKETS=[
 {cell:'E2',stage:0,ask:'Work out the profit on Crisps: the sell price take away the cost price, then times the number sold.',ref:'=(C2-B2)*D2',dp:2,change:['D2',130]},
 {cell:'D7',stage:1,ask:'Show the total number of items sold. Use a function.',ref:'=SUM(D2:D6)',fn:'SUM',dp:0,change:['D6',95]},
 {cell:'E7',stage:1,ask:'Show the total profit for the week. Use a function.',ref:'=SUM(E2:E6)',fn:'SUM',dp:2,change:['C4',0.60]},
 {cell:'B9',stage:1,ask:'Show the mean (average) number sold for each item. Use a function.',ref:'=AVERAGE(D2:D6)',fn:'AVERAGE',dp:null,change:['D3',100]},
 {cell:'B10',stage:1,ask:'Show the highest sell price. Use a function.',ref:'=MAX(C2:C6)',fn:'MAX',dp:2,change:['C6',1.20]},
 {cell:'B11',stage:1,ask:'Show the lowest number sold. Use a function.',ref:'=MIN(D2:D6)',fn:'MIN',dp:0,change:['D6',40]}];
const FB_FN={SUM:'adds the cells up',AVERAGE:'finds the mean',MAX:'finds the highest value',MIN:'finds the lowest value'};
let FB=null;
function sim_bar(area,finish){
  FB={cells:{...FB_START},i:0,caret:0};
  gmOpen(area,{title:'Formula bar',icon:'🧾',stages:['A formula','Functions'],lives:3,finish,bot:'🧾'});
  gmBanner('The order tickets','Each ticket names a cell and what it must show. Type the formula into the formula bar, or tap the buttons. Tap a cell to put its reference in, or drag down a column for a range. Then a stock check changes a number on the sheet: a cell that holds a real formula changes by itself. A wrong answer costs a life.','🧾 Take the first ticket',fbTicket);
}
/* what a cell shows: a number, text, '' when empty, or an error */
function fbGet(c,r,seen){
  const k=c+r,v=FB.cells[k];if(v===undefined||v==='')return '';
  if(typeof v!=='string'||v[0]!=='=')return v;
  seen=seen||{};if(seen[k])return '#REF!';seen[k]=1;
  const p=gmParse(v);if(p.err)return '#VALUE!';
  const out=gmEval(p.ast,(cc,rr)=>fbGet(cc,rr,{...seen}));return out;
}
const fbDp=k=>{const t=FB_TICKETS.find(t=>t.cell===k);if(t)return t.dp;return {B:2,C:2,D:0,E:2}[k[0]];};
const fbShow=k=>{const c=k[0],r=+k.slice(1),v=fbGet(c,r);if(r===1||typeof v!=='number')return v;return gmShow(v,fbDp(k));};
function fbSheet(){
  const T=FB_TICKETS[FB.i],cols=['A','B','C','D','E'];
  return `<table class="gm-tbl fb-tbl" id="fbT"><tr><th></th>${cols.map(c=>`<th>${c}</th>`).join('')}</tr>
${[1,2,3,4,5,6,7,8,9,10,11].map(r=>`<tr><th>${r}</th>${cols.map((c,ci)=>{const k=c+r,v=FB.cells[k],f=typeof v==='string'&&v[0]==='=';
  return `<td data-c="${ci}" data-r="${r}" id="fb_${k}" class="${r===1||c==='A'?'fh-h':''}${k===T.cell?' fb-t':''}${f?' fb-f':''}${FB.bad&&FB.bad[k]?' fb-bad':''}${FB.ok&&FB.ok[k]?' fb-ok':''}">${k===T.cell&&FB.cells[k]===undefined?'<i>?</i>':fbShow(k)}</td>`;}).join('')}</tr>`).join('')}</table>`;
}
function fbTicket(){
  const T=FB_TICKETS[FB.i];gmStage(T.stage);GM.state='play';gmMsg('');
  $('gmMain').innerHTML=`<div class="gm-q">🧾 Ticket ${FB.i+1} of ${FB_TICKETS.length}: <b>${T.cell}</b>. ${T.ask}</div>
<div class="fh-bar fb-bar"><span class="fh-name">${T.cell}</span><span class="fh-fx">fx</span><input id="fbIn" class="fb-in" type="text" autocomplete="off" autocapitalize="characters" autocorrect="off" spellcheck="false" aria-label="Formula for ${T.cell}" placeholder="Start with ="></div>
<div class="fb-keys" id="fbKeys">${['=','SUM(','AVERAGE(','MAX(','MIN(','(',')',':','+','-','*','/'].map(k=>`<button class="fb-k" data-k="${k}">${k}</button>`).join('')}<button class="fb-k" data-k="del" aria-label="Delete">⌫</button><button class="btn btn-primary fb-enter" id="fbGo">↵ Enter</button></div>
<div class="fh-hint" id="fbHint">Tap a cell to put its reference in. Drag down a column to put in a range, such as D2:D6.</div>
<div class="gm-panel fb-sheet">${fbSheet()}</div>`;
  const inp=$('fbIn');FB.caret=0;
  const keep=()=>{FB.caret=inp.selectionStart??inp.value.length;};
  ['keyup','click','input','select'].forEach(e=>inp.addEventListener(e,keep));
  inp.addEventListener('input',()=>fbHint(''));
  inp.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();fbEnter();}});
  const put=s=>{if(GM.state!=='play')return;
    let v=inp.value,a=Math.min(FB.caret,v.length),b=a;
    if(document.activeElement===inp){a=inp.selectionStart;b=inp.selectionEnd;}
    if(!v.trim()&&s!=='='){v='=';a=b=1;}
    inp.value=v.slice(0,a)+s+v.slice(b);FB.caret=a+s.length;
    if(document.activeElement===inp)inp.setSelectionRange(FB.caret,FB.caret);sfx('tick');};
  document.querySelectorAll('.fb-k').forEach(b=>{b.addEventListener('pointerdown',e=>e.preventDefault());b.onclick=()=>{
    if(b.dataset.k==='del'){if(GM.state!=='play')return;const a=Math.min(FB.caret,inp.value.length);if(a>0){inp.value=inp.value.slice(0,a-1)+inp.value.slice(a);FB.caret=a-1;}if(document.activeElement===inp)inp.setSelectionRange(FB.caret,FB.caret);return;}
    put(b.dataset.k);}});
  $('fbGo').onclick=fbEnter;
  gmGridSelect($('fbT'),{off:()=>GM.state!=='play',done:R=>{put(gmRange(R));}});
}
function fbEnter(){
  if(GM.state!=='play')return;
  const T=FB_TICKETS[FB.i],raw=$('fbIn').value.trim(),c=T.cell[0],r=+T.cell.slice(1);
  if(!raw)return fbHint('Type a formula for '+T.cell+' first. A formula always starts with =.');
  let cellVal;
  if(raw[0]!=='='){
    if(!/^-?\d+(\.\d+)?$/.test(raw.replace(/^£/,'')))return fbHint('A formula always starts with <b>=</b>. Without it, the sheet just shows your typing as words.');
    cellVal=+raw.replace(/^£/,'');FB.fns=[];
  }else{
    const p=gmParse(raw);
    if(p.err)return fbHint('The sheet cannot read this formula. Check that every bracket has a partner, and use * to multiply and / to divide.');
    const refs=gmRefsIn(p.ast);
    if(refs.some(q=>q.c===c&&q.r===r))return fbHint(`A formula cannot use its own cell. ${T.cell} is the cell you are filling in.`);
    const fns=[];(function walk(n){if(!n||typeof n!=='object')return;if(n.t==='fn')fns.push(n.name);['a','b'].forEach(k=>n[k]&&walk(n[k]));(n.args||[]).forEach(walk);})(p.ast);
    const bad=fns.find(f=>!['SUM','AVERAGE','MAX','MIN','IF','VLOOKUP'].includes(f));
    if(bad)return fbHint(`The sheet does not know a function called ${bad}, so the cell would show <b>#NAME?</b>. Check the spelling.`);
    if(T.fn&&!fns.includes(T.fn)&&fbSame(raw,T.ref))return fbHint(`That gives the right answer, but the ticket asks for a function. ${T.fn} ${FB_FN[T.fn]}: use it.`);
    cellVal='='+gmTokens(raw.slice(1)).join('');
    FB.fns=fns;
  }
  GM.state='fb';FB.cells[T.cell]=cellVal;FB.typed=raw;
  $('fbIn').disabled=true;$('fbGo').disabled=true;document.querySelectorAll('.fb-k').forEach(b=>b.disabled=true);
  FB.before=fbGet(c,r);FB.want0=fbRef(T);
  $('fb_'+T.cell).innerHTML=fbShow(T.cell);$('fb_'+T.cell).classList.add('fb-in-cell');sfx('tick');
  setTimeout(()=>fbStock(T),RM?60:700);
}
/* a message beside the formula bar (no life lost); '' puts the usual hint back */
function fbHint(html){const h=$('fbHint');if(!h)return;h.innerHTML=html?'⚠️ '+html:'Tap a cell to put its reference in. Drag down a column to put in a range, such as D2:D6.';h.classList.toggle('warn',!!html);if(html){sfx('bad');h.classList.remove('nudge');void h.offsetWidth;h.classList.add('nudge');}}
/* the right answer, worked out on the sheet as it is now */
function fbRef(T){const p=gmParse(T.ref);return gmEval(p.ast,(c,r)=>fbGet(c,r));}
const fbEq=(a,b)=>typeof a==='number'&&typeof b==='number'?Math.abs(a-b)<1e-9:a===b;
/* does the typed formula always agree with the right one, whatever the numbers? (eight random sheets) */
function fbSame(typed,ref){
  const save=FB.cells,run=f=>{const p=gmParse(f);return p.err?'#VALUE!':gmEval(p.ast,(c,r)=>fbGet(c,r));};let same=true;
  for(let k=0;k<8&&same;k++){
    const t={...save};for(let r=2;r<=6;r++){t['B'+r]=Math.round(Math.random()*90+5)/100;t['C'+r]=Math.round(Math.random()*150+60)/100;t['D'+r]=Math.floor(Math.random()*180)+10;}
    FB.cells=t;if(!fbEq(typeof typed==='number'?typed:run(typed),run(ref)))same=false;
  }
  FB.cells=save;return same;
}
function fbStock(T){
  if(!GM||GM.state!=='fb')return;
  const typed=FB.cells[T.cell],c=T.cell[0],r=+T.cell.slice(1);
  const agrees=()=>fbEq(fbGet(c,r),fbRef(T));
  /* choose the stock check: one that shows a mistake if there is one, otherwise the ticket's own */
  let pick=null;
  if(agrees()){
    const cands=[];for(let rr=2;rr<=6;rr++){const d=FB.cells['D'+rr],cc=FB.cells['C'+rr],b=FB.cells['B'+rr];
      cands.push(['D'+rr,d+25],['D'+rr,Math.max(5,d-35)],['D'+rr,30],['D'+rr,200],['C'+rr,+(cc+0.25).toFixed(2)],['C'+rr,0.10],['C'+rr,2.00],['B'+rr,+(b+0.05).toFixed(2)]);}
    for(const ch of cands){const old=FB.cells[ch[0]];FB.cells[ch[0]]=ch[1];const ok=agrees();FB.cells[ch[0]]=old;if(!ok){pick=ch;break;}}
  }
  if(!pick)pick=T.change;
  const [k,v]=pick,old=FB.cells[k],rr=+k.slice(1);
  FB.cells[k]=v;
  const now=fbGet(c,r),want=fbRef(T),ok=fbEq(now,want)&&typeof typed==='string'&&fbSame(typed,T.ref);
  FB.ok={};FB.bad={};(ok?FB.ok:FB.bad)[T.cell]=1;
  $('gmMain').querySelector('.fb-sheet').innerHTML=fbSheet();
  $('fb_'+k).classList.add('flash');
  const shown=x=>typeof x==='number'?gmShow(x,fbDp(T.cell)):x;
  const what=`🔄 Stock check: ${k} (${FB_NAME[rr]}, ${FB_COLN[k[0]]}) changes from ${gmShow(old,fbDp(k))} to ${gmShow(v,fbDp(k))}.`;
  if(ok){
    sfx('good');say(['Order up! ✅','Spot on!','Ticket done! 🧾'][FB.i%3]);
    gmMsg(`Right. ${T.cell} holds <code>${typed}</code>. ${what} ${fbEq(FB.before,now)?`${T.cell} still shows the right answer, ${shown(now)}.`:`${T.cell} re-calculated by itself: ${shown(FB.before)} became ${shown(now)}.`}`,'correct');
  }else{
    const out=gmLose();say('Wrong order! 😬');
    gmMsg(`${what} ${T.cell} shows ${shown(now)}, but it should show ${shown(want)}. ${fbWhy(T,typed)} One formula that works: <code>${T.ref}</code>.`,'wrong');
    if(out){gmGo('See what happened →',()=>gmEnd(0,'The kitchen closed','Too many tickets went wrong. Read the lessons on formulas and functions again, then have another go.'));return fbShowMsg();}
  }
  if(!ok)FB.cells[T.cell]=T.ref;/* the kitchen fixes the cell, so later tickets that use it still add up */
  FB.i++;
  if(FB.i<FB_TICKETS.length){gmGo('Next ticket →',()=>{FB.ok={};FB.bad={};fbTicket();});return fbShowMsg();}
  fbShowMsg();
  gmGo('Finish →',()=>gmEnd(gmStars(GM.lives,3),'Every order is in','Every ticket is a formula, so the sheet re-calculates by itself whenever a number changes.'));
}
/* on a phone the result sits under the sheet: bring it into view */
function fbShowMsg(){const m=$('gmMsg');if(m&&m.getBoundingClientRect().bottom>innerHeight)m.scrollIntoView({block:'nearest',behavior:RM?'auto':'smooth'});}
/* why a typed answer went wrong, in one sentence */
function fbWhy(T,typed){
  if(typeof typed==='number')return 'You typed a number, not a formula, so it stayed the same when the sheet changed. A formula with cell references re-calculates by itself.';
  const p=gmParse(typed),fns=FB.fns||[],used=fns.find(f=>FB_FN[f]);
  if(T.fn&&used&&used!==T.fn)return `${used} ${FB_FN[used]}, but this ticket needs ${T.fn}, which ${FB_FN[T.fn]}.`;
  if(T.fn&&used===T.fn){const rg=[];(function w(n){if(!n||typeof n!=='object')return;if(n.t==='rng')rg.push(gmRange({c1:n.a.c.charCodeAt(0)-65,r1:n.a.r,c2:n.b.c.charCodeAt(0)-65,r2:n.b.r}));['a','b'].forEach(k=>n[k]&&w(n[k]));(n.args||[]).forEach(w);})(p.ast);
    const right=T.ref.match(/\((.*)\)/)[1];return rg.length&&rg[0]!==right?`Your range is ${rg[0]}. The ticket needs every item, rows 2 to 6: ${right}.`:'Look again at what is inside and outside the brackets.';}
  if(T.cell==='E2'&&/^=C2-B2\*D2$/i.test(typed.replace(/\s/g,'')))return 'Without brackets the sheet multiplies first (B2 times D2), then takes that from C2. Put the take-away in brackets.';
  return 'Check which cells the formula uses.';
}
const ACT={
title:'Tuck Shop Kitchen',icon:'🍪',
intro:'The tuck shop runs on a spreadsheet. Your mission: type the formulas the order tickets ask for, then fill formulas down the sheet so every row works out its own answer.',
topics:'Formulas, SUM, AVERAGE, MAX, MIN, replicating formulas, relative and absolute cell references',
ranks:['Head Chef','Sous Chef','Kitchen Trainee','New Starter — revise and retry'],
next:{href:'activity3.html',label:'Next: Booking Desk'},
teach:[
{teaches:['formula'],html:`<div class="teach-card"><h3>📝 The recipe card: formulas</h3>
<p>A <span class="term">formula</span> is a calculation in a cell. It always starts with <b>=</b> and uses cell references, so it works with whatever numbers are in those cells.</p>
<table class="gm-tbl"><tr><th></th><th>A</th><th>B</th><th>C</th><th>D</th><th>E</th></tr><tr><th>1</th><td>Item</td><td>Cost price</td><td>Sell price</td><td>Sold</td><td>Profit</td></tr><tr><th>2</th><td>Crisps</td><td>0.40</td><td>0.80</td><td>120</td><td><b>48.00</b></td></tr></table>
<p>E2 holds <code>=(C2-B2)*D2</code>: (0.80 − 0.40) × 120 = 48.00. Formulas allow a spreadsheet to perform calculations and <b>automatic re-calculations</b>: change D2 and E2 changes by itself.</p></div>`},
{teaches:['sum','average','max','min'],html:`<div class="teach-card"><h3>📖 The cookbook: four functions</h3>
<p>A <span class="term">function</span> is a ready-made formula. On the tuck shop sheet, for the profits in E2:E6:</p>
<table class="gm-tbl"><tr><th>Function</th><th>What it does</th><th>Answer</th></tr>
<tr><td><code>=SUM(E2:E6)</code></td><td>The cells in the range are added together and the total displayed.</td><td>180.50</td></tr>
<tr><td><code>=AVERAGE(E2:E6)</code></td><td>The cells in the range are added together and the average (the mean) calculated.</td><td>36.10</td></tr>
<tr><td><code>=MAX(E2:E6)</code></td><td>The highest value in the range is returned.</td><td>48.00</td></tr>
<tr><td><code>=MIN(E2:E6)</code></td><td>The lowest value in the range is returned.</td><td>18.00</td></tr></table></div>`},
{teaches:['replicate','relative'],html:`<div class="teach-card"><h3>📠 The photocopier that counts: relative references</h3>
<p>A formula can be copied down a column or across a row using the <b>Fill</b> function: you drag the fill handle, the small square at the corner of the cell. Copying a formula like this is called <span class="term">replication</span> (replicating the formula). A column of answers made by filling one formula down, such as E2:E6, is an example of replication.</p>
<p style="margin-top:8px;">A <span class="term">relative cell reference</span> changes as it is copied, so it always points at the right row: <code>=C2*D2</code> becomes <code>=C3*D3</code>, then <code>=C4*D4</code>, and so on.</p>
<div class="tip-box">Exam focus (2021): the formula can be dragged down and the row numbers change automatically to match the row being used. “Saves time” on its own does not get the mark.</div></div>`},
{teaches:['absolute'],html:`<div class="teach-card"><h3>📌 The drawing pin: absolute references</h3>
<p>Sometimes a cell reference must stay the same when it is copied. This is an <span class="term">absolute cell reference</span>, written with $ signs: <code>$I$1</code>. It stays fixed on a specific cell, even when the formula is copied to other cells.</p>
<p style="margin-top:8px;">Example: converting pounds into euros, every row multiplies by the same exchange rate in B1, so the rate cell is pinned: <code>=C2*$B$1</code>. Filled down, it becomes <code>=C3*$B$1</code>, then <code>=C4*$B$1</code>: C changes row by row, $B$1 stays the same.</p>
<p style="margin-top:8px;">If the rate cell is not pinned, it slides down too: <code>=C3*B2</code>, then <code>=C4*B3</code>. Every row after the first uses the wrong cell for the rate, so the answers go wrong.</p>
<p style="margin-top:8px;">A <b>running total</b> pins only the <b>start</b> of a range: <code>=SUM($D$2:D2)</code>. Filled down, it becomes <code>=SUM($D$2:D3)</code>, then <code>=SUM($D$2:D4)</code>: the range always starts at D2 and grows by one row each time, so each row adds up everything sold so far.</p>
<div class="tip-box">Exam focus (2019): two marks, two halves. The cell reference <b>stays the same</b> [1] <b>when the formula is copied</b> [1].</div></div>`}
],
rounds:[
{title:'Formula Bar',teachAt:[0,1],mode:'sim',sim:'bar',heading:'Type the formula each ticket asks for',tip:'Start with =. Use cell references, not the numbers you can see, so the sheet re-calculates by itself. SUM adds up, AVERAGE finds the mean, MAX finds the highest, MIN finds the lowest.',tasks:[]},
{title:'Fill Handle',teachAt:[2,3],mode:'sim',sim:'fill',heading:'Pin the right references, then fill down',tip:'Ask of each reference: should every row use this same cell? If yes, pin it with $. If each row needs its own cell, leave it relative.',tasks:[]},
{title:'Exam Room',heading:'Real CCEA exam questions',teachAt:[1,3],boss:{icon:'🧁',name:'The Burnt Batch'},tip:'Write formulas with = and cell references. For an absolute reference, say it stays the same when the formula is copied.',
 tasks:[],pool:[[[PP.form2019b,PP.form2022c,PP.form2023b2,PP.form2024b,PP.form2026c],2],[[PP.rep2021c,PP.rep2022d,PP.rep2026d],2],
  [[PP.fn2018b,PP.fn2021b,PP.fn2021g2,PP.fn2023b1,PP.fn2024a,PP.fn2024d,PP.fn2025d,PP.fn2026e],3],[[PP.abs2018c3,PP.abs2019c,PP.abs2023c],1],[[PP.abs2021d,PP.abs2024e,PP.abs2026a],2]]}
]};
