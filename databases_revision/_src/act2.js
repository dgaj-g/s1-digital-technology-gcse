/* Activity 2 — The Door. Sources: TB p14; PP 2021 Q2(g), 2022 Q10(c)(d), 2023 Q3(b), 2025 Q5(b). */
const DR_CHECKS=[['pres','Presence','⬜'],['len','Length','📏'],['typ','Type','🔤'],['fmt','Format','🧩'],['rng','Range','↔️']];
const drName=c=>(DR_CHECKS.find(x=>x[0]===c)||[])[1];
const drIcon=c=>(DR_CHECKS.find(x=>x[0]===c)||[])[2];
const DR_LETTERS=/^[A-Za-zÁÉÍÓÚáéíóú]+$/;
/* Each field knows only the limits its own rule gives it. A check with nothing to check against lets everything through. */
const DR_FORMS=[
 {form:'frmNewPupil',table:'tblPupil',stage:'New pupils',
  banner:['Door duty','New pupil records are queuing to get into the school database. Put one validation check on each field of the form. Then open the door: the computer will check every entry against your rules.'],
  fields:[
   {f:'Surname',rule:'Every pupil must have a surname.'},
   {f:'PupilNumber',rule:'Always exactly 7 characters, like 2026041.',len:[7,7],fmt:/^\d{7}$/,like:'2026041'},
   {f:'Siblings',rule:'How many brothers and sisters are in the school. Must be a number.',num:true},
   {f:'DaysAbsent',rule:'From 0 to 190. A school year has 190 days.',num:true,rng:[0,190]},
   {f:'Postcode',rule:'Must follow the pattern of a postcode like BT34 1AB.',fmt:/^BT\d{1,2} \d[A-Z]{2}$/,like:'BT34 1AB'}],
  queue:[
   ['Aoife',['Murphy','2026041','1','3','BT34 1AB']],
   ['Ciarán',['McCann','2026042','0','0','BT35 6QJ']],
   ['Ella',['Byrne','2026043','2','190','BT34 2LT']],
   ['Oisín',['Quinn','2026044','0','12','BT60 1EE']],
   ['Niamh',['Kelly','2026045','3','7','BT34 5HN']],
   ['Seán',['Doyle','2026046','1','1','BT35 8DZ']],
   ['Tom',['','2026047','0','4','BT34 3PL'],'Surname','is blank'],
   ['Cara',['Hughes','20260','1','2','BT34 4RW'],'PupilNumber','has only 5 characters'],
   ['Erin',['Fox','20260411','2','6','BT34 6TT'],'PupilNumber','has 8 characters'],
   ['Maya',['Ryan','2026050','two','5','BT34 9XY'],'Siblings','is not a number'],
   ['Liam',['Walsh','2026049','0','250','BT35 7AA'],'DaysAbsent','is more than 190'],
   ['Jack',['Moore','2026051','1','-3','BT60 2KD'],'DaysAbsent','is less than 0'],
   ['Sam',['Duffy','2026053','0','9','1AB BT34'],'Postcode','does not follow the postcode pattern']]},
 {form:'frmTripBooking',table:'tblTrip',stage:'Trip bookings',named:true,
  banner:['Trip bookings','Pupils are booking places on the school trips. This form has different fields, so read the rule for each field carefully before you choose its check.'],
  fields:[
   {f:'FirstName',rule:'Letters only.',alpha:true},
   {f:'TripCode',rule:'Three capital letters, then two digits, like PAR26.',fmt:/^[A-Z]{3}\d{2}$/,like:'PAR26'},
   {f:'Deposit',rule:'From £10 to £50.',num:true,rng:[10,50],unit:'£'},
   {f:'MedicalNotes',rule:'Can be left blank. No longer than 40 characters.',len:[0,40]}],
  queue:[
   ['Aoife',['Aoife','PAR26','10','']],
   ['Ciarán',['Ciarán','ROM26','50','Asthma inhaler']],
   ['Ella',['Ella','PAR26','25','None']],
   ['Oisín',['Oisín','BER26','30','']],
   ['Niamh',['Niamh','ROM26','15','Wears glasses']],
   ['R0ry',['R0ry','PAR26','20',''],'FirstName','has a zero in it, not a letter O'],
   ['Liam',['Liam','26PAR','20',''],'TripCode','does not follow the pattern'],
   ['Maya',['Maya','BER26','5',''],'Deposit','is less than £10'],
   ['Jack',['Jack','ROM26','60','None'],'Deposit','is more than £50'],
   ['Erin',['Erin','PAR26','40','Allergic to peanuts, so an EpiPen must travel with her'],'MedicalNotes','is longer than 40 characters']]}
];
/* what one check on one field says about a value: null = accepted, else the error message */
function drCheck(F,c,v){
  if(c==='pres')return v===''?`${F.f} cannot be left blank`:null;
  if(!c||v==='')return null;
  if(c==='len'&&F.len){const [lo,hi]=F.len;if(v.length<lo||v.length>hi)return lo===hi?`${F.f} must be exactly ${lo} characters`:`${F.f} must be no longer than ${hi} characters`;}
  if(c==='typ'&&F.num&&!/^-?\d+(\.\d+)?$/.test(v))return `${F.f} must be a number`;
  if(c==='typ'&&F.alpha&&!DR_LETTERS.test(v))return `${F.f} must be letters only`;
  if(c==='fmt'&&F.fmt&&!F.fmt.test(v))return `${F.f} must look like ${F.like}`;
  if(c==='rng'&&F.rng){const n=Number(v),[lo,hi]=F.rng;const u=F.unit||'';if(isNaN(n)||n<lo||n>hi)return `${F.f} must be from ${u}${lo} to ${u}${hi}`;}
  return null;
}
const drShow=(F,v)=>v===''?'(blank)':(F.unit||'')+v;
let DR=null;
function sim_door(area,finish){
  DR={k:0,rules:[{},{}],runs:[0,0],sel:null,fast:false};
  gmOpen(area,{title:'The door',icon:'🚪',stages:[DR_FORMS[0].stage,DR_FORMS[1].stage,'One last entry'],lives:3,finish});
  gmBanner(...DR_FORMS[0].banner,'🛠️ Set the checks',()=>drSet(0));
}
function drSet(k){
  DR.k=k;DR.sel=null;gmStage(k);GM.state='rules';gmMsg('');
  const D=DR_FORMS[k],R=DR.rules[k];
  $('gmMain').innerHTML=`<div class="gm-q">Drag a check onto each field, or tap a check and then tap a field. Each field gets one check. Bad data must be kept out, and good data must be let in.</div>
<div class="dr-tray" id="drTray">${DR_CHECKS.map(([c,n,i])=>`<button class="dr-badge c-${c}" data-c="${c}"><span>${i}</span>${n}</button>`).join('')}</div>
<div class="dr-form"><div class="dr-bar">📝 ${D.form}<span>saves to ${D.table}</span></div>
${D.fields.map(F=>`<div class="dr-row"><div class="dr-lab"><b>${F.f}</b><span class="dr-note">${F.rule}</span></div><button class="dr-slot" data-f="${F.f}"></button></div>`).join('')}</div>
<div class="gm-btns dr-go"><span class="dr-wait">🚶 ${D.queue.length} entries are waiting at the door</span><button class="btn btn-primary" id="drGo">🚪 Open the door</button></div>`;
  drPaint();
  const tray=$('drTray');
  tray.onpointerdown=e=>{const b=e.target.closest('.dr-badge');if(!b||GM.state!=='rules')return;
    DR.drag={c:b.dataset.c,x:e.clientX,y:e.clientY,moved:false,ghost:null};};
  document.onpointermove=e=>{const d=DR&&DR.drag;if(!d)return;
    if(!d.moved&&Math.hypot(e.clientX-d.x,e.clientY-d.y)<7)return;
    if(!d.moved){d.moved=true;d.ghost=document.createElement('div');d.ghost.className='dr-ghost dr-badge c-'+d.c;d.ghost.innerHTML=`<span>${drIcon(d.c)}</span>${drName(d.c)}`;document.body.appendChild(d.ghost);}
    d.ghost.style.left=e.clientX+'px';d.ghost.style.top=e.clientY+'px';
    document.querySelectorAll('.dr-slot.over').forEach(s=>s.classList.remove('over'));
    const s=drSlotAt(e);if(s)s.classList.add('over');e.preventDefault();};
  document.onpointerup=e=>{const d=DR&&DR.drag;if(!d)return;DR.drag=null;
    if(d.ghost)d.ghost.remove();document.querySelectorAll('.dr-slot.over').forEach(s=>s.classList.remove('over'));
    if(!d.moved){DR.sel=DR.sel===d.c?null:d.c;return drPaint();}
    const s=drSlotAt(e);if(s)drPlace(s.dataset.f,d.c);};
  document.onpointercancel=()=>{const d=DR&&DR.drag;if(d&&d.ghost)d.ghost.remove();if(DR)DR.drag=null;};
  document.querySelectorAll('.dr-slot').forEach(s=>s.onclick=()=>{if(GM.state!=='rules')return;
    const f=s.dataset.f;if(DR.sel){drPlace(f,DR.sel);DR.sel=null;drPaint();}else if(R[f]){delete R[f];sfx('tick');drPaint();}});
  $('drGo').onclick=()=>{
    if(!Object.keys(R).length)return gmMsg('Put a check on the fields first. Drag a check onto a field, or tap a check and then tap a field.','part');
    drRun(k);};
}
function drSlotAt(e){const el=document.elementFromPoint(e.clientX,e.clientY);return el&&el.closest('.dr-slot');}
function drPlace(f,c){DR.rules[DR.k][f]=c;sfx('zap');gmMsg('');drPaint();
  const s=document.querySelector(`.dr-slot[data-f="${f}"]`);if(s&&!RM){s.classList.remove('pop');void s.offsetWidth;s.classList.add('pop');}}
function drPaint(){
  const R=DR.rules[DR.k];
  document.querySelectorAll('.dr-badge').forEach(b=>b.classList.toggle('on',b.dataset.c===DR.sel));
  document.querySelectorAll('.dr-slot').forEach(s=>{const c=R[s.dataset.f];s.classList.toggle('set',!!c);s.classList.toggle('ready',!!DR.sel);
    s.innerHTML=c?`<span class="dr-chip c-${c}">${drIcon(c)} ${drName(c)}<span class="dr-ck"> check</span></span><i class="dr-x" aria-hidden="true">✕</i>`:`<span class="dr-none">${DR.sel?'Tap to put it here':'No check'}</span>`;
    s.setAttribute('aria-label',`${s.dataset.f}: ${c?drName(c)+' check. Tap to take it off.':'no check'}`);});
}
function drRun(k){
  gmStage(k);GM.state='queue';gmMsg('');DR.runs[k]++;
  const D=DR_FORMS[k],R=DR.rules[k],nBad=D.queue.filter(q=>q[2]).length,nGood=D.queue.length-nBad;
  const res=[],run=DR.runs[k];
  $('gmMain').innerHTML=`<div class="dd-top"><div class="gm-panel"><div class="vs-h">🗑️ Bad data in ${D.table}</div><div class="meter"><div id="ddBad" style="width:0%"></div></div></div>
<div class="gm-panel"><div class="vs-h">😠 Good entries turned away</div><div class="meter"><div id="ddAngry" style="width:0%"></div></div></div></div>
<div class="dr-door"><div class="dr-card" id="drCard"></div><div class="dr-way" id="drWay"><span class="dr-dicon">🚪</span><span class="dr-count" id="drCount">Entry 0 of ${D.queue.length}</span><span class="dr-tally"><span>✅ Let in <b id="drIn">0</b></span><span>⛔ Turned away <b id="drOut">0</b></span></span></div></div>
<div class="dr-speed"><button class="ss-chip" id="drFast">⏩ Faster</button></div>
<div class="dd-list" id="ddList"></div>`;
  $('drFast').onclick=()=>{DR.fast=!DR.fast;$('drFast').textContent=DR.fast?'▶️ Normal speed':'⏩ Faster';};
  const wait=ms=>RM||DR.fast?Math.round(ms/5):ms,live=()=>GM&&GM.state==='queue'&&DR.runs[k]===run;
  const queue=gmShuffle(D.queue);let i=0;
  const next=()=>{
    if(!live())return;
    if(i>=queue.length)return drAfter(k,res);
    const [who,vals,badF,badWhy]=queue[i++];
    $('drCard').className='dr-card';$('drCount').textContent=`Entry ${i} of ${queue.length}`;$('drWay').className='dr-way';
    $('drCard').innerHTML=`<div class="dr-who">${D.named?'📨':'🧑‍🎓'} ${who}</div>${D.fields.map((F,j)=>`<div class="dr-fv" id="drv${j}"><i>${F.f}</i><b>${drShow(F,vals[j])}</b><em>${R[F.f]?drIcon(R[F.f])+' '+drName(R[F.f]):'No check'}</em></div>`).join('')}<div class="dr-say" id="drSay"></div>`;
    if(!RM){void $('drCard').offsetWidth;$('drCard').classList.add('walk');}
    let j=0,err=null;
    const look=()=>{
      if(!live())return;
      if(j<D.fields.length&&!err){const F=D.fields[j];err=drCheck(F,R[F.f],vals[j]);$('drv'+j).classList.add(err?'fail':'pass');if(!err)sfx('tick');j++;return setTimeout(look,wait(170));}
      const inn=!err,bad=!!badF,right=inn!==bad;
      res.push({who,vals,badF,badWhy,inn,err,right});
      $('drCard').classList.add(inn?'in':'out');$('drWay').classList.add(inn?'let':'stop');$('drIn').textContent=res.filter(r=>r.inn).length;$('drOut').textContent=res.filter(r=>!r.inn).length;$('drSay').textContent=inn?'✅ Let in':'⛔ '+err;
      sfx(right?(inn?'good':'zap'):'bad');
      const L=$('ddList');
      L.insertAdjacentHTML('afterbegin',`<div class="dd-row ${inn?'in':'out'}${right?'':' wrong'}"><span class="dd-who">${inn?'✅':'⛔'} ${who}</span>
<span class="dd-vals">${D.fields.map((F,j)=>`<i>${F.f}: <b>${drShow(F,vals[j])}</b></i>`).join('')}</span><span class="dd-why">${inn?'Let in':err}${right?'':inn?'<br><b>🗑️ Bad data got in</b>':'<br><b>😠 A good entry was turned away</b>'}</span></div>`);
      const nb=res.filter(r=>r.inn&&r.badF).length,ng=res.filter(r=>!r.inn&&!r.badF).length;
      $('ddBad').style.width=Math.round(nb/nBad*100)+'%';$('ddBad').className=nb?'slow':'';
      $('ddAngry').style.width=Math.round(ng/nGood*100)+'%';$('ddAngry').className=ng?'slow':'';
      setTimeout(next,wait(700));
    };
    setTimeout(look,wait(380));
  };
  next();
}
function drAfter(k,res){
  GM.state='fb';
  const D=DR_FORMS[k],R=DR.rules[k],badIn=res.filter(r=>r.inn&&r.badF),goodOut=res.filter(r=>!r.inn&&!r.badF);
  $('drFast').disabled=true;
  if(!badIn.length&&!goodOut.length){
    say('A perfect door! 🎉');sfx('level');
    gmMsg(`Every bad entry was kept out and every good entry was let in. Your ${['','one','two','three','four','five','six'][D.fields.length]} checks work.${R.PupilNumber==='fmt'?' A format check of seven digits works on PupilNumber too, just like a length check of 7 characters.':''}`,'correct');
    return k===0?gmGo('Next: trip bookings →',()=>gmBanner(...DR_FORMS[1].banner,'🛠️ Set the checks',()=>drSet(1))):gmGo('One last entry →',drTwist);
  }
  const out=gmLose();say('The door let us down! 😬');
  const lines=[
    ...badIn.map(r=>{const j=D.fields.findIndex(F=>F.f===r.badF),c=R[r.badF];return `🗑️ <b>${r.who}</b> got in, but ${r.badF} “${drShow(D.fields[j],r.vals[j])}” ${r.badWhy}. ${c?`The ${drName(c).toLowerCase()} check on ${r.badF} did not stop it.`:`${r.badF} had no check.`}`;}),
    ...goodOut.map(r=>`😠 <b>${r.who}</b> was turned away by “${r.err}”, but that entry was fine.`)];
  gmMsg(`<div class="dr-lines">${lines.map(l=>`<div>${l}</div>`).join('')}</div>`,'wrong');
  if(out)return gmGo('See what happened →',()=>gmEnd(0,'The door is closed','The queue got through with the wrong checks three times. Read the five checks again, then have another go.'));
  gmGo('🛠️ Change the checks',()=>drSet(k));
}
function drTwist(){
  gmStage(2);GM.state='twist';gmMsg('');
  const opts=gmShuffle([['n','No. Validation checks that data is sensible. It cannot check that the data is correct.'],['y','Yes. It passed every check, so it must be correct.'],['r','Yes. The range check would have stopped a wrong number.']]);
  $('gmMain').innerHTML=`<div class="dd-row in"><span class="dd-who">✅ Aoife</span><span class="dd-vals"><i>Surname: <b>Murphy</b></i><i>PupilNumber: <b>2026041</b></i><i>Siblings: <b>1</b></i><i>DaysAbsent: <b>8</b></i><i>Postcode: <b>BT34 1AB</b></i></span><span class="dd-why">Let in</span></div>
<div class="gm-q" style="margin-top:12px;">Aoife was absent for 3 days, but her DaysAbsent was typed as 8. Your checks let the entry in. Is the data in the database correct?</div>
<div class="mcq-list">${opts.map(([k,t])=>`<button class="mcq-btn" data-k="${k}">${t}</button>`).join('')}</div>`;
  document.querySelectorAll('.mcq-list .mcq-btn').forEach(b=>b.onclick=()=>{
    if(GM.state!=='twist')return;GM.state='fb';const ok=b.dataset.k==='n';
    b.classList.add(ok?'correct':'wrong');sfx(ok?'good':'bad');
    document.querySelectorAll('.mcq-list .mcq-btn').forEach(x=>x.disabled=true);
    gmMsg(`${ok?'Right.':'Not quite.'} 8 is between 0 and 190, so the range check let it in, but it is the wrong number. Validation checks that data is sensible or reasonable. It cannot check that the data is <b>accurate</b>.`,ok?'correct':'wrong');
    const tries=DR.runs[0]+DR.runs[1],st=Math.max(1,gmStars(GM.lives,3)-(ok?0:1));
    gmGo('Finish →',()=>gmEnd(st,'Shift over',tries===2?'Both forms kept the bad data out first time.':`Both forms kept the bad data out. You opened the door ${tries} times.`));
  });
}
const ACT={
title:'The Door',icon:'🚪',
intro:'Bad data is trying to get into the school database. Your mission: learn the five validation checks, set the checks on two real forms, and find out what validation can and cannot do.',
topics:'Data validation; presence, length, type, format and range checks; describing a check; what validation cannot check',
ranks:['Head of Security','Door Supervisor','Trainee Steward','New Starter — revise and retry'],
next:{href:'activity3.html',label:'Next: Query Gates'},
teach:[
{teaches:['validation'],html:`<div class="teach-card"><h3>🚪 The form that turns red</h3>
<p><span class="term">Validation</span> is an automatic check carried out by the <b>computer</b>. It makes sure the data entered is <b>sensible</b>, reasonable or meets set criteria.</p>
<div class="highlight">The computer checks the data as it is entered. It either <b>accepts</b> it, or <b>rejects</b> it and shows an <b>error message</b>.</div>
<div class="example-row"><div class="example-item">TestMark: <b>64</b><br>✅ accepted</div><div class="example-item">TestMark: <b>640</b><br>⛔ “TestMark must be from 0 to 100”</div></div>
<p style="margin-top:10px;"><b>Validation cannot prove that data is accurate.</b> A mark of 46 typed instead of 64 is still sensible, so it gets through.</p></div>`},
{teaches:['presence','length','type-check','format','range'],html:`<div class="teach-card"><h3>✅ The five checks</h3>
<table class="gm-tbl"><tr><th>Check</th><th>What it does</th><th>Bad entry it stops</th></tr>
<tr><td><b>Presence</b></td><td>Makes sure data has been entered. The field cannot be left blank.</td><td>CustomerName left empty</td></tr>
<tr><td><b>Length</b></td><td>Makes sure the data has the correct number of characters: an exact number, or no more than a maximum.</td><td>MobileNumber 0770012 when it must be exactly 11 characters</td></tr>
<tr><td><b>Type</b></td><td>Makes sure the data is the correct type, for example numbers only or letters only.</td><td>Age typed as “ten”</td></tr>
<tr><td><b>Format</b></td><td>Makes sure the data matches a set pattern.</td><td>StudentCode 12AB when the pattern is two letters then two digits, like AB12</td></tr>
<tr><td><b>Range</b></td><td>Makes sure the data is between a lower and an upper limit. Both limits are allowed.</td><td>DayOfMonth 35 when days go from 1 to 31</td></tr></table>
<div class="tip-box">Read the rule for the field. Must be filled in: presence. A set number of characters: length. Numbers only or letters only: type. A pattern: format. Between two limits: range.</div></div>`},
{teaches:['describe'],html:`<div class="teach-card"><h3>🎯 Exam focus: describe a check</h3>
<p>A “describe” question gives a mark for <b>what the check does</b> and a mark for <b>an example</b> that uses a real field and real values from the question.</p>
<div class="example-row"><div class="example-item">✅ “It makes sure the data is between a lower and an upper limit, for example DaysAbsent must be from 0 to 190.”</div><div class="example-item">❌ “A range check checks the range.” This repeats the name and gives no example.</div></div>
<p style="margin-top:10px;">Use the field names you can see in the form or table in the question.</p>
<div class="tip-box">2021 asked you to describe a presence check and a range check on a form. 2025 asked what validation is, and which check fits each box on a form.</div></div>`}
],
rounds:[
{title:'Which Check?',teachAt:[0,1],heading:'Which check stops this bad entry?',tip:'Presence: blank. Length: too many or too few characters. Type: the wrong kind of data, like letters in a number field. Format: the wrong pattern. Range: below the lower limit or above the upper limit.',
 choices:[{key:'pre',label:'Presence'},{key:'len',label:'Length'},{key:'typ',label:'Type'},{key:'fmt',label:'Format'},{key:'rng',label:'Range'}],
 tasks:[
  {type:'classify',text:'Email: left empty (every customer must give an email)',answer:'pre',src:'Practice, TB p14',feedback:'Presence check: the field cannot be left blank.'},
  {type:'classify',text:'TeamName: nothing typed on the sign-up form',answer:'pre',src:'Practice, TB p14',feedback:'Presence check: data must be entered.'},
  {type:'classify',text:'BookingRef: AB12345 (must be exactly 6 characters)',answer:'len',src:'Practice, TB p14',feedback:'Length check: AB12345 has 7 characters, one too many.'},
  {type:'classify',text:'Nickname: 15 characters long (no longer than 10 characters)',answer:'len',src:'Practice, TB p14',feedback:'Length check: a length check can set a maximum number of characters.'},
  {type:'classify',text:'Quantity: “six” (must be a number)',answer:'typ',src:'Practice, TB p14',feedback:'Type check: the data must be a number, not letters.'},
  {type:'classify',text:'TripCost: “ten pounds” (must be a number)',answer:'typ',src:'Practice, TB p14',feedback:'Type check: the data must be a number, not words.'},
  {type:'classify',text:'CarReg: 1234 ABZ (pattern must be like ABZ 1234)',answer:'fmt',src:'Practice, TB p14',feedback:'Format check: the letters and digits are in the wrong pattern.'},
  {type:'classify',text:'Email: jo.smith.gmail.com (pattern must be like name@site.com)',answer:'fmt',src:'Practice, TB p14',feedback:'Format check: the email does not match the pattern, because it has no @.'},
  {type:'classify',text:'Month: 13 (must be from 1 to 12)',answer:'rng',src:'Practice, TB p14',feedback:'Range check: 13 is above the upper limit.'},
  {type:'classify',text:'Age: 4 on a secondary-school form (must be from 11 to 19)',answer:'rng',src:'Practice, TB p14',feedback:'Range check: 4 is below the lower limit.'}
 ]},
{title:'Door Duty',teachAt:[],mode:'sim',sim:'door',heading:'Put a check on every field, then open the door',tip:'Read the rule beside each field. Must be filled in: presence. A set number of characters: length. Numbers only or letters only: type. A pattern: format. Between two limits: range.',tasks:[]},
{title:'Exam Room',heading:'Real CCEA exam questions',teachAt:[2],boss:{icon:'🚧',name:'The Gatecrasher'},tip:'Learn the five checks in the textbook’s words, and describe each one with a real field and real values.',
 tasks:[],pool:[[[PP.val2025q5bi],1],[[PP.val2022q10d1,PP.val2023q3b2],1],[[PP.val2022q10d2,PP.val2023q3b3,PP.val2022q10c3,PP.val2023q3b1],2],[[PP.val2021q2g1,PP.val2021q2g2],1],[[PP.val2025q5bii],1]]}
]};
