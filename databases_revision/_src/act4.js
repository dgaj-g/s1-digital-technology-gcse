/* Activity 4 — The Front Office. Sources: TB p12; PP 2018 Q7(f), 2019 Q3(d), 2021 Q2(f), 2022 Q10(a), 2023 Q3(a), 2024 Q10, 2025 Q5(c), 2026 Q4(d). */
/* The bookings are rows of the Activity 3 table (same names, activities and dates). Location as TB p12: Archery and Karting are Indoor; Quad Biking and Horse Riding are Outdoor. */
const RD_ROWS=[['Byrne','Indoor','Archery','03/05/2026'],['Kelly','Indoor','Karting','22/05/2026'],['Murphy','Outdoor','Quad Biking','09/06/2026'],
  ['Walsh','Indoor','Archery','30/06/2026'],['Doyle','Outdoor','Horse Riding','01/07/2026'],['Quinn','Indoor','Karting','31/05/2026'],
  ['Hughes','Indoor','Archery','12/06/2026'],['Rafferty','Outdoor','Quad Biking','05/06/2026'],['McCann','Outdoor','Horse Riding','18/04/2026']];
const RD_COLS=['Surname','Location','Activity','ActivityDate'];
const RD_CC={Surname:'sur',Location:'loc',Activity:'act',ActivityDate:'dat'};
function rdKey(c,r){const v=r[RD_COLS.indexOf(c)];if(c!=='ActivityDate')return v;const [d,m,y]=v.split('/');return y+m+d;}
/* s = {group: field or null, sort: field or null, ord}. Groups are always listed A to Z (earliest first for dates); ord sorts the rows inside each group. */
function rdSorted(s){
  const rows=[...RD_ROWS];
  if(s.sort)rows.sort((a,b)=>{const x=rdKey(s.sort,a),y=rdKey(s.sort,b);return (x<y?-1:x>y?1:0)*(s.ord==='Descending'?-1:1);});
  if(!s.group)return [['',rows]];
  const keys=[...new Set(rows.map(r=>rdKey(s.group,r)))].sort();
  return keys.map(k=>{const g=rows.filter(r=>rdKey(s.group,r)===k);return [g[0][RD_COLS.indexOf(s.group)],g];});
}
const rdShape=s=>rdSorted(s).map(([k,rows])=>k+':'+rows.map(r=>r[0]).join(',')).join('|');
function rdPaperHtml(s,title){
  const cols=RD_COLS.filter(c=>c!==s.group),g=rdSorted(s);
  return `<div class="rd-title">${title}</div><div class="qg-gridwrap"><table class="rd-tbl"><tr>${s.group?`<th>${s.group}</th>`:''}${cols.map(c=>`<th>${c}</th>`).join('')}</tr>
${g.map(([k,rows])=>(s.group?`<tr class="rd-g"><td colspan="${cols.length+1}">${k}</td></tr>`:'')+rows.map(r=>`<tr data-k="${r[0]}">${s.group?'<td></td>':''}${cols.map(c=>`<td>${r[RD_COLS.indexOf(c)]}</td>`).join('')}</tr>`).join('')).join('')}</table></div>`;
}
/* Rebuild the report; rows glide to their new places */
function rdRender(el,s,title){
  const old={};if(!RM)el.querySelectorAll('tr[data-k]').forEach(tr=>old[tr.dataset.k]=tr.getBoundingClientRect().top);
  el.innerHTML=rdPaperHtml(s,title);
  if(RM)return;
  el.querySelectorAll('tr[data-k]').forEach(tr=>{const o=old[tr.dataset.k];if(o==null)return;const d=o-tr.getBoundingClientRect().top;if(Math.abs(d)<1)return;
    tr.style.transition='none';tr.style.transform=`translateY(${d}px)`;void tr.offsetWidth;tr.style.transition='transform 0.4s ease';tr.style.transform='';});
}
const RD_REQS=[
 {who:'🧑‍🏫 The Principal',text:'“I want the bookings grouped by Location, with the surnames from A to Z inside each group.”',
  want:{group:'Location',sort:'Surname',ord:'Ascending'},start:{group:'Activity',sort:'ActivityDate',ord:'Descending'},yes:'The Principal can see every Indoor and Outdoor booking at a glance.'},
 {who:'🏹 The instructors',text:'“Group the bookings by Activity, please, with the latest ActivityDate first in each group.”',
  want:{group:'Activity',sort:'ActivityDate',ord:'Descending'},start:{group:null,sort:'Surname',ord:'Ascending'},yes:'Each instructor can find their own activity, with the newest booking at the top.'},
 {who:'🚌 The minibus driver',text:'“Just one list, with no groups. Put the earliest ActivityDate first so I can plan the trips in date order.”',
  want:{group:null,sort:'ActivityDate',ord:'Ascending'},start:{group:'Location',sort:'Surname',ord:'Descending'},yes:'The driver can plan the trips from the top of the list down.'}];
const RD_WALL=[{group:'Activity',sort:'Surname',ord:'Ascending'},{group:'Location',sort:'ActivityDate',ord:'Descending'},{group:null,sort:'Surname',ord:'Descending'}];
const rdOrdWord=(f,o)=>f==='ActivityDate'?(o==='Ascending'?'earliest first':'latest first'):(o==='Ascending'?'A to Z':'Z to A');
let RD=null;
function sim_reportdesk(area,finish){
  RD={i:0,reqs:gmShuffle([...RD_REQS]),wall:gmShuffle([...RD_WALL]).slice(0,2),w:0,miss:0,sel:null,drag:null,s:null,mode:''};
  gmOpen(area,{title:'The report desk',icon:'🏢',stages:['Make the reports','Read the reports','Record the macro'],lives:3,finish});
  gmBanner('Reports for the wall','Three people want a report of the bookings. For each one, choose how to group it, what to sort it by, and the order. The report rebuilds as you change it. Pin it up when it is what they asked for. A wrong report gets torn down.','📋 First request',rdAsk);
}
/* ---- chips and slots (drag, or tap a chip then tap a box) ---- */
function rdTray(extra){
  return `<div class="dr-tray rd-tray" id="rdTray">${RD_COLS.map(c=>`<button class="dr-badge rd-badge c-${RD_CC[c]}" data-c="${c}">${c}</button>`).join('')}${extra?`<button class="dr-badge rd-badge c-none" data-c="none">No groups</button>`:''}</div>`;
}
const rdChip=c=>c==='none'?`<span class="dr-chip c-none">No groups</span>`:`<span class="dr-chip c-${RD_CC[c]}">${c}</span>`;
function rdSlot(slot,label){return `<div class="rd-box"><span class="rd-lab">${label}</span><button class="dr-slot rd-slot" data-slot="${slot}"></button></div>`;}
function rdOrd(){return `<div class="rd-box"><span class="rd-lab">Order</span><div class="rd-ord" role="group" aria-label="Order">${['Ascending','Descending'].map(o=>`<button class="rd-o" data-o="${o}">${o==='Ascending'?'▲':'▼'} ${o}</button>`).join('')}</div></div>`;}
function rdWire(place,ok){
  const tray=$('rdTray');
  tray.onpointerdown=e=>{const b=e.target.closest('.rd-badge');if(!b||!ok())return;RD.drag={c:b.dataset.c,x:e.clientX,y:e.clientY,moved:false,ghost:null};};
  document.onpointermove=e=>{const d=RD&&RD.drag;if(!d)return;
    if(!d.moved&&Math.hypot(e.clientX-d.x,e.clientY-d.y)<7)return;
    if(!d.moved){d.moved=true;d.ghost=document.createElement('div');d.ghost.className='dr-ghost dr-badge rd-badge c-'+(d.c==='none'?'none':RD_CC[d.c]);d.ghost.textContent=d.c==='none'?'No groups':d.c;document.body.appendChild(d.ghost);}
    d.ghost.style.left=e.clientX+'px';d.ghost.style.top=e.clientY+'px';
    document.querySelectorAll('.rd-slot.over').forEach(s=>s.classList.remove('over'));
    const s=rdSlotAt(e);if(s)s.classList.add('over');e.preventDefault();};
  document.onpointerup=e=>{const d=RD&&RD.drag;if(!d)return;RD.drag=null;
    if(d.ghost)d.ghost.remove();document.querySelectorAll('.rd-slot.over').forEach(s=>s.classList.remove('over'));
    if(!d.moved){RD.sel=RD.sel===d.c?null:d.c;return rdPaintSel();}
    const s=rdSlotAt(e);if(s){RD.sel=null;place(s.dataset.slot,d.c);}};
  document.onpointercancel=()=>{const d=RD&&RD.drag;if(d&&d.ghost)d.ghost.remove();if(RD)RD.drag=null;};
  document.querySelectorAll('.rd-slot').forEach(s=>s.onclick=()=>{if(!ok())return;
    if(RD.sel){const c=RD.sel;RD.sel=null;place(s.dataset.slot,c);}else place(s.dataset.slot,null);});
  document.querySelectorAll('.rd-o').forEach(b=>b.onclick=()=>{if(!ok())return;RD.s.ord=b.dataset.o;sfx('tick');rdChanged();});
}
function rdSlotAt(e){const el=document.elementFromPoint(e.clientX,e.clientY);return el&&el.closest('.rd-slot');}
function rdPaintSel(){
  document.querySelectorAll('.rd-badge').forEach(b=>b.classList.toggle('on',b.dataset.c===RD.sel));
  document.querySelectorAll('.rd-slot').forEach(s=>s.classList.toggle('ready',!!RD.sel));
  rdPaintSlots();
}
function rdPaintSlots(){
  const s=RD.s;
  document.querySelectorAll('.rd-slot').forEach(el=>{const k=el.dataset.slot,v=k==='group'?s.group:s.sort;
    el.classList.toggle('set',!!v);
    el.innerHTML=v?`${rdChip(v)}<i class="dr-x" aria-hidden="true">✕</i>`:`<span class="dr-none">${RD.sel?'Tap to put it here':(k==='group'&&RD.mode==='make'?'No groups':'Empty')}</span>`;
    el.setAttribute('aria-label',`${k==='group'?'Group by':'Sort by'}: ${v?(v==='none'?'no groups':v)+'. Tap to take it out.':(k==='group'&&RD.mode==='make'?'no groups':'empty')}`);});
  document.querySelectorAll('.rd-o').forEach(b=>{b.classList.toggle('on',b.dataset.o===s.ord);b.setAttribute('aria-pressed',b.dataset.o===s.ord);});
}
function rdChanged(){rdPaintSlots();if(RD.mode==='make')rdRender($('rdPaper'),RD.s,'Activity Bookings');}
/* ---- Stage 1: make the reports ---- */
function rdAsk(){
  gmStage(0);GM.state='play';gmMsg('');RD.mode='make';RD.sel=null;
  const q=RD.reqs[RD.i];RD.s={...q.start};
  $('gmMain').innerHTML=`<div class="gm-q">Request ${RD.i+1} of ${RD.reqs.length}. <b>${q.who}:</b> ${q.text}</div>
<div class="gm-panel"><div class="vs-h">Last week’s report is still set up. Change it to what they want.</div>${rdTray(false)}
<div class="rd-set2">${rdSlot('group','Group by')}${rdSlot('sort','Sort by')}${rdOrd()}</div>
<div class="rd-note">Drag a field into a box, or tap a field and then tap a box. Tap a box to empty it. Groups are listed in order: A to Z, or earliest date first. Sort by puts the rows inside each group in order. Order says ascending (A to Z, or earliest date first) or descending (Z to A, or latest date first).</div></div>
<div class="rd-paper" id="rdPaper"></div><div class="gm-btns"><button class="btn btn-primary" id="rdPin">📌 Pin it up</button></div>`;
  rdWire(rdPlaceMake,()=>GM.state==='play');rdPaintSel();rdRender($('rdPaper'),RD.s,'Activity Bookings');
  $('rdPin').onclick=rdPin;
}
function rdPlaceMake(slot,c){
  const s=RD.s;
  if(c===null){if(slot==='group'){if(!s.group)return;s.group=null;}else{if(!s.sort)return;s.sort=null;}sfx('tick');gmMsg('');return rdChanged();}
  if(slot==='sort'&&c===s.group){rdPaintSel();return gmMsg(`The report is grouped by ${c}, so every row inside a group has the same ${c}. Sort by a different field.`,'part');}
  if(slot==='group'){s.group=c;if(s.sort===c){s.sort=null;gmMsg(`${c} moved to Group by. Now choose a field to sort by.`,'part');}else gmMsg('');}
  else{s.sort=c;gmMsg('');}
  sfx('zap');rdPaintSel();rdChanged();
  const el=document.querySelector(`.rd-slot[data-slot="${slot}"]`);if(el&&!RM){el.classList.remove('pop');void el.offsetWidth;el.classList.add('pop');}
}
function rdWrong(w,s){
  const out=[];
  if(s.group!==w.group)out.push(w.group?`it should be grouped by ${w.group}`:'it should have no groups');
  if(s.sort!==w.sort)out.push(`it should be sorted by ${w.sort}`);
  else if(s.ord!==w.ord)out.push(`the order should be ${w.ord.toLowerCase()} (${rdOrdWord(w.sort,w.ord)})`);
  return out;
}
function rdLock(on){$('gmMain').querySelectorAll('.rd-badge,.rd-slot,.rd-o,#rdPin,#rdCheck').forEach(x=>x.disabled=on);}
function rdPin(){
  if(GM.state!=='play')return;GM.state='fb';rdLock(true);
  const q=RD.reqs[RD.i],s=RD.s;
  if(rdShape(s)===rdShape(q.want)){
    sfx('good');say(['Pinned! 📌','Lovely report!','Just right!'][RD.i%3]);$('rdPaper').classList.add('pinned');
    gmMsg(`Pinned up. ${q.yes}`,'correct');RD.i++;
    return gmGo(RD.i<RD.reqs.length?'Next request →':'Read last term’s reports →',RD.i<RD.reqs.length?rdAsk:rdReadStart);
  }
  $('rdPaper').classList.add('torn');const out=gmLose();say('Torn down! 😬');
  gmMsg(`Torn down: ${rdWrong(q.want,s).join(', and ')}.`,'wrong');
  if(out)return gmGo('See what happened →',()=>gmEnd(0,'The wall is empty','Three reports went wrong. Read the lesson on reports again, then have another go.'));
  gmGo('🛠️ Change the layout',()=>{GM.state='play';gmMsg('');$('rdPaper').classList.remove('torn');rdLock(false);});
}
/* ---- Stage 2: read a finished report and say how it is organised (no live preview) ---- */
function rdReadStart(){
  gmStage(1);GM.state='banner';gmMsg('');
  gmBanner('Last term’s reports','Two old reports are still on the wall. Nobody wrote down how they were made. Look at each one and say how the data has been organised: what it is grouped by, what it is sorted by, and the order. This time there is no preview to help you.','🔍 First report',rdRead);
}
function rdRead(){
  gmStage(1);GM.state='read';gmMsg('');RD.mode='read';RD.sel=null;RD.miss=0;RD.s={group:null,sort:null,ord:null};
  const W=RD.wall[RD.w];
  $('gmMain').innerHTML=`<div class="gm-q">Report ${RD.w+1} of ${RD.wall.length}. How has the data on this report been organised?</div>
<div class="rd-paper pinned rd-old">${rdPaperHtml(W,'Activity Bookings')}</div>
<div class="gm-panel">${rdTray(true)}<div class="rd-set2">${rdSlot('group','Grouped by')}${rdSlot('sort','Sorted by')}${rdOrd()}</div>
<div class="rd-note">If the report has no group headings, put <b>No groups</b> in the first box.</div></div>
<div class="gm-btns"><button class="btn btn-primary" id="rdCheck">✔ Check</button></div>`;
  rdWire(rdPlaceRead,()=>GM.state==='read');rdPaintSel();
  $('rdCheck').onclick=rdCheck;
}
function rdPlaceRead(slot,c){
  const s=RD.s;
  if(c===null){if(slot==='group'){if(!s.group)return;s.group=null;}else{if(!s.sort)return;s.sort=null;}sfx('tick');return rdChanged();}
  if(slot==='sort'&&c==='none'){rdPaintSel();return gmMsg('No groups only goes in the first box. Every report here is sorted by one of the fields.','part');}
  if(slot==='sort'&&c===s.group){rdPaintSel();return gmMsg(`You said it is grouped by ${c}. Every row inside a group has the same ${c}, so the rows must be sorted by a different field.`,'part');}
  if(slot==='group'){s.group=c;if(s.sort===c)s.sort=null;}else s.sort=c;
  gmMsg('');sfx('zap');rdPaintSel();
}
function rdCheck(){
  if(GM.state!=='read')return;
  const s=RD.s,W=RD.wall[RD.w];
  if(!s.group||!s.sort||!s.ord)return gmMsg('Fill both boxes and choose the order first.','part');
  GM.state='fb';rdLock(true);
  const said={group:s.group==='none'?null:s.group,sort:s.sort,ord:s.ord};
  if(rdShape(said)===rdShape(W)){
    sfx('good');say('Well read! 🔍');
    gmMsg(`Right: ${W.group?`grouped by ${W.group}, `:'no groups, '}sorted by ${W.sort}, ${W.ord.toLowerCase()} (${rdOrdWord(W.sort,W.ord)}). In an exam, name the field, as you just did.`,'correct');RD.w++;
    return gmGo(RD.w<RD.wall.length?'Next report →':'Friday jobs →',RD.w<RD.wall.length?rdRead:mcStart);
  }
  RD.miss++;const out=gmLose();say('Not quite 🤔');
  let why;
  const gOk=said.group===W.group;
  if(RD.miss===1){
    why=!gOk?(W.group?'The groups are not right. Look at the words in the bold heading rows: which field are they from?':'This report has no bold group headings. It is one list.')
      :(W.group?'The groups are right, but the rows inside them are not in that order. Read down each column, in every group, and find the one that is in order in all of them.'
        :'Right, there are no groups. But the rows are not in that order. Read down each column and find the one that is in order.');
  }else{
    why=!gOk?(W.group?`The bold headings are ${[...new Set(RD_ROWS.map(r=>r[RD_COLS.indexOf(W.group)]))].sort().join(', ')}. They come from the ${W.group} field, so the report is grouped by ${W.group}.`:'There are no group headings, so put No groups in the first box.')
      :`${W.group?'Inside each group':'Down the list,'} the ${W.sort} column goes ${rdOrdWord(W.sort,W.ord)}, so it is sorted by ${W.sort}, ${W.ord.toLowerCase()}.`;
  }
  gmMsg(why,'wrong');
  if(out)return gmGo('See what happened →',()=>gmEnd(0,'The old reports stayed a mystery','Three readings went wrong. Read the lesson on reports again, then have another go.'));
  gmGo('🔍 Look again',()=>{GM.state='read';gmMsg('');rdLock(false);});
}
/* ---- Stage 3: watch the Friday steps by hand, then record them as a macro ---- */
const MC_STEPS=[['q','Run the Friday bookings query'],['o','Open the Friday bookings report'],['p','Print the report']];
const MC_DECOYS=[['d','Delete last week’s bookings'],['f','Open a blank booking form']];
function mcStart(){
  gmStage(2);GM.state='watch';gmMsg('');
  $('gmMain').innerHTML=`<div class="gm-q">Every Friday the office does the same three jobs by hand. Watch them once.</div>
<div class="gm-panel"><div class="mc-clock">⏱️ <b id="mcMin">0</b> minutes</div><ol class="mc-steps" id="mcHand"></ol></div>`;
  let k=0;
  const step=()=>{
    if(!GM||GM.state!=='watch')return;
    if(k<MC_STEPS.length){$('mcHand').insertAdjacentHTML('beforeend',`<li>${MC_STEPS[k][1]}</li>`);$('mcMin').textContent=(k+1)*4;k++;sfx('tick');return setTimeout(step,RM?200:1100);}
    gmMsg('Twelve minutes, every Friday. A macro could do this with a single click of a button.','part');gmGo('🔴 Record a macro',mcRecord);
  };
  setTimeout(step,RM?100:600);
}
function mcRecord(){
  GM.state='rec';gmMsg('');MC=[];
  const opts=gmShuffle([...MC_STEPS,...MC_DECOYS]);
  $('gmMain').innerHTML=`<div class="gm-q">Click the steps the macro should store, in the order it should do them. Then press Run macro.</div>
<div class="mc-wrap"><div class="gm-panel"><div class="vs-h">Steps you can store</div><div class="mcq-list" id="mcOpts">${opts.map(([k,t])=>`<button class="mcq-btn" data-k="${k}">${t}</button>`).join('')}</div></div>
<div class="gm-panel"><div class="vs-h">🔴 The macro</div><ol class="mc-steps" id="mcList"></ol><button class="btn btn-ghost" id="mcClear">Clear</button></div></div>
<div class="gm-btns"><button class="mc-gold" id="mcRun" disabled>▶ Run macro</button></div>`;
  const sync=()=>{$('mcList').innerHTML=MC.map(k=>`<li>${[...MC_STEPS,...MC_DECOYS].find(s=>s[0]===k)[1]}</li>`).join('');
    document.querySelectorAll('#mcOpts .mcq-btn').forEach(b=>b.disabled=MC.includes(b.dataset.k));$('mcRun').disabled=!MC.length;};
  document.querySelectorAll('#mcOpts .mcq-btn').forEach(b=>b.onclick=()=>{if(GM.state!=='rec')return;MC.push(b.dataset.k);sfx('tick');sync();});
  $('mcClear').onclick=()=>{if(GM.state!=='rec')return;MC=[];sync();};
  $('mcRun').onclick=mcRun;
}
let MC=[];
function mcRun(){
  if(GM.state!=='rec')return;GM.state='fb';
  $('gmMain').querySelectorAll('button').forEach(x=>x.disabled=true);
  const got=MC.join(''),right='qop';
  if(got===right){
    sfx('win');say('One click! ⚡');
    $('gmMain').insertAdjacentHTML('beforeend',`<div class="gm-panel mc-weeks">${[2,3,4].map(w=>`<div>Week ${w}: ▶ one click … ✅ printed</div>`).join('')}</div>`);
    gmMsg('The macro ran the query, opened the report and printed it with a single click. Weeks 2, 3 and 4 took seconds instead of 36 minutes by hand.','correct');
    return gmGo('Finish →',()=>gmEnd(gmStars(GM.lives,3),'The front office is running','Your reports went up, you read last term’s old ones, and your macro does the Friday jobs with a single click.'));
  }
  let why;
  if(MC.includes('d'))why='The macro deleted last week’s bookings. That is not one of the Friday jobs.';
  else if(MC.includes('f'))why='The macro opened a blank form. That is not one of the Friday jobs.';
  else if(MC.length<3)why='The macro is missing a step, so the Friday jobs were not all done.';
  else if(MC.indexOf('p')<MC.indexOf('o'))why='The macro tried to print before the report was open, so nothing was printed.';
  else why='The report was opened before the query had found any bookings, so it had nothing to show.';
  const out=gmLose();say('Empty page! 📄');
  gmMsg(why,'wrong');
  if(out)return gmGo('See what happened →',()=>gmEnd(0,'The Friday jobs failed','Three tries went wrong. Read the lesson on macros again, then have another go.'));
  gmGo('🔴 Record it again',mcRecord);
}
const ACT={
title:'The Front Office',icon:'🏢',
intro:'The activity centre’s front office uses forms, reports and macros every day. Your mission: choose the right tool for each job, make and read the reports on the wall, and record a macro that does the Friday jobs for you.',
topics:'The database toolkit, forms, reports, customising a report’s layout, macros',
ranks:['Office Manager','Senior Administrator','Office Trainee','New Starter — revise and retry'],
next:{href:'activity5.html',label:'Next: The Festival'},
teach:[
{teaches:['table','record','key','query'],html:`<div class="teach-card"><h3>🧰 The database toolkit</h3>
<p>A database has a small set of tools. Each one has its own job.</p>
<table class="gm-tbl"><tr><th>Tool</th><th>Its job</th></tr>
<tr><td><b>Table</b></td><td>Stores the data in rows and columns. Each row is a record and each column is a field. A database can have one or more tables.</td></tr>
<tr><td><b>Key field</b></td><td>Uniquely identifies each record in a table.</td></tr>
<tr><td><b>Query</b></td><td>Searches and filters the data using criteria, to find the answer to a question.</td></tr>
<tr><td><b>Form</b></td><td>Puts data in: create a new record, modify a record, or view the records already stored.</td></tr>
<tr><td><b>Report</b></td><td>Presents the results of a query in an effective manner, ready to print.</td></tr>
<tr><td><b>Macro</b></td><td>Performs a repetitive task automatically, with a single click of a button.</td></tr></table>
<div class="tip-box">A query <b>finds</b> the records. A report <b>presents</b> them. If a job is about finding or picking out data, it is a query.</div></div>`},
{teaches:['form'],html:`<div class="teach-card"><h3>🪟 The counter window: forms</h3>
<p><span class="term">Forms</span> are used to collect data to create a new record, modify an existing record or view records already stored in a table.</p>
<div class="example-row"><div class="example-item"><div class="label">Create</div><div class="val">A new record</div></div><div class="example-item"><div class="label">Modify</div><div class="val">An existing record</div></div><div class="example-item"><div class="label">View</div><div class="val">Records already stored</div></div></div>
<div class="tip-box">A form shows one record at a time in labelled boxes, so it is easy to type data in or check it.</div></div>`},
{teaches:['report','group','report-benefits'],html:`<div class="teach-card"><h3>📌 Pinned on the wall: reports</h3>
<p><span class="term">Reports</span> are used to present results from queries in an effective manner. A report can be printed or shown on screen.</p>
<p style="margin-top:8px;">The layout of reports can be customised, such as grouping similar data or presenting data in ascending or descending order.</p>
<table class="gm-tbl"><tr><th>Location</th><th>Activity</th><th>Surname</th></tr><tr><td colspan="3"><b>Indoor</b></td></tr><tr><td></td><td>Archery</td><td>Byrne</td></tr><tr><td></td><td>Karting</td><td>Kelly</td></tr>
<tr><td colspan="3"><b>Outdoor</b></td></tr><tr><td></td><td>Horse Riding</td><td>Doyle</td></tr><tr><td></td><td>Quad Biking</td><td>Murphy</td></tr></table>
<p style="margin-top:8px;">This report is <b>grouped by Location</b>: each location is a bold heading with its bookings underneath. Inside each group it is <b>sorted by Activity, ascending</b>. Ascending means A to Z, or earliest first for dates. Descending means Z to A, or latest first.</p>
<div class="highlight">In an exam, name the field the report is grouped by, for example “grouped by Location”. “Grouped” on its own is not enough.</div>
<div class="tip-box">Benefits of a report (2025): it can sort the data, filter it and show totals, and it makes the data easier to read and understand. When the question asks for a benefit, “user friendly” on its own does not get the mark.</div></div>`},
{teaches:['macro'],html:`<div class="teach-card"><h3>☕ The one-click button: macros</h3>
<p><span class="term">Macros</span> are small programs that are written to perform a repetitive database task automatically.</p>
<p style="margin-top:8px;">They are used to add functionality to forms and reports. Running a macro executes the instructions stored within it with a single click of a button.</p>
<div class="tip-box">A macro is a shortcut: the steps are stored once, in order, then one click does them all. The steps must be stored in the order they need to happen.</div></div>`}
],
rounds:[
{title:'Form, Query, Report or Macro?',teachAt:[0,1],variant:'pop',heading:'Which tool does this job?',tip:'Forms put data in. Queries find it. Reports present it. Macros repeat tasks with one click.',
 choices:[{key:'form',label:'🪟 Form'},{key:'query',label:'🔎 Query'},{key:'report',label:'📌 Report'},{key:'macro',label:'⚡ Macro'}],
 tasks:[
  {type:'classify',text:'A steward types a new member’s details into labelled boxes',answer:'form',src:'TB p12',feedback:'Forms collect data to create a new record.'},
  {type:'classify',text:'Change the phone number on a record that is already stored',answer:'form',src:'TB p12',feedback:'Forms are used to modify an existing record.'},
  {type:'classify',text:'Scroll through the stored records on screen, one record at a time',answer:'form',src:'TB p12',feedback:'Forms are used to view records already stored in a table.'},
  {type:'classify',text:'Find every booking for Karting',answer:'query',src:'TB p12',feedback:'A query searches and filters data that satisfies the criteria.'},
  {type:'classify',text:'Search for the groups with more than 5 people',answer:'query',src:'TB p12',feedback:'A query searches and filters data that satisfies the criteria.'},
  {type:'classify',text:'Pick out only the bookings that have not been paid yet',answer:'query',src:'TB p12',feedback:'Picking out the records that meet a test is a query: the criteria are Paid = No.'},
  {type:'classify',text:'A printed list of bookings grouped by Location',answer:'report',src:'TB p12',feedback:'A report’s layout can be customised by grouping similar data.'},
  {type:'classify',text:'A printout for the wall that lists the bookings in surname order, A to Z',answer:'report',src:'TB p12',feedback:'A report presents data, here in ascending order, ready to print.'},
  {type:'classify',text:'The Karting query has found the bookings. Now print them neatly with a title for the instructor',answer:'report',src:'TB p12',feedback:'The query already found them. A report presents the results of a query.'},
  {type:'classify',text:'One click runs the same Friday jobs every week',answer:'macro',src:'TB p12',feedback:'A macro performs a repetitive task automatically.'},
  {type:'classify',text:'A small program that performs a repetitive task automatically',answer:'macro',src:'TB p12',feedback:'That is a macro.'},
  {type:'classify',text:'Stored instructions that run with a single click of a button',answer:'macro',src:'TB p12',feedback:'Running a macro executes its stored instructions.'}
 ]},
{title:'The Report Desk',teachAt:[2,3],mode:'sim',sim:'reportdesk',heading:'Make the reports, read the reports, then record a macro',tip:'Group by puts similar data together under a heading. Ascending is A to Z or earliest first; descending is Z to A or latest first. A report shows the results of a query, so the query runs first.',tasks:[]},
{title:'Exam Room',heading:'Real CCEA exam questions',teachAt:[],boss:{icon:'🗂️',name:'The Paper Mountain'},tip:'Say what the tool does. For a grouped report, name the field. For report benefits, name a function such as sorting, filtering or totals.',
 tasks:[],pool:[[[PP.form2022q10a,PP.tab2023q3a],1],[[PP.mac2018q7f,PP.mac2024q10],1],[[PP.rep2019q3d2,PP.rep2026q4d2],1],[[PP.rep2021q2f2],1],[[PP.rep2025q5c],1]]}
]};
