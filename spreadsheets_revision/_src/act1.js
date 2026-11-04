/* Activity 1 — Cinema Grid. GAMEPLAY_V2 (20 Oct 2026). Sources: TB p16, TB p19; MS 2018 Q7(a), 2019 Q8(a), 2021 Q3(a), 2022 Q3(a)(b), 2023 Q4(a), 2024 Q4(c), 2025 Q6(a)(c). */
const SF_COLS='ABCDEFGHIJ',SF_ROWS=8;
let SF=null;
const sfName=p=>SF_COLS[p.c]+p.r;
const sfRnd=n=>Math.floor(Math.random()*n);
/* the calls for each round: single seats, then blocks, then lit seats to name */
function sfCalls(k){
  const seen=new Set(),out=[];
  while(out.length<[5,4,4][k]){
    let call;
    if(k===1){
      const col=out.length%2===0;
      if(col){const c=sfRnd(10),r1=1+sfRnd(4),r2=r1+2+sfRnd(Math.min(3,SF_ROWS-r1-1));call={a:{c,r:r1},b:{c,r:r2}};}
      else{const r=1+sfRnd(SF_ROWS),c1=sfRnd(6),c2=c1+2+sfRnd(Math.min(3,9-c1-1));call={a:{c:c1,r},b:{c:c2,r}};}
      call.name=sfName(call.a)+':'+sfName(call.b);
    }else{const p={c:sfRnd(10),r:1+sfRnd(SF_ROWS)};call={a:p,name:sfName(p)};}
    if(!seen.has(call.name)){seen.add(call.name);out.push(call);}
  }
  return gmShuffle(out);
}
function sim_seats(area,finish){
  SF={k:0,i:0,calls:[]};
  gmOpen(area,{title:'Seat finder',icon:'🎬',stages:['Find the seat','Book a block','Name the seat'],lives:3,finish,bot:'🍿'});
  gmBanner('Cinema night','The school cinema has 80 seats laid out like a worksheet: letters across the top, numbers down the side. The usher calls out seats and blocks of seats. Find each one before the timer runs out. A wrong seat, or running out of time, costs a life.','🎟️ Open the doors',()=>sfRound(0));
}
function sfRound(k){SF.k=k;SF.i=0;SF.calls=sfCalls(k);gmStage(k);sfCall();}
function sfGrid(){
  return `<div class="sf-wrap"><div class="sf-screen">SCREEN</div><table class="sf-grid"><tr><th></th>${[...SF_COLS].map(c=>`<th>${c}</th>`).join('')}</tr>
${Array.from({length:SF_ROWS},(_,r)=>`<tr><th>${r+1}</th>${[...SF_COLS].map((c,ci)=>`<td><button class="sf-c" data-c="${ci}" data-r="${r+1}" aria-label="Seat ${c}${r+1}"></button></td>`).join('')}</tr>`).join('')}</table></div>`;
}
const sfSeat=p=>document.querySelector(`.sf-c[data-c="${p.c}"][data-r="${p.r}"]`);
function sfBlock(a,b){const out=[];for(let c=Math.min(a.c,b.c);c<=Math.max(a.c,b.c);c++)for(let r=Math.min(a.r,b.r);r<=Math.max(a.r,b.r);r++)out.push({c,r});return out;}
function sfCall(){
  GM.state='play';gmMsg('');
  const call=SF.calls[SF.i],n=SF.calls.length;
  const ask=SF.k===0?`🎟️ Call ${SF.i+1} of ${n}: <b>Seat ${call.name}!</b> Click that seat.`
    :SF.k===1?`🎟️ Block ${SF.i+1} of ${n}: <b>Seats ${call.name}</b> for a class. Drag across the block from the first seat to the last, or tap the first seat and then the last.`
    :`💡 Seat ${SF.i+1} of ${n}: one seat is lit. What is its name?`;
  $('gmMain').innerHTML=`<div class="gm-q">${ask}</div><div id="sfTime"></div>${sfGrid()}${SF.k===1?'<div class="sf-selname" id="sfSel" aria-live="polite">Selected: nothing yet</div>':''}${SF.k===2?'<div class="mcq-list sf-opts" id="sfOpts"></div>':''}`;
  if(SF.k===2){
    sfSeat(call.a).classList.add('lit');
    const {c,r}=call.a,near={c:c<9?c+1:c-1,r},up={c,r:r>1?r-1:r+1};
    const opts=gmShuffle([[call.name,1],[r+SF_COLS[c],0],[sfName(near),0],[sfName(up),0]]);
    $('sfOpts').innerHTML=opts.map(([t,ok])=>`<button class="mcq-btn" data-ok="${ok}">${t}</button>`).join('');
    document.querySelectorAll('#sfOpts .mcq-btn').forEach(b=>b.onclick=()=>sfDone(b.dataset.ok==='1',b));
    document.querySelectorAll('.sf-c').forEach(b=>b.disabled=true);
  }else if(SF.k===1){
    const same=(p,q)=>q.c===p.c&&q.r===p.r;
    gmGridSelect(document.querySelector('.sf-grid'),{twoTap:true,off:()=>!GM||GM.state!=='play',
      move:R=>{$('sfSel').textContent='Selected: '+gmRange(R);},
      first:p=>{if(!same(p,call.a)&&!same(p,call.b))return sfDone(false,sfSeat(p),gmRange({c1:p.c,r1:p.r,c2:p.c,r2:p.r}));sfSeat(p).classList.add('pick');sfx('tick');},
      done:R=>{const ok=R.c1===Math.min(call.a.c,call.b.c)&&R.c2===Math.max(call.a.c,call.b.c)&&R.r1===Math.min(call.a.r,call.b.r)&&R.r2===Math.max(call.a.r,call.b.r);
        sfDone(ok,sfSeat({c:R.c2,r:R.r2}),gmRange(R));}});
  }else document.querySelectorAll('.sf-c').forEach(b=>b.onclick=()=>sfClick(b));
  gmTimer($('sfTime'),RM?40:[15,20,15][SF.k],()=>sfDone(false,null));
}
function sfClick(b){
  if(GM.state!=='play')return;
  const p={c:+b.dataset.c,r:+b.dataset.r},call=SF.calls[SF.i],same=q=>q.c===p.c&&q.r===p.r;
  sfDone(same(call.a),b);
}
function sfDone(ok,btn,picked){
  if(GM.state!=='play')return;GM.state='fb';gmStop();
  const call=SF.calls[SF.i];
  document.querySelectorAll('.sf-c,#sfOpts .mcq-btn').forEach(b=>{b.disabled=true;b.classList.remove('sel');});
  const right=SF.k===1?sfBlock(call.a,call.b):[call.a];
  if(ok){
    right.forEach(p=>sfSeat(p).classList.add('good'));if(btn&&SF.k===2)btn.classList.add('correct');
    sfx('good');say(['Spot on! 🎯','Seated! 🍿','Right seat!'][SF.i%3]);
    gmMsg(SF.k===1?`Right. ${call.name} is ${right.length} seats: the colon means “to”, so every seat from ${sfName(call.a)} to ${sfName(call.b)}.`:`Right. ${call.name} is column ${SF_COLS[call.a.c]} across, row ${call.a.r} down.`,'correct');
  }else{
    if(btn){if(SF.k===2)btn.classList.add('wrong');else btn.classList.add('bad');}
    right.forEach(p=>sfSeat(p).classList.add('miss'));
    if(SF.k===2)document.querySelector('#sfOpts .mcq-btn[data-ok="1"]').classList.add('missed');
    const out=gmLose();say('Wrong seat! 😬');
    const p=btn&&btn.dataset.c!==undefined?{c:+btn.dataset.c,r:+btn.dataset.r}:null;
    let why;
    if(!btn)why=SF.k===1?`Too slow! The block was <b>${call.name}</b>, lit in gold.`:`Too slow! The seat was <b>${call.name}</b>, lit in gold.`;
    else if(SF.k===0)why=`That was ${sfName(p)}. <b>${call.name}</b> is column ${SF_COLS[call.a.c]} across, then row ${call.a.r} down: the letter first, then the number.`;
    else if(SF.k===1)why=`${picked?`You chose ${picked}. `:''}The block <b>${call.name}</b> starts at ${sfName(call.a)} and ends at ${sfName(call.b)}, lit in gold. The colon means “to”.`;
    else why=btn.textContent===call.a.r+SF_COLS[call.a.c]?`${btn.textContent} is the wrong way round. A cell reference is the column letter first, then the row number: <b>${call.name}</b>.`:`That seat is <b>${call.name}</b>: column ${SF_COLS[call.a.c]}, row ${call.a.r}.`;
    gmMsg(why,'wrong');
    if(out)return gmGo('See what happened →',()=>gmEnd(0,'The film started without them','The audience could not find their seats. Read the lessons on cell references and ranges again, then have another go.'));
  }
  SF.i++;
  if(SF.i<SF.calls.length)return gmGo(SF.k===2?'Next seat →':SF.k===1?'Next block →':'Next call →',sfCall);
  if(SF.k<2)return gmGo(SF.k===0?'Book a block →':'Name the seat →',()=>sfRound(SF.k+1));
  gmGo('Finish →',()=>gmEnd(gmStars(GM.lives,3),'House full','Every seat and every block was found. Cell references and ranges work the same way on every worksheet.'));
}
/* ---------- Format Studio: make a plain sheet match a formatted one, then find and name formats (TB p16; MS 2018–2025) ---------- */
const FS_SHEETS=[
 {name:'Film night takings',w:[7.6,6.4,6.6,5.4],
  v:[['Film night takings','','',''],['Film','Ticket price','Tickets sold','Takings'],['The Lost Map',4.5,96,432],['Space Pups',3.5,120,420],['Night Train',5,64,320]],
  t:[['A1:D1','merge','centre'],['B3:B5','cur'],['D3:D5','cur']]},
 {name:'Poster sale',w:[7,5,5.6,6],
  v:[['Poster sale','','',''],['Poster','Price','Number sold this week','Discount'],['Galaxy',6,34,0.1],['Ocean',4.5,52,0.15],['Mountains',5,18,0.05]],
  t:[['A1:D1','merge'],['C2','wrap'],['B3:B5','cur'],['D3:D5','pct']]},
 {name:'Usher rota',w:[6.4,6,6.2],
  v:[['Usher rota for October','',''],['Usher','Shifts this month','Pay for each shift'],['Ana',4,12.5],['Tom',6,12.5],['Priya',3,12.5]],
  t:[['A1:C1','merge','centre','bold'],['A2:C2','bold'],['B2:C2','wrap'],['C3:C5','cur']]}
];
const FS_FIND={name:'Cinema shop price list',w:[6.4,5,5.8,6],
  v:[['Cinema shop price list','','',''],['Item','Price','Number in stock','Discount'],['Popcorn',2.2,140,0.1],['Nachos',2.8,85,0.15],['Hot dog',3,60,0.05],['Slushie',1.9,110,0]],
  t:[['A1:D1','merge','centre','bold'],['A2:D2','bold'],['C2','wrap'],['B3:B6','cur'],['D3:D6','pct']]};
let FS=null;
const fsRef=(c,r)=>gmCol(c)+r;
function fsRect(s){const m=s.match(/^([A-Z])(\d+)(?::([A-Z])(\d+))?$/),a={c:m[1].charCodeAt(0)-65,r:+m[2]},b=m[3]?{c:m[3].charCodeAt(0)-65,r:+m[4]}:a;return {c1:Math.min(a.c,b.c),c2:Math.max(a.c,b.c),r1:Math.min(a.r,b.r),r2:Math.max(a.r,b.r)};}
function fsEach(R,fn){for(let r=R.r1;r<=R.r2;r++)for(let c=R.c1;c<=R.c2;c++)fn(c,r);}
const fsMeets=(A,B)=>A.c1<=B.c2&&B.c1<=A.c2&&A.r1<=B.r2&&B.r1<=A.r2;
const fsSame=(A,B)=>A.c1===B.c1&&A.c2===B.c2&&A.r1===B.r1&&A.r2===B.r2;
const fsVal=(sh,c,r)=>(sh.v[r-1]||[])[c];
const fsHas=(sh,c,r)=>{const v=fsVal(sh,c,r);return v!==undefined&&v!=='';};
/* the formats a sheet carries: f[ref] = {bold,centre,wrap,fmt}, m = merged blocks */
function fsState(list){
  const st={f:{},m:[]};
  (list||[]).forEach(([rg,...fx])=>{const R=fsRect(rg);
    if(fx.includes('merge'))st.m.push(R);
    fsEach(R,(c,r)=>{const o=st.f[fsRef(c,r)]=st.f[fsRef(c,r)]||{};
      if(fx.includes('bold'))o.bold=true;if(fx.includes('centre'))o.centre=true;if(fx.includes('wrap'))o.wrap=true;
      if(fx.includes('cur'))o.fmt='cur';if(fx.includes('pct'))o.fmt='pct';});});
  return st;
}
const fsF=(st,c,r)=>st.f[fsRef(c,r)]||{};
const fsMergeAt=(st,c,r)=>st.m.find(R=>c>=R.c1&&c<=R.c2&&r>=R.r1&&r<=R.r2);
function fsShow(v,fmt){
  if(typeof v!=='number')return v;
  if(fmt==='cur')return '£'+v.toFixed(2);
  if(fmt==='pct')return Math.round(v*100)+'%';
  return String(v);
}
/* does this text fit on one line in its cell? (measured, so wrap text only counts where it shows) */
let fsCtx=null;
function fsFits(sh,st,c,r){
  const v=fsVal(sh,c,r);if(typeof v!=='string'||!v)return true;
  if(!fsCtx){try{fsCtx=document.createElement('canvas').getContext('2d');}catch(e){}}
  const M=fsMergeAt(st,c,r);let em=0;for(let k=M?M.c1:c;k<=(M?M.c2:c);k++)em+=sh.w[k];
  const bold=fsF(st,c,r).bold;
  let px;if(fsCtx){fsCtx.font=`${bold?'bold ':''}100px Arial, Helvetica, sans-serif`;px=fsCtx.measureText(v).width/100;}else px=v.length*0.56*(bold?1.06:1);
  return px<=em-0.6;
}
function fsTable(sh,st,o={}){
  const nr=sh.v.length,nc=sh.w.length,cov=new Set();
  st.m.forEach(R=>fsEach(R,(c,r)=>{if(c!==R.c1||r!==R.r1)cov.add(fsRef(c,r));}));
  let h=`<colgroup><col style="width:2.1em">${sh.w.map(w=>`<col style="width:${w}em">`).join('')}</colgroup><tr><th class="fs-corner"></th>${sh.w.map((_,c)=>`<th>${gmCol(c)}</th>`).join('')}</tr>`;
  for(let r=1;r<=nr;r++){
    h+=`<tr><th>${r}</th>`;
    for(let c=0;c<nc;c++){
      const ref=fsRef(c,r);if(cov.has(ref))continue;
      const v=fsVal(sh,c,r),F=fsF(st,c,r),M=fsMergeAt(st,c,r),num=typeof v==='number';
      const right=c+1<nc&&!fsHas(sh,c+1,r)&&!M&&!cov.has(fsRef(c+1,r))&&!fsMergeAt(st,c+1,r);
      const cls=[num?'n':'t',F.bold?'b':'',F.centre?'ctr':'',F.wrap?'wr':'',typeof v==='string'&&v&&!F.wrap&&!F.centre&&right?'spill':'',
        o.out&&fsMeets(o.out,{c1:c,c2:c,r1:r,r2:r})?'out':''].filter(Boolean).join(' ');
      const span=M?`${M.c2>M.c1?` colspan="${M.c2-M.c1+1}"`:''}${M.r2>M.r1?` rowspan="${M.r2-M.r1+1}"`:''}`:'';
      const txt=v===''||v===undefined?'':fsShow(v,F.fmt);
      h+=`<td${span} class="${cls}"${o.live?` data-c="${c}" data-r="${r}" tabindex="0"`:''} aria-label="${M?gmRange(M):ref}${txt!==''?': '+String(txt).replace(/"/g,'&quot;'):', empty'}">${txt===''?'':`<span>${txt}</span>`}</td>`;
    }
    h+='</tr>';
  }
  return h;
}
const fsSheet=(sh,id,cls)=>`<table class="fs-sheet${cls?' '+cls:''}"${id?` id="${id}"`:''} style="width:${(2.1+sh.w.reduce((a,b)=>a+b,0)).toFixed(1)}em">`;
function sim_studio(area,finish){
  FS={i:0};
  gmOpen(area,{title:'Format Studio',icon:'🎨',stages:['Make it match','Find it','Name it'],lives:3,finish,bot:'🎨'});
  gmBanner('Format Studio','The cinema manager has formatted three sheets. Your copies are still plain. Select cells, then use the buttons to make your sheet look exactly like the manager’s, and check it. Then find formats on a finished sheet, and name them. A wrong check, a wrong answer or running out of time costs a life.','🎨 Open the studio',()=>fsMatch(0));
}
/* ---- stage 1: make it match ---- */
const FS_TOOLS=[['bold','<b>B</b> Bold'],['centre','≡ Centre'],['mc','⊞ Merge &amp; Centre'],['merge','⊟ Merge cells'],['wrap','↵ Wrap text'],['cur','£ Currency'],['pct','% Percentage'],['clear','✕ Clear formats']];
function fsMatch(i){
  gmStage(0);GM.state='play';gmMsg('');
  const sh=FS_SHEETS[i];FS.i=i;FS.sh=sh;FS.goal=fsState(sh.t);FS.st={f:{},m:[]};FS.sel=null;
  $('gmMain').innerHTML=`<div class="gm-q">🎨 Sheet ${i+1} of ${FS_SHEETS.length}: <b>${sh.name}</b>. Make your sheet look exactly like the manager’s, then press Check.</div>
<div class="fs-wrap"><div class="fs-pane"><div class="fs-lab">📋 The manager’s sheet</div><div class="fs-scroll">${fsSheet(sh)}${fsTable(sh,FS.goal)}</table></div></div>
<div class="fs-pane"><div class="fs-lab">✏️ Your sheet</div><div class="fs-ribbon" role="toolbar" aria-label="Formatting buttons">${FS_TOOLS.map(([k,l])=>`<button class="fs-tool" data-k="${k}">${l}</button>`).join('')}</div>
<div class="fs-name" id="fsName" aria-live="polite">Selected: nothing yet. Drag across cells, or tap one cell.</div><div class="fs-scroll">${fsSheet(sh,'fsY','fs-live')}</table></div></div></div>
<div class="gm-btns"><button class="btn btn-primary" id="fsCheck">✔ Check my sheet</button></div>`;
  fsDraw();
  FS.grid=gmGridSelect($('fsY'),{off:()=>GM.state!=='play',expand:fsExpand,move:R=>{FS.sel=R;fsName();},done:R=>{FS.sel=R;fsName();}});
  document.querySelectorAll('.fs-tool').forEach(b=>b.onclick=()=>fsTool(b.dataset.k));
  $('fsCheck').onclick=fsCheck;
}
function fsDraw(){$('fsY').innerHTML=fsTable(FS.sh,FS.st,{live:true});if(FS.sel&&FS.grid)FS.grid.set(FS.sel);}
function fsName(){$('fsName').textContent=FS.sel?`Selected: ${gmRange(FS.sel)}`:'Selected: nothing yet. Drag across cells, or tap one cell.';}
function fsExpand(R){
  let X={...R},grew=true;
  while(grew){grew=false;FS.st.m.forEach(M=>{if(fsMeets(M,X)){const Y={c1:Math.min(X.c1,M.c1),c2:Math.max(X.c2,M.c2),r1:Math.min(X.r1,M.r1),r2:Math.max(X.r2,M.r2)};if(!fsSame(X,Y)){X=Y;grew=true;}}});}
  return X;
}
function fsTool(k){
  if(GM.state!=='play')return;
  const R=FS.sel,sh=FS.sh,st=FS.st;
  if(!R)return gmMsg('Select some cells first: drag across them, or tap one cell.','');
  const cells=[];fsEach(R,(c,r)=>cells.push([c,r]));
  const full=cells.filter(([c,r])=>fsHas(sh,c,r)),nums=full.filter(([c,r])=>typeof fsVal(sh,c,r)==='number');
  const f=(c,r)=>st.f[fsRef(c,r)]=st.f[fsRef(c,r)]||{};
  let note='';
  if(k==='merge'||k==='mc'){
    const same=st.m.find(M=>fsSame(M,R));
    if(same){st.m=st.m.filter(M=>M!==same);if(k==='mc')cells.forEach(([c,r])=>delete f(c,r).centre);note=`${gmRange(R)} is separate cells again.`;}
    else if(R.c1===R.c2&&R.r1===R.r2)return gmMsg('Select two or more cells to merge them into one.','');
    else{
      const lost=full.filter(([c,r])=>c!==R.c1||r!==R.r1).map(([c,r])=>fsRef(c,r));
      if(lost.length)return gmMsg(`Merging keeps only the top-left value, so ${lost.slice(0,3).join(', ')}${lost.length>3?' and more':''} would lose ${lost.length>1?'their':'its'} data. Only merge a title with the empty cells beside it.`,'');
      st.m=st.m.filter(M=>!fsMeets(M,R));st.m.push(R);
      if(k==='mc')f(R.c1,R.r1).centre=true;
      note=k==='mc'?`${gmRange(R)} is now one cell, with the text centred.`:`${gmRange(R)} is now one cell.`;
    }
  }else if(k==='clear'){
    cells.forEach(([c,r])=>delete st.f[fsRef(c,r)]);st.m=st.m.filter(M=>!fsMeets(M,R));note=`Formats cleared from ${gmRange(R)}.`;
  }else if(k==='cur'||k==='pct'){
    if(!nums.length)return gmMsg('Currency and percentage change how numbers look. Select cells with numbers in them.','');
    const all=nums.every(([c,r])=>f(c,r).fmt===k);
    nums.forEach(([c,r])=>{if(all)delete f(c,r).fmt;else f(c,r).fmt=k;});
    note=all?'Back to the general format: the numbers show just as they were typed.':k==='cur'?'Currency: a £ sign and two decimal places.':'Percentage: the number times 100, with a % sign.';
  }else{
    if(!full.length)return gmMsg('Those cells are empty. Select cells with something in them.','');
    const all=full.every(([c,r])=>f(c,r)[k]);
    full.forEach(([c,r])=>{if(all)delete f(c,r)[k];else f(c,r)[k]=true;});
    note={bold:all?'Bold taken off.':'Bold.',centre:all?'Centring taken off.':'Centred in the cell.',wrap:all?'Wrap text taken off.':'Wrap text: long text goes onto more lines inside its own cell.'}[k];
  }
  sfx('tick');fsDraw();gmMsg(note,'');
}
/* compare only what can be seen on the screen */
function fsDiff(sh,goal,st){
  const out=[],nc=sh.w.length,nr=sh.v.length,key=R=>gmRange(R);
  goal.m.filter(M=>!st.m.some(N=>fsSame(M,N))).forEach(M=>out.push(`In the manager’s sheet, ${key(M)} is one cell: there are no lines between them. Merge those cells.`));
  st.m.filter(N=>!goal.m.some(M=>fsSame(M,N))).forEach(N=>out.push(`You merged ${key(N)}, but in the manager’s sheet those are separate cells.`));
  const groups={};
  const add=(k,ref)=>(groups[k]=groups[k]||[]).push(ref);
  for(let r=1;r<=nr;r++)for(let c=0;c<nc;c++){
    if(!fsHas(sh,c,r))continue;
    const G=fsF(goal,c,r),S=fsF(st,c,r),ref=fsRef(c,r),num=typeof fsVal(sh,c,r)==='number';
    if(!!G.bold!==!!S.bold)add(G.bold?'bold+':'bold-',ref);
    if(!!G.centre!==!!S.centre)add(G.centre?'ctr+':'ctr-',ref);
    if(num&&(G.fmt||'')!==(S.fmt||''))add('fmt:'+(G.fmt||'gen'),ref);
    if(!num&&!!G.wrap!==!!S.wrap&&!fsFits(sh,goal,c,r))add(G.wrap?'wrap+':'wrap-',ref);
  }
  const L=a=>a.length>1?a.slice(0,-1).join(', ')+' and '+a[a.length-1]:a[0],is=a=>a.length>1?'are':'is';
  const words={'bold+':a=>`${L(a)} ${is(a)} bold in the manager’s sheet.`,'bold-':a=>`${L(a)} ${is(a)} not bold in the manager’s sheet.`,
    'ctr+':a=>`The text in ${L(a)} is centred in the manager’s sheet.`,'ctr-':a=>`${L(a)} ${is(a)} not centred in the manager’s sheet.`,
    'wrap+':a=>`In the manager’s sheet the text in ${L(a)} goes onto more than one line inside its own cell: that is wrap text.`,
    'wrap-':a=>`In the manager’s sheet the text in ${L(a)} is on one line.`,
    'fmt:cur':a=>`${L(a)} show${a.length>1?'':'s'} a £ sign and two decimal places in the manager’s sheet: currency.`,
    'fmt:pct':a=>`${L(a)} show${a.length>1?'':'s'} a % sign in the manager’s sheet: percentage.`,
    'fmt:gen':a=>`${L(a)} show${a.length>1?'':'s'} the number just as it was typed in the manager’s sheet: no £ and no %.`};
  Object.entries(groups).forEach(([k,a])=>out.push(words[k](a)));
  return out;
}
function fsWords(list){
  return list.map(([rg,...fx])=>{
    const w=[];if(fx.includes('merge'))w.push(fx.includes('centre')?'merged and centred':'merged');else if(fx.includes('centre'))w.push('centred');
    if(fx.includes('bold'))w.push('bold');if(fx.includes('wrap'))w.push('wrap text');if(fx.includes('cur'))w.push('currency format');if(fx.includes('pct'))w.push('percentage format');
    return `<b>${rg}</b> ${w.join(', ')}`;}).join('; ');
}
function fsCheck(){
  if(GM.state!=='play')return;
  const d=fsDiff(FS.sh,FS.goal,FS.st);
  if(!d.length){
    GM.state='fb';sfx('good');say('It matches! 🎨');
    gmMsg(`✔ Your sheet matches the manager’s. In an exam you would describe it like this: ${fsWords(FS.sh.t)}.`,'correct');
    return gmGo(FS.i+1<FS_SHEETS.length?'Next sheet →':'Find it →',()=>FS.i+1<FS_SHEETS.length?fsMatch(FS.i+1):fsFindStart());
  }
  const out=gmLose();say('Not yet! 😬');
  gmMsg(`Not a match yet. ${d.length>4?`Here are 4 of the ${d.length} differences:`:''}<ul class="fs-diff">${d.slice(0,4).map(x=>`<li>${x}</li>`).join('')}</ul>`,'wrong');
  if(out){GM.state='fb';return gmGo('See what happened →',()=>gmEnd(0,'The posters went out plain','The manager’s sheets were not matched. Read the lesson on formatting cells again, then have another go.'));}
}
/* ---- stage 2: find it on a finished sheet ---- */
const FS_FINDS=[
 {ask:'Select the cells that are formatted as <b>currency</b>.',ans:'B3:B6',why:'B3:B6 show a £ sign and two decimal places: that is currency format.'},
 {ask:'Select the cell that uses <b>wrap text</b>.',ans:'C2',why:'The heading in C2 sits on two lines inside its own cell: that is wrap text.'},
 {ask:'Select the cells that are formatted as <b>percentage</b>.',ans:'D3:D6',why:'D3:D6 show a % sign: that is percentage format.'},
 {ask:'Select the numbers that have <b>no special format</b>: they show just as they were typed.',ans:'C3:C6',why:'C3:C6 show plain numbers, with no £ and no % sign.'},
 {ask:'Type the range of cells that have been <b>merged</b>.',ans:'A1:D1',typed:true,why:'A1:D1 is one cell, with no lines inside it. Write the first cell, a colon, then the last cell.'}
];
function fsFindStart(){FS.finds=[...gmShuffle(FS_FINDS.filter(x=>!x.typed)),FS_FINDS.find(x=>x.typed)];FS.j=0;FS.goalF=fsState(FS_FIND.t);gmStage(1);fsFind();}
function fsFind(){
  GM.state='play';gmMsg('');FS.sel=null;
  const t=FS.finds[FS.j],n=FS.finds.length;
  $('gmMain').innerHTML=`<div class="gm-q">🔎 Find ${FS.j+1} of ${n}: ${t.ask}</div>
<div class="fs-wrap fs-one"><div class="fs-pane"><div class="fs-lab">📋 ${FS_FIND.name}</div>${t.typed?'':'<div class="fs-name" id="fsName" aria-live="polite">Selected: nothing yet. Drag across cells, or tap one cell.</div>'}
<div class="fs-scroll">${fsSheet(FS_FIND,'fsY',t.typed?'':'fs-live')}</table></div></div></div>
${t.typed?'<div class="fs-type"><label for="fsIn">Range:</label><input id="fsIn" class="gm-in" autocomplete="off" autocapitalize="characters" spellcheck="false" placeholder="for example B9:D9"></div>':''}
<div class="gm-btns"><button class="btn btn-primary" id="fsCheck">✔ Check</button></div>`;
  $('fsY').innerHTML=fsTable(FS_FIND,FS.goalF,{live:!t.typed});
  if(!t.typed){FS.st=FS.goalF;FS.grid=gmGridSelect($('fsY'),{off:()=>GM.state!=='play',expand:fsExpand,move:R=>{FS.sel=R;fsName();},done:R=>{FS.sel=R;fsName();}});}
  else{$('fsIn').onkeydown=e=>{if(e.key==='Enter')fsFindCheck();};}
  $('fsCheck').onclick=fsFindCheck;
}
function fsFindCheck(){
  if(GM.state!=='play')return;
  const t=FS.finds[FS.j],A=fsRect(t.ans);
  let ok,mine='';
  if(t.typed){
    const raw=$('fsIn').value.toUpperCase().replace(/\s+/g,'');
    if(!raw)return gmMsg('Type the range first, for example B9:D9.','');
    if(/^[A-Z]\d+:[A-Z]\d+$/.test(raw)&&raw!==t.ans&&fsSame(fsRect(raw),A))return gmMsg(`Nearly. A range is written from the first cell to the last: start with the top-left cell. Try again.`,'');
    ok=raw===t.ans;
    if(!ok)mine=/-/.test(raw)?`You typed ${raw}. The mark scheme does not accept a dash: use a colon, like A1:D1. `:/^\d/.test(raw)?`You typed ${raw}. A cell reference is the column letter first, then the row number. `:`You typed ${raw}. `;
  }else{
    if(!FS.sel)return gmMsg('Select the cells first: drag across them, or tap one cell.','');
    ok=fsSame(FS.sel,A);if(!ok)mine=`You selected ${gmRange(FS.sel)}. `;
  }
  GM.state='fb';
  if(t.typed)$('fsIn').disabled=true;
  $('fsY').innerHTML=fsTable(FS_FIND,FS.goalF,{out:A});
  if(ok){sfx('good');say('Found it! 🔎');gmMsg(`Right. ${t.why}`,'correct');}
  else{
    const out=gmLose();say('Not that one! 😬');gmMsg(`${mine}The answer is outlined in gold: ${t.why}`,'wrong');
    if(out)return gmGo('See what happened →',()=>gmEnd(0,'The price list stayed a mystery','Read the lesson on formatting cells again, then have another go.'));
  }
  FS.j++;
  gmGo(FS.j<FS.finds.length?'Next →':'Name it →',()=>FS.j<FS.finds.length?fsFind():fsNameStart());
}
/* ---- stage 3: name it, against the clock ---- */
const FS_NAMES=[
 {sh:0,rg:'A1:D1',ask:'How have the outlined cells been formatted?',ok:'Merged and centred',no:['Merged, not centred','Wrap text','Currency'],why:'A1:D1 is one cell (no lines inside) and the title sits in the middle: merged and centred.'},
 {sh:1,rg:'A1:D1',ask:'How have the outlined cells been formatted?',ok:'Merged, not centred',no:['Merged and centred','Wrap text','Bold'],why:'A1:D1 is one cell (no lines inside), but the title sits on the left: merged, not centred.'},
 {sh:1,rg:'C2',ask:'How has the text in the outlined cell been formatted?',ok:'Wrap text',no:['Merged','Percentage','Bold'],why:'The heading goes onto more than one line inside its own cell: wrap text.'},
 {sh:'F',rg:'B3:B6',ask:'What format do the outlined cells use?',ok:'Currency',no:['Percentage','Number','Text'],why:'A £ sign and two decimal places: currency.'},
 {sh:1,rg:'D3:D5',ask:'What format do the outlined cells use?',ok:'Percentage',no:['Currency','Number','Wrap text'],why:'A % sign: percentage.'},
 {sh:0,rg:'A3:A5',ask:'What type of data is in the outlined cells?',ok:'Text',no:['Number','Currency','Date'],why:'Film names are words: text.'},
 {sh:2,rg:'B3:B5',ask:'What type of data is in the outlined cells?',ok:'Number',no:['Currency','Text','Percentage'],why:'The number of shifts is a plain number you can calculate with: no £ and no %.'}
];
function fsNameStart(){FS.names=gmShuffle(FS_NAMES).slice(0,5);FS.j=0;gmStage(2);
  GM.state='banner';gmMsg('');
  $('gmMain').innerHTML=`<div class="vs-banner"><div class="vs-bh">Name it</div><p>Some cells are outlined in gold. Choose the exam word for what you see, before the timer runs out. Five to go.</p><button class="btn btn-primary" id="goBtn">⏱️ Start</button></div>`;
  $('goBtn').onclick=fsNameQ;$('goBtn').focus({preventScroll:true});
}
function fsNameQ(){
  GM.state='play';gmMsg('');
  const t=FS.names[FS.j],sh=t.sh==='F'?FS_FIND:FS_SHEETS[t.sh],st=fsState(sh.t);
  $('gmMain').innerHTML=`<div class="gm-q">⏱️ ${FS.j+1} of ${FS.names.length}: ${t.ask}</div><div id="fsTime"></div>
<div class="fs-wrap fs-one"><div class="fs-pane"><div class="fs-lab">📋 ${sh.name}</div><div class="fs-scroll">${fsSheet(sh)}${fsTable(sh,st,{out:fsRect(t.rg)})}</table></div></div></div>
<div class="mcq-list fs-opts" id="fsOpts">${gmShuffle([[t.ok,1],...t.no.map(x=>[x,0])]).map(([x,k])=>`<button class="mcq-btn" data-ok="${k}">${x}</button>`).join('')}</div>`;
  document.querySelectorAll('#fsOpts .mcq-btn').forEach(b=>b.onclick=()=>fsNameDone(b));
  gmTimer($('fsTime'),RM?40:15,()=>fsNameDone(null));
}
function fsNameDone(b){
  if(GM.state!=='play')return;GM.state='fb';gmStop();
  const t=FS.names[FS.j];
  document.querySelectorAll('#fsOpts .mcq-btn').forEach(x=>{x.disabled=true;if(x.dataset.ok==='1'&&(!b||x!==b))x.classList.add('missed');});
  if(b&&b.dataset.ok==='1'){b.classList.add('correct');sfx('good');say('Named! 🎨');gmMsg(`Right. ${t.why}`,'correct');}
  else{
    if(b)b.classList.add('wrong');
    const out=gmLose();say(b?'Not that one! 😬':'Too slow! ⏱️');
    gmMsg(`${b?'':'Out of time. '}The answer is <b>${t.ok}</b>. ${t.why}`,'wrong');
    if(out)return gmGo('See what happened →',()=>gmEnd(0,'The studio ran out of time','Read the lesson on formatting cells again, then have another go.'));
  }
  FS.j++;
  gmGo(FS.j<FS.names.length?'Next →':'Finish →',()=>FS.j<FS.names.length?fsNameQ():gmEnd(gmStars(GM.lives,3),'Studio closed','Every sheet matched, every format found and named. These are the exam words: merged, centred, bold, wrap text, currency and percentage.'));
}
const ACT={
title:'Cinema Grid',icon:'🎬',
intro:'The school cinema night needs an usher who knows the grid. Your mission: find cells and ranges on a worksheet, then format the cinema’s sheets so they match the manager’s.',
topics:'Rows, columns and cells, cell references, ranges, data types, formatting cells',
ranks:['Head Usher','Senior Usher','Usher Trainee','New Starter — revise and retry'],
next:{href:'activity2.html',label:'Next: Tuck Shop Kitchen'},
teach:[
{teaches:['rows-columns','cell-ref'],html:`<div class="teach-card"><h3>🎬 The seat plan: rows, columns and cells</h3>
<p>A <span class="term">worksheet</span> is a grid of rows and columns. Columns have letters across the top. Rows have numbers down the side. Each box in the grid is a <span class="term">cell</span>.</p>
<table class="gm-tbl sf-mini"><tr><th></th><th>A</th><th>B</th><th>C</th><th>D</th></tr>
<tr><th>4</th><td></td><td></td><td></td><td></td></tr><tr><th>5</th><td></td><td></td><td class="lit">C5</td><td></td></tr><tr><th>6</th><td></td><td></td><td></td><td></td></tr></table>
<p>A <span class="term">cell reference</span> gives the column value first and then the row value: <b>C5</b> is column C, row 5. Each worksheet is a separate tab at the bottom of the screen.</p>
<div class="tip-box">Common mistake: writing the number first. It is <b>A2</b>, never 2A.</div></div>`},
{teaches:['range'],html:`<div class="teach-card"><h3>🎟️ A block of seats: ranges</h3>
<p>A <span class="term">range</span> is a block of cells, written as the first cell, a colon, then the last cell. The colon means “to”.</p>
<p style="margin-top:8px;"><b>G4:G12</b> is every cell in column G from row 4 to row 12. A range can also run across a row: <b>B3:E3</b> is B3, C3, D3 and E3.</p>
<p style="margin-top:8px;">On a computer you select a range by dragging across it, from the first cell to the last.</p>
<div class="tip-box">Exam focus (2025): you may be asked to state a cell range. Write the first cell, a colon and the last cell, for example <b>B9:D9</b>. A dash (B9-D9) or the number first (9B:9D) gets no mark.</div></div>`},
{teaches:['data-type','currency','percentage'],html:`<div class="teach-card"><h3>🧾 What goes in a cell: data types</h3>
<p>A cell can store <b>text</b>, a <b>number</b>, a <b>date</b> or a <b>formula</b>. A formula always starts with =. The cell shows the answer, and the formula sits behind it.</p>
<p style="margin-top:8px;">A <span class="term">format</span> changes how a number is shown, not the number itself. The formats include general, number, currency, date, time and percentage.</p>
<table class="gm-tbl"><tr><th>Typed in</th><th>Format</th><th>The cell shows</th></tr><tr><td>4.5</td><td>Currency</td><td>£4.50</td></tr><tr><td>0.15</td><td>Percentage</td><td>15%</td></tr><tr><td>120</td><td>General (number)</td><td>120</td></tr><tr><td>Popcorn</td><td>Text</td><td>Popcorn</td></tr></table>
<div class="tip-box">Exam focus (2022): the data type of a column of prices shown with £ signs is <b>currency</b>.</div></div>`},
{teaches:['merge','centre','bold','wrap','conditional-formatting'],html:`<div class="teach-card"><h3>🎨 Formatting cells: the exam words</h3>
<p>Formatting changes how cells look. These are the words the mark schemes use.</p>
<table class="gm-tbl"><tr><th>Exam word</th><th>What you see</th></tr>
<tr><td><b>Merge cells</b></td><td>Two or more cells joined into one. There are no lines inside it, and one value stretches across it. You name it by its range, such as A1:D1.</td></tr>
<tr><td><b>Centre</b></td><td>The text sits in the middle of its cell.</td></tr>
<tr><td><b>Merge and centre</b></td><td>Both at once: one cell, with the text in the middle. Cells can be merged without being centred: then the text sits on the left.</td></tr>
<tr><td><b>Bold</b></td><td>Thick, dark text.</td></tr>
<tr><td><b>Wrap text</b></td><td>Long text goes onto more than one line inside its own cell, and the row gets taller.</td></tr>
<tr><td><b>Conditional formatting</b></td><td>A cell changes how it looks, such as its colour, only when a condition is met, for example more than 40 hours.</td></tr></table>
<div class="tip-box">Exam focus: merged titles came up in 2018, 2019, 2022, 2023 and 2025, and wrap text in 2021 and 2024. Look closely at the picture: no lines inside means merged; text in the middle means centred.</div></div>`}
],
rounds:[
{title:'Seat Finder',teachAt:[0,1],teaches:['cell-ref','range'],mode:'sim',sim:'seats',heading:'Find each seat and block on the grid',tip:'Column letter first, then row number. In a range, the colon means “to”.',tasks:[]},
{title:'Format Studio',teachAt:[2,3],mode:'sim',sim:'studio',heading:'Make the sheet match, find the formats, name them',tip:'No lines inside a block of cells means they are merged. A £ sign and two decimal places means currency. A % sign means percentage.',tasks:[]},
{title:'Exam Room',heading:'Real CCEA exam questions',teachAt:[],boss:{icon:'🎞️',name:'The Projector Gremlin'},tip:'Look at the picture from the exam paper carefully. Use the exam words: merged, centred, wrap text, bold, currency.',
 pool:[[[PP.fmt2018a,PP.fmt2019a,PP.fmt2022b,PP.fmt2023a],2],[[PP.fmt2021a,PP.fmt2024c],1],[[PP.fmt2025c],1],[[PP.type2022a],1],[[PP.cell2025a],1]],tasks:[]}
]};
