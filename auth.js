// NEXA MediTech - Firebase Authentication
// Colocar este archivo como auth.js.
// NO contiene usuario ni contraseña.
//
// El index.html debe tener estos IDs:
// loginOverlay, loginForm, loginEmail, loginPassword, loginError
//
// Firebase Authentication debe tener habilitado:
// Authentication > Sign-in method > Email/Password

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

function showError(message = "") {
  if (!loginError) return;
  loginError.textContent = message;
  loginError.style.display = message ? "block" : "none";
}

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
      // onAuthStateChanged se encarga de redirigir.
    } catch (error) {
      console.error("Firebase Authentication:", error);

      switch (error.code) {
        case "auth/invalid-credential":
        case "auth/wrong-password":
        case "auth/user-not-found":
          showError("Usuario o contraseña incorrectos.");
          break;

        case "auth/invalid-email":
          showError("El correo electrónico no es válido.");
          break;

        case "auth/too-many-requests":
          showError("Demasiados intentos. Intente nuevamente más tarde.");
          break;

        case "auth/operation-not-allowed":
          showError("Email/Password no está habilitado en Firebase.");
          break;

        case "auth/network-request-failed":
          showError("No se pudo conectar con Firebase.");
          break;

        default:
          showError("No fue posible iniciar sesión.");
      }
    } finally {
      if (loginButton) {
        loginButton.disabled = false;
        loginButton.textContent = "Ingresar";
      }
    }
  });
}

// Función opcional para usar un botón Salir en otras páginas.
window.nexaLogout = async function () {
  await signOut(auth);
  window.location.href = "index.html";
};
