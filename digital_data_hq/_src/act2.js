/* Activity 2 — Club Sign-Up. Data and information, data types (deck section A). Sources: TB p5, TB p6; PP 2018 Q1(a), 2019 Q2(a), 2021 Q4(c), 2023 Q1(b)(c), 2024 Q10, 2025 Q1(b). */
const FM_TYPES=['Integer','Real','Date/Time','Character','String'];
/* form fields: [label, example shown in the box, right type, {wrong type: what goes wrong}, why the right one is right] */
const FM_FIELDS=[
  ['Full name','Aoife Murphy','String',{Character:'A character is only ONE letter or digit. A name is a sequence of characters.'},'A name is text: a sequence of characters, so it is a string.'],
  ['Age in years','12','Integer',{Real:'An age in years has no decimal part, so it does not need a real number.',String:'A string is for text. The club wants to do sums with ages, so it needs a number type.'},'An age in years is a whole number, so it is an integer.'],
  ['Date of birth','14/03/2014','Date/Time',{String:'Stored as text, the computer could not put the dates in order or work out an age.',Integer:'A date has a day, a month and a year. It is not one whole number.'},'A date such as 14/03/2014 is stored as Date/Time.'],
  ['Mobile number','07700 900123','String',{Integer:'Stored as an integer, the 0 at the start and the space would be lost.',Real:'A phone number has no decimal part and nobody does sums with it.'},'A phone number is stored as a string, so the 0 at the start and the space are kept.'],
  ['Club fee (£)','4.50','Real',{Integer:'An integer has no decimal part, so £4.50 could not be stored.'},'4.50 has a decimal part, so it is a real number.'],
  ['Team letter','B','Character',{String:'It is only ever ONE letter, so a single character is the best fit.'},'One single letter is a character.'],
  ['Height in metres','1.52','Real',{Integer:'An integer has no decimal part, so 1.52 could not be stored.'},'1.52 has a decimal part, so it is a real number.'],
  ['Shirt number','7','Integer',{Real:'A shirt number has no decimal part.',Character:'It works for 7, but a character is only ONE digit. Shirt number 10 has two.'},'A shirt number is a whole number, so it is an integer.'],
  ['Training time','16:30','Date/Time',{Real:'16:30 is a time, not a number with a decimal part.',String:'Stored as text, the computer could not put the times in order.'},'A time such as 16:30 is stored as Date/Time.'],
  ['Postcode','BT34 2QN','String',{Character:'A character is only ONE letter or digit. A postcode has several.'},'A postcode is a sequence of letters and digits, so it is a string.']];
/* stage B: which line turns the data into information? [data, right line, wrong lines] */
const FM_INFO=[
  ['12',['Aoife Murphy is 12 years old','age: an integer'],['12','12, 13, 11','twelve']],
  ['16:30',['Training starts at 16:30 on Tuesdays'],['16:30','16:30, 17:30','1630']],
  ['4.50',['The club fee is £4.50 a week'],['4.50','4.5','4.50, 5.00, 3.00']],
  ['7',['Aoife wears shirt number 7'],['7','7, 9, 11','seven']],
  ['B',['Aoife plays for team B'],['B','A, B, C','b']],
  ['1.52',['Aoife is 1.52 metres tall'],['1.52','1.52, 1.48','152']]];
const FM_LOST=['The form was not finished','Read the lessons on data, information and data types again, then have another go.'];
let FM=null;
function sim_form(area,finish){
  const need=['String','Integer','Date/Time','Real','Character'];
  /* one field of every type, then one more */
  const pick=need.map(t=>ddPick(FM_FIELDS.filter(f=>f[2]===t),1)[0]);
  pick.push(ddPick(FM_FIELDS.filter(f=>!pick.includes(f)),1)[0]);
  FM={fields:gmShuffle(pick),i:0,done:[]};
  gmOpen(area,{title:'Build the form',icon:'📝',stages:['Set the data types','Make information'],lives:3,finish,bot:'📝'});
  gmBanner('Set up the sign-up form','The sports club is building a sign-up form. Choose the best data type for each box on the form. Then turn data from the form into information. A wrong answer costs a life.','📝 Open the form',fmField);
}
function fmForm(){
  return `<div class="dd-form">${FM.fields.map((f,i)=>`<div class="dd-frow${i===FM.i?' now':''}${i<FM.i?' done':''}"><label>${f[0]}</label><span class="dd-fbox">${f[1]}</span><span class="dd-ftype">${i<FM.i?f[2]:i===FM.i?'?':''}</span></div>`).join('')}</div>`;
}
function fmField(){
  gmStage(0);GM.state='play';gmMsg('');
  const f=FM.fields[FM.i];
  $('gmMain').innerHTML=`<div class="gm-q"><span class="dd-count">Box ${FM.i+1} of ${FM.fields.length}</span>Which data type is best for <b>${f[0]}</b>? An example is shown in the box.</div>
<div class="dd-two dd-two-wide"><div class="gm-panel">${fmForm()}</div><div class="gm-panel"><div class="vs-h">Data type</div><div class="mcq-list" id="fmT">${FM_TYPES.map(t=>`<button class="mcq-btn" data-t="${t}">${t}</button>`).join('')}</div></div></div>`;
  const bs=[...$('fmT').querySelectorAll('button')];
  bs.forEach(b=>b.onclick=()=>{
    if(GM.state!=='play')return;GM.state='fb';
    const t=b.dataset.t,last=FM.i===FM.fields.length-1;
    bs.forEach(x=>{x.disabled=true;if(x.dataset.t===f[2]&&x!==b)x.classList.add('missed');});
    const next=()=>{FM.i++;last?fmInfo():fmField();},label=last?'Next: make information →':'Next box →';
    if(t===f[2]){b.classList.add('correct');sfx('good');say('Yes! ✅');gmMsg('Right: '+f[4],'correct');return gmGo(label,next);}
    b.classList.add('wrong');const out=gmLose();say('Not that one ❌');
    gmMsg(`${f[3][t]||`${t} does not fit ${f[1]}.`} ${f[4]}`,'wrong');
    if(out)return gmGo('See what happened →',()=>gmEnd(0,FM_LOST[0],FM_LOST[1]));
    gmGo(label,next);
  });
}
function fmInfo(){
  gmStage(1);
  const qs=ddPick(FM_INFO,3);
  ddRun(qs.map((x,k)=>nx=>ddAsk({q:`<span class="dd-count">Question ${k+1} of 3</span>On its own, <b class="dd-data">${x[0]}</b> is data: it has no meaning. Which line turns it into <b>information</b>?`,
    opts:gmShuffle([{label:x[1][0],ok:true},...x[2].map(w=>({label:w,ok:false,why:`“${w}” is still raw facts and figures with no meaning.`}))]),
    why:`“${x[1][0]}” gives the data a meaning, so it is information.`,lost:FM_LOST,next:nx,nextLabel:k===2?'Finish →':'Next →'})),
    ()=>gmEnd(gmStars(GM.lives,3),'Form finished','Every box on the form has the right data type, and you turned data into information.'));
}

const ACT={
title:'Club Sign-Up',icon:'📝',
intro:'A sports club wants a sign-up form. Your mission: tell data from information, then choose the right data type for everything the form stores.',
topics:'Data and information; data types: integer, real, date/time, character, string',
ranks:['Club Secretary','Form Designer','Form Trainee','New Starter — revise and retry'],
next:{href:'activity3.html',label:'Next: Photo Lab'},
teach:[
{teaches:['data','information'],html:`<div class="teach-card"><h3>🧾 Data and information</h3>
<p><span class="term">Data</span> is raw facts and figures with no meaning attached.</p>
<p>When data is processed, or given meaning, it produces <span class="term">information</span>. Information is data with meaning.</p>
<table class="gm-tbl"><tr><th>Data</th><th>Information</th></tr>
<tr><td>62351</td><td>Product number 62351 is an 8Tb hard drive</td></tr>
<tr><td>14</td><td>There are 14 pupils in the chess club</td></tr></table>
<div class="tip-box">Exam focus: the 2019 and 2023 papers each show a table and ask for one example of data and one example of information from it. Data is one value from the table on its own. Information says what a value means.</div></div>`},
{teaches:['integer','real','datetime'],html:`<div class="teach-card"><h3>🔢 Data types for numbers, dates and times</h3>
<p>A <span class="term">data type</span> says what kind of data is being stored.</p>
<table class="gm-tbl"><tr><th>Data type</th><th>What it stores</th><th>Examples</th></tr>
<tr><td><b>Integer</b></td><td>A positive or negative whole number, with no decimal or fractional part</td><td>24, 125, -23</td></tr>
<tr><td><b>Real</b></td><td>A number with a decimal or fractional part, positive or negative</td><td>1.34, 6.2, -0.5</td></tr>
<tr><td><b>Date/Time</b></td><td>A date or a time</td><td>01/04/2018, 19:26</td></tr></table>
<div class="tip-box">Exam focus (2023): a student scores 51 in a module. The most appropriate data type for the score is integer, because 51 is a whole number.</div></div>`},
{teaches:['character','string'],html:`<div class="teach-card"><h3>🔤 Data types for text</h3>
<table class="gm-tbl"><tr><th>Data type</th><th>What it stores</th><th>Examples</th></tr>
<tr><td><b>Character</b></td><td>A single letter, digit or symbol</td><td>A, £, @</td></tr>
<tr><td><b>String</b></td><td>Text: a sequence of characters</td><td>Main Street, BT34 2QN</td></tr></table>
<p style="margin-top:8px;">A phone number such as 07700 900123 is stored as a <b>string</b>. Nobody does sums with it, and a number type would lose the 0 at the start.</p>
<div class="tip-box">Exam focus (2021): match the data to its type. 24, 125, -23 are integers. 1.34 and 6.2 are real. A, £, @ are characters. Main Street is a string.</div></div>`}
],
rounds:[
{title:'Data or Information?',teachAt:[0],variant:'fall',heading:'Is this data or information?',tip:'Data: a fact or figure on its own, with no meaning. Information: data that has been given meaning.',
 choices:[{key:'d',label:'🔢 Data'},{key:'i',label:'💬 Information'}],
 tasks:[
  {type:'classify',text:'62351',answer:'d',src:'TB p5',feedback:'A number on its own has no meaning. It is data.'},
  {type:'classify',text:'Product number 62351 is an 8Tb hard drive',answer:'i',src:'TB p5',feedback:'Now the number has a meaning. It is information.'},
  {type:'classify',text:'4.00',answer:'d',src:'PP 2019 Q2(a)(i)',feedback:'A figure on its own is data.'},
  {type:'classify',text:'The cost of a keyboard is £10.00',answer:'i',src:'PP 2019 Q2(a)(ii)',feedback:'The figure has been given a meaning.'},
  {type:'classify',text:'CM101',answer:'d',src:'PP 2023 Q1(c)(i)',feedback:'A code on its own is data.'},
  {type:'classify',text:'The average mark for 5 modules is 67',answer:'i',src:'PP 2023 Q1(c)(ii)',feedback:'The marks have been processed into an average with a meaning.'},
  {type:'classify',text:'17, 21, 19',answer:'d',src:'Practice, TB p5',feedback:'Raw figures with no meaning attached.'},
  {type:'classify',text:'The highest temperature this week was 21 °C',answer:'i',src:'Practice, TB p5',feedback:'The figures have been processed and given meaning.'},
  {type:'classify',text:'BT34',answer:'d',src:'Practice, TB p5',feedback:'Letters and digits on their own have no meaning.'},
  {type:'classify',text:'The bus to Newry leaves at 15:40',answer:'i',src:'Practice, TB p5',feedback:'15:40 now means something: when the bus leaves.'},
  {type:'classify',text:'Raw facts and figures',answer:'d',src:'TB p5',feedback:'This is the meaning of the word data.'},
  {type:'classify',text:'Data that has been processed and given meaning',answer:'i',src:'TB p5',feedback:'This is the meaning of the word information.'}
 ]},
{title:'Which Data Type?',teachAt:[1,2],variant:'belt',heading:'Which data type should store this?',tip:'Whole number: integer. Decimal part: real. One letter, digit or symbol: character. Text: string.',
 choices:[{key:'int',label:'🔢 Integer'},{key:'real',label:'📏 Real'},{key:'dt',label:'📅 Date/Time'},{key:'chr',label:'🔠 Character'},{key:'str',label:'💬 String'}],
 tasks:[
  {type:'classify',text:'24',answer:'int',src:'PP 2021 Q4(c)',feedback:'A whole number is an integer.'},
  {type:'classify',text:'-23',answer:'int',src:'PP 2021 Q4(c)',feedback:'An integer can be negative. It still has no decimal part.'},
  {type:'classify',text:'A module score of 51',answer:'int',src:'PP 2023 Q1(b)',feedback:'51 is a whole number, so it is an integer.'},
  {type:'classify',text:'1.34',answer:'real',src:'PP 2021 Q4(c)',feedback:'It has a decimal part, so it is real.'},
  {type:'classify',text:'6.2',answer:'real',src:'PP 2021 Q4(c)',feedback:'It has a decimal part, so it is real.'},
  {type:'classify',text:'A price of 4.99',answer:'real',src:'Practice, TB p5',feedback:'A price has a decimal part, so it is real.'},
  {type:'classify',text:'01/04/2018',answer:'dt',src:'TB p5',feedback:'A date is stored as Date/Time.'},
  {type:'classify',text:'19:26',answer:'dt',src:'TB p5',feedback:'A time is stored as Date/Time.'},
  {type:'classify',text:'@',answer:'chr',src:'PP 2021 Q4(c)',feedback:'One single symbol is a character.'},
  {type:'classify',text:'£',answer:'chr',src:'PP 2021 Q4(c)',feedback:'One single symbol is a character.'},
  {type:'classify',text:'The single letter A',answer:'chr',src:'PP 2021 Q4(c)',feedback:'One single letter is a character.'},
  {type:'classify',text:'Main Street',answer:'str',src:'PP 2021 Q4(c)',feedback:'A sequence of characters is a string.'},
  {type:'classify',text:'The mobile number 07700 900123',answer:'str',src:'Practice, TB p6',feedback:'A string keeps the 0 at the start and the space.'},
  {type:'classify',text:'The surname Gallagher',answer:'str',src:'Practice, TB p6',feedback:'A name is a sequence of characters: a string.'}
 ]},
{title:'Build the Form',teachAt:[],mode:'sim',sim:'form',heading:'Choose the data type for each box, then make information',tip:'Look at the example in the box. Whole number, decimal part, date or time, one character, or text?',tasks:[]},
{title:'Exam Room',heading:'Real CCEA exam questions',teachAt:[],boss:{icon:'🗂️',name:'The Paper Jam'},tip:'Data has no meaning on its own. Information is data with meaning. For a data type, look for a decimal part first.',
 pool:[[[PP.di2018a,PP.di2019ai,PP.di2019aii,PP.di2023ci,PP.di2023cii,PP.di2025b,PP.ty2021c,PP.ty2023b,PP.ty2024j],6]],tasks:[]}
]};
