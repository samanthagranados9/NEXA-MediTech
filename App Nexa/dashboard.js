window.sensorState={powered:localStorage.getItem("sensorPowered")==="true",level:Number(localStorage.getItem("sensorLevel")||1)};
function setPowered(v){sensorState.powered=v;localStorage.setItem("sensorPowered",String(v))}
function setLevel(v){sensorState.level=Number(v);localStorage.setItem("sensorLevel",String(v))}
document.addEventListener("DOMContentLoaded",()=>{let file=location.pathname.split("/").pop()||"index.html";let page=file==="grafico.html"?"grafico":file==="niveles.html"?"niveles":"inicio";document.querySelectorAll(".nav a").forEach(a=>a.classList.toggle("active",a.dataset.page===page));});
