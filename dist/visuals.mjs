import {getSoundSettings} from './sound.mjs';

const nonmetals=new Set(['H','He','B','C','N','O','F','Ne','Si','P','S','Cl','Ar','Ge','As','Se','Br','Kr','Sb','Te','I','Xe','At','Rn']);
export function elementFinish(e){
 if(e==='C')return 'finish-graphite';
 if(!nonmetals.has(e))return 'finish-metal'+(e==='Au'?' finish-gold':e==='Cu'?' finish-copper':'');
 if(['H','He','N','O','F','Ne','Cl','Ar','Kr','Xe','Rn'].includes(e))return 'finish-gas';
 return 'finish-crystal';
}

// Specific substance/phase cues, not a claim that forming a formula is a reaction.
export function substanceTheme(formula){
 if(['KMnO4','NaMnO4'].includes(formula))return {color:'#8b2cb5',label:'高锰酸根溶液的紫色',kind:'glow'};
 if(['[Cu(NH3)4]SO4','Cu(NH3)4SO4·H2O'].includes(formula))return {color:'#234cc6',label:'铜氨配合物溶液的深蓝色',kind:'glow'};
 if(formula==='AgI')return {color:'#d7ad30',label:'碘化银的黄色沉淀',kind:'crystal'};
 if(formula==='CuSO4·5H2O')return {color:'#319bcc',label:'五水硫酸铜的蓝色晶体',kind:'crystal'};
 if(formula==='Au')return {color:'#c89830',label:'金的金属光泽',kind:'glow'};
 // Tungsten hexacarbonyl and gold compounds are not generically gold-colored.
 return null;
}

export function showSubstanceEffect(move,table){
 const theme=substanceTheme(move.formula);
 if(!table||!theme||move.rescue||getSoundSettings().effects===false)return;
 table.querySelector('.substance-effect')?.remove();
 const node=document.createElement('div');node.className='substance-effect '+theme.kind;node.setAttribute('aria-hidden','true');node.style.setProperty('--effect-color',theme.color);
 const caption=document.createElement('span');caption.className='effect-caption';caption.textContent=theme.label;node.append(caption);
 if(theme.kind==='crystal')for(let i=0;i<14;i++){const p=document.createElement('i');p.style.cssText=`--i:${i};left:${12+(i*31)%76}%;top:${22+(i*17)%43}%`;node.append(p);}
 table.append(node);setTimeout(()=>node.remove(),2400);
}
