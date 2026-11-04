/* Activity 5 — Ski Trip. HQ_GAME_DESIGN 5 (deck section E). Sources: TB p19, TB p20; PP 2018 Q7(f), 2019 Q8(d)(e)(f), 2021 Q3(h)(i), 2022 Q3(e), 2023 Q4(e)(f), 2024 Q4(g)(h), 2024 Q10, 2025 Q6(b), 2026 Q6(f)(g). */
const SK_BASE={B1:52,B2:1400,B3:410,B4:180,B7:620};
const SK_QS=[
  {cell:'B2',name:'coach',text:'The coach company puts its price up from £1400 to £1500.',min:1400,max:1700,step:10,target:1500,
   why:'The coach is shared between 52 pupils, so £100 more on the coach adds only £1.92 to each pupil’s cost: £618.85, still under £620.'},
  {cell:'B4',name:'lift pass',text:'The ski resort puts each lift pass up from £180 to £185.',min:170,max:200,step:1,target:185,
   why:'Every pupil buys a lift pass, so a £5 rise adds the full £5 to each pupil’s cost: £616.92 becomes £621.92, over £620.'},
  {cell:'B1',name:'number of pupils',text:'Two pupils drop out, so 50 go instead of 52.',min:40,max:60,step:1,target:50,
   why:'With 50 pupils the hotel and lift pass still cost each pupil £590, but the coach is shared between fewer pupils, so each pays £28.00 for it instead of £26.92. The cost per pupil rises to £618.00, still under £620.'}];
const CD_COLS='ABCDE';
const CD_HEAD=['Item','Price (£)','Sold in May','Sold in June','Total sold'];
const CD_ROWS=[['Crisps','0.80',110,125,235],['Juice','1.00',85,100,185],['Apple','0.50',60,50,110],['Bar','1.00',90,75,165],['Water','0.70',95,150,245],['Total','',440,500,940]];
const CD_PAL=['#4f8cff','#ffb020','#2bb673','#e5484d','#9b6bff','#14b8c4'];
const CD_CHARTS=[
  {kind:'pie',vals:[3],ask:'🥧 Chart 1 of 2: a <b>pie chart</b> that shows each item’s share of all the items sold in <b>June</b>.'},
  {kind:'bar',vals:[2,3],ask:'📊 Chart 2 of 2: a <b>bar chart</b> that compares <b>May and June</b> sales for each item, with a legend that says which bar is which month.'}];
let CD=null,SK=null;
function sim_dial(area,finish){
  CD={k:0};SK={qs:gmShuffle(SK_QS),i:0,v:{...SK_BASE}};
  gmOpen(area,{title:'Turn the dial',icon:'🎿',stages:['Draw the charts','What if?','Find the limit'],lives:3,finish,bot:'🎿'});
  gmBanner('Plan the ski trip','First, make two charts from the tuck shop sheet: drag down a column to select a range, add it, and add every range the chart needs. Then use the ski trip spreadsheet to answer “what if” questions: predict first, then turn the dial and let the sheet do the sums. A wrong chart or a wrong prediction costs a life.','🥧 Open the sheet',()=>cdStart(0));
}
/* stage A: choose the chart ranges. Each range is judged on its own, the way the mark schemes list them */
const cdVal=(c,r)=>r===1?CD_HEAD[c]:CD_ROWS[r-2][c];
const cdName=g=>g.r1===g.r2?`${CD_COLS[g.c]}${g.r1}`:`${CD_COLS[g.c]}${g.r1}:${CD_COLS[g.c]}${g.r2}`;
function cdStart(k){
  gmStage(0);GM.state='play';gmMsg('');
  const ch=CD_CHARTS[k];CD.k=k;CD.ch=ch;CD.list=[];CD.sel=null;
  $('gmMain').innerHTML=`<div class="gm-q">${ch.ask} Select the ranges the chart is made from.</div>
<div class="cd-wrap"><div class="gm-panel cd-sheet"><div class="fh-bar"><span class="fh-name" id="cdName" aria-live="polite">Pick a range</span><span class="fh-fx">Tuck shop sales</span></div>
<table class="gm-tbl cd-tbl" id="cdT"><tr><th></th>${[...CD_COLS].map(c=>`<th>${c}</th>`).join('')}</tr>
${[1,2,3,4,5,6,7].map(r=>`<tr><th>${r}</th>${[...CD_COLS].map((c,ci)=>`<td tabindex="0" class="cd-c${r===1?' fh-h':''}${r===7?' cd-tot':''}" data-c="${ci}" data-r="${r}">${cdVal(ci,r)}</td>`).join('')}</tr>`).join('')}</table>
<div class="gm-btns cd-btns"><button class="btn btn-ghost" id="cdAdd">➕ Add this range</button></div>
<div class="cd-list" id="cdList" aria-live="polite"></div></div>
<div class="gm-panel cd-out"><div class="vs-h">Chart</div><div id="cdChart" class="cd-empty">Your chart appears here.</div>
<div class="gm-btns"><button class="btn btn-primary" id="cdGo">📈 Draw the chart</button></div></div></div>`;
  CD.grid=gmGridSelect($('cdT'),{off:()=>GM.state!=='play',move:R=>{CD.sel=R;$('cdName').textContent=gmRange(R);},done:R=>{CD.sel=R;$('cdName').textContent=gmRange(R);}});
  $('cdAdd').onclick=cdAdd;$('cdGo').onclick=cdDraw;cdList();
}
function cdAdd(){
  if(GM.state!=='play')return;const R=CD.sel;
  if(!R)return gmMsg('Select a range first: drag down a column, or tap a cell and then shift-tap another.','');
  if(R.c1!==R.c2)return gmMsg('Drag down one column at a time. The exam asks for each range on its own, such as A2:A6.','');
  if(CD.list.some(g=>g.c===R.c1))return gmMsg(`Column ${CD_COLS[R.c1]} is already in your list. Remove it first to choose it again.`,'');
  if(CD.list.length>=4)return gmMsg('That is plenty of ranges. Remove one before you add another.','');
  CD.list.push({c:R.c1,r1:R.r1,r2:R.r2});CD.sel=null;CD.grid.clear();$('cdName').textContent='Pick a range';gmMsg('');sfx('tick');cdList();
}
function cdList(marks){
  $('cdList').innerHTML=CD.list.length?`<span class="cd-lh">Ranges:</span>${CD.list.map((g,i)=>`<span class="cd-chip${g.c===0?' lab':' val'}${marks?' '+(marks[i]?'good':'bad'):''}">${marks?(marks[i]?'✓ ':'✗ '):''}${cdName(g)}${GM.state==='play'?`<button aria-label="Remove ${cdName(g)}" data-i="${i}">✕</button>`:''}</span>`).join('')}`:'<span class="cd-lh">Ranges: none yet.</span>';
  document.querySelectorAll('#cdList button').forEach(b=>b.onclick=()=>{if(GM.state!=='play')return;CD.list.splice(+b.dataset.i,1);cdList();});
}
/* one verdict per range: ok, or why that range is wrong */
function cdJudge(g,ch){
  const full=g.r2===6&&(g.r1===1||g.r1===2);
  if(g.c!==0&&ch.vals.indexOf(g.c)<0)return g.c===1?'Column B is the price, not a number sold.':g.c===4?'Column E is the total for May and June together.':ch.kind==='pie'?'Column C is May, but this chart is for June.':'';
  if(g.r2===7)return `${cdName(g)} includes the Total row, so “Total” becomes a ${ch.kind==='pie'?'slice':'bar'} as big as all the others put together. Stop at row 6.`;
  if(!full)return `${cdName(g)} leaves out some of the items. The items are in rows 2 to 6.`;
  return '';
}
function cdDraw(){
  if(GM.state!=='play')return;
  const ch=CD.ch,L=CD.list.find(g=>g.c===0),V=CD.list.filter(g=>g.c!==0).sort((a,b)=>a.c-b.c);
  if(!V.length)return gmMsg('Add a values range too: the numbers the chart is drawn from.','');
  GM.state='fb';
  const verdicts=CD.list.map(g=>cdJudge(g,ch)),bad=verdicts.filter(Boolean);
  let why=bad[0]||'';
  if(!why&&!L)why=`With no labels range, the ${ch.kind==='pie'?'slices':'bars'} are just numbered 1 to 5, so nobody can tell which item is which. Add the item names, A2:A6.`;
  if(!why&&ch.kind==='pie'&&V.length>1)why='A pie chart shows one set of numbers, so only the first values range is drawn. Keep only the June numbers.';
  if(!why&&ch.kind==='bar'&&V.length<2)why='Only one month is on the chart. Add a values range for each month: May and June.';
  if(!why&&ch.kind==='bar'&&V.some(g=>g.r1!==1))why=`The chart draws, but the legend says “Series 1” and “Series 2”, so nobody can tell May from June. Start each values range on its heading in row 1, such as C1:C6, and the headings become the legend.`;
  const marks=CD.list.map((g,i)=>!verdicts[i]&&!(ch.kind==='bar'&&g.c!==0&&g.r1!==1));
  cdList(marks);cdChart(L,V);
  if(!why){
    sfx('good');say(ch.kind==='pie'?'Lovely pie! 🥧':'Brilliant bars! 📊');
    const v=V[0],lh=L.r1===1,vh=v.r1===1;
    const msg=ch.kind==='pie'
      ?`Right. The exam answer is A2:A6 and D2:D6: the item names and the June numbers, data rows only, Total left out.${lh||vh?` Your ${[lh?'labels':'',vh?'values':''].filter(Boolean).join(' and ')} range${lh&&vh?'s start':' starts'} on the heading row, which a spreadsheet allows${vh?' (“Sold in June” becomes the chart title)':''}. For a chart with one set of numbers, write the data rows only in the exam: the 2022 mark scheme accepted only those.`:''}`
      :`Right: ${cdName(L)}, C1:C6 and D1:D6. Each values range starts on its heading, so the legend says “Sold in May” and “Sold in June”. The 2024 and 2026 mark schemes give the ranges this way: the labels from the first item, each values range from its heading.`;
    gmMsg(msg,'correct');
    return gmGo(CD.k===0?'📊 Next chart →':'🎿 Open the ski trip sheet →',CD.k===0?()=>cdStart(1):skQ);
  }
  const out=gmLose();say('That chart is wrong! 📉');gmMsg(why,'wrong');
  if(out)return gmGo('See what happened →',()=>gmEnd(0,'The chart was never right','Read the lesson on charts again, then have another go.'));
  gmGo('🔁 Fix the ranges →',()=>{GM.state='play';gmMsg('');cdList();});
}
function cdChart(L,V){
  const ch=CD.ch,rows=g=>{const a=[];for(let r=Math.max(2,g.r1);r<=g.r2;r++)a.push(r);return a;};
  const series=(ch.kind==='pie'?V.slice(0,1):V).map((g,i)=>({name:g.r1===1?CD_HEAD[g.c]:`Series ${i+1}`,rows:rows(g),vals:rows(g).map(r=>Number(cdVal(g.c,r)))}));
  const cats=series[0].rows.map((r,i)=>L&&r<=L.r2&&r>=Math.max(2,L.r1)?String(cdVal(0,r)):String(i+1));
  const box=$('cdChart');box.className='cd-chart';
  if(series.some(s=>s.vals.some(isNaN))){box.innerHTML='<div class="cd-broken">⚠️ The chart cannot be drawn: one range has words where numbers should be.</div>';return;}
  if(ch.kind==='pie'){
    const s=series[0],tot=s.vals.reduce((a,b)=>a+b,0);let acc=0;
    box.innerHTML=`${V[0].r1===1?`<div class="vs-h cd-title">${s.name}</div>`:''}<div class="cd-pie" style="background:conic-gradient(${s.vals.map((v,k)=>{const a=acc;acc+=v/tot*360;return `${CD_PAL[k%6]} ${a.toFixed(1)}deg ${acc.toFixed(1)}deg`;}).join(',')})"></div>
<div class="cd-key">${s.vals.map((v,k)=>`<span><i style="background:${CD_PAL[k%6]}"></i>${cats[k]}: ${Math.round(v/tot*100)}%</span>`).join('')}</div>`;
    return;
  }
  const max=Math.max(...series.flatMap(s=>s.vals));
  box.innerHTML=`<div class="cd-bars">${cats.map((c,k)=>`<div class="cd-grp"><div class="cd-bb">${series.map((s,i)=>`<i style="height:${Math.round((s.vals[k]||0)/max*100)}%;background:${CD_PAL[i]}" title="${s.name}: ${s.vals[k]}"></i>`).join('')}</div><span>${c}</span></div>`).join('')}</div>
<div class="cd-key">${series.map((s,i)=>`<span><i style="background:${CD_PAL[i]}"></i>${s.name}</span>`).join('')}</div>`;
}
/* stage B: what-if on the ski trip sheet */
const skCalc=v=>{const t=v.B2+v.B1*(v.B3+v.B4),p=t/v.B1;return {B5:t,B6:p,B8:p<=v.B7?'In budget':'Over budget'};};
const skMoney=n=>'£'+n.toFixed(2);
function skSheet(hot){
  const v=SK.v,o=skCalc(v);
  const rows=[['B1','Pupils going',v.B1,''],['B2','Coach (£)',v.B2,''],['B3','Hotel per pupil (£)',v.B3,''],['B4','Lift pass per pupil (£)',v.B4,''],
    ['B5','Total cost',skMoney(o.B5),'=B2+B1*(B3+B4)'],['B6','Cost per pupil',skMoney(o.B6),'=B5/B1'],['B7','Limit per pupil (£)',v.B7,''],['B8','Result',o.B8,'=IF(B6<=B7,"In budget","Over budget")']];
  return `<table class="gm-tbl sk-tbl"><tr><th></th><th>A</th><th>B</th><th class="sk-f">Formula in B</th></tr>${rows.map((r,k)=>`<tr><th>${k+1}</th><td>${r[1]}${r[3]?`<div class="sk-fm">${r[3]}</div>`:''}</td><td id="sk_${r[0]}" class="${r[0]===hot?'sk-hot':''}${r[0]==='B8'?(o.B8==='In budget'?' sk-in':' sk-over'):''}">${r[2]}</td><td class="sk-f">${r[3]}</td></tr>`).join('')}</table>`;
}
function skPaint(hot){$('skSheet').innerHTML=skSheet(hot);}
function skQ(){
  gmStage(1);GM.state='predict';gmMsg('');SK.v={...SK_BASE};
  const q=SK.qs[SK.i];
  $('gmMain').innerHTML=`<div class="gm-q">❓ What if ${SK.i+1} of ${SK.qs.length}: ${q.text} Will the trip still be in budget? Predict first.</div>
<div class="sk-wrap"><div class="gm-panel" id="skSheet">${skSheet()}</div>
<div class="gm-panel sk-side"><div class="vs-h">Your prediction</div><div class="mcq-list" id="skPred"><button class="mcq-btn" data-p="In budget">✅ Still in budget</button><button class="mcq-btn" data-p="Over budget">❌ Over budget</button></div>
<div class="sk-dial off" id="skDialBox"><div class="vs-h">The dial: ${q.name} (${q.cell})</div><input type="range" id="skDial" min="${q.min}" max="${q.max}" step="${q.step}" value="${SK.v[q.cell]}" disabled aria-label="${q.name}"><div class="sk-read" id="skRead">${SK.v[q.cell]}</div><div class="sk-hint" id="skHint">Make your prediction to unlock the dial.</div></div></div></div>`;
  document.querySelectorAll('#skPred .mcq-btn').forEach(b=>b.onclick=()=>{
    if(GM.state!=='predict')return;GM.state='dial';SK.pred=b.dataset.p;b.classList.add('chosen');
    document.querySelectorAll('#skPred .mcq-btn').forEach(x=>x.disabled=true);
    $('skDialBox').classList.remove('off');$('skDial').disabled=false;
    $('skHint').textContent=`Now turn the dial to ${q.cell==='B1'?q.target+' pupils':'£'+q.target} and watch the sheet.`;$('skDial').focus();
  });
  const turn=e=>{
    if(GM.state!=='dial')return;let x=+e.target.value;const was=SK.v[q.cell];
    if((was-q.target)*(x-q.target)<=0){x=q.target;e.target.value=x;}
    SK.v[q.cell]=x;$('skRead').textContent=x;skPaint(q.cell);
    if(x===q.target)skJudge(q);
  };
  $('skDial').oninput=turn;$('skDial').onchange=turn;
}
function skJudge(q){
  GM.state='fb';$('skDial').disabled=true;
  const o=skCalc(SK.v),ok=o.B8===SK.pred;
  if(ok){sfx('good');say('Good prediction! 🎯');gmMsg(`Right: “${o.B8}”. ${q.why} You changed one number and every formula worked out the rest.`,'correct');}
  else{
    const out=gmLose();say('Not what you predicted! 😮');
    gmMsg(`The sheet says “${o.B8}”. ${q.why}`,'wrong');
    if(out)return gmGo('See what happened →',()=>gmEnd(0,'The trip plan fell apart','Too many predictions were wrong. Read the lesson on data modelling again, then have another go.'));
  }
  SK.i++;
  gmGo(SK.i<SK.qs.length?'Next what if →':'🏁 Final challenge →',SK.i<SK.qs.length?skQ:skFinal);
}
function skFinal(){
  gmStage(2);GM.state='dial';gmMsg('');SK.v={...SK_BASE};
  $('gmMain').innerHTML=`<div class="gm-q">🏁 The school is choosing a coach company. What is the <b>highest</b> coach price that keeps the trip in budget? Turn the dial until the sheet flips, then lock in your price.</div>
<div class="sk-wrap"><div class="gm-panel" id="skSheet">${skSheet()}</div>
<div class="gm-panel sk-side"><div class="sk-dial"><div class="vs-h">The dial: coach (B2)</div><input type="range" id="skDial" min="1400" max="1700" step="10" value="1400" aria-label="coach price"><div class="sk-read" id="skRead">1400</div></div>
<div class="gm-btns"><button class="btn btn-primary" id="skLock">🔒 Lock in this price</button></div></div></div>`;
  $('skDial').oninput=e=>{if(GM.state!=='dial')return;SK.v.B2=+e.target.value;$('skRead').textContent=SK.v.B2;skPaint('B2');};
  $('skLock').onclick=()=>{
    if(GM.state!=='dial')return;
    const c=SK.v.B2,o=skCalc(SK.v);
    if(c===1560){GM.state='fb';$('skDial').disabled=true;$('skLock').disabled=true;sfx('good');say('Spot on! 🏔️');
      gmMsg('Right: £1560 gives exactly £620.00 per pupil. £1570 would push it to £620.19, over the limit. That is data modelling: you asked “what if?” and the sheet predicted the outcome.','correct');
      return gmGo('Finish →',()=>gmEnd(gmStars(GM.lives,3),'The trip is booked','You drew the right chart and used what-if modelling to make a better-informed decision.'));}
    const out=gmLose();say(o.B8==='In budget'?'You can go higher! ⬆️':'Over budget! ⬇️');
    gmMsg(o.B8==='In budget'?`At £${c} the trip is still in budget (${skMoney(o.B6)} per pupil), so this is not the highest price. Keep turning.`:`At £${c} the cost per pupil is ${skMoney(o.B6)}: over the £620 limit. Turn it back down.`,'wrong');
    if(out){GM.state='fb';return gmGo('See what happened →',()=>gmEnd(0,'The coach was never booked','Read the lesson on data modelling again, then have another go.'));}
  };
}
const ACT={
title:'Ski Trip',icon:'🎿',
intro:'Spreadsheets can turn numbers into pictures and answer questions about the future. Your mission: draw the right chart, then use a spreadsheet model to plan a school ski trip.',
topics:'Charts, data modelling (what if), macros',
ranks:['Trip Director','Senior Planner','Planning Trainee','New Starter — revise and retry'],
next:null,
teach:[
{teaches:['chart-type','chart-range','chart-series'],html:`<div class="teach-card"><h3>🥧 The picture: charts</h3>
<p>Using <span class="term">charts</span> can greatly assist in the communication of information. A range of charts can be used, such as bar charts and pie charts.</p>
<table class="gm-tbl"><tr><th>Chart</th><th>Use it to</th></tr><tr><td><b>Bar or column chart</b></td><td>Compare values, such as the profit on each item</td></tr><tr><td><b>Pie chart</b></td><td>Show how a whole is split into shares, such as each item’s share of all the items sold</td></tr></table>
<p style="margin-top:8px;">To make a chart, select the <b>labels</b> range (the item names, A2:A6) and a <b>values</b> range (the numbers, such as D2:D6). Leave out the Total row.</p>
<p style="margin-top:8px;"><b>One set of numbers:</b> give the data rows only, as above. That is the safe exam answer: the 2022 mark scheme accepted only the data rows.</p>
<p style="margin-top:8px;"><b>Two or more sets of numbers:</b> each set is called a <span class="term">series</span>. Select the labels and one values range for each series, and start each values range on its heading: A2:A6, C1:C6 (Sold in May) and D1:D6 (Sold in June). The headings become the legend, which says which bar is which. The 2024 and 2026 mark schemes give the ranges this way.</p>
<div class="tip-box">Exam focus: six papers ask for the cell ranges used to make a chart (2019, 2021, 2022, 2023, 2024, 2026). Others ask which type of chart was used, or what a chart shows (2019, 2023, 2024): name the thing being shown.</div></div>`},
{teaches:['data-modelling'],html:`<div class="teach-card"><h3>🎛️ The dial: data modelling</h3>
<p>Spreadsheets are used for <span class="term">data modelling</span>: mathematical formulas and calculations on data help predict outcomes for given situations. The model is controlled by a set of rules defined by formulas.</p>
<table class="gm-tbl"><tr><th>Cell</th><th>What it holds</th></tr><tr><td>B2 Coach</td><td>1400: a number you can change</td></tr><tr><td>B6 Cost per pupil</td><td>=B5/B1: a rule</td></tr><tr><td>B8 Result</td><td>=IF(B6&lt;=B7,"In budget","Over budget")</td></tr></table>
<p style="margin-top:8px;">Answering “what if” questions lets organisations predict future outcomes and make better-informed decisions.</p>
<div class="tip-box">Exam focus (2026): data modelling uses formulas to see what impact a change in the data entered has on other data in the spreadsheet, so outcomes can be predicted under different conditions.</div></div>`},
{teaches:['macro','hyperlink'],html:`<div class="teach-card"><h3>🔘 The button: macros</h3>
<p>A <span class="term">macro</span> is a small program written to perform a repetitive task automatically.</p>
<p style="margin-top:8px;">A macro can eliminate the need for the user to repeat the steps of commonly performed tasks over and over again. Tasks could range from adding a date to a worksheet to sophisticated calculations.</p>
<p style="margin-top:8px;">A button with a macro, or a <span class="term">hyperlink</span>, can take the user from one worksheet to another with one click. This makes a system easy to move around (2021).</p>
<div class="tip-box">Exam focus (2018, 2024): a macro is a short cut to a set of instructions that automatically carries out a repetitive task: a series of stored commands that can be activated using a button.</div></div>`}
],
rounds:[
{title:'Bar or Pie?',teachAt:[0],heading:'Which chart would you use?',tip:'Comparing values: bar or column chart. Shares of one whole: pie chart.',
 choices:[{key:'bar',label:'📊 Bar chart'},{key:'pie',label:'🥧 Pie chart'}],
 tasks:[
  {type:'classify',text:'Compare the profit made on each tuck shop item',answer:'bar',src:'TB p19',feedback:'Comparing values: a bar chart.'},
  {type:'classify',text:'Compare the amount each form class raised for charity',answer:'bar',src:'TB p19',feedback:'Comparing forms side by side: a bar chart.'},
  {type:'classify',text:'Compare the number of pupils in each year group',answer:'bar',src:'TB p19',feedback:'Comparing values: a bar chart.'},
  {type:'classify',text:'Compare the marks a pupil got in each of her five tests',answer:'bar',src:'TB p19',feedback:'Comparing five marks side by side: a bar chart.'},
  {type:'classify',text:'This week’s sales next to last week’s, for each item',answer:'bar',src:'TB p19',feedback:'Comparing two sets of values: a bar chart.'},
  {type:'classify',text:'Compare the number of members in each club',answer:'bar',src:'TB p19',feedback:'Comparing clubs side by side: a bar chart.'},
  {type:'classify',text:'Each item’s share of all the items sold',answer:'pie',src:'TB p19',feedback:'Shares of a whole: a pie chart.'},
  {type:'classify',text:'How the total trip cost is split between coach, hotel and lift passes',answer:'pie',src:'TB p19',feedback:'How a total is split: a pie chart.'},
  {type:'classify',text:'The share of the school’s energy that comes from each source',answer:'pie',src:'TB p19',feedback:'Shares of one whole: a pie chart.'},
  {type:'classify',text:'The number of votes each candidate got, side by side',answer:'bar',src:'TB p19',feedback:'Comparing values side by side: a bar chart.'},
  {type:'classify',text:'The share of the school budget spent by each department',answer:'pie',src:'TB p19',feedback:'Shares of a total: a pie chart.'},
  {type:'classify',text:'How a pupil’s school day is split between lessons, break and lunch',answer:'pie',src:'TB p19',feedback:'How one whole is split: a pie chart.'}
 ]},
{title:'Turn the Dial',teachAt:[0,1],mode:'sim',sim:'dial',heading:'Draw the chart, then ask what if',tip:'Labels: the item names. Values: the numbers. Leave out the Total row. Two or more series: start each values range on its heading. For what if, work out the cost per pupil before you turn the dial.',tasks:[]},
{title:'Exam Room',heading:'Real CCEA exam questions',teachAt:[0,1,2],boss:{icon:'🏔️',name:'The Avalanche'},tip:'Charts: name the type and what it shows. Data modelling: change a value, see the effect, predict outcomes. Macros: repetitive steps run automatically.',
 tasks:[],pool:[[[PP.dm2019f,PP.dm2025b1,PP.dm2025b2,PP.dm2025b3,PP.dm2026f],2],[[PP.ch2019d,PP.ch2019e1,PP.ch2019e2,PP.ch2021h,PP.ch2022e,PP.ch2023e,PP.ch2023f,PP.ch2024g,PP.ch2024h,PP.ch2026g],4],[[PP.mac2018f,PP.mac2021i,PP.mac2024q10],2]]}
]};
