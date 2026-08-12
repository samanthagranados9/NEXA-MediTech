window.sensor=window.sensor||{};sensor.powered=localStorage.getItem('powered')==='true';sensor.level=Number(localStorage.getItem('level')||1);function setPower(v){sensor.powered=v;localStorage.setItem('powered',v)}function setLevel(v){sensor.level=Number(v);localStorage.setItem('level',v)}document.addEventListener('DOMContentLoaded',()=>{let p=document.getElementById('power');if(p){let d=document.getElementById('dot'),s=document.getElementById('status');let r=()=>{
  p.textContent=sensor.powered?'Apagar':'Encender';
  s.textContent=sensor.powered?'Sensor encendido':'Sensor apagado';
  d.classList.toggle('on',sensor.powered);
  p.classList.toggle('active',sensor.powered);
};
p.onclick=()=>{
  setPower(!sensor.powered);
  r();
};
r()}});