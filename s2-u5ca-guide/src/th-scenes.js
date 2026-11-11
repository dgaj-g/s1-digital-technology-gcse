/* th-scenes.js: the drawings for the Topic 1 Learn screens (animations and pictures). Each scene draws step i into a stage element. */
(function(){
'use strict';
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const KW=/\b(static|void|int|string|class|public|new|return|using|var|bool|if)\b/g;
function tok(l){
  if(l.trimStart().startsWith('//')) return '<span class="c">'+esc(l)+'</span>';
  return l.split(/("[^"]*")/).map((p,idx)=>{
    if(idx%2===1) return '<span class="s">'+esc(p)+'</span>';
    let h=esc(p);
    h=h.replace(KW,'<span class="k">$1</span>');
    h=h.replace(/\b(\d+)\b/g,'<span class="nm">$1</span>');
    h=h.replace(/\b([A-Z]\w*)(?=\()/g,'<span class="m">$1</span>');
    return h;
  }).join('');
}
function code(lines,o){
  o=o||{};
  const hl=new Set(o.hl||[]),dim=new Set(o.dim||[]);
  const upto=o.upto||lines.length;
  let h='<pre class="cp'+(o.cls?' '+o.cls:'')+'">';
  lines.slice(0,upto).forEach((l,k)=>{
    const n=k+1,cls=['ln'];
    if(hl.has(n))cls.push('hl');
    if(dim.has(n))cls.push('dim');
    h+='<span class="'+cls.join(' ')+'">'+(o.nonum?'':'<span class="n">'+n+'</span>')+(o.plain?esc(l):tok(l))+'</span>';
  });
  return h+'</pre>';
}
function vb(name,val,chg,extra){return '<span class="vb'+(chg?' chg':'')+(extra?' '+extra:'')+'"><span class="vl">'+esc(name)+'</span><span class="vv">'+esc(val)+'</span></span>';}
function tg(text,cls){return '<span class="tg'+(cls?' '+cls:'')+'">'+text+'</span>';}
function cd(title,body,cls,chg){return '<div class="cd'+(cls?' '+cls:'')+(chg?' chg':'')+'"><div class="cdt">'+title+'</div><div class="cdb">'+body+'</div></div>';}
function note(text,chg){return '<div class="sn'+(chg?' chg':'')+'">'+text+'</div>';}
function vg(title,body,cls){return '<div class="vg'+(cls?' '+cls:'')+'"><div class="vgt">'+title+'</div>'+body+'</div>';}
function mem1(text,cls){return '<div class="mem1'+(cls?' '+cls:'')+'">'+text+'</div>';}

/* ---------- editor renderer ---------- */
const EDL=['using System;','class Program','{','    static void Main()','    {','        // say hello','        string name = "Alex";','        Console.WriteLine("Hello " + name);','    }','}'];
function ed(rows,o){
  o=o||{};
  let h='<div class="edwrap">'+(o.label?'<div class="edlab">'+o.label+'</div>':'')+'<pre class="ed cp'+(o.cls?' '+o.cls:'')+'">';
  let n=1;
  rows.forEach(r=>{
    const num=r.n||n; n=num+1;
    h+='<span class="ln'+(r.hl?' hl':'')+'"><span class="n">'+num+'</span><span class="fm">'+(r.fold||'')+'</span>'+(r.raw!==undefined?r.raw:tok(r.t))+(r.after||'')+'</span>';
  });
  return h+'</pre>'+(o.extra||'')+'</div>';
}
function edRows(i){
  const R=EDL.map(t=>({t}));
  R[1].fold='\u229f'; R[3].fold='\u229f';
  if(i===3){
    R[3].fold='\u229e'; R[3].hl=true;
    return R.slice(0,4).concat([{raw:'    <span class="foldbox">{ ... }</span>',n:5,hl:true},{t:'}',n:10}]);
  }
  if(i===4){
    R[7]={raw:'        '+esc('Con')+'<span class="caret"></span><span class="pop">'+'<span class="pi on">Console</span><span class="pi">ConsoleColor</span><span class="pi">ConsoleKey</span></span>',hl:true};
  }
  if(i===5){
    R[6]={raw:'        <span class="k">string</span> name = <span class="s">&quot;Alex&quot;</span><span class="sqg"> </span><span class="tip">; expected</span>',hl:true};
  }
  if(i===6){
    R.splice(7,0,{raw:'        <span class="caret"></span><span class="ghosttxt">indented automatically</span>',hl:true});
  }
  if(i===7){
    R[7].hl=true; R[7].after='<span class="tip ok">copied \u00b7 Ctrl+C</span>';
    R.splice(8,0,{t:EDL[7],hl:true,after:'<span class="tip ok">pasted \u00b7 Ctrl+V</span>'});
  }
  return R;
}
const EDLAB=['','Line numbering','Colour-coded text','Collapsible code sections','Code completion','Syntax-error assistance','Automatic indentation','Clipboard','Seven features: name different ones'];

/* ---------- biscuit shapes ---------- */
const STAR='M50 6 L61 38 L95 38 L68 58 L79 92 L50 72 L21 92 L32 58 L5 38 L39 38 Z';
function svg(inner){return '<svg class="bis" viewBox="0 0 100 100" aria-hidden="true">'+inner+'</svg>';}
function cutter(){return svg('<path d="'+STAR+'" fill="none" stroke="#8A86A0" stroke-width="5" stroke-linejoin="round"/>');}
function biscuit(deco){
  let d='<path d="'+STAR+'" fill="#E0B070" stroke="#B5844A" stroke-width="3" stroke-linejoin="round"/>';
  if(deco==='dots') d+='<circle cx="50" cy="48" r="6" fill="#E85D8A"/><circle cx="36" cy="60" r="4" fill="#E85D8A"/><circle cx="64" cy="60" r="4" fill="#E85D8A"/><circle cx="50" cy="30" r="4" fill="#E85D8A"/>';
  if(deco==='stripes') d+='<path d="M30 52 H70 M34 62 H66 M38 42 H62" stroke="#5A3A1A" stroke-width="4" stroke-linecap="round"/>';
  return svg(d);
}

const S={};

S.recipe=function(st){
  const card=(id,t,steps)=>'<div class="rc"><div class="rct"><span class="cid">'+id+'</span> '+t+'</div><ol>'+steps.map(s=>'<li>'+s+'</li>').join('')+'</ol></div>';
  st.innerHTML='<div class="sc recipe">'
   +'<div class="rc main"><div class="rct">Main card \u00b7 Lasagne</div><ol>'
   +'<li>Make the meat sauce <span class="ref">\u2192 card A</span></li>'
   +'<li>Make the cheese sauce <span class="ref">\u2192 card B</span></li>'
   +'<li>Assemble the layers <span class="ref">\u2192 card C</span></li>'
   +'<li>Bake <span class="ref">\u2192 card D</span></li></ol>'
   +tg('Main: where cooking starts','sw')+'</div>'
   +'<div class="rcs">'
   +card('A','Meat sauce',['Fry the onion and mince','Add the tomatoes','Simmer for 20 minutes'])
   +card('B','Cheese sauce',['Melt butter, stir in flour','Add milk and cheese'])
   +card('C','Assemble',['Layer pasta, meat sauce, cheese sauce','Repeat until the dish is full'])
   +card('D','Bake',['180 \u00b0C for 40 minutes','Rest for 5 minutes'])
   +'<div class="rcl">'+tg('Each small card: one procedure')+'</div></div></div>';
};

S.sum=function(st,i){
  const L=['static void Main(string[] args)','{','    int num1 = 4;','    int num2 = 7;','    int sum = CalculateSum(num1, num2);','    Console.WriteLine("The sum is " + sum);','}','static int CalculateSum(int a, int b)','{','    return a + b;','}'];
  const HL=[[1],[3],[4],[5,8],[8],[10],[10,5],[6],[]][i];
  let mv=vb('num1',i>=1?4:'\u2014',i===1)+vb('num2',i>=2?7:'\u2014',i===2)+vb('sum',i>=6?11:'\u2014',i===6);
  let cv=i>=4?vb('a',4,i===4)+vb('b',7,i===4):'<div class="sn" style="background:transparent;border:0;padding:4px 0;color:var(--mute)">waiting to be called</div>';
  let flow='';
  if(i>=3) flow='<div class="flow"><div>Main calls <b>CalculateSum(4, 7)</b> \u2193</div>'+(i>=4?'<div>copies: 4 \u2192 a, 7 \u2192 b</div>':'')+(i>=6?'<div>returns <b>11</b> \u2191</div>':'')+'</div>';
  const proc=i>=5?'<div class="proc'+(i===5?' chg':'')+'">a + b \u2192 4 + 7 = <b>11</b></div>':'';
  const out=i>=7?'<div class="out'+(i===7?' chg':'')+'">The sum is 11</div>':'';
  let legend='';
  if(i===8) legend='<div class="legend">'+tg('data: 4, 7, 11','gold')+tg('variables: num1, num2, sum')+tg('processing: a + b')+tg('method: CalculateSum','sw')+tg('names: num1, num2, sum, a, b, CalculateSum','dark')+'</div>';
  st.innerHTML='<div class="sc">'+code(L,{hl:HL})+'<div class="vars">'+vg('In Main',mv)+flow+vg('In CalculateSum',cv+proc,i<3?'faint':'')+out+'</div>'+legend+'</div>';
};

S.alex=function(st,i){
  const dpos=i>=6?1:0, dval=i>=5?1:0;
  let track='<div class="track">';
  for(let k=0;k<4;k++) track+='<div class="sq'+(k===dpos?' here':'')+'">'+(k===dpos?'<span class="hero'+(i===6?' chg':'')+'">\ud83e\uddd1\u200d\ud83d\ude80</span>':'')+'<span class="sqn">'+k+'</span></div>';
  track+='</div>';
  const board='<div class="board"><h5>The game screen</h5>'+track+(i>=6?'<div class="sn chg" style="margin-top:10px">drawn at square 1 because position = 1</div>':'')+'</div>';
  let data='';
  if(i>=1) data='<div class="dbox">'+(i>=7?tg('data','lab'):'<h5>Stored data</h5>')+vb('position',dval,i===1||i===5)+'</div>';
  let meth='';
  if(i>=2){
    const res=['\u2192 reads 0','\u2192 0 + 1 = 1','\u2192 position = 1'];
    const ins=['read the stored position','add 1 to it','store the new value'].map((t,k)=>'<li'+(i===3+k?' class="hl"':'')+'>'+t+(i===3+k?' <b>'+res[k]+'</b>':'')+'</li>').join('');
    meth=(i>=7?tg('method','lab'):'')+cd('Move()','<ol class="ins">'+ins+'</ol>','',i===2);
  }
  let right;
  if(i>=7) right='<div class="obj'+(i===7?' chg':'')+'"><div class="objt">'+tg('object: alex','sw')+'</div>'+data+meth+(i===8?'<div class="mem"><b>In memory</b><br><span class="cell">position: 1</span><span class="cell">Move\u2019s code</span></div>':'')+'</div>'+(i===8?note('The card above is a picture of the object. In the running program the object is a block of memory holding position, with Move\u2019s code able to read and change it.'):'');
  else right='<div class="vars">'+data+meth+'</div>';
  st.innerHTML='<div class="sc">'+board+right+'</div>';
};

S.alexcard=function(st){
  st.innerHTML='<div class="sc"><div class="obj"><div class="objt">'+tg('object: alex','sw')+'</div><div class="dbox">'+tg('data','lab')+vb('position',1)+'</div>'+tg('method','lab')+cd('Move()','<ol class="ins"><li>read the stored position</li><li>add 1 to it</li><li>store the new value</li></ol>')+'</div>'
   +'<div class="vars" data-slot="lines">'+vg('In Main',code(['alex.Move();'],{nonum:true})+'<div style="margin-top:6px">The object\u2019s name, a dot, then the method\u2019s name. This is how the program calls Move on alex.</div>')+'</div></div>';
};

S.cutter=function(st,i){
  if(i<=4){
    let h='<div class="sc bake">';
    h+='<div class="item">'+cutter()+'<div>biscuit cutter</div>'+(i>=4?tg('class','sw'):'')+'</div>';
    if(i>=1) h+='<div class="item'+(i===1||i===3?' chg':'')+'">'+biscuit(i>=3?'dots':'')+'<div>biscuit 1</div>'+(i>=4?tg('object (instance)'):'')+'</div>';
    if(i>=2) h+='<div class="item'+(i===2||i===3?' chg':'')+'">'+biscuit(i>=3?'stripes':'')+'<div>biscuit 2</div>'+(i>=4?tg('object (instance)'):'')+'</div>';
    st.innerHTML=h+'</div>';
    return;
  }
  const cls=cd('class Character',mem1('Position')+mem1('Move()',i===6?'hl':''),'',i===5);
  const o=(n,p)=>'<div class="obj"><div class="objt">'+tg('object: '+n,'sw')+'</div>'+mem1('Position = '+p)+mem1('Move()',i===6?'hl':'')+'</div>';
  st.innerHTML='<div class="sc game">'+cls+'<div class="arrows">new \u2192</div><div class="objs">'+o('alex',1)+o('bea',3)+'</div>'+(i===6?note('A cutter gives a shape only. A class also gives every object its methods, such as Move().'):'')+'</div>';
};

S.chcode=function(st,i){
  const L=['class Character','{','    public int Position;','    public void Move()','    {','        Position = Position + 1;','    }','}','Character alex = new Character();','Character bea = new Character();','alex.Position = 1;','bea.Position = 3;','alex.Move();'];
  const upto=[8,8,10,12,13][i], HL=[[1],[3,4,5,6,7],[9,10],[11,12],[13]][i];
  const A=[0,0,0,1,2][i], B=[0,0,0,3,3][i];
  let right='';
  if(i<2) right='<div class="vars">'+note(i===0?'The plan. No object exists yet.':'Every Character gets a Position and a Move method.')+'</div>';
  else{
    const o=(n,p,chg)=>'<div class="obj'+(i===2?' chg':'')+'"><div class="objt">'+tg('object: '+n,'sw')+'</div>'+vb('Position',p,chg)+mem1('Move()',i===4&&n==='alex'?'hl':'')+'</div>';
    right='<div class="objs">'+o('alex',A,i===3||i===4)+o('bea',B,i===3)+'</div>';
  }
  st.innerHTML='<div class="sc">'+code(L,{upto,hl:HL})+right+'</div>';
};

S.dog=function(st){
  st.innerHTML='<div class="sc dogsc">'
   +cd('Properties <small>(what it has)</small>','<ul class="kv"><li>Name = Rex</li><li>Breed = Collie</li><li>Age = 3</li></ul>')
   +'<div class="dogpic"><div class="big">\ud83d\udc15</div><div>'+tg('the dog object: rex','sw')+'</div></div>'
   +cd('Methods <small>(what it can do)</small>','<ul class="kv"><li class="hl">Sit() \u2190 called</li><li>Bark()</li><li>Fetch()</li></ul>')
   +'<div class="caller">'+code(['rex.Sit();'],{nonum:true})+'<div style="margin-top:6px">\u2192 the Sit method runs \u2192 Rex sits \ud83d\udc36</div></div>'
   +'</div>';
};

window.SCENES=S;
window.__scenelib={esc,code,vb,tg,cd,note,vg,mem1,ed,edRows,EDLAB,EDL};
})();

/* ---------- part B ---------- */
(function(){
'use strict';
const {esc,code,vb,tg,cd,note,vg,mem1,ed,edRows,EDLAB}=window.__scenelib;
const S=window.SCENES;

S.inherit=function(st,i){
  const animal=cd('class Animal '+(i===5?tg('parent class','sw'):''),mem1('Name')+mem1('Move()')+(i===5?'<div style="font-size:14px;color:var(--mute);margin-top:6px">also called the base class or superclass</div>':''));
  let dog='';
  if(i>=1){
    let body='';
    if(i===1) body=mem1('needs Name','q')+mem1('needs Move()','q');
    if(i>=2) body=mem1('Name'+(i>=4?' '+tg('reused'):''),'re'+(i===2?' chg':''))+mem1('Move()'+(i>=4?' '+tg('reused'):''),'re'+(i===2?' chg':''));
    if(i>=3) body+=mem1('Bark()'+(i>=4?' '+tg('added','gold'):''),'add'+(i===3?' chg':''));
    if(i===5) body+='<div style="font-size:14px;color:var(--mute);margin-top:6px">also called the derived class or subclass</div>';
    dog=(i>=2?'<div class="inh">Dog inherits from Animal \u2191</div>':'')+cd('class Dog '+(i===5?tg('child class','sw'):''),body,'',i===1);
  }
  st.innerHTML='<div class="sc inhsc">'+animal+dog+'</div>';
};

S.vend=function(st,i){
  // 0 five drinks. 1 could it just set stock itself? refused. 2 asks: calls Dispense. 3 checks. 4 releases. 5 updates. 6 the rule.
  const left=i>=4?4:5, stock=i>=5?4:5;
  let drinks=''; for(let k=0;k<left;k++) drinks+='🥤';
  const sub=['','','','is stock more than 0? <span class="nw">5 &gt; 0 ✓</span>','release one drink','stock = stock − 1',''][i]||'';
  const dataTag=i===0?'data':'🔒 data, protected';
  const vm='<div class="obj vm"><div class="objt">'+tg('object: machine','sw')+'</div>'
    +'<div class="shelf'+(i===4?' hl':'')+'">'+drinks+'</div>'
    +'<div class="tray'+(i===4?' hl chg':'')+'">'+(i>=4?'<span class="trd">🥤</span> one drink out':'')+'</div>'
    +'<div class="vdata'+(i===1?' no':'')+(i===3||i===5?' hl':'')+'"><div class="vdh">'+tg(dataTag,'lab')+'</div>'
    +'<div class="vdr">'+vb('stock',stock,i===5)+'<span class="vdn">the number of drinks available</span></div></div>'
    +'<div class="vmeth'+(i>=3&&i<=5?' hl':'')+'"><div class="vmh">'+tg('method','lab')+'<span class="vmn">Dispense()</span></div><div class="vsub">'+sub+'</div></div>'
    +'</div>';
  const who='<h5>Another part of the program</h5>';
  const ask=code(['machine.Dispense();'],{nonum:true});
  let caller='';
  if(i===1) caller='<div class="caller to-data"><div class="cbox no">'+who+'<div class="ctry">Just set stock to 4?</div><div class="nope">✗ Not allowed</div><div class="csub">stock is protected, so it stays at 5</div></div></div>';
  if(i>=2&&i<=5) caller='<div class="caller to-meth"><div class="cbox yes">'+who+ask+'<div class="yep">✓ Allowed</div><div class="csub"><span class="arw wide">←</span><span class="arw nar">↑</span> calls the machine’s own method</div></div></div>';
  if(i===6) caller='<div class="caller">'+who+'<div class="cbox no"><div class="ctry">Setting stock directly</div><div class="nope">✗ Not allowed</div></div><div class="cbox yes">'+ask+'<div class="yep">✓ Allowed: it calls a method</div></div></div>';
  st.innerHTML='<div class="sc vendsc">'+vm+caller+'</div>';
};

S.editor=function(st,i){
  const o={label:EDLAB[i]};
  if(i===1) o.cls='gut-hl';
  if(i===2) o.extra='<div class="legend">'+tg('keyword','dark')+tg('string','gold')+tg('comment')+'</div>';
  st.innerHTML='<div class="sc">'+ed(edRows(i),o)+'</div>';
};
S.editorpick=function(st){ st.innerHTML='<div class="sc">'+ed(edRows(4))+'</div>'; };

S.translate=function(st,i){
  let h='<div class="sc trsc">';
  h+=cd('Source code \u00b7 C#',code(['int total = 4;','Console.WriteLine(total);'],{nonum:true}),'tcard');
  if(i>=1) h+='<div class="tarr">\u2192</div>'+cd('Translation','<div class="gear">\u2699\ufe0f</div><div style="text-align:center">the compiler</div>','tcard',i===1);
  if(i>=2) h+='<div class="tarr">\u2192</div>'+cd('Machine code','<div class="bin">10110000 00000100<br>10001001 11000011<br>11101000 00010010</div><div style="font-size:13px;color:var(--mute)">illustrative, not the real output</div>','tcard',i===2);
  if(i===3) h+=note('The processor runs only machine code. Source code has to be translated before it can be carried out.');
  st.innerHTML=h+'</div>';
};

S.compint=function(st,i){
  const P=['total = 4','total = total + 1','print total'];
  const prog=(hl)=>'<div class="prog">'+P.map((l,k)=>'<div class="pl'+(hl.includes(k)?' hl':'')+'">'+esc(l)+'</div>').join('')+'</div>';
  const cOn=(i>=1&&i<=2)||i===5, iOn=(i>=3&&i<=4)||i===5;
  let c='<div class="col'+(cOn?' on':'')+'"><h5>Compiler</h5>'+prog(i>=1?[0,1,2]:[]);
  if(i>=1) c+='<div class="tarr'+(i===1?' chg':'')+'" style="font-size:18px">\u2193 translate the whole program first</div>';
  if(i>=2) c+=cd('Machine-code file','<div class="bin">10110000 00000100<br>\u2026</div><div style="font-size:13px">saved separately \u00b7 run any time</div>','',i===2);
  if(i===5) c+=note('Reports the syntax errors it found after attempting to compile the whole program. They must be fixed before the program will run.');
  c+='</div>';
  let n='<div class="col'+(iOn?' on':'')+'"><h5>Interpreter</h5>'+prog(i===3?[0]:i===4?[1,2]:[]);
  if(i>=3) n+='<div class="tarr'+(i===3?' chg':'')+'" style="font-size:18px">'+(i===3?'\u2193 translate line 1 \u2192 run it':'\u2193 then the next line, and the next')+'</div>';
  if(i>=3) n+='<div class="run'+(i===4?' chg':'')+'">'+(i===3?'line 1 ran':'line 1 ran \u00b7 line 2 ran \u00b7 line 3 ran')+'</div>';
  if(i>=4) n+='<div style="font-size:13px;color:var(--mute);margin-top:6px">no separate machine-code file is kept</div>';
  if(i===5) n+=note('Stops when it reaches the faulty statement.');
  n+='</div>';
  st.innerHTML='<div class="sc two">'+c+n+'</div>';
};

S.tasks=function(st,i){
  const T=[
    ['Lexical analysis','split the source code into tokens','<span class="tk">int</span><span class="tk">total</span><span class="tk">=</span><span class="tk">4</span><span class="tk">;</span>'],
    ['Syntax analysis','check each statement against the grammar','<code>int total = 4</code> \u2192 <span class="bad">syntax error: ; expected</span>'],
    ['Semantic analysis','check the meaning','<code>total = "hello"</code> \u2192 <span class="bad">type mismatch: total is an int</span>'],
    ['Include library code','bring in code you did not write','<code>Console.WriteLine</code> \u2192 from the library'],
    ['Generate machine code','translate and save','<div class="bin">10110000 00000100 \u2026</div>']
  ];
  st.innerHTML='<div class="tasksc">'+T.map((t,k)=>{
    const on=i>=1&&k===i-1;
    return '<div class="task'+(on?' on chg':(i>=1?' off':''))+'"><div class="tt">'+(k+1)+'. '+t[0]+'</div><div>'+t[1]+'</div>'+(on?'<div class="ex">'+t[2]+'</div>':'')+'</div>';
  }).join('')+'</div>';
};

/* ---------- Topic 2 number scenes ---------- */
const PV8=[128,64,32,16,8,4,2,1];
function nt(head,rows,cls){ // small number table: head = array of cell html, rows = array of {cells:[...],cls}
  let h='<table class="nt '+(cls||'')+'"><tr>'+head.map(x=>'<th>'+x+'</th>').join('')+'</tr>';
  rows.forEach(r=>{ h+='<tr class="'+(r.cls||'')+'">'+r.cells.map(c=>'<td class="'+(c.cls||'')+'">'+(c.v==null?'':c.v)+'</td>').join('')+'</tr>'; });
  return h+'</table>';
}
function sumLine(txt,chg){ return '<div class="sline'+(chg?' chg':'')+'">'+txt+'</div>'; }
S.bin2den=function(st,i){
  const bits='10110101'.split('');
  const rows=[];
  if(i>=1) rows.push({cells:bits.map((b,k)=>({v:b,cls:(i>=2&&b==='1')?'on'+(i===2?' chg':''):''}))});
  const ones=PV8.filter((v,k)=>bits[k]==='1');
  let extra='';
  if(i>=3) extra+=sumLine(ones.join(' + ')+(i>=4?' = <b>181</b>':''),i===3||i===4);
  if(i>=4) extra+=note('10110101 is 181 in denary.',true);
  st.innerHTML='<div class="sc numsc">'+nt(PV8.map((v,k)=>(i>=2&&bits[k]==='1')?'<span class="hon">'+v+'</span>':String(v)),rows)+extra+'</div>';
};
S.den2bin=function(st,i){
  const bits='10010011'.split(''); const done=Math.min(i,8);
  let left=147; const lefts=[];
  for(let k=0;k<8;k++){ lefts.push(left); if(bits[k]==='1') left-=PV8[k]; }
  const cells=PV8.map((v,k)=>k<done?{v:bits[k],cls:(bits[k]==='1'?'on':'')+(k===done-1?' chg':'')}:{v:'',cls:'wait'});
  let q='';
  if(i===0) q=sumLine('Amount left: <b>147</b>');
  else if(i<=8){ const k=i-1,h=PV8[k],l=lefts[k],yes=bits[k]==='1';
    const why=yes?(h===l?h+' is the same as '+l:h+' is smaller than '+l):h+' is bigger than '+l;
    q=sumLine('Can '+h+' be taken from '+l+'? <b>'+(yes?'Yes':'No')+'</b>: '+why+'. '+(yes?'Write 1. '+l+' − '+h+' = '+(l-h)+', so the amount left is <b>'+(l-h)+'</b>.':'Write 0. The amount left is still <b>'+l+'</b>.'),true); }
  if(i>=8) q+=note('The amount left is 0, so 147 is 10010011. Check: 128 + 16 + 2 + 1 = 147.',true);
  st.innerHTML='<div class="sc numsc">'+nt(PV8.map(String),[{cells:cells}])+q+'</div>';
};
function nib(b,h,hl){ return '<div class="nibb'+(hl?' chg':'')+'"><div class="nbits">'+b.split('').map(x=>'<span class="'+(x==='1'?'on':'')+'">'+x+'</span>').join('')+'</div><div class="nhead">8 4 2 1</div>'+(h?'<div class="nhex">'+h+'</div>':'')+'</div>'; }
S.hexintro=function(st,i){
  const HX='0123456789ABCDEF';
  let h='';
  if(i<=3){
    const upto=i===0?9:i===1?10:15;
    h=sumLine('A nibble\'s headings: 8 4 2 1');
    h+='<div class="hexgrid">'+Array.from({length:16},(_,v)=>{
      const b=v.toString(2).padStart(4,'0'), shown=v<=upto, fresh=(i===1&&v===10)||(i===2&&v>10)||(i===3&&v===15);
      return '<div class="hc'+(shown?(v>=10?' let':''):' wait')+(fresh?' chg':'')+'"><span class="hb">'+b+'</span>'+(shown?'<span class="hv">'+(v>=10?'= '+v:'&nbsp;')+'</span><span class="hd">'+HX[v]+'</span>':'<span class="hv">&nbsp;</span><span class="hd">?</span>')+'</div>';
    }).join('')+'</div>';
    if(i===3) h+=note('Sixteen different nibbles, so sixteen hex digits: ten from 0 to 9, and six from A to F.',true);
  } else {
    const j=i-4;
    if(j<=2){
      h='<div class="bytebig">10010011</div>';
      h+='<div class="nibrow">'+nib('1001',j>=1?'8 + 1 = 9 → <b>9</b>':'',j===1)+nib('0011',j>=1?'2 + 1 = 3 → <b>3</b>':'',j===1)+'</div>';
      if(j===2) h+=note('10010011 is <b>93</b> in hex. Eight digits became two.',true);
    } else {
      h='<div class="bytebig">11010110</div>';
      h+='<div class="nibrow">'+nib('1101','8 + 4 + 1 = 13 → <b>D</b>',true)+nib('0110','4 + 2 = 6 → <b>6</b>',true)+'</div>';
      h+=note('11010110 is <b>D6</b> in hex.',true);
    }
  }
  st.innerHTML='<div class="sc numsc">'+h+'</div>';
};
function takeLines(n){ // one line per heading, the same words as the caption
  let left=n,out='';
  [8,4,2,1].forEach(v=>{ if(v<=left){ out+=sumLine('Can '+v+' be taken from '+left+'? Yes, so write 1. '+left+' − '+v+' = '+(left-v)+' left.',true); left-=v; } else out+=sumLine('Can '+v+' be taken from '+left+'? No, so write 0.',true); });
  return out;
}
S.hexnib=function(st,i){
  let h='';
  if(i<=3){
    if(i===0) h='<div class="bytebig">11111011</div>';
    else h='<div class="nibrow">'+nib('1111','8 + 4 + 2 + 1 = 15 → <b>F</b>',i===1)+nib('1011',i>=2?'8 + 2 + 1 = 11 → <b>B</b>':'',i===2)+'</div>';
    if(i>=3) h+=note('11111011 is <b>FB</b> in hexadecimal.',true);
  } else {
    const j=i-4;
    if(j===0) h='<div class="bytebig">A9</div>';
    else h='<div class="nibrow">'+nib(j>=1?'1010':'----',j>=1?'A is 10 → <b>1010</b>':'',j===1)+nib(j>=2?'1001':'----',j>=2?'9 → <b>1001</b>':'',j===2)+'</div>';
    if(j===1) h+=takeLines(10);
    if(j===2) h+=takeLines(9);
    if(j>=3) h+=note('A9 is <b>10101001</b> in binary.',true);
  }
  if(i>=1) h+='<div class="hexkey">A = 10 · B = 11 · C = 12 · D = 13 · E = 14 · F = 15</div>';
  st.innerHTML='<div class="sc numsc">'+h+'</div>';
};
S.hexden=function(st,i){
  let h='<div class="bytebig">E3</div>';
  if(i>=1) h+='<div class="nibrow">'+nib('1110','E is 14 = 8 + 4 + 2',i===1)+(i>=2?nib('0011','3 = 2 + 1',i===2):'')+'</div>';
  if(i===1) h+=takeLines(14);
  if(i===2) h+=takeLines(3);
  if(i>=3){ const bits='11100011'.split(''); h+=nt(PV8.map((v,k)=>bits[k]==='1'?'<span class="hon">'+v+'</span>':String(v)),[{cells:bits.map(b=>({v:b,cls:b==='1'?'on':''}))}]); h+=sumLine('128 + 64 + 32 + 2 + 1'+(i>=4?' = <b>227</b>':''),i===3||i===4); }
  if(i>=5) {h+=sumLine('Check: E is 14 sixteens. 14 × 16 = 14 × 10 + 14 × 6.',true);h+=sumLine('14 × 10 = 140. 14 × 6 = 60 + 24 = 84.',true);h+=sumLine('140 + 84 = 224. Then 224 + 3 = <b>227</b>. It matches.',true);}
  h+='<div class="hexkey">A = 10 · B = 11 · C = 12 · D = 13 · E = 14 · F = 15</div>';
  st.innerHTML='<div class="sc numsc">'+h+'</div>';
};
S.addbytes=function(st,i){
  function addTab(a,b,upto,showOvf){ // upto = number of columns done from the right
    const A=a.split('').map(Number),B=b.split('').map(Number); const res=[],car=[]; let c=0;
    for(let k=7;k>=0;k--){ const s=A[k]+B[k]+c; res[k]=s%2; c=s>1?1:0; car[k]=c; }
    const col=k=>8-k<=upto; // column k done?
    const ovf=showOvf&&upto>=8&&c;
    const X=showOvf?[{v:'',cls:'blank'}]:[]; // the ninth column appears only for the overflow sum
    const head=[''].concat(showOvf?['<span class="ovfh">Overflow<br>bit</span>']:[]).concat(PV8.map(String));
    const rows=[
      {cls:'carry',cells:[{v:'carry'}].concat(X,PV8.map((v,k)=>({v:(k<7&&col(k+1)&&car[k+1])?'1':'',cls:(k<7&&col(k+1)&&car[k+1])?'on':''})))},
      {cells:[{v:''}].concat(X,A.map(x=>({v:x})))},
      {cells:[{v:'+'}].concat(X,B.map(x=>({v:x})))},
      {cls:'result',cells:[{v:'answer'}].concat(showOvf?[{v:ovf?'1':'',cls:ovf?'res ovf chg':'blank'}]:[],PV8.map((v,k)=>({v:col(k)?res[k]:'',cls:col(k)?'res'+(8-k===upto&&!showOvf?' chg':''):'wait'})))}
    ];
    return nt(head,rows,'addsc')+(upto>0&&upto<=8&&!showOvf?'<div class="colmark">column headed '+(1<<(upto-1))+'</div>':'');
  }
  let h='';
  if(i<=8){ h=addTab('01011011','00110111',i,false); if(i===8) h+=note('01011011 + 00110111 = <b>10010010</b>, which is 146.',true); }
  else if(i===9) h=addTab('11100011','01101110',0,true)+note('227 + 110 = 337. That is bigger than 255, so it cannot fit in a byte.',true);
  else { h=addTab('11100011','01101110',8,true); if(i===10) h+=note('The answer has nine bits. The 1 in the ninth column is <b>overflow</b>, circled in red.',true); else h+=note('The ninth bit is lost. The byte keeps only 01010001: 64 + 16 + 1 = 81. The true total is 256 + 81 = 337.',true); }
  st.innerHTML='<div class="sc numsc">'+h+'</div>';
};
S.truth=function(st,i){
  const rows=[[0,0],[0,1],[1,0],[1,1]];
  const body=rows.map((r,k)=>{ const done=i>=k+1; const pq=r[0]&&r[1]?1:0, out=pq?0:1;
    return {cls:(i===k+1?'chg':''),cells:[{v:r[0]},{v:r[1]},{v:done?pq:'',cls:done?'mid':'wait'},{v:done?out:'',cls:done?'res'+(out?' on':''):'wait'}]}; });
  let h=nt(['P','Q','<span class="mid">P AND Q</span>','NOT(P AND Q)'],body,'truthsc');
  if(i>=1&&i<=4){ const r=rows[i-1],pq=r[0]&&r[1]?1:0; h+=sumLine('Working column: P AND Q is '+pq+'. Answer column: NOT '+pq+' is <b>'+(pq?0:1)+'</b>.',true); }
  if(i>=5) h+=note('The answer column, NOT(P AND Q), reads 1, 1, 1, 0. Each cell or column can earn its own mark.',true);
  st.innerHTML='<div class="sc numsc">'+h+'</div>';
};
})();
