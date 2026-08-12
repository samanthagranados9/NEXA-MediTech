function name(v){return Number(v)===.5?'Bajo':Number(v)===2?'Alto':'Medio'}function refresh(){
  document.getElementById('selected').textContent=name(sensor.level);
  document.getElementById('state').textContent=sensor.powered?'Encendido':'Apagado';
  document.getElementById('leveldot').classList.toggle('on',sensor.powered);

  document.querySelectorAll('.level[data-level]').forEach(b=>{
    b.classList.toggle('selected',
      sensor.powered && Number(b.dataset.level)===Number(sensor.level)
    );
  });

  document.getElementById('off').classList.toggle('selected',!sensor.powered);
}document.querySelectorAll('.level[data-level]').forEach(b=>b.onclick=()=>{setLevel(b.dataset.level);setPower(true);refresh()});document.getElementById('off').onclick=()=>{setPower(false);refresh()};refresh();