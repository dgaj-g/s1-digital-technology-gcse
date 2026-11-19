/* Activity 1 — Byte Bank. Units of storage (deck section A). Sources: TB p5; PP 2018 Q1(b), 2019 Q1(a), Q2(b), 2021 Q4(a)(b), 2022 Q1(b), 2023 Q1(a), 2024 Q1(a), 2025 Q1(a), Q4(c). */
const LD_UNITS=[['bit','a single 0 or 1'],['nibble','4 bits'],['byte','8 bits'],['kilobyte','1024 bytes'],['megabyte','1024 kilobytes'],['gigabyte','1024 megabytes'],['terabyte','1024 gigabytes']];
const LD_STRIP='<div class="dd-strip"><span>bit</span><span>nibble<i>4 bits</i></span><span>byte<i>8 bits</i></span><span>kilobyte<i>1024 bytes</i></span><span>megabyte<i>1024 kilobytes</i></span><span>gigabyte<i>1024 megabytes</i></span><span>terabyte<i>1024 gigabytes</i></span></div>';
/* stage B questions: each maker returns one typed sum with its working */
const LD_SMALL=[
  ()=>{const n=ddPick([200,300,400,500,700,900],1)[0];return {q:`A file is <b>${ddFmt(n*8)} bits</b> in size. How many <b>bytes</b> are needed to store it?`,answer:n,unit:'bytes',why:`8 bits make 1 byte, so ${ddFmt(n*8)} ÷ 8 = ${n}.`};},
  ()=>{const w=ddPick(['HELLO','NEWRY','BINARY','PIXEL','DATA','COMPUTER'],1)[0];return {q:`Each character takes 1 byte. How many <b>bits</b> are needed to store the word <b>${w}</b>?`,answer:w.length*8,unit:'bits',why:`${w} has ${w.length} characters, so it takes ${w.length} bytes. ${w.length} × 8 = ${w.length*8} bits.`};},
  ()=>{const n=ddPick([3,5,6,7],1)[0];return {q:`How many <b>nibbles</b> are there in <b>${n} bytes</b>?`,answer:n*2,unit:'nibbles',why:`A nibble is 4 bits and a byte is 8 bits, so 2 nibbles make 1 byte. ${n} × 2 = ${n*2}.`};}];
const LD_BIG=[
  ()=>{const n=ddPick([3,4,5,8],1)[0];return {q:`A games console has <b>${ddFmt(n*1024)} megabytes</b> of memory. How many <b>gigabytes</b> is that?`,answer:n,unit:'gigabytes',why:`1024 megabytes make 1 gigabyte, so ${ddFmt(n*1024)} ÷ 1024 = ${n}.`};},
  ()=>{const n=ddPick([2,3,4],1)[0];return {q:`A memory stick holds <b>${n} gigabytes</b>. How many <b>megabytes</b> is that?`,answer:n*1024,unit:'megabytes',why:`1 gigabyte is 1024 megabytes, so ${n} × 1024 = ${ddFmt(n*1024)}.`};},
  ()=>{const n=ddPick([2,3,5],1)[0];return {q:`A photo is <b>${ddFmt(n*1024)} kilobytes</b> in size. How many <b>megabytes</b> is that?`,answer:n,unit:'megabytes',why:`1024 kilobytes make 1 megabyte, so ${ddFmt(n*1024)} ÷ 1024 = ${n}.`};},
  ()=>{const n=ddPick([2,3,4],1)[0];return {q:`A text file is <b>${n} kilobytes</b> in size. How many <b>bytes</b> is that?`,answer:n*1024,unit:'bytes',why:`1 kilobyte is 1024 bytes, so ${n} × 1024 = ${ddFmt(n*1024)}.`};}];
/* stage C: will the file fit? [space, file, fits, working] */
const LD_FIT=[
  ['2 gigabytes','1500 megabytes',true,'2 gigabytes = 2 × 1024 = 2048 megabytes. 1500 megabytes is less than that, so the file fits.'],
  ['1 gigabyte','1100 megabytes',false,'1 gigabyte = 1024 megabytes. 1100 megabytes is more than that, so the file is too big.'],
  ['4 megabytes','3500 kilobytes',true,'4 megabytes = 4 × 1024 = 4096 kilobytes. 3500 kilobytes is less than that, so the file fits.'],
  ['500 kilobytes','1 megabyte',false,'1 megabyte = 1024 kilobytes. That is more than 500 kilobytes, so the file is too big.'],
  ['1 terabyte','900 gigabytes',true,'1 terabyte = 1024 gigabytes. 900 gigabytes is less than that, so the file fits.'],
  ['3 megabytes','3100 kilobytes',false,'3 megabytes = 3 × 1024 = 3072 kilobytes. 3100 kilobytes is more than that, so the file is too big.'],
  ['2000 bytes','2 kilobytes',false,'2 kilobytes = 2 × 1024 = 2048 bytes. That is more than 2000 bytes, so the file is too big.'],
  ['1 kilobyte','1000 bytes',true,'1 kilobyte = 1024 bytes. 1000 bytes is less than that, so the file fits.']];
const LD_LOST=['The bank ran out of lives','Read the lesson on units of storage again, then have another go.'];
let LD=null;
function sim_ladder(area,finish){
  LD={n:0};
  gmOpen(area,{title:'Climb the ladder',icon:'🪜',stages:['Build the ladder','Convert','Will it fit?'],lives:3,finish,bot:'💾'});
  gmBanner('Build the unit ladder','Put the seven units of storage in order, smallest at the bottom. Then use your ladder to convert sizes and to decide whether files will fit. A wrong answer costs a life.','🪜 Start',ldBuild);
}
function ldLadder(n){
  return `<div class="dd-ladder">${LD_UNITS.map((u,i)=>`<div class="dd-rung${i<n?' on':''}"><b>${i<n?u[0]:'?'}</b><span>${i<n?u[1]:''}</span></div>`).join('')}</div>`;
}
function ldBuild(){
  gmStage(0);GM.state='play';gmMsg('');LD.n=0;
  $('gmMain').innerHTML=`<div class="gm-q">Click the units in order, from the <b>smallest</b> to the <b>largest</b>. The ladder fills from the bottom.</div>
<div class="dd-two"><div class="gm-panel" id="ldL">${ldLadder(0)}</div><div class="gm-panel"><div class="vs-h">Units of storage</div><div class="dd-tiles" id="ldT">${gmShuffle(LD_UNITS.map((u,i)=>i)).map(i=>`<button class="dd-tile" data-i="${i}">${LD_UNITS[i][0]}</button>`).join('')}</div></div></div>`;
  $('ldT').querySelectorAll('button').forEach(b=>b.onclick=()=>{
    if(GM.state!=='play')return;
    const i=+b.dataset.i;
    if(i===LD.n){
      LD.n++;b.disabled=true;b.classList.add('used');sfx('tick');$('ldL').innerHTML=ldLadder(LD.n);gmMsg('');
      if(LD.n===LD_UNITS.length){GM.state='fb';sfx('good');say('Ladder built! 🪜');gmMsg('Right: from the kilobyte upwards, each unit is 1024 of the unit below it.','correct');gmGo('Next: convert →',ldConvert);}
      return;
    }
    const out=gmLose();say('Not that one ❌');
    gmMsg(LD.n?`The ${LD_UNITS[i][0]} does not come next. The next unit up is ${LD_UNITS[LD.n][1]}.`:'Start with the smallest unit: a single 0 or 1.','wrong');
    if(out){GM.state='fb';gmGo('See what happened →',()=>gmEnd(0,LD_LOST[0],LD_LOST[1]));}
  });
}
function ldConvert(){
  gmStage(1);
  const qs=[ddPick(LD_SMALL,1)[0](),...ddPick(LD_BIG,2).map(f=>f())];
  ddRun(qs.map((x,k)=>nx=>ddType({q:`<span class="dd-count">Sum ${k+1} of 3</span>${x.q}`,panel:LD_STRIP,answer:x.answer,unit:x.unit,why:x.why,lost:LD_LOST,next:nx,nextLabel:k===2?'Next: will it fit? →':'Next →'})),ldFit);
}
function ldFit(){
  gmStage(2);
  const qs=ddPick(LD_FIT.filter(f=>f[2]),1).concat(ddPick(LD_FIT.filter(f=>!f[2]),1));
  qs.push(ddPick(LD_FIT.filter(f=>!qs.includes(f)),1)[0]);
  ddRun(gmShuffle(qs).map((f,k)=>nx=>ddAsk({q:`<span class="dd-count">File ${k+1} of 3</span>Will the file fit in the space that is left?`,row:true,
    panel:`<div class="dd-fit"><div><span class="dd-big">💾</span><b>Space left</b><em>${f[0]}</em></div><div><span class="dd-big">📁</span><b>File to save</b><em>${f[1]}</em></div></div>`,
    opts:[{label:'✅ Yes, it fits',ok:f[2]},{label:'⛔ No, it is too big',ok:!f[2]}],why:f[3],lost:LD_LOST,next:nx,nextLabel:k===2?'Finish →':'Next →'})),
    ()=>gmEnd(gmStars(GM.lives,3),'Ladder climbed','You put the units in order, converted between them and checked whether files would fit.'));
}

const ACT={
title:'Byte Bank',icon:'💾',
intro:'Everything a computer stores is made of 0s and 1s. Your mission: learn the units that measure storage, from a single bit up to a terabyte, and convert between them.',
topics:'Bits, nibbles and bytes; kilobytes to terabytes; converting between units',
ranks:['Bank Manager','Senior Cashier','Trainee Cashier','New Starter — revise and retry'],
next:{href:'activity2.html',label:'Next: Club Sign-Up'},
teach:[
{teaches:['bit','nibble','byte'],html:`<div class="teach-card"><h3>💡 Bits, nibbles and bytes</h3>
<p>Computers store data in <span class="term">digital</span> binary format: everything is held as 0s and 1s.</p>
<table class="gm-tbl"><tr><th>Unit</th><th>What it is</th></tr>
<tr><td><b>Bit</b></td><td>A <b>B</b>inary dig<b>IT</b>: a single 0 or 1. It is the smallest unit of data.</td></tr>
<tr><td><b>Nibble</b></td><td>4 bits</td></tr>
<tr><td><b>Byte</b></td><td>8 bits. One character, such as a letter or a digit, takes 1 byte.</td></tr></table>
<p style="margin-top:8px;">The word CAT has 3 characters, so it takes 3 bytes. That is 3 × 8 = 24 bits.</p>
<p>To change bits into bytes, divide by 8: 2400 bits ÷ 8 = 300 bytes.</p>
<div class="tip-box">Exam focus: “How many bits are in a nibble?” (2019), “How many bits are there in a byte?” (2021) and “the name given to a group of four bits” (2021) were worth one mark each.</div></div>`},
{teaches:['units'],html:`<div class="teach-card"><h3>🪜 The bigger units</h3>
<p>Bigger units describe the capacity of computer memory and of storage devices. Each one is <span class="term">1024</span> of the unit below it.</p>
<table class="gm-tbl"><tr><th>Unit</th><th>Size</th></tr>
<tr><td><b>Kilobyte (KB)</b></td><td>1024 bytes</td></tr>
<tr><td><b>Megabyte (MB)</b></td><td>1024 kilobytes</td></tr>
<tr><td><b>Gigabyte (GB)</b></td><td>1024 megabytes</td></tr>
<tr><td><b>Terabyte (TB)</b></td><td>1024 gigabytes</td></tr></table>
<p style="margin-top:8px;">To change to a <b>bigger</b> unit, divide by 1024: 3072 megabytes ÷ 1024 = 3 gigabytes.</p>
<p>To change to a <b>smaller</b> unit, multiply by 1024: 2 megabytes × 1024 = 2048 kilobytes.</p>
<div class="tip-box">Exam focus: the papers ask you to put units in order from smallest to largest (2018), to name the largest unit (2025) and to change 2048 megabytes into gigabytes (2025).</div></div>`}
],
rounds:[
{title:'Which Unit?',teachAt:[0,1],variant:'fall',heading:'Which unit of storage is this?',tip:'Bit: one 0 or 1. Nibble: 4 bits. Byte: 8 bits. Kilobyte: 1024 bytes. Megabyte: 1024 kilobytes.',
 choices:[{key:'bit',label:'💡 Bit'},{key:'nib',label:'🍪 Nibble'},{key:'byte',label:'🔤 Byte'},{key:'kb',label:'📄 Kilobyte'},{key:'mb',label:'📷 Megabyte'}],
 tasks:[
  {type:'classify',text:'A single 0 or 1',answer:'bit',src:'TB p5',feedback:'A bit has a value of 0 or 1.'},
  {type:'classify',text:'A Binary digIT',answer:'bit',src:'TB p5',feedback:'Bit is short for Binary digIT.'},
  {type:'classify',text:'The smallest unit of digital data',answer:'bit',src:'PP 2023 Q1(a)',feedback:'Nothing is smaller than one bit.'},
  {type:'classify',text:'4 bits',answer:'nib',src:'TB p5',feedback:'A nibble is 4 bits.'},
  {type:'classify',text:'A group of four bits',answer:'nib',src:'PP 2021 Q4(b)',feedback:'Four bits make a nibble.'},
  {type:'classify',text:'Half of a byte',answer:'nib',src:'TB p5',feedback:'A byte is 8 bits, so half of it is 4 bits: a nibble.'},
  {type:'classify',text:'8 bits',answer:'byte',src:'TB p5',feedback:'A byte is 8 bits.'},
  {type:'classify',text:'One character, such as the letter A',answer:'byte',src:'TB p5',feedback:'A character is stored in 1 byte.'},
  {type:'classify',text:'Two nibbles',answer:'byte',src:'TB p5',feedback:'4 bits + 4 bits = 8 bits, which is one byte.'},
  {type:'classify',text:'Eight binary digits',answer:'byte',src:'PP 2023 Q1(a)',feedback:'A binary digit is a bit, and 8 bits make a byte.'},
  {type:'classify',text:'1024 bytes',answer:'kb',src:'TB p5',feedback:'1 kilobyte = 1024 bytes.'},
  {type:'classify',text:'There are 1024 of these in a megabyte',answer:'kb',src:'TB p5',feedback:'1 megabyte = 1024 kilobytes.'},
  {type:'classify',text:'1024 kilobytes',answer:'mb',src:'TB p5',feedback:'1 megabyte = 1024 kilobytes.'},
  {type:'classify',text:'There are 1024 of these in a gigabyte',answer:'mb',src:'TB p5',feedback:'1 gigabyte = 1024 megabytes.'}
 ]},
{title:'Climb the Ladder',teachAt:[],mode:'sim',sim:'ladder',heading:'Put the units in order, then convert between them',tip:'To change to a bigger unit, divide. To change to a smaller unit, multiply. Use 8 for bits and bytes, and 1024 for the bigger units.',tasks:[]},
{title:'Exam Room',heading:'Real CCEA exam questions',teachAt:[],boss:{icon:'🧮',name:'The Bit Muncher'},tip:'Bits to bytes: divide by 8. Each bigger unit is 1024 of the one below it.',
 pool:[[[PP.u2018b,PP.u2019a,PP.u2019bi,PP.u2019bii,PP.u2021a,PP.u2021b,PP.u2022b,PP.u2023a,PP.u2024a,PP.u2025a,PP.u2025c],6]],tasks:[]}
]};
