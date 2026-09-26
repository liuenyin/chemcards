// Atomic weights are fixed game values (thousandths), not isotope masses.
export const ELEMENTS = {
 H:{name:'氢',z:1,mass:1008,bg:'#fffdf5',ink:'#30453d',accent:'#ccd8c9',weight:310,color:'无色气体'},
 He:{name:'氦',z:2,mass:4003,bg:'#f4f9ff',ink:'#1e293b',accent:'#cbd5e1',weight:12,color:'稀有气体'},
 Li:{name:'锂',z:3,mass:6941,bg:'#f1f5f9',ink:'#334155',accent:'#cbd5e1',weight:35,color:'银白色轻金属'},
 Be:{name:'铍',z:4,mass:9012,bg:'#e2e8f0',ink:'#334155',accent:'#94a3b8',weight:10,color:'灰白色金属'},
 B:{name:'硼',z:5,mass:10811,bg:'#8d6e63',ink:'#fffbf0',accent:'#d7ccc8',weight:18,color:'黑棕色固体'},
 C:{name:'碳',z:6,mass:12011,bg:'#343b37',ink:'#f4f0e3',accent:'#647066',weight:80,color:'石墨灰黑'},
 N:{name:'氮',z:7,mass:14007,bg:'#f4f5ef',ink:'#33433f',accent:'#9bafa9',weight:85,color:'无色气体'},
 O:{name:'氧',z:8,mass:15999,bg:'#fdfcf6',ink:'#334843',accent:'#90acb2',weight:240,color:'无色气体'},
 F:{name:'氟',z:9,mass:18998,bg:'#d9f99d',ink:'#365314',accent:'#bef264',weight:50,color:'浅黄绿色剧毒气体'},
 Ne:{name:'氖',z:10,mass:20180,bg:'#fed7aa',ink:'#7c2d12',accent:'#fdba74',weight:8,color:'稀有气体'},
 Na:{name:'钠',z:11,mass:22990,bg:'#dce0dc',ink:'#34413a',accent:'#9eaaa2',weight:45,color:'银白色活泼金属'},
 Mg:{name:'镁',z:12,mass:24305,bg:'#e2e5df',ink:'#34413a',accent:'#adb7ab',weight:30,color:'银白色轻金属'},
 Al:{name:'铝',z:13,mass:26982,bg:'#d4dcdd',ink:'#2c3e43',accent:'#93a5aa',weight:20,color:'银白色金属'},
 Si:{name:'硅',z:14,mass:28085,bg:'#68716e',ink:'#fff8e8',accent:'#9aaba3',weight:14,color:'灰黑色半导体'},
 P:{name:'磷',z:15,mass:30974,bg:'#a25947',ink:'#fff6e8',accent:'#c28669',weight:28,color:'红磷暗红/白磷蜡状'},
 S:{name:'硫',z:16,mass:32060,bg:'#e6c958',ink:'#574624',accent:'#b99835',weight:42,color:'淡黄色固体'},
 Cl:{name:'氯',z:17,mass:35450,bg:'#cbd48c',ink:'#3d4b25',accent:'#9dad5a',weight:66,color:'黄绿色气体'},
 Ar:{name:'氩',z:18,mass:39948,bg:'#e0e7ff',ink:'#312e81',accent:'#c7d2fe',weight:12,color:'稀有气体'},
 K:{name:'钾',z:19,mass:39098,bg:'#e0dfdf',ink:'#3b4142',accent:'#acaeb4',weight:23,color:'银白色活泼金属'},
 Ca:{name:'钙',z:20,mass:40078,bg:'#d3d8cb',ink:'#364233',accent:'#99a690',weight:31,color:'银白色金属'},
 Sc:{name:'钪',z:21,mass:44956,bg:'#e2e8f0',ink:'#334155',accent:'#cbd5e1',weight:3,color:'银白色金属'},
 Ti:{name:'钛',z:22,mass:47867,bg:'#cbd5e1',ink:'#1e293b',accent:'#94a3b8',weight:11,color:'银灰色耐蚀金属'},
 V:{name:'钒',z:23,mass:50942,bg:'#cbd5e1',ink:'#1e293b',accent:'#94a3b8',weight:4,color:'银灰色金属'},
 Cr:{name:'铬',z:24,mass:51996,bg:'#94a3b8',ink:'#0f172a',accent:'#64748b',weight:15,color:'银亮硬金属'},
 Mn:{name:'锰',z:25,mass:54938,bg:'#a8a29e',ink:'#1c1917',accent:'#78716c',weight:18,color:'灰白硬脆金属'},
 Fe:{name:'铁',z:26,mass:55845,bg:'#adb6b1',ink:'#293b34',accent:'#7b8d82',weight:21,color:'银灰色金属'},
 Co:{name:'钴',z:27,mass:58933,bg:'#64748b',ink:'#f8fafc',accent:'#475569',weight:13,color:'银白带红金属'},
 Ni:{name:'镍',z:28,mass:58693,bg:'#94a3b8',ink:'#0f172a',accent:'#64748b',weight:14,color:'银白金属'},
 Cu:{name:'铜',z:29,mass:63546,bg:'#9e5d36',ink:'#fffbf0',accent:'#d7a071',weight:13,color:'紫红色金属'},
 Zn:{name:'锌',z:30,mass:65380,bg:'#c5d0d1',ink:'#2d4248',accent:'#8aabaf',weight:13,color:'蓝白色金属'},
 Ga:{name:'镓',z:31,mass:69723,bg:'#cbd5e1',ink:'#1e293b',accent:'#94a3b8',weight:2,color:'低熔点银白金属'},
 Ge:{name:'锗',z:32,mass:72630,bg:'#94a3b8',ink:'#0f172a',accent:'#64748b',weight:2,color:'灰白类金属'},
 As:{name:'砷',z:33,mass:74922,bg:'#78716c',ink:'#fffbf0',accent:'#a8a29e',weight:4,color:'灰黑类金属'},
 Se:{name:'硒',z:34,mass:78971,bg:'#6b7280',ink:'#fffbf0',accent:'#9ca3af',weight:4,color:'灰黑非金属'},
 Br:{name:'溴',z:35,mass:79904,bg:'#8e4030',ink:'#fff0df',accent:'#b76748',weight:10,color:'红棕色液体'},
 Kr:{name:'氪',z:36,mass:83798,bg:'#f3e8ff',ink:'#581c87',accent:'#e9d5ff',weight:2,color:'稀有气体'},
 Rb:{name:'铷',z:37,mass:85468,bg:'#e2e8f0',ink:'#334155',accent:'#cbd5e1',weight:2,color:'银白活泼碱金属'},
 Sr:{name:'锶',z:38,mass:87620,bg:'#e2e8f0',ink:'#334155',accent:'#cbd5e1',weight:3,color:'银黄碱土金属'},
 Y:{name:'钇',z:39,mass:88906,bg:'#cbd5e1',ink:'#1e293b',accent:'#94a3b8',weight:1,color:'稀土金属'},
 Zr:{name:'锆',z:40,mass:91224,bg:'#cbd5e1',ink:'#1e293b',accent:'#94a3b8',weight:2,color:'耐蚀金属'},
 Nb:{name:'铌',z:41,mass:92906,bg:'#cbd5e1',ink:'#1e293b',accent:'#94a3b8',weight:1,color:'高熔点金属'},
 Mo:{name:'钼',z:42,mass:95950,bg:'#94a3b8',ink:'#0f172a',accent:'#64748b',weight:3,color:'高熔点银白金属'},
 Tc:{name:'锝',z:43,mass:98000,bg:'#64748b',ink:'#f8fafc',accent:'#475569',weight:1,color:'放射性金属'},
 Ru:{name:'钌',z:44,mass:101070,bg:'#94a3b8',ink:'#0f172a',accent:'#64748b',weight:1,color:'铂族贵金属'},
 Rh:{name:'铑',z:45,mass:102910,bg:'#94a3b8',ink:'#0f172a',accent:'#64748b',weight:1,color:'铂族贵金属'},
 Pd:{name:'钯',z:46,mass:106420,bg:'#cbd5e1',ink:'#1e293b',accent:'#94a3b8',weight:2,color:'铂族贵金属'},
 Ag:{name:'银',z:47,mass:107868,bg:'#e9e8e1',ink:'#3b4642',accent:'#b8bdb5',weight:6,color:'银白色贵金属'},
 Cd:{name:'镉',z:48,mass:112411,bg:'#cbd5e1',ink:'#1e293b',accent:'#94a3b8',weight:2,color:'蓝白软金属'},
 In:{name:'铟',z:49,mass:114818,bg:'#cbd5e1',ink:'#1e293b',accent:'#94a3b8',weight:2,color:'银白软金属'},
 Sn:{name:'锡',z:50,mass:118710,bg:'#cbd5e1',ink:'#1e293b',accent:'#94a3b8',weight:7,color:'银白低熔金属'},
 Sb:{name:'锑',z:51,mass:121760,bg:'#94a3b8',ink:'#0f172a',accent:'#64748b',weight:3,color:'银白脆性类金属'},
 Te:{name:'碲',z:52,mass:127600,bg:'#78716c',ink:'#fffbf0',accent:'#a8a29e',weight:2,color:'银灰脆性类金属'},
 I:{name:'碘',z:53,mass:126904,bg:'#4e4353',ink:'#f4e9f0',accent:'#8b7290',weight:10,color:'紫黑色晶体'},
 Xe:{name:'氙',z:54,mass:131293,bg:'#e0f2fe',ink:'#0369a1',accent:'#bae6fd',weight:2,color:'稀有气体'},
 Cs:{name:'铯',z:55,mass:132905,bg:'#e2e8f0',ink:'#334155',accent:'#cbd5e1',weight:2,color:'极活泼金黄金属'},
 Ba:{name:'钡',z:56,mass:137327,bg:'#cbd5e1',ink:'#1e293b',accent:'#94a3b8',weight:10,color:'银白碱土金属'},
 La:{name:'镧',z:57,mass:138905,bg:'#cbd5e1',ink:'#1e293b',accent:'#94a3b8',weight:1,color:'稀土金属'},
 Ce:{name:'铈',z:58,mass:140116,bg:'#cbd5e1',ink:'#1e293b',accent:'#94a3b8',weight:2,color:'活泼稀土金属'},
 Pr:{name:'镨',z:59,mass:140908,bg:'#cbd5e1',ink:'#1e293b',accent:'#94a3b8',weight:1,color:'稀土金属'},
 Nd:{name:'钕',z:60,mass:144242,bg:'#cbd5e1',ink:'#1e293b',accent:'#94a3b8',weight:2,color:'强磁性稀土'},
 Pm:{name:'钷',z:61,mass:145000,bg:'#64748b',ink:'#f8fafc',accent:'#475569',weight:1,color:'放射性稀土'},
 Sm:{name:'钐',z:62,mass:150360,bg:'#cbd5e1',ink:'#1e293b',accent:'#94a3b8',weight:1,color:'稀土金属'},
 Eu:{name:'铕',z:63,mass:151964,bg:'#cbd5e1',ink:'#1e293b',accent:'#94a3b8',weight:1,color:'发光稀土金属'},
 Gd:{name:'钆',z:64,mass:157250,bg:'#cbd5e1',ink:'#1e293b',accent:'#94a3b8',weight:1,color:'稀土金属'},
 Tb:{name:'铽',z:65,mass:158925,bg:'#cbd5e1',ink:'#1e293b',accent:'#94a3b8',weight:1,color:'荧光稀土'},
 Dy:{name:'镝',z:66,mass:162500,bg:'#cbd5e1',ink:'#1e293b',accent:'#94a3b8',weight:1,color:'稀土金属'},
 Ho:{name:'钬',z:67,mass:164930,bg:'#cbd5e1',ink:'#1e293b',accent:'#94a3b8',weight:1,color:'稀土金属'},
 Er:{name:'铒',z:68,mass:167259,bg:'#cbd5e1',ink:'#1e293b',accent:'#94a3b8',weight:1,color:'光纤激光稀土'},
 Tm:{name:'铥',z:69,mass:168934,bg:'#cbd5e1',ink:'#1e293b',accent:'#94a3b8',weight:1,color:'稀土金属'},
 Yb:{name:'镱',z:70,mass:173054,bg:'#cbd5e1',ink:'#1e293b',accent:'#94a3b8',weight:1,color:'稀土金属'},
 Lu:{name:'镥',z:71,mass:174967,bg:'#cbd5e1',ink:'#1e293b',accent:'#94a3b8',weight:1,color:'最重稀土'},
 Hf:{name:'铪',z:72,mass:178490,bg:'#cbd5e1',ink:'#1e293b',accent:'#94a3b8',weight:1,color:'高熔点金属'},
 Ta:{name:'钽',z:73,mass:180948,bg:'#cbd5e1',ink:'#1e293b',accent:'#94a3b8',weight:1,color:'高熔点耐酸金属'},
 W:{name:'钨',z:74,mass:183840,bg:'#475569',ink:'#f8fafc',accent:'#334155',weight:3,color:'熔点最高金属'},
 Re:{name:'铼',z:75,mass:186207,bg:'#94a3b8',ink:'#0f172a',accent:'#64748b',weight:1,color:'稀散高熔点金属'},
 Os:{name:'锇',z:76,mass:190230,bg:'#475569',ink:'#f8fafc',accent:'#334155',weight:1,color:'密度最大单质'},
 Ir:{name:'铱',z:77,mass:192217,bg:'#cbd5e1',ink:'#1e293b',accent:'#94a3b8',weight:1,color:'耐腐蚀贵金属'},
 Pt:{name:'铂',z:78,mass:195084,bg:'#e2e8f0',ink:'#1e293b',accent:'#cbd5e1',weight:5,color:'白金贵金属'},
 Au:{name:'金',z:79,mass:196967,bg:'#fef08a',ink:'#713f12',accent:'#fde047',weight:5,color:'金黄色惰性贵金属'},
 Hg:{name:'汞',z:80,mass:200592,bg:'#e2e8f0',ink:'#1e293b',accent:'#cbd5e1',weight:6,color:'常温液态金属'},
 Tl:{name:'铊',z:81,mass:204383,bg:'#cbd5e1',ink:'#1e293b',accent:'#94a3b8',weight:1,color:'剧毒重金属'},
 Pb:{name:'铅',z:82,mass:207200,bg:'#94a3b8',ink:'#0f172a',accent:'#64748b',weight:7,color:'重金属'},
 Bi:{name:'铋',z:83,mass:208980,bg:'#e2e8f0',ink:'#1e293b',accent:'#cbd5e1',weight:2,color:'微红低毒金属'},
 Po:{name:'钋',z:84,mass:209000,bg:'#475569',ink:'#f8fafc',accent:'#334155',weight:1,color:'强放射性元素'},
 At:{name:'砹',z:85,mass:210000,bg:'#475569',ink:'#f8fafc',accent:'#334155',weight:1,color:'最重卤素'},
 Rn:{name:'氡',z:86,mass:222000,bg:'#f1f5f9',ink:'#334155',accent:'#cbd5e1',weight:1,color:'放射性稀有气体'}
};

export function parseFormula(formula){
 if(typeof formula!=='string'||formula.length>100)throw Error('化学式过长');
 formula=formula.replace(/[₀₁₂₃₄₅₆₇₈₉]/g,c=>'₀₁₂₃₄₅₆₇₈₉'.indexOf(c)).replace(/\s/g,'');
 if(/[·.]/.test(formula)){const total={};for(const fragment of formula.split(/[·.]/)){const m=fragment.match(/^(\d+)?(.+)$/);if(!m)throw Error('无效水合物化学式');const k=Number(m[1]||1);if(k<1||k>100)throw Error('无效系数');for(const[e,n]of Object.entries(parseFormula(m[2])))total[e]=(total[e]||0)+n*k;}return total;}
 formula=formula.replace(/\[/g,'(').replace(/\]/g,')');
 const tokens=formula.match(/[A-Z][a-z]?|\d+|[()]/g);if(!tokens||tokens.join('')!==formula)throw Error('无效化学式 '+formula);let i=0;
 function group(nested=false){const out={};while(i<tokens.length){let t=tokens[i++];if(t===')'){if(!nested)throw Error('括号不匹配');return out;}let part;if(t==='(')part=group(true);else{if(!ELEMENTS[t])throw Error('不支持的元素 '+t);part={[t]:1};}const n=/^\d+$/.test(tokens[i]||'')?Number(tokens[i++]):1;if(n<1)throw Error('下标必须大于零');for(const [e,c]of Object.entries(part))out[e]=(out[e]||0)+c*n;}if(nested)throw Error('括号不匹配');return out;}return group();
}
export const countCards=cards=>cards.reduce((a,e)=>(a[e]=(a[e]||0)+1,a),{});
export const keyOf=counts=>Object.keys(counts).filter(e=>counts[e]>0).sort().map(e=>e+counts[e]).join('|');
export const atomCount=counts=>Object.values(counts).reduce((a,b)=>a+b,0);
export const massOf=counts=>Object.entries(counts).reduce((s,[e,n])=>s+ELEMENTS[e].mass*n,0);
export const expand=counts=>Object.entries(counts).flatMap(([e,n])=>Array(n).fill(e));
const EN_ORDER = ['Cs','Rb','K','Na','Li','Ba','Sr','Ca','Mg','Be','Al','Mn','Zn','Cr','Fe','Cd','Co','Ni','Sn','Pb','Bi','Cu','Ag','Hg','Au','Pt','W','Mo','Ti','Zr','La','Ce','Nd','Sb','As','Ge','Si','B','H','P','C','Se','S','I','Br','Cl','N','O','F','He','Ne','Ar','Kr','Xe','Rn'];
export function formulaOf(counts){const keys=Object.keys(counts).filter(e=>counts[e]>0);keys.sort((a,b)=>{if(counts.C){if(a==='C')return -1;if(b==='C')return 1;if(a==='H')return -1;if(b==='H')return 1;}const iA=EN_ORDER.indexOf(a),iB=EN_ORDER.indexOf(b);if(iA!==-1&&iB!==-1)return iA-iB;return ELEMENTS[a].z-ELEMENTS[b].z;});return keys.map(e=>e+(counts[e]>1?counts[e]:'')).join('');}
export const formatFormula=f=>f.split(/([·.])/).map((part,i)=>{if(part==='·'||part==='.')return part;const coefficient=i>0?(part.match(/^\d+/)?.[0]||''):'';return coefficient+part.slice(coefficient.length).replace(/(\d+)/g,'<sub>$1</sub>');}).join('');
export const massText=m=>(m/1000).toFixed(3);
export const SUBSTANCES=[];
function add(name,formula,category,graph=null){const counts=parseFormula(formula);SUBSTANCES.push({id:'s'+SUBSTANCES.length,name,formula,category,counts,key:keyOf(counts),mass:massOf(counts),size:atomCount(counts),graph});}

const inorganic = {
 '单质': [
  ['氢气','H2'],['氦气','He'],['锂','Li'],['铍','Be'],['硼','B'],['石墨','C'],['氮气','N2'],['氧气','O2'],['臭氧','O3'],['氟气','F2'],['氖气','Ne'],['钠','Na'],['镁','Mg'],['铝','Al'],['硅','Si'],['白磷','P4'],['红磷','P'],['环八硫','S8'],['氯气','Cl2'],['氩气','Ar'],['钾','K'],['钙','Ca'],['钪','Sc'],['钛','Ti'],['钒','V'],['铬','Cr'],['锰','Mn'],['铁','Fe'],['钴','Co'],['镍','Ni'],['铜','Cu'],['锌','Zn'],['镓','Ga'],['锗','Ge'],['砷','As'],['硒','Se'],['溴','Br2'],['氪气','Kr'],['铷','Rb'],['锶','Sr'],['钇','Y'],['锆','Zr'],['铌','Nb'],['钼','Mo'],['钌','Ru'],['铑','Rh'],['钯','Pd'],['银','Ag'],['镉','Cd'],['铟','In'],['锡','Sn'],['锑','Sb'],['碲','Te'],['碘','I2'],['氙气','Xe'],['铯','Cs'],['钡','Ba'],['镧','La'],['铈','Ce'],['钨','W'],['锇','Os'],['铱','Ir'],['铂','Pt'],['金','Au'],['汞','Hg'],['铊','Tl'],['铅','Pb'],['铋','Bi'],['氡气','Rn']
 ],
 '无机物': [
  ['水','H2O'],['过氧化氢','H2O2'],['氨','NH3'],['联氨','N2H4'],['氯化氢','HCl'],['溴化氢','HBr'],['碘化氢','HI'],['氢氟酸','HF'],['硫化氢','H2S'],['硒化氢','H2Se'],['硅烷','SiH4'],['磷化氢','PH3'],['二硫化碳','CS2'],['三氯化磷','PCl3'],['五氯化磷','PCl5'],['三氟化磷','PF3'],['五氟化磷','PF5'],['三氯化硼','BCl3'],['三氟化硼','BF3'],['六氟化硫','SF6'],['四氟化硅','SiF4'],['四氯化硅','SiCl4'],['四氯化钛','TiCl4'],['二氯化硫','SCl2'],['二氯化二硫','S2Cl2'],['三氯化碘','ICl3'],['氯化碘','ICl'],['三氧化氙','XeO3'],['二氟化氙','XeF2'],['四氟化氙','XeF4'],['六氟化氙','XeF6'],['二氟化氪','KrF2']
 ],
 '氧化物': [
  ['一氧化碳','CO'],['二氧化碳','CO2'],['一氧化氮','NO'],['二氧化氮','NO2'],['一氧化二氮','N2O'],['四氧化二氮','N2O4'],['五氧化二氮','N2O5'],['二氧化硫','SO2'],['三氧化硫','SO3'],['二氧化硒','SeO2'],['二氧化硅','SiO2'],['六氧化四磷','P4O6'],['十氧化四磷','P4O10'],['氧化钠','Na2O'],['过氧化钠','Na2O2'],['超氧化钾','KO2'],['氧化钾','K2O'],['氧化锂','Li2O'],['氧化镁','MgO'],['氧化钙','CaO'],['氧化锶','SrO'],['氧化钡','BaO'],['过氧化钡','BaO2'],['氧化铝','Al2O3'],['氧化亚铁','FeO'],['氧化铁','Fe2O3'],['四氧化三铁','Fe3O4'],['氧化亚铜','Cu2O'],['氧化铜','CuO'],['氧化锌','ZnO'],['二氧化钛','TiO2'],['三氧化二铬','Cr2O3'],['三氧化铬','CrO3'],['一氧化锰','MnO'],['二氧化锰','MnO2'],['七氧化二锰','Mn2O7'],['氧化钴','CoO'],['四氧化三钴','Co3O4'],['氧化镍','NiO'],['氧化亚锡','SnO'],['二氧化锡','SnO2'],['一氧化铅','PbO'],['二氧化铅','PbO2'],['四氧化三铅','Pb3O4'],['三氧化二铋','Bi2O3'],['三氧化二砷','As2O3'],['五氧化二砷','As2O5'],['三氧化二锑','Sb2O3'],['五氧化二锑','Sb2O5'],['三氧化钨','WO3'],['三氧化钼','MoO3'],['二氧化铈','CeO2'],['氧化汞','HgO'],['氧化银','Ag2O']
 ],
 '酸与碱': [
  ['次氯酸','HClO'],['亚氯酸','HClO2'],['氯酸','HClO3'],['高氯酸','HClO4'],['次溴酸','HBrO'],['溴酸','HBrO3'],['碘酸','HIO3'],['高碘酸','HIO4'],['亚硝酸','HNO2'],['硝酸','HNO3'],['亚硫酸','H2SO3'],['硫酸','H2SO4'],['焦硫酸','H2S2O7'],['亚磷酸','H3PO3'],['次磷酸','H3PO2'],['磷酸','H3PO4'],['焦磷酸','H4P2O7'],['硼酸','H3BO3'],['四氟硼酸','HBF4'],['硅酸','H2SiO3'],['原硅酸','H4SiO4'],['氢氧化锂','LiOH'],['氢氧化钠','NaOH'],['氢氧化钾','KOH'],['氢氧化铷','RbOH'],['氢氧化铯','CsOH'],['氢氧化镁','Mg(OH)2'],['氢氧化钙','Ca(OH)2'],['氢氧化锶','Sr(OH)2'],['氢氧化钡','Ba(OH)2'],['氢氧化铝','Al(OH)3'],['氢氧化锌','Zn(OH)2'],['氢氧化亚铁','Fe(OH)2'],['氢氧化铁','Fe(OH)3'],['氢氧化钴','Co(OH)2'],['氢氧化镍','Ni(OH)2'],['氢氧化铜','Cu(OH)2'],['氢氧化亚锡','Sn(OH)2'],['氢氧化铅','Pb(OH)2'],['氢氧化铋','Bi(OH)3'],['氢氧化铊','TlOH'],['一水合氨','NH3·H2O']
 ],
 '盐': [
  ['氯化锂','LiCl'],['氯化钠','NaCl'],['氯化钾','KCl'],['氯化铷','RbCl'],['氯化铯','CsCl'],['氟化锂','LiF'],['氟化钠','NaF'],['氟化钾','KF'],['溴化钠','NaBr'],['溴化钾','KBr'],['碘化钠','NaI'],['碘化钾','KI'],
  ['氯化镁','MgCl2'],['氯化钙','CaCl2'],['氯化锶','SrCl2'],['氯化钡','BaCl2'],['氟化钙','CaF2'],['氟化镁','MgF2'],['溴化镁','MgBr2'],['溴化钙','CaBr2'],['碘化镁','MgI2'],['碘化钙','CaI2'],['碘化钡','BaI2'],
  ['氯化铝','AlCl3'],['氟化铝','AlF3'],['氯化亚铁','FeCl2'],['氯化铁','FeCl3'],['氯化钴','CoCl2'],['氯化镍','NiCl2'],['氯化亚铜','CuCl'],['氯化铜','CuCl2'],['氯化锌','ZnCl2'],['氯化银','AgCl'],['溴化银','AgBr'],['碘化银','AgI'],['氟化银','AgF'],
  ['氯化亚汞','Hg2Cl2'],['氯化汞','HgCl2'],['氯化亚锡','SnCl2'],['氯化锡','SnCl4'],['氯化铅','PbCl2'],['氯化铋','BiCl3'],['氯化锑','SbCl3'],['三氯化铬','CrCl3'],['氯化锰','MnCl2'],['氯化金','AuCl3'],['氯化铂','PtCl4'],['氯金酸','HAuCl4'],['氯铂酸','H2PtCl6'],
  ['碳酸锂','Li2CO3'],['碳酸钠','Na2CO3'],['碳酸氢钠','NaHCO3'],['碳酸钾','K2CO3'],['碳酸氢钾','KHCO3'],['碳酸铵','(NH4)2CO3'],['碳酸氢铵','NH4HCO3'],['碳酸镁','MgCO3'],['碳酸氢镁','Mg(HCO3)2'],['碳酸钙','CaCO3'],['碳酸氢钙','Ca(HCO3)2'],['碳酸钡','BaCO3'],['碳酸亚铁','FeCO3'],['碳酸铜','CuCO3'],['碱式碳酸铜','Cu2(OH)2CO3'],['碳酸锌','ZnCO3'],['碳酸铅','PbCO3'],['碳酸银','Ag2CO3'],
  ['硫酸锂','Li2SO4'],['硫酸钠','Na2SO4'],['硫酸氢钠','NaHSO4'],['硫酸钾','K2SO4'],['硫酸氢钾','KHSO4'],['硫酸铵','(NH4)2SO4'],['硫酸氢铵','NH4HSO4'],['硫酸镁','MgSO4'],['硫酸钙','CaSO4'],['硫酸钡','BaSO4'],['硫酸亚铁','FeSO4'],['硫酸铁','Fe2(SO4)3'],['硫酸钴','CoSO4'],['硫酸镍','NiSO4'],['硫酸铜','CuSO4'],['硫酸锌','ZnSO4'],['硫酸银','Ag2SO4'],['硫酸铝','Al2(SO4)3'],['硫酸铅','PbSO4'],['硫酸锰','MnSO4'],['硫酸铬','Cr2(SO4)3'],
  ['亚硫酸钠','Na2SO3'],['亚硫酸氢钠','NaHSO3'],['亚硫酸钾','K2SO3'],['亚硫酸氢钾','KHSO3'],['亚硫酸钙','CaSO3'],['亚硫酸氢钙','Ca(HSO3)2'],['亚硫酸钡','BaSO3'],
  ['硫代硫酸钠','Na2S2O3'],['硫代硫酸钾','K2S2O3'],['硫代硫酸铵','(NH4)2S2O3'],['连二亚硫酸钠','Na2S2O4'],['焦亚硫酸钠','Na2S2O5'],['过二硫酸钠','Na2S2O8'],['过二硫酸钾','K2S2O8'],['过二硫酸铵','(NH4)2S2O8'],
  ['硝酸锂','LiNO3'],['硝酸钠','NaNO3'],['亚硝酸钠','NaNO2'],['硝酸钾','KNO3'],['亚硝酸钾','KNO2'],['硝酸铵','NH4NO3'],['硝酸镁','Mg(NO3)2'],['硝酸钙','Ca(NO3)2'],['硝酸钡','Ba(NO3)2'],['硝酸锶','Sr(NO3)2'],['硝酸铝','Al(NO3)3'],['硝酸亚铁','Fe(NO3)2'],['硝酸铁','Fe(NO3)3'],['硝酸钴','Co(NO3)2'],['硝酸镍','Ni(NO3)2'],['硝酸铜','Cu(NO3)2'],['硝酸锌','Zn(NO3)2'],['硝酸银','AgNO3'],['硝酸汞','Hg(NO3)2'],['硝酸铅','Pb(NO3)2'],['硝酸铋','Bi(NO3)3'],['硝酸镧','La(NO3)3'],['硝酸铈铵','(NH4)2Ce(NO3)6'],
  ['高锰酸钾','KMnO4'],['锰酸钾','K2MnO4'],['高锰酸钠','NaMnO4'],['重铬酸钾','K2Cr2O7'],['铬酸钾','K2CrO4'],['重铬酸钠','Na2Cr2O7'],['铬酸钠','Na2CrO4'],['铬酸钡','BaCrO4'],['铬酸铅','PbCrO4'],
  ['次氯酸钠','NaClO'],['次氯酸钙','Ca(ClO)2'],['次氯酸钾','KClO'],['亚氯酸钠','NaClO2'],['氯酸钠','NaClO3'],['氯酸钾','KClO3'],['高氯酸钠','NaClO4'],['高氯酸钾','KClO4'],['高氯酸铵','NH4ClO4'],['高氯酸镁','Mg(ClO4)2'],['溴酸钾','KBrO3'],['碘酸钠','NaIO3'],['碘酸钾','KIO3'],
  ['磷酸二氢钠','NaH2PO4'],['磷酸氢二钠','Na2HPO4'],['磷酸钠','Na3PO4'],['磷酸二氢钾','KH2PO4'],['磷酸氢二钾','K2HPO4'],['磷酸钾','K3PO4'],['磷酸二氢铵','NH4H2PO4'],['磷酸氢二铵','(NH4)2HPO4'],['磷酸铵','(NH4)3PO4'],['磷酸氢钙','CaHPO4'],['磷酸二氢钙','Ca(H2PO4)2'],['磷酸钙','Ca3(PO4)2'],['焦磷酸钠','Na4P2O7'],['次磷酸钠','NaH2PO2'],
  ['硅酸钠','Na2SiO3'],['硅酸钾','K2SiO3'],['偏铝酸钠','NaAlO2'],['钛酸钡','BaTiO3'],['钨酸钠','Na2WO4'],['钨酸钙','CaWO4'],['钼酸钠','Na2MoO4'],['钼酸铵','(NH4)2MoO4'],['硒酸钠','Na2SeO4'],['亚硒酸钠','Na2SeO3'],
  ['硫化钠','Na2S'],['硫氢化钠','NaHS'],['硫化钾','K2S'],['硫氢化钾','KHS'],['硫化铵','(NH4)2S'],['硫氢化铵','NH4HS'],['硫化镁','MgS'],['硫化钙','CaS'],['硫化钡','BaS'],['硫化亚铁','FeS'],['二硫化铁','FeS2'],['硫化铜','CuS'],['硫化亚铜','Cu2S'],['硫化锌','ZnS'],['硫化银','Ag2S'],['硫化汞','HgS'],['硫化铅','PbS'],['硫化镉','CdS'],['硫化锑','Sb2S3'],['三硫化二砷','As2S3'],['四硫化四砷','As4S4'],['二硫化钼','MoS2'],
  ['硫氰酸钾','KSCN'],['硫氰酸钠','NaSCN'],['硫氰酸铵','NH4SCN'],['硫氰酸银','AgSCN'],['硫氰酸亚铜','CuSCN'],['硫氰酸钙','Ca(SCN)2'],['硫氰酸锌','Zn(SCN)2'],['氰酸钾','KOCN'],['氰酸钠','NaOCN'],['氰酸铵','NH4OCN'],['氰化钾','KCN'],['氰化钠','NaCN'],['氰化银','AgCN'],['氰化亚铜','CuCN'],['氰化氢','HCN'],['亚铁氰化钾','K4Fe(CN)6'],['铁氰化钾','K3Fe(CN)6'],['亚铁氰化钠','Na4Fe(CN)6'],
  ['氢化锂','LiH'],['氢化钠','NaH'],['氢化钾','KH'],['氢化钙','CaH2'],['氢化镁','MgH2'],['铝氢化锂','LiAlH4'],['硼氢化钠','NaBH4'],['氮化锂','Li3N'],['氮化镁','Mg3N2'],['氮化钙','Ca3N2'],['氮化铝','AlN'],['氮化硅','Si3N4'],['氮化钛','TiN'],['碳化钙','CaC2'],['碳化硅','SiC'],['磷化钙','Ca3P2'],['磷化铝','AlP'],['砷化镓','GaAs']
 ]
};
for(const [cat,rows]of Object.entries(inorganic))for(const [name,f]of rows)add(name,f,cat);

const hydrates = [
 ['胆矾','CuSO4·5H2O'],['绿矾','FeSO4·7H2O'],['芒硝','Na2SO4·10H2O'],['石膏','CaSO4·2H2O'],['明矾','KAl(SO4)2·12H2O'],['大苏打','Na2S2O3·5H2O'],['七水硫酸镁','MgSO4·7H2O'],['六水合三氯化铁','FeCl3·6H2O'],['二水合氯化钙','CaCl2·2H2O'],['六水合氯化钴','CoCl2·6H2O'],['七水硫酸锌','ZnSO4·7H2O'],['七水硫酸镍','NiSO4·7H2O'],['八水合氢氧化钡','Ba(OH)2·8H2O'],['一水合硫酸四氨合铜','Cu(NH3)4SO4·H2O'],['一水合柠檬酸','C6H8O7·H2O'],['二水合草酸','C2H2O4·2H2O']
];
for(const [name,formula]of hydrates)if(!SUBSTANCES.some(s=>s.formula===formula))add(name,formula,'水合物');

const VALENCE={C:4,N:3,O:2,Cl:1,Br:1,I:1,F:1,S:2,P:3,Si:4};
function organic(name,atoms,bonds,reference){const nodes=atoms.map((e,i)=>{const used=bonds.reduce((s,[a,b,o])=>s+((a===i||b===i)?o:0),0);const h=(VALENCE[e]||0)-used;if(h<0)throw Error('价态错误 '+name);return {e,h,label:e+(h?'H'+(h>1?h:''):'')};});const counts={};for(const n of nodes){counts[n.e]=(counts[n.e]||0)+1;if(n.h)counts.H=(counts.H||0)+n.h;}add(name,formulaOf(counts),'有机物',{nodes,bonds,reference});}
const cn=['','甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
const chain=n=>Array.from({length:n-1},(_,i)=>[i,i+1,1]);
for(let n=1;n<=10;n++){
 organic((n>3?'正':'')+cn[n]+'烷',Array(n).fill('C'),chain(n),n===1?'CH₄':n===2?'CH₃—CH₃':`CH₃—(CH₂)${n-2}—CH₃`);
 if(n>=2){let b=chain(n);b[0][2]=2;organic((n>3?'1-':'')+cn[n]+'烯',Array(n).fill('C'),b,'末端双键');b=chain(n);b[0][2]=3;organic((n>3?'1-':'')+cn[n]+'炔',Array(n).fill('C'),b,'末端三键');}
 organic((n>=3?'1-':'')+cn[n]+'醇',[...Array(n).fill('C'),'O'],[...chain(n),[n-1,n,1]],'直链末端醇');
 organic(cn[n]+'醛',[...Array(n).fill('C'),'O'],[...chain(n),[n-1,n,2]],'直链末端醛');
 organic(cn[n]+'酸',[...Array(n).fill('C'),'O','O'],[...chain(n),[n-1,n,2],[n-1,n+1,1]],'直链羧酸');
}
organic('异丁烷',['C','C','C','C'],[[0,1,1],[1,2,1],[1,3,1]],'CH(CH₃)₃');
organic('新戊烷',['C','C','C','C','C'],[[0,1,1],[0,2,1],[0,3,1],[0,4,1]],'C(CH₃)₄');
organic('异丙醇',['C','C','C','O'],[[0,1,1],[1,2,1],[1,3,1]],'CH₃—CH(OH)—CH₃');
organic('乙醚',['C','C','O','C','C'],[[0,1,1],[1,2,1],[2,3,1],[3,4,1]],'CH₃—CH₂—O—CH₂—CH₃');
organic('二甲醚',['C','O','C'],[[0,1,1],[1,2,1]],'CH₃—O—CH₃');
organic('丙酮',['C','C','C','O'],[[0,1,1],[1,2,1],[1,3,2]],'CH₃—C(=O)—CH₃');
organic('乙酸乙酯',['C','C','O','O','C','C'],[[0,1,1],[1,2,2],[1,3,1],[3,4,1],[4,5,1]],'CH₃—C(=O)—O—CH₂—CH₃');
organic('乙酸甲酯',['C','C','O','O','C'],[[0,1,1],[1,2,2],[1,3,1],[3,4,1]],'CH₃—C(=O)—O—CH₃');
organic('甲酸甲酯',['C','O','O','C'],[[0,1,2],[0,2,1],[2,3,1]],'H—C(=O)—O—CH₃');
organic('甲酸乙酯',['C','O','O','C','C'],[[0,1,2],[0,2,1],[2,3,1],[3,4,1]],'H—C(=O)—O—CH₂—CH₃');
organic('乙二醇',['O','C','C','O'],[[0,1,1],[1,2,1],[2,3,1]],'HO—CH₂—CH₂—OH');
organic('丙三醇',['O','C','C','C','O','O'],[[0,1,1],[1,2,1],[2,3,1],[2,4,1],[3,5,1]],'HO—CH₂—CH(OH)—CH₂—OH');
organic('乙二酸',['O','C','C','O','O','O'],[[0,1,1],[1,2,1],[2,3,1],[1,4,2],[2,5,2]],'HOOC—COOH');
organic('乳酸',['C','C','O','C','O','O'],[[0,1,1],[1,2,1],[1,3,1],[3,4,2],[3,5,1]],'CH₃—CH(OH)—COOH');
organic('苹果酸',['O','O','C','C','C','C','O','O','O'],[[0,2,2],[1,2,1],[2,3,1],[3,4,1],[4,5,1],[5,6,2],[5,7,1],[3,8,1]],'HOOC—CH(OH)—CH₂—COOH');
organic('酒石酸',['O','O','C','C','C','C','O','O','O','O'],[[0,2,2],[1,2,1],[2,3,1],[3,4,1],[4,5,1],[5,6,2],[5,7,1],[3,8,1],[4,9,1]],'HOOC—CH(OH)—CH(OH)—COOH');
organic('丁二酸',['O','O','C','C','C','C','O','O'],[[0,2,2],[1,2,1],[2,3,1],[3,4,1],[4,5,1],[5,6,2],[5,7,1]],'HOOC—CH₂—CH₂—COOH');
organic('丙烯酸',['C','C','C','O','O'],[[0,1,2],[1,2,1],[2,3,2],[2,4,1]],'CH₂=CH—COOH');
organic('甲基丙烯酸',['C','C','C','C','O','O'],[[0,1,2],[1,2,1],[1,3,1],[3,4,2],[3,5,1]],'CH₂=C(CH₃)—COOH');
organic('乙酸酐',['C','C','O','O','C','C','O'],[[0,1,1],[1,2,2],[1,3,1],[3,4,1],[4,5,1],[4,6,2]],'(CH₃CO)₂O');
organic('甲胺',['C','N'],[[0,1,1]],'CH₃—NH₂');
organic('乙胺',['C','C','N'],chain(3),'CH₃—CH₂—NH₂');
organic('乙二胺',['N','C','C','N'],[[0,1,1],[1,2,1],[2,3,1]],'H₂N—CH₂—CH₂—NH₂');
organic('尿素',['N','C','N','O'],[[0,1,1],[1,2,1],[1,3,2]],'H₂N—C(=O)—NH₂');
organic('甘氨酸',['N','C','C','O','O'],[[0,1,1],[1,2,1],[2,3,2],[2,4,1]],'H₂N—CH₂—COOH');
organic('丙氨酸',['C','C','N','C','O','O'],[[0,1,1],[1,2,1],[1,3,1],[3,4,2],[3,5,1]],'CH₃—CH(NH₂)—COOH');
organic('乙腈',['C','C','N'],[[0,1,1],[1,2,3]],'CH₃—C≡N');
organic('环丙烷',Array(3).fill('C'),[[0,1,1],[1,2,1],[2,0,1]],'三元碳环');
organic('环丁烷',Array(4).fill('C'),[[0,1,1],[1,2,1],[2,3,1],[3,0,1]],'四元碳环');
organic('环戊烷',Array(5).fill('C'),Array.from({length:5},(_,i)=>[i,(i+1)%5,1]),'五元碳环');
const ring=Array.from({length:6},(_,i)=>[i,(i+1)%6,i%2===0?2:1]);
organic('苯',Array(6).fill('C'),ring,'六元芳香环');
organic('环己烷',Array(6).fill('C'),ring.map(([a,b])=>[a,b,1]),'六元环单键');
for(const [name,e]of [['甲苯','C'],['苯酚','O'],['苯胺','N'],['氟苯','F'],['氯苯','Cl'],['溴苯','Br'],['碘苯','I']])organic(name,[...Array(6).fill('C'),e],[...ring,[0,6,1]],'单取代苯');
// Nitro group has formal N+ and O−; it is not an amine.
add('硝基苯','C6H5NO2','有机物',{nodes:[...Array.from({length:6},(_,i)=>({e:'C',h:i?1:0,label:i?'CH':'C'})),{e:'N',h:0,charge:1,label:'N⁺'},{e:'O',h:0,label:'O'},{e:'O',h:0,charge:-1,label:'O⁻'}],bonds:[...ring,[0,6,1],[6,7,2],[6,8,1]],reference:'苯环—N⁺(=O)—O⁻；两种等价氧位置均可'});
organic('苯甲酸',[...Array(6).fill('C'),'C','O','O'],[...ring,[0,6,1],[6,7,2],[6,8,1]],'苯环连接羧基');
organic('苯甲醛',[...Array(6).fill('C'),'C','O'],[...ring,[0,6,1],[6,7,2]],'苯环连接醛基');
organic('苯甲醇',[...Array(6).fill('C'),'C','O'],[...ring,[0,6,1],[6,7,1]],'苯环连接羟甲基');
organic('水杨酸',[...Array(6).fill('C'),'O','C','O','O'],[...ring,[0,6,1],[1,7,1],[7,8,2],[7,9,1]],'邻羟基苯甲酸');
organic('阿司匹林',[...Array(6).fill('C'),'C','O','O','O','C','C','O'],[...ring,[0,6,1],[6,7,2],[6,8,1],[1,9,1],[9,10,1],[10,11,1],[10,12,2]],'乙酰水杨酸');
organic('对乙酰氨基酚',[...Array(6).fill('C'),'O','N','C','C','O'],[...ring,[0,6,1],[3,7,1],[7,8,1],[8,9,1],[8,10,2]],'扑热息痛');
organic('吡啶',[...Array(5).fill('C'),'N'],[[0,1,2],[1,2,1],[2,3,2],[3,4,1],[4,5,2],[5,0,1]],'六元含氮芳杂环');
organic('呋喃',[...Array(4).fill('C'),'O'],[[0,1,2],[1,2,1],[2,3,2],[3,4,1],[4,0,1]],'五元含氧芳杂环');
organic('噻吩',[...Array(4).fill('C'),'S'],[[0,1,2],[1,2,1],[2,3,2],[3,4,1],[4,0,1]],'五元含硫芳杂环');
organic('吡咯',[...Array(4).fill('C'),'N'],[[0,1,2],[1,2,1],[2,3,2],[3,4,1],[4,0,1]],'五元含氮芳杂环');
for(const [name,isKetone]of [['葡萄糖（开链式）',false],['果糖（开链式）',true]]){const atoms=[...Array(6).fill('C'),...Array(6).fill('O')],bonds=chain(6);for(let i=0;i<6;i++)bonds.push([i,i+6,i===(isKetone?1:0)?2:1]);organic(name,atoms,bonds,'开链六碳糖');}

const organicSalts = [
 ['甲酸钠','HCOONa'],['甲酸钾','HCOOK'],['乙酸钠','CH3COONa'],['乙酸钾','CH3COOK'],['乙酸铵','CH3COONH4'],['乙酸钙','Ca(CH3COO)2'],['乙酸银','CH3COOAg'],['乙酸锌','Zn(CH3COO)2'],['乙酸铅','Pb(CH3COO)2'],['草酸钠','Na2C2O4'],['草酸钾','K2C2O4'],['草酸钙','CaC2O4'],['苯甲酸钠','C7H5O2Na'],['水杨酸钠','C7H5O3Na'],['柠檬酸钠','Na3C6H5O7']
];
for(const [name,formula]of organicSalts)if(!SUBSTANCES.some(s=>s.formula===formula))add(name,formula,'有机盐');

// Explicitly curated additions; display formulae retain coordination brackets.
for(const [name,formula] of [['六羰基钨','W(CO)6'],['三氟化氮','NF3'],['四氟化碳','CF4'],['氢氧化二氨合银','[Ag(NH3)2]OH'],['硫酸四氨合铜','[Cu(NH3)4]SO4'],['二氰合金酸钾','K[Au(CN)2]']])add(name,formula,'无机物');
organic('苯乙烯',[...Array(8).fill('C')],[...ring,[0,6,1],[6,7,2]],'苯环—CH=CH₂');
organic('乙酸丁酯',['C','C','O','O','C','C','C','C'],[[0,1,1],[1,2,2],[1,3,1],[3,4,1],[4,5,1],[5,6,1],[6,7,1]],'乙酸正丁酯');
organic('萘',Array(10).fill('C'),[[0,1,2],[1,2,1],[2,3,2],[3,4,1],[4,5,2],[5,0,1],[4,6,1],[6,7,2],[7,8,1],[8,9,2],[9,5,1]],'两个共用一条边的六元环');
// Restore entries omitted by the earlier catalogue rewrite.
add("氯化铵","NH4Cl","盐",null);
add("溴化铵","NH4Br","盐",null);
add("碘化铵","NH4I","盐",null);
add("氯甲烷","CH3Cl","有机物",{"nodes":[{"e":"C","h":3,"label":"CH3"},{"e":"Cl","h":0,"label":"Cl"}],"bonds":[[0,1,1]],"reference":"直链末端的碳连接卤素"});
add("氯乙烷","C2H5Cl","有机物",{"nodes":[{"e":"C","h":3,"label":"CH3"},{"e":"C","h":2,"label":"CH2"},{"e":"Cl","h":0,"label":"Cl"}],"bonds":[[0,1,1],[1,2,1]],"reference":"直链末端的碳连接卤素"});
add("氯代正丙烷","C3H7Cl","有机物",{"nodes":[{"e":"C","h":3,"label":"CH3"},{"e":"C","h":2,"label":"CH2"},{"e":"C","h":2,"label":"CH2"},{"e":"Cl","h":0,"label":"Cl"}],"bonds":[[0,1,1],[1,2,1],[2,3,1]],"reference":"直链末端的碳连接卤素"});
add("溴甲烷","CH3Br","有机物",{"nodes":[{"e":"C","h":3,"label":"CH3"},{"e":"Br","h":0,"label":"Br"}],"bonds":[[0,1,1]],"reference":"直链末端的碳连接卤素"});
add("溴乙烷","C2H5Br","有机物",{"nodes":[{"e":"C","h":3,"label":"CH3"},{"e":"C","h":2,"label":"CH2"},{"e":"Br","h":0,"label":"Br"}],"bonds":[[0,1,1],[1,2,1]],"reference":"直链末端的碳连接卤素"});
add("溴代正丙烷","C3H7Br","有机物",{"nodes":[{"e":"C","h":3,"label":"CH3"},{"e":"C","h":2,"label":"CH2"},{"e":"C","h":2,"label":"CH2"},{"e":"Br","h":0,"label":"Br"}],"bonds":[[0,1,1],[1,2,1],[2,3,1]],"reference":"直链末端的碳连接卤素"});
add("碘甲烷","CH3I","有机物",{"nodes":[{"e":"C","h":3,"label":"CH3"},{"e":"I","h":0,"label":"I"}],"bonds":[[0,1,1]],"reference":"直链末端的碳连接卤素"});
add("碘乙烷","C2H5I","有机物",{"nodes":[{"e":"C","h":3,"label":"CH3"},{"e":"C","h":2,"label":"CH2"},{"e":"I","h":0,"label":"I"}],"bonds":[[0,1,1],[1,2,1]],"reference":"直链末端的碳连接卤素"});
add("碘代正丙烷","C3H7I","有机物",{"nodes":[{"e":"C","h":3,"label":"CH3"},{"e":"C","h":2,"label":"CH2"},{"e":"C","h":2,"label":"CH2"},{"e":"I","h":0,"label":"I"}],"bonds":[[0,1,1],[1,2,1],[2,3,1]],"reference":"直链末端的碳连接卤素"});
add("二氯甲烷","CH2Cl2","有机物",{"nodes":[{"e":"C","h":2,"label":"CH2"},{"e":"Cl","h":0,"label":"Cl"},{"e":"Cl","h":0,"label":"Cl"}],"bonds":[[0,1,1],[0,2,1]],"reference":"Cl—CH₂—Cl"});
add("氯仿","CHCl3","有机物",{"nodes":[{"e":"C","h":1,"label":"CH"},{"e":"Cl","h":0,"label":"Cl"},{"e":"Cl","h":0,"label":"Cl"},{"e":"Cl","h":0,"label":"Cl"}],"bonds":[[0,1,1],[0,2,1],[0,3,1]],"reference":"一个 CH 与三个 Cl 分别以单键相连"});
add("四氯化碳","CCl4","有机物",{"nodes":[{"e":"C","h":0,"label":"C"},{"e":"Cl","h":0,"label":"Cl"},{"e":"Cl","h":0,"label":"Cl"},{"e":"Cl","h":0,"label":"Cl"},{"e":"Cl","h":0,"label":"Cl"}],"bonds":[[0,1,1],[0,2,1],[0,3,1],[0,4,1]],"reference":"一个 C 与四个 Cl 分别以单键相连"});
add("焦亚硫酸钾","K2S2O5","无机物",null);
add("溴化锌","ZnBr2","无机物",null);
add("溴化铜","CuBr2","无机物",null);
add("碘化锌","ZnI2","无机物",null);
add("碘化亚铜","CuI","无机物",null);
add("二氧化氯","ClO2","无机物",null);
SUBSTANCES.find(s=>s.name==="丙三醇").aliases=["甘油"];
SUBSTANCES.find(s=>s.name==="乙二酸").aliases=["草酸"];
export const BY_KEY=new Map();for(const s of SUBSTANCES){if(!BY_KEY.has(s.key))BY_KEY.set(s.key,[]);BY_KEY.get(s.key).push(s);}
export const compositionText=counts=>Object.entries(counts).filter(([,n])=>n>0).sort(([a],[b])=>ELEMENTS[a].z-ELEMENTS[b].z).map(([e,n])=>`${e} × ${n}`).join(' · ');
export function explicitGraph(graph){const nodes=graph.nodes.map(n=>({e:n.e,charge:n.charge||0,label:n.e+':'+(n.charge||0)})),bonds=graph.bonds.map(b=>[...b]);graph.nodes.forEach((n,i)=>{for(let h=0;h<n.h;h++){bonds.push([i,nodes.length,1]);nodes.push({e:'H',charge:0,label:'H:0'});}});return{nodes,bonds};}
export function structureMatches(target,drawing){if(!drawing||!Array.isArray(drawing.nodes)||!Array.isArray(drawing.bonds))return false;const g=explicitGraph(target);if(g.nodes.length!==drawing.nodes.length)return false;const assigned=new Set(),mapping=[];for(const node of drawing.nodes){const i=g.nodes.findIndex((n,j)=>!assigned.has(j)&&n.e===node.e&&(n.charge||0)===(node.charge||0));if(i<0)return false;mapping.push(i);assigned.add(i);}if(drawing.bonds.some(b=>!Array.isArray(b)||b.length!==3||b.some(x=>!Number.isInteger(x))||b[0]<0||b[1]<0||b[0]>=mapping.length||b[1]>=mapping.length))return false;return graphMatches(g,drawing.bonds.map(([a,b,o])=>[mapping[a],mapping[b],o]));}
export function graphMatches(graph,bonds){
 const n=graph.nodes.length;if(bonds.length!==graph.bonds.length)return false;
 const matrix=bs=>{const m=Array.from({length:n},()=>Array(n).fill(0));for(const [a,b,o]of bs){if(a===b||a<0||b<0||a>=n||b>=n||![1,2,3].includes(o)||m[a][b])return null;m[a][b]=m[b][a]=o;}return m;};
 const target=matrix(graph.bonds),actual=matrix(bonds);if(!actual)return false;
 const sig=(m,i)=>m[i].filter(Boolean).sort().join(',');const order=Array.from({length:n},(_,i)=>i).sort((a,b)=>sig(target,b).length-sig(target,a).length),map=Array(n).fill(-1),used=new Set();
 function visit(k){if(k===n)return true;const a=order[k];for(let b=0;b<n;b++){if(used.has(b)||graph.nodes[a].label!==graph.nodes[b].label||sig(target,a)!==sig(actual,b))continue;let ok=true;for(let j=0;j<k;j++){let x=order[j];if(target[a][x]!==actual[b][map[x]]){ok=false;break;}}if(ok){map[a]=b;used.add(b);if(visit(k+1))return true;used.delete(b);map[a]=-1;}}return false;}return visit(0);
}
