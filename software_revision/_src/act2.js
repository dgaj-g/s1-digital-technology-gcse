/* Activity 2 — Processing Mode Dispatch. Spec S2. Sources: TB p9-11; PP 2018 Q5(c), 2022 Q1(d), 2023 Q5(c), 2023 Q12(a). */
function playUsers(){
  const cells=[...document.querySelectorAll('#users div')];let i=0;
  const t=setInterval(()=>{cells.forEach(c=>c.classList.remove('on'));if(i>=12){clearInterval(t);return;}cells[i%4].classList.add('on');i++;},300);
}
const ACT={
title:'Processing Mode Dispatch',icon:'📡',
intro:'Dispatch control needs you. Data arrives all day and every job must go to the right mode of processing. Your mission: master real-time, batch and multi-user processing, and the applications that use each one.',
topics:'Real-time processing, batch processing, multi-user processing, and which applications use each one',
ranks:['Head of Dispatch','Senior Dispatcher','Dispatch Trainee','New Recruit — revise and retry'],
next:{href:'activity3.html',label:'Next: Utility Toolkit'},
teach:[
{html:`<div class="teach-card"><h3>📡 Three modes of processing</h3>
<div class="mode-grid">
<div><h4>⚡ Real-time</h4>Processing of data occurs immediately data is input, and updating occurs before the next input occurs.</div>
<div><h4>📦 Batch</h4>Data is collected over a period of time, such as a day, and is processed together at a later time, such as overnight.</div>
<div><h4>👥 Multi-user</h4>The operating system switches between computers, giving each one a 'time slice'.</div>
</div></div>`},
{html:`<div class="teach-card"><h3>⚡ Real-time processing</h3><ul>
<li>Data is processed immediately after it is inputted.</li>
<li>Data files are updated before the next transaction takes place.</li>
<li>The output generated is processed quickly enough to influence the next input received.</li></ul>
<div class="highlight"><b>Applications:</b> airline and concert booking systems · online stock control systems · air traffic control systems</div>
<div class="tip-box">Exam tip: when you define real-time processing, describe data being updated as soon as a transaction takes place. Do not just write "processing done in real time".</div></div>`},
{html:`<div class="teach-card"><h3>📦 Batch processing</h3><ul>
<li>Groups of similar data are collected over a period of time.</li>
<li>The data is input at an off-peak time without any human involvement.</li>
<li>It suits applications where the data does not have to be processed immediately.</li></ul>
<div class="highlight"><b>Applications:</b> billing systems (electricity, gas, telephone) · payroll (weekly or monthly) · banking systems (producing monthly customer statements)</div>
<div class="tip-box">Common mistake: mixing up which applications use batch and which use real-time. A bill or a payslip does not have to be processed immediately, so it is batch. A booking must be updated before the next transaction takes place, so it is real-time.</div></div>`},
{html:`<div class="teach-card"><h3>👥 Multi-user processing</h3>
<p>Many users at different computers share the <b>same processor</b>. The operating system switches at high speed between the computers, giving each in turn a small amount of processor time known as a <b>'time slice'</b>.</p>
<div class="timeline" id="users">${['💻 1','💻 2','💻 3','💻 4'].map((u,i)=>`<div style="background:${['#64b5f6','#ffb74d','#81c784','#ce93d8'][i]}">${u}</div>`).join('')}</div>
<button class="btn btn-ghost" style="padding:8px 18px;font-size:0.85em;" onclick="playUsers()">▶ Watch the processor switch</button>
<div class="highlight"><b>Application:</b> multi-user database management systems</div></div>`,init:playUsers},
{html:`<div class="teach-card"><h3>🎯 How CCEA words it</h3>
<p>Exam papers describe the modes in their own words. Learn to spot each one:</p><ul>
<li><b>Real-time</b>: "data is processed immediately on collection"; "processing data fast enough to influence the behaviour of the next input"</li>
<li><b>Batch</b>: "collecting groups of similar data over time and processing the data together"; "processing data all together during processor downtime"</li>
<li><b>Multi-user</b>: "manages the sharing of CPU time and resources needed by many users"; "processing that enables several users to use the system at once"</li></ul></div>`}
],
rounds:[
{title:'Job Dispatch',teachAt:[0,1,2,3],heading:'Which mode of processing does this application use?',tip:'Real-time: airline/concert booking, online stock control, air traffic control. Batch: billing (electricity, gas, telephone), payroll, monthly bank statements. Multi-user: multi-user database management systems.',
 choices:[{key:'rt',label:'⚡ Real-time'},{key:'b',label:'📦 Batch'},{key:'mu',label:'👥 Multi-user'}],
 tasks:[
  {type:'classify',text:'An airline booking system',answer:'rt',src:'TB p9',feedback:'Real-time: the data is updated before the next transaction takes place.'},
  {type:'classify',text:'A concert booking system',answer:'rt',src:'TB p9',feedback:'Real-time: the data is updated before the next transaction takes place.'},
  {type:'classify',text:'An online stock control system',answer:'rt',src:'TB p9',feedback:'Real-time.'},
  {type:'classify',text:'An air traffic control system',answer:'rt',src:'TB p9',feedback:'Real-time: the output must be quick enough to influence the next input.'},
  {type:'classify',text:'Electricity billing',answer:'b',src:'TB p10',feedback:'Batch: billing systems (electricity, gas, telephone).'},
  {type:'classify',text:'Telephone billing',answer:'b',src:'TB p10',feedback:'Batch: billing systems.'},
  {type:'classify',text:'A weekly or monthly payroll',answer:'b',src:'TB p10',feedback:'Batch: payroll.'},
  {type:'classify',text:'A bank producing monthly customer statements',answer:'b',src:'TB p10',feedback:'Batch: banking systems producing monthly statements.'},
  {type:'classify',text:'A multi-user database management system',answer:'mu',src:'TB p10',feedback:'Multi-user.'}
 ]},
{title:'Spot the Feature',teachAt:[4],heading:'Which mode of processing does this describe?',tip:'Real-time = immediately, updated before the next input. Batch = collected over time, processed together at an off-peak time / processor downtime. Multi-user = many users share one processor through time slices.',
 choices:[{key:'rt',label:'⚡ Real-time'},{key:'b',label:'📦 Batch'},{key:'mu',label:'👥 Multi-user'}],
 tasks:[
  {type:'classify',text:'Data is processed immediately after it is inputted',answer:'rt',src:'TB p9',feedback:'Real-time.'},
  {type:'classify',text:'Data files are updated before the next transaction takes place',answer:'rt',src:'TB p9',feedback:'Real-time.'},
  {type:'classify',text:'Groups of similar data are collected over a period of time',answer:'b',src:'TB p10',feedback:'Batch.'},
  {type:'classify',text:'Data is input at an off-peak time without any human involvement',answer:'b',src:'TB p10',feedback:'Batch.'},
  {type:'classify',text:'Suits applications where data does not have to be processed immediately',answer:'b',src:'TB p10',feedback:'Batch.'},
  {type:'classify',text:'Many users at different computers share the same processor',answer:'mu',src:'TB p10',feedback:'Multi-user.'},
  {type:'classify',text:'The operating system switches at high speed between the computers, giving each a time slice',answer:'mu',src:'TB p10',feedback:'Multi-user.'},
  {type:'classify',text:'Processing that enables several users to use the system at once',answer:'mu',src:'PP 2023 Q12(a)',ref:'2023 Q12(a) wording',feedback:'Multi-user.'},
  {type:'classify',text:'Processing data fast enough to influence the behaviour of the next input',answer:'rt',src:'PP 2023 Q12(a)',ref:'2023 Q12(a) wording',feedback:'Real-time.'}
 ]},
{title:'Exam Room',heading:'Real CCEA exam questions',keepOrder:true,boss:{icon:'📡',name:'The Dispatch Demon'},tip:'Practise the 2018 paragraph: batch → billing systems, real-time → airline booking systems. Watch for "later" (batch) and "immediately" (real-time).',
 tasks:[PP.mode2018c,PP.mode2022d,PP.mode2023c1,PP.mode2023c2,PP.mode2023q12a]}
]};
