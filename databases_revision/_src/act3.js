/* Activity 3 — Query Gates. Sources: TB p12, TB p14; PP 2019 Q3(d)(e), 2021 Q2(c)(d)(f), 2024 Q3(e)(f), 2026 Q4(d). */
const QG_COLS=['Surname','Town','NoInGroup','ActivityDate','Activity','Paid'];
const QG_TYPE={Surname:'text',Town:'text',NoInGroup:'num',ActivityDate:'date',Activity:'text',Paid:'yn'};
/* every trap is in the table: a group of 1, Armagh groups of 4 and 5, a Banbridge booking, 31 May, 1 and 30 June, 1 July */
const QG_ROWS=[['Byrne','Newry',6,'03/05/2026','Archery',true],['Kelly','Armagh',3,'22/05/2026','Karting',true],
  ['Murphy','Newry',4,'09/06/2026','Quad Biking',false],['Walsh','Newry',2,'30/06/2026','Archery',true],
  ['Doyle','Dundalk',5,'01/07/2026','Horse Riding',false],['Quinn','Newry',8,'31/05/2026','Karting',true],
  ['Hughes','Armagh',7,'12/06/2026','Archery',true],['Lennon','Dundalk',1,'01/06/2026','Karting',false],
  ['Rafferty','Warrenpoint',4,'05/06/2026','Quad Biking',true],['McCann','Armagh',5,'18/04/2026','Horse Riding',true],
  ['Toner','Banbridge',2,'14/05/2026','Archery',false],['Grant','Armagh',4,'20/06/2026','Karting',true]];
function qgDate(s){const [d,m,y]=s.split('/');return +y*10000+ +m*100+ +d;}
function qgCellVal(i,v){const T=QG_TYPE[QG_COLS[i]];return T==='date'?qgDate(v):T==='text'?String(v).toLowerCase():v;}
const QG_QS=[
  {stage:0,text:'Which bookings are for Karting?',want:r=>r[4]==='Karting',model:'Activity: "Karting"'},
  {stage:0,text:'Which groups have fewer than 4 people?',want:r=>r[2]<4,model:'NoInGroup: &lt;4'},
  {stage:0,text:'Which bookings are not from Newry?',want:r=>r[1]!=='Newry',model:'Town: &lt;&gt;"Newry" (&lt;&gt; means not equal to)'},
  {stage:0,text:'Which bookings have not been paid yet?',want:r=>!r[5],model:'Paid: No (or False). Paid is a tick box, so the criteria is No, not a description.'},
  {stage:1,text:'Which Armagh bookings have 5 or more people?',want:r=>r[1]==='Armagh'&&r[2]>=5,and:true,model:'Town: "Armagh" and NoInGroup: &gt;=5, both on the Criteria row'},
  {stage:1,text:'Which bookings are from Dundalk or from Warrenpoint?',want:r=>r[1]==='Dundalk'||r[1]==='Warrenpoint',model:'Town: "Dundalk" on the Criteria row and "Warrenpoint" on the or row. "Dundalk" Or "Warrenpoint" in one box works too.'},
  {stage:2,text:'Which bookings are for a date in June 2026?',want:r=>qgDate(r[3])>=20260601&&qgDate(r[3])<=20260630,model:'ActivityDate: Between #01/06/2026# And #30/06/2026#'},
  {stage:3,text:'List the Karting bookings, with the biggest group first.',want:r=>r[4]==='Karting',order:[2,'Descending'],model:'Activity: "Karting", and Descending on the Sort row under NoInGroup'}];
const QG_EX={Surname:'"Kelly"',Town:'"Newry"',NoInGroup:'&gt;6',ActivityDate:'#15/05/2026#',Activity:'"Archery"',Paid:'Yes'};
const qgEsc=t=>String(t).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const QG_KEYS=[['=','='],['<>','<>'],['<','<'],['<=','<='],['>','>'],['>=','>='],['" "','""',1],['# #','##',1],['Between','Between '],['And',' And '],['Or',' Or '],['Not','Not '],['Yes','Yes'],['No','No']];
function qgTok(s){
  const out=[],Q='"\'“”‘’';let i=0;
  while(i<s.length){
    const ch=s[i];
    if(/\s/.test(ch)){i++;continue;}
    if(Q.includes(ch)){const rest=s.slice(i+1),m=[...rest].findIndex(c=>Q.includes(c));
      if(m<0)throw 'A quote mark is missing. Text goes between two quote marks, like "Newry".';
      out.push({t:'str',v:rest.slice(0,m).trim()});i+=m+2;continue;}
    if(ch==='#'){const j=s.indexOf('#',i+1);if(j<0)throw 'A date needs a # at each end, like #15/05/2026#.';out.push({t:'date',v:s.slice(i+1,j).trim()});i=j+1;continue;}
    const op=s.slice(i).match(/^(<>|<=|>=|<|>|=)/);
    if(op){out.push({t:'op',v:op[1]});i+=op[1].length;continue;}
    const w=s.slice(i).match(/^[^\s"'“”‘’#<>=]+/)[0];i+=w.length;
    out.push(['and','or','between','not','like'].includes(w.toLowerCase())?{t:'kw',v:w.toLowerCase()}:{t:'word',v:w});
  }
  return out;
}
function qgConv(f,kind,raw){
  const T=QG_TYPE[f];
  if(T==='num'){if(kind==='word'&&/^\d+$/.test(raw))return +raw;throw `${f} holds whole numbers, so its criteria must use a number, like ${QG_EX[f]}.`;}
  if(T==='date'){const m=(kind==='date'||kind==='word')&&raw.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if(!m)throw `${f} holds dates. Write a date between two # signs, like ${QG_EX[f]}.`;
    const d=+m[1],mo=+m[2],y=+m[3];
    if(mo<1||mo>12||d<1||d>new Date(y,mo,0).getDate())throw `${raw} is not a real date.`;
    return y*10000+mo*100+d;}
  if(T==='yn'){const w=kind==='word'?raw.toLowerCase():'';
    if(['yes','true','y','-1'].includes(w))return true;if(['no','false','n','0'].includes(w))return false;
    throw `${f} is a tick box. Its criteria is Yes or No (True or False), with no quote marks.`;}
  if(kind==='date')throw `${f} holds text, not dates. Put text between quote marks, like ${QG_EX[f]}.`;
  return raw.toLowerCase();
}
function qgParse(s,f){
  const tk=qgTok(s),T=QG_TYPE[f],consts=[];let p=0;
  if(!tk.length)return null;
  if(tk.some(t=>t.t==='kw'&&t.v==='like')||/[*?]/.test(s))throw 'This game does not use Like or the * wildcard. Type the exact value.';
  const col=tk[0].t==='word'&&QG_COLS.find(c=>c.toLowerCase()===tk[0].v.toLowerCase());
  if(col&&tk[1]&&tk[1].t!=='word')throw col===f?`You are already in the ${f} column, so leave out the field name. Type just the test, like ${QG_EX[f]}.`:`A test on ${col} goes in the ${col} column, not the ${f} column.`;
  const is=k=>tk[p]&&tk[p].t==='kw'&&tk[p].v===k;
  const val=()=>{
    const t=tk[p];
    if(!t||t.t==='op')throw 'An operator needs a value after it, like &gt;6.';
    if(t.t==='kw')throw `${t.v[0].toUpperCase()+t.v.slice(1)} needs a value before it and a value after it.`;
    p++;let raw=t.v;
    if(t.t==='word')while(tk[p]&&tk[p].t==='word'){raw+=' '+tk[p].v;p++;}
    consts.push(raw);return qgConv(f,t.t,raw);
  };
  const test=(op,a)=>x=>{const c=x<a?-1:x>a?1:0;return op==='='?c===0:op==='<>'?c!==0:op==='<'?c<0:op==='<='?c<=0:op==='>'?c>0:c>=0;};
  const term=()=>{
    if(is('between')){p++;const a=val();if(!is('and'))throw 'Between needs two values joined by And, like Between 2 And 5.';p++;const b=val();
      if(T==='yn')throw `${f} is a tick box: use Yes or No, not Between.`;
      if(a>b)throw 'Put the smaller value first, like Between 2 And 5.';
      return x=>x>=a&&x<=b;}
    if(is('not')){p++;return test('<>',val());}
    let op='=';if(tk[p]&&tk[p].t==='op'){op=tk[p].v;p++;}
    if(T==='yn'&&op!=='='&&op!=='<>')throw `${f} is a tick box: use Yes or No, not ${op.replace('<','&lt;').replace('>','&gt;')}.`;
    return test(op,val());
  };
  const andE=()=>{const fs=[term()];while(is('and')){p++;fs.push(term());}return x=>fs.every(g=>g(x));};
  const orE=()=>{const fs=[andE()];while(is('or')){p++;fs.push(andE());}return x=>fs.some(g=>g(x));};
  const fn=orE();
  if(p<tk.length)throw `The game cannot read “${qgEsc(s.trim())}” in the ${f} column. Type a value like ${QG_EX[f]}${QG_TYPE[f]==='yn'?'':', an operator and a value, or Between … And …'}.`;
  return {fn,consts};
}
function qgRowOk(row){
  const lines=QG.fn.map(L=>L.map((g,i)=>g?[g,i]:null).filter(Boolean)).filter(L=>L.length);
  return !lines.length||lines.some(L=>L.every(([g,i])=>g.fn(qgCellVal(i,row[i]))));
}
function qgSortRows(rows,sort){
  const keys=sort.map((d,i)=>[i,d]).filter(k=>k[1]);
  return rows.slice().sort((a,b)=>{for(const [i,d] of keys){const x=qgCellVal(i,a[i]),y=qgCellVal(i,b[i]);if(x!==y)return (x<y?-1:1)*(d==='Descending'?-1:1);}return 0;});
}
let QG=null;
function sim_gates(area,finish){
  QG={i:0};
  gmOpen(area,{title:'Query gates',icon:'🎢',stages:['One test','Two tests','Dates','Sort'],lives:3,finish});
  gmBanner('The booking desk','Each question needs a query. Type the criteria into the query design grid, in the column of the field it tests. As you type, the booking table shows which bookings meet your criteria. When you are sure, run the query: only the bookings that answer the question should come out. Eight questions, three lives.','🎢 First question',qgAsk);
}
function qgAsk(){
  const Q=QG_QS[QG.i];
  QG.cell=[QG_COLS.map(()=>''),QG_COLS.map(()=>'')];QG.sort=QG_COLS.map(()=>'');QG.fn=[[],[]];QG.focus=null;QG.bad=null;
  GM.state='build';gmMsg('');gmStage(Q.stage);
  $('gmMain').innerHTML=`<div class="gm-q">Question ${QG.i+1} of ${QG_QS.length}: ${Q.text}</div>
<div class="qg-acc"><div class="qg-bar"><span>🔍 Query1</span><span>Design view</span></div>
<div class="qg-pane"><div class="qg-list"><b>tblBookings</b><i>*</i>${QG_COLS.map(c=>`<i>${c}</i>`).join('')}</div></div>
<div class="qg-gridwrap"><table class="qg-design"><tr><th>Field:</th>${QG_COLS.map(c=>`<td><b>${c}</b></td>`).join('')}</tr>
<tr><th>Table:</th>${QG_COLS.map(()=>'<td>tblBookings</td>').join('')}</tr>
<tr><th>Sort:</th>${QG_COLS.map((c,i)=>`<td><select class="qg-sort" data-i="${i}" aria-label="Sort ${c}"><option value=""></option><option>Ascending</option><option>Descending</option></select></td>`).join('')}</tr>
<tr><th>Show:</th>${QG_COLS.map(()=>'<td class="qg-show">☑</td>').join('')}</tr>
${['Criteria:','or:'].map((h,k)=>`<tr><th>${h}</th>${QG_COLS.map((c,i)=>`<td><input class="qg-in" data-k="${k}" data-i="${i}" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" aria-label="${c}, ${k?'or row':'criteria row'}"></td>`).join('')}</tr>`).join('')}
</table></div>
<div class="fb-keys qg-keys">${QG_KEYS.map(([l],j)=>`<button class="fb-k" data-j="${j}">${l.replace(/</g,'&lt;').replace(/>/g,'&gt;')}</button>`).join('')}</div>
<div class="qg-note" id="qgNote"></div></div>
<div class="gm-btns"><button class="btn btn-primary" id="qgRun">▶ Run query</button></div>
<div class="qg-acc"><div class="qg-bar"><span id="qgDs">📋 tblBookings</span><span id="qgCount"></span></div><div class="qg-gridwrap"><table class="qg-data" id="qgTbl"></table></div></div>`;
  $('gmMain').querySelectorAll('.qg-in').forEach(inp=>{
    inp.onfocus=()=>{QG.focus=inp;};
    inp.oninput=()=>{QG.cell[+inp.dataset.k][+inp.dataset.i]=inp.value;qgLive();};
    inp.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();qgRun();}};
  });
  $('gmMain').querySelectorAll('.qg-sort').forEach(sel=>{sel.onchange=()=>{QG.sort[+sel.dataset.i]=sel.value;qgLive();};});
  $('gmMain').querySelectorAll('.qg-keys .fb-k').forEach(b=>{
    b.onpointerdown=e=>e.preventDefault();
    b.onclick=()=>{
      if(GM.state!=='build')return;
      const inp=QG.focus;if(!inp){$('qgNote').className='qg-note err';$('qgNote').textContent='Tap a box on the Criteria row or the or row first.';return;}
      const [,ins,back]=QG_KEYS[+b.dataset.j],a=inp.selectionStart??inp.value.length,z=inp.selectionEnd??a;
      inp.setRangeText(ins,a,z,'end');if(back)inp.setSelectionRange(a+ins.length-back,a+ins.length-back);
      inp.focus();inp.dispatchEvent(new Event('input'));
    };
  });
  $('qgRun').onclick=qgRun;
  qgTable(QG_ROWS,false);qgLive();qgSee($('gmMain').querySelector('.gm-q'));
}
function qgTable(rows,res){
  $('qgTbl').innerHTML=`<tr>${QG_COLS.map(c=>`<th>${c}</th>`).join('')}</tr>${rows.map(r=>`<tr data-i="${QG_ROWS.indexOf(r)}">${r.map((v,j)=>{const T=QG_TYPE[QG_COLS[j]];return `<td${T==='num'?' class="n"':T==='yn'?' class="yn"':''}>${T==='yn'?(v?'☑':'☐'):v}</td>`;}).join('')}</tr>`).join('')}${rows.length?'':`<tr><td colspan="${QG_COLS.length}" class="qg-empty">No records</td></tr>`}`;
  $('qgDs').textContent=res?'📋 Query1: the result':'📋 tblBookings';
  $('qgCount').textContent=`${rows.length} record${rows.length===1?'':'s'}`;
}
function qgLive(){
  QG.bad=null;
  QG.fn=[0,1].map(k=>QG_COLS.map((f,i)=>{
    const td=$('gmMain').querySelector(`.qg-in[data-k="${k}"][data-i="${i}"]`).parentNode;td.classList.remove('err');
    try{return qgParse(QG.cell[k][i],f);}catch(e){if(!QG.bad)QG.bad={k,i,msg:String(e)};td.classList.add('err');return null;}
  }));
  QG_COLS.forEach((f,i)=>{const n=Math.max(QG.cell[0][i].length,QG.cell[1][i].length);
    $('gmMain').querySelector(`.qg-in[data-k="0"][data-i="${i}"]`).parentNode.style.minWidth=n>11?Math.round(n*8.6+22)+'px':'';});
  const note=$('qgNote');
  if(QG.bad){note.className='qg-note err';note.innerHTML='⚠️ '+QG.bad.msg;return;}
  const any=QG.fn.flat().some(Boolean),n=QG_ROWS.filter(qgRowOk).length;
  $('qgTbl').querySelectorAll('tr[data-i]').forEach(tr=>tr.classList.toggle('off',!qgRowOk(QG_ROWS[+tr.dataset.i])));
  note.className='qg-note';
  note.textContent=any?`${n} of ${QG_ROWS.length} bookings ${n===1?'meets':'meet'} your criteria.`:'No criteria yet, so every booking would come out.';
}
function qgSee(el,end){if(!el)return;const r=el.getBoundingClientRect();if(end?r.bottom>innerHeight:r.top<0)el.scrollIntoView({block:end?'nearest':'start',behavior:RM?'auto':'smooth'});}
function qgLock(on){$('gmMain').querySelectorAll('.qg-in,.qg-sort,.qg-keys .fb-k,#qgRun').forEach(x=>x.disabled=on);}
function qgRun(){
  if(!GM||GM.state!=='build')return;
  if(QG.bad){gmMsg(`${QG.bad.msg} Fix that box, then run the query.`,'part');return;}
  if(!QG.fn.flat().some(Boolean)){gmMsg('Type the criteria into the grid first. Criteria go in the column of the field they test.','part');return;}
  GM.state='run';gmMsg('');qgLock(true);
  const trs=[...$('qgTbl').querySelectorAll('tr[data-i]')];let i=0;
  const step=()=>{
    if(!GM||GM.state!=='run')return;
    if(i<trs.length){const tr=trs[i++],ok=qgRowOk(QG_ROWS[+tr.dataset.i]);tr.className=ok?'pass':'fail';sfx(ok?'scan':'tick');return setTimeout(step,RM?30:120);}
    setTimeout(qgJudge,RM?60:350);
  };
  step();
}
function qgJudge(){
  if(!GM||GM.state!=='run')return;
  GM.state='fb';
  const Q=QG_QS[QG.i],res=qgSortRows(QG_ROWS.filter(qgRowOk),QG.sort),want=QG_ROWS.filter(Q.want);
  qgTable(res,true);
  const wrongIn=res.filter(r=>!Q.want(r)),missed=want.filter(r=>!res.includes(r));
  const wantOrd=Q.order?qgSortRows(want,QG_COLS.map((c,i)=>i===Q.order[0]?Q.order[1]:'')):null;
  const orderOk=!Q.order||res.every((r,j)=>r===wantOrd[j]);
  if(!wrongIn.length&&!missed.length&&orderOk){
    sfx('good');say(['Gate open! 🎢','Perfect query!','Spot on!'][QG.i%3]);
    gmMsg(`Your query found exactly the right ${want.length} bookings${Q.order?', in the right order':''}. One right answer: <b>${Q.model}</b>`,'correct');
    QG.i++;qgSee($('gmMsg'),1);
    return gmGo(QG.i<QG_QS.length?'Next question →':'Finish →',QG.i<QG_QS.length?qgAsk:()=>gmEnd(gmStars(GM.lives,3),'Gates closed for the day','You answered all eight questions with queries.'));
  }
  $('qgTbl').querySelectorAll('tr[data-i]').forEach(tr=>{if(!Q.want(QG_ROWS[+tr.dataset.i]))tr.classList.add('bad');});
  const out=gmLose();say('Wrong bookings! 😵');
  const d=r=>`${r[0]} (${r[1]}, ${r[2]} ${r[2]===1?'person':'people'}, ${r[3]}, ${r[4]}, ${r[5]?'paid':'not paid'})`;
  const lines=[];
  if(wrongIn.length)lines.push(`Came out but should not have: ${wrongIn.map(d).join('; ')}.`);
  if(missed.length)lines.push(`Missing: ${missed.map(d).join('; ')}.`);
  if(!wrongIn.length&&!missed.length)lines.push(QG.sort[Q.order[0]]==='Ascending'?'These are the right bookings, but Ascending puts the smallest group first. The question wants the biggest group first.':QG.sort[Q.order[0]]?'These are the right bookings, but not in the right order.':'These are the right bookings, but not in the right order. The Sort row decides the order of the result.');
  lines.push(...qgHints(Q,res));
  gmMsg(lines.map(l=>`<div>${l}</div>`).join(''),'wrong');qgSee($('gmMsg'),1);
  if(out)return gmGo('See what happened →',()=>gmEnd(0,'The gates are shut','Three queries let the wrong bookings out. Read the lessons on criteria and operators again, then have another go.'));
  gmGo('🛠️ Fix the query',()=>{GM.state='build';gmMsg('');qgTable(QG_ROWS,false);qgLock(false);qgLive();qgSee($('gmMain').querySelector('.gm-q'));});
}
function qgHints(Q,res){
  const h=[],seen={};
  QG.cell.forEach(L=>L.forEach((s,i)=>{
    if(QG_TYPE[QG_COLS[i]]!=='text'||!s.trim())return;
    let p;try{p=qgParse(s,QG_COLS[i]);}catch(e){return;}
    p.consts.forEach(c=>{
      const lc=c.toLowerCase();
      if(!seen[lc]&&/^\d+$/.test(c)){seen[lc]=1;return h.push(`${QG_COLS[i]} holds text, not numbers, so a test on the number ${qgEsc(c)} finds nothing there. A number test goes in the column that holds the numbers.`);}
      if(!seen[lc]&&/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(c)){seen[lc]=1;return h.push(`${QG_COLS[i]} holds text, not dates. A date test goes in the column that holds the dates.`);}
      if(seen[lc]||QG_ROWS.some(r=>String(r[i]).toLowerCase()===lc))return;
      const j=QG_COLS.findIndex((f,x)=>x!==i&&QG_TYPE[f]==='text'&&QG_ROWS.some(r=>String(r[x]).toLowerCase()===lc));
      if(j>=0){seen[lc]=1;h.push(`“${qgEsc(c)}” is in the ${QG_COLS[j]} column of the table, so its criteria goes in the ${QG_COLS[j]} column, not the ${QG_COLS[i]} column.`);}
    });
  }));
  if(!res.length)h.push('Your query found no bookings at all. A booking has to pass every test on the same row of the grid at once.');
  if(!res.length&&QG.cell.some(L=>L.some((x,i)=>QG_TYPE[QG_COLS[i]]==='text'&&/\band\b/i.test(x)&&!/between/i.test(x))))h.push('One field cannot hold two different values at once, so a test like "Dundalk" And "Newry" finds nothing. When either value will do, use Or, or put the second value on the or row.');
  const want=QG_ROWS.filter(Q.want),missed=want.filter(r=>!res.includes(r)),wrongIn=res.filter(r=>!Q.want(r));
  QG.cell.forEach(L=>L.forEach((x,i)=>{
    const T=QG_TYPE[QG_COLS[i]];if(T!=='num'&&T!=='date')return;
    const m=x.match(/(?:^|[^<>])([<>])(?!=)\s*#?([\d\/]+)/);if(!m||seen[i])return;
    let v;try{v=qgConv(QG_COLS[i],T==='date'?'date':'word',m[2]);}catch(e){return;}
    const r=missed.find(r=>qgCellVal(i,r[i])===v);
    if(r){seen[i]=1;h.push(`${r[0]}’s ${QG_COLS[i]} is exactly ${qgEsc(m[2])}. ${m[1]==='>'?'Greater than':'Less than'} leaves out the value itself; ${m[1]}= lets it in.`);}
  }));
  if(Q.stage===2&&wrongIn.length&&!QG.cell.some(L=>/between|\band\b/i.test(L[3])))h.push('Your date test has only one end, so every date beyond it comes out too. A range of dates needs two ends: Between … And ….');
  if(Q.and&&QG.fn.every(L=>L.some(Boolean)))h.push('A booking only has to pass one row of the grid. When both tests must be true, put them on the same Criteria row.');
  return h;
}
const ACT={
title:'Query Gates',icon:'🎢',
intro:'The activity centre needs answers from its booking database. Your mission: type criteria into a query design grid, with operators, AND, OR, BETWEEN and sorting, so that only the right bookings come out.',
topics:'Queries, criteria, the query design grid, comparison operators, AND, OR and BETWEEN, tick-box criteria, sorting',
ranks:['Chief Gatekeeper','Senior Gatekeeper','Gate Trainee','New Starter — revise and retry'],
next:{href:'activity4.html',label:'Next: The Front Office'},
teach:[
{teaches:['query','criteria','report'],html:`<div class="teach-card"><h3>❓ Asking the database a question</h3>
<p>A <span class="term">query</span> searches and filters data in a database that satisfies the query <b>criteria</b>. It is used to search and extract data from a database to find the answer to a question.</p>
<p style="margin-top:8px;">You build a query in the <b>query design grid</b>. Each field has its own column. The criteria go on the <b>Criteria</b> row, in the column of the field they test.</p>
<table class="gm-tbl"><tr><th>Field:</th><td>Surname</td><td>Town</td><td>Activity</td></tr><tr><th>Criteria:</th><td></td><td><b>"Newry"</b></td><td></td></tr></table>
<div class="highlight">Question: “Which bookings are from Newry?” Newry is a town, so "Newry" goes in the Town column. Only the records that meet the criteria come out.</div>
<p style="margin-top:8px;">A query finds the records. A <span class="term">report</span> then presents the results, ready to print. When a report shows a set of records, a query usually found them first.</p></div>`},
{teaches:['operators'],html:`<div class="teach-card"><h3>🎢 The ride gate: comparison operators</h3>
<p>Comparing a value against other data is a typical operation when data is queried.</p>
<table class="gm-tbl"><tr><th>Operator</th><th>Meaning</th></tr><tr><td><b>&lt;</b></td><td>Less than</td></tr><tr><td><b>&lt;=</b></td><td>Less than or equal to</td></tr>
<tr><td><b>&gt;</b></td><td>Greater than</td></tr><tr><td><b>&gt;=</b></td><td>Greater than or equal to</td></tr><tr><td><b>=</b></td><td>Equal to</td></tr><tr><td><b>&lt;&gt;</b></td><td>Not equal to</td></tr></table>
<div class="tip-box">The gate sign says <b>Height &gt;= 120</b>. Una is exactly 120 cm. She gets through, because of the <b>=</b>. With <b>Height &gt; 120</b> she would be turned away.</div></div>`},
{teaches:['and-or'],html:`<div class="teach-card"><h3>🚦 Two tests: AND, OR, BETWEEN</h3>
<p><span class="term">Logical operators</span> analyse two values and return either a true or a false result. They are the words <b>AND</b>, <b>OR</b> and <b>BETWEEN</b>.</p>
<ul style="padding-left:20px;margin-top:6px;"><li><b>AND</b>: both conditions must be true. In the grid, put both criteria on the same Criteria row.</li>
<li><b>OR</b>: either condition can be true. Put the second criteria on the <b>or</b> row, the next row of the grid.</li>
<li><b>BETWEEN</b>: the value must be between the two values stated, and both end values count. Dates go between # signs: Between #01/05/2026# And #31/05/2026# finds every date in May 2026.</li></ul>
<table class="gm-tbl" style="margin-top:8px;"><tr><th>Field:</th><td>Town</td><td>NoInGroup</td></tr><tr><th>Criteria:</th><td><b>"Newry"</b></td><td><b>&gt;6</b></td></tr><tr><th>or:</th><td><b>"Banbridge"</b></td><td></td></tr></table>
<p style="margin-top:6px;">This grid finds Newry bookings with more than 6 people, <b>or</b> any Banbridge booking.</p>
<div class="tip-box">Exam focus: 2021 wanted Japan in the Country column. 2024 put =26 on the Criteria row and =40 on the or row, so a booking is shown if its price is £26 or £40.</div></div>`},
{teaches:['sort','boolean-criteria'],html:`<div class="teach-card"><h3>🔃 Sorting, and tick-box fields</h3>
<p><span class="term">Sorting</span> puts the records in order of a field. <b>Ascending</b> is A to Z, smallest number first, earliest date first. <b>Descending</b> is Z to A, largest number first, latest date first. In the query grid, you choose it on the <b>Sort</b> row under the field.</p>
<div class="highlight">To see how a table is sorted, find the column that runs in order from top to bottom. When asked how the data is sorted, name that field.</div>
<p style="margin-top:8px;">A tick-box field (the Yes/No data type) has only two values. Its criteria is <b>Yes</b> or <b>True</b> for ticked, and <b>No</b> or <b>False</b> for not ticked. The mark scheme also accepts Y and N.</p>
<div class="tip-box">Write the criteria, not a description. For the DVDs not returned, the field is RETURNED and the criteria is False (2019).</div></div>`}
],
rounds:[
{title:'Through or Turned Away?',teachAt:[0,1,2],variant:'belt',heading:'Does this rider get through the gate?',tip:'Read the operator carefully. >= and <= let the boundary value through; > and < do not. <> means not equal to. AND needs both tests true; OR needs one.',
 choices:[{key:'in',label:'✅ Through the gate'},{key:'out',label:'⛔ Turned away'}],
 tasks:[
  {type:'classify',text:'Sign: Height >= 120 · Una, 120 cm',answer:'in',src:'TB p14',feedback:'120 >= 120 is true: greater than OR EQUAL TO.'},
  {type:'classify',text:'Sign: Age < 12 · Rory, age 12',answer:'out',src:'TB p14',feedback:'12 is not less than 12, so Rory is turned away.'},
  {type:'classify',text:'Sign: Town <> "Newry" · Kai, from Newry',answer:'out',src:'TB p14',feedback:'<> means not equal to. Kai is from Newry, so the test is false.'},
  {type:'classify',text:'Sign: Height > 140 · Rory, 141 cm',answer:'in',src:'TB p14',feedback:'141 is greater than 140.'},
  {type:'classify',text:'Sign: Age <= 9 · Tara, age 9',answer:'in',src:'TB p14',feedback:'9 <= 9 is true: less than OR EQUAL TO.'},
  {type:'classify',text:'Sign: Town = "Newry" · Liam, from Dundalk',answer:'out',src:'TB p14',feedback:'Dundalk is not equal to Newry.'},
  {type:'classify',text:'Sign: Age Between 8 And 11 · Sam, age 11',answer:'in',src:'TB p14',feedback:'Between includes both end values, so 11 gets through.'},
  {type:'classify',text:'Sign: Age Between 8 And 11 · Orla, age 12',answer:'out',src:'TB p14',feedback:'12 is above 11, so it is not between 8 and 11.'},
  {type:'classify',text:'Sign: Age < 12 And Wristband = Yes · Sam, age 10, no wristband',answer:'out',src:'TB p14',feedback:'With AND, both must be true. Sam has no wristband.'},
  {type:'classify',text:'Sign: Age < 12 And Wristband = Yes · Ellie, age 11, wristband',answer:'in',src:'TB p14',feedback:'Both conditions are true.'},
  {type:'classify',text:'Sign: Town = "Armagh" Or Town = "Newry" · Dara, from Newry',answer:'in',src:'TB p14',feedback:'With OR, one true condition is enough.'},
  {type:'classify',text:'Sign: Town = "Armagh" Or Town = "Newry" · Niall, from Dundalk',answer:'out',src:'TB p14',feedback:'With OR, at least one condition must be true. Dundalk is neither Armagh nor Newry.'}
 ]},
{title:'Gate Builder',teachAt:[3],mode:'sim',sim:'gates',heading:'Type the criteria, then run the query',tip:'Find the field the question is about and type the test in its column. Both tests must be true: same Criteria row. Either will do: use the or row. A range of values: Between … And …. An order: the Sort row.',tasks:[]},
{title:'Exam Room',heading:'Real CCEA exam questions',teachAt:[],boss:{icon:'🎡',name:'The Broken Turnstile'},tip:'Criteria go in the right field’s column. OR goes on the next row. A tick box takes Yes or No. Name the field when you describe a sort.',
 tasks:[],pool:[[[PP.qry2026q4d1,PP.qry2019q3e,PP.qry2021q2f1],1],[[PP.qry2021q2c2],1],[[PP.qry2019q3d1,PP.qry2021q2d,PP.qry2024q3e],2],[[PP.qry2024q3f],1]]}
]};
