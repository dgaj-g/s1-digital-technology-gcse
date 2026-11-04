/* Activity 5 — The Festival. Sources: TB p15; PP 2018 Q3(a)(b), 2021 Q8(b), 2022 Q1(h), 2026 Q4(e), 2026 Q10.
   Data Mountain v2 (20 Oct 2026): a control room. Each hour the pupil reads the three units, upgrades the one that will not cope,
   then runs the hour and sees what happens. Then a Sunday meeting: data analytics finds a trend, a pattern and a relationship. */
const DM_V={vol:'Volume',var:'Variety',vel:'Velocity'};
const DM_FMT={rec:'🧾 Records in tables',photo:'📷 Photos',video:'🎥 Video clips',sound:'🎵 Sound recordings',post:'💬 Social media posts',email:'📧 Emails'};
const DM_UNIT={
 vol:{ic:'💽',name:'Storage',up:'add 16 TB of storage',eng:'added 16 TB of storage'},
 vel:{ic:'⚙️',name:'Processor',up:'fit a more powerful computer',eng:'fitted a more powerful computer'},
 var:{ic:'🧩',name:'Format software',up:'add software that can store the new formats',eng:'added software that can store those formats'}};
const DM_WHY={
 vol:'the amount of data was more than the storage could hold. Volume is the amount of data stored, so it needs large storage capacity hardware.',
 vel:'the data was arriving faster than the computer could process it. Velocity is the speed of the data, so more powerful computers are needed to process it more quickly.',
 var:'the data came in formats the system could not store. Variety is the different types of data, such as video and images, not just text.'};
/* two hours of each V; the formats in a volume or velocity hour are ones the system can already store */
const DM_HOURS=[
 {v:'vol',ic:'🗄️',text:'The organisers load every ticket record from the last five festivals, to compare them with this year.',f:['rec']},
 {v:'vol',ic:'📷',text:'The photo booth is packed, and every photo is saved in high quality.',f:['rec','photo']},
 {v:'vel',ic:'🎫',text:'A huge crowd reaches the gates, and every wristband must be scanned and checked.',f:['rec']},
 {v:'vel',ic:'💳',text:'A set ends, and thousands of fans pay at the food stalls at the same moment.',f:['rec']},
 {v:'var',ic:'📱',text:'The festival app goes live, and fans send in video clips and sound recordings.',f:['rec','video','sound']},
 {v:'var',ic:'💬',text:'Fans start posting about the festival online, and the help desk starts getting emails.',f:['rec','post','email']}];
const dmTB=x=>(Math.round(x*10)/10).toFixed(1);
const dmN=n=>n.toLocaleString('en-GB');
const dmList=a=>{const w=a.map(f=>DM_FMT[f].replace(/^\S+\s/,'').toLowerCase());return w.length>1?w.slice(0,-1).join(', ')+' and '+w[w.length-1]:w[0];};
let DM=null;
function sim_mountain(area,finish){
  DM={i:0,hours:gmShuffle(DM_HOURS),cap:8,used:3.2,proc:25000,fmts:['rec','photo'],pile:0,sel:null,h:null,late:false};
  gmOpen(area,{title:'Festival control room',icon:'🎪',stages:['Keep the data flowing','Find the patterns'],lives:3,finish});
  gmBanner('Festival night','You run the festival’s computer system for six hours. Each hour, read the three units: what is arriving, and what each one can handle. Tap the one unit that will not cope, upgrade it, then run the hour. If data is lost or left waiting, the data mountain grows and you lose a life.','🎪 Open the gates',dmHour);
}
function dmFlow(fmts){
  const ic=fmts.map(f=>DM_FMT[f].split(' ')[0]);
  return [...Array(8)].map((_,k)=>`<span style="animation-delay:-${(k*0.4).toFixed(1)}s">${ic[k%ic.length]}</span>`).join('');
}
function dmHour(){
  gmStage(0);GM.state='play';gmMsg('');DM.sel=null;DM.late=false;
  const e=DM.hours[DM.i],free=DM.cap-DM.used;
  const arrive=e.v==='vol'?Math.round((free+1.2+Math.random()*1.4)*10)/10:Math.max(0.2,Math.round(free*(0.15+Math.random()*0.15)*10)/10);
  const rate=Math.round(DM.proc*(e.v==='vel'?1.4+Math.random()*0.4:0.35+Math.random()*0.3)/1000)*1000;
  DM.h={e,free,arrive,rate,newF:e.f.filter(f=>!DM.fmts.includes(f))};
  const chips=a=>`<div class="cr-fmts">${a.map(f=>`<span>${DM_FMT[f]}</span>`).join('')}</div>`;
  const unit=(k,body)=>`<button class="cr-unit" data-u="${k}" aria-pressed="false"><span class="cr-uh">${DM_UNIT[k].ic} ${DM_UNIT[k].name}</span>${body}<span class="cr-up">Tap to upgrade: ${DM_UNIT[k].up}</span></button>`;
  $('gmMain').innerHTML=`<div class="cr-top"><div class="cr-flow"><div class="cr-clock">⏰ ${17+DM.i}:00 · Hour ${DM.i+1} of ${DM.hours.length}</div><div class="cr-pipe" id="crPipe" aria-hidden="true">${dmFlow(e.f)}</div></div>
<div class="dm-mtn"><div class="vs-h">Data mountain</div><div class="dm-pile"><div id="dmPile" style="height:${12+DM.pile*29}%"></div></div></div></div>
<div class="gm-q">${e.ic} ${e.text}</div><div id="dmTime"></div>
<div class="cr-units">
${unit('vol',`<span class="cr-bar"><i style="width:${Math.min(100,DM.used/DM.cap*100).toFixed(0)}%"></i></span><span class="cr-line">Free space: <b>${dmTB(free)} TB</b></span><span class="cr-line">Arriving this hour: <b>${dmTB(arrive)} TB</b></span>`)}
${unit('vel',`<span class="cr-line">Can process: <b>${dmN(DM.proc)}</b> items a minute</span><span class="cr-line">Arriving: <b>${dmN(rate)}</b> items a minute</span>`)}
${unit('var',`<span class="cr-line">Can store:</span>${chips(DM.fmts)}<span class="cr-line">Arriving:</span>${chips(e.f)}`)}
</div><div class="cr-run"><button class="btn btn-primary" id="crRun">▶ Run the hour</button></div>`;
  document.querySelectorAll('.cr-unit').forEach(b=>b.onclick=()=>{
    if(GM.state!=='play')return;
    DM.sel=DM.sel===b.dataset.u?null:b.dataset.u;sfx('tick');
    document.querySelectorAll('.cr-unit').forEach(x=>{const on=x.dataset.u===DM.sel;x.classList.toggle('sel',on);x.setAttribute('aria-pressed',on);
      x.querySelector('.cr-up').textContent=on?`✔ Upgrade chosen: ${DM_UNIT[x.dataset.u].up}`:`Tap to upgrade: ${DM_UNIT[x.dataset.u].up}`;});
  });
  $('crRun').onclick=dmRun;
  sfx('alarm');
  gmTimer($('dmTime'),RM?60:25,()=>{DM.late=true;dmRun();});
}
function dmRun(){
  if(!GM||GM.state!=='play')return;GM.state='run';gmStop();
  document.querySelectorAll('.cr-unit').forEach(b=>b.disabled=true);$('crRun').disabled=true;
  const s=DM.sel,before={proc:DM.proc};
  if(s==='vol')DM.cap+=16;if(s==='vel')DM.proc*=2;if(s==='var')DM.fmts.push(...DM.h.newF);
  if(RM)return dmOutcome(s,before);
  $('crPipe').classList.add('run');setTimeout(()=>dmOutcome(s,before),1500);
}
function dmOutcome(s,before){
  if(!GM||GM.state!=='run'||!$('crPipe'))return;
  GM.state='fb';$('crPipe').classList.remove('run');
  const h=DM.h,v=h.e.v,ok=s===v,U=document.querySelector(`.cr-unit[data-u="${v}"]`);
  if(ok){
    DM.used+=h.arrive;U.classList.add('fixed');sfx('good');say(['Flowing again! 🌊','Sorted!','Good call!'][DM.i%3]);
    if(v==='vol')U.querySelector('.cr-bar i').style.width=(DM.used/DM.cap*100).toFixed(0)+'%';
    gmMsg(`✅ The hour ran smoothly. This was a <b>${DM_V[v]}</b> problem: ${DM_WHY[v]}`,'correct');
  }else{
    let fail;
    if(v==='vol'){fail=`💽 Disk full! ${dmTB(h.arrive-h.free)} TB of data could not be saved.`;DM.used=DM.cap;U.querySelector('.cr-bar i').style.width='100%';DM.cap+=16;}
    else DM.used+=h.arrive;
    if(v==='vel'){fail=`⚙️ Backlog! ${dmN(h.rate-DM.proc)} items a minute were left waiting, and the queue kept growing.`;DM.proc*=2;}
    if(v==='var'){fail=`🧩 Turned away! The system could not store the ${dmList(h.newF)}.`;DM.fmts.push(...h.newF);}
    const wasted=!s?(DM.late?'Time ran out before an upgrade was chosen.':'No upgrade was chosen.')
      :s==='vol'?`You added storage, but there was already room: ${dmTB(h.free)} TB free and ${dmTB(h.arrive)} TB arriving.`
      :s==='vel'?`You fitted a more powerful computer, but the old one could already cope: it could process ${dmN(before.proc)} items a minute and ${dmN(h.rate)} arrived.`
      :'You added format software, but nothing new was arriving: every format could already be stored.';
    U.classList.add('fail');if(s)document.querySelector(`.cr-unit[data-u="${s}"]`).classList.remove('sel');
    DM.pile++;$('dmPile').style.height=(12+DM.pile*29)+'%';
    const out=gmLose();say('The mountain grows! 🌋');
    gmMsg(`${fail} ${wasted} This was a <b>${DM_V[v]}</b> problem: ${DM_WHY[v]} An engineer has now ${DM_UNIT[v].eng}, ready for the next hour.`,'wrong');
    if(out)return gmGo('See what happened →',()=>gmEnd(0,'The night is lost','The data mountain buried the festival. Read the lesson on the 3Vs again, then have another go.'));
  }
  DM.i++;
  gmGo(DM.i<DM.hours.length?'Next hour →':'☕ Sunday morning meeting →',DM.i<DM.hours.length?dmHour:dmMeetStart);
}
/* ---- Stage 2: the Sunday meeting (data analytics) ---- */
const DM_STALLS=[['🍔','Burgers',420,440],['🍕','Pizza',380,390],['🍜','Noodles',150,340],['🍦','Ice cream',300,310],['🥤','Smoothies',260,250]];
const DM_SLOTS=['18:00','18:30','19:00','19:30','20:00','20:30','21:00','21:30'];
const DM_GATES=[{day:'Friday',star:4,v:[900,1400,2600,6100,1200,700,500,400]},{day:'Saturday',star:6,v:[800,1100,1500,2200,2900,6400,900,500]}];
const DM_WATER=[['Fri','14:00',18,210],['Fri','15:00',22,300],['Fri','16:00',16,170],['Fri','17:00',20,250],['Sat','14:00',24,350],['Sat','15:00',19,230],['Sat','16:00',25,370],['Sat','17:00',21,280]];
const DM_MEET=[dmTrend,dmPattern,dmRelation];
function dmMeetStart(){
  gmStage(1);
  gmBanner('Sunday morning meeting','The festival’s data has been stored and processed. Now use data analytics: look for a trend, a pattern or a relationship in the data, and use it to make a decision. Three managers each need one decision before the gates open.','📊 First manager',()=>{DM.q=0;dmTrend();});
}
function dmJudge(ok,right,wrong){
  GM.state='fb';
  if(ok){sfx('good');say(['Great call! 📈','Spot on!','Well read!'][DM.q]);gmMsg(right,'correct');}
  else{const out=gmLose();say('Look again! 🧐');gmMsg(wrong,'wrong');
    if(out)return gmGo('See what happened →',()=>gmEnd(0,'The festival ran short','The data held the answers, but the decisions missed them. Read the lesson on data analytics again, then have another go.'));}
  DM.q++;
  gmGo(DM.q<DM_MEET.length?'Next manager →':'Finish →',DM.q<DM_MEET.length?()=>{gmMsg('');DM_MEET[DM.q]();}:()=>gmEnd(gmStars(GM.lives,3),'The festival ran smoothly','You kept the data flowing for six hours, then used data analytics to find a trend, a pattern and a relationship, and turned each one into a decision.'));
}
function dmTrend(){
  GM.state='play';
  const max=440;
  $('gmMain').innerHTML=`<div class="gm-q">🧑‍🍳 The food manager: “Sunday’s stock order goes out now. Which stall’s customer numbers are growing fastest, so it needs the biggest increase in stock?” Tap the stall.</div>
<div class="gm-panel"><div class="vs-h">Customers at each food stall · <span class="dm-key fri">Friday</span> <span class="dm-key sat">Saturday</span></div>
<div class="dm-chart">${gmShuffle(DM_STALLS).map(s=>`<button class="dm-row" data-n="${s[1]}"><span class="dm-name">${s[0]} ${s[1]}</span><span class="dm-bars"><i class="fri" style="width:${s[2]/max*100}%">${s[2]}</i><i class="sat" style="width:${s[3]/max*100}%">${s[3]}</i></span></button>`).join('')}</div></div>`;
  document.querySelectorAll('.dm-row').forEach(b=>b.onclick=()=>{
    if(GM.state!=='play')return;
    document.querySelectorAll('.dm-row').forEach(x=>x.disabled=true);
    const n=b.dataset.n,ok=n==='Noodles';b.classList.add(ok?'good':'bad');
    if(!ok)document.querySelector('.dm-row[data-n="Noodles"]').classList.add('good');
    const why={Burgers:'Burgers has the most customers, but it only grew from 420 to 440.',Pizza:'Pizza only grew from 380 to 390.','Ice cream':'Ice cream only grew from 300 to 310.',Smoothies:'Smoothies fell, from 260 to 250.'}[n];
    dmJudge(ok,'Yes. Noodles more than doubled, from 150 to 340 customers. A change over time like this is a <b>trend</b>, and the decision is to send Noodles more stock.',
      `Not quite. ${why} Noodles more than doubled, from 150 to 340: that rise over time is the <b>trend</b> to act on.`);
  });
}
function dmPattern(){
  GM.state='play';
  const max=6400;
  const day=d=>`<div class="mt-day"><div class="vs-h">${d.day} · headline act at ${DM_SLOTS[d.star]} ★</div><div class="mt-cols">${d.v.map((n,k)=>`<div class="mt-col${k===d.star?' mt-star':''}"><b>${dmN(n)}</b><i style="height:${(n/max*78).toFixed(0)}%"></i><span class="mt-lab">${k===d.star?'★':''}${DM_SLOTS[k]}<br>to ${k<7?DM_SLOTS[k+1]:'22:00'}</span></div>`).join('')}</div></div>`;
  $('gmMain').innerHTML=`<div class="gm-q">🎫 The gate manager: “Tonight the headline act starts at 21:30. In which half hour do I need extra staff on the gates?” Look at Friday and Saturday, then tap a half hour on Sunday’s plan.</div>
<div class="gm-panel"><div class="vs-h" style="color:#90caf9">Wristbands scanned at the gates in each half hour</div>${DM_GATES.map(day).join('')}</div>
<div class="gm-panel"><div class="vs-h">Sunday · headline act at 21:30 ★ · tap the half hour for extra staff</div><div class="mt-plan">${DM_SLOTS.map((t,k)=>`<button class="mt-slot" data-k="${k}">${k===7?'★ ':''}${t}–${k<7?DM_SLOTS[k+1]:'22:00'}</button>`).join('')}</div></div>`;
  document.querySelectorAll('.mt-slot').forEach(b=>b.onclick=()=>{
    if(GM.state!=='play')return;
    document.querySelectorAll('.mt-slot').forEach(x=>x.disabled=true);
    const k=+b.dataset.k,ok=k===6;b.classList.add(ok?'good':'bad');
    if(!ok)document.querySelector('.mt-slot[data-k="6"]').classList.add('good');
    const why=k===7?'At 21:30 the headline act starts, so the fans are already inside.'
      :k===5?'That was Saturday’s rush, because Saturday’s headline act started at 21:00. Sunday’s starts at 21:30.'
      :k===3?'That was Friday’s rush, because Friday’s headline act started at 20:00.'
      :'The gates were not at their busiest at that time on either day.';
    dmJudge(ok,'Yes. On both days the gates were busiest in the half hour before the headline act. Something that happens again and again like this is a <b>pattern</b>, so Sunday’s rush will be from 21:00 to 21:30.',
      `Not quite. ${why} On both days the rush came in the half hour before the headline act: that is the <b>pattern</b>. So Sunday’s rush will be from 21:00 to 21:30.`);
  });
}
function dmWaterCols(by){
  const rows=by==='temp'?[...DM_WATER].sort((a,b)=>a[2]-b[2]):DM_WATER;
  return rows.map(r=>`<div class="mt-col" data-k="${r[0]+r[1]}"><b>${r[3]}</b><i class="${r[0]==='Fri'?'fri':'sat'}" style="height:${(r[3]/370*72).toFixed(0)}%"></i><span class="mt-lab">${r[0]} ${r[1]}</span><span class="mt-temp">${r[2]}°C</span></div>`).join('');
}
function dmRelation(){
  GM.state='play';
  $('gmMain').innerHTML=`<div class="gm-q">💧 The water stall manager: “Sunday’s forecast is 27°C all afternoon, hotter than any hour so far. How many bottles should I have ready for each hour?”</div>
<div class="gm-panel"><div class="vs-h">Bottles of water sold each afternoon hour · <span class="dm-key fri">Friday</span> <span class="dm-key sat">Saturday</span></div>
<div class="rd-ord mt-by" role="group" aria-label="Put the hours in order of"><button class="rd-o on" data-by="time">⏱ In time order</button><button class="rd-o" data-by="temp">🌡️ In temperature order</button></div>
<div class="mt-cols mt-water" id="mtWater">${dmWaterCols('time')}</div></div>
<div class="mcq-list" id="mtOpts">${gmShuffle([['more','More than 370 bottles an hour, more than it has ever sold'],['avg','About 270 bottles an hour, the average so far'],['low','About 170 bottles an hour, like the quietest hour']]).map(([k,t])=>`<button class="mcq-btn" data-k="${k}">${t}</button>`).join('')}</div>`;
  document.querySelectorAll('.mt-by .rd-o').forEach(b=>b.onclick=()=>{
    document.querySelectorAll('.mt-by .rd-o').forEach(x=>x.classList.toggle('on',x===b));
    const el=$('mtWater'),old={};if(!RM)el.querySelectorAll('.mt-col').forEach(c=>old[c.dataset.k]=c.getBoundingClientRect().left);
    el.innerHTML=dmWaterCols(b.dataset.by);sfx('tick');
    if(!RM)el.querySelectorAll('.mt-col').forEach(c=>{const d=old[c.dataset.k]-c.getBoundingClientRect().left;if(Math.abs(d)<1)return;
      c.style.transition='none';c.style.transform=`translateX(${d}px)`;void c.offsetWidth;c.style.transition='transform 0.5s ease';c.style.transform='';});
  });
  document.querySelectorAll('#mtOpts .mcq-btn').forEach(b=>b.onclick=()=>{
    if(GM.state!=='play')return;
    document.querySelectorAll('#mtOpts .mcq-btn').forEach(x=>{x.disabled=true;if(x.dataset.k==='more')x.classList.add(b===x?'correct':'missed');});
    const ok=b.dataset.k==='more';if(!ok)b.classList.add('wrong');
    dmJudge(ok,'Yes. The hotter the hour, the more water was sold. Two things that rise together like this have a <b>relationship</b>, so a 27°C afternoon should sell more than ever.',
      'Not quite. Put the hours in temperature order: every time the temperature went up, more water was sold. That is a <b>relationship</b>. At 25°C the stall sold 370, and Sunday will be hotter still, so it needs more than 370 an hour.');
  });
}
const ACT={
title:'The Festival',icon:'🎪',
intro:'A music festival creates huge amounts of data every second. Your mission: keep the festival’s computer system coping with volume, variety and velocity, then use data analytics to turn the data into decisions.',
topics:'Big data, the 3Vs (volume, variety, velocity), data analytics',
ranks:['Festival Data Chief','Senior Analyst','Data Trainee','New Starter — revise and retry'],
next:null,
teach:[
{teaches:['bigdata','volume','velocity','variety'],html:`<div class="teach-card"><h3>🌋 Big data and the 3Vs</h3>
<p><span class="term">Big data</span> refers to large amounts of data sets that have the potential to be mined for information. The data sets are so large and complex that traditional database systems cannot handle them effectively, so big data cannot be analysed by normal means. It comes from sources such as social media posts, fitness monitors, mobile phone records and web server logs.</p>
<p style="margin-top:8px;">Big data is described by the <b>3Vs</b>: volume, variety and velocity.</p>
<table class="gm-tbl"><tr><th>V</th><th>What it refers to</th></tr>
<tr><td><b>Volume</b></td><td>The amount of data stored by organisations. Large amounts of data from different sources need large storage capacity hardware. Data storage is now measured in terabytes.</td></tr>
<tr><td><b>Variety</b></td><td>The different types and varieties of data. Data is now stored in many formats, e.g. video and images, not just text. It can be structured (in fields, like a table), semi-structured (partly in fields, like an email with To, From and Subject) or unstructured (no fields at all, like a video).</td></tr>
<tr><td><b>Velocity</b></td><td>The speed of the data: how fast it is coming in, and the speed at which it is created, handled and examined. Because of the large volumes of data, more powerful computers are needed to process the data more quickly.</td></tr></table>
<div class="tip-box">Exam focus (2026): to explain big data, say it refers to large amounts of data sets, then add one more point: traditional database systems cannot handle them effectively, or they can be mined for information, or name all three Vs together. Naming only one or two of the Vs does not get that mark.</div></div>`},
{teaches:['analytics'],html:`<div class="teach-card"><h3>📊 Finding the pattern: data analytics</h3>
<p><span class="term">Data analytics</span> is the application of algorithms, programs or software to data to identify patterns, trends or relationships. It can include statistical analysis or AI, and it means analysing data to draw conclusions.</p>
<p style="margin-top:8px;">It turns large volumes of data into useful information, which helps organisations make decisions and plan for future growth. Specialised software such as data mining and statistical analysis software is designed to process vast quantities of data. When data is in different formats, preparing and processing it is more challenging.</p>
<table class="gm-tbl"><tr><th>Analytics can find</th><th>For example</th></tr>
<tr><td><b>A trend</b>: a change over time</td><td>A shop’s online sales rising every year</td></tr>
<tr><td><b>A pattern</b>: something that happens again and again</td><td>A website is busiest at 8 pm every evening</td></tr>
<tr><td><b>A relationship</b>: two things that change together</td><td>The more it rains, the more umbrellas are sold</td></tr></table>
<div class="tip-box">Exam focus (2018, 2026): say “algorithms, programs or software” and “patterns, trends or relationships” in the same answer.</div></div>`}
],
rounds:[
{title:'Which V?',teachAt:[0],heading:'Which of the 3Vs is this about?',tip:'Volume is how much. Variety is how many types. Velocity is how fast.',
 choices:[{key:'vol',label:'📦 Volume'},{key:'var',label:'🎨 Variety'},{key:'vel',label:'⚡ Velocity'}],
 tasks:[
  {type:'classify',text:'Data storage is now measured in terabytes',answer:'vol',src:'TB p15',feedback:'Volume: the amount of data stored.'},
  {type:'classify',text:'The amount of data stored by organisations',answer:'vol',src:'TB p15',feedback:'That is what volume refers to.'},
  {type:'classify',text:'Data from many sources needs large storage capacity hardware',answer:'vol',src:'TB p15',feedback:'Volume: so much data needs a lot of storage.'},
  {type:'classify',text:'Three days of festival photos fill every disk on the servers',answer:'vol',src:'Practice, TB p15',feedback:'Volume: the amount of data is the problem.'},
  {type:'classify',text:'Data is stored as video and images, not just text',answer:'var',src:'TB p15',feedback:'Variety: many formats.'},
  {type:'classify',text:'Data can be structured, semi-structured or unstructured',answer:'var',src:'TB p15',feedback:'Variety: different types of data.'},
  {type:'classify',text:'Social media posts about the festival have no fields, unlike the ticket records in a table',answer:'var',src:'Practice, TB p15',feedback:'Variety: unstructured posts and structured records are different types of data.'},
  {type:'classify',text:'The festival keeps photos, video clips, emails and ticket records',answer:'var',src:'Practice, TB p15',feedback:'Variety: four different types of data.'},
  {type:'classify',text:'How fast data is coming in',answer:'vel',src:'PP 2018 Q3(b)',feedback:'Velocity, in the 2018 mark scheme wording.'},
  {type:'classify',text:'More powerful computers are needed to process the data more quickly',answer:'vel',src:'TB p15',feedback:'Velocity: the speed of processing.'},
  {type:'classify',text:'40,000 wristband scans a minute must be checked as they happen',answer:'vel',src:'Practice, TB p15',feedback:'Velocity: how fast the data must be processed.'},
  {type:'classify',text:'The speed at which data is created, handled and examined',answer:'vel',src:'PP 2026 Q10',feedback:'Velocity, in the 2026 exam wording.'}
 ]},
{title:'Data Mountain',teachAt:[1],mode:'sim',sim:'mountain',heading:'Keep the data flowing, then find the patterns',tip:'Compare what is arriving with what each unit can handle. Too much data needs more storage. Data arriving too fast needs a more powerful computer. New formats need software that can store them.',tasks:[]},
{title:'Exam Room',heading:'Real CCEA exam questions',teachAt:[],boss:{icon:'🌋',name:'The Data Avalanche'},tip:'For big data, say “large amounts of data sets” and add one more point, such as traditional database systems cannot handle them, or name all three Vs. For data analytics, say algorithms, programs or software finding patterns, trends or relationships.',
 tasks:[],pool:[[[PP.ana2018q3a,PP.ana2026q4e2],1],[[PP.big2018q3b],1],[[PP.big2021q8b,PP.big2022q1h],1],[[PP.big2026q10v],1],[[PP.big2026q4e1],1]]}
]};
