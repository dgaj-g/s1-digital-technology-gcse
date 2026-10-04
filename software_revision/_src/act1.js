/* Activity 1 — OS Control Room. Spec S1. Sources: TB p9; PP 2018 Q5(b), 2023 Q5(b), 2024 Q10, 2025 Q4. */
function playSlices(){
  const cells=[...document.querySelectorAll('#slices div')];let i=0;
  cells.forEach(c=>c.classList.remove('on'));
  const t=setInterval(()=>{if(i>0)cells[i-1].classList.remove('on');if(i>=cells.length){clearInterval(t);cells.forEach(c=>c.classList.add('on'));return;}cells[i].classList.add('on');i++;},350);
}
const ACT={
title:'OS Control Room',icon:'🖥️',
intro:'Welcome to the Control Room. Every computer needs software in charge of it. Your mission: tell application software from system software, and find out how the operating system shares out memory, storage and processing time.',
topics:'Application vs system software, the operating system, GUI, booting, allocating memory, storage and processing time',
ranks:['Chief Systems Controller','Senior Operator','Control Room Trainee','New Recruit — revise and retry'],
next:{href:'activity2.html',label:'Next: Processing Mode Dispatch'},
teach:[
{html:`<div class="teach-card"><h3>💾 Two types of software</h3>
<p><span class="term">Application software</span> enables the computer to do a particular task, such as word processing. These are programs designed for an end user to do a particular task, such as word-processing and spreadsheet programs.</p>
<p style="margin-top:10px;"><span class="term">System software</span> is the interface between computer hardware and user application programs. It enables the computer to operate its hardware and applications software.</p>
<div class="highlight">System software includes the <b>operating system</b> and <b>utility programs</b>.</div>
<div class="example-row"><div class="example-item"><b>Application</b><br>word processing<br>spreadsheet programs</div><div class="example-item"><b>System</b><br>operating system<br>utility programs</div></div></div>`},
{html:`<div class="teach-card"><h3>⚙️ The operating system</h3>
<p>The operating system is <b>a computer program that provides the instructions that enable the computer hardware to work</b>.</p>
<div class="highlight">Operating systems are <b>software</b> that <b>manage</b> computer hardware and software <b>resources</b>. An operating system provides the user with a working <b>interface</b>.</div>
<p>A <span class="term">Graphical User Interface (GUI)</span> is used to interact with a computer through <b>icons and menus</b>.</p>
<p style="margin-top:10px;"><span class="term">Booting</span> (booting up) is the name given to the sequence of loading an operating system into RAM when a computer is turned on.</p>
<div class="tip-box">Exam tip: write "booting" or "booting up". The mark scheme does not accept just "boot".</div></div>`},
{html:`<div class="teach-card"><h3>🧠 Function 1: Allocating memory</h3>
<p>The operating system organises the use of main memory between programs and data files as they are transferred to and from the hard disc.</p>
<p style="margin-top:10px;">When a user wants to open data held on the hard disk, the memory is allocated in three steps:</p>
<ol style="padding-left:22px;margin-top:6px;"><li>A free space in memory (RAM) is located.</li><li>The free space is allocated to the data/program.</li><li>The program/data is transferred back out of main memory when it is no longer required.</li></ol>
<div class="tip-box">This came up as a 3-mark question in 2018. Learn the three steps in order.</div></div>`},
{html:`<div class="teach-card"><h3>🗄️ Function 2: Storage</h3>
<p>The operating system manages the storage of data and files on external devices, such as a hard drive.</p></div>
<div class="teach-card"><h3>⏱️ Function 3: Processing time</h3>
<p>The operating system allocates processing time between the programs that are currently in use. It divides the time into a number of <b>time slices</b>. Depending on the <b>priority</b> of the tasks to be processed, each task is allocated a number of these time slices.</p>
<p style="margin-top:8px;font-size:0.85em;color:#8899aa;">In this example, each program is allocated a number of time slices depending on its priority.</p>
<div class="timeline" id="slices">${'AABACAABAC'.split('').map(p=>`<div style="background:${p==='A'?'#64b5f6':p==='B'?'#ffb74d':'#81c784'}">${p}</div>`).join('')}</div>
<button class="btn btn-ghost" style="padding:8px 18px;font-size:0.85em;" onclick="playSlices()">▶ Play the time slices</button></div>`,init:playSlices},
{html:`<div class="teach-card"><h3>🎯 Exam focus</h3>
<p>Exam questions ask you to list the <b>resources</b> the operating system manages. These answers have got the marks:</p>
<ul><li>Memory (RAM) allocation</li><li>Storage</li><li>Processing time (task scheduling)</li><li>Peripherals (2023 mark scheme)</li></ul>
<div class="tip-box">Read the question carefully. 2018 asked: "Apart from allocating memory, list two other resources…". There, "memory" does not get a mark.</div>
<p>The textbook also asks you to <b>identify three functions of system software</b>: allocating memory, storage and processing time.</p></div>`}
],
rounds:[
{title:'Sort the Software',teachAt:[0],heading:'Application software or system software?',tip:'Application software does a particular task for the user (word processing, spreadsheets). System software (the operating system and utility programs) runs the hardware.',
 choices:[{key:'app',label:'📄 Application software'},{key:'sys',label:'⚙️ System software'}],
 tasks:[
  {type:'classify',text:'A word-processing program',answer:'app',src:'TB p9',feedback:'Application software: it does a particular task for the end user.'},
  {type:'classify',text:'A spreadsheet program',answer:'app',src:'TB p9',feedback:'Application software: it does a particular task for the end user.'},
  {type:'classify',text:'The operating system',answer:'sys',src:'TB p9',feedback:'System software includes the operating system.'},
  {type:'classify',text:'Utility programs',answer:'sys',src:'TB p9',feedback:'System software includes the operating system and utility programs.'},
  {type:'classify',text:'"Is the interface between computer hardware and user application programs"',answer:'sys',src:'TB p9',feedback:'This is the textbook definition of system software.'},
  {type:'classify',text:'"Enables the computer to do a particular task, such as word processing"',answer:'app',src:'TB p9',feedback:'This is the textbook definition of application software.'},
  {type:'classify',text:'"Enables the computer to operate its hardware and applications software"',answer:'sys',src:'TB p9',feedback:'System software lets the computer operate its hardware and run applications.'},
  {type:'classify',text:'"Programs designed for an end user to do a particular task"',answer:'app',src:'TB p9',feedback:'This is the glossary definition of application software.'}
 ]},
{title:'Who Gets What?',teachAt:[1,2,3],heading:'Which resource is the operating system managing?',tip:'Memory: main memory is organised between programs and data (locate free space → allocate it → transfer back out). Storage: data and files on devices like a hard drive. Processing time: time slices, shared out by priority.',
 choices:[{key:'mem',label:'🧠 Memory'},{key:'sto',label:'🗄️ Storage'},{key:'cpu',label:'⏱️ Processing time'}],
 tasks:[
  {type:'classify',text:'Organises the use of main memory between programs and data files as they are transferred to and from the hard disc',answer:'mem',src:'TB p9',feedback:'Allocating memory.'},
  {type:'classify',text:'A free space in RAM is located for the data',answer:'mem',src:'PP 2018 Q5(b)(ii)',feedback:'Step 1 of allocating memory.'},
  {type:'classify',text:'The program is transferred back out of main memory when it is no longer required',answer:'mem',src:'PP 2018 Q5(b)(ii)',feedback:'Step 3 of allocating memory.'},
  {type:'classify',text:'Manages the storage of data and files on external devices, such as a hard drive',answer:'sto',src:'TB p9',feedback:'Storage.'},
  {type:'classify',text:'Divides the time into a number of time slices',answer:'cpu',src:'TB p9',feedback:'Processing time is divided into time slices.'},
  {type:'classify',text:'Gives each task a number of time slices, depending on its priority',answer:'cpu',src:'TB p9',feedback:'Processing time: each task is allocated a number of time slices, depending on its priority.'},
  {type:'classify',text:'Allocates processing time between the programs that are currently in use',answer:'cpu',src:'TB p9',feedback:'Processing time.'}
 ]},
{title:'Exam Room',heading:'Real CCEA exam questions',keepOrder:true,teachAt:[4],boss:{icon:'🖥️',name:'The Rogue Kernel'},tip:'Learn the three memory-allocation steps, the 2025 OS sentence (software / manage / resources / interface), and the word "booting".',
 tasks:[PP.os2018b2,PP.os2018b1,PP.os2023b,PP.os2025a,PP.os2025b,PP.os2024]}
]};
