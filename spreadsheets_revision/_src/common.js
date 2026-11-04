/* Shared mini-game kit for the HQ topic activities (Databases HQ, Spreadsheets HQ).
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
function gmMsg(html,cls){$('gmMsg').innerHTML=html?`<div class="feedback-box ${cls||''}">${html}</div>`:'';}
function gmGo(label,fn,cls){
  $('gmMsg').insertAdjacentHTML('beforeend',`<button class="btn ${cls||'btn-primary'} next-btn" id="goBtn">${label}</button>`);
  $('goBtn').onclick=fn;$('goBtn').focus({preventScroll:true});
}
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
function gmDraw(groups){return groups.flatMap(([pool,n])=>gmShuffle(pool.filter(Boolean)).slice(0,n));}
/* select a block of cells like a real worksheet: drag across them with a mouse or a finger.
   Cells carry data-c (0 = column A) and data-r (1 = row 1). A tap picks one cell; Shift-click stretches the block.
   With o.twoTap a single tap is held as the first cell and the next tap finishes the block (o.first(p) is told).
   o.expand(R) may grow the block (merged cells); o.move(R) runs while dragging; o.done(R) runs when the block is chosen.
   o.off() returning true ignores input. R = {c1,r1,c2,r2}. */
function gmGridSelect(table,o){
  let a=null,b=null,down=false,moved=false,held=false;
  const cellAt=(x,y)=>{const el=document.elementFromPoint(x,y),td=el&&el.closest('[data-c]');return td&&table.contains(td)?{c:+td.dataset.c,r:+td.dataset.r}:null;};
  const rect=()=>{const R={c1:Math.min(a.c,b.c),c2:Math.max(a.c,b.c),r1:Math.min(a.r,b.r),r2:Math.max(a.r,b.r)};return o.expand?o.expand(R):R;};
  const paint=()=>{const R=a&&b?rect():null;table.querySelectorAll('[data-c]').forEach(td=>{const c=+td.dataset.c,r=+td.dataset.r;td.classList.toggle('sel',!!R&&c>=R.c1&&c<=R.c2&&r>=R.r1&&r<=R.r2);});if(R&&o.move)o.move(R);};
  const press=(p,shift)=>{moved=false;if(a&&(shift||(o.twoTap&&held))){b=p;held=false;moved=true;}else{a=p;b=p;}paint();};
  const release=()=>{if(o.twoTap&&!moved){held=true;if(o.first)o.first(a);return;}held=false;o.done(rect());};
  table.style.touchAction='none';
  table.addEventListener('pointerdown',e=>{if(o.off&&o.off())return;const p=cellAt(e.clientX,e.clientY);if(!p)return;e.preventDefault();down=true;try{table.setPointerCapture(e.pointerId);}catch(_){}press(p,e.shiftKey);});
  table.addEventListener('pointermove',e=>{if(!down)return;const p=cellAt(e.clientX,e.clientY);if(p&&(p.c!==b.c||p.r!==b.r)){b=p;moved=true;held=false;paint();}});
  const up=()=>{if(!down)return;down=false;release();};
  table.addEventListener('pointerup',up);table.addEventListener('pointercancel',up);
  /* keyboard: Enter or Space on a cell button arrives as a click with no pointer */
  const key=(td,shift)=>{if(o.off&&o.off())return;press({c:+td.dataset.c,r:+td.dataset.r},shift);release();};
  table.addEventListener('click',e=>{if(e.detail!==0)return;const td=e.target.closest('[data-c]');if(td&&table.contains(td))key(td,e.shiftKey);});
  table.addEventListener('keydown',e=>{if(e.key!=='Enter'&&e.key!==' ')return;const td=e.target.closest('[data-c]');if(!td||!table.contains(td)||td.tagName==='BUTTON')return;e.preventDefault();key(td,e.shiftKey);});
  return {clear(){a=b=null;held=false;paint();},set(R){a={c:R.c1,r:R.r1};b={c:R.c2,r:R.r2};held=false;paint();}};
}
/* A1-style names: column number 0 = A */
const gmCol=c=>String.fromCharCode(65+c);
const gmRange=R=>R.c1===R.c2&&R.r1===R.r2?gmCol(R.c1)+R.r1:gmCol(R.c1)+R.r1+':'+gmCol(R.c2)+R.r2;
/* a small worksheet calculator for typed formulas: =, numbers, "text", cell references (with or without $), ranges,
   + - * / ( ), comparisons, and SUM AVERAGE MAX MIN IF VLOOKUP. Columns are single letters.
   gmParse(text) gives {ast} or {err:'noeq'|'syntax'}; gmEval(ast,get) gives a number, text, true/false or an error
   such as #N/A. get(col,row) returns what a cell shows ('' when empty). */
const GM_REF=/^(\$?)([A-Z])(\$?)(\d+)$/;
const gmIsErr=v=>typeof v==='string'&&/^#(N\/A|VALUE!|DIV\/0!|NAME\?|REF!)$/.test(v);
function gmTokens(f){
  const out=[],re=/\s+|"[^"]*"|\$?[A-Za-z]\$?\d+(?![A-Za-z(])|[A-Za-z]+|\d+(?:\.\d+)?|\.\d+|<=|>=|<>|[-+*\/(),:<>=]/y;let i=0;
  while(i<f.length){re.lastIndex=i;const m=re.exec(f);if(!m)return null;i=re.lastIndex;if(/^\s+$/.test(m[0]))continue;out.push(m[0][0]==='"'?m[0]:m[0].toUpperCase());}
  return out;
}
function gmParse(f){
  f=String(f||'').trim();if(f[0]!=='=')return {err:'noeq'};
  const T=gmTokens(f.slice(1));if(!T||!T.length)return {err:'syntax'};
  let p=0;const peek=()=>T[p],next=()=>T[p++],want=x=>{if(T[p]!==x)throw 0;p++;};
  const ref=t=>{const m=(t||'').match(GM_REF);return m&&{t:'ref',c:m[2],r:+m[4],ac:!!m[1],ar:!!m[3]};};
  const prim=()=>{
    const t=next();if(t===undefined)throw 0;
    if(/^[\d.]/.test(t))return {t:'n',v:+t};
    if(t[0]==='"')return {t:'s',v:t.slice(1,-1)};
    if(t==='('){const e=cmp();want(')');return e;}
    const a=ref(t);
    if(a){if(peek()!==':')return a;next();const b=ref(next());if(!b)throw 0;return {t:'rng',a,b};}
    if(/^[A-Z]+$/.test(t)){
      if(peek()!=='(')return t==='TRUE'||t==='FALSE'?{t:'b',v:t==='TRUE'}:{t:'name',v:t};
      next();const args=[];if(peek()!==')'){args.push(cmp());while(peek()===','){next();args.push(cmp());}}want(')');
      return {t:'fn',name:t,args};
    }
    throw 0;
  };
  const un=()=>peek()==='-'?(next(),{t:'neg',a:un()}):peek()==='+'?(next(),un()):prim();
  const mul=()=>{let a=un();while(peek()==='*'||peek()==='/'){const op=next();a={t:'op',op,a,b:un()};}return a;};
  const add=()=>{let a=mul();while(peek()==='+'||peek()==='-'){const op=next();a={t:'op',op,a,b:mul()};}return a;};
  const cmp=()=>{let a=add();if(['<','>','<=','>=','=','<>'].includes(peek())){const op=next();a={t:'op',op,a,b:add()};}return a;};
  try{const ast=cmp();if(p!==T.length)return {err:'syntax'};return {ast};}catch(e){return {err:'syntax'};}
}
const gmCells=n=>{const out=[],c1=Math.min(n.a.c.charCodeAt(0),n.b.c.charCodeAt(0)),c2=Math.max(n.a.c.charCodeAt(0),n.b.c.charCodeAt(0)),r1=Math.min(n.a.r,n.b.r),r2=Math.max(n.a.r,n.b.r);
  for(let r=r1;r<=r2;r++)for(let c=c1;c<=c2;c++)out.push({c:String.fromCharCode(c),r});return out;};
function gmEval(n,get){
  const E=x=>gmEval(x,get),num=v=>typeof v==='boolean'?+v:v===''?0:v;
  const vals=args=>{const out=[];for(const a of args){if(a.t==='rng'){for(const q of gmCells(a)){const v=get(q.c,q.r);if(gmIsErr(v))return v;if(typeof v==='number')out.push(v);}}
    else if(a.t==='ref'){const v=get(a.c,a.r);if(gmIsErr(v))return v;if(typeof v==='number')out.push(v);}
    else{const v=num(E(a));if(gmIsErr(v))return v;if(typeof v!=='number')return '#VALUE!';out.push(v);}}return out;};
  switch(n.t){
    case 'n':case 's':case 'b':return n.v;
    case 'name':return '#NAME?';
    case 'ref':return get(n.c,n.r);
    case 'rng':return '#VALUE!';
    case 'neg':{const a=num(E(n.a));return gmIsErr(a)?a:typeof a==='number'?-a:'#VALUE!';}
    case 'op':{
      const a=num(E(n.a)),b=num(E(n.b));if(gmIsErr(a))return a;if(gmIsErr(b))return b;
      if('+-*/'.includes(n.op)){
        if(typeof a!=='number'||typeof b!=='number')return '#VALUE!';
        return n.op==='+'?a+b:n.op==='-'?a-b:n.op==='*'?a*b:b===0?'#DIV/0!':a/b;
      }
      const x=typeof a==='string'?a.toUpperCase():a,y=typeof b==='string'?b.toUpperCase():b;
      if(typeof x!==typeof y)return n.op==='<>';
      return {'<':x<y,'>':x>y,'<=':x<=y,'>=':x>=y,'=':x===y,'<>':x!==y}[n.op];
    }
    case 'fn':{
      const A=n.args;
      if(['SUM','AVERAGE','MAX','MIN'].includes(n.name)){
        if(!A.length)return '#VALUE!';const v=vals(A);if(!Array.isArray(v))return v;
        if(n.name==='SUM')return v.reduce((s,x)=>s+x,0);
        if(n.name==='AVERAGE')return v.length?v.reduce((s,x)=>s+x,0)/v.length:'#DIV/0!';
        return v.length?Math[n.name.toLowerCase()](...v):0;
      }
      if(n.name==='IF'){if(A.length<2||A.length>3)return '#VALUE!';const c=num(E(A[0]));if(gmIsErr(c))return c;return c?E(A[1]):A[2]?E(A[2]):false;}
      if(n.name==='VLOOKUP'){
        if(A.length<3||A.length>4||A[1].t!=='rng')return '#VALUE!';
        const v=E(A[0]),col=num(E(A[2]));if(gmIsErr(v))return v;if(gmIsErr(col))return col;
        if(typeof col!=='number'||col<1)return '#VALUE!';
        const c1=Math.min(A[1].a.c.charCodeAt(0),A[1].b.c.charCodeAt(0)),c2=Math.max(A[1].a.c.charCodeAt(0),A[1].b.c.charCodeAt(0));
        if(c1+Math.floor(col)-1>c2)return '#REF!';
        /* as Excel: with three parts (or TRUE) it is the nearest match, the last code in the first column that is not bigger
           than the one looked up (the list is in order, so it stops at the first bigger one); nothing that small gives #N/A.
           A fourth part of FALSE asks for the exact code. Blank cells, and numbers against text, are passed over. */
        const near=A[3]?!!num(E(A[3])):true,key=x=>typeof x==='string'?x.toUpperCase():x;
        const rows=gmCells({a:{c:String.fromCharCode(c1),r:A[1].a.r},b:{c:String.fromCharCode(c1),r:A[1].b.r}});
        let hit=null;
        for(const q of rows){const k=get(q.c,q.r);if(k===''||typeof k!==typeof v)continue;
          if(!near){if(key(k)===key(v)){hit=q.r;break;}continue;}
          if(key(k)<=key(v))hit=q.r;else break;}
        if(hit==null)return '#N/A';
        return get(String.fromCharCode(c1+Math.floor(col)-1),hit);
      }
      return '#NAME?';
    }
  }
  return '#VALUE!';
}
/* every cell reference in a formula, as {c,r}; ranges count each end */
function gmRefsIn(n,out=[]){if(!n||typeof n!=='object')return out;if(n.t==='ref')out.push(n);if(n.t==='rng'){out.push(n.a,n.b);}['a','b'].forEach(k=>n.t!=='rng'&&n[k]&&gmRefsIn(n[k],out));(n.args||[]).forEach(x=>gmRefsIn(x,out));return out;}
/* the formula copied dr rows down: references without $ before the row number move, the rest stay put */
function gmShift(f,dr){const T=gmTokens(String(f).trim().replace(/^=/,''));if(!T)return f;
  return '='+T.map(t=>{const m=t.match(GM_REF);return m?m[1]+m[2]+m[3]+(m[3]?+m[4]:+m[4]+dr):t;}).join('');}
/* show a value the way a cell would: dp decimal places, rounded half up like a spreadsheet */
function gmShow(v,dp,cur){if(typeof v==='boolean')return v?'TRUE':'FALSE';if(typeof v!=='number')return v;
  const r=dp==null?v:(Math.round(v*Math.pow(10,dp)+(v<0?-1e-6:1e-6))/Math.pow(10,dp));return (cur?'£':'')+(dp==null?String(+r.toFixed(6)):r.toFixed(dp));}
