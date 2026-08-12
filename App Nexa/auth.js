import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  onAuthStateChanged, 
  signOut 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// Tus credenciales de Firebase cargadas
const firebaseConfig = {
  apiKey: "AIzaSyCuIYEpnRhMKw6jsuvD-k3sgN2n8sh5ZCk",
  authDomain: "nexa-meditech.firebaseapp.com",
  projectId: "nexa-meditech",
  storageBucket: "nexa-meditech.firebasestorage.app",
  messagingSenderId: "1074092039972",
  appId: "1:1074092039972:web:9c4684e3fa54fade405db1"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const loginOverlay = document.getElementById('loginOverlay');
const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');
const logoutBtn = document.getElementById('logoutBtn');
const userEmailDisplay = document.getElementById('userEmailDisplay');

// Control del estado del usuario
onAuthStateChanged(auth, (user) => {
  if (user) {
    loginOverlay.classList.add('hidden');
    logoutBtn.classList.remove('hidden');
    userEmailDisplay.textContent = user.email;
  } else {
    loginOverlay.classList.remove('hidden');
    logoutBtn.classList.add('hidden');
    userEmailDisplay.textContent = '';
  }
});

// Login
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  loginError.style.display = 'none';

  try {
    await signInWithEmailAndPassword(auth, email, password);
    loginForm.reset();
  } catch (error) {
    loginError.style.display = 'block';
    loginError.textContent = 'Correo o contraseña incorrectos.';
  }
});

// Logout
logoutBtn.addEventListener('click', () => {
  signOut(auth);
});