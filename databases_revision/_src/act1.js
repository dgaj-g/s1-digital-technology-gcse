/* Activity 1 — The Register. GAMEPLAY_V2 (DB1). Sources: TB p12, TB p13; PP 2018 Q2, 2019 Q3, 2021 Q2, 2022 Q10, 2024 Q3, 2025 Q5, 2026 Q4. */
const LD_PUPILS=[['2026041','Byrne','Aoife','11B'],['2026042','Kelly','Ciarán','11B'],['2026043','Murphy','Niamh','11B'],['2026044','Walsh','Oisín','11B'],
  ['2026045','Doyle','Ella','11C'],['2026046','Quinn','Seán','11C'],['2026047','Murphy','Niamh','11D']];
/* the tables used in Tap the Part: in each one exactly one field is different in every record */
const TP_PUPIL={name:'tblPupil',f:['PupilNumber','Surname','FirstName','Form'],say:['pupil number','surname','first name','form'],key:0,rows:LD_PUPILS};
const TP_BOOK={name:'tblBook',f:['Title','Author','Year','BookCode','Shelf'],key:3,rows:[['Holes','Louis Sachar','1998','B101','F2'],['Holes','Louis Sachar','1998','B102','F2'],
  ['Wonder','R. J. Palacio','2012','B103','F4'],['Skellig','David Almond','1998','B104','F1'],['Coraline','Neil Gaiman','2002','B105','F2'],['Matilda','Roald Dahl','1988','B106','F1'],
  ['The Hobbit','J. R. R. Tolkien','1937','B107','F3'],['Room 13','Robert Swindells','1989','B108','F3']],
  note:'Title cannot be the key: the library has two copies of Holes, so “Holes” is in two records.'};
const TP_LOAN={name:'tblLoan',f:['LoanNumber','PupilNumber','BookCode','DateOut'],key:0,rows:[['L001','2026041','B101','05/10/2026'],['L002','2026045','B103','05/10/2026'],
  ['L003','2026041','B104','06/10/2026'],['L004','2026043','B105','07/10/2026'],['L005','2026047','B101','08/10/2026']],
  note:'PupilNumber is the key field of tblPupil, but here it repeats: pupil 2026041 has two loans.'};
const TP_SESSION={name:'tblSession',f:['Day','Club','Room','SessionID'],key:3,rows:[['Monday','Chess','R12','S01'],['Monday','Coding','ICT2','S02'],['Tuesday','Choir','Hall','S03'],
  ['Wednesday','Coding','ICT2','S04'],['Thursday','Chess','R12','S05'],['Friday','Choir','Hall','S06']],
  note:'Every other field repeats: Monday, Coding and ICT2 are each in two records.'};
const TP_ASKS=[
  {q:'Tap <b>Ella Doyle’s record</b>.',a:{k:'rec',r:4}},
  {q:'Tap <b>the record for PupilNumber 2026047</b>.',a:{k:'rec',r:6}},
  {q:'Tap <b>the field that stores each pupil’s form</b>.',a:{k:'fld',f:3}},
  {q:'Tap <b>the key field</b>.',a:{k:'fld',f:0},key:1},
  {q:'Tap <b>Seán Quinn’s surname</b>.',a:{k:'cell',r:5,f:1}},
  {q:'Tap <b>the first name stored in record 2026042</b>.',a:{k:'cell',r:1,f:2}}
];
let TP=null;
function sim_parts(area,finish){
  TP={i:0,asks:gmShuffle(TP_ASKS)};
  gmOpen(area,{title:'Tap the Part',icon:'📋',stages:['Tap it','Find the key','Count it'],lives:3,finish,bot:'🗂️'});
  gmBanner('The register','The school register is open in a database. Tap the grey box at the start of a row to pick a <b>record</b>. Tap a field name at the top of a column to pick a <b>field</b>. Tap one cell to pick <b>one data item</b>. Then find the key field in three more tables, and count their fields and records. A wrong tap costs a life.','📋 Open the register',tpAsk);
}
/* a datasheet like Access: grey record selectors down the left, field names across the top.
   o.taps 'all' | 'head' | none; o.mark = the answer to light up; o.bad = the wrong tap */
function tpCls(o,r,f){
  const c=[],m=o.mark,b=o.bad;
  if(m&&m.k==='fld'&&f===m.f)c.push('tp-col');
  if(m&&m.k==='cell'&&r===m.r&&f===m.f)c.push('tp-one');
  if(b&&b.k==='fld'&&f===b.f)c.push(r<0?'tp-bad':'tp-badcol');
  if(b&&b.k==='cell'&&r===b.r&&f===b.f)c.push('tp-bad');
  return c.join(' ');
}
function tpSheet(T,o={}){
  const t=o.taps||'',tap=(ok,attrs)=>ok?` tabindex="0" role="button" ${attrs}`:'';
  let h=`<div class="tp-ds"><div class="tp-bar"><span class="tp-tab">${T.name}</span></div><div class="tp-scroll"><table class="tp-tbl"><tr><th class="tp-sel tp-corner"></th>`;
  T.f.forEach((f,i)=>{h+=`<th class="tp-h ${tpCls(o,-1,i)}${t?' tp-tap':''}"${tap(t,`data-k="fld" data-f="${i}"`)}>${f}</th>`;});
  h+='</tr>';
  T.rows.forEach((row,r)=>{
    const rec=o.mark&&o.mark.k==='rec'&&o.mark.r===r,bad=o.bad&&o.bad.k==='rec'&&o.bad.r===r;
    h+=`<tr class="${rec?'tp-rec':''}${bad?' tp-badrow':''}"><td class="tp-sel${t==='all'?' tp-tap':''}"${tap(t==='all',`data-k="rec" data-r="${r}" aria-label="Record ${r+1}"`)}>${rec?'▶':''}</td>`;
    row.forEach((v,f)=>{h+=`<td class="${tpCls(o,r,f)}${t==='all'?' tp-tap':''}"${tap(t==='all',`data-k="cell" data-r="${r}" data-f="${f}"`)}>${v}</td>`;});
    h+='</tr>';
  });
  return h+'</table></div></div>';
}
function tpBind(box,fn){
  const num=v=>v===undefined?undefined:+v;
  box.onclick=e=>{const el=e.target.closest('.tp-tap');if(el)fn({k:el.dataset.k,r:num(el.dataset.r),f:num(el.dataset.f)});};
  box.onkeydown=e=>{if((e.key==='Enter'||e.key===' ')&&e.target.classList.contains('tp-tap')){e.preventDefault();e.target.click();}};
}
const tpWho=(T,r)=>T===TP_PUPIL?`${T.rows[r][2]} ${T.rows[r][1]}’s record (${T.rows[r][0]})`:`record ${T.rows[r][T.key]}`;
function tpName(T,t){
  if(t.k==='rec')return `${tpWho(T,t.r)}: one row`;
  if(t.k==='fld')return `the ${T.f[t.f]} field: one column`;
  return `“${T.rows[t.r][t.f]}”: one data item, the ${T.say[t.f]} in ${tpWho(T,t.r)}`;
}
/* the value that repeats most in a field, and how many records hold it */
function tpDup(T,f){
  const c={};T.rows.forEach(r=>c[r[f]]=(c[r[f]]||0)+1);
  const [v,n]=Object.entries(c).sort((a,b)=>b[1]-a[1])[0];return n>1?{v,n}:null;
}
function tpRight(T,ask){
  const a=ask.a;
  if(ask.key)return `Yes. No two records share a PupilNumber, so it <b>uniquely identifies</b> each record. It is the <b>key field</b> (also called the primary key).`;
  if(a.k==='rec')return `Yes. That row is one <b>record</b>: everything stored about ${T.rows[a.r][2]} ${T.rows[a.r][1]}.`;
  if(a.k==='fld')return `Yes. That column is one <b>field</b>. It stores one kind of data item, the ${T.say[a.f]}, for every pupil.`;
  return `Yes. “${T.rows[a.r][a.f]}” is one <b>data item</b>: the ${T.say[a.f]} in ${tpWho(T,a.r)}.`;
}
function tpWhy(T,ask,g){
  const a=ask.a,you=`You tapped ${tpName(T,g)}. `;
  if(a.k==='rec'){
    if(g.k!=='rec')return you+'A record is a whole row. Tap the grey box at the start of the row.';
    const same=T.rows[g.r][1]===T.rows[a.r][1]&&T.rows[g.r][2]===T.rows[a.r][2];
    return you+`The answer is ${tpWho(T,a.r)}.${same?' Two pupils are called Niamh Murphy: only the PupilNumber tells them apart.':''}`;
  }
  if(a.k==='fld'){
    if(g.k!=='fld')return you+'A field is a whole column. Tap the field name at the top of the column.';
    if(ask.key){const d=tpDup(T,g.f);return you+`${T.f[g.f]} cannot be the key field: “${d.v}” is in ${d.n} records. A key field must be different in every record. The key field is PupilNumber.`;}
    return you+`It stores the ${T.say[g.f]}. Forms such as 11B are stored in the ${T.f[a.f]} field.`;
  }
  if(g.k==='cell')return you+`The answer is “${T.rows[a.r][a.f]}”, the ${T.say[a.f]} in ${tpWho(T,a.r)}.`;
  return you+(g.k==='rec'?'That picks the whole record.':`That picks the whole field: every pupil’s ${T.say[g.f]}.`)+' The question asks for one data item: tap its cell.';
}
function tpOut(){GM.state='fb';gmGo('See what happened →',()=>gmEnd(0,'The register is in a mess','Read the lessons on tables and key fields again, then have another go.'));}
function tpAsk(){
  const ask=TP.asks[TP.i];GM.state='play';gmMsg('');
  $('gmMain').innerHTML=`<div class="gm-q">${ask.q} <span class="tp-n">${TP.i+1} of ${TP.asks.length}</span></div><div id="tpBox">${tpSheet(TP_PUPIL,{taps:'all'})}</div>`;
  tpBind($('tpBox'),g=>{
    if(GM.state!=='play')return;GM.state='fb';
    const a=ask.a,ok=g.k===a.k&&g.r===a.r&&g.f===a.f;
    $('tpBox').innerHTML=tpSheet(TP_PUPIL,{mark:a,bad:ok?null:g});
    if(ok){sfx('good');say(['Spot on!','Filed! 📋','Nice!'][TP.i%3]);gmMsg(tpRight(TP_PUPIL,ask),'correct');}
    else{const out=gmLose();say('Not that one! 😬');gmMsg(tpWhy(TP_PUPIL,ask,g),'wrong');if(out)return tpOut();}
    TP.i++;
    if(TP.i<TP.asks.length)gmGo('Next →',tpAsk);else gmGo('Find the key →',tpKeyStart);
  });
}
function tpKeyStart(){TP.keys=gmShuffle([TP_BOOK,TP_LOAN,TP_SESSION]);TP.i=0;gmStage(1);tpKey();}
function tpKey(){
  const T=TP.keys[TP.i];GM.state='play';gmMsg('');
  $('gmMain').innerHTML=`<div class="gm-q">No key field is marked in ${T.name}. Tap the field name of the <b>key field</b>. <span class="tp-n">Table ${TP.i+1} of ${TP.keys.length}</span></div><div id="tpBox">${tpSheet(T,{taps:'head'})}</div>`;
  tpBind($('tpBox'),g=>{
    if(GM.state!=='play')return;GM.state='fb';
    const ok=g.f===T.key;
    $('tpBox').innerHTML=tpSheet(T,{mark:{k:'fld',f:T.key},bad:ok?null:g});
    if(ok){sfx('good');say('Key found! 🔑');gmMsg(`Yes. ${T.f[T.key]} is different in every record, so it uniquely identifies each one. ${T.note}`,'correct');}
    else{
      const out=gmLose(),d=tpDup(T,g.f);say('That one repeats! 😬');
      gmMsg(`${T.f[g.f]} cannot be the key field: “${d.v}” is in ${d.n} records. A key field must be different in every record. The key field is ${T.f[T.key]}.${T===TP_LOAN&&g.f===1?' '+T.note:''}`,'wrong');
      if(out)return tpOut();
    }
    TP.i++;
    if(TP.i<TP.keys.length)gmGo('Next table →',tpKey);else gmGo('Count it →',tpCountStart);
  });
}
function tpCountStart(){TP.counts=[TP_LOAN,TP_BOOK];TP.i=0;gmStage(2);tpCount();}
function tpCount(){
  const T=TP.counts[TP.i];GM.state='play';gmMsg('');TP.pick={};
  const chips=(w,ns)=>`<div class="ss-chips" data-w="${w}">${ns.map(n=>`<button class="ss-chip" data-n="${n}">${n}</button>`).join('')}</div>`;
  $('gmMain').innerHTML=`<div class="gm-q">How many <b>fields</b> and how many <b>records</b> are in ${T.name}? <span class="tp-n">Table ${TP.i+1} of ${TP.counts.length}</span></div>
<div id="tpBox">${tpSheet(T)}</div>
<div class="tp-count"><div><div class="vs-h">Fields</div>${chips('f',[2,3,4,5,6,7])}</div><div><div class="vs-h">Records</div>${chips('r',[4,5,6,7,8,9])}</div></div>
<div class="gm-btns"><button class="btn btn-primary" id="tpCheck">Check</button></div>`;
  document.querySelectorAll('.tp-count .ss-chips').forEach(g=>g.onclick=e=>{
    const b=e.target.closest('.ss-chip');if(!b||GM.state!=='play')return;
    g.querySelectorAll('.ss-chip').forEach(x=>x.classList.toggle('on',x===b));TP.pick[g.dataset.w]=+b.dataset.n;
  });
  $('tpCheck').onclick=()=>{
    if(GM.state!=='play')return;
    if(!TP.pick.f||!TP.pick.r)return gmMsg('Pick a number of fields and a number of records first.','part');
    GM.state='fb';
    const nf=T.f.length,nr=T.rows.length,okF=TP.pick.f===nf,okR=TP.pick.r===nr;
    document.querySelectorAll('.tp-count .ss-chips').forEach(g=>g.querySelectorAll('.ss-chip').forEach(x=>{
      x.disabled=true;const want=g.dataset.w==='f'?nf:nr;
      if(+x.dataset.n===want)x.classList.add('right');else if(x.classList.contains('on'))x.classList.add('wrong');
    }));
    $('tpCheck').remove();
    if(okF&&okR){sfx('good');say('Counted! 🧮');gmMsg(`Yes: ${nf} fields (columns) and ${nr} records (rows). The row of field names at the top is not a record.`,'correct');}
    else{
      const out=gmLose();say('Count again! 😬');const t=[];
      if(!okF)t.push(`Each column is one field. ${T.name} has ${nf} fields: ${T.f.join(', ')}.`);
      if(!okR)t.push(TP.pick.r===nr+1?`The top row holds the field names. It is not a record. Count the rows of data below it: ${nr}.`:`Each row of data below the field names is one record. ${T.name} has ${nr} records.`);
      gmMsg(t.join(' '),'wrong');if(out)return tpOut();
    }
    TP.i++;
    if(TP.i<TP.counts.length)gmGo('Next table →',tpCount);
    else gmGo('Finish →',()=>gmEnd(gmStars(GM.lives,3),'The register is in order','You found records, fields, data items and key fields in four tables. A record is a row, a field is a column, and the key field uniquely identifies each record.'));
  };
}
/* Library desk: stage 1 draws the relationships, stage 2 runs the loan slips */
const RW_T=[{id:'p',name:'tblPupil',f:['PupilNumber','Surname','FirstName','Form'],key:0},
  {id:'l',name:'tblLoan',f:['LoanNumber','PupilNumber','BookCode','DateOut'],key:0},
  {id:'b',name:'tblBook',f:['Title','Author','Year','BookCode','Shelf'],key:3}];
const RW_LINKS=[{a:'p:0',b:'l:1',one:'p',ok:'PupilNumber is stored in tblPupil and in tblLoan: it is the common field that joins them.',
    why:'One pupil can borrow many books, but each loan is for one pupil. So the 1 goes at tblPupil and the ∞ at tblLoan.'},
  {a:'l:2',b:'b:3',one:'b',ok:'BookCode is stored in tblLoan and in tblBook: it is the common field that joins them.',
    why:'One book can go out on loan many times, but each loan is for one book. So the 1 goes at tblBook and the ∞ at tblLoan.'}];
let LD=null,RW=null;
const rwTab=id=>RW_T.find(t=>t.id===id[0]);
const rwField=id=>{const T=rwTab(id);return T.f[+id.split(':')[1]];};
function sim_library(area,finish){
  RW={links:[],sel:null,ends:{},phase:'link',fk:[],fixed:[]};
  gmOpen(area,{title:'Library desk',icon:'📚',stages:['Draw the link','Run the desk'],lives:3,finish,bot:'📚'});
  gmBanner('The library database','The library database has three tables, but nothing joins them yet. Draw the two links: tap a field, then tap the field it matches in another table. Then label each end of the links. After that, the desk opens and loan slips start arriving. A wrong link, a wrong label or a lost book costs a life.','🔗 Open the relationships window',rwStart);
}
function rwStart(){
  GM.state='play';gmMsg('');
  $('gmMain').innerHTML=`<div class="gm-q" id="rwTask">Draw the two links. Tap a field, then tap the matching field in another table. (With a mouse you can also drag from one field to the other.)</div><div id="rwBox"></div><div class="gm-btns" id="rwBtns"></div>`;
  rwPaint();window.addEventListener('resize',rwDraw);
}
function rwPaint(){
  const fk=id=>RW.fk.includes(id),on=id=>RW.sel===id,linked=id=>RW.links.some(li=>RW_LINKS[li].a===id||RW_LINKS[li].b===id);
  $('rwBox').innerHTML=`<div class="rw" id="rw"><svg class="rw-svg" id="rwSvg" aria-hidden="true"></svg>${RW_T.map(T=>`<div class="rw-t"><div class="rw-h">${T.name}</div>${T.f.map((f,i)=>{const id=T.id+':'+i;
    return `<button class="rw-f${on(id)?' on':''}${linked(id)?' linked':''}" data-id="${id}">${i===T.key?'🔑 ':''}${f}${fk(id)?' 🔗':''}</button>`;}).join('')}</div>`).join('')}<div id="rwEnds"></div></div>`;
  const box=$('rw');
  box.onclick=e=>{const f=e.target.closest('.rw-f');if(!f)return;if(RW.dragged){RW.dragged=false;return;}rwPick(f.dataset.id);};
  box.onpointerdown=e=>{const f=e.target.closest('.rw-f');if(!f||e.pointerType!=='mouse'||RW.phase!=='link'||GM.state!=='play')return;RW.drag={id:f.dataset.id,x:e.clientX,y:e.clientY,moved:false};};
  box.onpointermove=e=>{if(!RW.drag)return;if(Math.hypot(e.clientX-RW.drag.x,e.clientY-RW.drag.y)>8)RW.drag.moved=true;RW.drag.cx=e.clientX;RW.drag.cy=e.clientY;rwDraw();};
  box.onpointerup=e=>{const d=RW.drag;RW.drag=null;if(!d)return;if(!d.moved)return rwDraw();
    RW.dragged=true;setTimeout(()=>{RW.dragged=false;},0);
    const el=document.elementFromPoint(e.clientX,e.clientY),f=el&&el.closest('.rw-f');
    if(f&&f.dataset.id!==d.id){RW.sel=d.id;rwPick(f.dataset.id);}else rwDraw();};
  box.onpointerleave=()=>{if(RW.drag){RW.drag=null;rwDraw();}};
  rwDraw();
}
/* lines and their end labels; side by side the line runs between the tables, stacked (phone) it bulges out to the right */
function rwDraw(){
  const box=$('rw');if(!box){window.removeEventListener('resize',rwDraw);return;}
  const B=box.getBoundingClientRect(),at=id=>box.querySelector(`[data-id="${id}"]`).getBoundingClientRect();
  let paths='',ends='';
  const geo=(ra,rb)=>{
    const ay=ra.top+ra.height/2-B.top,by=rb.top+rb.height/2-B.top;
    if(ra.right<=rb.left+1)return {ax:ra.right-B.left,ay,bx:rb.left-B.left,by,da:1,db:-1};
    if(rb.right<=ra.left+1)return {ax:ra.left-B.left,ay,bx:rb.right-B.left,by,da:-1,db:1};
    return {ax:ra.right-B.left,ay,bx:rb.right-B.left,by,da:1,db:1,stack:true};
  };
  RW.links.forEach(li=>{
    const L=RW_LINKS[li],g=geo(at(L.a),at(L.b));
    if(g.stack){const x=Math.max(g.ax,g.bx)+44;paths+=`<path d="M${g.ax} ${g.ay} C${x} ${g.ay} ${x} ${g.by} ${g.bx} ${g.by}"/>`;}
    else paths+=`<path d="M${g.ax} ${g.ay} C${g.ax+g.da*40} ${g.ay} ${g.bx+g.db*40} ${g.by} ${g.bx} ${g.by}"/>`;
    if(RW.phase==='link')return;
    [['a',g.ax,g.ay,g.da],['b',g.bx,g.by,g.db]].forEach(([s,x,y,d])=>{
      const k=li+':'+s,v=RW.ends[k]||'?',left=x+d*18,top=g.stack?y:y-16;
      ends+=`<button class="rw-end${v==='?'?' q':''}${RW.fixed.includes(k)?' fixed':''}" data-k="${k}" style="left:${left}px;top:${top}px" aria-label="End of the ${rwField(L.a)} link at ${rwTab(L[s]).name}"${RW.phase==='done'?' disabled':''}>${v}</button>`;
    });
  });
  if(RW.drag&&RW.drag.moved){const r=at(RW.drag.id),x=r.right-B.left,y=r.top+r.height/2-B.top;paths+=`<path class="drag" d="M${x} ${y} L${RW.drag.cx-B.left} ${RW.drag.cy-B.top}"/>`;}
  const svg=$('rwSvg');svg.setAttribute('viewBox',`0 0 ${B.width} ${B.height}`);svg.innerHTML=paths;
  $('rwEnds').innerHTML=ends;
  $('rwEnds').querySelectorAll('.rw-end').forEach(b=>b.onclick=()=>{
    if(RW.phase!=='ends'||GM.state!=='play')return;
    const k=b.dataset.k,v=RW.ends[k]||'?';RW.ends[k]=v==='1'?'∞':'1';rwDraw();
    const nb=$('rwEnds').querySelector(`[data-k="${k}"]`);nb&&nb.focus({preventScroll:true});
  });
}
function rwPick(id){
  if(RW.phase!=='link'||GM.state!=='play')return;
  if(!RW.sel||RW.sel===id||RW.sel[0]===id[0]){RW.sel=RW.sel===id?null:id;gmMsg('');return rwPaint();}
  const a=RW.sel;RW.sel=null;
  const li=RW_LINKS.findIndex(L=>(L.a===a&&L.b===id)||(L.a===id&&L.b===a));
  if(li>=0&&RW.links.includes(li)){rwPaint();return gmMsg('That link is already drawn. Draw the other one.','part');}
  if(li>=0){
    RW.links.push(li);sfx('good');say('Linked! 🔗');rwPaint();
    if(RW.links.length<2)return gmMsg(`Linked. ${RW_LINKS[li].ok} One more link to draw.`,'correct');
    GM.state='fb';gmMsg(`Linked. ${RW_LINKS[li].ok} Both tables are now joined to tblLoan.`,'correct');
    return gmGo('Label the ends →',rwEndsStart);
  }
  const out=gmLose();say('Those don’t match! 😬');rwPaint();
  [a,id].forEach(x=>{const b=document.querySelector(`.rw-f[data-id="${x}"]`);b&&b.classList.add('bad');});
  const pb=[a[0],id[0]].sort().join('');
  gmMsg(pb==='bp'?`${rwTab(a).name} and ${rwTab(id).name} have no field in common, so they cannot be joined directly. They are joined through tblLoan: each loan stores a PupilNumber and a BookCode.`
    :`${rwField(a)} in ${rwTab(a).name} and ${rwField(id)} in ${rwTab(id).name} do not hold the same data. A relationship needs a common field: the same field stored in both tables.`,'wrong');
  if(out){GM.state='fb';gmGo('See what happened →',()=>gmEnd(0,'The tables were never joined','Read the lesson on relationships again, then have another go.'));}
}
function rwEndsStart(){
  RW.phase='ends';GM.state='play';gmMsg('');
  $('rwTask').innerHTML='Label each end of the two links: <b>1</b> or <b>∞</b> (many). Tap an end to change it, then check.';
  $('rwBtns').innerHTML='<button class="btn btn-primary" id="rwCheck">Check the ends</button>';
  $('rwCheck').onclick=rwCheck;rwDraw();
}
function rwCheck(){
  if(RW.phase!=='ends'||GM.state!=='play')return;
  const keys=RW_LINKS.flatMap((L,li)=>[li+':a',li+':b']),want=k=>{const L=RW_LINKS[+k[0]];return L[k[2]][0]===L.one?'1':'∞';};
  if(keys.some(k=>!RW.ends[k]))return gmMsg('Label all four ends first.','part');
  GM.state='fb';RW.phase='done';$('rwBtns').innerHTML='';
  RW.fixed=keys.filter(k=>RW.ends[k]!==want(k));keys.forEach(k=>RW.ends[k]=want(k));
  const bad=RW_LINKS.filter((L,li)=>RW.fixed.some(k=>+k[0]===li));
  RW.fk=['l:1','l:2'];rwPaint();
  const fkTxt=' PupilNumber and BookCode are stored in tblLoan as <b>foreign keys</b> 🔗: each one is the key field of another table.';
  if(!bad.length){sfx('good');say('Perfect links! 🔗');gmMsg('Yes. Both links are <b>one-to-many</b>. The 1 sits at the table where the field is the key field. The ∞ sits at tblLoan, where the same value can appear many times.'+fkTxt,'correct');}
  else{
    const out=gmLose();say('Check the ends! 😬');
    gmMsg('The ends in red were wrong and are now fixed. '+bad.map(L=>L.why).join(' ')+' Both links are <b>one-to-many</b>.'+fkTxt,'wrong');
    if(out)return gmGo('See what happened →',()=>gmEnd(0,'The links were labelled wrongly','Read the lesson on relationships again, then have another go.'));
  }
  gmGo('Open the library desk →',ldStart);
}
function ldStart(){
  const s=(num,code,book,who)=>({num,code,book,who});
  const first=gmShuffle([s('2026041','B101','Holes'),s('2026045','B103','Wonder'),s('2026099','B104','Skellig'),s('2026043','B105','Coraline'),s(null,'B107','The Hobbit','Niamh Murphy'),s('2026041','B106','Matilda')]);
  const last=gmShuffle([s('2026047','B102','Holes'),s('2026404','B107','The Hobbit'),s('2026046','B104','Skellig'),s(null,'B108','Room 13','Murphy')]);
  LD={slips:[...first,...last],i:0,lost:0,loans:{}};
  gmStage(1);
  gmBanner('The library desk','Loan slips are arriving. Each slip carries a PupilNumber: the foreign key 🔗 that links the loan to one pupil in tblPupil. Tap the pupil it belongs to. If no pupil has that number, refuse the loan. If the slip has no pupil number, ask for one. The last four slips are timed. Every lost book costs a life.','📚 Open the desk',ldNext);
}
function ldTable(){
  return `<div class="gm-panel"><div class="vs-h">tblPupil · 🔑 key field: PupilNumber</div><table class="gm-tbl" id="ldTbl"><tr><th>🔑 PupilNumber</th><th>Surname</th><th>FirstName</th><th>Form</th><th>Loans</th></tr>
${LD_PUPILS.map(p=>`<tr class="click" data-n="${p[0]}" tabindex="0"><td><b>${p[0]}</b></td><td>${p[1]}</td><td>${p[2]}</td><td>${p[3]}</td><td>${'📕'.repeat(LD.loans[p[0]]||0)}</td></tr>`).join('')}</table></div>`;
}
function ldNext(){
  if(LD.i>=LD.slips.length)return ldEnd();
  const sl=LD.slips[LD.i],timed=LD.i>=6;
  GM.state='slip';gmMsg('');
  $('gmMain').innerHTML=`<div class="ld-wrap"><div class="ld-slip"><div class="vs-h">Loan slip ${LD.i+1} of ${LD.slips.length}${timed?' · quick!':''}</div>
<div class="ld-f"><span>PupilNumber 🔗</span><b>${sl.num||'— (blank)'}</b></div>${sl.who?`<div class="ld-f"><span>Name written</span><b>${sl.who}</b></div>`:''}<div class="ld-f"><span>BookCode 🔗</span><b>${sl.code} · ${sl.book}</b></div>
<div id="ldTime"></div></div><div id="ldTblBox">${ldTable()}</div></div>
<div class="gm-btns" id="ldBtns"><button class="btn btn-ghost" id="ldRefuse">⛔ Refuse: no such pupil</button><button class="btn btn-ghost" id="ldNeed">❓ Need the pupil number</button></div>`;
  document.querySelectorAll('#ldTbl tr.click').forEach(tr=>{tr.onclick=()=>ldAnswer('row',tr.dataset.n);tr.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();tr.click();}};});
  $('ldRefuse').onclick=()=>ldAnswer('refuse');$('ldNeed').onclick=()=>ldAnswer('need');
  if(timed)gmTimer($('ldTime'),10,()=>ldAnswer('time'));
}
function ldAnswer(kind,n){
  if(!GM||GM.state!=='slip')return;GM.state='fb';gmStop();
  const sl=LD.slips[LD.i],real=sl.num&&LD_PUPILS.find(p=>p[0]===sl.num);
  const want=!sl.num?'need':real?'row':'refuse';
  const ok=kind===want&&(kind!=='row'||n===sl.num);
  const who=p=>`${p[2]} ${p[1]} (${p[3]})`;
  const twin=sl.who==='Murphy'?'There are two pupils called Murphy':'There are two pupils called Niamh Murphy';
  let txt;
  if(ok){
    sfx('good');say(['Filed! 📚','Spot on!','Nice work!'][LD.i%3]);
    if(want==='row'){LD.loans[n]=(LD.loans[n]||0)+1;const many=LD.loans[n]>1;
      txt=`Filed under <b>${who(real)}</b>. The PupilNumber on the slip matches the key field in tblPupil.${many?` ${real[2]} now has ${LD.loans[n]} loans: one pupil, many loans.`:''}`;}
    else if(want==='refuse')txt=`Refused. No pupil has the number ${sl.num}, so this loan cannot be linked to a record in tblPupil. Stopping a loan like this is called <b>referential integrity</b>.`;
    else txt=`Right. ${twin}. Only the PupilNumber, the key field, tells them apart.`;
  }else{
    LD.lost++;const out=gmLose();say('A book is lost! 😱');
    txt=kind==='time'?'Too slow: the pupil walked off with the book. ':'Lost book! ';
    if(want==='row')txt+=`The slip says ${sl.num}. That is ${who(real)}.${kind==='row'?' You filed it under a different pupil.':kind==='refuse'?' That pupil is in tblPupil, so the loan should be linked to them.':''}`;
    else if(want==='refuse')txt+=`No pupil has the number ${sl.num}. Check every digit. A loan that cannot be linked to a pupil must be refused.`;
    else txt+=`The slip has no pupil number. ${twin}, so a name cannot tell you which one. Ask for the pupil number.`;
    if(out){$('ldBtns').remove();gmMsg(txt,'wrong');return gmGo('See what happened →',()=>gmEnd(0,'The desk is closed','Too many books were lost. Read the lesson on relationships again, then have another go.'));}
  }
  $('ldBtns').remove();$('ldTblBox').innerHTML=ldTable();
  gmMsg(txt,ok?'correct':'wrong');LD.i++;
  gmGo(LD.i<LD.slips.length?'Next slip →':'Close the desk →',ldNext);
}
function ldEnd(){
  const st=gmStars(GM.lives,3);
  const most=Object.entries(LD.loans).sort((a,b)=>b[1]-a[1])[0];
  const p=most&&LD_PUPILS.find(x=>x[0]===most[0]);
  gmEnd(st,'Desk closed for the day',`You lost ${LD.lost} book${LD.lost===1?'':'s'}.${p&&most[1]>1?` ${p[2]} ${p[1]} has ${most[1]} loans. One pupil can have many loans: this is a <b>one-to-many</b> relationship. The PupilNumber on each loan is the <b>foreign key</b>.`:''}`);
}
const ACT={
title:'The Register',icon:'📋',
intro:'Data HQ is building the database for a new school. The school register is your first table. Your mission: tap the parts of a real table, find the key fields, sort fields into data types, draw the links between the library tables and run the library desk.',
topics:'Table, record, field, key field, data types, relationships, foreign key, one-to-many, referential integrity, importing, CSV',
ranks:['Head of Records','Senior Clerk','Office Trainee','New Starter — revise and retry'],
next:{href:'activity2.html',label:'Next: The Door'},
teach:[
{teaches:['table','record','field'],html:`<div class="teach-card"><h3>📋 A table is like a class register</h3>
<table class="gm-tbl reg"><tr><th>PupilNumber</th><th class="lit">Surname</th><th>FirstName</th><th>Form</th></tr>
<tr><td>2026041</td><td class="lit">Byrne</td><td>Aoife</td><td>11B</td></tr><tr class="lit"><td>2026042</td><td class="lit">Kelly</td><td>Ciarán</td><td>11B</td></tr>
<tr><td>2026043</td><td class="lit">Murphy</td><td>Niamh</td><td>11B</td></tr><tr><td>2026044</td><td class="lit">Walsh</td><td>Oisín</td><td>11B</td></tr></table>
<p style="margin-top:12px;">A <span class="term">table</span> is a structure where data is organised in rows and columns. A table consists of a number of records. The whole register is the table.</p>
<p style="margin-top:8px;">A <span class="term">record</span> is a collection of data items related to one object or person. It is one row in the table. Ciarán's row (gold) is one record.</p>
<p style="margin-top:8px;">A <span class="term">field</span> holds a single item of data about an object or person. It is one column in the table. The Surname column (blue) is one field.</p>
<div class="tip-box">Exam tip (2021): a field holds a <b>single</b> item of data. All the data about one person together is a record, not a field.</div></div>`},
{teaches:['key'],html:`<div class="teach-card"><h3>🔑 The pupil number</h3>
<p>A <span class="term">key field</span> uniquely identifies one record. It is also called the <span class="term">primary key</span>. In a database a key symbol 🔑 is shown beside it.</p>
<div class="example-row"><div class="example-item"><b>Niamh Murphy</b><br>Form 11B<br>🔑 2026043</div><div class="example-item"><b>Niamh Murphy</b><br>Form 11D<br>🔑 2026047</div></div>
<p>Two pupils can share a name. They can never share a pupil number, so PupilNumber is the key field. To find the key field in any table, look for the field that is different in every record.</p>
<div class="tip-box">Exam tip (2018): the purpose of a primary key is that it <b>uniquely identifies</b> a record. Use those words.</div></div>`},
{teaches:['text','integer-real','date','currency','boolean','calculated'],html:`<div class="teach-card"><h3>🔷 The shape sorter: data types</h3>
<p>When a database is created, each field is given a <span class="term">data type</span>. The data type defines the type of data the field holds.</p>
<table class="gm-tbl"><tr><th>Data type</th><th>What it holds</th></tr>
<tr><td><b>Text</b></td><td>Text and data that is a mixture of text and numbers, e.g. a postcode. Exam papers also call it a <b>string</b> or alphanumeric.</td></tr>
<tr><td><b>Number</b></td><td>Numeric data that requires a mathematical calculation. A number can be a whole number (an <b>integer</b>) or have decimals (a <b>real</b> number).</td></tr>
<tr><td><b>Date/Time</b></td><td>Dates and times</td></tr>
<tr><td><b>Currency</b></td><td>Monetary data; includes two decimal places</td></tr>
<tr><td><b>AutoNumber</b></td><td>To create a key field, the computer generates sequential numbers that are automatically inserted for each new record</td></tr>
<tr><td><b>Yes/No</b></td><td>Data that has two possible values, e.g. Yes/No or True/False; this is called a <b>Boolean</b> value. It often shows as a tick box.</td></tr>
<tr><td><b>Hyperlink</b></td><td>A link to a web address (URL)</td></tr>
<tr><td><b>Attachment</b></td><td>A file attached to a record, e.g. a digital image</td></tr>
<tr><td><b>OLE object</b></td><td>Object linking and embedding; objects created using a software package other than a database</td></tr>
<tr><td><b>Calculated</b></td><td>The result of a calculation produced from another field in the record</td></tr>
<tr><td><b>Lookup Wizard</b></td><td>A value can be selected from a predefined list and entered into the field</td></tr></table>
<div class="highlight">Exam words: an <b>integer</b> is a positive or negative whole number, e.g. 2020. A <b>real</b> number has decimals, e.g. 1.5.</div>
<div class="tip-box">Exam tip (2019): a MemberID that mixes letters and numbers must be Text (a string), even though it has digits in it.</div></div>`},
{teaches:['relationship','foreign-key','one-to-many','join-line','link-table','relational'],html:`<div class="teach-card"><h3>🔗 Linking tables: relationships</h3>
<p>A <span class="term">relational database</span> is made up of more than one table, linked together.</p>
<p style="margin-top:8px;"><span class="term">Database relationships</span> link two or more tables. A common field must be stored in each table: the key field from one table is stored in the other table as a non-key field, called a <span class="term">foreign key</span>.</p>
<div class="example-row"><div class="example-item"><b>tblPupil</b><br>🔑 PupilNumber<br>Surname · FirstName · Form</div><div class="example-item"><b>tblLoan</b><br>🔑 LoanNumber<br>PupilNumber 🔗 (foreign key) · BookCode · DateOut</div></div>
<p>Relationships are one-to-one, one-to-many or many-to-many. One pupil can have many loans, but each loan is for one pupil: <b>one-to-many</b>.</p>
<div class="rw-mini"><span>tblPupil</span><span class="rw-ml"><b>1</b><i></i><b>∞</b></span><span>tblLoan</span></div>
<p>On a relationship diagram the line shows <b>1</b> at the “one” end and <b>∞</b> (many) at the “many” end. The 1 sits at the table where the field is the key field.</p>
<p style="margin-top:8px;">Some tables are there to link two other tables. A table of PupilNumber and ClubID pairs, for example, stores which clubs each pupil goes to: one pupil can be in many clubs, and one club has many pupils.</p>
<div class="highlight"><b>Referential integrity</b> stops a new record being added to one table if it cannot be linked to a record in the other table. A loan for a pupil number that does not exist is refused.</div></div>`},
{teaches:['import','csv'],html:`<div class="teach-card"><h3>📥 Bringing data in: importing</h3>
<p>Data does not have to be typed in again. Worksheets from a spreadsheet can be <span class="term">imported</span> into a database, or the other way. This gives organisations more flexibility in handling their data.</p>
<p style="margin-top:8px;">Bringing data into a database from a file is <b>importing</b>. Sending data out of a database into a file is <b>exporting</b>.</p>
<p style="margin-top:8px;">A common file for moving data is a <span class="term">CSV</span> file: <b>comma separated values</b>. It is a text file where the data items are separated by commas, one record on each line.</p>
<div class="gm-panel"><code>2026048,Hughes,Cara,11C<br>2026049,Lynch,Eoin,11D</code></div>
<div class="tip-box">Exam tip (2021, 2026): CSV stands for <b>comma separated values</b>: a file format where data is separated by commas.</div></div>`}
],
rounds:[
{title:'Tap the Part',teachAt:[0,1],mode:'sim',sim:'parts',heading:'Tap records, fields, data items and key fields in real tables',tip:'A record is a row. A field is a column. One cell is one data item. The key field is the field that is different in every record.',tasks:[]},
{title:'The Shape Sorter',teachAt:[2],heading:'Which data type fits this field?',tip:'Text for letters, or letters mixed with numbers. Number for values you calculate with. Currency for money. Date/Time for dates and times. Yes/No for two possible values.',
 choices:[{key:'txt',label:'🔤 Text'},{key:'num',label:'🔢 Number'},{key:'dt',label:'📅 Date/Time'},{key:'cur',label:'💷 Currency'},{key:'yn',label:'✅ Yes/No'}],
 tasks:[
  {type:'classify',text:'Postcode: BT34 1AB',answer:'txt',src:'TB p13',feedback:'A mixture of text and numbers, e.g. a postcode: Text.'},
  {type:'classify',text:'Surname: Byrne',answer:'txt',src:'TB p13',feedback:'Letters only: Text.'},
  {type:'classify',text:'BookCode: B104',answer:'txt',src:'TB p13',feedback:'A letter as well as numbers: Text.'},
  {type:'classify',text:'DaysAbsent: 3',answer:'num',src:'TB p13',feedback:'A whole number you can add up: Number (an integer).'},
  {type:'classify',text:'NoInGroup: 6',answer:'num',src:'TB p13',feedback:'A count you can calculate with: Number.'},
  {type:'classify',text:'Height in metres: 1.62',answer:'num',src:'TB p13',feedback:'A number with decimals that you can calculate with: Number (a real number).'},
  {type:'classify',text:'TripCost: £40.00',answer:'cur',src:'TB p13',feedback:'Money with two decimal places: Currency.'},
  {type:'classify',text:'LibraryFine: £0.50',answer:'cur',src:'TB p13',feedback:'Monetary data: Currency.'},
  {type:'classify',text:'DateOfBirth: 14/06/2010',answer:'dt',src:'TB p13',feedback:'A date: Date/Time.'},
  {type:'classify',text:'LessonStart: 09:10',answer:'dt',src:'TB p13',feedback:'A time: Date/Time.'},
  {type:'classify',text:'Paid: Yes',answer:'yn',src:'TB p13',feedback:'Only two possible values, Yes or No: Yes/No, a Boolean value.'},
  {type:'classify',text:'OverEighteen: ☑ (ticked)',answer:'yn',src:'TB p13',feedback:'A tick box is either ticked or not: two possible values, so Yes/No (Boolean).'}
 ]},
{title:'Library Desk',teachAt:[3],mode:'sim',sim:'library',heading:'Draw the links, then link each loan to the right pupil',tip:'The 1 goes at the table where the field is the key field; the ∞ where it repeats. The PupilNumber on a loan slip is a foreign key: it must match one pupil’s key field, or referential integrity refuses the loan.',tasks:[]},
{title:'Exam Room',heading:'Real CCEA exam questions',teachAt:[4],boss:{icon:'🗄️',name:'The Corrupt Clerk'},tip:'Look at the picture from the exam paper carefully. A key field uniquely identifies a record. 1 at one end of a line and ∞ at the other means one-to-many.',
 pool:[[[PP.tab2019q3a,PP.tab2024q3b,PP.tab2024q3c],1],[[PP.tab2021q2a1,PP.tab2021q2a2,PP.tab2021q2a3,PP.tab2021q2a4],1],[[PP.tab2018q2b,PP.tab2022q10b,PP.tab2024q3d,PP.tab2026q4a],1],
   [[PP.typ2018q2a1,PP.typ2018q2a2,PP.typ2021q2c1a,PP.typ2021q2c1b,PP.typ2022q10b1,PP.typ2022q10b2],1],[[PP.typ2019q3b,PP.typ2024q3a,PP.typ2026q4b,PP.typ2025q5a],1],
   [[PP.typ2019q3c1,PP.typ2019q3c2,PP.typ2024q10int],1],[[PP.rel2018q2c,PP.rel2019q3f,PP.rel2021q2b,PP.rel2026q4c],1],[[PP.rel2018q2d,PP.imp2021q2e,PP.imp2022q10c,PP.imp2026q10],1]],tasks:[]}
]};
