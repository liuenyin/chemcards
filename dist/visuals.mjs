import {getSoundSettings} from './sound.mjs';

const nonmetals=new Set(['H','He','B','C','N','O','F','Ne','Si','P','S','Cl','Ar','Ge','As','Se','Br','Kr','Sb','Te','I','Xe','At','Rn']);
export function elementFinish(e){
 if(e==='C')return 'finish-graphite';
 if(!nonmetals.has(e))return 'finish-metal'+(e==='Au'?' finish-gold':e==='Cu'?' finish-copper':'');
 if(['H','He','N','O','F','Ne','Cl','Ar','Kr','Xe','Rn'].includes(e))return 'finish-gas';
 return 'finish-crystal';
}

// Pure substances at approximately 20–25 °C, ambient pressure.
// Sources and deliberate omissions: docs/substance-visuals.md.
export const FORMULA_THEMES={
 H2O:['#b2c8d0','liquid','无色液体'],
 H2:['#c1cbd0','gas','无色气体'],N2:['#c1cbd0','gas','无色气体'],O2:['#c1cbd0','gas','无色气体'],
 CO2:['#c1cbd0','gas','无色气体'],NH3:['#c1cbd0','gas','无色气体'],CH4:['#c1cbd0','gas','无色气体'],
 Cl2:['#a4b745','gas','黄绿色气体'],Br2:['#95462e','liquid','红棕色液体'],I2:['#514f61','solid','灰黑色晶体'],
 S8:['#d6bd35','solid','黄色晶体'],C:['#51565b','solid','灰黑色固体'],
 Au:['#c89830','solid','金色金属'],Cu:['#b66b46','solid','紫红色金属'],Ag:['#9faeb9','solid','银白色金属'],
 Fe:['#8d979f','solid','银灰色金属'],Al:['#b5c1c7','solid','银白色金属'],Hg:['#aab6c2','liquid','银白色液态金属'],
 NaCl:['#c5cbd0','solid','白色晶体'],AgI:['#d7ad30','solid','黄色固体'],
 KMnO4:['#582a70','solid','深紫色晶体'],
 'CuSO4·5H2O':['#319bcc','solid','蓝色晶体'],
 'Cu(NH3)4SO4·H2O':['#344ca3','solid','深蓝色晶体'],
 Mg:['#adb8c0','solid','银白色金属'],Na:['#b0bac2','solid','银白色金属'],K:['#b0bac2','solid','银白色金属'],
 Ca:['#a3adb5','solid','银灰色金属'],Zn:['#a7b6c3','solid','蓝白色金属'],Ti:['#939fa9','solid','银灰色金属'],Pt:['#aab5bf','solid','银白色金属'],
 He:['#c1cbd0','gas','无色气体'],Ne:['#c1cbd0','gas','无色气体'],Ar:['#c1cbd0','gas','无色气体'],Kr:['#c1cbd0','gas','无色气体'],Xe:['#c1cbd0','gas','无色气体'],
 CO:['#c1cbd0','gas','无色气体'],NO:['#c1cbd0','gas','无色气体'],N2O:['#c1cbd0','gas','无色气体'],
 SO2:['#c1cbd0','gas','无色气体'],H2S:['#c1cbd0','gas','无色气体'],SF6:['#c1cbd0','gas','无色气体'],
 CuO:['#373e43','solid','黑色固体'],Fe2O3:['#a4513d','solid','红棕色固体'],Fe3O4:['#394149','solid','黑色固体'],
 Cr2O3:['#4e8454','solid','绿色固体'],MnO2:['#494139','solid','棕黑色固体'],
 MgO:['#cdd0d2','solid','白色固体'],CaO:['#cdd0d2','solid','白色固体'],ZnO:['#cdd0d2','solid','白色固体'],TiO2:['#cdd0d2','solid','白色固体'],Al2O3:['#cdd0d2','solid','白色固体'],
 K2Cr2O7:['#d47928','solid','橙红色晶体'],K2CrO4:['#d1b839','solid','黄色晶体'],
 CdS:['#d4ad30','solid','黄色固体'],
 'CoCl2·6H2O':['#cf819f','solid','粉红至红色晶体'],
 KCl:['#c5cbd0','solid','白色晶体'],NaBr:['#c5cbd0','solid','白色晶体'],KBr:['#c5cbd0','solid','白色晶体'],
 NaI:['#c5cbd0','solid','白色晶体'],KI:['#c5cbd0','solid','白色晶体'],
 Na2CO3:['#c5cbd0','solid','白色固体'],NaHCO3:['#c5cbd0','solid','白色固体'],CaCO3:['#c5cbd0','solid','白色固体'],
 NaOH:['#c5cbd0','solid','白色固体'],KOH:['#c5cbd0','solid','白色固体'],
 KSCN:['#c5cbd0','solid','无色至白色晶体'],AgCl:['#c5cbd0','solid','白色固体'],
 Cu2O:['#a84c35','solid','砖红色固体'],
 'Cu(OH)2':['#5ca6c9','solid','蓝色固体'],
 'FeSO4·7H2O':['#8bb59d','solid','浅蓝绿色晶体'],
 'NiSO4·7H2O':['#57a37e','solid','绿色晶体'],
 AgBr:['#d7c789','solid','淡黄色固体'],
 'Mg(OH)2':['#d1d4d1','solid','白色固体'],
 'Ca(OH)2':['#d1d4d1','solid','白色固体'],
 'Al(OH)3':['#d1d4d1','solid','白色固体'],
 KNO3:['#cbd1d8','solid','无色至白色晶体'],NaNO3:['#cbd1d8','solid','无色至白色晶体'],
 AgNO3:['#cbd1d8','solid','无色晶体'],H3BO3:['#cbd1d8','solid','白色晶体'],
 'Na2S2O3·5H2O':['#cbd1d8','solid','无色晶体'],
 'MgSO4·7H2O':['#cbd1d8','solid','无色至白色晶体'],
 'KAl(SO4)2·12H2O':['#cbd1d8','solid','无色晶体'],
 'CaSO4·2H2O':['#cccac3','solid','无色至白色晶体'],
 Ni:['#9dabb3','solid','银白色金属'],Cr:['#a1b5c4','solid','银白色金属'],
 Sn:['#bac1c5','solid','银白色金属'],Pb:['#7d8b9d','solid','蓝灰色金属'],W:['#89959e','solid','灰白色金属']
};
// Formula alone cannot identify the phase of an isomer: ethanol != dimethyl ether.
export const NAMED_THEMES={
 '甲醇':['CH4O','#b2c8d0','liquid','无色液体'],
 '乙醇':['C2H6O','#b2c8d0','liquid','无色液体'],
 '二甲醚':['C2H6O','#c1cbd0','gas','无色气体'],
 '乙烷':['C2H6','#c1cbd0','gas','无色气体'],
 '乙烯':['C2H4','#c1cbd0','gas','无色气体'],
 '乙炔':['C2H2','#c1cbd0','gas','无色气体'],
 '丙烷':['C3H8','#c1cbd0','gas','无色气体'],
 '丙烯':['C3H6','#c1cbd0','gas','无色气体'],
 '正丁烷':['C4H10','#c1cbd0','gas','无色气体'],
 '异丁烷':['C4H10','#c1cbd0','gas','无色气体'],
 '正戊烷':['C5H12','#b2c8d0','liquid','无色液体'],
 '新戊烷':['C5H12','#c1cbd0','gas','无色气体'],
 '正己烷':['C6H14','#b2c8d0','liquid','无色液体'],
 '异丙醇':['C3H8O','#b2c8d0','liquid','无色液体'],
 '丙酮':['C3H6O','#b2c8d0','liquid','无色液体'],
 '乙醚':['C4H10O','#b2c8d0','liquid','无色液体'],
 '乙酸乙酯':['C4H8O2','#b2c8d0','liquid','无色液体'],
 '乙二醇':['C2H6O2','#b2c8d0','liquid','无色液体'],
 '丙三醇':['C3H8O3','#b2c8d0','liquid','无色液体'],
 '苯':['C6H6','#b2c8d0','liquid','无色液体'],
 '甲苯':['C7H8','#b2c8d0','liquid','无色液体'],
 '硝基苯':['C6H5NO2','#cbb96b','liquid','无色至淡黄色液体'],
 '苯酚':['C6H6O','#c5cbd0','solid','无色至白色晶体'],
 '萘':['C10H8','#c5cbd0','solid','白色晶体'],
 '尿素':['CH4N2O','#c5cbd0','solid','白色晶体'],
 '甘氨酸':['C2H5NO2','#c5cbd0','solid','白色晶体'],
 '1-丙醇':['C3H8O','#b2c8d0','liquid','无色液体'],
 '1-丁醇':['C4H10O','#b2c8d0','liquid','无色液体'],
 '正庚烷':['C7H16','#b2c8d0','liquid','无色液体'],
 '正辛烷':['C8H18','#b2c8d0','liquid','无色液体'],
 '环己烷':['C6H12','#b2c8d0','liquid','无色液体'],
 '乙酸':['C2H4O2','#b2c8d0','liquid','无色液体'],
 '甲酸':['CH2O2','#b2c8d0','liquid','无色液体'],
 '乙酸甲酯':['C3H6O2','#b2c8d0','liquid','无色液体'],
 '乙腈':['C2H3N','#b2c8d0','liquid','无色液体'],
 '苯甲酸':['C7H6O2','#d0cfd0','solid','白色晶体'],
 '丙氨酸':['C3H7NO2','#d0cfd0','solid','白色晶体'],
 '丁二酸':['C4H6O4','#d0cfd0','solid','白色晶体']
};
export function substanceTheme(formula,name){
 const named=NAMED_THEMES[name];
 const entry=named?.[0]===formula?named.slice(1):FORMULA_THEMES[formula];
 if(!entry)return null;
 const [color,phase,label]=entry;
 const material=formula==='Hg'?'mercury':formula==='C'?'graphite':phase==='gas'?'gas':phase==='liquid'?(name==='丙三醇'?'viscous':'liquid'):label.includes('金属')?'metal':label.includes('晶体')?'crystal':'powder';
 const highlight=formula==='Au'?'#f7e5a5':formula==='Cu'?'#edc0a0':material==='metal'||material==='mercury'?'#e7f0f5':'#ffffff';
 return {color,phase,label,material,highlight,kind:material};
}
export function applySubstanceTheme(move){
 const theme=move&&!move.id?.startsWith('rescue-')&&!move.id?.startsWith('atom-')&&!move.id?.startsWith('custom-')&&getSoundSettings().effects!==false?substanceTheme(move.formula,move.name):null;
 const body=document.body;
 if(!theme){delete body.dataset.substancePhase;delete body.dataset.substanceMaterial;body.style.removeProperty('--substance-highlight');body.style.removeProperty('--substance-color');document.querySelector('.ambient-matter')?.remove();document.querySelector('.substance-effect')?.remove();return;}
 body.dataset.substancePhase=theme.phase;body.dataset.substanceMaterial=theme.material;body.style.setProperty('--substance-highlight',theme.highlight);body.style.setProperty('--substance-color',theme.color);
 let layer=document.querySelector('.ambient-matter');
 if(!layer){layer=document.createElement('div');layer.className='ambient-matter';layer.setAttribute('aria-hidden','true');for(let i=0;i<9;i++){const p=document.createElement('i');p.style.setProperty('--i',i);layer.append(p);}body.prepend(layer);}
}

export function showSubstanceEffect(move,table){
 const theme=substanceTheme(move.formula,move.name);
 if(!table||!theme||move.rescue||getSoundSettings().effects===false||move.id?.startsWith('atom-')||move.id?.startsWith('rescue-')||move.id?.startsWith('custom-'))return;
 table.querySelector('.substance-effect')?.remove();
 const node=document.createElement('div');node.className='substance-effect '+theme.kind;node.setAttribute('aria-hidden','true');node.style.setProperty('--effect-color',theme.color);
 const caption=document.createElement('span');caption.className='effect-caption';caption.textContent=theme.label;node.append(caption);
 if(['crystal','powder'].includes(theme.kind))for(let i=0;i<14;i++){const p=document.createElement('i');p.style.cssText=`--i:${i};left:${12+(i*31)%76}%;top:${22+(i*17)%43}%`;node.append(p);}
 table.append(node);setTimeout(()=>node.remove(),2400);
}
