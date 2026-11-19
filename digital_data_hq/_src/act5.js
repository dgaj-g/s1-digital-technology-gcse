/* Activity 5 — Format Depot. File formats, what the letters stand for, compression, streaming and buffering, data portability (deck section D). Sources: TB p6, p7, p8; PP 2018 Q1(c), Q4(b); 2019 Q1(b)(c), Q4(a)(b); 2021 Q2(e), Q10(a), Q11; 2022 Q1(e)(f), Q11; 2023 Q2(c)(f); 2024 Q7(a); 2025 Q2(d), Q3; 2026 Q1(e)(g), Q3. */
const NP_NAMES=[
  {abbr:'JPEG',words:['Joint','Photographic','Experts','Group'],extra:['Java','Picture','Pixel','Graphics'],use:'JPEG files support the compression of images.'},
  {abbr:'TIFF',words:['Tagged','Image','File','Format'],extra:['Text','Internet','Folder','Transfer'],use:'TIFF files store bitmapped images.'},
  {abbr:'PNG',words:['Portable','Network','Graphics'],extra:['Picture','Pixel','Group','Photo'],use:'PNG allows data compression of bitmapped graphics.'},
  {abbr:'GIF',words:['Graphics','Interchange','Format'],extra:['Group','Image','File','Internet'],use:'An animated GIF shows a series of GIF images one after the other.'},
  {abbr:'PDF',words:['Portable','Document','Format'],extra:['Printed','Data','File','Public'],use:'A PDF is read only.'},
  {abbr:'RTF',words:['Rich','Text','Format'],extra:['Read','Type','File','Real'],use:'RTF is used for text-based documents such as word processing.'},
  {abbr:'CSV',words:['Comma','Separated','Value'],extra:['Column','Stored','Version','Character'],use:'A CSV file is a text file used by database and spreadsheet applications.'},
  {abbr:'MPEG',words:['Moving','Picture','Experts','Group'],extra:['Photographic','Pixel','Portable','Graphics'],use:'MPEG is a set of standards for compressing digital video.'},
  {abbr:'MIDI',words:['Musical','Instrument','Digital','Interface'],extra:['Media','Internet','Data','Device'],use:'MIDI lets sound samples be interchanged between digital musical instruments.'}];
const NP_LOST=['The depot ran out of lives','Read the lesson on what the letters stand for again, then have another go.'];
let NP=null;
function sim_names(area,finish){
  NP={list:ddPick(NP_NAMES,5)};
  gmOpen(area,{title:'Name Plates',icon:'🏷️',stages:[],lives:3,finish,bot:'🏷️'});
  gmBanner('Make five name plates','Each crate needs a plate that says what its letters stand for. Click the words in the right order. Some of the words do not belong on the plate, and clicking one of those costs a life.','🏷️ Start',()=>npPlate(0));
}
function npPlate(k){
  GM.state='play';gmMsg('');
  const n=NP.list[k],full=n.words.join(' ');let at=0;
  $('gmMain').innerHTML=`<div class="gm-q"><span class="dd-count">Plate ${k+1} of 5</span>What do the letters <b>${n.abbr}</b> stand for? Click the words in order.</div>
<div class="gm-panel"><div class="dd-plate"><b>${n.abbr}</b><div class="dd-slots" id="npSlots">${n.words.map(()=>'<span class="dd-slot"></span>').join('')}</div></div>
<div class="dd-tiles" id="npTiles">${gmShuffle([...n.words,...n.extra]).map(w=>`<button class="dd-tile" data-w="${w}">${w}</button>`).join('')}</div></div>`;
  const slots=$('npSlots').children;
  $('npTiles').querySelectorAll('button').forEach(b=>b.onclick=()=>{
    if(GM.state!=='play'||b.disabled)return;
    const w=b.dataset.w;
    if(w===n.words[at]){
      b.disabled=true;b.classList.add('used');slots[at].textContent=w;slots[at].classList.add('fill');at++;sfx('good');gmMsg('');
      if(at===n.words.length){
        GM.state='fb';say('Plate made! 🏷️');gmMsg(`Right: ${n.abbr} stands for ${full}. ${n.use}`,'correct');
        gmGo(k<4?'Next plate →':'Finish →',()=>k<4?npPlate(k+1):gmEnd(gmStars(GM.lives,3),'Five plates made','Every crate now says what its letters stand for.'));
      }
      return;
    }
    if(n.words.includes(w)){sfx('tick');return gmMsg(`“${w}” is on this plate, but it is not the next word.`,'part');}
    b.disabled=true;b.classList.add('no');
    const out=gmLose();say('Not on this plate ❌');
    if(out){GM.state='fb';gmMsg(`“${w}” is not part of ${n.abbr}. ${n.abbr} stands for ${full}.`,'wrong');return gmGo('See what happened →',()=>gmEnd(0,NP_LOST[0],NP_LOST[1]));}
    gmMsg(`“${w}” is not part of ${n.abbr}. Choose another word.`,'wrong');
  });
}

/* Movie Night: the video downloads at the same speed as it plays, except while the connection is lost */
const MV_T=22,MV_F=20;
const MV_CLIPS=[
  {name:'Cat video',icon:'🐱',make:()=>{const a=gmShuffle([2,3])[0];return [[12,12+a]];}},
  {name:'Match highlights',icon:'⚽',make:()=>{const a=gmShuffle([4,5,6])[0];return [[11,11+a]];}},
  {name:'Film trailer',icon:'🎬',make:()=>{const p=gmShuffle([[2,3],[3,2],[2,4]])[0];return [[11,11+p[0]],[14+p[0],14+p[0]+p[1]]];}}];
const MV_LOST=['Movie night ran out of lives','Read the lesson on streaming and buffering again, then have another go.'];
const mvDown=(t,drops)=>t-drops.reduce((s,d)=>s+Math.max(0,Math.min(t,d[1])-d[0]),0);
const mvSecs=n=>`${n} second${n===1?'':'s'}`;
function sim_stream(area,finish){
  gmOpen(area,{title:'Movie Night',icon:'🍿',stages:['Set the buffer','Quick questions'],lives:3,finish,bot:'🍿'});
  gmBanner('Keep three videos playing','Each video is streamed, so it plays while it downloads. The internet connection will be lost for a few seconds. Choose how many seconds of video to store in the buffer before it starts. Too little and the video stops. Far too much and viewers wait longer than they need to. Both cost a life.','🍿 Start',()=>mvClip(0));
}
function mvClip(k,again){
  gmStage(0);gmStop();GM.state='play';gmMsg('');
  const c=MV_CLIPS[k],drops=again||c.make(),need=drops.reduce((s,d)=>s+d[1]-d[0],0);let B=0;
  $('gmMain').innerHTML=`<div class="gm-q"><span class="dd-count">Video ${k+1} of 3</span>${c.icon} <b>${c.name}.</b> The chart shows when the internet connection will be lost. How many seconds of video should be stored in the <b>buffer</b> before it starts to play?</div>
<div class="gm-panel"><div class="dd-lab">The internet connection over the next ${MV_T} seconds</div>
<div class="dd-net">${drops.map(d=>`<span class="dd-drop" style="left:${d[0]/MV_T*100}%;width:${(d[1]-d[0])/MV_T*100}%">Lost for ${d[1]-d[0]} s</span>`).join('')}<i class="dd-now" id="mvNow"></i></div>
<div class="dd-lab">The video</div>
<div class="dd-film" id="mvFilm"><span class="dd-dl" id="mvDl"></span><span class="dd-seen" id="mvSeen"></span><em id="mvWait" hidden>⏳ Stopped: nothing left in the buffer</em></div>
<div class="dd-key"><span class="k3">Watched</span><span class="k4">Downloaded and waiting in the buffer</span></div>
<div class="dd-read" id="mvR"></div>
<div class="dd-ctl"><span>Buffer</span><div id="mvB">${[0,1,2,3,4,5,6,7,8,9,10].map(n=>`<button class="dd-seg" data-v="${n}">${n} s</button>`).join('')}</div></div>
<div class="gm-btns"><button class="btn btn-primary" id="mvGo">▶ Play</button></div></div>`;
  const segs=[...$('mvB').querySelectorAll('button')];
  const pick=()=>{segs.forEach(b=>{const on=+b.dataset.v===B;b.classList.toggle('on',on);b.setAttribute('aria-pressed',on);});$('mvR').innerHTML=`The video will start when <b>${mvSecs(B)}</b> of it ${B===1?'is':'are'} stored in the buffer.`;};
  segs.forEach(b=>b.onclick=()=>{if(GM.state!=='play')return;B=+b.dataset.v;sfx('tick');pick();});
  pick();
  const show=t=>{
    const d=Math.min(MV_F,mvDown(t,drops)),p=Math.min(d,Math.max(0,t-B));
    $('mvNow').style.left=Math.min(100,t/MV_T*100)+'%';$('mvDl').style.width=d/MV_F*100+'%';$('mvSeen').style.width=p/MV_F*100+'%';
    $('mvR').innerHTML=`Downloaded: ${Math.floor(d)} s of video. Watched: ${Math.floor(p)} s. <b>In the buffer: ${(d-p).toFixed(1)} s.</b>`;
  };
  const miss=msg=>{
    const out=gmLose();GM.state='fb';say(out?'Oh no! 😬':'Try again ❌');gmMsg(msg,'wrong');
    out?gmGo('See what happened →',()=>gmEnd(0,MV_LOST[0],MV_LOST[1])):gmGo('Try this video again →',()=>mvClip(k,drops));
  };
  $('mvGo').onclick=()=>{
    if(GM.state!=='play')return;
    GM.state='run';$('mvGo').disabled=true;segs.forEach(b=>b.disabled=true);gmMsg('');
    let t=0;const end=drops[drops.length-1][1]+1.5;
    const h=setInterval(()=>{
      if(!GM||GM.timer!==h||!$('mvFilm')){clearInterval(h);return;}
      t=Math.round((t+0.1)*10)/10;show(t);
      if(Math.max(0,t-B)>mvDown(t,drops)+1e-6){
        gmStop();$('mvWait').hidden=false;
        return miss(`The video stopped. The connection was lost for ${mvSecs(need)}${drops.length>1?' in all ('+drops.map(d=>d[1]-d[0]).join(' + ')+')':''}, but the buffer held only ${mvSecs(B)} of video.${drops.length>1?' The buffer does not fill up again between the two gaps, because the video downloads only as fast as it plays.':''}`);
      }
      if(t>=end){
        gmStop();
        if(B>need+3)return miss(`The video played without stopping, but viewers had to wait ${mvSecs(B)} before it started. A buffer of ${mvSecs(need)} was enough.`);
        GM.state='fb';sfx('good');say('No stops! 🍿');
        gmMsg(`Right: the buffer held ${mvSecs(B)} of video, enough to cover the ${mvSecs(need)} with no connection.`,'correct');
        gmGo(k<2?'Next video →':'Next: quick questions →',()=>k<2?mvClip(k+1):mvQuiz());
      }
    },30);
    GM.timer=h;
  };
}
function mvQuiz(){
  gmStage(1);gmStop();
  const A=ddPick([
    {q:'What does streaming a video mean?',opts:[['The video can be watched straight away, as it downloads',1],['The whole video is downloaded before any of it can be watched',0],['The video is made smaller by removing some data',0],['The video is changed from analogue to digital',0]],why:'Streaming allows a video to be viewed on a website straight away, without having to wait for the full video to be downloaded.'},
    {q:'What is a buffer?',opts:[['Computer memory that stores part of the video download before it is watched',1],['A file format for compressing video',0],['The number of samples captured each second',0],['A device that changes an analogue signal to digital',0]],why:'A buffer is computer memory used to store a part of the video download before it is watched.'}],1)[0];
  const P=ddPick([
    {q:'Which of these is an example of data portability?',opts:[['Opening a CSV file from a spreadsheet in a database, without typing the data in again',1],['Typing a list of names into a new program by hand',0],['Making a file smaller so that it uploads faster',0],['Watching a video while it downloads',0]],why:'Data portability is the ability to transfer data from one computer to another, or from one software application to another, without having to re-enter the data.'},
    {q:'What makes data portability possible?',opts:[['Using a range of file formats',1],['Using a bigger buffer',0],['Using a higher bit depth',0],['Typing the data in again',0]],why:'Data portability is made possible by using a range of file formats.'}],1)[0];
  const steps=[A,P].map((x,i)=>nx=>ddAsk({q:`<span class="dd-count">Question ${i+1} of 2</span>${x.q}`,opts:gmShuffle(x.opts.map(o=>({label:o[0],ok:!!o[1]}))),why:x.why,lost:MV_LOST,next:nx,nextLabel:i?'Finish →':'Next →'}));
  ddRun(steps,()=>gmEnd(gmStars(GM.lives,3),'Movie night went well','Three videos played, and you answered the questions on streaming and data portability.'));
}

const ACT={
title:'Format Depot',icon:'📦',
intro:'Every file is saved in a format. Your mission: sort the files, learn what the letters stand for, tell lossy from lossless and keep a streamed video playing.',
topics:'File formats and what the letters stand for; lossy and lossless compression; streaming and buffering; data portability',
ranks:['Depot Manager','Format Expert','Depot Trainee','New Starter — revise and retry'],
next:null,
teach:[
{teaches:['formats'],html:`<div class="teach-card"><h3>📦 File formats</h3>
<p>The <span class="term">file format</span> tells you what kind of data a file holds.</p>
<table class="gm-tbl"><tr><th>Kind of file</th><th>Formats</th></tr>
<tr><td>🖼️ Image</td><td>JPEG, TIFF, PNG, PICT, GIF</td></tr>
<tr><td>🔊 Sound</td><td>MP3, WAV, WMA, MIDI</td></tr>
<tr><td>🎬 Video</td><td>MP4, MPEG, AVI</td></tr>
<tr><td>📄 Document or data</td><td>TXT, CSV, RTF, PDF</td></tr></table>
<p style="margin-top:8px;">MP3 compresses sound. MP4 is similar, but it compresses both sound and video. A PDF is read only. A CSV file is a text file used by database and spreadsheet applications.</p>
<div class="tip-box">Exam focus (2019): pick the list with only image formats: TIFF, PNG, GIF, JPEG. Exam focus (2024): MP4 is a suitable format for video tutorials.</div></div>`},
{teaches:['names'],html:`<div class="teach-card"><h3>🏷️ What the letters stand for</h3>
<table class="gm-tbl"><tr><th>Format</th><th>Stands for</th></tr>
<tr><td><b>JPEG</b></td><td>Joint Photographic Experts Group</td></tr>
<tr><td><b>TIFF</b></td><td>Tagged Image File Format</td></tr>
<tr><td><b>PNG</b></td><td>Portable Network Graphics</td></tr>
<tr><td><b>GIF</b></td><td>Graphics Interchange Format</td></tr>
<tr><td><b>PDF</b></td><td>Portable Document Format</td></tr>
<tr><td><b>RTF</b></td><td>Rich Text Format</td></tr>
<tr><td><b>CSV</b></td><td>Comma Separated Value</td></tr>
<tr><td><b>MPEG</b></td><td>Moving Picture Experts Group</td></tr>
<tr><td><b>MIDI</b></td><td>Musical Instrument Digital Interface</td></tr></table>
<div class="tip-box">Exam focus: PNG and JPEG (2018), MPEG (2019), CSV (2021), JPEG and TIFF (2022), PDF and RTF (2026). One mark for each full name.</div></div>`},
{teaches:['compression','lossy','lossless','jpeg-bitmap'],html:`<div class="teach-card"><h3>🗜️ Compression</h3>
<p><span class="term">Data compression</span> reduces the size of a file while keeping the quality of its data. Smaller files upload and download faster.</p>
<table class="gm-tbl"><tr><th>Lossy compression</th><th>Lossless compression</th></tr>
<tr><td>Removes some data, such as reducing the number of colours in an image.</td><td>No data is lost.</td></tr>
<tr><td>Can cause a small reduction in quality.</td><td>Maintains the quality of the file.</td></tr>
<tr><td>Example: JPEG.</td><td>Example: WinZip. The file can be recreated (unzipped) exactly as it was.</td></tr></table>
<p style="margin-top:8px;">JPEG, MP3 and MP4 are compressed formats. A bitmap (BMP) file is not compressed: the colour of every pixel is stored, so the file is bigger.</p>
<div class="tip-box">Exam focus (2023): a file can be fully restored using lossless compression. With lossy, the data discarded can never be recovered.</div></div>`},
{teaches:['streaming','buffer'],html:`<div class="teach-card"><h3>🍿 Streaming and buffering</h3>
<p><span class="term">Streaming</span> allows a video to be viewed on a website straight away, without waiting for the full video to be downloaded. You watch it as it downloads.</p>
<p>A <span class="term">buffer</span> is computer memory used to store a part of the video download before it is watched.</p>
<p>If the connection slows down, the video keeps playing from the buffer.</p>
<div class="tip-box">Exam focus (2022): buffering prevents lag when streaming a video file. Exam focus (2025): an advantage of streaming is that it reduces waiting times for downloads.</div></div>`},
{teaches:['portability'],html:`<div class="teach-card"><h3>🔁 Data portability</h3>
<p><span class="term">Data portability</span> is the ability to transfer data from one computer to another, or from one software application to another, without having to re-enter the data.</p>
<p>This is made possible by using a range of file formats.</p>
<table class="gm-tbl"><tr><th>Example</th></tr>
<tr><td>A list of pupils is saved from a spreadsheet as a CSV file. A database opens the CSV file, so nobody types the list in again.</td></tr></table>
<div class="tip-box">Exam focus (2022 and 2025), two marks: data can be transferred between hardware or applications (1) without having to be entered again (1).</div></div>`}
],
rounds:[
{title:'Sort the Files',teachAt:[0],variant:'belt',heading:'What kind of file is it?',tip:'Image: JPEG, TIFF, PNG, PICT, GIF. Sound: MP3, WAV, WMA, MIDI. Video: MP4, MPEG, AVI. The rest are documents or data.',
 choices:[{key:'i',label:'🖼️ Image'},{key:'s',label:'🔊 Sound'},{key:'v',label:'🎬 Video'},{key:'d',label:'📄 Document or data'}],
 tasks:[
  {type:'classify',text:'JPEG',answer:'i',src:'TB p7',feedback:'JPEG files support the compression of images.'},
  {type:'classify',text:'TIFF',answer:'i',src:'TB p7',feedback:'TIFF files store bitmapped images.'},
  {type:'classify',text:'PNG',answer:'i',src:'TB p7',feedback:'PNG is a format for bitmapped graphics.'},
  {type:'classify',text:'PICT',answer:'i',src:'TB p7',feedback:'PICT is the standard file format for Apple graphics.'},
  {type:'classify',text:'GIF',answer:'i',src:'TB p7',feedback:'GIF is a bitmapped image format.'},
  {type:'classify',text:'MP3',answer:'s',src:'TB p7',feedback:'MP3 is a file format for compressing a sound.'},
  {type:'classify',text:'WAV',answer:'s',src:'TB p8',feedback:'WAV is a standard for storing audio on PCs.'},
  {type:'classify',text:'WMA',answer:'s',src:'TB p8',feedback:'WMA is an audio data compression file format.'},
  {type:'classify',text:'MIDI',answer:'s',src:'TB p7',feedback:'MIDI lets sound samples be interchanged between digital musical instruments.'},
  {type:'classify',text:'MP4',answer:'v',src:'TB p7',feedback:'MP4 compresses both sound and video.'},
  {type:'classify',text:'MPEG',answer:'v',src:'TB p8',feedback:'MPEG is a set of standards for compressing digital video.'},
  {type:'classify',text:'AVI',answer:'v',src:'TB p8',feedback:'AVI is a multimedia file format: it holds audio and video.'},
  {type:'classify',text:'TXT',answer:'d',src:'TB p7',feedback:'TXT is a plain text document with no formatting.'},
  {type:'classify',text:'CSV',answer:'d',src:'TB p7',feedback:'CSV is a text file used by database and spreadsheet applications.'},
  {type:'classify',text:'RTF',answer:'d',src:'TB p7',feedback:'RTF is used for text-based documents such as word processing.'},
  {type:'classify',text:'PDF',answer:'d',src:'TB p8',feedback:'A PDF is a read-only document.'}
 ]},
{title:'Name Plates',teachAt:[1],mode:'sim',sim:'names',heading:'What do the letters stand for?',tip:'Say the name in your head first, then click the words in order.',tasks:[]},
{title:'Lossy or Lossless?',teachAt:[2],variant:'pop',heading:'Which kind of compression is it?',tip:'Lossy: some data is removed for good. Lossless: nothing is lost, and the file can be put back exactly.',
 choices:[{key:'y',label:'✂️ Lossy'},{key:'l',label:'🗜️ Lossless'}],
 tasks:[
  {type:'classify',text:'Removes some data to make the file smaller',answer:'y',src:'TB p8',feedback:'Lossy compression reduces the file size by removing some data.'},
  {type:'classify',text:'Can cause a small reduction in quality',answer:'y',src:'TB p8',feedback:'Removing data can reduce the quality a little.'},
  {type:'classify',text:'JPEG is an example',answer:'y',src:'TB p8',feedback:'JPEG is a lossy compression method.'},
  {type:'classify',text:'Reduces the number of colours used in an image',answer:'y',src:'TB p8',feedback:'This removes data, so it is lossy.'},
  {type:'classify',text:'The data discarded can never be recovered',answer:'y',src:'PP 2023 Q2(f)',feedback:'With lossy compression the removed data is gone for good.'},
  {type:'classify',text:'The file cannot be put back exactly as it was',answer:'y',src:'Practice, TB p8',feedback:'Some data has been removed, so the original cannot be rebuilt.'},
  {type:'classify',text:'No data is lost',answer:'l',src:'TB p8',feedback:'Lossless compression loses no data.'},
  {type:'classify',text:'Maintains the quality of the file',answer:'l',src:'TB p8',feedback:'Lossless compression keeps the quality.'},
  {type:'classify',text:'WinZip is an example',answer:'l',src:'TB p8',feedback:'WinZip uses lossless compression.'},
  {type:'classify',text:'The file can be recreated exactly as it was before',answer:'l',src:'TB p8',feedback:'A lossless file can be unzipped exactly as it was.'},
  {type:'classify',text:'The file can be fully restored to its original state',answer:'l',src:'PP 2023 Q2(f)',feedback:'Lossless compression lets the file be fully restored.'},
  {type:'classify',text:'There is no loss of the original quality',answer:'l',src:'PP 2021 Q10(a)(ii)',feedback:'Lossless means no loss of the original quality.'}
 ]},
{title:'Movie Night',teachAt:[3,4],mode:'sim',sim:'stream',heading:'Set the buffer so the video never stops',tip:'The buffer has to hold enough video to cover every second that the connection is lost.',tasks:[]},
{title:'Exam Room',heading:'Real CCEA exam questions',teachAt:[],boss:{icon:'🗃️',name:'The File Muddle'},tip:'Lossless: fully restored. Lossy: data removed for good. A buffer stores part of the video before it is watched.',
 pool:[[[PP.fm2018bi,PP.fm2019b,PP.fm2019c,PP.fm2021e,PP.fm2022bi,PP.fm2022bii,PP.fm2024aii,PP.fm2025b,PP.fm2026q3],3],
       [[PP.cp2018bii,PP.cp2019ai,PP.cp2021ai,PP.cp2021aii,PP.cp2022e,PP.cp2023f,PP.cp2024ai,PP.cp2026e],3],
       [[PP.st2018c,PP.st2019b,PP.st2021k,PP.st2022f,PP.st2023c,PP.st2025d,PP.st2026g,PP.po2022a,PP.po2025a],2]],tasks:[]}
]};
