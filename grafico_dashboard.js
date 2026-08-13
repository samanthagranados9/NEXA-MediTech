/*
 * NEXA MediTech - Gráfico conectado a Firebase Realtime Database
 * Fuente: /pulsos
 */

const FIREBASE_URL =
  "https://nexa-meditech-default-rtdb.firebaseio.com/pulsos.json";
  
// Ruta para enviar el comando al ESP32
const FIREBASE_CONTROL_URL =
  "https://nexa-meditech-default-rtdb.firebaseio.com/nivel.json";

// Función para enviar el string "bajo", "medio" o "alto" a Firebase
async function enviarComandoFirebase(nivel) {
  try {
    const respuesta = await fetch(FIREBASE_CONTROL_URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(nivel) // Envía "bajo", "medio" o "alto"
    });

    if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);

    console.log(`Comando '${nivel}' enviado a Firebase.`);
  } catch (error) {
    console.error("Error al enviar comando a Firebase:", error);
  }
}

// Asignar el evento CLICK a los botones para enviar la orden
document.querySelectorAll(".level-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const nivel = btn.getAttribute("data-level"); // "bajo", "medio" o "alto"
    if (nivel) {
      enviarComandoFirebase(nivel);
      
      // Resaltar visualmente el botón presionado
      document.querySelectorAll(".level-btn").forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
    }
  });
});

const canvas = document.getElementById("sensorChart");

if (canvas) {
  const ctx = canvas.getContext("2d");
  const statusEl = document.getElementById("firebaseStatus");
  const valueEl = document.getElementById("currentValue");
  const levelEl = document.getElementById("levelLabel");
  const updateEl = document.getElementById("lastUpdate");
  const refreshButton = document.getElementById("refreshButton");
  const stopButton = document.getElementById("stopButton");

  const MAX_POINTS = 30;
  let values = [];
  let labels = [];
  let timer = null;

	function nivelDe(valor) {
	  if (valor >= 0 && valor <= 20) return "Bajo (0 - 20)";
	  if (valor > 20 && valor <= 30) return "Medio (20 - 30)";
	  if (valor > 30 && valor <= 50) return "Alto (30 - 50)";
	  return "Fuera de rango";
	}

	function nivelClase(valor) {
	  if (valor >= 0 && valor <= 20) return "bajo";
	  if (valor > 20 && valor <= 30) return "medio";
	  if (valor > 30 && valor <= 50) return "alto";
	  return "";
	}
  function actualizarBotones(valor) {
    document.querySelectorAll(".level-btn").forEach(btn => {
      btn.classList.remove("selected");
    });

    const clase = nivelClase(valor);
    const boton = clase ? document.querySelector(`.level-btn[data-level="${clase}"]`) : null;
    if (boton) boton.classList.add("selected");
  }

  function horaActual() {
    return new Date().toLocaleTimeString("es-CR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });
  }

  function numeroValido(v) {
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  }

  /*
   * Admite varias estructuras habituales de Firebase:
   *   /pulsos = 25
   *   /pulsos = {key1: 25, key2: 26}
   *   /pulsos = {key1: {valor: 25}, key2: {valor: 26}}
   * También reconoce pulso, value y valor_prueba.
   */
  function extraerValores(datos) {
    if (datos === null || datos === undefined) return [];

    const resultado = [];

    function extraer(item) {
      const directo = numeroValido(item);
      if (directo !== null && typeof item !== "object") {
        resultado.push(directo);
        return;
      }

      if (!item || typeof item !== "object") return;

      for (const campo of ["valor", "pulso", "value", "valor_prueba", "pulsos"]) {
        if (Object.prototype.hasOwnProperty.call(item, campo)) {
          const n = numeroValido(item[campo]);
          if (n !== null) {
            resultado.push(n);
            return;
          }
        }
      }
    }

    if (typeof datos === "number" || typeof datos === "string") {
      extraer(datos);
      return resultado;
    }

    if (Array.isArray(datos)) {
      datos.forEach(extraer);
      return resultado;
    }

    const claves = Object.keys(datos);
    claves.forEach(clave => extraer(datos[clave]));

    return resultado;
  }

	function resizeCanvas() {
		const rect = canvas.getBoundingClientRect();
		const dpr = window.devicePixelRatio || 1;
		if (rect.width > 0 && rect.height > 0) {
		  canvas.width = rect.width * dpr;
		  canvas.height = rect.height * dpr;
		  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		}
	  }
	  
  function actualizarGrafica() {
	resizeCanvas();
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    const L = 60, R = 20, T = 25, B = 55;
    const W = Math.max(10, w - L - R);
    const H = Math.max(10, h - T - B);

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, w, h);

    // Escala adaptativa: deja margen cuando los datos superan 50.
    const maxDato = values.length ? Math.max(...values) : 50;
    const maxY = Math.max(50, Math.ceil(maxDato / 10) * 10 + 10);
    const pasos = maxY <= 100 ? 5 : 6;

    ctx.font = "13px Arial";
    ctx.textAlign = "right";

    for (let i = 0; i <= pasos; i++) {
      const valorY = maxY - (maxY / pasos) * i;
      const y = T + H - (valorY / maxY) * H;

      ctx.strokeStyle = "#e8edf3";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(L, y);
      ctx.lineTo(L + W, y);
      ctx.stroke();

      ctx.fillStyle = "#1a2740";
      ctx.fillText(Math.round(valorY), L - 10, y + 5);
    }

    ctx.textAlign = "left";
    ctx.strokeStyle = "#23334c";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(L, T);
    ctx.lineTo(L, T + H);
    ctx.lineTo(L + W, T + H);
    ctx.stroke();

    // Eje Y
    ctx.save();
    ctx.translate(18, T + H / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = "#1a2740";
    ctx.font = "14px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Pulsos", 0, 0);
    ctx.restore();

    // Eje X
    ctx.fillStyle = "#1a2740";
    ctx.font = "12px Arial";
    ctx.textAlign = "center";
    if (labels.length) {
      const marcas = Math.min(6, labels.length);
      for (let i = 0; i < marcas; i++) {
        const index = labels.length === 1
          ? 0
          : Math.round(i * (labels.length - 1) / (marcas - 1));
        const x = L + (labels.length === 1 ? W / 2 : index / (labels.length - 1) * W);
        ctx.fillText(labels[index], x, T + H + 25);
      }
    }

    if (!values.length) return;

    const puntos = values.map((v, i) => {
      const x = values.length === 1
        ? L + W / 2
        : L + i / (values.length - 1) * W;
      const y = T + H - (v / maxY) * H;
      return [x, y];
    });

    ctx.strokeStyle = "#1268e8";
    ctx.lineWidth = 4;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.beginPath();
    puntos.forEach((p, i) => {
      if (i === 0) ctx.moveTo(p[0], p[1]);
      else ctx.lineTo(p[0], p[1]);
    });
    ctx.stroke();

    ctx.fillStyle = "#1268e8";
    puntos.forEach(p => {
      ctx.beginPath();
      ctx.arc(p[0], p[1], 5, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  function mostrarUltimoValor() {
    if (!values.length) {
      valueEl.textContent = "--";
      levelEl.textContent = "--";
      actualizarBotones(-1);
      actualizarGrafica();
      return;
    }

    const valor = values[values.length - 1];
    valueEl.textContent = valor;
    levelEl.textContent = nivelDe(valor);
    actualizarBotones(valor);
    actualizarGrafica();
  }

	async function leerFirebase() {
		try {
		  const respuesta = await fetch(`${FIREBASE_URL}?_=${Date.now()}`, {
			method: "GET",
			cache: "no-store"
		  });

		  if (!respuesta.ok) {
			throw new Error(`HTTP ${respuesta.status}`);
		  }

		  const datos = await respuesta.json();
		  const nuevos = extraerValores(datos);

		  if (nuevos.length) {
			// SI FIREBASE DEVUELVE MUCHOS DATOS (un arreglo o nodo de historial)
			if (nuevos.length > 1) {
			  values = nuevos.slice(-MAX_POINTS);
			} 
			// SI FIREBASE DEVUELVE UN SOLO DATO EN TIEMPO REAL
			else {
			  const ultimoDato = nuevos[0];

			  // Evita duplicar si no ha cambiado el valor o simplemente añádelo
			  values.push(ultimoDato);

			  // Mantener máximo de puntos visibles (ej. 30 lecturas)
			  if (values.length > MAX_POINTS) {
				values.shift();
			  }
			}

			// Generar etiquetas de tiempo (-29s, -28s, ..., -1s, Ahora)
			labels = values.map((_, i) => {
			  const segundos = values.length - 1 - i;
			  return segundos === 0 ? "Ahora" : `-${segundos}s`;
			});
		  }

		  statusEl.textContent = "● Firebase conectado";
		  statusEl.style.color = "#168d22";
		  updateEl.textContent = horaActual();
		  mostrarUltimoValor();
		} catch (error) {
		  console.error("Firebase:", error);
		  statusEl.textContent = "● Error de conexión con Firebase";
		  statusEl.style.color = "#c91e27";
		}
	  }

  function iniciarLectura() {
    if (timer) clearInterval(timer);
    leerFirebase();
    timer = setInterval(leerFirebase, 1000);
  }

  function detenerLectura() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
    statusEl.textContent = "● Lectura detenida";
    statusEl.style.color = "#c91e27";
  }

  refreshButton.addEventListener("click", leerFirebase);
  stopButton.addEventListener("click", detenerLectura);
  window.addEventListener("resize", actualizarGrafica);

  // Los botones de nivel son indicadores: no modifican Firebase.
  document.querySelectorAll(".level-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const actual = values.length ? values[values.length - 1] : -1;
      actualizarBotones(actual);
    });
  });

  actualizarGrafica();
  iniciarLectura();
}
