// NEXA MediTech - Firebase Authentication - FINAL
// No contiene usuario ni contraseña.
// No redirecciona a bienvenida.html.

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCuIYEpnRhMKw6jsuvD-k3sgN2n8sh5ZCk",
  authDomain: "nexa-meditech.firebaseapp.com",
  databaseURL: "https://nexa-meditech-default-rtdb.firebaseio.com",
  projectId: "nexa-meditech",
  storageBucket: "nexa-meditech.firebasestorage.app",
  messagingSenderId: "1074092039972",
  appId: "1:1074092039972:web:9c4684e3fa54fade405db1"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const loginOverlay = document.getElementById("loginOverlay");
const loginForm = document.getElementById("loginForm");
const loginError = document.getElementById("loginError");
const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");
const loginButton = document.getElementById("loginButton");
const logoutBtn = document.getElementById("logoutBtn");
const userEmailDisplay = document.getElementById("userEmailDisplay");

function showError(message = "") {
  if (!loginError) return;
  loginError.textContent = message;
  loginError.style.display = message ? "block" : "none";
}

onAuthStateChanged(auth, (user) => {
  if (user) {
    if (loginOverlay) loginOverlay.classList.add("hidden");
    if (logoutBtn) logoutBtn.classList.remove("hidden");
    if (userEmailDisplay) userEmailDisplay.textContent = user.email || "";
  } else {
    if (loginOverlay) loginOverlay.classList.remove("hidden");
    if (logoutBtn) logoutBtn.classList.add("hidden");
    if (userEmailDisplay) userEmailDisplay.textContent = "";
  }
});

if (loginForm) {
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    showError("");

    const email = loginEmail?.value.trim() || "";
    const password = loginPassword?.value || "";

    if (!email || !password) {
      showError("Ingrese usuario y contraseña.");
      return;
    }

    if (loginButton) {
      loginButton.disabled = true;
      loginButton.textContent = "Validando...";
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Firebase Authentication:", error);

      const messages = {
        "auth/invalid-credential": "Usuario o contraseña incorrectos.",
        "auth/wrong-password": "Usuario o contraseña incorrectos.",
        "auth/user-not-found": "Usuario o contraseña incorrectos.",
        "auth/invalid-email": "El correo electrónico no es válido.",
        "auth/too-many-requests": "Demasiados intentos. Intente nuevamente más tarde.",
        "auth/operation-not-allowed": "Email/Password no está habilitado en Firebase Authentication.",
        "auth/network-request-failed": "No se pudo conectar con Firebase.",
        "auth/unauthorized-domain": "El dominio actual no está autorizado en Firebase Authentication."
      };

      showError(messages[error.code] || ("Error de Firebase: " + (error.code || error.message)));
    } finally {
      if (loginButton) {
        loginButton.disabled = false;
        loginButton.textContent = "Ingresar";
      }
    }
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error cerrando sesión:", error);
    }
  });
}
