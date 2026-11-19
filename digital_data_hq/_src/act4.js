/* Activity 4 — Sound Desk. Analogue and digital, ADC, sample rate, bit depth, bit rate (deck section C). Sources: TB p7; PP 2019 Q1(j), Q4(c), 2022 Q1(c)(g), 2023 Q2(d)(e), 2024 Q7(b), 2025 Q2(c), 2026 Q2(a)(b). */
const WV_SR=[4,8,16,32,64],WV_BD=[1,2,3,4,6,8];
const WV_BRIEFS=[
  {name:'Voice note',icon:'🎙️',min:60,max:32,text:'It only has to be understood.'},
  {name:'Podcast',icon:'🎧',min:80,max:100,text:'The speech has to be clear.'},
  {name:'Music track',icon:'🎵',min:88,max:200,text:'It needs the best quality of the three.'}];
const WV_SUMS=[[8,8000],[16,8000],[8,11000],[16,44100],[4,2000]];
const WV_LOST=['The session ran out of lives','Read the lessons on sample rate, bit depth and bit rate again, then have another go.'];
/* one second of a slow sound wave, and the recording made from it: a sample in the middle of each time step, rounded to the nearest level */
const wvA=t=>0.62*Math.sin(2*Math.PI*t)+0.3*Math.sin(6*Math.PI*t+1);
function wvQ(t,N,bits){const L=2**bits,ts=(Math.min(N-1,Math.floor(t*N))+0.5)/N,v=Math.max(-1,Math.min(1,wvA(ts)));return Math.round((v+1)/2*(L-1))/(L-1)*2-1;}
function wvMatch(N,bits){let e=0,m=0;const K=4000;for(let k=0;k<K;k++){const t=(k+0.5)/K;e+=Math.abs(wvA(t)-wvQ(t,N,bits));m+=Math.abs(wvA(t));}return Math.max(0,Math.round(100*(1-e/m)));}
let WV=null;
function sim_wave(area,finish){
  WV={sr:4,bd:1,k:0};
  gmOpen(area,{title:'Record the sound',icon:'🎚️',stages:['Sample the wave','Work out the bit rate'],lives:3,finish,bot:'🎚️'});
  gmBanner('Make three recordings','Choose how many samples to take each second and how many bits to use for each sample. The wave is slowed right down so that you can see every sample. Each recording has a quality to reach and a bit rate it must not go over. A recording that misses costs a life.','🎙️ Start',()=>wvBrief(0));
}
function wvDraw(){
  const c=$('wvC');if(!c)return;const x=c.getContext('2d'),W=c.width,H=c.height,Y=v=>H/2-v*(H/2-12),L=2**WV.bd,N=WV.sr;
  x.fillStyle='#0b1634';x.fillRect(0,0,W,H);
  if(L<=16){x.strokeStyle='rgba(255,255,255,.13)';x.lineWidth=1;for(let i=0;i<L;i++){const y=Y(i/(L-1)*2-1);x.beginPath();x.moveTo(0,y);x.lineTo(W,y);x.stroke();}}
  x.strokeStyle='#7fc4ff';x.lineWidth=2.5;x.beginPath();for(let i=0;i<=W;i++){const y=Y(wvA(i/W));i?x.lineTo(i,y):x.moveTo(i,y);}x.stroke();
  x.strokeStyle='#ffcf4d';x.lineWidth=3;x.beginPath();
  for(let i=0;i<N;i++){const y=Y(wvQ((i+.5)/N,N,WV.bd));i?x.lineTo(i*W/N,y):x.moveTo(0,y);x.lineTo((i+1)*W/N,y);}
  x.stroke();
  if(N<=32){x.fillStyle='#ffcf4d';for(let i=0;i<N;i++){x.beginPath();x.arc((i+.5)*W/N,Y(wvQ((i+.5)/N,N,WV.bd)),4,0,7);x.fill();}}
  $('wvS').querySelectorAll('button').forEach(b=>{const on=+b.dataset.v===WV.sr;b.classList.toggle('on',on);b.setAttribute('aria-pressed',on);});
  $('wvB').querySelectorAll('button').forEach(b=>{const on=+b.dataset.v===WV.bd;b.classList.toggle('on',on);b.setAttribute('aria-pressed',on);});
  $('wvR').innerHTML=`${WV.sr} samples each second. ${WV.bd} bit${WV.bd>1?'s':''} for each sample, which gives ${L} levels.<br>Bit rate = bit depth × sample rate = ${WV.bd} × ${WV.sr} = <b>${WV.bd*WV.sr} bits per second</b>`;
}
function wvBrief(k){
  gmStage(0);GM.state='play';gmMsg('');WV.k=k;
  const b=WV_BRIEFS[k];
  $('gmMain').innerHTML=`<div class="gm-q"><span class="dd-count">Recording ${k+1} of 3</span>${b.icon} <b>${b.name}.</b> ${b.text} The recording must match the real sound by <b>at least ${b.min}%</b>, with a bit rate of <b>${b.max} bits per second or less</b>.</div>
<div class="gm-panel"><canvas id="wvC" class="dd-canvas dd-wave" width="640" height="150" role="img" aria-label="The sound wave and the samples taken from it"></canvas>
<div class="dd-key"><span class="k1">Real sound (analogue)</span><span class="k2">Recording (digital samples)</span></div>
<div class="dd-ctl"><span>Sample rate</span><div id="wvS">${WV_SR.map(n=>`<button class="dd-seg" data-v="${n}">${n} Hz</button>`).join('')}</div></div>
<div class="dd-ctl"><span>Bit depth</span><div id="wvB">${WV_BD.map(n=>`<button class="dd-seg" data-v="${n}">${n} bit${n>1?'s':''}</button>`).join('')}</div></div>
<div class="dd-rec"><div class="dd-read" id="wvR"></div><button class="btn btn-primary" id="wvGo">⏺ Record</button></div></div>`;
  $('wvS').querySelectorAll('button').forEach(x=>x.onclick=()=>{if(GM.state!=='play')return;WV.sr=+x.dataset.v;sfx('tick');wvDraw();});
  $('wvB').querySelectorAll('button').forEach(x=>x.onclick=()=>{if(GM.state!=='play')return;WV.bd=+x.dataset.v;sfx('tick');wvDraw();});
  wvDraw();
  $('wvGo').onclick=()=>{
    if(GM.state!=='play')return;
    const m=wvMatch(WV.sr,WV.bd),br=WV.sr*WV.bd;
    if(m>=b.min&&br<=b.max){
      GM.state='fb';$('wvGo').disabled=true;sfx('good');say('Good take! 🎚️');
      gmMsg(`Right: the recording matches the real sound by ${m}%, at ${br} bits per second.`,'correct');
      return gmGo(k<2?'Next recording →':'Next: bit rate →',()=>k<2?wvBrief(k+1):wvSums());
    }
    const out=gmLose();say('Not a good take ❌');
    let msg;
    if(br>b.max)msg=`The bit rate is ${br} bits per second, which is over the limit of ${b.max}. Bit rate = bit depth × sample rate, so lower one of them.`;
    else{
      const si=WV_SR.indexOf(WV.sr),bi=WV_BD.indexOf(WV.bd),ms=si<4?wvMatch(WV_SR[si+1],WV.bd):-1,mb=bi<5?wvMatch(WV.sr,WV_BD[bi+1]):-1;
      msg=`The recording matches the real sound by only ${m}%. It needs ${b.min}%. ${ms>=mb?'Take more samples each second: raise the sample rate.':'Use more bits for each sample: raise the bit depth.'}`;
    }
    gmMsg(msg,'wrong');
    if(out){GM.state='fb';$('wvGo').disabled=true;gmGo('See what happened →',()=>gmEnd(0,WV_LOST[0],WV_LOST[1]));}
  };
}
function wvSums(){
  gmStage(1);
  const steps=ddPick(WV_SUMS,2).map(([bd,sr],k)=>nx=>ddType({q:`<span class="dd-count">Question ${k+1} of 3</span>A recording uses a bit depth of <b>${bd} bits</b> and a sample rate of <b>${ddFmt(sr)} Hz</b>. What is its <b>bit rate</b>?`,
    answer:bd*sr,unit:'bits per second',why:`Bit rate = bit depth × sample rate: ${bd} × ${ddFmt(sr)} = ${ddFmt(bd*sr)}.`,lost:WV_LOST,next:nx}));
  const last=ddPick([
    {q:'The sample rate of a recording is increased. What happens?',opts:[['The quality goes up and the file gets bigger',1],['The quality goes up and the file gets smaller',0],['The quality goes down and the file gets bigger',0],['Nothing changes',0]],why:'More samples each second capture the sound more accurately, so the quality goes up. There is more data to store, so the file gets bigger.'},
    {q:'What does an analogue to digital converter (ADC) do in a sound recording?',opts:[['It samples the sound wave and changes each sample into binary',1],['It makes the sound louder',0],['It stores part of a video before it is watched',0],['It changes binary into a sound wave',0]],why:'A computer can only process and store digital data, so the ADC samples the analogue signal at regular intervals and converts each sample to digital format.'}],1)[0];
  steps.push(nx=>ddAsk({q:`<span class="dd-count">Question 3 of 3</span>${last.q}`,opts:gmShuffle(last.opts.map(o=>({label:o[0],ok:!!o[1]}))),why:last.why,lost:WV_LOST,next:nx,nextLabel:'Finish →'}));
  ddRun(steps,()=>gmEnd(gmStars(GM.lives,3),'Session finished','You made three recordings and worked out their bit rates.'));
}

const ACT={
title:'Sound Desk',icon:'🎚️',
intro:'A computer cannot store a sound wave as it is. Your mission: turn sound into numbers, choosing the sample rate and bit depth that give each recording the quality it needs.',
topics:'Analogue and digital; the ADC; sample rate, bit depth and bit rate',
ranks:['Studio Producer','Sound Engineer','Studio Trainee','New Starter — revise and retry'],
next:{href:'activity5.html',label:'Next: Format Depot'},
teach:[
{teaches:['analogue','adc'],html:`<div class="teach-card"><h3>🎙️ From sound wave to numbers</h3>
<p>Sound is an <span class="term">analogue</span> signal: a continuous, varying signal that represents a physical quantity, such as sound waves or temperature.</p>
<p>A microphone picks up the sound waves. A computer can only process and store <span class="term">digital</span> data, so the signal has to be changed.</p>
<table class="gm-tbl"><tr><th>Step</th><th>What happens</th></tr>
<tr><td>1</td><td>The microphone picks up the sound: an analogue signal.</td></tr>
<tr><td>2</td><td>An <b>analogue to digital converter (ADC)</b> samples the signal at regular time intervals.</td></tr>
<tr><td>3</td><td>Each sample is converted to digital format: binary.</td></tr></table>
<div class="tip-box">Exam focus: “What do the letters ADC stand for?” came up in 2022 and 2023. In 2026, three marks asked why the conversion is needed: it changes sound waves into digital data, a computer can only process and store digital data, and the sound can then be edited and played on digital devices.</div></div>`},
{teaches:['sample-rate','bit-depth'],html:`<div class="teach-card"><h3>📈 Sample rate and bit depth</h3>
<p><span class="term">Sample rate</span> is the number of sound samples captured per second. It is measured in Hertz (Hz).</p>
<p><span class="term">Bit depth</span> is the number of bits used for each sound sample. More bits give more levels for each sample to be stored at.</p>
<table class="gm-tbl"><tr><th>Bit depth</th><th>1 bit</th><th>2 bits</th><th>4 bits</th><th>8 bits</th><th>16 bits</th></tr>
<tr><td><b>Levels</b></td><td>2</td><td>4</td><td>16</td><td>256</td><td>65,536</td></tr></table>
<p style="margin-top:8px;">A higher sample rate and a higher bit depth both make the recording closer to the real sound. Both also make the file bigger.</p>
<div class="tip-box">Exam focus (2023): increasing the sample rate increases the quality of the audio file. Exam focus (2024): bit depth is the number of bits used for each sound sample.</div></div>`},
{teaches:['bit-rate'],html:`<div class="teach-card"><h3>🧮 Bit rate</h3>
<p><span class="term">Bit rate</span> is the quantity of data, measured in bits, that is processed in a given amount of time.</p>
<table class="gm-tbl"><tr><th>Formula</th><th>Example</th></tr>
<tr><td><b>Bit rate = bit depth × sample rate</b></td><td>8 bits × 8,000 Hz = 64,000 bits per second</td></tr></table>
<p style="margin-top:8px;">A higher bit rate means more data is stored for each second of sound, so the sound is captured more accurately and the quality is better.</p>
<div class="tip-box">Exam focus (2025): choose the correct formula for bit rate. It is bit depth × sample rate.</div></div>`}
],
rounds:[
{title:'Analogue or Digital?',teachAt:[0],variant:'fall',heading:'Is this analogue or digital?',tip:'Analogue: a continuous, varying signal, such as a sound wave. Digital: binary, 0s and 1s.',
 choices:[{key:'a',label:'〰️ Analogue'},{key:'d',label:'🔢 Digital'}],
 tasks:[
  {type:'classify',text:'A continuous, varying signal',answer:'a',src:'TB p7',feedback:'An analogue signal varies continuously.'},
  {type:'classify',text:'Sound waves in the air',answer:'a',src:'TB p7',feedback:'A sound wave is an analogue signal.'},
  {type:'classify',text:'The sound a microphone picks up',answer:'a',src:'PP 2019 Q4(c)',feedback:'A microphone picks up sound waves, which are analogue.'},
  {type:'classify',text:'The temperature rising and falling through the day',answer:'a',src:'TB p7',feedback:'Temperature is a physical quantity that varies continuously.'},
  {type:'classify',text:'The signal that goes INTO an ADC',answer:'a',src:'Practice, TB p7',feedback:'An ADC takes an analogue signal in.'},
  {type:'classify',text:'Data stored as 0s and 1s',answer:'d',src:'TB p5',feedback:'Binary data is digital.'},
  {type:'classify',text:'The format a computer system stores data in',answer:'d',src:'PP 2019 Q1(a)',feedback:'Computers store data in digital format.'},
  {type:'classify',text:'The data that comes OUT of an ADC',answer:'d',src:'Practice, TB p7',feedback:'An ADC gives digital data out.'},
  {type:'classify',text:'Samples that have been converted to binary',answer:'d',src:'TB p7',feedback:'Each sample is converted to digital format.'},
  {type:'classify',text:'A sound file saved on a phone',answer:'d',src:'Practice, TB p7',feedback:'A saved file is digital data.'},
  {type:'classify',text:'The only kind of data a computer can process and store',answer:'d',src:'PP 2026 Q2(b)',feedback:'A computer can only process and store digital data.'}
 ]},
{title:'Record the Sound',teachAt:[1,2],mode:'sim',sim:'wave',heading:'Choose the sample rate and bit depth for each recording',tip:'A higher sample rate and a higher bit depth give better quality. Both raise the bit rate: bit depth × sample rate.',tasks:[]},
{title:'Which One Is It?',teachAt:[],variant:'belt',heading:'Sample rate, bit depth or bit rate?',tip:'Sample rate: samples per second. Bit depth: bits for each sample. Bit rate: bits processed in a given time.',
 choices:[{key:'sr',label:'📈 Sample rate'},{key:'bd',label:'📶 Bit depth'},{key:'br',label:'⏱️ Bit rate'}],
 tasks:[
  {type:'classify',text:'The number of sound samples captured per second',answer:'sr',src:'TB p7',feedback:'This is the sample rate.'},
  {type:'classify',text:'Measured in Hertz (Hz)',answer:'sr',src:'TB p7',feedback:'Sample rate is measured in Hertz.'},
  {type:'classify',text:'How often the sound wave is measured',answer:'sr',src:'Practice, TB p7',feedback:'The sample rate says how many times a second a sample is taken.'},
  {type:'classify',text:'Raise this and more samples are taken every second',answer:'sr',src:'Practice, TB p7',feedback:'A higher sample rate means more samples per second.'},
  {type:'classify',text:'The number of bits used for each sound sample',answer:'bd',src:'TB p7',feedback:'This is the bit depth.'},
  {type:'classify',text:'How many bits each sample gets',answer:'bd',src:'PP 2024 Q7(b)',feedback:'Bit depth is the number of bits for each sample.'},
  {type:'classify',text:'Set this to 8 bits and each sample can be one of 256 levels',answer:'bd',src:'Practice, TB p7',feedback:'More bits for each sample give more levels.'},
  {type:'classify',text:'Raise this and each sample is stored more exactly',answer:'bd',src:'Practice, TB p7',feedback:'A higher bit depth gives each sample more levels.'},
  {type:'classify',text:'The quantity of data, in bits, processed in a given amount of time',answer:'br',src:'TB p7',feedback:'This is the bit rate.'},
  {type:'classify',text:'Bit depth × sample rate',answer:'br',src:'PP 2025 Q2(c)',feedback:'This is the formula for bit rate.'},
  {type:'classify',text:'The number of bits processed over a certain period of time',answer:'br',src:'PP 2022 Q1(c)',feedback:'This is the bit rate.'},
  {type:'classify',text:'Measured in bits per second',answer:'br',src:'Practice, TB p7',feedback:'Bit rate is the number of bits in each second of sound.'}
 ]},
{title:'Exam Room',heading:'Real CCEA exam questions',teachAt:[],boss:{icon:'📢',name:'The Feedback Howl'},tip:'ADC: analogue to digital converter. Bit rate = bit depth × sample rate. Higher means better quality.',
 pool:[[[PP.so2019j,PP.so2019c,PP.so2022c,PP.so2022g,PP.so2023d,PP.so2023e,PP.so2024b,PP.so2025c,PP.so2026a,PP.so2026b],6]],tasks:[]}
]};
