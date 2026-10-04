/* Activity 3 — Utility Toolkit. Spec S3. Sources: TB p10; PP 2018 Q12, 2019 Q5(b), 2022 Q1(i), 2022 Q5(b), 2023 Q5(d), 2023 Q12(b), 2025 Q1(d). */
const FRAG='A.B.CA..B.C.AC.B..A.....'.split('');
const DEFRAG='AAAABBBCCC..............'.split('');
function drawDisk(cells){$('disk').innerHTML=cells.map(c=>`<div class="${c==='.'?'':'f'+c.toLowerCase()}">${c==='.'?'':c}</div>`).join('');}
function defrag(){drawDisk(DEFRAG);$('diskNote').innerHTML='✅ Defragmented: each file is now in <b>adjacent blocks</b> and all the free blocks are together. The files are now quicker to access.';}
function fragment(){drawDisk(FRAG);$('diskNote').innerHTML='Before: the parts of files A, B and C are spread across the disc, with free blocks in between.';}
function playRobin(){
  const cells=[...document.querySelectorAll('#robin div')];let i=0;
  const t=setInterval(()=>{cells.forEach(c=>c.classList.remove('on'));if(i>=cells.length){clearInterval(t);cells.forEach(c=>c.classList.add('on'));return;}cells[i].classList.add('on');i++;},300);
}
const ACT={
title:'Utility Toolkit',icon:'🧰',
intro:'Welcome to the workshop. Utility applications are the tools that keep a computer running well. Your mission: master disc defragmentation, task scheduling, and backup and restore.',
topics:'Utility applications: disc defragmentation, task scheduling, backup and restoring data (full and incremental)',
ranks:['Master Technician','Senior Technician','Apprentice Technician','New Recruit — revise and retry'],
next:{href:'activity4.html',label:'Next: Virus Shield'},
teach:[
{html:`<div class="teach-card"><h3>🧰 What is a utility application?</h3>
<p>A utility application is <b>a program that carries out a specific task to assist the operating system</b>. Utilities are part of <b>system software</b>.</p>
<div class="highlight">Glossary: "A program that performs a very specific task in managing system resources, such as a backup program."</div>
<p>The three you must be able to describe:</p>
<div class="example-row"><div class="example-item">💽<br><b>Disc defragmentation</b></div><div class="example-item">⏱️<br><b>Task scheduling</b></div><div class="example-item">📀<br><b>Backup and restore</b></div></div>
<div class="tip-box">2023 asked: "Which software group does defragmentation belong to?" The answer is <b>utility</b> software.</div></div>`},
{html:`<div class="teach-card"><h3>💽 Disc defragmentation</h3>
<p>Disc defragmentation rearranges the data on a hard disc so that:</p><ul>
<li>files are stored in <b>adjacent blocks</b></li><li>all the free blocks (free storage space) are together in the same part of the disk</li></ul>
<p>This <b>speeds up the time to access files</b>, because all the data is stored in the same area.</p>
<div class="disk" id="disk"></div><p id="diskNote" style="font-size:0.85em;"></p>
<div class="btn-row-sm" style="margin-top:8px;"><button class="btn btn-success" style="padding:8px 18px;font-size:0.85em;" onclick="defrag()">💽 Defragment the disc</button><button class="btn btn-ghost" style="padding:8px 18px;font-size:0.85em;" onclick="fragment()">↺ Reset</button></div></div>`,init:fragment},
{html:`<div class="teach-card"><h3>⏱️ Task scheduling</h3><ul>
<li>Processor time is divided amongst a number of tasks.</li>
<li>It uses <b>time slices</b>.</li>
<li>It is implemented using a <b>'round robin'</b> method.</li></ul>
<div class="timeline" id="robin">${[1,2,3,1,2,3,1,2,3].map(n=>`<div style="background:${['#64b5f6','#ffb74d','#81c784'][n-1]}">Task ${n}</div>`).join('')}</div>
<button class="btn btn-ghost" style="padding:8px 18px;font-size:0.85em;" onclick="playRobin()">▶ Play round robin</button>
<div class="highlight">The 2019 mark scheme gave marks for:<br>• time slicing <b>to get maximum use of the processor</b> (or it creates the appearance of no interruptions)<br>• <b>or</b> setting up tasks to run automatically at a given time, with an example: a backup schedule, a virus check schedule or update scheduling</div></div>`,init:playRobin},
{html:`<div class="teach-card"><h3>📀 Backup and restoring data</h3>
<p>A <span class="term">backup</span> is a copy of the original data or file, made in case it is damaged or lost.</p>
<p style="margin-top:8px;">It is used to <span class="term">restore</span> the original data to its previous state, by uploading the latest file onto the system.</p>
<div class="example-row"><div class="example-item"><b>Full backup</b><br>the complete data file</div><div class="example-item"><b>Incremental backup</b><br>just the data that has changed</div></div>
<div class="highlight">Glossary: "A second copy of a file made and stored on a <b>different storage device</b> in case the original file gets lost, or becomes corrupted or physically damaged."</div>
<div class="tip-box">2023 mark scheme for "Explain the term backup" [2]: a copy of data or files · made so no data is lost by becoming corrupt, accidentally overwritten or deleted · often made on separate storage drives or a different server.</div></div>`}
],
rounds:[
{title:'Pick the Tool',teachAt:[0,1,2,3],heading:'Which utility is this?',tip:'Defrag = adjacent blocks, free space together, quicker access. Task scheduling = time slices, round robin, tasks run at set times. Backup = a copy (full or incremental) used to restore data.',
 choices:[{key:'d',label:'💽 Disc defragmentation'},{key:'t',label:'⏱️ Task scheduling'},{key:'b',label:'📀 Backup and restore'}],
 tasks:[
  {type:'classify',text:'Rearranges data so that files are stored in adjacent blocks',answer:'d',src:'TB p10',feedback:'Disc defragmentation.'},
  {type:'classify',text:'Puts all the free blocks together in the same part of the disk',answer:'d',src:'TB p10',feedback:'Disc defragmentation.'},
  {type:'classify',text:'Large files have become fragmented. This utility makes them quicker to access.',answer:'d',src:'PP 2019 Q5(b)',feedback:'Disc defragmentation speeds up the time to access data.'},
  {type:'classify',text:'Divides processor time amongst a number of tasks',answer:'t',src:'TB p10',feedback:'Task scheduling.'},
  {type:'classify',text:'Implemented using a \'round robin\' method',answer:'t',src:'TB p10',feedback:'Task scheduling.'},
  {type:'classify',text:'Sets a virus check to run automatically at a given time',answer:'t',src:'PP 2019 Q5(b)',feedback:'Task scheduling: auto-run tasks at a set time (2019 mark scheme example: virus check schedule).'},
  {type:'classify',text:'Makes a copy of the original data in case it is damaged or lost',answer:'b',src:'TB p10',feedback:'Backup.'},
  {type:'classify',text:'Copies just the data that has changed',answer:'b',src:'TB p10',feedback:'An incremental backup.'},
  {type:'classify',text:'Returns the original data to its previous state by uploading the latest file onto the system',answer:'b',src:'TB p10',feedback:'Restoring data from a backup.'}
 ]},
{title:'True or False?',heading:'Is this statement true or false?',tip:'Full backup = complete data file; incremental = just the data that has changed. Defrag puts files in adjacent blocks, which makes them quicker to access. Utilities are system software.',
 choices:[{key:'T',label:'✅ True'},{key:'F',label:'❌ False'}],
 tasks:[
  {type:'classify',text:'Disc defragmentation speeds up the time it takes to access files.',answer:'T',src:'TB p10',feedback:'True. All the data for a file is stored in the same area.'},
  {type:'classify',text:'A full backup copies just the data that has changed.',answer:'F',src:'TB p10',feedback:'False. A full backup copies the complete data file. An incremental backup copies just the data that has changed.'},
  {type:'classify',text:'An incremental backup copies just the data that has changed.',answer:'T',src:'TB p10',feedback:'True.'},
  {type:'classify',text:'Task scheduling uses time slices.',answer:'T',src:'TB p10',feedback:'True. Processor time is divided into time slices.'},
  {type:'classify',text:'Defragmentation belongs to the application software group.',answer:'F',src:'PP 2023 Q5(d)',feedback:'False. Defragmentation is a utility, which is part of system software.'},
  {type:'classify',text:'A backup should be stored on a different storage device from the original.',answer:'T',src:'TB p10',feedback:'True. The glossary says a backup is stored on a different storage device.'},
  {type:'classify',text:'A utility application carries out a specific task to assist the operating system.',answer:'T',src:'TB p10',feedback:'True. That is the textbook definition.'},
  {type:'classify',text:'Defragmentation spreads the parts of a file across the disc so it can be read more quickly.',answer:'F',src:'TB p10',feedback:'False. It does the opposite: it stores files together in adjacent blocks.'}
 ]},
{title:'Exam Room',heading:'Real CCEA exam questions',keepOrder:true,boss:{icon:'🧰',name:'The Glitch Gremlin'},tip:'Practise the 2019 "function of" question: defrag → rearranges into blocks + speeds up access; task scheduling → time slicing + maximum use of the processor.',
 tasks:[PP.util2018q12,PP.util2019defrag,PP.util2019task,PP.util2022i,PP.util2022b,PP.util2023d,PP.util2023b,PP.util2025d]}
]};
