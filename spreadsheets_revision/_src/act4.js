/* Activity 4 — Safe Sheet. Sources: TB p16 (conditional formatting; data validation and its Stop alert), TB p17 (templates, importing,
   headers and footers); PP 2018 Q7(d)(e), 2019 Q1(i), 2021 Q3(e)(f), 2023 Q4(g), 2026 Q6(b). Old version: HQ_AUDIT scratch act4.v1.js. */
const SS_OPS=[['>=','≥','greater than or equal to'],['>','>','greater than'],['<=','≤','less than or equal to'],['<','<','less than'],['=','=','equal to']];
const SS_TEST={'>=':(a,b)=>a>=b,'>':(a,b)=>a>b,'<=':(a,b)=>a<=b,'<':(a,b)=>a<b,'=':(a,b)=>a===b};
const SS_FILL=[['green','🟩 Green'],['amber','🟧 Amber'],['red','🟥 Red']];
const ssWords=op=>SS_OPS.find(o=>o[0]===op)[2];
const ssSet=r=>!!(r.op&&r.c);
const ssRule=r=>`cell value ${ssWords(r.op)} ${r.v}: fill ${r.c}`;
const ssQuote=r=>`“${ssWords(r.op)} ${r.v}”`;
const ssPaint=(rules,v)=>{for(const r of rules)if(ssSet(r)&&SS_TEST[r.op](v,r.v))return r.c;return '';};
let SS=null;

/* ---------- shared: rule builder (chips + live slider), name box and formula bar ---------- */
function ssBuilder(k,r,label){
  return `<div class="ss-rule" data-r="${k}"><div class="vs-h">${label}</div>
<div class="ss-chips">${SS_OPS.map(([op,sym,w])=>`<button class="ss-chip${r.op===op?' on':''}" data-f="op" data-v="${op}"><b>${sym}</b> ${w}</button>`).join('')}</div>
<div class="ss-num"><button class="ss-step" data-d="-1" aria-label="One less">−</button><input type="range" class="ss-range" min="0" max="200" step="1" value="${r.v}" aria-label="The number in the rule"><button class="ss-step" data-d="1" aria-label="One more">+</button><input type="number" class="ss-n" min="0" max="200" step="1" inputmode="numeric" value="${r.v}" aria-label="The number in the rule"></div>
<div class="vs-h">then fill the cell</div>
<div class="ss-chips">${SS_FILL.map(([c,l])=>`<button class="ss-chip ss-fill ${c}${r.c===c?' on':''}" data-f="c" data-v="${c}">${l}</button>`).join('')}</div>
<div class="ss-say" id="ssSay${k}">${ssSayRule(r)}</div></div>`;
}
const ssSayRule=r=>ssSet(r)?`✏️ If the ${ssRule(r)}`:r.op?'Now pick a colour.':r.c?'Now pick a comparison.':'Not set yet: pick a comparison and a colour.';
function ssWire(box,onChange){
  box.addEventListener('click',e=>{
    const b=e.target.closest('.ss-chip,.ss-step');if(!b||GM.state!=='rules')return;
    const el=b.closest('.ss-rule'),k=+el.dataset.r,r=SS.rules[k];
    if(b.classList.contains('ss-step'))r.v=Math.max(0,Math.min(200,r.v+ +b.dataset.d));
    else{r[b.dataset.f]=b.dataset.v;el.querySelectorAll(`.ss-chip[data-f="${b.dataset.f}"]`).forEach(x=>x.classList.toggle('on',x===b));}
    ssSync(el,r,k);sfx('tick');gmMsg('');if(onChange)onChange();
  });
  box.addEventListener('input',e=>{
    const t=e.target;if(!t.matches('.ss-range,.ss-n')||GM.state!=='rules')return;
    const n=Math.round(+t.value);if(t.value===''||isNaN(n))return;
    const el=t.closest('.ss-rule'),k=+el.dataset.r,r=SS.rules[k];r.v=Math.max(0,Math.min(200,n));
    ssSync(el,r,k,t);gmMsg('');if(onChange)onChange();
  });
  box.addEventListener('change',e=>{if(e.target.matches('.ss-n'))e.target.value=SS.rules[+e.target.closest('.ss-rule').dataset.r].v;});
}
function ssSync(el,r,k,from){
  const rg=el.querySelector('.ss-range'),nb=el.querySelector('.ss-n');
  if(from!==rg)rg.value=r.v;if(from!==nb)nb.value=r.v;
  $('ssSay'+k).innerHTML=ssSayRule(r);
}
const ssBar=(name,val)=>`<div class="fh-bar ss-bar"><span class="fh-name" id="ssName">${name}</span><span class="fh-fx">fx</span><span class="fh-f" id="ssF">${val}</span></div>`;
function ssPick(e){
  const td=e.target.closest('td[data-k]');if(!td||!$('ssName'))return;
  document.querySelectorAll('#gmMain td.sel').forEach(x=>x.classList.remove('sel'));td.classList.add('sel');
  $('ssName').textContent=td.dataset.k;$('ssF').textContent=td.dataset.v||'';
}
function ssOut(head,text){gmGo('See what happened →',()=>gmEnd(0,head,text));}

/* ---------- stage 1: traffic lights that must survive new weeks ---------- */
const TL_ITEMS=['Crisps','Juice','Apple','Bar','Water','Popcorn'];
/* week 1 has no edge values; week 2 brings 100, 70 and 69; week 3 brings 99 and 101, so only ≥100 (or >99) and <70 (or ≤69) last */
const TL_WEEKS=[['This week',[120,90,60,75,110,85]],['Next week',[100,70,64,130,95,69]],['The week after',[99,101,71,69,100,70]]];
const tlWant=v=>v>=100?'green':v<70?'red':'';
function sim_lights(area,finish){
  SS={tl:[{op:'',v:50,c:''},{op:'',v:50,c:''}],w:0,typed:6,tried:false,cr:0,bv:{C:{allow:'any',min:'',max:''},B:{allow:'any',min:'',max:''}}};SS.rules=SS.tl;
  gmOpen(area,{title:'Safe sheet',icon:'🛡️',stages:['Traffic lights','Crack the rule','The bouncer'],lives:3,finish,bot:'🧯'});
  gmBanner('Keep the tuck shop sheet safe','The Sheet Wrecker 🧯 wants to mess up the tuck shop sheet. First, make the Sold column colour itself, and keep it right when new numbers come in. Then crack the Wrecker’s own colour rules. Last, set data validation so the Wrecker’s junk cannot get in. A wrong colour or a wrong entry costs a life.','🚦 Build the colour rules',()=>tlBuild(0));
}
function tlTable(w,n){
  const V=TL_WEEKS[w][1];
  return `<table class="gm-tbl ss-sheet" id="ssSheet"><tr><th></th><th>A</th><th>B</th></tr><tr><th>1</th><td class="fh-h">Item</td><td class="fh-h">Sold</td></tr>
${TL_ITEMS.map((it,k)=>`<tr><th>${k+2}</th><td>${it}</td><td class="ss-v" id="tl_${k}" data-k="B${k+2}" data-v="${k<n?V[k]:''}">${k<n?V[k]:''}</td></tr>`).join('')}</table>`;
}
function tlRepaint(){
  const V=TL_WEEKS[SS.w][1];
  TL_ITEMS.forEach((_,k)=>{const td=$('tl_'+k);if(!td)return;const got=k<SS.typed?ssPaint(SS.tl,V[k]):'',sel=td.classList.contains('sel');td.className='ss-v'+(got?' '+got:'')+(sel?' sel':'');});
}
function tlBuild(w){
  gmStage(0);GM.state='rules';gmMsg('');SS.w=w;SS.typed=6;SS.rules=SS.tl;SS.rolled=false;if(w>0)SS.fixed=true;
  $('gmMain').innerHTML=`<div class="gm-q">🗒️ The office: “Sold <b>100 or more</b>: fill green. Sold <b>under 70</b>: fill red.” ${SS.tried?'Fix':'Build'} two conditional formatting rules for B2:B7. The cells repaint as you change a rule.</div>
<div class="ss-wrap"><div class="gm-panel ss-rules" id="ssRules">${SS.tl.map((r,k)=>ssBuilder(k,r,`Rule ${k+1}: format the cell when its value is`)).join('')}</div>
<div class="gm-panel ss-side"><div class="vs-h">${TL_WEEKS[w][0]}</div>${ssBar('B2',TL_WEEKS[w][1][0])}${tlTable(w,6)}</div></div>
<div class="gm-btns"><button class="btn btn-primary" id="ssGo">🔒 Lock the rules</button></div>`;
  ssWire($('ssRules'),tlRepaint);$('ssSheet').addEventListener('click',ssPick);tlRepaint();
  $('ssGo').onclick=()=>{
    const half=SS.tl.findIndex(r=>!!r.op!==!!r.c);
    if(half>=0)return gmMsg(`Rule ${half+1} is only half built: it needs a comparison and a colour.`,'part');
    if(!SS.tl.some(ssSet))return gmMsg('Build the rules first: pick a comparison, set the number and pick a colour.','part');
    tlJudge(w);
  };
}
function tlRoll(w){
  GM.state='paint';gmMsg('');SS.w=w;SS.typed=0;SS.rolled=true;
  $('gmMain').innerHTML=`<div class="gm-q">📅 ${TL_WEEKS[w][0]}: the helper types in the new Sold numbers. Nobody touches your rules. Watch the colours.</div>
<div class="ss-wrap"><div class="gm-panel ss-rules ss-fixed">${SS.tl.map((r,k)=>`<div class="ss-fx"><span class="vs-h">Rule ${k+1}</span> ${ssSet(r)?`Cell value ${ssWords(r.op)} <b>${r.v}</b>: fill <span class="ss-sw ${r.c}"></span> ${r.c}`:'not set'}</div>`).join('')}</div>
<div class="gm-panel ss-side"><div class="vs-h">${TL_WEEKS[w][0]}</div>${ssBar('B2','')}${tlTable(w,0)}</div></div>`;
  $('ssSheet').addEventListener('click',ssPick);
  const V=TL_WEEKS[w][1];let k=0;
  const step=()=>{
    if(!GM||GM.state!=='paint')return;
    if(k>=V.length)return tlJudge(w);
    const td=$('tl_'+k);$('ssName').textContent='B'+(k+2);$('ssF').textContent=V[k];
    td.textContent=V[k];td.dataset.v=V[k];SS.typed=k+1;tlRepaint();td.classList.add('drop');sfx('tick');k++;
    setTimeout(step,RM?60:480);
  };
  setTimeout(step,RM?50:400);
}
function tlWhy(v,item,want,got){
  const word=c=>c?c:'plain (no fill)';
  let s=`${item} sold <b>${v}</b>. The office wants it ${word(want)}, but your rules made it ${word(got)}.`;
  const R=SS.tl.filter(ssSet),hit=R.find(r=>SS_TEST[r.op](v,r.v));
  if(want&&!got){const r=R.find(x=>x.c===want);s+=r?` Your ${want} rule is ${ssQuote(r)}, and ${v} does not pass it.`:` No rule fills ${want} yet.`;}
  else if(hit)s+=` ${v} passes your rule ${ssQuote(hit)}, so it is filled ${hit.c}.`;
  if(v===100)s+=' “100 or more” includes 100 itself: “greater than 100” leaves it out, “greater than or equal to 100” keeps it in.';
  else if(v===70)s+=' “Under 70” leaves out 70 itself: “less than or equal to 70” catches it, “less than 70” does not.';
  else if(v===69)s+=' 69 is under 70, so it must be red.';
  else if(v===99)s+=' 99 is under 100, so it must stay plain.';
  return s;
}
function tlJudge(w){
  GM.state='fb';SS.tried=true;
  const V=TL_WEEKS[w][1],bad=[];
  V.forEach((v,k)=>{if(ssPaint(SS.tl,v)!==tlWant(v)){bad.push(k);$('tl_'+k).classList.add('wrong');}});
  /* a fixed rule must still be right for every earlier week */
  let old=null;
  for(let j=0;j<w&&!bad.length&&!old;j++){const k=TL_WEEKS[j][1].findIndex(v=>ssPaint(SS.tl,v)!==tlWant(v));if(k>=0)old={j,k};}
  if(bad.length||old){
    const out=gmLose();say('Wrong colours! 🎨');
    if(old){const v=TL_WEEKS[old.j][1][old.k];gmMsg(`This week is right now, but your rules break an earlier week. ${TL_WEEKS[old.j][0]}: ${tlWhy(v,TL_ITEMS[old.k],tlWant(v),ssPaint(SS.tl,v))} The rules have to work for every week’s numbers.`,'wrong');}
    else{const k=bad[0];gmMsg(tlWhy(V[k],TL_ITEMS[k],tlWant(V[k]),ssPaint(SS.tl,V[k]))+(bad.length>1?` ${bad.length} cells are wrong altogether.`:''),'wrong');}
    if(out)return ssOut('The office gave up','The colours kept going wrong. Read the lesson on conditional formatting again, then have another go.');
    return gmGo('🛠️ Fix the rules →',()=>tlBuild(w));
  }
  sfx('good');
  if(w<2){
    say(w?'Still right! 🚦':'Looking good! 🚦');
    gmMsg(w===0?'The colours match what the office asked for. Click a coloured cell: the formula bar still shows the same number, because conditional formatting changes how a cell looks, never its value or its formula. Your rules are locked now. Will they still be right when next week’s numbers are typed in?'
      :SS.rolled?'Right again with brand new numbers, and nobody touched the rules: the colour follows the value by itself. One more week.'
      :'Fixed: every colour is right for this week and last week. Your rules are locked again. One more week.','correct');
    return gmGo(`📅 ${TL_WEEKS[w+1][0]} →`,()=>tlRoll(w+1));
  }
  say('Rules that last! 🎉');
  const g=SS.tl.find(r=>ssSet(r)&&r.c==='green'),rd=SS.tl.find(r=>ssSet(r)&&r.c==='red');
  const exact=g&&g.op==='>='&&g.v===100&&rd&&rd.op==='<'&&rd.v===70;
  gmMsg(`${SS.fixed?'Every colour is now right for all three weeks of numbers.':'Three weeks of new numbers and every colour was right, with nobody touching the rules.'} That is conditional formatting: the colour depends on a condition, so it updates whenever the value changes.${exact?'':' Your rules work because every sale is a whole number, but the office’s words match “greater than or equal to 100” and “less than 70” exactly. Those are the safest rules to write.'}`,'correct');
  gmGo('🔍 Crack the Wrecker’s rules →',()=>crBuild(0));
}

/* ---------- stage 2: crack the rule from the colours ---------- */
const CR=[
  {title:'Jen’s staff pay sheet',col:'I',head:'Total hours',names:['Amy','Ben','Ciara','Dev','Erin','Finn','Gary'],v:[38,42,40,45,36,41,40],rule:{op:'>',v:40,c:'amber'},
   win:'Cracked it: “greater than 40”. 40 itself is not more than 40, so it stays plain. This is the 2018 exam sheet, where staff who work more than 40 hours are highlighted: the feature is conditional formatting.',
   same:'“Greater than or equal to 41” does the same job here, because every value in this column is a whole number; “greater than 40” matches the words “more than 40” exactly.'},
  {title:'Piotr’s marks sheet',col:'D',head:'Mark',names:['Aoife','Conor','Hannah','Jack','Niamh','Ryan','Sophie'],v:[72,49,50,35,88,50,61],rule:{op:'<',v:50,c:'red'},
   win:'Cracked it: marks “less than 50” are red, and 50 itself stays plain.',
   same:'“Less than or equal to 49” does the same job here, because every mark is a whole number; “less than 50” is the clearer rule.'},
  {title:'Tuck shop stock sheet',col:'C',head:'In stock',names:['Crisps','Juice','Apple','Bar','Water','Popcorn','Gum'],v:[12,0,5,0,30,1,8],rule:{op:'=',v:0,c:'red'},
   win:'Cracked it: only the items with nothing in stock are red, so the rule is “equal to 0”.',
   same:'Your rule colours the same cells here, because stock is always a whole number and never below 0, but “equal to 0” says exactly what the colour means: none left.'}
];
function crTable(P,mine){
  return `<table class="gm-tbl ss-sheet ss-cr" id="ssSheet"><tr><th></th><th>A</th><th>${P.col}</th><th class="ss-you">${P.col}</th></tr>
<tr class="ss-caps"><th></th><td></td><td>🧯 Wrecker’s sheet</td><td>✏️ Your rule</td></tr>
<tr><th>1</th><td class="fh-h">Name</td><td class="fh-h">${P.head}</td><td class="fh-h">${P.head}</td></tr>
${P.names.map((n,k)=>{const v=P.v[k],t=ssPaint([P.rule],v),m=mine?ssPaint(SS.rules,v):'';
  return `<tr><th>${k+2}</th><td>${n}</td><td class="ss-v${t?' '+t:''}" data-k="${P.col}${k+2}" data-v="${v}">${v}</td><td class="ss-v ss-mine${m?' '+m:''}${mine&&m!==t?' wrong':''}" id="cr_${k}">${v}</td></tr>`;}).join('')}</table>`;
}
function crBuild(i){
  gmStage(1);GM.state='rules';gmMsg('');SS.cr=i;
  const P=CR[i];if(!SS.guess||SS.guess.i!==i)SS.guess={i,r:[{op:'',v:50,c:''}]};SS.rules=SS.guess.r;
  $('gmMain').innerHTML=`<div class="gm-q">🔍 Sheet ${i+1} of ${CR.length}: ${P.title}. The Wrecker has set a secret conditional formatting rule on column ${P.col}. Look at which cells are coloured and which are not, then build the same rule and test it.</div>
<div class="ss-wrap"><div class="gm-panel ss-rules" id="ssRules">${ssBuilder(0,SS.rules[0],`Your rule for column ${P.col}: format the cell when its value is`)}</div>
<div class="gm-panel ss-side">${ssBar(P.col+'2',P.v[0])}${crTable(P,false)}</div></div>
<div class="gm-btns"><button class="btn btn-primary" id="ssGo">🧪 Test my rule</button></div>`;
  ssWire($('ssRules'));$('ssSheet').addEventListener('click',ssPick);
  $('ssGo').onclick=()=>{if(!ssSet(SS.rules[0]))return gmMsg('Build the rule first: pick a comparison, set the number and pick a colour.','part');crJudge(i);};
}
function crJudge(i){
  GM.state='fb';
  const P=CR[i],g=SS.rules[0];
  $('ssSheet').outerHTML=crTable(P,true);$('ssSheet').addEventListener('click',ssPick);
  document.querySelectorAll('#ssRules button,#ssRules input').forEach(x=>x.disabled=true);
  const bad=P.v.map((v,k)=>k).filter(k=>ssPaint([P.rule],P.v[k])!==ssPaint([g],P.v[k]));
  if(!bad.length){
    sfx('good');say('Cracked! 🔓');
    const exact=g.op===P.rule.op&&g.v===P.rule.v;
    gmMsg(P.win+(exact?'':' '+P.same),'correct');
    return gmGo(i<CR.length-1?'🔍 Next sheet →':'🚪 On to the bouncer →',()=>i<CR.length-1?crBuild(i+1):bvSet(0));
  }
  const out=gmLose();say('Not my rule! 😏');
  const k=bad[0],v=P.v[k],want=ssPaint([P.rule],v),got=ssPaint([g],v);
  const sameCells=P.v.every(x=>!!ssPaint([P.rule],x)===!!ssPaint([g],x));
  gmMsg(sameCells?`You coloured the right cells, but the Wrecker’s sheet fills them ${P.rule.c}, not ${g.c}.`
    :want?`${P.names[k]}’s ${v} is coloured on the Wrecker’s sheet, but your rule ${ssQuote(g)} leaves it plain.${bad.length>1?` ${bad.length} cells do not match.`:''}`
    :`${P.names[k]}’s ${v} is plain on the Wrecker’s sheet, but your rule ${ssQuote(g)} colours it ${got}.${bad.length>1?` ${bad.length} cells do not match.`:''}`,'wrong');
  if(out)return ssOut('The Wrecker kept its secrets','Too many rules did not match. Read the lesson on conditional formatting again, then have another go.');
  gmGo('🛠️ Change my rule →',()=>crBuild(i));
}

/* ---------- stage 3: the bouncer (data validation) faces four waves ---------- */
const BV_ALLOW=[['any','Any value','lets anything in'],['whole','Whole number','only whole numbers, like 7 or 120'],['dec','Decimal','any number, including ones like 12.5'],['len','Text length','counts how many characters are typed']];
const BV_SOLD='<ul class="ss-facts"><li>A sale is a whole number of items: nobody sells half a bag.</li><li>A week can sell none, so 0 is real.</li><li>The shop can never sell more than 500 of one item in a week.</li></ul>';
const bvRealSold=s=>/^\d+$/.test(s)&&+s<=500;
const BV_WAVES=[
  {col:'C',items:TL_ITEMS,facts:BV_SOLD,real:bvRealSold,seq:[['h','120'],['w','lots'],['h','85'],['w','ten'],['h','60'],['h','42']],
   q:'🚪 Wave 1 of 4. A new helper types this week’s sales into C2:C7, and the Sheet Wrecker 🧯 will try to sneak junk in. Set data validation on C2:C7 so only real sales get in, then open the door.',
   win:'Every word bounced off and every real sale got in. Letting in only numbers is a <b>type check</b>: the data must be the right kind.'},
  {col:'C',items:TL_ITEMS,facts:BV_SOLD,real:bvRealSold,seq:[['h','95'],['w','950'],['h','140'],['w','-5'],['h','0'],['h','500']],
   q:'🚪 Wave 2 of 4. A new week, and the Wrecker is back with new tricks. Change your rule if you need to, then open the door.',
   win:'950 and -5 bounced off, while 0 and 500 got in. Letting in only values between a lowest and a highest value is a <b>range check</b>.'},
  {col:'C',items:TL_ITEMS,facts:BV_SOLD,real:bvRealSold,seq:[['h','300'],['w','12.5'],['h','7'],['w','2.5'],['h','64'],['h','18']],
   q:'🚪 Wave 3 of 4. Another week, another set of tricks. Change your rule if you need to, then open the door.',
   win:'12.5 and 2.5 bounced off: Whole number lets in whole numbers only, so nobody can sell half a bag.'},
  {col:'B',items:['Gum','Mints','Cookie','Yogurt','Raisins','Toast'],real:s=>/^[A-Z]\d{3}$/.test(s),seq:[['h','T007'],['w','T0007'],['h','T008'],['w','T8'],['h','T009'],['w','T09']],
   facts:'<ul class="ss-facts"><li>Every code is one letter and three digits, like T004.</li></ul>',
   q:'🚪 Wave 4 of 4. New items are coming in, and the helper types their codes into B2:B7. The Wrecker follows. Set data validation on B2:B7, then open the door.',
   win:'Every code with the wrong number of characters bounced off. Checking how many characters are typed is a <b>length check</b>.'}
];
const BV_CODES=['T001','T002','T003','T004','T005','T006'];
function bvOk(s,R){
  const n=Number(s),num=s.trim()!==''&&!isNaN(n),lo=Number(R.min),hi=Number(R.max);
  if(R.allow==='any')return true;
  if(R.allow==='whole')return num&&Number.isInteger(n)&&n>=lo&&n<=hi;
  if(R.allow==='dec')return num&&n>=lo&&n<=hi;
  if(R.allow==='len')return s.length>=lo&&s.length<=hi;
  return false;
}
const bvSay=R=>R.allow==='any'?'Any value':`${BV_ALLOW.find(a=>a[0]===R.allow)[1]} between ${R.min} and ${R.max}${R.allow==='len'?' characters':''}`;
function bvTable(i){
  const W=BV_WAVES[i];
  return `<table class="gm-tbl ss-sheet" id="ssSheet"><tr><th></th><th>A</th><th>B</th><th>C</th></tr>
<tr><th>1</th><td class="fh-h">Item</td><td class="fh-h">Code</td><td class="fh-h">Sold</td></tr>
${W.items.map((it,r)=>`<tr><th>${r+2}</th><td>${it}</td>${W.col==='B'?`<td class="ss-in" id="bv_${r}" data-k="B${r+2}"></td><td></td>`:`<td data-k="B${r+2}" data-v="${BV_CODES[r]}">${BV_CODES[r]}</td><td class="ss-in n" id="bv_${r}" data-k="C${r+2}"></td>`}</tr>`).join('')}
${W.col==='C'?'<tr><th>8</th><td class="fh-h">Total</td><td></td><td class="n ss-tot" id="bvTot" data-k="C8" data-v="=C2+C3+C4+C5+C6+C7">0</td></tr>':''}</table>`;
}
function bvSet(i){
  gmStage(2);GM.state='rules';gmMsg('');SS.wave=i;
  const W=BV_WAVES[i],R=SS.bv[W.col];
  $('gmMain').innerHTML=`<div class="gm-q">${W.q}</div>
<div class="ss-wrap"><div class="ss-left"><div class="gm-panel"><div class="vs-h">📋 What real data looks like</div>${W.facts}</div>
<div class="gm-panel ss-bv" id="bvBox"><div class="vs-h">Data validation on ${W.col}2:${W.col}7 · Allow</div>
<div class="ss-chips">${BV_ALLOW.map(([a,l])=>`<button class="ss-chip${R.allow===a?' on':''}" data-a="${a}">${l}</button>`).join('')}</div>
<div class="ss-help" id="bvHelp"></div>
<div class="ss-between" id="bvBetween">between <input type="number" class="ss-n" id="bvMin" inputmode="numeric" value="${R.min}" aria-label="Minimum"> and <input type="number" class="ss-n" id="bvMax" inputmode="numeric" value="${R.max}" aria-label="Maximum"> <span id="bvUnit"></span></div></div></div>
<div class="gm-panel ss-side">${ssBar(W.col+'2','')}${bvTable(i)}</div></div>
<div class="gm-btns"><button class="btn btn-primary" id="bvGo">🚪 Open the door</button></div>`;
  const show=()=>{const a=BV_ALLOW.find(x=>x[0]===R.allow);$('bvHelp').textContent=`${a[1]}: ${a[2]}.`;$('bvBetween').hidden=R.allow==='any';$('bvUnit').textContent=R.allow==='len'?'characters (both included)':'(both included)';};
  show();$('ssSheet').addEventListener('click',ssPick);
  $('bvBox').addEventListener('click',e=>{const b=e.target.closest('.ss-chip');if(!b||GM.state!=='rules')return;R.allow=b.dataset.a;$('bvBox').querySelectorAll('.ss-chip').forEach(x=>x.classList.toggle('on',x===b));show();sfx('tick');gmMsg('');});
  $('bvBox').addEventListener('input',()=>{if(GM.state==='rules')gmMsg('');});
  $('bvGo').onclick=()=>{
    R.min=$('bvMin').value.trim();R.max=$('bvMax').value.trim();
    if(R.allow!=='any'){
      if(R.min===''||R.max==='')return gmMsg('Type a smallest value and a biggest value into the two boxes first.','part');
      if(+R.min>+R.max)return gmMsg('The first number is bigger than the second, so nothing could ever get in. A spreadsheet will not save a rule like that.','part');
      if(R.allow!=='dec'&&(!Number.isInteger(+R.min)||!Number.isInteger(+R.max)))return gmMsg(`${R.allow==='len'?'Text length counts whole characters':'Whole number needs whole-number limits'}, so use whole numbers in both boxes.`,'part');
      if(R.allow==='len'&&+R.min<0)return gmMsg('Text length cannot be below 0 characters.','part');
    }
    bvRun(i);
  };
}
function bvRun(i){
  GM.state='queue';gmMsg('');
  const W=BV_WAVES[i],R=SS.bv[W.col],vals=[],log=[];
  $('gmMain').innerHTML=`<div class="gm-q">🚪 Wave ${i+1} of 4: the door is open. Your rule on ${W.col}2:${W.col}7: <b>${bvSay(R)}</b>.</div>
<div class="ss-wrap"><div class="ss-left"><div class="ss-typer" id="bvWho">Ready…</div><div class="ss-score"><div class="gm-panel"><div class="vs-h">Junk let in</div><div class="ss-c" id="bvIn">0</div></div><div class="gm-panel"><div class="vs-h">Real data refused</div><div class="ss-c" id="bvOut">0</div></div></div>
<div class="ss-alert" id="bvAlert" hidden><b>⛔ Stop</b><span>This value doesn’t match the data validation restrictions defined for this cell.</span></div></div>
<div class="gm-panel ss-side">${ssBar(W.col+'2','')}${bvTable(i)}</div></div>`;
  $('ssSheet').addEventListener('click',ssPick);
  let e=0,junk=0,lost=0;
  const total=()=>{if(W.col!=='C')return;const t=$('bvTot'),txt=vals.some(v=>isNaN(Number(v)));t.textContent=txt?'#VALUE!':vals.reduce((a,v)=>a+Number(v),0);t.dataset.v='=C2+C3+C4+C5+C6+C7';t.classList.toggle('bad',junk>0);};
  const next=()=>{
    if(!GM||GM.state!=='queue')return;
    if(e>=W.seq.length){$('bvAlert').remove();return bvJudge(i,log);}
    const [who,s]=W.seq[e++],row=vals.length,cell=W.col+(row+2),td=$('bv_'+row);
    $('bvWho').innerHTML=who==='w'?`🧯 <b>The Wrecker</b> types into ${cell}…`:`🧑‍💼 <b>The helper</b> types into ${cell}…`;
    $('bvWho').className='ss-typer '+(who==='w'?'wreck':'help');
    $('ssName').textContent=cell;td.classList.add('typing');
    let c=0;
    const type=()=>{
      if(!GM||GM.state!=='queue')return;
      if(c<s.length){c++;td.textContent=s.slice(0,c);$('ssF').textContent=s.slice(0,c);return setTimeout(type,RM?10:85);}
      const inn=bvOk(s,R),real=W.real(s);log.push({s,inn,real});td.classList.remove('typing');
      if(inn){
        vals.push(s);td.dataset.v=s;td.classList.add(real?'okin':'junk');
        if(!real){junk++;$('bvIn').textContent=junk;$('bvIn').classList.add('bad');sfx('alarm');}else sfx('good');
        total();setTimeout(next,RM?80:520);
      }else{
        $('bvAlert').hidden=false;
        if(real){lost++;$('bvOut').textContent=lost;$('bvOut').classList.add('bad');sfx('alarm');}else sfx('zap');
        td.classList.add(real?'lost':'bounce');
        setTimeout(()=>{if(!GM||GM.state!=='queue')return;$('bvAlert').hidden=true;td.textContent='';td.classList.remove('lost','bounce');$('ssF').textContent='';setTimeout(next,RM?40:200);},RM?150:900);
      }
    };
    setTimeout(type,RM?20:250);
  };
  setTimeout(next,RM?50:400);
}
function bvWhy(s,inn,R,kind){
  const n=Number(s),num=s.trim()!==''&&!isNaN(n),len=s.length,rng=`${R.min} and ${R.max}`;
  if(inn){
    if(R.allow==='any')return `“${s}” got in: <b>Any value</b> lets everything in, even ${kind==='code'?'a code with the wrong number of characters':num?'a number that cannot be a real sale':'a word'}.`;
    if(R.allow==='len')return `“${s}” got in: <b>Text length</b> only counts characters. “${s}” has ${len}, and your rule allows between ${rng}.`;
    if(!Number.isInteger(n))return `“${s}” got in: <b>Decimal</b> lets in numbers like ${s}, but nobody sells half a bag.`;
    if(n>500)return `“${s}” got in because your biggest value is ${R.max}. The shop can never sell more than 500.`;
    if(n<0)return `“${s}” got in because your smallest value is ${R.min}. Nobody sells fewer than 0.`;
  }else{
    if(kind==='code'&&R.allow!=='len')return `“${s}” is a real code, but it was refused: a code has a letter in it, so <b>${R.allow==='whole'?'Whole number':'Decimal'}</b> refuses every code.`;
    if(R.allow==='len')return `“${s}” is real, but it was refused: it has ${len} character${len>1?'s':''}, and your rule allows between ${rng}.`;
    if(n<+R.min)return `“${s}” is a real sale${n===0?' (a week can sell none)':''}, but it was refused: your smallest value is ${R.min}.`;
    if(n>+R.max)return `“${s}” is a real sale${n===500?' (500 is the most the shop can sell)':''}, but it was refused: your biggest value is ${R.max}.`;
  }
  return `“${s}” ${inn?'got in':'was refused'}.`;
}
function bvJudge(i,log){
  GM.state='fb';
  const W=BV_WAVES[i],R=SS.bv[W.col],bad=log.filter(x=>x.inn!==x.real);
  $('bvWho').className='ss-typer';$('bvWho').textContent='The wave is over.';
  /* a changed rule must still deal with every earlier wave on the same column */
  let old=null;
  for(let j=0;j<i&&!bad.length&&!old;j++){const V=BV_WAVES[j];if(V.col!==W.col)continue;const x=V.seq.find(([,s])=>bvOk(s,R)!==V.real(s));if(x)old={s:x[1],inn:bvOk(x[1],R),j};}
  if(old){
    const out=gmLose();say('Old junk is back! 😬');
    gmMsg(`This wave went well, but your rule fails an earlier wave. From wave ${old.j+1}: ${bvWhy(old.s,old.inn,R,'sold')} A rule has to keep working for every week, not just this one.`,'wrong');
    if(out)return ssOut('The sheet was wrecked','Junk got into the sheet. Read the lesson on validation again, then have another go.');
    return gmGo('🛠️ Change the rule →',()=>bvSet(i));
  }
  if(!bad.length){
    sfx('good');say('Nothing got past! 🛡️');gmMsg(W.win,'correct');
    if(i<BV_WAVES.length-1)return gmGo(`🚪 Wave ${i+2} →`,()=>bvSet(i+1));
    return gmGo('Finish →',()=>gmEnd(gmStars(GM.lives,3),'The sheet is safe','The colours update by themselves, you cracked the Wrecker’s rules, and no junk got past your validation.'));
  }
  const out=gmLose();say('Junk got through! 😬');
  const x=bad[0];
  gmMsg(bvWhy(x.s,x.inn,R,W.col==='B'?'code':'sold')+(bad.length>1?` ${bad.length} entries went the wrong way altogether.`:''),'wrong');
  if(out)return ssOut('The sheet was wrecked','Junk got into the sheet. Read the lesson on validation again, then have another go.');
  gmGo('🛠️ Change the rule →',()=>bvSet(i));
}

const ACT={
title:'Safe Sheet',icon:'🛡️',
intro:'A spreadsheet is only useful if it is easy to read and hard to break. Your mission: make cells colour themselves, crack the Sheet Wrecker’s rules, stop junk getting in, and pick the right tool for each job.',
topics:'Conditional formatting, data validation, templates, headers and footers, importing data',
ranks:['Sheet Guardian','Senior Checker','Checker Trainee','New Starter — revise and retry'],
next:{href:'activity5.html',label:'Next: Ski Trip'},
teach:[
{teaches:['conditional-formatting'],html:`<div class="teach-card"><h3>🚦 Traffic lights: conditional formatting</h3>
<p><span class="term">Conditional formatting</span> applies cell shading or font colour to a cell or a group of cells if a specified condition is met. If the condition is not met, the cell keeps its normal look.</p>
<table class="gm-tbl ss-sheet"><tr><th>Item</th><th>Sold</th></tr><tr><td>Crisps</td><td class="ss-v green">120</td></tr><tr><td>Juice</td><td class="ss-v">90</td></tr><tr><td>Apple</td><td class="ss-v red">60</td></tr></table>
<p>The rules here are “greater than or equal to 100: green” and “less than 70: red”. Conditional formatting changes how a cell <b>looks</b>. It never changes the <b>value</b> or the <b>formula</b> in the cell. When the value changes, the colour follows by itself.</p>
<p style="margin-top:8px;">Watch the edges: “100 or more” includes 100, so it is “greater than or equal to 100”. “More than 40” leaves out 40, so it is “greater than 40”.</p>
<div class="tip-box">Exam focus (2018): staff who work more than 40 hours are highlighted in a different colour. That is conditional formatting.</div></div>`},
{teaches:['validation','range-check'],html:`<div class="teach-card"><h3>🚪 The bouncer: data validation</h3>
<p>A value inputted into a cell can be controlled using <span class="term">data validation</span>. A rule says what is allowed. Anything else is refused with an error message.</p>
<table class="gm-tbl"><tr><th>Rule on Sold</th><th>“120”</th><th>“950”</th><th>“lots”</th></tr><tr><td>Whole number between 0 and 500</td><td>✅</td><td>⛔</td><td>⛔</td></tr></table>
<p style="margin-top:8px;">The checks have names:</p>
<ul class="ss-facts"><li><b>Range check</b>: only values between a lowest and a highest value, such as 0 to 500.</li><li><b>Type check</b>: only the right kind of data, such as numbers only.</li><li><b>Length check</b>: the right number of characters, such as a 4-character code.</li><li><b>Presence check</b>: the cell cannot be left empty.</li></ul>
<div class="tip-box">Exam focus: a range check stops anyone typing more than 9 hours a day (2018). The feature that makes sure a column holds only numbers is validation (2026).</div></div>`},
{teaches:['template'],html:`<div class="teach-card"><h3>🧁 The cake tin and the frame</h3>
<p>A <span class="term">template</span> is a preformatted spreadsheet used as a starting point, like a cake tin: headings, borders and formulas are already there, so every new budget has the same shape. A template can be reused, and it can be edited.</p>
<p style="margin-top:8px;"><span class="term">Headers and footers</span> are placed at the top or bottom of the worksheet and appear on every printed page: page numbers, filenames or dates.</p>
<p style="margin-top:8px;"><span class="term">Importing</span>: data can be brought in from a database table, possibly in CSV format, using Get External Data.</p>
<div class="tip-box">Exam focus (2021, 2023): when every new sheet must start with the same layout and formulas, the answer is a template.</div></div>`}
],
rounds:[
{title:'Which Tool?',teachAt:[0,1,2],variant:'pop',heading:'Which tool does this job?',tip:'Colour from a condition: conditional formatting. Stops bad data: validation. A ready-made starting sheet: template. Printed on every page: header or footer.',
 choices:[{key:'cf',label:'🚦 Conditional formatting'},{key:'val',label:'🚪 Validation'},{key:'tmpl',label:'🧁 Template'},{key:'hf',label:'🖼️ Header/footer'}],
 tasks:[
  {type:'classify',text:'A Sold figure of 100 or more turns green',answer:'cf',src:'TB p16',feedback:'Conditional formatting: shading when a condition is met.'},
  {type:'classify',text:'Any profit under £20 shows in red text',answer:'cf',src:'TB p16',feedback:'Conditional formatting can change the font colour too.'},
  {type:'classify',text:'The colour changes, but the number in the cell stays the same',answer:'cf',src:'TB p16',feedback:'Conditional formatting changes the look, never the value.'},
  {type:'classify',text:'Stops anyone typing 950 in the Sold column',answer:'val',src:'TB p16',feedback:'Validation controls what can be typed into a cell.'},
  {type:'classify',text:'Only whole numbers from 0 to 500 can be entered',answer:'val',src:'TB p16',feedback:'Validation: a rule for what is allowed in.'},
  {type:'classify',text:'An error message appears when a word is typed into a number column',answer:'val',src:'TB p16',feedback:'Validation refuses the entry and shows a message.'},
  {type:'classify',text:'Every class trip starts from the same ready-made budget sheet',answer:'tmpl',src:'TB p17',feedback:'A template: a preformatted starting point.'},
  {type:'classify',text:'A preformatted spreadsheet used as a starting point',answer:'tmpl',src:'TB p17',feedback:'That is what a template is.'},
  {type:'classify',text:'The headings, borders and formulas are already there; only the numbers are new',answer:'tmpl',src:'TB p17',feedback:'A template keeps the layout and formulas the same every time.'},
  {type:'classify',text:'Page numbers at the bottom of every printed page',answer:'hf',src:'TB p17',feedback:'A footer: printed at the bottom of every page.'},
  {type:'classify',text:'The filename printed at the top of each page',answer:'hf',src:'TB p17',feedback:'A header: printed at the top of every page.'},
  {type:'classify',text:'Today’s date printed at the foot of every page',answer:'hf',src:'TB p17',feedback:'Headers and footers can hold dates.'}
 ]},
{title:'Safe Sheet',teachAt:[0,1],mode:'sim',sim:'lights',heading:'Colour the sheet, crack the rules, keep the junk out',tip:'“Greater than or equal to 100” includes 100 itself. “Less than 70” leaves out 70. For validation, think about the smallest and the biggest real value, and whether it must be whole.',tasks:[]},
{title:'Exam Room',heading:'Real CCEA exam questions',teachAt:[0,1,2],boss:{icon:'🧯',name:'The Sheet Wrecker'},tip:'Name the tool exactly: conditional formatting, validation (or the check, such as a range check), template.',
 tasks:[],pool:[[[PP.cf2018d,PP.cf2019i],2],[[PP.val2018e,PP.val2021f,PP.val2026b],2],[[PP.tmpl2021e,PP.tmpl2023g],2]]}
]};
