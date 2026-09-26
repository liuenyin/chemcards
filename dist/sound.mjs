// Web Audio API Synthesizer & Haptics for Chemcards
let ctx = null, masterGain=null, lastSelect=0;
const defaults={sound:true,haptics:false,effects:true,volume:.35};
let preferences={...defaults};try{Object.assign(preferences,JSON.parse(localStorage.getItem('chemcards-feedback')||'{}'));}catch{}
export function getSoundSettings(){return {...preferences};}
export function setSoundSettings(value){preferences={...preferences,...value,volume:Math.max(0,Math.min(1,Number(value.volume??preferences.volume)||0))};try{localStorage.setItem('chemcards-feedback',JSON.stringify(preferences));}catch{}if(masterGain)masterGain.gain.value=preferences.volume;}
function output(c){if(!masterGain){masterGain=c.createGain();masterGain.connect(c.destination);}masterGain.gain.value=preferences.volume;return masterGain;}

function getContext() {
  if (!ctx && typeof window !== 'undefined') {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {try{ctx = new AudioContext();}catch{return null;}}
  }
  if (ctx && ctx.state === 'suspended') {
    ctx.resume().catch(() => {});
  }
  return ctx;
}
if(typeof window!=='undefined'){window.addEventListener('pointerdown',()=>getContext(),{once:true});}


export function playSound(type) {
  if(type==='select'){if(Date.now()-lastSelect<30)return;lastSelect=Date.now();}
  if(preferences.haptics&&typeof navigator!=='undefined'){try{navigator.vibrate?.(type==='play'?[12,20,12]:type==='select'?6:10);}catch{}}
  if(!preferences.sound||preferences.volume===0)return;
  const c = getContext();
  if (!c) return;
  const now = c.currentTime;

  try {
    if (type === 'select') {
      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(650, now);
      osc.frequency.exponentialRampToValueAtTime(1100, now + 0.035);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);
      osc.connect(gain);
      gain.connect(output(c));
      osc.start(now);
      osc.stop(now + 0.035);

    } else if (type === 'deal') {
      const bufferSize = c.sampleRate * 0.05;
      const buffer = c.createBuffer(1, bufferSize, c.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.25));
      }
      const noise = c.createBufferSource();
      noise.buffer = buffer;
      const filter = c.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1200, now);
      filter.Q.setValueAtTime(2.5, now);
      const gain = c.createGain();
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(output(c));
      noise.start(now);
    } else if (type === 'play') {
      const freqs = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      freqs.forEach((freq, idx) => {
        const osc = c.createOscillator();
        const gain = c.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.03);
        gain.gain.setValueAtTime(0.08, now + idx * 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.03 + 0.3);
        osc.connect(gain);
        gain.connect(output(c));
        osc.start(now + idx * 0.03);
        osc.stop(now + idx * 0.03 + 0.3);
      });

    } else if (type === 'skip') {
      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(70, now + 0.05);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.connect(gain);
      gain.connect(output(c));
      osc.start(now);
      osc.stop(now + 0.05);

    } else if (type === 'warn') {
      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(440, now);
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.connect(gain);
      gain.connect(output(c));
      osc.start(now);
      osc.stop(now + 0.08);

    }
  } catch {}
}
