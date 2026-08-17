const openBtn=document.getElementById('openBtn');
const lastBtn=document.getElementById('lastBtn');
const lastMessage=document.getElementById('lastMessage');
const soundBtn=document.getElementById('soundBtn');
let audioCtx=null, soundOn=false;

function go(id){document.getElementById(id).scrollIntoView({behavior:'smooth'});}
openBtn.addEventListener('click',()=>{go('intro'); burst(24); startSound();});
lastBtn.addEventListener('click',()=>{lastMessage.classList.add('show'); lastBtn.style.display='none'; burst(65); startSound(); setTimeout(()=>go('final'),100);});

function burst(count=30){
  const colors=['#e9a9be','#f7d7e1','#ffffff','#c9879e'];
  for(let i=0;i<count;i++){
    const el=document.createElement('span'); el.className='petal';
    el.style.left=(Math.random()*100)+'vw'; el.style.top=(-5-Math.random()*15)+'vh';
    el.style.background=colors[Math.floor(Math.random()*colors.length)];
    el.style.width=(5+Math.random()*7)+'px'; el.style.height=(8+Math.random()*9)+'px';
    el.style.animationDuration=(4+Math.random()*4)+'s'; el.style.animationDelay=(Math.random()*.8)+'s';
    document.querySelector('.petals').appendChild(el);
    setTimeout(()=>el.remove(),9000);
  }
}

function startSound(){
  if(soundOn)return;
  try{
    audioCtx=new (window.AudioContext||window.webkitAudioContext)();
    soundOn=true; soundBtn.textContent='♫';
    chime();
  }catch(e){}
}
function chime(){
  if(!audioCtx)return;
  const notes=[261.63,329.63,392,523.25];
  notes.forEach((freq,i)=>{
    const osc=audioCtx.createOscillator(), gain=audioCtx.createGain();
    osc.type='sine'; osc.frequency.value=freq;
    gain.gain.setValueAtTime(0,audioCtx.currentTime+i*.14);
    gain.gain.linearRampToValueAtTime(.035,audioCtx.currentTime+i*.14+.03);
    gain.gain.exponentialRampToValueAtTime(.001,audioCtx.currentTime+i*.14+.8);
    osc.connect(gain); gain.connect(audioCtx.destination); osc.start(audioCtx.currentTime+i*.14); osc.stop(audioCtx.currentTime+i*.14+.85);
  });
}
soundBtn.addEventListener('click',()=>{if(!audioCtx){startSound();return;} if(audioCtx.state==='suspended'){audioCtx.resume();soundOn=true;soundBtn.textContent='♫';chime();}else{audioCtx.suspend();soundOn=false;soundBtn.textContent='♪';}});

// Tiny ambient sparkle effect on the opening screen.
setInterval(()=>{if(Math.random()>.55)burst(1)},1800);

// Clickable photo lightbox
const lightbox=document.createElement('div');
lightbox.id='lightbox';
lightbox.innerHTML='<button aria-label="Tutup">×</button><img alt="Foto diperbesar">';
Object.assign(lightbox.style,{position:'fixed',inset:'0',background:'rgba(12,6,16,.92)',display:'none',placeItems:'center',zIndex:'100',padding:'25px'});
lightbox.querySelector('img').style.cssText='max-width:92vw;max-height:88vh;object-fit:contain;border:1px solid rgba(255,255,255,.15);box-shadow:0 30px 90px rgba(0,0,0,.5)';
lightbox.querySelector('button').style.cssText='position:absolute;top:18px;right:20px;border:0;background:none;color:white;font-size:38px;cursor:pointer';
document.body.appendChild(lightbox);
document.querySelectorAll('.photo-card img').forEach(img=>img.addEventListener('click',()=>{lightbox.style.display='grid';lightbox.querySelector('img').src=img.src}));
lightbox.addEventListener('click',e=>{if(e.target===lightbox||e.target.tagName==='BUTTON')lightbox.style.display='none'});
