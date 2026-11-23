#!/usr/bin/env python3
"""docs/font-audit/roles-data.json (+ crops/) -> docs/font-audit/decisions.html, a self-contained page where each role's variant is picked.
    python3 -I scripts/font-audit-decisions.py
"""
import json, base64, html, pathlib, collections
ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / 'docs' / 'font-audit'
src = json.load(open(OUT / 'roles-data.json'))
labels, d1440, d390 = src['labels'], src['data']['1440'], src['data']['390']
labels['generic'] = 'Без власного класу (span, p, a, li…)'
order = [k for k in labels if k in d1440 and k != 'hidden'] + [k for k in d1440 if k not in labels and k != 'hidden']

def crop(v):
    f = v.get('crop')
    if not f or not (OUT / f).exists():
        return ''
    return 'data:image/png;base64,' + base64.b64encode((OUT / f).read_bytes()).decode()

roles = []
for r in order:
    vs = [v for v in d1440[r]]
    total = sum(v['nodes'] for v in vs) or 1
    roles.append({
        'id': r, 'label': labels.get(r, r),
        'variants': [{
            'id': f'{r}:{i}', 'family': 'Serif' if v['family'] == 'Noto Serif' else 'Mono', 'size': v['size'], 'weight': v['weight'], 'style': v['style'],
            'lh': v['lh'], 'ls': v['ls'], 'tr': v['tr'], 'nodes': v['nodes'], 'share': round(v['nodes'] * 100 / total), 'pages': v['pages'],
            'sel': [s.split(' ‹ ')[0] for s in v['sel'][:3]], 'sample': v['sample'], 'page': v['page'], 'img': crop(v)} for i, v in enumerate(vs)],
        'phone': sorted({(('Serif ' if v['family'] == 'Noto Serif' else 'Mono ') + v['size']) for v in d390.get(r, [])}, key=lambda s: (s[:1] != 'S', float(s.split()[1]))),
    })
data = json.dumps(roles, ensure_ascii=False).replace('</', '<\\/')

page = '''<!-- Layout: one column of role cards, each card a list of the variants that exist today, with a crop of each. A sticky summary shows progress and the JSON to hand back. -->
<title>Font decisions</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Noto+Serif:wght@400;600&display=swap">
<style>
:root{--bg:#f7f7f4;--surface:#fff;--fg:#141414;--muted:#5d5d58;--line:#d9d9d2;--accent:#1a1aff;--accent-fg:#fff;--ok:#0a7d3c;--mark:#f0eebe;
--mono:"IBM Plex Mono",ui-monospace,Menlo,monospace;--serif:"Noto Serif",Georgia,serif}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#101011;--surface:#19191b;--fg:#ecece6;--muted:#a3a39b;--line:#333336;--accent:#8c8cff;--accent-fg:#101011;--ok:#4cc27d;--mark:#3b3a14;color-scheme:dark}}
:root[data-theme="dark"]{--bg:#101011;--surface:#19191b;--fg:#ecece6;--muted:#a3a39b;--line:#333336;--accent:#8c8cff;--accent-fg:#101011;--ok:#4cc27d;--mark:#3b3a14;color-scheme:dark}
*{box-sizing:border-box}
body{background:var(--bg);color:var(--fg);font:15px/1.5 var(--mono);padding-inline:max(16px,env(safe-area-inset-left,0px)) max(16px,env(safe-area-inset-right,0px));padding-block:24px 80px}
main{max-width:980px;margin:0 auto;display:flex;flex-direction:column;gap:20px}
h1{font:600 30px/1.15 var(--serif);letter-spacing:-.02em;margin:0 0 8px;text-wrap:balance}
p{margin:0}.lead{color:var(--muted);max-width:68ch}
.bar{position:sticky;top:env(safe-area-inset-top,0px);z-index:5;background:var(--bg);border-bottom:1px solid var(--line);padding:10px 0;display:flex;gap:12px;align-items:center;flex-wrap:wrap}
.bar .prog{flex:1;min-width:180px;font-size:13px;color:var(--muted)}
button{font:inherit;font-size:13px;border:1px solid var(--fg);background:var(--surface);color:var(--fg);padding:8px 14px;cursor:pointer}
button.primary{background:var(--accent);border-color:var(--accent);color:var(--accent-fg)}
button:focus-visible,input:focus-visible,textarea:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
section.role{background:var(--surface);border:1px solid var(--line);padding:16px;display:flex;flex-direction:column;gap:12px;min-width:0}
section.role header{display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;align-items:baseline}
section.role h2{font:600 18px/1.3 var(--serif);margin:0}
.status{font-size:12px;color:var(--muted)}.done .status{color:var(--ok)}
.single{font-size:13px;color:var(--muted)}
.var{display:grid;grid-template-columns:minmax(160px,300px) 1fr;gap:12px;align-items:start;border-top:1px solid var(--line);padding:12px 0;min-width:0}
.var input{margin-top:3px;width:18px;height:18px;accent-color:var(--accent)}
.shot{background:#fff;border:1px solid var(--line);min-height:40px;display:flex;align-items:center;padding:4px;overflow:hidden}
.shot img{max-width:100%;height:auto;display:block}.shot span{font-size:12px;color:#777}
.spec{font-size:13px;display:flex;flex-direction:column;gap:2px;min-width:0;overflow-wrap:anywhere}
.spec b{font-weight:500;font-size:14px}.spec .m{color:var(--muted)}
.top{background:var(--mark);padding:0 6px;font-size:11px;margin-left:6px}
.extra{display:flex;gap:12px;flex-wrap:wrap;align-items:center;border-top:1px solid var(--line);padding-top:12px;font-size:13px}
.extra label{display:flex;gap:6px;align-items:center;cursor:pointer}
.extra input[type=text]{font:inherit;border:1px solid var(--line);background:var(--bg);color:var(--fg);padding:6px 8px;flex:1;min-width:200px}
textarea{width:100%;min-height:140px;font:12px/1.4 var(--mono);background:var(--surface);color:var(--fg);border:1px solid var(--line);padding:10px}
.tag{display:inline-block;font-size:12px;border:1px solid var(--line);padding:2px 8px;margin:4px 6px 0 0}.tag.chg{background:var(--mark);border-color:transparent}.tag.mrg{background:var(--accent);border-color:var(--accent);color:var(--accent-fg)}
.after{border-top:2px solid var(--fg);padding-top:10px;font-size:13px;display:flex;flex-direction:column;gap:4px}.aft{display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap}.aft i{font-style:normal;color:var(--muted)}
.chip.own-val{border-style:dashed}
.pick{display:flex;flex-direction:column;gap:10px;border-top:1px solid var(--line);padding-top:12px}
.row{display:grid;grid-template-columns:92px 1fr;gap:12px;align-items:start;font-size:13px}.row .k{color:var(--muted);padding-top:7px}
.same{color:var(--muted);padding-top:7px}
.chips{display:flex;gap:8px;flex-wrap:wrap;align-items:center}
.chip{display:inline-flex;gap:8px;align-items:baseline;border-color:var(--line)}
.chip i{font-style:normal;font-size:11px;color:var(--muted)}
.chip[aria-checked=true]{background:var(--accent);border-color:var(--accent);color:var(--accent-fg)}.chip[aria-checked=true] i{color:inherit}
.own{font:inherit;font-size:13px;width:110px;border:1px solid var(--line);background:var(--bg);color:var(--fg);padding:7px 8px}
.prev{background:#fff;color:#000;border:1px solid var(--line);padding:10px 12px;max-width:100%;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}
.prevwrap{min-width:0}.keep{font-size:13px;display:flex;gap:8px;align-items:center;cursor:pointer}
@media (max-width:620px){.row{grid-template-columns:1fr;gap:4px}.row .k{padding-top:0}}
@media (max-width:620px){.var{grid-template-columns:1fr}}
</style>
<main>
<div><h1>Font decisions</h1>
<p class="lead">Each card is one kind of element on the site. Every look it has today is a row with a picture. Under each row, click the size it should have (the sizes offered are the ones already used for this element), or type your own. Line height and weight work the same way. Looks that end up identical merge, and the line at the bottom of the card shows what is left. A look you do not touch stays as it is.</p></div>
<div class="bar"><div class="prog" id="prog"></div><button id="reset">Clear</button><button class="primary" id="copy">Copy my choices</button></div>
<div id="roles" style="display:flex;flex-direction:column;gap:20px"></div>
<section class="role"><h2>Your choices (JSON)</h2><p class="status">Updates as you pick. Copy it and paste it into the chat.</p><textarea id="out" readonly></textarea></section>
</main>
<script>
const ROLES=__DATA__;
const KEY='font-decisions-v1';
let sel={};try{sel=JSON.parse(localStorage.getItem(KEY)||'{}')}catch(e){}
const $=s=>document.querySelector(s);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const spec=v=>`${v.family} ${v.size}px / ${v.lh==='normal'?'auto':v.lh}px · weight ${v.weight}${v.style==='italic'?' italic':''} · tracking ${v.ls}${v.tr!=='none'?' · '+v.tr:''}`;
function save(){try{localStorage.setItem(KEY,JSON.stringify(sel))}catch(e){}}
const PROPS=[['size','Size','px'],['lh','Line height','px'],['weight','Weight','']];
const distinct=(r,p)=>{const m=new Map();r.variants.forEach(v=>m.set(v[p],(m.get(v[p])||0)+v.nodes));return [...m.entries()].sort((a,b)=>b[1]-a[1]).map(x=>x[0])};
const num=x=>parseFloat(x)||0;
const touched=v=>{const c=sel[v.id]||{};return !!(c.size||c.lh||c.weight)};
function baseOf(v){const c=sel[v.id]||{};return {family:v.family,size:c.size||v.size,lh:c.lh||v.lh,weight:c.weight||v.weight,ls:v.ls,style:v.style,tr:v.tr}}
// Looks that were touched merge when family, size, weight and style match; the merged look takes the line height and tracking the user
// typed or clicked, otherwise those of its most used member. An untouched look joins a touched one of the same size.
function groups(r){
  const sk=f=>['T',f.family,f.size,f.weight,f.style,f.tr].join('|');
  const tk=new Set(r.variants.filter(touched).map(v=>sk(baseOf(v))));
  const g=new Map();
  r.variants.forEach(v=>{const f=baseOf(v);const k=(touched(v)||tk.has(sk(f)))?sk(f):['U',keyOf(f)].join('|');(g.get(k)||g.set(k,[]).get(k)).push(v)});
  return g;
}
function finalMap(r){
  const m=new Map();
  groups(r).forEach(vs=>{
    const base=baseOf(vs[0]);
    if(vs.length>1||touched(vs[0])){
      const explicitLh=vs.map(v=>(sel[v.id]||{}).lh).find(Boolean);
      const top=vs.slice().sort((a,b)=>b.nodes-a.nodes)[0];
      base.lh=explicitLh||top.lh;base.ls=top.ls;
    }
    vs.forEach(v=>m.set(v.id,base));
  });
  return m;
}
const finalOf=(r,v)=>finalMap(r).get(v.id);
const keyOf=f=>[f.family,f.size,f.lh,f.weight,f.ls,f.style,f.tr].join('|');
const label=f=>`${f.family} ${f.size}px / ${f.lh==='normal'?'auto':f.lh+'px'} · ${f.weight}${f.style==='italic'?' italic':''} · ${f.ls}`;
function render(){
  const host=$('#roles');host.innerHTML='';
  ROLES.forEach(r=>{
    const s=document.createElement('section');s.className='role';s.dataset.role=r.id;
    const multi=r.variants.length>1;
    let h=`<header><h2>${esc(r.label)}</h2><span class="status"></span></header>`;
    r.variants.forEach((v,i)=>{
      h+=`<div class="var" data-v="${v.id}"><div class="shot">${v.img?`<img src="${v.img}" alt="${esc(v.sample)}">`:`<span>no picture</span>`}</div>
        <div class="spec"><b>${esc(spec(v))}${i===0&&multi?'<span class="top">most used</span>':''}</b>
        <span class="m">${v.share}% of this element · ${v.pages} pages · ${esc(v.sel.slice(0,2).join(', '))}</span>`;
      if(multi){
        PROPS.forEach(([p,name,unit])=>{
          const vals=distinct(r,p);if(vals.length<2&&p!=='size')return;
          h+=`<div class="row"><span class="k">${name}</span><div class="chips" role="radiogroup" aria-label="${name} for this look">`;
          vals.forEach(x=>{h+=`<button type="button" class="chip${x===v[p]?' own-val':''}" role="radio" data-id="${v.id}" data-p="${p}" data-v="${esc(x)}">${esc(x)}${unit&&x!=='normal'?unit:''}</button>`});
          h+=`<input class="own" type="text" data-id="${v.id}" data-p="${p}" placeholder="other" aria-label="${name}, own value"></div></div>`;
        });
        h+=`<span class="merge"></span>`;
      }
      h+=`</div></div>`;
    });
    if(multi)h+=`<div class="after"></div>`;
    if(r.phone.length)h+=`<p class="status">On a phone (390 px): ${esc(r.phone.join(', '))}</p>`;
    s.innerHTML=h;host.appendChild(s);
    if(!multi)return;
    s.querySelectorAll('.chip').forEach(b=>b.addEventListener('click',()=>{const c=sel[b.dataset.id]=sel[b.dataset.id]||{};const v=r.variants.find(x=>x.id===b.dataset.id);
      c[b.dataset.p]=(c[b.dataset.p]===b.dataset.v||b.dataset.v===v[b.dataset.p])?null:b.dataset.v;refresh(r,s);update()}));
    s.querySelectorAll('.own').forEach(i=>i.addEventListener('input',()=>{const c=sel[i.dataset.id]=sel[i.dataset.id]||{};c[i.dataset.p]=i.value.trim()||null;refresh(r,s);update()}));
    refresh(r,s);
  });
  update();
}
function refresh(r,s){
  const g=groups(r);const keys=[...g.keys()];const fm=finalMap(r);
  const mateOf=v=>{for(const vs of g.values())if(vs.includes(v))return vs.filter(x=>x!==v);return []};
  s.querySelectorAll('.var').forEach(el=>{
    const v=r.variants.find(x=>x.id===el.dataset.v);const f=fm.get(v.id);const k=keyOf(f);const mates=mateOf(v);
    el.querySelectorAll('.chip').forEach(b=>{const c=sel[v.id]||{};const cur=c[b.dataset.p]||v[b.dataset.p];b.setAttribute('aria-checked',String(cur===b.dataset.v))});
    el.querySelectorAll('.own').forEach(i=>{const c=sel[v.id]||{};const val=c[i.dataset.p];const isOwn=val&&!distinct(r,i.dataset.p).includes(val);if(document.activeElement!==i)i.value=isOwn?val:''});
    const changed=k!==keyOf({family:v.family,size:v.size,lh:v.lh,weight:v.weight,ls:v.ls,style:v.style,tr:v.tr});
    el.querySelector('.merge').innerHTML=(changed?`<span class="tag chg">becomes ${esc(label(f))}</span>`:`<span class="tag">stays as it is</span>`)+(mates.length?`<span class="tag mrg">merged with ${mates.length} other ${mates.length>1?'looks':'look'}</span>`:'');
  });
  s.querySelector('.after').innerHTML=`<b>After: ${keys.length} ${keys.length>1?'looks':'look'}</b>`+keys.map(k=>{const vs=g.get(k);return `<div class="aft"><span>${esc(label(fm.get(vs[0].id)))}</span><i>${vs.length>1?vs.length+' looks merged':'1 look'} · ${vs.reduce((a,v)=>a+v.share,0)}%</i></div>`}).join('');
  s.classList.toggle('done',keys.length===1);
  s.querySelector('.status').textContent=keys.length===1?'one look':`${keys.length} looks`;
}
function result(){
  const o={};
  ROLES.forEach(r=>{
    const g=groups(r);
    o[r.id]={looksAfter:g.size,variants:r.variants.map(v=>{const f=finalOf(r,v);return {from:{family:v.family,size:v.size,lineHeight:v.lh,weight:v.weight,tracking:v.ls,style:v.style},to:{family:f.family,size:f.size,lineHeight:f.lh,weight:f.weight,tracking:f.ls,style:f.style},selectors:v.sel,pages:v.pages}})};
  });
  return o;
}
function update(){
  save();
  const multi=ROLES.filter(r=>r.variants.length>1);
  const one=multi.filter(r=>groups(r).size===1).length;
  $('#prog').textContent=`${one} of ${multi.length} elements down to one look`+(ROLES.length-multi.length?` · ${ROLES.length-multi.length} were already one look`:'');
  $('#out').value=JSON.stringify(result(),null,1);
}
$('#copy').addEventListener('click',async()=>{const t=$('#out');try{await navigator.clipboard.writeText(t.value);$('#copy').textContent='Copied'}catch(e){t.select();$('#copy').textContent='Select and copy below'}setTimeout(()=>$('#copy').textContent='Copy my choices',2000)});
$('#reset').addEventListener('click',()=>{sel={};render()});
render();
</script>
'''
(OUT / 'decisions.html').write_text(page.replace('__DATA__', data))
print('roles', len(roles), 'bytes', len(page) + len(data))
