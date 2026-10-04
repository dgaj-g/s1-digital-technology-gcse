/* Activity 4 — Virus Shield. Spec S4. Sources: TB p11; PP 2025 Q1(c), 2022 Q5(b), 2019 Q5(b).
   Regular updates: GAP-S4 in SOURCE_MAP — taught only as the direct consequence of "compares these to a known database of viruses". */
/* Virus Scanner mini-game (Level 2). Game model only: each virus is drawn as a pattern of three symbols.
   Facts it uses: anti-virus scans files stored and data entering the computer, compares them to a known database of viruses,
   detects, locates and removes a virus, and can scan all connected storage devices such as USB memory pens; a virus can slow
   the computer's performance (all TB p11). A new virus not yet in the database is not recognised, so updates matter (GAP-S4). */
const SYM=['🔺','🟦','🟩','⚫','🟨','🟣','🔶'];
const VIRUS={'Virus-A':[0,1,0],'Virus-B':[2,3,2],'Virus-C':[5,4,5]};
function vsFind(s,p){for(let i=0;i<=s.length-p.length;i++)if(p.every((x,j)=>s[i+j]===x))return i;return -1;}
function vsStrip(v,decoy){ // 5 symbols holding pattern v (or none) and no other virus pattern
  for(;;){
    const s=Array.from({length:5},()=>Math.floor(Math.random()*SYM.length));
    if(v)s.splice(Math.floor(Math.random()*3),3,...VIRUS[v]);
    else if(decoy){const p=VIRUS[Math.random()<0.5?'Virus-A':'Virus-B'],at=Math.floor(Math.random()*3);s[at]=p[0];s[at+1]=p[1];}
    const hits=Object.keys(VIRUS).filter(k=>vsFind(s,VIRUS[k])>=0);
    if(v?(hits.length===1&&hits[0]===v):!hits.length)return s;
  }
}
const pat=k=>VIRUS[k].map(i=>SYM[i]).join('');
let VS=null;
globalThis.simMusicOn=()=>!!(VS&&VS.state!=='end'&&$('vs'));
/* AV-BOT lines are personality only: they never state a fact */
const AV={start:["Let's hunt some viruses!",'Scanner online!'],got:['Gotcha! 🦠','Squashed!','Zapped it!'],clean:['All clear! ✨','Clean file!','Safe!'],
  missed:['It got past! 😱','Oh no!'],oops:['That one was clean!','False alarm!']};
function vsBug(kind){ // a 🦠 pops out of the matched symbols: zapped, or escaping to the performance meter
  const st=$('vsStrip'),file=$('vsFile');if(!st||!file)return;
  const mid=st.querySelectorAll('.hit')[1]||st,[x,y]=centre(mid,file);
  sparks(file,x,y,kind==='zap'?'#ff5252':'#ffab40',14);
  const b=document.createElement('div');b.className='vs-bug';b.textContent='🦠';
  if(kind==='zap'){b.style.left=x+'px';b.style.top=y+'px';file.appendChild(b);b.classList.add('zapped');sfx('zap');setTimeout(()=>b.remove(),900);return;}
  const r=mid.getBoundingClientRect();Object.assign(b.style,{position:'fixed',left:(r.left+r.width/2)+'px',top:(r.top+r.height/2)+'px'});
  document.body.appendChild(b);
  flyFixed(b,document.querySelector('.vs-perf'),650,()=>{const pf=document.querySelector('.vs-perf');if(!pf)return;retrigger(pf,'jolt',420);sparks(pf,pf.offsetWidth/2,pf.offsetHeight/2,'#ff5252',10);});
  b.remove();
}
function sim_scanner(area,finish){
  if(VS)clearInterval(VS.timer);
  const f=(name,where,v,decoy)=>({name,where,v,s:vsStrip(v,decoy)});
  const HD='Hard drive',IN='Data entering the computer',USB='USB memory pen';
  VS={finish,db:['Virus-A','Virus-B'],right:0,scored:0,onPc:0,wave:1,
    queue:shuffle([f('📄 homework.docx',HD,null,true),f('🖼️ photo.jpg',HD,'Virus-A'),f('📊 marks.xlsx',HD,null),
                   f('📥 download.pdf',IN,'Virus-B'),f('🎵 song.mp3',HD,null,true),f('📑 report.pptx',IN,'Virus-A')]),
    wave2:[...shuffle([f('🖼️ holiday.png',USB,null,true),f('🎬 clip.mp4',USB,'Virus-B')]),f('🎮 free_game.exe',USB,'Virus-C')],
    done:[],cur:null,state:'intro'};
  area.innerHTML=`<div class="vs" id="vs"><div class="arena-grid"></div><div class="vs-head">${musBtn()}<span class="vs-title">🛡️ Anti-virus scanner</span>${mascot('🤖')}</div>
<div class="vs-top"><div class="vs-db"><div class="vs-h">📚 Known database of viruses</div><div id="vsDb"></div></div>
<div class="vs-perf"><div class="vs-h">💻 Computer performance</div><div class="meter"><div id="vsPerf"></div></div><div id="vsPerfTxt"></div></div></div>
<div class="vs-wave" id="vsWave"></div><div id="vsStage"></div><div class="vs-log" id="vsLog"></div></div>`;
  vsDb();vsPerf();startMusic();
  vsBanner('Wave 1 of 2','Scan the files stored on the computer and data entering the computer.','🔍 Start scanning',vsNext);
}
function vsDb(newOne){$('vsDb').innerHTML=VS.db.map(k=>`<div class="vs-sig ${k===newOne?'new':''}"><span>${k}</span><b>${pat(k)}</b></div>`).join('');}
function vsPerf(){
  const p=Math.max(25,100-25*VS.onPc);
  $('vsPerf').style.width=p+'%';$('vsPerf').className=p<100?'slow':'';
  $('vsPerfTxt').textContent=p<100?`Slowed down (${VS.onPc} virus${VS.onPc>1?'es':''} on the computer)`:'Normal';
}
function vsBanner(head,text,btn,fn){
  VS.state='banner';$('vsWave').textContent='';
  $('vsStage').innerHTML=`<div class="vs-banner"><div class="vs-bh">${head}</div><p>${text}</p><button class="btn btn-primary" id="goBtn">${btn}</button></div>`;
  $('goBtn').onclick=fn;$('goBtn').focus({preventScroll:true});
}
function vsNext(){
  if(!VS.queue.length){
    if(VS.wave===1){VS.wave=2;VS.queue=VS.wave2;
      vsBanner('🔌 Wave 2 of 2','A USB memory pen has been plugged in. Anti-virus software can scan all the storage devices connected to the computer.','🔍 Scan the USB memory pen',vsNext);return;}
    return vsEnd();
  }
  VS.cur=VS.queue.shift();vsShow();
}
function vsShow(rescan){
  const c=VS.cur;VS.state='file';VS.rescan=!!rescan;
  $('vsWave').textContent=rescan?'Rescan after the update':`Wave ${VS.wave} · file ${VS.done.length+1} of 9`;
  $('vsStage').innerHTML=`<div class="vs-file" id="vsFile"><div class="vs-name">${c.name}</div><div class="vs-where">📍 ${c.where}</div>
<div class="vs-strip" id="vsStrip">${c.s.map(i=>`<span>${SYM[i]}</span>`).join('')}</div>
<div class="vs-timer"><div id="vsTimer"></div></div><div class="vs-stamp" id="vsStamp"></div><div class="vs-beam"></div></div>
<div class="vs-btns"><button class="bin" id="vsRemove"><span class="key">1</span>🛡️ Remove virus</button><button class="bin" id="vsClean"><span class="key">2</span>✅ Clean</button></div>
<div id="vsMsg"></div>`;
  $('vsRemove').onclick=()=>vsAnswer(true);$('vsClean').onclick=()=>vsAnswer(false);sfx('scan');if(!VS.done.length&&!rescan)sayFrom(AV.start);
  VS.t0=performance.now();clearInterval(VS.timer);
  VS.timer=setInterval(()=>{const el=$('vsTimer');if(!el){clearInterval(VS.timer);return;}const f=Math.max(0,1-(performance.now()-VS.t0)/15000);el.style.width=(f*100)+'%';el.className=f<0.3?'low':'';if(!f)clearInterval(VS.timer);},100);
}
function vsLocate(k){const at=vsFind(VS.cur.s,VIRUS[k]),sp=$('vsStrip').children;for(let i=at;i<at+3;i++)sp[i].classList.add('hit');}
function vsStamp(text,cls){const s=$('vsStamp');s.textContent=text;s.className='vs-stamp show '+cls;const f=$('vsFile');if(f)retrigger(f,'thud',350);}
function vsAnswer(remove){
  if(!VS||VS.state!=='file')return;
  clearInterval(VS.timer);VS.state='answered';
  const c=VS.cur,known=c.v&&VS.db.includes(c.v);
  $('vsRemove').disabled=$('vsClean').disabled=true;
  if(c.v&&!known)return vsTwist(remove);
  if(VS.rescan){
    if(!remove){VS.state='file';$('vsRemove').disabled=$('vsClean').disabled=false;
      $('vsMsg').innerHTML=`<div class="feedback-box wrong">Look at the database again: Virus-C ${pat('Virus-C')} is in it now. Can you find it in this file?</div>`;sfx('bad');return;}
    vsLocate(c.v);vsBug('zap');say('Got it this time! 💪');vsStamp('REMOVED','bad');VS.onPc--;vsPerf();hit();addPoints(200*mult());popup('+'+200*mult(),$('vsFile'),'good');
    $('vsMsg').innerHTML=`<div class="feedback-box correct">🛡️ Virus-C detected, located and removed. <b>This is why anti-virus software must be updated regularly:</b> a new virus can only be recognised once it is in the known database of viruses.</div>`;
    VS.done.push({c,ok:true});vsLog();return vsGo('Finish the scan ▶',vsEnd);
  }
  const ok=remove===!!known;VS.scored++;
  if(ok){
    VS.right++;hit();
    const pts=100*mult()+Math.round(Math.max(0,1-(performance.now()-VS.t0)/15000)*50);addPoints(pts);popup('+'+pts,$('vsFile'),'good');
    if(known){vsLocate(c.v);vsBug('zap');sayFrom(AV.got);vsStamp('REMOVED','bad');$('vsMsg').innerHTML=`<div class="feedback-box correct">⚠ ${c.v} ${pat(c.v)} detected, located and removed.</div>`;}
    else{sparks($('vsFile'),...centre($('vsStrip'),$('vsFile')),'#69f0ae',16);sayFrom(AV.clean);vsStamp('CLEAN','good');$('vsMsg').innerHTML=`<div class="feedback-box correct">✓ No pattern from the database. The file is clean.</div>`;}
    VS.done.push({c,ok});vsLog();setTimeout(()=>{if(VS&&VS.state==='answered')vsNext();},1300);
  }else{
    miss();shakeScreen();
    if(known){vsLocate(c.v);vsBug('escape');sayFrom(AV.missed);VS.onPc++;vsPerf();vsStamp('MISSED','bad');
      $('vsMsg').innerHTML=`<div class="feedback-box wrong">✗ Missed! This file contains <b>${c.v}</b> ${pat(c.v)}, which is in the database. It is now on the computer, and a virus can slow the computer's performance.</div>`;}
    else{sayFrom(AV.oops);vsStamp('CLEAN','good');$('vsMsg').innerHTML=`<div class="feedback-box wrong">✗ This file does not contain any pattern from the database, so it is clean. Compare all three symbols.</div>`;}
    VS.done.push({c,ok});vsLog();vsGo('Next file ▶',vsNext);
  }
}
function vsGo(label,fn){$('vsMsg').insertAdjacentHTML('beforeend',`<button class="btn btn-primary next-btn" id="goBtn">${label}</button>`);$('goBtn').onclick=fn;$('goBtn').focus({preventScroll:true});}
function vsTwist(remove){
  vsStamp('NO MATCH','good');say('Nothing matched…');
  $('vsMsg').innerHTML=`<div class="feedback-box part">${remove?'There is no pattern from the database in this file, so the anti-virus software would not find anything.':'✓ You followed the database: no match, so the anti-virus software says it is clean.'}</div>`;
  VS.done.push({c:VS.cur,ok:null});vsLog();
  setTimeout(()=>{
    VS.onPc++;vsPerf();sfx('over');shakeScreen();
    say('Whoa! What was that?! 😵');const v=$('vs');v.classList.add('glitch');setTimeout(()=>v.classList.remove('glitch'),1600);
    $('vsMsg').insertAdjacentHTML('beforeend',`<div class="feedback-box wrong">⚠ The computer has slowed down! free_game.exe contained <b>Virus-C</b> ${pat('Virus-C')}, a new virus that is not in the database yet, so the anti-virus could not recognise it. A virus can slow the computer's performance.</div>`);
    vsGo('⬇ Update the database',()=>{
      VS.db.push('Virus-C');vsDb('Virus-C');sfx('level');say('Database updated! 💪');
      vsBanner('⬇ Database updated','The known database of viruses now includes Virus-C. Scan free_game.exe again.','🔍 Scan again',()=>vsShow(true));
    });
  },1400);
}
function vsLog(){$('vsLog').innerHTML=VS.done.map(d=>`<span class="${d.ok===null?'twist':d.ok?'ok':'no'}" title="${d.c.name}">${d.c.name.split(' ')[0]}${d.ok===null?'❓':d.ok?'✓':'✗'}</span>`).join('');}
function vsEnd(){
  clearInterval(VS.timer);VS.state='end';stopMusic();say('Scan complete! 🎉');
  const st=VS.right===VS.scored?3:VS.right>=VS.scored-2?2:1;
  $('vsWave').textContent='';
  $('vsStage').innerHTML=`<div class="vs-banner"><div class="vs-bh">Scan complete</div><p>You made <b>${VS.right} of ${VS.scored}</b> scan decisions correctly${VS.onPc?`, but ${VS.onPc} virus${VS.onPc>1?'es are':' is'} still on the computer`:''}.</p><button class="btn btn-success" id="goBtn">See level result →</button></div>`;
  const fin=VS.finish;$('goBtn').onclick=()=>{VS=null;fin(0,st);};$('goBtn').focus({preventScroll:true});
}
document.addEventListener('keydown',e=>{if(VS&&VS.state==='file'&&$('vsFile')&&(e.key==='1'||e.key==='2')){e.preventDefault();vsAnswer(e.key==='1');}});
const ACT={
title:'Virus Shield',icon:'🛡️',
intro:'Alert: a virus is loose in the network. Your mission: find out what a virus can do, how anti-virus software hunts it down, and why the anti-virus must be kept up to date.',
topics:'What a virus is, the role of anti-virus software, the known database of viruses, the importance of regular updates',
ranks:['Chief Security Officer','Shield Specialist','Security Trainee','New Recruit — revise and retry'],
next:{href:'activity5.html',label:'Next: Exam Arena'},
teach:[
{html:`<div class="teach-card"><h3>🦠 What is a virus?</h3>
<p>A virus is <b>a program that can attach itself to a file and then spread to other files</b>.</p>
<p style="margin-top:8px;">A virus can:</p><ul><li>intentionally damage the system</li><li>prevent the computer from booting up</li><li>slow the computer's performance</li></ul></div>`},
{html:`<div class="teach-card"><h3>🛡️ Anti-virus software</h3>
<p>The main purpose of anti-virus software is to <b>detect, locate and remove</b> a virus.</p><ul>
<li>It scans the files stored on the computer, and data entering the computer.</li>
<li>It compares these to a <b>known database of viruses</b>.</li>
<li>It can scan all the storage devices connected to the computer, such as the internal hard drive and USB memory pens.</li></ul>
<div class="highlight">Glossary: "Software that scans files stored on a computer system, looking for a virus, and compares these to a known database of viruses; it can eliminate a virus."</div>
<div class="tip-box">2025 exam: the statement that best describes the role of antivirus software is "<b>Protects against malicious attacks</b>".</div></div>`},
{html:`<div class="teach-card"><h3>🔬 Your turn: be the anti-virus</h3>
<p>Anti-virus software scans the files stored on the computer and data entering the computer, and compares these to a <b>known database of viruses</b>.</p>
<div class="highlight">In this game, each virus is drawn as a pattern of three symbols, like 🔺🟦🔺. Compare each file's code with the database:<br>• it contains a pattern from the database → <b>🛡️ Remove virus</b><br>• no pattern from the database → <b>✅ Clean</b></div>
<div class="tip-box">Quick, correct decisions score bonus points. Keys: 1 = Remove virus, 2 = Clean.</div></div>`},
{html:`<div class="teach-card"><h3>🎯 Exam focus</h3><ul>
<li>The textbook asks: <b>describe two features of anti-virus software</b> [4]. Give the feature, then add detail. For example: "It scans files stored on the computer and data entering it… and compares these to a known database of viruses."</li>
<li>2022: anti-virus got the mark as a <b>utility program</b> used to maintain a computer system.</li>
<li>2019: a <b>virus check schedule</b> was an accepted example of task scheduling, which sets a task to run automatically at a given time.</li></ul></div>`}
],
rounds:[
{title:'Does It Do That?',heading:'Is this something anti-virus software does?',teachAt:[0,1],tip:'Anti-virus detects, locates and removes viruses. It scans stored files and data entering, compares them to a known database of viruses, and can scan all connected storage devices.',
 choices:[{key:'Y',label:'🛡️ Yes, anti-virus does this'},{key:'N',label:'🚫 No'}],
 tasks:[
  {type:'classify',text:'Detects a virus',answer:'Y',src:'TB p11',feedback:'Yes. Its main purpose is to detect, locate and remove a virus.'},
  {type:'classify',text:'Locates a virus',answer:'Y',src:'TB p11',feedback:'Yes. Detect, locate and remove.'},
  {type:'classify',text:'Removes a virus',answer:'Y',src:'TB p11',feedback:'Yes. It can eliminate a virus.'},
  {type:'classify',text:'Scans data entering the computer',answer:'Y',src:'TB p11',feedback:'Yes. It scans stored files and data entering.'},
  {type:'classify',text:'Compares files to a known database of viruses',answer:'Y',src:'TB p11',feedback:'Yes. This is how it recognises a virus.'},
  {type:'classify',text:'Scans a USB memory pen that is plugged in',answer:'Y',src:'TB p11',feedback:'Yes. It can scan all storage devices connected.'},
  {type:'classify',text:'Prevents hardware malfunctions',answer:'N',src:'PP 2025 Q1(c)',feedback:'No. This was a wrong option in 2025 Q1(c).'},
  {type:'classify',text:'Enhances internet connectivity',answer:'N',src:'PP 2025 Q1(c)',feedback:'No. This was a wrong option in 2025 Q1(c).'},
  {type:'classify',text:'Provides advanced graphics and multimedia capabilities',answer:'N',src:'PP 2025 Q1(c)',feedback:'No. This was a wrong option in 2025 Q1(c).'}
 ]},
{title:'Virus Scanner',heading:'Scan every file. Remove the viruses.',mode:'sim',sim:'scanner',teachAt:[2],tip:'',tasks:[]},
{title:'True or False?',heading:'Is this statement true or false?',tip:'A virus attaches itself to a file and spreads. It can damage the system, prevent booting up or slow performance. Anti-virus can only recognise viruses that are in its database, so it must be updated regularly.',
 choices:[{key:'T',label:'✅ True'},{key:'F',label:'❌ False'}],
 tasks:[
  {type:'classify',text:'A virus is a program that can attach itself to a file and then spread to other files.',answer:'T',src:'TB p11',feedback:'True. That is the textbook definition.'},
  {type:'classify',text:'A virus can prevent a computer from booting up.',answer:'T',src:'TB p11',feedback:'True.'},
  {type:'classify',text:'A virus can slow a computer\'s performance.',answer:'T',src:'TB p11',feedback:'True.'},
  {type:'classify',text:'Anti-virus software can only scan the internal hard drive.',answer:'F',src:'TB p11',feedback:'False. It can scan all the storage devices connected, including USB memory pens.'},
  {type:'classify',text:'If a new virus is not yet in the database, the anti-virus may not recognise it.',answer:'T',src:'GAP-S4 (TB p11)',feedback:'True. It recognises viruses by comparing files to its known database.'},
  {type:'classify',text:'Anti-virus software only needs to be updated once, when it is installed.',answer:'F',src:'GAP-S4 (TB p11)',feedback:'False. The database must be updated regularly so that new viruses can be recognised.'},
  {type:'classify',text:'Task scheduling can set a virus check to run automatically at a given time.',answer:'T',src:'PP 2019 Q5(b)',feedback:'True. A virus check schedule was an example in the 2019 mark scheme.'}
 ]},
{title:'Exam Room',heading:'Exam and textbook questions',keepOrder:true,teachAt:[3],boss:{icon:'🦠',name:'The Mega Virus'},tip:'Learn the full chain: scans files stored and data entering → compares them to a known database of viruses → detects, locates and removes. Keep the database updated so new viruses are recognised.',
 tasks:[PP.av2025c,
  {type:'fill',src:'TB p11',q:'Complete the description of anti-virus software. (Not all words will be used.)',
   bank:['files','database','remove','defragment','backup','time slice'],
   text:'Anti-virus software scans [[files]] stored on a computer and data entering it, and compares these to a known [[database]] of viruses. Its main purpose is to detect, locate and [[remove]] a virus.',
   feedback:'This is the textbook description: scans files and data entering → known database → detect, locate, remove.'},
  {type:'mcq',src:'GAP-S4 (TB p11)',q:'Why is it important that anti-virus software is updated regularly?',
   options:['New viruses that are not in its known database of viruses would not be recognised','Updates rearrange the files on the hard disc so they load faster','Updates make a backup copy of every file','Updates give each program a bigger time slice'],answer:0,
   feedback:'Anti-virus compares files to a known database of viruses. A new virus that is not in the database cannot be recognised, so the database must be kept up to date.'}]}
]};
