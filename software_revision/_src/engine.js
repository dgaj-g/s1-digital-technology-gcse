/* Software HQ engine v2 — game levels (see S1 Software/GAME_DESIGN.md).
   ACT = {title, icon, intro, topics, ranks:[top,high,mid,low], teach:[{html,init?}], next,
          rounds:[{title, heading, teachAt:[teach indices shown before it], mode?:'sorter'|'boss'|'sim', sim?, boss?:{icon,name}, choices?, keepOrder?, tip, tasks}]}
   A round of classify tasks with shared choices plays as a SORTER (falling cards); any other round plays as a BOSS fight; mode:'sim' calls window['sim_'+r.sim](area, finish).
   Marks (and the rank) come only from sorter and boss levels. Every task carries src (see SOURCE_MAP.md). */
let lvl=0,taskIdx=0,teachStep=0,S=null,B=null,briefOpen=false;
const G={points:0,combo:0,muted:false,lp:[]};
const marks=[],maxMarks=[],stars=[];
function shuffle(a){const r=[...a];for(let i=r.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[r[i],r[j]]=[r[j],r[i]];}return r;}
function $(id){return document.getElementById(id);}
function showScreen(id){document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));$(id).classList.add('active');window.scrollTo({top:0,behavior:'smooth'});}
function setProgress(p){$('progressFill').style.width=p+'%';}
function norm(s){return String(s).trim().toLowerCase();}
const LEVELS=ACT.rounds.map(r=>({...r,
  mode:r.mode||(r.choices&&r.tasks.every(t=>t.type==='classify')?'sorter':'boss'),
  brief:(r.teachAt||[]).map(i=>ACT.teach[i])}));
const MODE_ICON={sorter:'🎮',boss:'👾',sim:'🕹️'};
const MODE_NAME={sorter:'Sorting game',boss:'Boss battle',sim:'Mini-game'};

/* ---------- saved progress (this browser only) ---------- */
const KEY='swhq2_'+ACT.title;
function load(){try{return JSON.parse(localStorage.getItem(KEY))||{};}catch(e){return {};}}
function save(){try{localStorage.setItem(KEY,JSON.stringify(STORE));}catch(e){}}
const STORE=Object.assign({best:0,stars:[],muted:false},load());
G.muted=!!STORE.muted;

/* ---------- sound ---------- */
let AC=null;
const SFX={good:[[660,.07],[880,.1]],combo:[[660,.06],[880,.06],[1175,.12]],bad:[[160,.25,'sawtooth']],hit:[[587,.05],[880,.05],[1319,.14]],
  level:[[523,.1],[659,.1],[784,.1],[1047,.3]],over:[[392,.16],[330,.16],[262,.35]],tick:[[880,.03]],zap:[[740,.03],[1480,.05]],alarm:[[1175,.05],[880,.05],[1175,.06]],scan:[[1047,.025],[1319,.025],[1568,.025],[2093,.04]],win:[[523,.08],[784,.08],[1047,.08],[1568,.35]]};
function sfx(k){
  if(G.muted)return;
  try{AC=AC||new(window.AudioContext||window.webkitAudioContext)();let t=AC.currentTime;
    SFX[k].forEach(([f,d,w])=>{const o=AC.createOscillator(),g=AC.createGain();o.type=w||'triangle';o.frequency.value=f;
      g.gain.setValueAtTime(0.1,t);g.gain.exponentialRampToValueAtTime(0.001,t+d);o.connect(g);g.connect(AC.destination);o.start(t);o.stop(t+d+0.03);t+=d;});}catch(e){}
}
function toggleMute(){G.muted=!G.muted;STORE.muted=G.muted;save();document.querySelectorAll('.mute-btn').forEach(b=>b.textContent=G.muted?'🔇':'🔊');if(G.muted)stopMusic();else if(musicWanted())startMusic();}

/* ---------- points, combo, popups ---------- */
function mult(){return Math.min(4,1+Math.floor(G.combo/3));}
function addPoints(n){G.points+=n;G.lp[lvl]=(G.lp[lvl]||0)+n;hud();}
function hit(){const before=mult();G.combo++;if(mult()>before){sfx('combo');flash(`🔥 Combo ×${mult()}!`);}else sfx('good');}
function miss(){G.combo=0;sfx('bad');hud();}
function popup(text,el,cls){
  const box=(el||$('taskArea')).getBoundingClientRect(),p=document.createElement('div');
  p.className='popup '+(cls||'');p.textContent=text;p.style.left=(box.left+box.width/2)+'px';p.style.top=(box.top+Math.min(box.height/2,120))+'px';
  document.body.appendChild(p);setTimeout(()=>p.remove(),1100);
}
function flash(text){const f=document.createElement('div');f.className='flash-banner';f.textContent=text;document.body.appendChild(f);setTimeout(()=>f.remove(),1300);}
function shakeScreen(){const c=document.querySelector('.container');c.classList.remove('shake');void c.offsetWidth;c.classList.add('shake');}
function starStr(n){return n==null?'☆☆☆':'★'.repeat(n)+'☆'.repeat(3-n);}
function hud(){
  if(!$('hudPts'))return;
  $('hudPts').textContent=G.points.toLocaleString();
  $('hudCombo').textContent=mult()>1?`🔥 ×${mult()}`:'';
  $('hudLives').textContent=S&&S.active?'❤️'.repeat(S.lives)+'🖤'.repeat(3-S.lives):'';
}

/* ---------- welcome + level map ---------- */
function bestStars(i){const a=stars[i],b=STORE.stars[i];return a==null?b:(b==null?a:Math.max(a,b));}
function unlocked(i){return i===0||bestStars(i-1)!=null;}
function renderWelcome(){
  document.title=ACT.title+' — Software HQ';
  stopSorter();
  const next=LEVELS.findIndex((L,i)=>bestStars(i)==null);
  const go=next<0?0:next;
  setProgress(Math.round(LEVELS.filter((L,i)=>bestStars(i)!=null).length/LEVELS.length*100));
  $('welcomeScreen').innerHTML=`<div class="welcome"><div class="welcome-icon">${ACT.icon}</div><h2>${ACT.title}</h2><p>${ACT.intro}</p>
<div class="level-map">${LEVELS.map((L,i)=>{const u=unlocked(i);return `<button class="node ${u?'':'locked'} ${i===go?'current':''}" ${u?`onclick="startLevel(${i})"`:'disabled'}>
<div class="node-icon">${u?MODE_ICON[L.mode]:'🔒'}</div><div class="node-num">Level ${i+1}</div><div class="node-title">${L.title}</div><div class="node-type">${MODE_NAME[L.mode]}</div><div class="node-stars">${starStr(bestStars(i))}</div></button>`;}).join('<div class="node-path"></div>')}</div>
<button class="btn btn-primary btn-big" onclick="startLevel(${go})">${next<0?'▶ Play again from Level 1':next===0?'▶ Start Level 1':'▶ Continue: Level '+(go+1)}</button>
<div class="how-box"><div><b>🎮 Sorting game</b>Cards fall. Tap the right box (or press 1, 2, 3) before the card lands. 3 lives.</div>
<div><b>👾 Boss battle</b>Real CCEA exam questions. Every mark you score hits the boss.</div>
${LEVELS.some(L=>L.mode==='sim')?'<div><b>🕹️ Mini-game</b>Do the computer\'s job yourself.</div>':''}</div>
<div class="best-line">🏆 Best score on this device: <b>${(STORE.best||0).toLocaleString()}</b> &nbsp;·&nbsp; <button class="mute-btn link-btn" onclick="toggleMute()">${G.muted?'🔇':'🔊'}</button> sound</div>
<p class="topics-line"><b>Topics:</b> ${ACT.topics}</p></div>`;
  showScreen('welcomeScreen');
}

/* ---------- briefing ---------- */
function startLevel(i){
  lvl=i;teachStep=0;stopSorter();
  if(LEVELS[i].brief.length){showScreen('teachScreen');renderBrief();}else playLevel();
}
function renderBrief(){
  const L=LEVELS[lvl],s=L.brief[teachStep];
  $('teachLabel').textContent=`Level ${lvl+1}: ${L.title} · Briefing ${teachStep+1} of ${L.brief.length}`;
  $('teachContent').innerHTML=s.html;
  const last=teachStep===L.brief.length-1;
  $('teachNextBtn').textContent=last?`${MODE_ICON[L.mode]} Play Level ${lvl+1} →`:'Next →';
  $('teachNextBtn').className='btn '+(last?'btn-success btn-big':'btn-primary');
  $('teachBackBtn').textContent=teachStep===0?'🗺️ Map':'← Back';
  if(s.init)s.init();
}
function nextTeach(){teachStep++;if(teachStep>=LEVELS[lvl].brief.length)playLevel();else renderBrief();}
function prevTeach(){if(teachStep>0){teachStep--;renderBrief();}else renderWelcome();}
function openBrief(){
  const L=LEVELS[lvl];if(!L.brief.length)return;
  if(S)S.paused=true;briefOpen=true;
  const o=document.createElement('div');o.className='overlay';o.id='briefOverlay';
  o.innerHTML=`<div class="overlay-inner">${L.brief.map(b=>b.html.replace(/ id="/g,' data-oid="')).join('')}<button class="btn btn-primary" onclick="closeBrief()">Back to the game ▶</button></div>`;
  document.body.appendChild(o);
}
function closeBrief(){$('briefOverlay')?.remove();briefOpen=false;if(S&&S.active&&!S.wait){S.paused=false;S.last=performance.now();}}

/* ---------- level screen ---------- */
function playLevel(){
  const L=LEVELS[lvl];
  G.points-=G.lp[lvl]||0;G.lp[lvl]=0;G.combo=0;
  $('teachContent').innerHTML='';
  showScreen('roundScreen');
  $('roundLabel').innerHTML=`<span>${MODE_ICON[L.mode]} Level ${lvl+1} of ${LEVELS.length}: ${L.title}</span>
<span class="hud"><span id="hudLives"></span><span id="hudCombo" class="hud-combo"></span><span class="hud-pts">⚡ <span id="hudPts">0</span></span>
${L.brief.length?'<button class="hud-btn" title="Look at the briefing again" onclick="openBrief()">📖</button>':''}<button class="hud-btn mute-btn" onclick="toggleMute()">${G.muted?'🔇':'🔊'}</button></span>`;
  $('roundHeading').textContent=L.heading;
  setProgress(Math.round(lvl/LEVELS.length*100));
  ({sorter:playSorter,boss:playBoss,sim:playSim})[L.mode](L);
  hud();
}

/* ---------- SORTER: falling cards ----------
   Life: a robot host who reacts (lines are personality only, never facts), cards that fly into the bin you chose,
   an alarm when a card nears the floor, an "on fire" sky at combo ×3+, and the same quiet music as the bosses. */
const SAY={
  start:['Here they come!','Ready? Sort fast!',"Let's go!"],
  good:['Nice sort!','Yes!','Smooth!','Spot on!','Sorted!'],
  fast:['Lightning fast! ⚡','Whoa, speedy!','So quick!'],
  fire:["You're on fire! 🔥",'Unstoppable!','Combo time!'],
  bad:['Oops! Wrong box.','Not that one!','Argh, so close!'],
  slow:['Too slow! It crashed.','It hit the floor!'],
  last:['Careful: last life!']
};
function say(text){const el=$('bossSay');if(!el)return;el.textContent=text;el.classList.remove('show');void el.offsetWidth;el.classList.add('show');}
function sayFrom(pool){say(pool[Math.floor(Math.random()*pool.length)]);}
function cheer(cls){const m=$('mascotBot');if(m)retrigger(m,cls,600);}
function musicWanted(){return !!(($('arena')&&B&&B.left>0)||(S&&S.active)||(window.simMusicOn&&window.simMusicOn()));}
function musBtn(){return `<button class="mus-btn${STORE.music===false?' off':''}" id="musBtn" onclick="toggleMusic()" title="Music on or off" aria-label="Music on or off">🎵</button>`;}
function mascot(icon){return `<div class="mascot"><div class="say" id="bossSay" aria-live="polite"></div><span class="mascot-bot" id="mascotBot">${icon}</span></div>`;}
function flyFixed(el,to,ms,done){ // fly a fixed-position copy of el into the centre of element `to`
  const a=el.getBoundingClientRect(),b=to.getBoundingClientRect(),c=el.cloneNode(true);
  c.removeAttribute('id');c.classList.remove('danger');c.classList.add('flyer');
  Object.assign(c.style,{position:'fixed',left:a.left+'px',top:a.top+'px',width:a.width+'px',margin:'0',transform:'none',zIndex:'900'});
  document.body.appendChild(c);
  if(RM){c.remove();if(done)done();return;}
  c.animate([{transform:'translate(0,0) scale(1) rotate(0deg)',opacity:1},
    {transform:`translate(${b.left+b.width/2-a.left-a.width/2}px,${b.top+b.height/2-a.top-a.height/2}px) scale(0.15) rotate(${Math.random()<0.5?-14:14}deg)`,opacity:0.5}],
    {duration:ms,easing:'cubic-bezier(.5,0,.75,0)'}).onfinish=()=>{c.remove();if(done)done();};
}
function playSorter(L){
  const tasks=shuffle(L.tasks);
  marks[lvl]=0;maxMarks[lvl]=tasks.length;
  S={L,tasks,i:0,lives:3,speed:1,active:true,paused:true,wait:true,card:null,run:0};
  $('taskArea').innerHTML=`<div class="sorter"><div class="sky-head">${musBtn()}<span class="streak" id="streak"></span><span class="sky-count" id="skyCount"></span>${mascot('🤖')}</div>
<div class="sky" id="sky"><div class="arena-grid"></div><div class="floor"></div></div>
<div class="bins bins-${L.choices.length}">${L.choices.map((c,n)=>`<button class="bin" data-k="${c.key}"><span class="key">${n+1}</span>${c.label}</button>`).join('')}</div></div>`;
  document.querySelectorAll('.bin').forEach(b=>b.onclick=()=>sorterAnswer(b.dataset.k,b));
  hud();countdown(3);startMusic();
}
function countdown(n){
  if(!S||!S.active)return;
  const sky=$('sky');if(!sky)return;
  sky.querySelector('.go')?.remove();
  sky.insertAdjacentHTML('beforeend',`<div class="go${n?'':' go-go'}">${n||'GO!'}</div>`);sfx(n?'tick':'zap');
  if(n>0)setTimeout(()=>countdown(n-1),650);else{sayFrom(SAY.start);setTimeout(()=>{sky.querySelector('.go')?.remove();spawnCard();},500);}
}
function spawnCard(){
  if(!S||!S.active)return;
  const t=S.tasks[S.i],sky=$('sky');
  $('skyCount').textContent=`Card ${S.i+1} of ${S.tasks.length}`;
  sky.insertAdjacentHTML('beforeend',`<div class="card-fall" id="fallCard">${t.text}</div>`);
  const words=t.text.split(/\s+/).length;
  S.card=$('fallCard');S.dur=Math.max(6,4.5+words*0.5)*S.speed*1000;S.t=0;S.last=performance.now();S.paused=briefOpen;S.wait=false;S.alarm=false;
  S.raf=requestAnimationFrame(fall);
}
function fall(now){
  if(!S||!S.active||!S.card)return;
  if(!S.paused){S.t+=Math.min(100,now-S.last);}
  S.last=now;
  const sky=$('sky'),maxY=sky.clientHeight-S.card.offsetHeight-14,f=Math.min(1,S.t/S.dur);
  S.card.style.transform=`translate(-50%,${Math.round(f*maxY)}px) rotate(${RM?0:(Math.sin(S.t/350)*1.4).toFixed(2)}deg)`;
  S.card.classList.toggle('danger',f>0.75);
  if(f>0.75&&!S.alarm){S.alarm=true;sfx('alarm');sky.classList.add('alarm');}
  if(f>=1){sorterAnswer(null);return;}
  S.raf=requestAnimationFrame(fall);
}
function streakDraw(){
  const s=$('streak');if(s)s.textContent=S.run>=2?`🔥 ${S.run} in a row`:'';
  const sky=$('sky');if(sky)sky.classList.toggle('fire',mult()>=3);
}
function stopSorter(){if(S){S.active=false;cancelAnimationFrame(S.raf);}S=null;stopMusic();}
function sorterAnswer(k,btn){
  if(!S||!S.active||S.wait||S.paused||!S.card)return;
  cancelAnimationFrame(S.raf);S.wait=true;
  const t=S.tasks[S.i],card=S.card,ok=k===t.answer,sky=$('sky');
  const right=S.L.choices.find(c=>c.key===t.answer);
  const bin=btn||document.querySelector(`.bin[data-k="${t.answer}"]`);
  sky.classList.remove('alarm');
  if(ok){
    marks[lvl]++;const before=mult();hit();S.run++;
    const left=1-S.t/S.dur,pts=100*mult()+Math.round(left*50);addPoints(pts);
    popup('+'+pts,bin,'good');sfx('zap');
    flyFixed(card,bin,320,()=>{retrigger(bin,'gulp',420);sparks(bin,bin.offsetWidth/2,bin.offsetHeight/2,'#69f0ae',12);});
    card.style.visibility='hidden';
    bin.classList.add('bin-good');setTimeout(()=>bin.classList.remove('bin-good'),500);
    cheer('cheer');
    if(mult()>before)sayFrom(SAY.fire);else if(left>0.6)sayFrom(SAY.fast);else if(Math.random()<0.45)sayFrom(SAY.good);
    streakDraw();
    S.speed=Math.max(0.6,S.speed*0.93);
    setTimeout(()=>{card.remove();nextCard();},380);
  }else{
    S.lives--;S.run=0;miss();shakeScreen();card.classList.add('crashed');
    retrigger(sky,'hurt',500);sparks(sky,...centre(card,sky),'#ff5252',14);
    cheer('sad');sayFrom(S.lives===1?SAY.last:(k?SAY.bad:SAY.slow));streakDraw();
    if(btn){btn.classList.add('bin-bad');setTimeout(()=>btn.classList.remove('bin-bad'),600);}
    hud();
    sky.insertAdjacentHTML('beforeend',`<div class="sky-panel bad"><div class="sp-head">${k?'✗ Wrong box!':'⏱ Too slow — it landed!'} ${S.lives?'You lost a life.':''}</div>
<div class="sp-item">“${t.text}”</div><div class="sp-answer">belongs in <b>${right.label}</b></div><div class="sp-fb">${t.feedback||''}</div>
<button class="btn btn-primary" id="goBtn">${S.lives?'Got it ▶':'Continue ▶'}</button></div>`);
    $('goBtn').focus();
    $('goBtn').onclick=()=>{document.querySelector('.sky-panel')?.remove();card.remove();if(S.lives<=0)overload();else nextCard();};
  }
}
function nextCard(){S.i++;S.card=null;if(S.i>=S.tasks.length){S.active=false;stopMusic();say('All sorted! 🎉');cheer('cheer');setTimeout(levelComplete,700);}else spawnCard();}
function overload(){
  sfx('over');S.active=false;stopMusic();
  $('sky').insertAdjacentHTML('beforeend',`<div class="sky-panel over"><div class="big">💥</div><div class="sp-head">System overload! You ran out of lives.</div>
<div class="sp-fb">You sorted ${marks[lvl]} of ${S.tasks.length} cards. Try the level again — the cards come in a new order.</div>
<div class="btn-row-sm"><button class="btn btn-success" id="goBtn" onclick="playLevel()">↻ Retry level</button><button class="btn btn-ghost" onclick="levelComplete()">Carry on →</button></div></div>`);
  $('goBtn').focus();
}
document.addEventListener('keydown',e=>{
  if(briefOpen&&e.key==='Escape'){closeBrief();return;}
  if(!S||!S.active)return;
  const n=parseInt(e.key,10);
  if(n>=1&&n<=S.L.choices.length){e.preventDefault();sorterAnswer(S.L.choices[n-1].key,document.querySelectorAll('.bin')[n-1]);}
});
document.addEventListener('visibilitychange',()=>{if(S&&S.active&&!S.wait&&!briefOpen){S.paused=document.hidden;S.last=performance.now();}});

/* ---------- BOSS: exam questions in an arena ----------
   Every mark fires a bolt at the boss; the HP bar is exactly the marks still needed (hp = 70% of the marks), so it never lies.
   A 0-mark answer lets the boss fire back and knock off a shield (shields only add end-of-battle points).
   Full marks before the charge bar empties = a critical hit: double POINTS, never extra marks.
   Taunts are personality only: they never state a fact. */
const RM=!!(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches);
const TAUNT={
  start:['So you think you can pass the exam?',"Let's see what you really know.","I've beaten better revisers than you!","I'm not going easy on you."],
  hurt:['Argh! Lucky guess!','That one stung!','Impossible!','How did you know that?!','Grr… not bad.'],
  gloat:['Ha! Check the mark scheme!','Too easy!','Missed me!','Is that your final answer? Ha!'],
  rage:["Now I'm ANGRY!",'Enough! Full power!'],
  ko:['Nooo… shutting… down…']
};
function taunt(k){
  const el=$('bossSay');if(!el||!B)return;
  const pool=(B.boss.taunts&&B.boss.taunts[k])||TAUNT[k];
  el.textContent=pool[Math.floor(Math.random()*pool.length)];
  el.classList.remove('show');void el.offsetWidth;el.classList.add('show');
}
/* quiet looping bass while a boss is alive; off when muted or switched off with 🎵 */
let MUS=null;
const BASS=[110,110,131,110,165,110,147,131];
function startMusic(){
  stopMusic();if(G.muted||STORE.music===false)return;
  try{AC=AC||new(window.AudioContext||window.webkitAudioContext)();}catch(e){return;}
  MUS={i:0};
  const step=()=>{
    if(!MUS)return;
    try{const t=AC.currentTime,o=AC.createOscillator(),g=AC.createGain();o.type='square';o.frequency.value=BASS[MUS.i%8]*(MUS.i%16>=8?1.19:1);
      g.gain.setValueAtTime(0.022,t);g.gain.exponentialRampToValueAtTime(0.0008,t+0.15);o.connect(g);g.connect(AC.destination);o.start(t);o.stop(t+0.17);}catch(e){}
    MUS.i++;MUS.t=setTimeout(step,($('arena')&&B&&B.rage)||(S&&S.active&&mult()>=3)?165:225);
  };
  step();
}
function stopMusic(){if(MUS){clearTimeout(MUS.t);MUS=null;}}
function toggleMusic(){
  STORE.music=STORE.music===false;save();
  const b=$('musBtn');if(b)b.classList.toggle('off',STORE.music===false);
  if(STORE.music===false)stopMusic();else if(musicWanted())startMusic();
}
function boom(){
  if(G.muted)return;
  try{AC=AC||new(window.AudioContext||window.webkitAudioContext)();
    const n=Math.floor(AC.sampleRate*0.7),buf=AC.createBuffer(1,n,AC.sampleRate),d=buf.getChannelData(0);
    for(let i=0;i<n;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/n,2.2);
    const s=AC.createBufferSource(),f=AC.createBiquadFilter(),g=AC.createGain();
    f.type='lowpass';f.frequency.value=700;g.gain.value=0.35;s.buffer=buf;s.connect(f);f.connect(g);g.connect(AC.destination);s.start();}catch(e){}
}
function sparks(host,x,y,col,n,big){
  if(RM)return;
  for(let i=0;i<n;i++){
    const s=document.createElement('i');s.className='spark';s.style.background=col;s.style.color=col;s.style.left=x+'px';s.style.top=y+'px';host.appendChild(s);
    const a=Math.random()*Math.PI*2,r=(big?50:22)+Math.random()*(big?110:40);
    s.animate([{transform:'translate(0,0) scale(1)',opacity:1},{transform:`translate(${Math.cos(a)*r}px,${Math.sin(a)*r}px) scale(0)`,opacity:0}],
      {duration:450+Math.random()*350,easing:'cubic-bezier(.2,.8,.3,1)'}).onfinish=()=>s.remove();
  }
}
function centre(el,host){const a=host.getBoundingClientRect(),r=el.getBoundingClientRect();return [r.left-a.left+r.width/2,r.top-a.top+r.height/2];}
function retrigger(el,cls,ms){el.classList.remove(cls);void el.offsetWidth;el.classList.add(cls);clearTimeout(el['_'+cls]);el['_'+cls]=setTimeout(()=>el.classList.remove(cls),ms);}
function shoot(cls,from,to,ms,land){
  const ar=$('arena');if(!ar){land();return;}
  if(RM){land();return;}
  const [x0,y0]=from,[x1,y1]=to,ang=Math.atan2(y1-y0,x1-x0);
  const b=document.createElement('div');b.className=cls;ar.appendChild(b);
  b.animate([{transform:`translate(${x0}px,${y0}px) rotate(${ang}rad) scale(.5)`},{transform:`translate(${x1}px,${y1}px) rotate(${ang}rad) scale(1.15)`}],{duration:ms,easing:'ease-in'})
    .onfinish=()=>{b.remove();land();};
}

function playBoss(L){
  const tasks=L.keepOrder?L.tasks:shuffle(L.tasks);
  const max=tasks.reduce((a,t)=>a+taskMax(t),0),hp=Math.ceil(max*0.7);
  const boss=L.boss||ACT.boss||{icon:'👾',name:'The Exam Boss'};
  marks[lvl]=0;maxMarks[lvl]=max;
  B={L,tasks,max,hp,left:hp,disp:hp,boss,shields:3,rage:false,T:0,t0:0};taskIdx=0;
  $('taskArea').innerHTML=`<div class="arena" id="arena"><div class="arena-grid"></div>
${musBtn()}
<div class="fighter you"><div class="you-icon" id="you">💻</div><div class="you-name">YOU</div><div class="shields" id="shields">${'<span>🛡️</span>'.repeat(3)}</div></div>
<div class="arena-vs">VS</div>
<div class="fighter foe"><div class="say" id="bossSay" aria-live="polite"></div><div class="boss-sprite enter" id="bossAv">${boss.icon}</div>
<div class="boss-name">${boss.name}</div><div class="hp-segs" id="hpSegs">${'<i></i>'.repeat(hp)}</div><div class="hp-text" id="hpText"></div></div></div>
<div class="charge" id="charge"><div class="charge-label">⚡ CRITICAL CHARGE · full marks before it runs out = double points</div><div class="charge-bar"><div class="charge-fill" id="chargeFill"></div></div></div>
<div class="boss-rule" id="bossRule">Every mark you score fires a bolt. Score <b>${hp}</b> of the ${max} marks to defeat the boss.</div><div id="bossTask"></div>`;
  setTimeout(()=>{const a=$('bossAv');if(a)a.classList.remove('enter');},800);
  bossHp();showTask();
  flash(`⚠️ BOSS BATTLE · ${boss.name}`);sfx('level');
  setTimeout(()=>{if($('arena'))taunt('start');},1000);
  startMusic();
}
function bossHp(){
  const segs=$('hpSegs').children;
  for(let i=0;i<segs.length;i++)segs[i].className=i<B.disp?'':'gone';
  $('hpText').textContent=B.disp>0?`${B.disp} hit${B.disp===1?'':'s'} to go`:'DEFEATED!';
}
function showTask(){
  if(taskIdx>=B.tasks.length){bossEnd();return;}
  const t=B.tasks[taskIdx];
  const ref=t.ref?`<div class="exam-badge">📝 Real exam question · CCEA ${t.ref}</div>`:'';
  const m=taskMax(t);
  $('bossTask').innerHTML=`<div class="evidence-card task" data-src="${t.src}"><div class="task-count">Question ${taskIdx+1} of ${B.tasks.length}${t.ref?'':` · ${m} mark${m>1?'s':''}`}</div>${ref}<div id="taskBody"></div><div id="taskFeedback"></div><div id="taskNext"></div></div>`;
  ({classify:renderClassify,mcq:renderMcq,match:renderMatch,fill:renderFill,order:renderOrder,pick:renderPick})[t.type](t,B.L);
  chargeStart(m);
}
function chargeStart(m){
  const f=$('chargeFill');if(!f)return;
  B.T=(15+10*m)*1000;B.t0=performance.now();
  f.style.transition='none';f.style.width='100%';void f.offsetWidth;
  f.style.transition=`width ${B.T/1000}s linear`;f.style.width='0%';
}
function chargeStop(){
  const f=$('chargeFill');if(!f)return false;
  f.style.width=getComputedStyle(f).width;f.style.transition='none';
  return performance.now()-B.t0<B.T;
}
function done(t,got){
  const max=taskMax(t),fast=chargeStop(),crit=got===max&&fast;
  marks[lvl]+=got;
  const dmg=Math.min(got,B.left);B.left-=dmg;
  if(got>0)fireBolts(got,dmg,crit);else counter();
  if(got===max)G.combo++;else G.combo=0;
  const pts=got*150*mult()*(crit?2:1);if(pts)addPoints(pts);hud();
  if(crit)setTimeout(()=>{sfx('combo');popup('⚡ CRITICAL! ×2 points',$('charge'),'good');},250);
  const cls=got===max?'correct':(got>0?'part':'wrong');
  const head=got===max?'✓ Correct!':(got>0?`Partly right — ${got}/${max}.`:'✗ Not quite.');
  $('taskFeedback').innerHTML=`<div class="feedback-box ${cls}">${head} ${t.feedback||''}</div>`;
  const last=taskIdx===B.tasks.length-1;
  $('taskNext').innerHTML=`<button class="btn btn-primary next-btn" onclick="taskIdx++;showTask()">${last?'Finish the battle →':'Next question →'}</button>`;
  $('taskNext').querySelector('button').focus({preventScroll:true});
}
function fireBolts(n,dmg,crit){
  const ar=$('arena');if(!ar)return;
  for(let k=0;k<n;k++)setTimeout(()=>{
    if(!$('arena'))return;
    const from=centre($('you'),ar),to=centre($('bossAv'),ar);to[1]+=(k%2?-14:14)*(n>1?1:0);
    sfx('zap');
    shoot('bolt'+(crit?' crit':''),from,to,320,()=>impact(to,k<dmg,crit,k===n-1));
  },k*180);
}
function impact([x,y],counts,crit,lastBolt){
  const ar=$('arena');if(!ar||!B)return;
  retrigger($('bossAv'),'ouch',450);retrigger(ar,'jolt',300);
  sparks(ar,x,y,crit?'#ffd54f':'#80d8ff',crit?16:10);
  sfx(lastBolt?'hit':'tick');
  const d=document.createElement('div');d.className='dmg-num'+(crit?' crit':'');d.textContent=crit?'CRIT!':'−1';
  d.style.left=x+'px';d.style.top=(y-20)+'px';ar.appendChild(d);setTimeout(()=>d.remove(),900);
  if(counts){
    B.disp--;bossHp();
    if(B.disp===0){ko();return;}
    if(!B.rage&&B.disp<=Math.floor(B.hp/2)){B.rage=true;ar.classList.add('rage');taunt('rage');return;}
  }
  if(lastBolt&&B.disp>0)taunt('hurt');
}
function counter(){
  const ar=$('arena');
  if(!ar||B.disp===0){sfx('bad');shakeScreen();return;}
  taunt('gloat');
  setTimeout(()=>{
    if(!$('arena'))return;
    sfx('bad');
    shoot('orb',centre($('bossAv'),ar),centre($('you'),ar),380,()=>{
      if(!$('arena'))return;
      B.shields=Math.max(0,B.shields-1);
      const sh=$('shields').children;for(let i=0;i<3;i++)sh[i].classList.toggle('lost',i>=B.shields);
      retrigger($('you'),'ouch',450);retrigger(ar,'hurt',500);shakeScreen();
      sparks(ar,...centre($('you'),ar),'#ff5252',12);
    });
  },350);
}
function ko(){
  const ar=$('arena'),av=$('bossAv');
  stopMusic();taunt('ko');ar.classList.remove('rage');
  setTimeout(()=>{
    if(!$('arena'))return;
    boom();sparks(ar,...centre(av,ar),'#ff9800',22,true);sparks(ar,...centre(av,ar),'#ffd54f',14,true);
    av.classList.add('dead');ar.classList.add('ko');shakeScreen();
    setTimeout(()=>{sfx('win');flash(`💥 ${B.boss.name} is defeated!`);},250);
    setTimeout(()=>{if(!$('arena'))return;av.className='boss-sprite grave';av.textContent='💀';},950);
    $('bossRule').innerHTML=taskIdx<B.tasks.length-1||!$('taskNext').innerHTML?'<b>Boss down!</b> Keep going: every mark still counts towards your stars.':'<b>Boss down!</b>';
    $('charge').classList.add('done');
  },650);
}
function bossEnd(){
  stopMusic();chargeStop();
  const won=marks[lvl]>=B.hp,bonus=B.shields*100;
  if(bonus)addPoints(bonus);
  $('charge').classList.add('done');
  $('bossTask').innerHTML=`<div class="boss-end ${won?'won':'lost'}"><div class="big">${won?'🏆':B.boss.icon}</div>
<div class="sp-head">${won?`You defeated ${B.boss.name}!`:`${B.boss.name} survived — you needed ${B.hp - marks[lvl]} more mark${B.hp-marks[lvl]===1?'':'s'}.`}</div>
<div class="shield-bonus">${'🛡️'.repeat(B.shields)||'No shields left'} · ${bonus?`+${bonus} shield bonus points`:'no shield bonus this time'}</div>
<button class="btn btn-primary" id="goBtn" onclick="levelComplete()">See level result →</button></div>`;
  if(!won&&$('arena'))taunt('gloat');
  sfx(won?'win':'over');$('goBtn').focus({preventScroll:true});
}

/* ---------- SIM: bespoke mini-game ---------- */
function playSim(L){
  marks[lvl]=0;maxMarks[lvl]=0;
  window['sim_'+L.sim]($('taskArea'),(pts,st)=>{addPoints(pts);levelComplete(st);});
}

/* ---------- level complete ---------- */
function levelComplete(simStars){
  stopSorter();
  const L=LEVELS[lvl],isSim=L.mode==='sim';
  const pct=isSim?null:(maxMarks[lvl]?marks[lvl]/maxMarks[lvl]:0);
  const st=isSim?simStars:(pct===1?3:pct>=0.7?2:pct>=0.4?1:0);
  stars[lvl]=st;STORE.stars[lvl]=Math.max(STORE.stars[lvl]??0,st);save();
  const last=lvl===LEVELS.length-1;
  setProgress(Math.round((lvl+1)/LEVELS.length*100));
  sfx('level');if(st===3)fireConfetti();
  $('roundHeading').textContent='';
  $('taskArea').innerHTML=`<div class="level-done"><div class="stars-big">${[0,1,2].map(n=>`<span class="${n<st?'on':''}" style="animation-delay:${0.15+n*0.25}s">★</span>`).join('')}</div>
<h3>Level ${lvl+1} complete!</h3>
${isSim?'':`<div class="ld-marks">${marks[lvl]}/${maxMarks[lvl]} correct</div>`}
<div class="ld-pts">⚡ ${G.points.toLocaleString()} points so far</div>
${st<3?`<p class="ld-tip">${st===0?'Have another go at this level before you move on.':'Replay the level to go for ★★★.'}</p>`:''}
<div class="btn-row-sm"><button class="btn btn-ghost" onclick="playLevel()">↻ Replay level</button>
<button class="btn btn-ghost" onclick="renderWelcome()">🗺️ Map</button>
<button class="btn btn-success" id="goBtn" onclick="${last?'showResults()':`startLevel(${lvl+1})`}">${last?'See my results →':`Level ${lvl+2}: ${LEVELS[lvl+1].title} →`}</button></div></div>`;
  $('goBtn').focus({preventScroll:true});
  hud();
}

/* ---------- task renderers (unchanged from v1) ---------- */
function taskMax(t){
  if(t.type==='match')return t.pairs.length;
  if(t.type==='fill')return (t.text.match(/\[\[/g)||[]).length;
  if(t.type==='order')return t.steps.length;
  if(t.type==='pick')return t.need;
  return 1;
}
/* classify: one statement, sort into a category */
function renderClassify(t,r){
  const choices=t.choices||r.choices;
  $('taskBody').innerHTML=`<div class="item-text">${t.text}</div><div class="classify-btns">${choices.map(c=>`<button class="classify-btn" data-k="${c.key}">${c.label}</button>`).join('')}</div>`;
  document.querySelectorAll('#taskBody .classify-btn').forEach(b=>b.onclick=()=>{
    document.querySelectorAll('#taskBody .classify-btn').forEach(x=>{x.disabled=true;if(x.dataset.k===t.answer)x.classList.add('correct');});
    const ok=b.dataset.k===t.answer;if(!ok)b.classList.add('wrong');
    done(t,ok?1:0);
  });
}
/* mcq: options[] with answer index; past-paper A-D keep their order */
function renderMcq(t){
  const letters=t.keepOrder?['A','B','C','D','E']:null;
  const opts=t.options.map((o,i)=>({o,i}));
  const shown=t.keepOrder?opts:shuffle(opts);
  $('taskBody').innerHTML=`<div class="item-text">${t.q}</div><div class="mcq-list">${shown.map((x,n)=>`<button class="mcq-btn" data-i="${x.i}">${letters?'<b>'+letters[n]+'.</b> ':''}${x.o}</button>`).join('')}</div>`;
  document.querySelectorAll('#taskBody .mcq-btn').forEach(b=>b.onclick=()=>{
    document.querySelectorAll('#taskBody .mcq-btn').forEach(x=>{x.disabled=true;if(+x.dataset.i===t.answer)x.classList.add('correct');});
    const ok=+b.dataset.i===t.answer;if(!ok)b.classList.add('wrong');
    done(t,ok?1:0);
  });
}
/* match: click a term then its definition; a pair scores only if matched first time */
function renderMatch(t){
  let sel=null,left=t.pairs.length,got=0;const missed=new Set();
  const defs=shuffle(t.pairs.map((p,i)=>({d:p.def,i})));
  $('taskBody').innerHTML=`<div class="item-text">${t.q||'Click a term, then click the description that matches it.'}</div>
<div class="match-container"><div class="match-col">${t.pairs.map((p,i)=>`<div class="match-term" data-i="${i}">${p.term}</div>`).join('')}</div>
<div class="match-col">${defs.map(x=>`<div class="match-def" data-i="${x.i}">${x.d}</div>`).join('')}</div></div>`;
  document.querySelectorAll('#taskBody .match-term').forEach(el=>el.onclick=()=>{
    if(el.classList.contains('matched'))return;
    document.querySelectorAll('#taskBody .match-term').forEach(x=>x.classList.remove('selected'));
    el.classList.add('selected');sel=+el.dataset.i;
  });
  document.querySelectorAll('#taskBody .match-def').forEach(el=>el.onclick=()=>{
    if(sel===null||el.classList.contains('matched'))return;
    const term=document.querySelector(`#taskBody .match-term[data-i="${sel}"]`);
    if(+el.dataset.i===sel){
      el.classList.add('matched');term.classList.remove('selected');term.classList.add('matched');
      el.innerHTML=`<span class="match-label">${t.pairs[sel].term}</span> ${el.innerHTML}`;
      if(!missed.has(sel))got++;left--;sel=null;
      if(left===0)done(t,got);
    }else{
      missed.add(sel);el.style.animation='shake 0.4s ease';el.style.borderColor='#e74c3c';
      setTimeout(()=>{el.style.animation='';el.style.borderColor='';},500);
    }
  });
}
/* fill: text with [[answer]] blanks, choose from a word bank */
function renderFill(t){
  const answers=[];let n=0;
  const bank=shuffle(t.bank);
  const html=t.text.replace(/\[\[(.+?)\]\]/g,(m,a)=>{answers.push(a);return `<select class="blank" data-n="${n++}"><option value="">— choose —</option>${bank.map(w=>`<option>${w}</option>`).join('')}</select>`;});
  $('taskBody').innerHTML=`<div class="item-text small">${t.q||'Complete the text using the words supplied. Not all words will be used.'}</div>
<div class="word-bank">${t.bank.map(w=>`<span>${w}</span>`).join('')}</div><div class="fill-text">${html}</div>
<button class="btn btn-success" id="checkBtn">Check answers</button>`;
  $('checkBtn').onclick=()=>{
    const sels=[...document.querySelectorAll('#taskBody select.blank')];
    if(sels.some(s=>!s.value)&&!confirm('Some gaps are empty. Check anyway?'))return;
    let got=0;
    sels.forEach((s,i)=>{s.disabled=true;if(norm(s.value)===norm(answers[i])){got++;s.classList.add('correct');}else{s.classList.add('wrong');s.insertAdjacentHTML('afterend',`<span class="fix">${answers[i]}</span>`);}});
    $('checkBtn').remove();done(t,got);
  };
}
/* order: click the steps in the right order */
function renderOrder(t){
  const picked=[];
  $('taskBody').innerHTML=`<div class="item-text small">${t.q}</div><div class="order-pool">${shuffle(t.steps.map((s,i)=>({s,i}))).map(x=>`<button class="order-btn" data-i="${x.i}">${x.s}</button>`).join('')}</div>
<ol class="order-answer" id="orderAns"></ol><div class="btn-row-sm"><button class="btn btn-ghost" id="resetBtn">Reset</button><button class="btn btn-success" id="checkBtn" disabled>Check order</button></div>`;
  const pool=[...document.querySelectorAll('#taskBody .order-btn')];
  pool.forEach(b=>b.onclick=()=>{b.disabled=true;picked.push(+b.dataset.i);$('orderAns').insertAdjacentHTML('beforeend',`<li>${t.steps[+b.dataset.i]}</li>`);$('checkBtn').disabled=picked.length<t.steps.length;});
  $('resetBtn').onclick=()=>{picked.length=0;$('orderAns').innerHTML='';pool.forEach(b=>b.disabled=false);$('checkBtn').disabled=true;};
  $('checkBtn').onclick=()=>{
    let got=0;[...$('orderAns').children].forEach((li,i)=>{if(picked[i]===i){got++;li.classList.add('ok');}else{li.classList.add('bad');li.insertAdjacentHTML('beforeend',` <span class="fix">→ should be: ${t.steps[i]}</span>`);}});
    $('resetBtn').remove();$('checkBtn').remove();done(t,got);
  };
}
/* pick: choose `need` correct answers from a list (each wrong pick cancels a right one) */
function renderPick(t){
  const opts=shuffle(t.options.map((o,i)=>({...o,i})));
  $('taskBody').innerHTML=`<div class="item-text">${t.q}</div><div class="pick-hint">Choose ${t.need}.</div><div class="mcq-list">${opts.map(o=>`<button class="mcq-btn pick" data-i="${o.i}">${o.text}</button>`).join('')}</div><button class="btn btn-success" id="checkBtn" disabled>Check</button>`;
  const btns=[...document.querySelectorAll('#taskBody .pick')];
  btns.forEach(b=>b.onclick=()=>{
    if(!b.classList.contains('sel')&&btns.filter(x=>x.classList.contains('sel')).length>=t.need)return;
    b.classList.toggle('sel');$('checkBtn').disabled=btns.filter(x=>x.classList.contains('sel')).length!==t.need;
  });
  $('checkBtn').onclick=()=>{
    let right=0,wrong=0;
    const right_=btns.filter(b=>b.classList.contains('sel')&&t.options[+b.dataset.i].ok).length;
    btns.forEach(b=>{b.disabled=true;const o=t.options[+b.dataset.i];const s=b.classList.contains('sel');if(o.ok&&(s||right_<t.need))b.classList.add(s?'correct':'missed');if(s&&o.ok)right++;if(s&&!o.ok){wrong++;b.classList.add('wrong');}});
    $('checkBtn').remove();done(t,right);
  };
}

/* ---------- results ---------- */
function showResults(){
  stopSorter();
  const scored=LEVELS.map((L,i)=>i).filter(i=>LEVELS[i].mode!=='sim');
  const played=scored.filter(i=>maxMarks[i]>0&&marks[i]!=null);
  const total=played.reduce((a,i)=>a+marks[i],0),max=played.reduce((a,i)=>a+maxMarks[i],0),pct=max?Math.round(total/max*100):0;
  const [r1,r2,r3,r4]=ACT.ranks;
  const [icon,rank]=pct>=90?['👑',r1]:pct>=70?['⭐',r2]:pct>=50?['🔧',r3]:['🌱',r4];
  const newBest=G.points>(STORE.best||0);if(newBest){STORE.best=G.points;save();}
  setProgress(100);showScreen('resultsScreen');if(pct>=50||newBest)fireConfetti();sfx('win');
  const tips=played.map(i=>marks[i]/maxMarks[i]<0.7?LEVELS[i].tip:null).filter(Boolean);
  const row=(L,i)=>{const st=stars[i]!=null?starStr(stars[i]):'';
    const sc=L.mode==='sim'?(stars[i]!=null?'mini-game':'not played'):(played.includes(i)?`${marks[i]}/${maxMarks[i]}`:'not played');
    return `<div class="breakdown-row"><span>Level ${i+1}: ${L.title}</span><span><span class="row-stars">${st}</span> ${sc}</span></div>`;};
  $('resultsScreen').innerHTML=`<div class="results"><div class="results-icon">${icon}</div><h2>Mission Complete!</h2>
<div class="pts-big">⚡ ${G.points.toLocaleString()} points</div>
${newBest?'<div class="new-best">🏆 New high score on this device!</div>':`<div class="best-line">🏆 Best on this device: ${(STORE.best||0).toLocaleString()}</div>`}
<div class="score-big">${total}/${max} correct (${pct}%)</div><div class="rank">${rank}</div>
<div class="breakdown">${LEVELS.map(row).join('')}<div class="breakdown-row"><span>Total</span><span>${total}/${max}</span></div></div>
${played.length<scored.length?'<p class="ld-tip">Levels you did not play this time are not counted.</p>':''}
${tips.length?`<div class="revision-box"><h4>📝 Go over these again</h4><ul>${tips.map(t=>'<li>'+t+'</li>').join('')}</ul></div>`:''}
<div class="btn-row"><button class="btn btn-ghost" onclick="location.reload()">↻ Play again</button><a href="index.html" class="btn btn-primary" style="text-decoration:none;">← Back to HQ</a>
${ACT.next?`<a href="${ACT.next.href}" class="btn btn-success" style="text-decoration:none;">${ACT.next.label} →</a>`:''}</div></div>`;
}
function fireConfetti(){const c=['#64b5f6','#2ecc71','#f39c12','#e74c3c','#9b59b6','#1abc9c'];for(let i=0;i<40;i++){const d=document.createElement('div');d.className='confetti-piece';d.style.left=Math.random()*100+'%';d.style.top='-10px';d.style.background=c[i%c.length];d.style.width=d.style.height=(6+Math.random()*8)+'px';d.style.animationDelay=Math.random()*1.5+'s';d.style.animationDuration=(2+Math.random()*2)+'s';document.body.appendChild(d);setTimeout(()=>d.remove(),5000);}}

renderWelcome();
