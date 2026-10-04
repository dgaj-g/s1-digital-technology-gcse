/* Activity 5 — Exam Arena. Real CCEA Unit 1 Software questions 2018–2025, answers from the mark schemes. */
const ACT={
title:'Exam Arena',icon:'🏆',
intro:'The final test. The questions in this arena are real CCEA GCSE Digital Technology questions on Software, from 2018 to 2025. The answers come straight from the official mark schemes.',
topics:'Real Software questions from the 2018, 2019, 2022, 2023, 2024 and 2025 Unit 1 papers (2021 had no Software questions)',
ranks:['Exam Champion','Exam Ready','Nearly There','Keep Revising — retry the topic activities'],
next:null,
teach:[
{html:`<div class="teach-card"><h3>🏆 How the Arena works</h3><ul>
<li><b>Level 1</b>: system software and the operating system</li>
<li><b>Level 2</b>: modes of processing</li>
<li><b>Level 3</b>: utilities and anti-virus</li></ul>
<div class="highlight">Each question shows its exam year, question number and marks. Questions worth 2–4 marks give you one mark for each correct part, just like the real mark scheme. Every mark is a hit on the boss.</div>
<div class="tip-box">In the real exam you will write these answers yourself. After each question, read the feedback: it uses the exact mark-scheme wording you should learn.</div></div>`}
],
rounds:[
{title:'The Operating System',heading:'System software and the operating system',keepOrder:true,teachAt:[0],boss:{icon:'🖥️',name:'The OS Overlord'},tip:'Revise Activity 1, OS Control Room: resources the OS manages, the memory-allocation steps, booting, GUI.',
 tasks:[PP.os2018b1,PP.os2018b2,PP.os2023b,PP.os2024,PP.os2025a,PP.os2025b]},
{title:'Modes of Processing',heading:'Real-time, batch and multi-user',keepOrder:true,boss:{icon:'⚡',name:'The Mode Master'},tip:'Revise Activity 2, Processing Mode Dispatch: the applications for each mode and how CCEA words each definition.',
 tasks:[PP.mode2018c,PP.mode2022d,PP.mode2023c1,PP.mode2023c2,PP.mode2023q12a]},
{title:'Utilities & Anti-virus',heading:'Utility applications and anti-virus',keepOrder:true,boss:{icon:'🐉',name:'The Utility Dragon'},tip:'Revise Activity 3, Utility Toolkit, and Activity 4, Virus Shield: defrag and task scheduling functions, backup definitions, the role of anti-virus.',
 tasks:[PP.util2018q12,PP.util2019defrag,PP.util2019task,PP.util2022i,PP.util2022b,PP.util2023d,PP.util2023b,PP.av2025c,PP.util2025d]}
]};
