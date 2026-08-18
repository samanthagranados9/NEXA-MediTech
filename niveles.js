// URL de Firebase Realtime Database
const FIREBASE_CONTROL_URL = "https://nexa-meditech-default-rtdb.firebaseio.com/nivel.json";

// Elemento de texto en pantalla
const selectedLevelEl = document.getElementById("selectedLevel");

// Envío a Firebase
async function enviarComandoFirebase(nivel) {
  try {
    const response = await fetch(FIREBASE_CONTROL_URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(nivel)
    });

    if (response.ok) {
      console.log(`[Firebase] Comando '${nivel}' enviado exitosamente.`);
    } else {
      console.error(`[Firebase] Error al enviar comando: ${response.status}`);
    }
  } catch (error) {
    console.error("[Firebase] Error de conexión:", error);
  }
}

// Efecto visual de pulsación (se enciende y se apaga a los 500ms)
function pulsarBoton(id, nombreTexto) {
  const el = document.getElementById(id);
  if (!el) return;

  // Remueve marcas previas por seguridad
  document.querySelectorAll(".level-row").forEach(row => row.classList.remove("selected"));

  // Enciende visualmente
  el.classList.add("selected");
  selectedLevelEl.textContent = `Enviando disparo: ${nombreTexto}...`;

  // Apaga visualmente tras medio segundo
  setTimeout(() => {
    el.classList.remove("selected");
    selectedLevelEl.textContent = "Esperando comando...";
  }, 500);
}

// Listeners de clics
document.getElementById("btnBajo").addEventListener("click", () => {
  pulsarBoton("btnBajo", "Bajo (Relé 1)");
  enviarComandoFirebase("bajo");
});

document.getElementById("btnMedio").addEventListener("click", () => {
  pulsarBoton("btnMedio", "Medio (Relé 2)");
  enviarComandoFirebase("medio");
});

document.getElementById("btnAlto").addEventListener("click", () => {
  pulsarBoton("btnAlto", "Alto (Relé 3)");
  enviarComandoFirebase("alto");
});

document.getElementById("btnSecuencial").addEventListener("click", () => {
  pulsarBoton("btnSecuencial", "Secuencial Infinito");
  enviarComandoFirebase("secuencial");
});

document.getElementById("btnSimultaneo").addEventListener("click", () => {
  pulsarBoton("btnSimultaneo", "Simultáneo (Todos)");
  enviarComandoFirebase("simultaneo");
});

document.getElementById("offRow").addEventListener("click", () => {
  pulsarBoton("offRow", "Apagado");
  enviarComandoFirebase("ninguno");
});