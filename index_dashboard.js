// URL de Firebase Realtime Database
const FIREBASE_CONTROL_URL = "https://nexa-meditech-default-rtdb.firebaseio.com/nivel.json";

const p = document.getElementById("powerButton");
const simultaneoBtn = document.getElementById("simultaneoButton");

// Función para enviar comandos a Firebase
async function enviarComandoFirebase(comando) {
  try {
    const respuesta = await fetch(FIREBASE_CONTROL_URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(comando)
    });

    if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);

    console.log(`[Firebase] Comando '${comando}' enviado exitosamente desde Inicio.`);
  } catch (error) {
    console.error("[Firebase] Error al enviar comando desde Inicio:", error);
  }
}

// Refresca la interfaz gráfica del botón de encendido/apagado principal
function refreshPower() {
  const on = sensorState.powered;
  document.getElementById("statusLight").classList.toggle("on", on);
  document.getElementById("statusWord").textContent = on ? "ENCENDIDO" : "APAGADO";
  document.getElementById("statusDesc").textContent = on ? "El sensor está activo" : "El sensor está inactivo";
  p.textContent = on ? "Apagar" : "Encender";
  p.classList.toggle("off", on);
}

// Evento Click: Botón Encender / Apagar principal
p.onclick = () => {
  const nuevoEstado = !sensorState.powered;
  setPowered(nuevoEstado);
  refreshPower();

  if (nuevoEstado) {
    // Si se enciende desde Inicio, puedes activar el modo por defecto que gustes
    console.log("Sistema encendido desde la web.");
  } else {
    // AL APAGAR: Envía 'ninguno' a Firebase para que la ESP32 apague todos los relés
    enviarComandoFirebase("ninguno");
  }
};

// Evento Click: Botón Modo Simultáneo
if (simultaneoBtn) {
  simultaneoBtn.onclick = () => {
    // Asegura que el estado visual marque como encendido
    if (!sensorState.powered) {
      setPowered(true);
      refreshPower();
    }

    // Efecto de pulsación
    simultaneoBtn.style.opacity = "0.7";
    setTimeout(() => {
      simultaneoBtn.style.opacity = "1";
    }, 400);

    // Envía la orden "simultaneo" (los enciende todos en la ESP32)
    enviarComandoFirebase("simultaneo");
  };
}

p.onclick = () => {
  const nuevoEstado = !sensorState.powered;
  setPowered(nuevoEstado);
  refreshPower();

  if (!nuevoEstado) {
    // Apagar de inmediato
    enviarComandoFirebase("ninguno");
  }
};

// Inicializar estado visual al cargar la página
refreshPower();