// Atomic weights are fixed game values (thousandths), not isotope masses.
export const ELEMENTS = {
 H:{name:'氢',z:1,mass:1008,bg:'#fffdf5',ink:'#30453d',accent:'#ccd8c9',weight:310,color:'无色气体'},
 C:{name:'碳',z:6,mass:12011,bg:'#343b37',ink:'#f4f0e3',accent:'#647066',weight:160,color:'石墨灰黑'},
 N:{name:'氮',z:7,mass:14007,bg:'#f4f5ef',ink:'#33433f',accent:'#9bafa9',weight:85,color:'无色气体'},
 O:{name:'氧',z:8,mass:15999,bg:'#fdfcf6',ink:'#334843',accent:'#90acb2',weight:240,color:'无色气体'},
 Na:{name:'钠',z:11,mass:22990,bg:'#dce0dc',ink:'#34413a',accent:'#9eaaa2',weight:45,color:'银白色'},
 Mg:{name:'镁',z:12,mass:24305,bg:'#e2e5df',ink:'#34413a',accent:'#adb7ab',weight:30,color:'银白色'},
 Al:{name:'铝',z:13,mass:26982,bg:'#d4dcdd',ink:'#2c3e43',accent:'#93a5aa',weight:20,color:'银白色'},
 Si:{name:'硅',z:14,mass:28085,bg:'#68716e',ink:'#fff8e8',accent:'#9aaba3',weight:14,color:'灰黑色'},
 P:{name:'磷',z:15,mass:30974,bg:'#a25947',ink:'#fff6e8',accent:'#c28669',weight:28,color:'红磷暗红'},
 S:{name:'硫',z:16,mass:32060,bg:'#e6c958',ink:'#574624',accent:'#b99835',weight:42,color:'淡黄色'},
 Cl:{name:'氯',z:17,mass:35450,bg:'#cbd48c',ink:'#3d4b25',accent:'#9dad5a',weight:66,color:'黄绿色气体'},
 K:{name:'钾',z:19,mass:39098,bg:'#e0dfdf',ink:'#3b4142',accent:'#acaeb4',weight:23,color:'银白色'},
 Ca:{name:'钙',z:20,mass:40078,bg:'#d3d8cb',ink:'#364233',accent:'#99a690',weight:31,color:'银白色'},
 Fe:{name:'铁',z:26,mass:55845,bg:'#adb6b1',ink:'#293b34',accent:'#7b8d82',weight:30,color:'银灰色'},
 Cu:{name:'铜',z:29,mass:63546,bg:'#b57650',ink:'#fff8e5',accent:'#d7a071',weight:18,color:'紫红色，取铜色'},
 Zn:{name:'锌',z:30,mass:65380,bg:'#c5d0d1',ink:'#2d4248',accent:'#8aabaf',weight:18,color:'蓝白色'},
 Br:{name:'溴',z:35,mass:79904,bg:'#8e4030',ink:'#fff0df',accent:'#b76748',weight:24,color:'红棕色液体'},
 Ag:{name:'银',z:47,mass:107868,bg:'#e9e8e1',ink:'#3b4642',accent:'#b8bdb5',weight:16,color:'银白色'},
 I:{name:'碘',z:53,mass:126904,bg:'#4e4353',ink:'#f4e9f0',accent:'#8b7290',weight:24,color:'紫黑色晶体'}
};
export function parseFormula(formula){
 const tokens=formula.match(/[A-Z][a-z]?|\d+|[()]/g);if(!tokens||tokens.join('')!==formula)throw Error('无效化学式');let i=0;
 function group(nested=false){const out={};while(i<tokens.length){let t=tokens[i++];if(t===')'){if(!nested)throw Error('括号不匹配');return out;}let part;if(t==='(')part=group(true);else{if(!ELEMENTS[t])throw Error('不支持的元素 '+t);part={[t]:1};}const n=/^\d+$/.test(tokens[i]||'')?Number(tokens[i++]):1;if(n<1)throw Error('下标必须大于零');for(const [e,c]of Object.entries(part))out[e]=(out[e]||0)+c*n;}if(nested)throw Error('括号不匹配');return out;}return group();
}
export const countCards=cards=>cards.reduce((a,e)=>(a[e]=(a[e]||0)+1,a),{});
export const keyOf=counts=>Object.keys(counts).filter(e=>counts[e]>0).sort().map(e=>e+counts[e]).join('|');
export const atomCount=counts=>Object.values(counts).reduce((a,b)=>a+b,0);
export const massOf=counts=>Object.entries(counts).reduce((s,[e,n])=>s+ELEMENTS[e].mass*n,0);
export const expand=counts=>Object.entries(counts).flatMap(([e,n])=>Array(n).fill(e));
export function formulaOf(counts){const keys=Object.keys(counts).filter(e=>counts[e]>0);keys.sort((a,b)=>{if(counts.C){if(a==='C')return -1;if(b==='C')return 1;if(a==='H')return -1;if(b==='H')return 1;}return ELEMENTS[a].z-ELEMENTS[b].z;});return keys.map(e=>e+(counts[e]>1?counts[e]:'')).join('');}
export const formatFormula=f=>f.replace(/(\d+)/g,'<sub>$1</sub>');
export const massText=m=>(m/1000).toFixed(3);
export const SUBSTANCES=[];
function add(name,formula,category,graph=null){const counts=parseFormula(formula);SUBSTANCES.push({id:'s'+SUBSTANCES.length,name,formula,category,counts,key:keyOf(counts),mass:massOf(counts),size:atomCount(counts),graph});}
const inorganic={
 '单质':[['氢气','H2'],['氮气','N2'],['氧气','O2'],['臭氧','O3'],['氯气','Cl2'],['溴','Br2'],['碘','I2'],['白磷','P4'],['环八硫','S8']],
 '无机物':[['水','H2O'],['过氧化氢','H2O2'],['氨','NH3'],['氯化氢','HCl'],['溴化氢','HBr'],['碘化氢','HI'],['硫化氢','H2S'],['硅烷','SiH4'],['二硫化碳','CS2'],['三氯化磷','PCl3'],['五氯化磷','PCl5']],
 '氧化物':[['一氧化碳','CO'],['二氧化碳','CO2'],['一氧化氮','NO'],['二氧化氮','NO2'],['一氧化二氮','N2O'],['四氧化二氮','N2O4'],['二氧化硫','SO2'],['三氧化硫','SO3'],['二氧化硅','SiO2'],['氧化钠','Na2O'],['过氧化钠','Na2O2'],['氧化镁','MgO'],['氧化钙','CaO'],['氧化亚铁','FeO'],['氧化铁','Fe2O3'],['四氧化三铁','Fe3O4'],['氧化银','Ag2O'],['氧化铝','Al2O3'],['氧化铜','CuO'],['氧化亚铜','Cu2O'],['氧化锌','ZnO']],
 '酸与碱':[['亚硝酸','HNO2'],['硝酸','HNO3'],['硫酸','H2SO4'],['磷酸','H3PO4'],['氢氧化钠','NaOH'],['氢氧化钾','KOH'],['氢氧化镁','Mg(OH)2'],['氢氧化钙','Ca(OH)2'],['氢氧化亚铁','Fe(OH)2'],['氢氧化铁','Fe(OH)3'],['氢氧化铜','Cu(OH)2'],['氢氧化铝','Al(OH)3']],
 '盐':[['氯化钠','NaCl'],['溴化钠','NaBr'],['碘化钠','NaI'],['氯化钾','KCl'],['溴化钾','KBr'],['碘化钾','KI'],['氯化镁','MgCl2'],['氯化钙','CaCl2'],['氯化亚铁','FeCl2'],['氯化铁','FeCl3'],['氯化铝','AlCl3'],['氯化铜','CuCl2'],['氯化锌','ZnCl2'],['氯化银','AgCl'],['溴化银','AgBr'],['碘化银','AgI'],['氯化铵','NH4Cl'],['溴化铵','NH4Br'],['碘化铵','NH4I'],['硝酸铵','NH4NO3'],['硫酸铵','(NH4)2SO4'],['碳酸氢铵','NH4HCO3'],['碳酸钠','Na2CO3'],['碳酸氢钠','NaHCO3'],['碳酸钙','CaCO3'],['碳酸镁','MgCO3'],['碳酸钾','K2CO3'],['亚硝酸钠','NaNO2'],['硝酸钠','NaNO3'],['硝酸钾','KNO3'],['硝酸银','AgNO3'],['硫酸钠','Na2SO4'],['亚硫酸钠','Na2SO3'],['硫酸镁','MgSO4'],['硫酸钙','CaSO4'],['硫酸亚铁','FeSO4'],['硫酸铜','CuSO4'],['硫酸锌','ZnSO4'],['硫化钠','Na2S'],['硫化亚铁','FeS'],['硫化银','Ag2S'],['磷酸二氢钠','NaH2PO4'],['磷酸氢二钠','Na2HPO4'],['磷酸钠','Na3PO4'],['磷酸钙','Ca3(PO4)2'],['硅酸钠','Na2SiO3']]
};
for(const [cat,rows]of Object.entries(inorganic))for(const [name,f]of rows)add(name,f,cat);
const VALENCE={C:4,N:3,O:2,Cl:1,Br:1,I:1,S:2};
function organic(name,atoms,bonds,reference){const nodes=atoms.map((e,i)=>{const used=bonds.reduce((s,[a,b,o])=>s+((a===i||b===i)?o:0),0);const h=VALENCE[e]-used;if(h<0)throw Error('价态错误 '+name);return {e,h,label:e+(h?'H'+(h>1?h:''):'')};});const counts={};for(const n of nodes){counts[n.e]=(counts[n.e]||0)+1;if(n.h)counts.H=(counts.H||0)+n.h;}add(name,formulaOf(counts),'有机物',{nodes,bonds,reference});}
const cn=['','甲','乙','丙','丁','戊','己','庚','辛'];
const chain=n=>Array.from({length:n-1},(_,i)=>[i,i+1,1]);
for(let n=1;n<=8;n++){
 organic((n>3?'正':'')+cn[n]+'烷',Array(n).fill('C'),chain(n),n===1?'CH₄':n===2?'CH₃—CH₃':`CH₃—(CH₂)${n-2}—CH₃`);
 if(n>=2){let b=chain(n);b[0][2]=2;organic((n>3?'1-':'')+cn[n]+'烯',Array(n).fill('C'),b,'末端两个碳之间为双键，其余为单键');b=chain(n);b[0][2]=3;organic((n>3?'1-':'')+cn[n]+'炔',Array(n).fill('C'),b,'末端两个碳之间为三键，其余为单键');}
 organic((n>=3?'1-':'')+cn[n]+'醇',[...Array(n).fill('C'),'O'],[...chain(n),[n-1,n,1]],'直链碳骨架，末端连接 —OH');
 organic(cn[n]+'醛',[...Array(n).fill('C'),'O'],[...chain(n),[n-1,n,2]],'直链碳骨架，末端为 —CH=O（甲醛为 H₂C=O）');
 organic(cn[n]+'酸',[...Array(n).fill('C'),'O','O'],[...chain(n),[n-1,n,2],[n-1,n+1,1]],'末端羧基：—C(=O)—OH');
}
organic('异丙醇',['C','C','C','O'],[[0,1,1],[1,2,1],[1,3,1]],'CH₃—CH(OH)—CH₃');
organic('乙二醇',['O','C','C','O'],chain(4),'HO—CH₂—CH₂—OH');
organic('甘油',['C','C','C','O','O','O'],[[0,1,1],[1,2,1],[0,3,1],[1,4,1],[2,5,1]],'HOCH₂—CH(OH)—CH₂OH');
organic('二甲醚',['C','O','C'],chain(3),'CH₃—O—CH₃');
organic('乙醚',['C','C','O','C','C'],chain(5),'CH₃CH₂—O—CH₂CH₃');
organic('丙酮',['C','C','C','O'],[[0,1,1],[1,2,1],[1,3,2]],'CH₃—C(=O)—CH₃');
organic('甲酸甲酯',['C','O','O','C'],[[0,1,2],[0,2,1],[2,3,1]],'H—C(=O)—O—CH₃');
organic('乙酸甲酯',['C','C','O','O','C'],[[0,1,1],[1,2,2],[1,3,1],[3,4,1]],'CH₃—C(=O)—O—CH₃');
organic('乙酸乙酯',['C','C','O','O','C','C'],[[0,1,1],[1,2,2],[1,3,1],[3,4,1],[4,5,1]],'CH₃—C(=O)—O—CH₂—CH₃');
organic('甲胺',['C','N'],[[0,1,1]],'CH₃—NH₂');
organic('乙胺',['C','C','N'],chain(3),'CH₃—CH₂—NH₂');
organic('尿素',['N','C','N','O'],[[0,1,1],[1,2,1],[1,3,2]],'H₂N—C(=O)—NH₂');
organic('甘氨酸',['N','C','C','O','O'],[[0,1,1],[1,2,1],[2,3,2],[2,4,1]],'H₂N—CH₂—C(=O)—OH');
organic('丙氨酸',['C','C','N','C','O','O'],[[0,1,1],[1,2,1],[1,3,1],[3,4,2],[3,5,1]],'CH₃—CH(NH₂)—C(=O)—OH');
organic('乙腈',['C','C','N'],[[0,1,1],[1,2,3]],'CH₃—C≡N');
const ring=Array.from({length:6},(_,i)=>[i,(i+1)%6,i%2===0?2:1]);
organic('苯',Array(6).fill('C'),ring,'六元碳环，单键与双键交替');
organic('环己烷',Array(6).fill('C'),ring.map(([a,b])=>[a,b,1]),'六个 CH₂ 以单键首尾相连');
for(const [name,e]of [['甲苯','C'],['苯酚','O'],['苯胺','N'],['氯苯','Cl'],['溴苯','Br'],['碘苯','I']])organic(name,[...Array(6).fill('C'),e],[...ring,[0,6,1]],'六元碳环单双键交替，支链连接不带氢的环碳');
for(const [e,name]of [['Cl','氯'],['Br','溴'],['I','碘']])for(let n=1;n<=3;n++)organic(name+(n===3?'代正丙烷':cn[n]+'烷'),[...Array(n).fill('C'),e],[...chain(n),[n-1,n,1]],'直链末端的碳连接卤素');
organic('二氯甲烷',['C','Cl','Cl'],[[0,1,1],[0,2,1]],'Cl—CH₂—Cl');
organic('氯仿',['C','Cl','Cl','Cl'],[[0,1,1],[0,2,1],[0,3,1]],'一个 CH 与三个 Cl 分别以单键相连');
organic('四氯化碳',['C','Cl','Cl','Cl','Cl'],[[0,1,1],[0,2,1],[0,3,1],[0,4,1]],'一个 C 与四个 Cl 分别以单键相连');
export const BY_KEY=new Map();for(const s of SUBSTANCES){if(!BY_KEY.has(s.key))BY_KEY.set(s.key,[]);BY_KEY.get(s.key).push(s);}
export function graphMatches(graph,bonds){
 const n=graph.nodes.length;if(bonds.length!==graph.bonds.length)return false;
 const matrix=bs=>{const m=Array.from({length:n},()=>Array(n).fill(0));for(const [a,b,o]of bs){if(a===b||a<0||b<0||a>=n||b>=n||![1,2,3].includes(o)||m[a][b])return null;m[a][b]=m[b][a]=o;}return m;};
 const target=matrix(graph.bonds),actual=matrix(bonds);if(!actual)return false;
 const sig=(m,i)=>m[i].filter(Boolean).sort().join(',');const order=Array.from({length:n},(_,i)=>i).sort((a,b)=>sig(target,b).length-sig(target,a).length),map=Array(n).fill(-1),used=new Set();
 function visit(k){if(k===n)return true;const a=order[k];for(let b=0;b<n;b++){if(used.has(b)||graph.nodes[a].label!==graph.nodes[b].label||sig(target,a)!==sig(actual,b))continue;let ok=true;for(let j=0;j<k;j++){let x=order[j];if(target[a][x]!==actual[b][map[x]]){ok=false;break;}}if(ok){map[a]=b;used.add(b);if(visit(k+1))return true;used.delete(b);map[a]=-1;}}return false;}return visit(0);
}
