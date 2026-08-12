const c=document.getElementById('chart');if(c){const x=c.getContext('2d');let a=[10,20,30,40,50],timer=null;function draw(){let w=c.clientWidth,h=c.clientHeight,d=devicePixelRatio||1;c.width=w*d;c.height=h*d;x.setTransform(d,0,0,d,0,0);x.clearRect(0,0,w,h);let L=55,R=15,T=20,B=45,W=w-L-R,H=h-T-B;x.fillStyle='#fff';x.fillRect(0,0,w,h);x.font='14px Arial';for(let n=0;n<=50;n+=10){let y=T+H-n/50*H;x.strokeStyle='#e5e5e5';x.beginPath();x.moveTo(L,y);x.lineTo(L+W,y);x.stroke();x.fillStyle='#111';x.fillText(n,20,y+5)}x.strokeStyle='#111';x.lineWidth=2;x.beginPath();x.moveTo(L,T);x.lineTo(L,T+H);x.lineTo(L+W,T+H);x.stroke();let pts=a.map((v,i)=>[L+i/(a.length-1)*W,T+H-v/50*H]);x.strokeStyle='#3b82f6';x.lineWidth=4;x.beginPath();pts.forEach((p,i)=>i?x.lineTo(...p):x.moveTo(...p));x.stroke();x.fillStyle='#3b82f6';pts.forEach(p=>{x.beginPath();x.arc(p[0],p[1],5,0,7);x.fill()});document.getElementById('level').textContent=sensor.level;document.getElementById('value').textContent=a.at(-1)}function gen(){let [lo,hi]=sensor.level===.5?[5,20]:sensor.level===2?[30,50]:[18,38];return Math.round(lo+Math.random()*(hi-lo))}function refreshButtons(){
  document.querySelectorAll('[data-level]').forEach(b=>{
    b.classList.toggle('selected', Number(b.dataset.level)===Number(sensor.level));
  });
}
document.querySelectorAll('[data-level]').forEach(b=>b.onclick=()=>{
  setLevel(b.dataset.level);
  a.push(gen());
  if(a.length>6)a.shift();
  refreshButtons();
  draw();
});
document.getElementById('simulate').onclick=()=>{setPower(true);clearInterval(timer);timer=setInterval(()=>{a.push(gen());if(a.length>6)a.shift();draw()},1000)};addEventListener('resize',draw);refreshButtons();draw()}