/* Activity 3 — Booking Desk. HQ_GAME_DESIGN 3 (deck section C). Sources: TB p18, TB p19; PP 2022 Q3(g)(ii) (#N/A), 2018 Q7(c)(ii) (the advantage), IF and VLOOKUP rows 2018 to 2025. */
/* the lookup table is the textbook's A17:C23 (TB p18): a heading row, then six activities. The booking sheet above it is ours. */
const MR_MENU=[['A001','Archery',40],['A002','Paintball',50],['A003','Quad Biking',65],['A004','Rafting',75],['A005','Horse Riding',90],['A006','Karting',100]];
const MR_HEAD=['Activity Number','Activity','Activity Cost'];
const MR_COLN=['','Activity Number','Activity','Activity Cost'];
const MR_TAB='$A$18:$C$23';
const MR_ROWS=[1,2,3,4,5,6,7,8,0,17,18,19,20,21,22,23];
const mrF=(r,col)=>`=VLOOKUP(B${r},${MR_TAB},${col})`;
let MR=null;
/* a booking sheet: rows 1 to 8 hold the bookings and the total, rows 17 to 23 the menu */
function mrCells(people,colC,colD,menu){
  const s={A1:'Name',B1:'Code',C1:'Activity',D1:'Cost',C8:'Total',D8:'=SUM(D2:D7)'};
  people.forEach(([n,code],k)=>{const r=k+2;s['A'+r]=n;s['B'+r]=code;s['C'+r]=colC(r);s['D'+r]=colD(r);});
  if(menu)Object.assign(s,menu);
  else{MR_HEAD.forEach((h,c)=>s['ABC'[c]+'17']=h);MR_MENU.forEach((m,k)=>m.forEach((v,c)=>s['ABC'[c]+(18+k)]=v));}
  return s;
}
/* what a cell shows, worked out like a spreadsheet (common.js formula engine) */
function mrGet(c,r,seen){
  const k=c+r,v=MR.cells[k];if(v===undefined||v==='')return '';
  if(typeof v==='string'&&v[0]==='='){seen=seen||new Set();if(seen.has(k))return 0;seen.add(k);
    const p=gmParse(v),out=p.err?'#NAME?':gmEval(p.ast,(c2,r2)=>mrGet(c2,r2,seen));seen.delete(k);return out;}
  return v;
}
/* money as the textbook prints it: the menu in whole pounds, the bookings with pence */
function mrShow(k){const r=+k.slice(1),v=mrGet(k[0],r);if(typeof v==='boolean')return v?'TRUE':'FALSE';
  return typeof v==='number'?(r>=17?'£'+v:'£'+v.toFixed(2)):v;}
const mrFx=k=>typeof MR.cells[k]==='string'&&MR.cells[k][0]==='=';
/* the row VLOOKUP lands on, as Excel does with three parts: the last code in column A that is not bigger than the one looked up */
function mrAt(code){let hit=-1;for(let k=0;k<6;k++){const v=MR.cells['A'+(18+k)];if(typeof v!==typeof code)continue;if(v.toUpperCase()<=code.toUpperCase())hit=k;else break;}return hit;}
function mrTd(k){
  const r=+k.slice(1),head=r===1||r===17||k==='C8',v=MR.cells[k],got=v===undefined?'':mrGet(k[0],r);
  const cls=[head?'fh-h':'',typeof got==='number'?'n':'',gmIsErr(got)?'e':'',mrFx(k)?'mr-fx':'',MR.base[k]||'',MR.cls[k]||''].filter(Boolean).join(' ');
  const txt=MR.ask===k?'<i>?</i>':MR.hide.has(k)?'':v===undefined?'':mrShow(k);
  if(head||v===undefined)return `<td class="${cls}">${txt}</td>`;
  return `<td class="${cls}"><button class="mr-c" data-k="${k}"${MR.on&&MR.on(k)?'':' disabled'}>${txt}</button></td>`;
}
function mrRender(){
  /* the total stays hidden until every cost is known, unless one of them is already an error */
  if(MR.stage===0){const ds=[2,3,4,5,6,7].map(r=>'D'+r),err=ds.some(k=>!MR.hide.has(k)&&gmIsErr(mrGet(k[0],+k.slice(1))));
    if(err||ds.every(k=>!MR.hide.has(k)))MR.hide.delete('D8');}
  $('mrPane').innerHTML=`<table class="gm-tbl mr-sheet${MR.stage?' quiet':''}"><tr><th></th>${['A','B','C','D'].map(c=>`<th>${c}</th>`).join('')}</tr>
${MR_ROWS.map(r=>r===0?`<tr class="mr-gap"><th>⋮</th><td colspan="4"></td></tr>`:`<tr><th>${r}</th>${['A','B','C','D'].map(c=>mrTd(c+r)).join('')}</tr>`).join('')}</table>`;
}
/* the screen: question, formula bar, optional keys and hint, the sheet */
function mrDraw(q,name,bar,extra){
  $('gmMain').innerHTML=`<div class="gm-q" id="mrQ">${q}</div>
<div class="fh-bar mr-bar"><span class="fh-name" id="mrName">${name}</span><span class="fh-fx">fx</span>${bar}</div>${extra||''}
<div class="gm-panel mr-pane" id="mrPane"></div>`;
  $('mrPane').onclick=e=>{const b=e.target.closest('.mr-c');if(b&&!b.disabled&&MR.pick)MR.pick(b.dataset.k);};
  mrRender();
}
function mrOut(){gmGo('See what happened →',()=>gmEnd(0,'The booking desk closed','Too many look-ups went wrong. Read the lesson on VLOOKUP again, then have another go.'));}

/* ---------- stage 1: run each VLOOKUP by hand ---------- */
function sim_menu(area,finish){
  const list=gmShuffle([['Aoife','A003',3],['Ben','A001',2],['Cara','A004',3],['Eve','A006',2],['Finn','A004',3]]);
  /* Dan's code has a zero where the A should be; he sits in row 4, 5 or 6 */
  list.splice(2+Math.floor(Math.random()*3),0,['Dan','0004',3]);
  MR={i:0,stage:0,cls:{},base:{},hide:new Set(),ask:null,on:null,pick:null,list:list.map(([name,code,col],k)=>({name,code,col,row:k+2}))};
  MR.cells=mrCells(MR.list.map(x=>[x.name,x.code]),r=>mrF(r,2),r=>mrF(r,3));
  [2,3,4,5,6,7].forEach(r=>{MR.hide.add('C'+r);MR.hide.add('D'+r);});MR.hide.add('D8');
  gmOpen(area,{title:'The booking desk',icon:'🪧',stages:['Run the bookings','The price changes','Fix the look-ups'],lives:3,finish,bot:'🧭'});
  gmBanner('Activity day bookings','Every activity and cost on the booking sheet is a VLOOKUP into the menu in rows 17 to 23. Do what each formula does: go down the first column of the menu to find the code, then across to the column the formula asks for. If the code is not in the first column, press #N/A. A wrong pick costs a life.','🪧 Open the booking desk',mrBooking);
}
const mrK=x=>(x.col===3?'D':'C')+x.row;
function mrBooking(){
  gmStage(0);GM.state='play';gmMsg('');
  const x=MR.list[MR.i],k=mrK(x);MR.ask=k;MR.cls={['B'+x.row]:'key',[k]:'top'};
  MR.on=q=>/^A(1[89]|2[0-3])$/.test(q);MR.pick=q=>mrRow(+q.slice(1)-18);
  mrDraw(`🪧 Booking ${MR.i+1} of ${MR.list.length}: <b>${x.name}</b>, code <b>${x.code}</b> in B${x.row}. Cell ${k} holds the formula above. Go down column A of the menu and click ${x.code}. If it is not there, press #N/A.`,
    k,`<span class="mr-f" id="mrF"><span class="mr-on">=VLOOKUP(B${x.row},</span><span class="mr-off">${MR_TAB},${x.col})</span></span>`,
    `<div class="gm-btns mr-na"><button class="btn btn-ghost" id="mrNA">#N/A: not in column A</button></div>`);
  $('mrNA').onclick=()=>mrRow(-1);
}
/* the booking's two cells now show what the spreadsheet works out; the asked cell is marked right or wrong */
function mrReveal(x,ok){
  MR.ask=null;MR.on=null;const k=mrK(x),o=(x.col===3?'C':'D')+x.row;
  MR.hide.delete(k);MR.hide.delete(o);
  MR.base[k]=ok?(gmIsErr(mrGet(k[0],x.row))?'na':'ok'):'bad';
  if(gmIsErr(mrGet(o[0],x.row)))MR.base[o]='na';
}
function mrRow(k){
  if(GM.state!=='play')return;
  const x=MR.list[MR.i],at=mrAt(x.code),cell=mrK(x);
  $('mrNA').disabled=true;
  if(k===at&&at>=0){
    sfx('tick');MR.cls={['B'+x.row]:'key',[cell]:'top'};['A','B','C'].forEach(c=>MR.cls[c+(18+k)]='found');
    MR.on=q=>+q.slice(1)===18+k&&/^[ABC]/.test(q);MR.pick=q=>mrCol(' ABC'.indexOf(q[0]),q);
    $('mrQ').innerHTML=`🪧 Found ${x.code} in row ${18+k}. The formula ends in <b>,${x.col})</b>, so go across to column ${x.col} of the table and click that cell.`;
    $('mrF').innerHTML=`<span class="mr-off">=VLOOKUP(B${x.row},${MR_TAB},</span><span class="mr-on">${x.col})</span>`;
    return mrRender();
  }
  GM.state='fb';
  if(k===at){
    mrReveal(x,true);MR.cls={};mrRender();sfx('good');say('Good catch! 🔎');
    gmMsg(`Right. ${x.code} is not in column A of the menu, so VLOOKUP finds no match and both C${x.row} and D${x.row} show <b>#N/A</b>. D8 adds up D2:D7, and one of them is an error, so the total shows #N/A too.`,'correct');
    return mrFixDan(x);
  }
  mrReveal(x,false);MR.cls={};
  if(k>=0)MR.cls['A'+(18+k)]='bad-pick';
  if(at>=0)['A','B','C'].forEach(c=>MR.cls[c+(18+at)]=(MR.cls[c+(18+at)]?MR.cls[c+(18+at)]+' ':'')+'miss');
  mrRender();
  const out=gmLose(),picked=k>=0?MR.cells['A'+(18+k)]:'';say('Wrong row! 😬');
  gmMsg(at<0?`You picked ${picked} in row ${18+k}, but B${x.row} holds ${x.code}, which is not in column A of the menu. VLOOKUP finds no match, so ${cell} shows <b>#N/A</b>, and so does the total in D8.`
    :k<0?`${x.code} is in column A, in row ${18+at}, so VLOOKUP finds it: ${cell} shows <b>${mrShow(cell)}</b>, not #N/A.`
    :`You picked ${picked} in row ${18+k}, but B${x.row} holds ${x.code}. VLOOKUP finds ${x.code} in row ${18+at}, so ${cell} shows <b>${mrShow(cell)}</b>.`,'wrong');
  if(out)return mrOut();
  if(at<0)return mrFixDan(x);
  mrNext();
}
/* Dan's code is mended, and his row and the total work again */
function mrFixDan(x){
  gmGo(`✏️ Change B${x.row} to A004`,()=>{
    if(!GM)return;GM.state='fb';x.code='A004';MR.cells['B'+x.row]='A004';
    ['B','C','D'].forEach(c=>{delete MR.base[c+x.row];MR.cls[c+x.row]='flash';});
    MR.cls.D8='flash';mrRender();sfx('good');
    gmMsg(`B${x.row} now holds A004: a zero had been typed where the letter A should be. Both look-ups find Rafting in row 21, and D8 is no longer an error.`,'correct');
    mrNext();
  });
}
function mrCol(c,q){
  if(GM.state!=='play')return;GM.state='fb';
  const x=MR.list[MR.i],cell=mrK(x),ok=c===x.col,o=(x.col===3?'C':'D')+x.row;
  mrReveal(x,ok);MR.cls={[q]:ok?'good-pick':'bad-pick'};mrRender();
  $('mrF').innerHTML=`<span class="mr-on">${mrF(x.row,x.col)}</span>`;
  if(ok){sfx('good');say(['Booked! ✅','Spot on!','Sorted!'][MR.i%3]);
    gmMsg(`Right. Column ${x.col} of the table is ${MR_COLN[x.col]}, so ${cell} shows <b>${mrShow(cell)}</b>. ${o} holds the same formula ending in <b>,${x.col===3?2:3})</b>, so it shows ${mrShow(o)}.`,'correct');
    return mrNext();}
  const out=gmLose();say('Wrong column! 😬');
  gmMsg(`You picked column ${c}, ${MR_COLN[c]}. The formula ends in <b>,${x.col})</b>, so it reads column ${x.col}, ${MR_COLN[x.col]}: ${cell} shows <b>${mrShow(cell)}</b>.`,'wrong');
  if(out)return mrOut();
  mrNext();
}
function mrNext(){
  MR.i++;
  if(MR.i<MR.list.length)return gmGo('Next booking →',mrBooking);
  mrRender();
  $('gmMsg').insertAdjacentHTML('beforeend',`<div class="feedback-box">Every booking is looked up. D8 adds up D2:D7: <b>${mrShow('D8')}</b>.</div>`);
  gmGo('📞 A phone call →',mrPhone);
}

/* ---------- stage 2: one price changes in the menu ---------- */
function mrPhone(){
  gmStage(1);GM.state='play';gmMsg('');MR.stage=1;MR.cls={};MR.base={};MR.ask=null;MR.hide=new Set();
  MR.before={};[2,3,4,5,6,7,8].forEach(r=>MR.before[r]=mrGet('D',r));
  MR.on=()=>true;MR.pick=mrPhonePick;
  mrDraw('📞 The rafting company phones: from today, Rafting costs £80. Click the cell that holds the rafting price, then type the new price.','',
    '<span class="mr-f" id="mrF"></span>');
}
function mrPhonePick(q){
  if(GM.state!=='play')return;
  const v=MR.cells[q],r=+q.slice(1),who=MR.cells['A'+r];
  $('mrName').textContent=q;$('mrF').textContent=String(v);
  if(q==='C21'){
    MR.on=null;MR.cls={C21:'top'};mrRender();gmMsg('');
    $('mrF').outerHTML=`<input id="mrIn" class="fb-in" type="text" inputmode="decimal" autocomplete="off" spellcheck="false" aria-label="New value for C21" placeholder="Type the new price">`;
    $('mrPane').insertAdjacentHTML('beforebegin','<div class="fb-keys"><button class="btn btn-primary fb-enter" id="mrGo">↵ Enter</button></div><div class="fh-hint" id="mrHint" data-def="Type the new price, then press Enter.">Type the new price, then press Enter.</div>');
    const go=()=>mrPhoneEnter();$('mrGo').onclick=go;
    $('mrIn').addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();go();}});
    $('mrIn').addEventListener('input',()=>mrHint(''));
    $('mrIn').focus({preventScroll:true});
    return;
  }
  MR.cls={[q]:'bad-pick'};mrRender();
  const out=gmLose();say('Not that cell! 😬');
  let why;
  if(/^D[2-7]$/.test(q))why=`${q} holds the formula <code>${v}</code>. Typing 80 there would wipe out the formula for ${who} only: the other rafting bookings would still say £75.00, and the next price change would not reach ${q}. Change the price in the menu instead.`;
  else if(/^C[2-7]$/.test(q))why=`${q} holds <code>${v}</code>, which shows ${who}’s activity, not a price.`;
  else if(q==='D8')why='D8 holds <code>=SUM(D2:D7)</code>, the total. Change the price, and the total follows.';
  else if(/^C(1[89]|2[0-3])$/.test(q))why=`${q} is the cost of ${MR.cells['B'+r]} (${MR.cells['A'+r]}). Rafting is A004, in row 21.`;
  else if(r>=18)why=`${q} holds ${v}, not a price. The prices are in column C of the menu.`;
  else why=`${q} is part of a booking, not the menu. The prices are in the menu, rows 18 to 23.`;
  gmMsg(why,'wrong');
  if(out)return mrOut();
}
function mrHint(html,def){const h=$('mrHint');if(!h)return;h.innerHTML=html?'⚠️ '+html:(def||h.dataset.def||'');h.classList.toggle('warn',!!html);if(html){sfx('bad');h.classList.remove('nudge');void h.offsetWidth;h.classList.add('nudge');}}
function mrPhoneEnter(){
  if(GM.state!=='play')return;
  const raw=$('mrIn').value.trim();
  if(!raw)return mrHint('Type the new price first.');
  if(raw[0]==='=')return mrHint('The price is a plain number, not a formula. Type the number only.');
  const n=+raw.replace(/^£/,'');
  if(!isFinite(n))return mrHint('Type the price as a number, such as 80.');
  if(n!==80)return mrHint('The rafting company said £80.');
  GM.state='fb';$('mrIn').disabled=true;$('mrGo').disabled=true;
  MR.cells.C21=80;MR.cls={C21:'flash'};mrRender();sfx('tick');
  setTimeout(()=>{
    if(!GM)return;
    const moved=[2,3,4,5,6,7].filter(r=>mrGet('D',r)!==MR.before[r]);
    MR.cls={C21:'flash'};moved.concat(8).forEach(r=>MR.cls['D'+r]='flash');mrRender();sfx('good');say('Every booking updated! 📞');
    const names=moved.map(r=>`${MR.cells['A'+r]} (D${r})`),list=names.length>1?names.slice(0,-1).join(', ')+' and '+names[names.length-1]:names[0];
    mrHint('','');$('mrHint').hidden=true;
    gmMsg(`C21 now holds 80. ${list} changed from £75.00 to £80.00, and the total in D8 went from £${MR.before[8].toFixed(2)} to ${mrShow('D8')}. Nobody retyped a booking: each cost is looked up from the menu, so one change to the menu reached every rafting booking.`,'correct');
    gmGo('🛠️ The trainee’s sheets →',()=>mrJob(0));
  },RM?50:700);
}

/* ---------- stage 3: fix the trainee's look-ups ---------- */
const MR_JOBS=[
 {day:'Monday',cell:'C2',want:2,draft:'=VLOOKUP(B2,$A$18:$C$23,3)',people:[['Gina','A005'],['Hugo','A002'],['Isla','A006'],['Jack','A001'],['Kate','A003'],['Liam','A004']],
  done:'Fixed. Column 2 of the menu is Activity, so C2 to C7 now show the activity names. Column 3, Activity Cost, belongs in column D.'},
 {day:'Tuesday',cell:'D2',want:3,draft:'=VLOOKUP(B$2,$A$18:$C$23,3)',people:[['Maya','A004'],['Noah','A001'],['Orla','A006'],['Paddy','A002'],['Quinn','A004'],['Ruby','A005']],
  done:'Fixed. Without a $ before the 2, B2 becomes B3, B4 and so on as the formula is filled down, so every row looks up its own code. Only the table needs pinning.'},
 {day:'Wednesday',cell:'D2',want:3,draft:'=VLOOKUP(B2,A18:C23,3)',people:[['Sam','A002'],['Tara','A005'],['Uma','A001'],['Vic','A004'],['Will','A003'],['Zoe','A005']],
  done:'Fixed. The $ signs pin the table to A18:C23 in every row. Without them the table slid down a row each time the formula was filled down, and lost the codes at the top.'}
];
const MR_KEYS=['$',',',':','(',')','1','2','3'];
function mrRefVal(r){const p=gmParse(mrF(r,MR_JOBS[MR.j].want));return gmEval(p.ast,(c,rr)=>mrGet(c,rr));}
function mrMark(){const J=MR_JOBS[MR.j],col=J.cell[0];MR.base={};[2,3,4,5,6,7].forEach(r=>MR.base[col+r]=mrGet(col,r)===mrRefVal(r)?'':'bad');}
function mrJob(j){
  const J=MR_JOBS[j],col=J.cell[0];MR.j=j;MR.stage=2;gmStage(2);GM.state='play';gmMsg('');
  const menu={};for(let r=17;r<=23;r++)['A','B','C'].forEach(c=>menu[c+r]=MR.cells[c+r]);
  MR.cells=mrCells(J.people,r=>col==='C'?gmShift(J.draft,r-2):mrF(r,2),r=>col==='D'?gmShift(J.draft,r-2):mrF(r,3),menu);
  MR.hide=new Set();MR.ask=null;MR.cls={[J.cell]:'top'};mrMark();
  MR.on=q=>/^[CD][2-8]$/.test(q);MR.pick=mrPeek;
  const def=`Tap a cell in column C or D to see its formula.`;
  mrDraw(`🛠️ Sheet ${j+1} of 3: ${J.day}. The trainee typed a formula into ${J.cell} and filled it down to ${col}7, but the red cells are wrong. Find out why, then fix the formula in ${J.cell} and press Enter to fill it down again.`,
    J.cell,`<input id="mrIn" class="fb-in" type="text" autocomplete="off" autocapitalize="characters" autocorrect="off" spellcheck="false" aria-label="Formula for ${J.cell}" value="${J.draft}">`,
    `<div class="fb-keys">${MR_KEYS.map(k=>`<button class="fb-k" data-k="${k}">${k}</button>`).join('')}<button class="fb-k" data-k="left" aria-label="Move left">←</button><button class="fb-k" data-k="right" aria-label="Move right">→</button><button class="fb-k" data-k="del" aria-label="Delete">⌫</button><button class="btn btn-primary fb-enter" id="mrGo">↵ Enter</button></div>
<div class="fh-hint" id="mrHint" data-def="${def}">${def}</div>`);
  const inp=$('mrIn');MR.caret=inp.value.length;
  const keep=()=>{MR.caret=inp.selectionStart??inp.value.length;};
  ['keyup','click','input','select'].forEach(e=>inp.addEventListener(e,keep));
  inp.addEventListener('input',()=>mrHint(''));
  inp.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();mrFixEnter();}});
  const setC=c=>{MR.caret=Math.max(0,Math.min(inp.value.length,c));if(document.activeElement===inp)inp.setSelectionRange(MR.caret,MR.caret);};
  document.querySelectorAll('.fb-k').forEach(b=>{b.addEventListener('pointerdown',e=>e.preventDefault());b.onclick=()=>{
    if(GM.state!=='play')return;const k=b.dataset.k;let a=Math.min(MR.caret,inp.value.length),z=a;
    if(document.activeElement===inp){a=inp.selectionStart;z=inp.selectionEnd;}
    if(k==='left')return setC(a-1);if(k==='right')return setC(z+1);
    if(k==='del'){if(z>a){inp.value=inp.value.slice(0,a)+inp.value.slice(z);return setC(a);}if(a>0){inp.value=inp.value.slice(0,a-1)+inp.value.slice(a);setC(a-1);}return;}
    inp.value=inp.value.slice(0,a)+k+inp.value.slice(z);setC(a+k.length);sfx('tick');mrHint('');}});
  $('mrGo').onclick=mrFixEnter;
}
function mrFindVL(n){if(!n||typeof n!=='object')return null;if(n.t==='fn'&&n.name==='VLOOKUP')return n;
  for(const x of [n.a,n.b,...(n.args||[])]){const f=mrFindVL(x);if(f)return f;}return null;}
/* tapping a cell shows its formula and lights up what it uses */
function mrPeek(q){
  const v=MR.cells[q],J=MR_JOBS[MR.j];MR.cls={[J.cell]:'top'};
  if(!mrFx(q)){mrRender();return;}
  const p=gmParse(v),vl=p.ast&&mrFindVL(p.ast);let note='';
  if(vl){const a=vl.args[0],t=vl.args[1];
    if(a&&a.t==='ref')MR.cls[a.c+a.r]='key';
    if(t&&t.t==='rng'){const r1=Math.min(t.a.r,t.b.r),r2=Math.max(t.a.r,t.b.r);
      for(let r=r1;r<=Math.min(r2,23);r++)['A','B','C'].forEach(c=>{if(MR.cells[c+r]!==undefined||r>=17)MR.cls[c+r]=(MR.cls[c+r]?MR.cls[c+r]+' ':'')+'rng';});
      const e1=Math.max(24,r1);if(r2>23)note=e1===r2?` Row ${r2} is empty.`:` Rows ${e1} to ${r2} are empty.`;}
  }else if(p.ast){const g=gmRefsIn(p.ast);for(let i=0;i+1<g.length;i+=2)for(let r=g[i].r;r<=g[i+1].r;r++)MR.cls[g[i].c+r]='rng';}
  MR.cls[q]=(MR.cls[q]?MR.cls[q]+' ':'')+'peek';mrRender();
  $('mrHint').classList.remove('warn');$('mrHint').innerHTML=`👆 ${q} holds <code>${v}</code>.${note}`;
}
function mrFixEnter(){
  if(GM.state!=='play')return;
  const J=MR_JOBS[MR.j],raw=$('mrIn').value.trim(),col=J.cell[0];
  if(!raw)return mrHint(`Type a formula for ${J.cell}. A formula always starts with =.`);
  if(raw[0]!=='=')return mrHint('A formula always starts with <b>=</b>.');
  const p=gmParse(raw);
  if(p.err)return mrHint('The sheet cannot read this formula. Check the commas, and that every bracket has a partner.');
  if(!mrFindVL(p.ast))return mrHint(`Column ${col} needs a VLOOKUP into the menu, like the trainee’s.`);
  if(gmRefsIn(p.ast).some(q=>q.c===col&&q.r===2))return mrHint(`A formula cannot use its own cell. ${J.cell} is the cell you are fixing.`);
  const norm=f=>gmTokens(f.slice(1)).join('');
  if(norm(raw)===norm(J.draft))return mrHint('That is still the trainee’s formula. Tap a red cell to see its formula, compare it with the menu, then change what is wrong.');
  const rule=mrRule(mrFindVL(p.ast));
  if(rule){const out=gmLose();say('Not the menu 😬');gmMsg(rule,'wrong');if(out){GM.state='fb';$('mrIn').disabled=true;return mrOut();}return;}
  GM.state='fb';$('mrIn').disabled=true;$('mrGo').disabled=true;document.querySelectorAll('.fb-k').forEach(b=>b.disabled=true);
  const f0='='+norm(raw);MR.typed=f0;MR.cls={};let r=2;
  const step=()=>{
    if(!GM)return;
    MR.cells[col+r]=gmShift(f0,r-2);const ok=mrGet(col,r)===mrRefVal(r);
    MR.base[col+r]=ok?'ok':'bad';MR.cls={[col+r]:'drop'};mrRender();sfx('tick');
    r++;if(r<=7)setTimeout(step,RM?0:170);else setTimeout(mrFixJudge,RM?30:320);
  };
  step();
}
function mrFixJudge(){
  if(!GM)return;
  const J=MR_JOBS[MR.j],col=J.cell[0],bad=[2,3,4,5,6,7].filter(r=>MR.base[col+r]==='bad');
  MR.cls={};mrRender();
  if(!bad.length){
    sfx('good');say(['Fixed! 🛠️','Sorted! ✅','Nailed it!'][MR.j]);
    const t=mrFindVL(gmParse(MR.typed).ast).args[1],full=t.a.ac&&t.a.ar&&t.b.ac&&t.b.ar,rows=t.a.ar&&t.b.ar;
    const note=full?'':rows?' Your table pins only the row numbers. That works, because only the row numbers move when a formula is filled down, but the exam writes it as $A$18:$C$23.'
      :` It worked on this sheet, but one end of your table has no $ before its row number, so the table grows as the formula is filled down. Pin both ends: $A$18:$C$23.`;
    gmMsg(J.done+note,'correct');
    if(MR.j<MR_JOBS.length-1)return gmGo('Next sheet →',()=>mrJob(MR.j+1));
    return gmGo('Finish →',()=>gmEnd(gmStars(GM.lives,3),'Every booking sheet fixed','You ran the look-ups by hand, saw one price change reach every booking, and fixed three broken VLOOKUPs.'));
  }
  const out=gmLose();say('Still wrong 😬');
  gmMsg(mrWhy(J,bad[0]),'wrong');
  if(out)return mrOut();
  GM.state='play';$('mrIn').disabled=false;$('mrGo').disabled=false;document.querySelectorAll('.fb-k').forEach(b=>b.disabled=false);
}
const mrRs=n=>(n.ac?'$':'')+n.c+(n.ar?'$':'')+n.r;
/* a table that is not the menu alone is judged by the rule before it is filled down: VLOOKUP needs the codes in order
   in its first column, and with headings, names or bookings mixed in, a spreadsheet's answer is not one we should show */
function mrRule(vl){
  const tb=vl.args[1];if(!tb||tb.t!=='rng')return vl.args.length<3?null:'The second part is the menu, written as a range such as $A$18:$C$23.';
  const c1=tb.a.c<tb.b.c?tb.a.c:tb.b.c,r1=Math.min(tb.a.r,tb.b.r),yours=mrRs(tb.a)+':'+mrRs(tb.b);
  if(c1!=='A')return `VLOOKUP searches down the first column of the table, so the table must start in column A, where the codes are. Your table, ${yours}, starts in column ${c1}.`;
  if(r1===17)return `Your table, ${yours}, starts in row 17, which holds the headings. The table is the list itself, without its headings: rows 18 to 23.`;
  if(r1<17)return `Your table, ${yours}, starts in row ${r1}, above the menu, so it takes in the booking sheet as well. The table is the menu only: rows 18 to 23.`;
  const r2=Math.max(tb.a.r,tb.b.r);
  if(r1===18&&r2<23){const miss=MR_MENU.slice(r2-17).map(m=>`${m[1]} (${m[0]})`);
    return `Your table, ${yours}, stops at row ${r2}, so it leaves out ${miss.length>1?miss.slice(0,-1).join(', ')+' and '+miss[miss.length-1]:miss[0]}. A booking for ${miss.length>1?'any of these':'it'} would get the wrong answer. The table is the whole menu: rows 18 to 23.`;}
  return null;
}
/* why the first red row is wrong, from the formula the pupil typed */
function mrWhy(J,r0){
  const col=J.cell[0],vl=mrFindVL(gmParse(MR.typed).ast),A=vl.args,lv=A[0],tb=A[1],ci=A[2],code=MR.cells['B'+r0],got=mrGet(col,r0);
  const there=`${col}${r0} holds <code>${MR.cells[col+r0]}</code> and shows ${got===''?'nothing':mrShow(col+r0)}.`;
  if(A.length<3||A.length>4)return `A VLOOKUP has three parts: the value to look up, the table, and the column number. ${there}`;
  if(!lv||lv.t!=='ref'||lv.c!=='B'||lv.r!==2)return `The value to look up is the booking’s code, and in row 2 that is B2. ${there}`;
  if(lv.ar)return `B$2 has a $ before the 2, so it stays B2 when the formula is filled down. Every row looks up B2’s code (${MR.cells.B2}) and shows the same thing. ${there}`;

  const c1=tb.a.c<tb.b.c?tb.a.c:tb.b.c,c2=tb.a.c<tb.b.c?tb.b.c:tb.a.c,r1=Math.min(tb.a.r,tb.b.r),r2=Math.max(tb.a.r,tb.b.r);
  if(r1!==18||r2<23)return `The table must be the whole menu, rows 18 to 23. Yours is ${mrRs(tb.a)}:${mrRs(tb.b)}. ${there}`;
  if(!(tb.a.ar&&tb.b.ar)){const sh=mrFindVL(gmParse(MR.cells[col+r0]).ast).args[1];
    return `Filled down, a table without $ signs slides down too. In row ${r0} it has become ${sh.a.c}${sh.a.r}:${sh.b.c}${sh.b.r}${got==='#N/A'?`, which no longer holds ${code}, so ${col}${r0} shows #N/A`:''}. Pin the table with $ signs: $A$18:$C$23.`;}
  const wide=c2.charCodeAt(0)-c1.charCodeAt(0)+1;
  if(ci&&ci.t==='n'&&ci.v===J.want&&wide<J.want)return `Your table, ${mrRs(tb.a)}:${mrRs(tb.b)}, has only ${wide} column${wide>1?'s':''}, so column ${J.want} is past its end and gives #REF!. The menu runs from column A to column C. ${there}`;
  if(!ci||ci.t!=='n'||ci.v!==J.want){const n=ci&&ci.t==='n'?ci.v:null;
    return `${n!=null&&n>=1&&n<=3?`Column ${n} of the menu is ${MR_COLN[n]}.`:n!=null&&n>3?`The menu has only 3 columns, so column ${n} gives #REF!.`:'The last part is the column number.'} Column ${col} wants the ${col==='C'?'activity':'cost'}, which is column ${J.want} of the menu. ${there}`;}
  return `${there} Compare it with the menu.`;
}

const ACT={
title:'Booking Desk',icon:'🪧',
intro:'The activity day needs a booking desk that never charges the wrong price. Your mission: decide which way an IF goes, run VLOOKUPs by hand on a live menu, and fix a trainee’s broken look-ups.',
topics:'IF statements, nested IF, VLOOKUP, lookup tables, #N/A',
ranks:['Head of Bookings','Senior Booker','Booking Trainee','New Starter — revise and retry'],
next:{href:'activity4.html',label:'Next: Safe Sheet'},
teach:[
{teaches:['if','operators'],html:`<div class="teach-card"><h3>🪧 The signpost: IF</h3>
<p>The <span class="term">IF</span> statement examines a condition, resulting in one of two actions: IF the condition is true THEN do one thing, ELSE do the other.</p>
<p style="margin-top:8px;">In the textbook, H2 holds <code>=IF(E2&lt;=150,"10%","20%")</code>: a Group Cost of £150 or less gets a 10% discount on the next booking, otherwise 20%.</p>
<table class="gm-tbl"><tr><th>Surname</th><th>E: Group Cost</th><th>H: Next Booking Discount</th></tr><tr><td>Bradley</td><td>£436.00</td><td>20%</td></tr><tr><td>Sloan</td><td>£78.00</td><td>10%</td></tr></table>
<p style="margin-top:8px;">The condition compares two things with one of these signs:</p>
<table class="gm-tbl"><tr><th>Sign</th><th>Means</th><th>Is 50 … 50?</th></tr><tr><td><code>&gt;</code></td><td>more than</td><td>false</td></tr><tr><td><code>&gt;=</code></td><td>more than or equal to</td><td>true</td></tr><tr><td><code>&lt;</code></td><td>less than</td><td>false</td></tr><tr><td><code>&lt;=</code></td><td>less than or equal to</td><td>true</td></tr><tr><td><code>=</code></td><td>equal to</td><td>true</td></tr></table>
<p style="margin-top:8px;">“More than” is <code>&gt;</code>, so a value exactly equal is false. “At least” or “or more” is <code>&gt;=</code>.</p>
<p style="margin-top:8px;">Words go inside quotation marks, in the condition as well as the answers. Numbers and cell references do not. An answer can be a cell or a calculation: <code>=IF(B4="Yes",C4+$F$1,C4)</code> adds the delivery charge in F1 when B4 is Yes, and otherwise shows C4.</p>
<div class="tip-box">The three parts, split by commas: the condition, the <b>value if true</b>, the <b>value if false</b>. Every ( needs a ).</div></div>`},
{teaches:['nested-if'],html:`<div class="teach-card"><h3>🪧🪧 Two signposts: a nested IF</h3>
<p>One IF can sit inside another, in the value-if-false part. This one gives reading awards for the points in C2:</p>
<p style="margin-top:8px;"><code>=IF(C2&gt;=100,"GOLD",IF(C2&gt;=50,"SILVER","BRONZE"))</code></p>
<table class="gm-tbl"><tr><th>C2: points</th><th>What happens</th><th>Shows</th></tr><tr><td>120</td><td>First condition true</td><td>GOLD</td></tr><tr><td>100</td><td>First condition true</td><td>GOLD</td></tr><tr><td>50</td><td>First false, second true</td><td>SILVER</td></tr><tr><td>49</td><td>Both false</td><td>BRONZE</td></tr></table>
<p style="margin-top:8px;">For bands like these, test the top band first, using <code>&gt;=</code> and the lowest value of that band. The first condition that is true decides, so the order matters.</p>
<div class="tip-box">Check the edge values. Exactly 50 shows SILVER, because 50 &gt;= 50 is true.</div></div>`},
{teaches:['vlookup'],html:`<div class="teach-card"><h3>📋 The menu: VLOOKUP</h3>
<p><span class="term">VLOOKUP</span> is a function. It looks down the first column of a lookup table for a match, then returns a value from another column in the same row. The V stands for vertical.</p>
<table class="gm-tbl"><tr><th></th><th>A</th><th>B</th><th>C</th></tr><tr><th>17</th><td class="fh-h">${MR_HEAD[0]}</td><td class="fh-h">${MR_HEAD[1]}</td><td class="fh-h">${MR_HEAD[2]}</td></tr>${MR_MENU.map((m,k)=>`<tr><th>${18+k}</th><td>${m[0]}</td><td>${m[1]}</td><td>£${m[2]}</td></tr>`).join('')}</table>
<p>In the textbook, D2 holds the code A004 and E2 holds <code>=VLOOKUP(D2,$A$18:$C$23,3)</code>. It finds A004 in row 21 and returns column 3 of the table: £75.00.</p>
<p style="margin-top:8px;">On the booking desk the code is in column B. C2 holds <code>=VLOOKUP(B2,$A$18:$C$23,2)</code> for the activity, and D2 holds the same ending in <code>,3)</code> for the cost. The $ signs pin the table, so the formula can be filled down.</p>
<div class="tip-box">Exam focus: if the lookup table is changed, every cell that looks it up updates (2018). <b>#N/A</b> means the item is not in the lookup list (2022).</div></div>`}
],
rounds:[
{title:'Which Way?',teachAt:[0,1],variant:'belt',heading:'Which part of the IF is used?',tip:'Put the value into the condition. True: the first answer. False: the second answer (which may be another IF).',
 choices:[{key:'t',label:'✅ Value if true'},{key:'f',label:'❌ Value if false'}],
 tasks:[
  {type:'classify',text:'=IF(D2>=100,"Yes","No") · D2 is 90',answer:'f',src:'Practice, TB p18',feedback:'90 >= 100 is false, so the cell shows No.'},
  {type:'classify',text:'=IF(D2>=100,"Yes","No") · D2 is 100',answer:'t',src:'Practice, TB p18',feedback:'100 >= 100 is true: “or equal to” counts.'},
  {type:'classify',text:'=IF(E3<=150,"10%","20%") · E3 is £78.00',answer:'t',src:'Practice, TB p18',feedback:'78 is 150 or less, so the discount is 10%.'},
  {type:'classify',text:'=IF(E3<=150,"10%","20%") · E3 is £436.00',answer:'f',src:'Practice, TB p18',feedback:'436 is more than 150, so the discount is 20%.'},
  {type:'classify',text:'=IF(B6<=B7,"In Budget","Over Budget") · B6 is £618.85 and B7 is £620.00',answer:'t',src:'Practice, PP 2024 Q4(f)',feedback:'618.85 is 620 or less, so In Budget.'},
  {type:'classify',text:'=IF(B6<=B7,"In Budget","Over Budget") · B6 is £625.00 and B7 is £620.00',answer:'f',src:'Practice, PP 2024 Q4(f)',feedback:'625 is more than 620, so Over Budget.'},
  {type:'classify',text:'=IF(D2<100,$B$18,$B$19) · D2 is 60',answer:'t',src:'Practice, TB p19',feedback:'60 < 100 is true, so the rate in B18 is used.'},
  {type:'classify',text:'=IF(D2<100,$B$18,$B$19) · D2 is 120',answer:'f',src:'Practice, TB p19',feedback:'120 < 100 is false, so the rate in B19 is used.'},
  {type:'classify',text:'=IF(B4="Yes",C4+$F$1,C4) · B4 is No',answer:'f',src:'Practice, PP 2025 Q6(e)',feedback:'B4 is No, so B4="Yes" is false: the cell shows C4, with no charge added.'},
  {type:'classify',text:'=IF(F5>B1,"Bonus","None") · F5 is 300 and B1 is 300',answer:'f',src:'Practice, PP 2023 Q4(d)',feedback:'300 > 300 is false: “more than” does not include equal, so None.'},
  {type:'classify',text:'Which part of the FIRST IF is used? =IF(C2>=100,"GOLD",IF(C2>=50,"SILVER","BRONZE")) · C2 is 100',answer:'t',src:'Practice, PP 2021 Q3(g)(i)',feedback:'100 >= 100 is true, so the first IF gives GOLD.'},
  {type:'classify',text:'Which part of the FIRST IF is used? =IF(C2>=100,"GOLD",IF(C2>=50,"SILVER","BRONZE")) · C2 is 50',answer:'f',src:'Practice, PP 2021 Q3(g)(i)',feedback:'50 >= 100 is false, so the first IF uses its value if false: the second IF. That one decides: 50 >= 50 is true, so SILVER.'}
 ]},
{title:'The Booking Desk',teachAt:[2],mode:'sim',sim:'menu',heading:'Run, change and fix VLOOKUPs',tip:'Down the first column to find the code, then across to the column number at the end of the formula. No match: #N/A.',tasks:[]},
{title:'Exam Room',heading:'Real CCEA exam questions',teachAt:[0,1,2],boss:{icon:'🧭',name:'The Lost Signpost'},tip:'For IF, test the value against the condition, including the edge values. For VLOOKUP, say it searches down the first column of a table.',
 tasks:[],pool:[[[PP.if2021g1,PP.if2022f,PP.if2023d,PP.if2024f,PP.if2025e],4],[[PP.vl2018c1,PP.vl2018c2,PP.vl2022g1,PP.vl2022g2],3],[[PP.vl2019h,PP.vl2025f],1]]}
]};
