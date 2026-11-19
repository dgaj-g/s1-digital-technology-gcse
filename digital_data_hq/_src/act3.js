/* Activity 3 — Photo Lab. Pixels, resolution, file size, bitmap and vector (deck section B). Sources: TB p6; PP 2018 Q4(a), Q4(b)(iii), 2019 Q4(a)(ii)(iii), 2023 Q2(a)(b), 2025 Q2(a)(b), 2026 Q1(h).
   Photos in img/ are public domain (Wikimedia Commons); credits are on index.html. */
const PX_PHOTOS=[
  {file:'ladybird.jpg',name:'Ladybird',opts:['Strawberry','Tomato','Poppy']},
  {file:'sunflower.jpg',name:'Sunflower',opts:['Lemon','Banana','Bee']},
  {file:'squirrel.jpg',name:'Squirrel',opts:['Fox','Tiger','Teddy bear']}];
const PX_LEVELS=[[8,6],[16,12],[32,24],[64,48],[160,120],[320,240]];
const PX_CARD=30; /* kilobytes left on the memory card */
const PX_LOST=['The lab closed early','Read the lessons on pixels, resolution and file size again, then have another go.'];
const pxKB=b=>b<1024?`${ddFmt(b)} bytes`:`${ddFmt(b)} bytes, about ${b/1024<10?(b/1024).toFixed(1):Math.round(b/1024)} KB`;
let PX=null;
function sim_pixels(area,finish){
  PX={photos:ddPick(PX_PHOTOS,2),k:0};
  gmOpen(area,{title:'Zoom in',icon:'📷',stages:['Name the photo','Work out the file size'],lives:3,finish,bot:'📷'});
  gmBanner('Open the photo lab','Two photos have been saved with very few pixels. Add pixels until you can tell what each photo shows, but more pixels means a bigger file, and the memory card is nearly full. Then work out the file size of an image. A wrong answer costs a life.','📷 Start',()=>pxPhoto(0));
}
function pxDraw(){
  const c=$('pxC');if(!c||!PX.img)return;
  const [w,h]=PX.full?[320,240]:PX_LEVELS[PX.lv],o=document.createElement('canvas');o.width=w;o.height=h;
  o.getContext('2d').drawImage(PX.img,0,0,w,h);
  const x=c.getContext('2d');x.imageSmoothingEnabled=false;x.clearRect(0,0,c.width,c.height);x.drawImage(o,0,0,c.width,c.height);
  $('pxR').innerHTML=`<b>${w} × ${h}</b> = ${ddFmt(w*h)} pixels<br>File size: ${pxKB(w*h*3)}`;
}
function pxPhoto(k){
  gmStage(0);GM.state='play';gmMsg('');
  const p=PX.photos[k];PX.k=k;PX.lv=0;PX.full=false;PX.img=null;
  $('gmMain').innerHTML=`<div class="gm-q"><span class="dd-count">Photo ${k+1} of 2</span>What does this photo show? Press <b>More pixels</b> to raise the resolution. The file must fit in the <b>${PX_CARD} KB</b> left on the memory card.</div>
<div class="dd-two dd-two-wide"><div class="gm-panel dd-photo"><canvas id="pxC" class="dd-canvas" width="480" height="360" role="img" aria-label="A photo shown with very few pixels"></canvas></div>
<div class="gm-panel"><div class="dd-read" id="pxR">Loading the photo…</div>
<div class="gm-btns"><button class="btn btn-primary" id="pxMore">➕ More pixels</button></div><div class="vs-h">The photo shows a…</div><div class="mcq-list" id="pxO">${gmShuffle([p.name,...p.opts]).map(n=>`<button class="mcq-btn" data-n="${n}">${n}</button>`).join('')}</div></div></div>`;
  const im=new Image();im.onload=()=>{PX.img=im;pxDraw();};im.onerror=()=>{$('pxR').textContent='The photo did not load. Check the internet connection and reload the page.';};im.src='img/'+p.file;
  $('pxMore').onclick=()=>{
    if(GM.state!=='play'||!PX.img)return;
    const [w,h]=PX_LEVELS[PX.lv+1],kb=w*h*3/1024;
    if(kb>PX_CARD){$('pxMore').disabled=true;return gmMsg(`${w} × ${h} is ${ddFmt(w*h)} pixels, which needs about ${Math.round(kb)} KB. Only ${PX_CARD} KB is left on the card. Name the photo from what you can see.`,'part');}
    PX.lv++;sfx('tick');gmMsg('');pxDraw();
  };
  const bs=[...$('pxO').querySelectorAll('button')];
  bs.forEach(b=>b.onclick=()=>{
    if(GM.state!=='play'||!PX.img)return;
    const [w,h]=PX_LEVELS[PX.lv];
    if(b.dataset.n===p.name){
      GM.state='fb';bs.forEach(x=>x.disabled=true);$('pxMore').disabled=true;b.classList.add('correct');sfx('good');say('Yes! ✅');
      PX.full=true;pxDraw();
      gmMsg(`Right: it is a ${p.name.toLowerCase()}. You named it at ${w} × ${h}, which is ${ddFmt(w*h)} pixels. The photo on screen now is 320 × 240, which is 76,800 pixels: ${ddFmt(76800/(w*h))} times as many, so the file is ${ddFmt(76800/(w*h))} times as big.`,'correct');
      return gmGo(k?'Next: file size →':'Next photo →',()=>k?pxSums():pxPhoto(1));
    }
    b.disabled=true;b.classList.add('wrong');const out=gmLose();say('Not that one ❌');
    gmMsg(`It is not a ${b.dataset.n.toLowerCase()}. With only ${ddFmt(w*h)} pixels the picture has little detail: a higher resolution gives a better quality image.`,'wrong');
    if(out){GM.state='fb';gmGo('See what happened →',()=>gmEnd(0,PX_LOST[0],PX_LOST[1]));}
  });
}
function pxSums(){
  gmStage(1);
  const [w,h]=ddPick([[32,32],[64,32],[64,48],[128,64]],1)[0],px=w*h,by=px*3,kb=by/1024;
  const tbl=n=>`<table class="gm-tbl dd-work"><tr><th>Image</th><td>${w} pixels wide and ${h} pixels high. Each pixel uses 24 bits, which is 3 bytes.</td></tr><tr><th>Pixels</th><td>${n>0?ddFmt(px):'?'}</td></tr><tr><th>Bytes</th><td>${n>1?ddFmt(by):'?'}</td></tr><tr><th>Kilobytes</th><td>?</td></tr></table>`;
  const qs=[
    {q:'How many <b>pixels</b> are in the image?',answer:px,unit:'pixels',why:`Pixels = width × height: ${w} × ${h} = ${ddFmt(px)}.`},
    {q:'Each pixel is stored in 3 bytes. How many <b>bytes</b> does the image need?',answer:by,unit:'bytes',why:`Bytes = pixels × 3: ${ddFmt(px)} × 3 = ${ddFmt(by)}.`},
    {q:'How many <b>kilobytes</b> is that?',answer:kb,unit:'kilobytes',why:`Kilobytes = bytes ÷ 1024: ${ddFmt(by)} ÷ 1024 = ${kb}.`}];
  ddRun(qs.map((x,k)=>nx=>ddType({q:`<span class="dd-count">Step ${k+1} of 3</span>${x.q}`,panel:tbl(k),answer:x.answer,unit:x.unit,why:x.why,lost:PX_LOST,next:nx,nextLabel:k===2?'Finish →':'Next step →'})),
    ()=>gmEnd(gmStars(GM.lives,3),'Photos developed','You saw that more pixels give a better picture and a bigger file, and you worked out a file size.'));
}

/* ---- Stretch test: the same logo as a bitmap and as a vector graphic ---- */
const ST_USES=[
  ['A holiday photograph taken on a phone',false,'A photograph has a different colour at almost every pixel, so it is stored as a bitmap: details about every pixel.'],
  ['A company logo that is printed small on a pen and huge on a lorry',true,'A vector graphic can be stretched to any size without loss of clarity.'],
  ['Which kind stores details about every individual pixel?',false,'A bitmap stores every pixel. That is why its file size can be very large.'],
  ['Which kind is built from lines, curves and shapes?',true,'A vector graphic stores information about the shapes that make up the image.'],
  ['A road sign design that must stay sharp when it is made bigger',true,'A vector graphic can be stretched to any size without loss of clarity.'],
  ['A scanned picture of an old family photo',false,'A scan records the colour of every pixel, so it is a bitmap.']];
const ST_LOST=['The test was stopped','Read the lesson on bitmap and vector graphics again, then have another go.'];
let ST=null;
function stPaint(x,S){
  x.fillStyle='#ffffff';x.fillRect(0,0,S,S);
  x.fillStyle='#1a3a6b';x.beginPath();x.arc(S/2,S/2,S*.44,0,7);x.fill();
  x.strokeStyle='#e4b824';x.lineWidth=S*.03;x.beginPath();x.arc(S/2,S/2,S*.36,0,7);x.stroke();
  x.fillStyle='#e4b824';x.beginPath();
  for(let i=0;i<10;i++){const r=i%2?S*.12:S*.28,a=-Math.PI/2+i*Math.PI/5;x[i?'lineTo':'moveTo'](S/2+r*Math.cos(a),S/2+r*Math.sin(a));}
  x.closePath();x.fill();
}
function stDraw(){
  const z=ST.z,f=(z-1)/7,fx=120,fy=120-64*f;
  ['A','B'].forEach(n=>{
    const c=$('st'+n);if(!c)return;const x=c.getContext('2d');
    x.setTransform(1,0,0,1,0,0);x.clearRect(0,0,240,240);x.setTransform(z,0,0,z,120-z*fx,120-z*fy);
    if(n===ST.vec)stPaint(x,240);else{x.imageSmoothingEnabled=false;x.drawImage(ST.bmp,0,0,240,240);}
  });
  $('stV').textContent=`Stretched to ${z} times the size`;
}
function sim_stretch(area,finish){
  ST={vec:Math.random()<.5?'A':'B',z:1};
  gmOpen(area,{title:'Stretch test',icon:'🔍',stages:['Stretch the logos','Bitmap or vector?'],lives:3,finish,bot:'🔍'});
  gmBanner('Test two logos','A school has saved its logo twice: once as a bitmap and once as a vector graphic. Stretch both logos and work out which is which. Then choose the right kind of graphic for two jobs. A wrong answer costs a life.','🔍 Start',stLogos);
}
function stLogos(){
  gmStage(0);GM.state='play';gmMsg('');ST.z=1;
  ST.bmp=document.createElement('canvas');ST.bmp.width=ST.bmp.height=120;stPaint(ST.bmp.getContext('2d'),120);
  $('gmMain').innerHTML=`<div class="gm-q">Drag the slider to stretch both logos. Which logo is the <b>vector graphic</b>?</div>
<div class="gm-panel"><div class="dd-logos"><figure><canvas id="stA" class="dd-canvas" width="240" height="240" style="width:190px" role="img" aria-label="Logo A"></canvas><figcaption>Logo A</figcaption></figure><figure><canvas id="stB" class="dd-canvas" width="240" height="240" style="width:190px" role="img" aria-label="Logo B"></canvas><figcaption>Logo B</figcaption></figure></div>
<div class="dd-slide"><label for="stZ">Stretch</label><input type="range" id="stZ" min="1" max="8" step="0.5" value="1"><span id="stV"></span></div></div>
<div class="mcq-list dd-opts dd-side" id="stO"><button class="mcq-btn" data-n="A">Logo A is the vector graphic</button><button class="mcq-btn" data-n="B">Logo B is the vector graphic</button></div>`;
  stDraw();$('stZ').oninput=e=>{ST.z=+e.target.value;stDraw();};
  const bs=[...$('stO').querySelectorAll('button')];
  bs.forEach(b=>b.onclick=()=>{
    if(GM.state!=='play')return;GM.state='fb';
    bs.forEach(x=>{x.disabled=true;if(x.dataset.n===ST.vec&&x!==b)x.classList.add('missed');});
    const bm=ST.vec==='A'?'B':'A';
    if(ST.z<6){ST.z=6;$('stZ').value=6;stDraw();}
    const why=`Logo ${ST.vec} stays sharp at any size, because a vector graphic stores the shapes that make up the image. Logo ${bm} is the bitmap: it stores every pixel, so stretching it only makes the pixels bigger.`;
    if(b.dataset.n===ST.vec){b.classList.add('correct');sfx('good');say('Spot on! 🔍');gmMsg('Right: '+why,'correct');return gmGo('Next →',stUses);}
    b.classList.add('wrong');const out=gmLose();say('Look again ❌');gmMsg(why,'wrong');
    if(out)return gmGo('See what happened →',()=>gmEnd(0,ST_LOST[0],ST_LOST[1]));
    gmGo('Next →',stUses);
  });
}
function stUses(){
  gmStage(1);
  const qs=ddPick(ST_USES.filter(u=>u[1]),1).concat(ddPick(ST_USES.filter(u=>!u[1]),1));
  ddRun(gmShuffle(qs).map((u,k)=>nx=>ddAsk({q:`<span class="dd-count">Question ${k+1} of 2</span>${u[0].endsWith('?')?u[0]:`Bitmap or vector: which is the better choice for this?<br><b>${u[0]}</b>`}`,row:true,
    opts:[{label:'🧱 Bitmap',ok:!u[1]},{label:'📐 Vector',ok:u[1]}],why:u[2],lost:ST_LOST,next:nx,nextLabel:k?'Finish →':'Next →'})),
    ()=>gmEnd(gmStars(GM.lives,3),'Test passed','You told a vector graphic from a bitmap and chose the right kind for each job.'));
}

const ACT={
title:'Photo Lab',icon:'📷',
intro:'Every digital picture is made of pixels. Your mission: see what resolution does to a photo and to its file size, then tell bitmap graphics from vector graphics.',
topics:'Pixels and resolution; image file size; bitmap and vector graphics',
ranks:['Lab Director','Senior Editor','Lab Trainee','New Starter — revise and retry'],
next:{href:'activity4.html',label:'Next: Sound Desk'},
teach:[
{teaches:['pixel','resolution','dpi'],html:`<div class="teach-card"><h3>🟦 Pixels and resolution</h3>
<p>A <span class="term">pixel</span> is the smallest unit of a digital image that can be displayed and edited. Each pixel can have its own colour, and it is stored as a series of binary digits. Put the pixels together and they make the complete image.</p>
<p><span class="term">Resolution</span> describes the quality of an image: the number of pixels in it.</p>
<table class="gm-tbl"><tr><th>Resolution</th><th>Quality</th><th>File size</th></tr>
<tr><td>Low: few pixels</td><td>Poor: the picture looks blocky</td><td>Small</td></tr>
<tr><td>High: many pixels</td><td>Good: the picture is sharp</td><td>Large</td></tr></table>
<p style="margin-top:8px;">Resolution can be measured in <span class="term">dpi</span>, which stands for dots per inch.</p>
<div class="tip-box">Exam focus: “Explain the term resolution” was worth two marks in 2018 and in 2019. Say it is the quality of the image, or the number of pixels, and then say that more pixels give better quality.</div></div>`},
{teaches:['file-size'],html:`<div class="teach-card"><h3>🧮 Working out the file size of an image</h3>
<p>A typical JPEG image uses <span class="term">24 bits</span> to store a pixel. 24 bits is 3 bytes.</p>
<table class="gm-tbl"><tr><th>Step</th><th>Sum</th><th>An image 64 pixels wide, 16 pixels high</th></tr>
<tr><td>1. Pixels</td><td>width × height</td><td>64 × 16 = 1024 pixels</td></tr>
<tr><td>2. Bytes</td><td>pixels × 3</td><td>1024 × 3 = 3072 bytes</td></tr>
<tr><td>3. Kilobytes</td><td>bytes ÷ 1024</td><td>3072 ÷ 1024 = 3 kilobytes</td></tr></table>
<p style="margin-top:8px;">A higher resolution has more pixels to store, so the file size is larger.</p>
<div class="tip-box">Exam focus (2025): a bitmap graphic is 80 pixels wide and 60 pixels high. It has 80 × 60 = 4,800 pixels.</div></div>`},
{teaches:['bitmap','vector'],html:`<div class="teach-card"><h3>🧱 Bitmap and 📐 vector graphics</h3>
<table class="gm-tbl"><tr><th></th><th>Bitmap graphic</th><th>Vector graphic</th></tr>
<tr><td><b>What is stored</b></td><td>Details about every individual pixel: a grid of pixels</td><td>Information about the shapes that make up the image: mathematical objects such as lines, curves and shapes</td></tr>
<tr><td><b>When stretched</b></td><td>The pixels get bigger, so it looks blocky</td><td>No loss of clarity at any size</td></tr>
<tr><td><b>Resolution</b></td><td>The quality depends on the resolution</td><td>The quality does not depend on resolution</td></tr>
<tr><td><b>File size</b></td><td>Can be very large</td><td>No pixel values to store</td></tr>
<tr><td><b>Good for</b></td><td>Photographs</td><td>Logos</td></tr></table>
<div class="tip-box">Exam focus (2023): three true statements about vector graphics. The quality does not depend on resolution. The image can be stretched without loss of clarity. There is no need to store individual pixel values.</div></div>`}
],
rounds:[
{title:'Zoom In',teachAt:[0,1],mode:'sim',sim:'pixels',heading:'Add pixels, name the photo, work out the file size',tip:'More pixels: better quality and a bigger file. File size: width × height, then × 3 for bytes, then ÷ 1024 for kilobytes.',tasks:[]},
{title:'Bitmap or Vector?',teachAt:[2],variant:'pop',heading:'Is this about a bitmap or a vector graphic?',tip:'Bitmap: every pixel is stored. Vector: the shapes are stored, so it stays sharp at any size.',
 choices:[{key:'b',label:'🧱 Bitmap'},{key:'v',label:'📐 Vector'}],
 tasks:[
  {type:'classify',text:'Stores details about every individual pixel',answer:'b',src:'TB p6',feedback:'A bitmap stores every pixel.'},
  {type:'classify',text:'The file size can be very large',answer:'b',src:'TB p6',feedback:'Every pixel has to be stored, so a bitmap file can be very large.'},
  {type:'classify',text:'Uses a grid of pixels',answer:'b',src:'PP 2025 Q2(a)',feedback:'A bitmap is a grid of pixels.'},
  {type:'classify',text:'A photograph taken on a phone',answer:'b',src:'Practice, PP 2025 Q2(a)',feedback:'Photographs are stored as bitmaps.'},
  {type:'classify',text:'Looks blocky when it is stretched',answer:'b',src:'Practice, PP 2023 Q2(a)',feedback:'Stretching a bitmap makes each pixel bigger.'},
  {type:'classify',text:'The quality depends on the resolution',answer:'b',src:'Practice, PP 2023 Q2(a)',feedback:'A bitmap with more pixels has better quality.'},
  {type:'classify',text:'A JPEG photo from a holiday',answer:'b',src:'PP 2019 Q4(a)(i)',feedback:'A JPEG image is a bitmap graphic.'},
  {type:'classify',text:'Stores information about the shapes that make up the image',answer:'v',src:'TB p6',feedback:'A vector graphic stores shapes, not pixels.'},
  {type:'classify',text:'Based on mathematical objects such as lines and curves',answer:'v',src:'TB p6',feedback:'Lines, curves and shapes make up a vector graphic.'},
  {type:'classify',text:'Can be stretched without loss of clarity',answer:'v',src:'PP 2023 Q2(a)',feedback:'A vector graphic stays sharp at any size.'},
  {type:'classify',text:'No need to store individual pixel values',answer:'v',src:'PP 2023 Q2(a)',feedback:'A vector graphic stores shapes instead.'},
  {type:'classify',text:'The quality does not depend on resolution',answer:'v',src:'PP 2023 Q2(a)',feedback:'A vector graphic is redrawn from its shapes at any size.'},
  {type:'classify',text:'Uses mathematical equations',answer:'v',src:'PP 2025 Q2(a)',feedback:'The shapes in a vector graphic are stored as mathematics.'},
  {type:'classify',text:'A logo that must look sharp at any size',answer:'v',src:'Practice, PP 2025 Q2(a)',feedback:'Logos are best stored as vector graphics.'}
 ]},
{title:'Stretch Test',teachAt:[],mode:'sim',sim:'stretch',heading:'Stretch two logos and work out which is which',tip:'Stretch both logos a long way. The one that stays sharp stores shapes, not pixels.',tasks:[]},
{title:'Exam Room',heading:'Real CCEA exam questions',teachAt:[],boss:{icon:'🖼️',name:'The Pixel Blur'},tip:'Pixel: the smallest unit of an image. Resolution: the number of pixels, so the quality. Vector: shapes, sharp at any size.',
 pool:[[[PP.im2018ai,PP.im2018aii,PP.im2018biii,PP.im2019aii,PP.im2019aiii,PP.im2023a,PP.im2023b,PP.im2025a1,PP.im2025a2,PP.im2025a3,PP.im2025b,PP.im2026h],6]],tasks:[]}
]};
