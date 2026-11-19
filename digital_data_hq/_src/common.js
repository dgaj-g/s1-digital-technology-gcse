/* Shared mini-game kit for the HQ topic activities (Digital Data HQ).
   Uses the engine's helpers only ($, say, sfx, mascot, musBtn, startMusic, stopMusic, shuffle, shakeScreen).
   Nothing here touches the page at load time, so the build's level gate can run it in node. */
let GM=null;
globalThis.simMusicOn=()=>!!(GM&&GM.state!=='end'&&$('gm'));
function gmOpen(area,o){
  if(GM&&GM.timer)clearInterval(GM.timer);
  GM={...o,stage:0,state:'play',lives:o.lives??3,maxLives:o.lives??3};
  area.innerHTML=`<div class="gm" id="gm"><div class="arena-grid"></div><div class="vs-head">${musBtn()}<span class="vs-title">${o.icon} ${o.title}</span>${mascot(o.bot||'🤖')}</div>
<div class="gm-bar"><div class="gm-stages" id="gmStages"></div><div class="gm-lives" id="gmLives" aria-label="Lives"></div></div>
<div id="gmMain"></div><div id="gmMsg" aria-live="polite"></div></div>`;
  gmStage(0);gmLives();startMusic();
}
/* the stages are always shown, and the current one is named */
function gmStage(i){
  GM.stage=i;const s=GM.stages||[];
  $('gmStages').innerHTML=s.length>1?s.map((n,k)=>k===i?`<span class="on">Stage ${k+1} of ${s.length}: ${n}</span>`:`<span class="${k<i?'done':''}">${k<i?'✓ ':''}${n}</span>`).join(''):'';
}
function gmLives(){
  const el=$('gmLives');if(!el)return;
  el.innerHTML=GM.maxLives?`<span class="gm-lab">Lives</span>${'❤️'.repeat(Math.max(0,GM.lives))}${'🖤'.repeat(GM.maxLives-Math.max(0,GM.lives))}`:'';
}
/* lose a life; returns true when none are left */
function gmLose(){GM.lives--;gmLives();sfx('bad');shakeScreen();return GM.lives<=0;}
function gmMsg(html,cls){$('gmMsg').innerHTML=html?`<div class="feedback-box ${cls||''}">${html}</div>`:'';if(html)ddSee($('gmMsg'));}
function gmGo(label,fn,cls){
  $('gmMsg').insertAdjacentHTML('beforeend',`<button class="btn ${cls||'btn-primary'} next-btn" id="goBtn">${label}</button>`);
  $('goBtn').onclick=fn;$('goBtn').focus({preventScroll:true});ddSee($('gmMsg'));
}
function ddSee(el){if(!el||!el.getBoundingClientRect)return;const r=el.getBoundingClientRect(),vh=window.innerHeight||document.documentElement.clientHeight;if(r.bottom>vh-8)window.scrollBy({top:Math.min(r.bottom-vh+14,Math.max(0,r.top-8)),behavior:'smooth'});}
function gmBanner(head,text,btn,fn){
  GM.state='banner';gmMsg('');
  $('gmMain').innerHTML=`<div class="vs-banner"><div class="vs-bh">${head}</div><p>${text}</p><button class="btn btn-primary" id="goBtn">${btn}</button></div>`;
  $('goBtn').onclick=()=>{GM.state='play';fn();};$('goBtn').focus({preventScroll:true});
}
/* finish the mini-game: stars 0 = not passed (the engine asks for another go) */
function gmEnd(st,head,text){
  if(GM.timer)clearInterval(GM.timer);GM.state='end';stopMusic();gmMsg('');
  sfx(st>0?'win':'over');say(st>0?'Done! 🎉':'Oh no! 😬');
  $('gmMain').innerHTML=`<div class="vs-banner"><div class="vs-bh">${head}</div><p>${text}</p><div class="stars-big">${'★'.repeat(st)}${'☆'.repeat(3-st)}</div><button class="btn btn-success" id="goBtn">See level result →</button></div>`;
  const fin=GM.finish;$('goBtn').onclick=()=>{GM=null;fin(0,st);};$('goBtn').focus({preventScroll:true});
}
function gmStars(livesLeft,max){return livesLeft>=max?3:livesLeft>=max-1?2:livesLeft>0?1:0;}
/* a countdown bar inside el; calls out() when time runs out */
function gmTimer(el,secs,out){
  if(GM.timer)clearInterval(GM.timer);
  el.innerHTML='<div class="vs-timer"><div></div></div>';const bar=el.querySelector('.vs-timer div');
  const end=Date.now()+secs*1000;
  GM.timer=setInterval(()=>{
    if(!GM){return;}
    const left=end-Date.now();bar.style.width=Math.max(0,left/(secs*10))+'%';bar.classList.toggle('low',left<secs*300);
    if(left<=0){clearInterval(GM.timer);GM.timer=null;out();}
  },100);
}
function gmStop(){if(GM&&GM.timer){clearInterval(GM.timer);GM.timer=null;}}
function gmSel(id,opts,val){return `<select class="gm-sel" id="${id}">${opts.map(o=>{const [v,l]=Array.isArray(o)?o:[o,o];return `<option value="${v}"${v===val?' selected':''}>${l}</option>`;}).join('')}</select>`;}
function gmShuffle(a){const r=[...a];for(let i=r.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[r[i],r[j]]=[r[j],r[i]];}return r;}
/* exam rooms draw a fresh set of real questions each time the page opens: [[pool,n],…] */
/* ---------- Digital Data HQ kit: one-question helpers shared by the five mini-games ---------- */
const ddFmt=n=>Number(n).toLocaleString('en-GB');
const ddNum=s=>Number(String(s).replace(/[,\s]/g,''));
const ddPick=(a,n)=>gmShuffle(a).slice(0,n);
/* a question answered with one of several buttons. o={q,panel,opts:[{label,ok,why}],why,next,lost:[head,text],after}
   A wrong answer costs a life, shows the reason, marks the right button, and the game moves on. */
function ddAsk(o){
  GM.state='play';gmMsg('');
  $('gmMain').innerHTML=`<div class="gm-q">${o.q}</div>${o.panel?`<div class="gm-panel">${o.panel}</div>`:''}<div class="mcq-list dd-opts${o.row?' dd-side':''}" id="ddOpts">${o.opts.map((p,i)=>`<button class="mcq-btn" data-i="${i}">${p.label}</button>`).join('')}</div>`;
  if(o.after)o.after();
  const bs=[...$('ddOpts').querySelectorAll('button')];
  bs.forEach(b=>b.onclick=()=>{
    if(GM.state!=='play')return;GM.state='fb';
    const p=o.opts[+b.dataset.i];
    bs.forEach((x,i)=>{x.disabled=true;if(o.opts[i].ok&&x!==b)x.classList.add('missed');});
    if(p.ok){b.classList.add('correct');sfx('good');say(o.yay||'Yes! ✅');gmMsg('Right: '+(p.why||o.why),'correct');return gmGo(o.nextLabel||'Next →',o.next);}
    b.classList.add('wrong');const out=gmLose();say(o.boo||'Not that one ❌');gmMsg(((p.why?p.why+' ':'')+(o.why||'')).trim(),'wrong');
    if(out)return gmGo('See what happened →',()=>gmEnd(0,o.lost[0],o.lost[1]));
    gmGo(o.nextLabel||'Next →',o.next);
  });
}
/* a question answered by typing a number. o={q,panel,answer,unit,why,next,lost} */
function ddType(o){
  GM.state='play';gmMsg('');
  $('gmMain').innerHTML=`<div class="gm-q">${o.q}</div>${o.panel?`<div class="gm-panel">${o.panel}</div>`:''}<div class="dd-type"><label for="ddIn">Your answer:</label><input id="ddIn" class="dd-in" type="text" inputmode="numeric" autocomplete="off" spellcheck="false" placeholder="Type a number"><span class="dd-unit">${o.unit}</span><button class="btn btn-primary" id="ddCheck">Check</button></div>`;
  const go=()=>{
    if(GM.state!=='play')return;
    const raw=$('ddIn').value.trim();
    if(!raw||isNaN(ddNum(raw)))return gmMsg('Type a number in the box, then press Check.','part');
    GM.state='fb';$('ddIn').disabled=true;$('ddCheck').disabled=true;
    if(ddNum(raw)===o.answer){$('ddIn').classList.add('ok');sfx('good');say('Yes! ✅');gmMsg('Right: '+o.why,'correct');return gmGo(o.nextLabel||'Next →',o.next);}
    $('ddIn').classList.add('no');const out=gmLose();say('Not quite ❌');gmMsg(`The answer is ${ddFmt(o.answer)} ${o.unit}. ${o.why}`,'wrong');
    if(out)return gmGo('See what happened →',()=>gmEnd(0,o.lost[0],o.lost[1]));
    gmGo(o.nextLabel||'Next →',o.next);
  };
  $('ddCheck').onclick=go;$('ddIn').onkeydown=e=>{if(e.key==='Enter')go();};$('ddIn').focus({preventScroll:true});
}
/* run a list of step functions one after another; each step is called with the function that starts the next */
function ddRun(steps,done){let i=0;const nx=()=>{const s=steps[i++];s?s(nx):done();};nx();}
