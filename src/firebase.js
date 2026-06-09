import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, onValue, push } from "firebase/database";

// ════════════════════════════════════════════════════
// INSTRUCCIONES: Reemplaza estos valores con los de tu proyecto Firebase
// Ve a: https://console.firebase.google.com → Crear proyecto → 
// Build → Realtime Database → Crear → Reglas: read/write = true
// Luego: Configuración del proyecto → Tu app web → Copiar config
// ════════════════════════════════════════════════════
const firebaseConfig = {
  apiKey: "TU_API_KEY_AQUI",
  authDomain: "tu-proyecto.firebaseapp.com",
  databaseURL: "https://tu-proyecto-default-rtdb.firebaseio.com",
  projectId: "tu-proyecto",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "123456789",
  appId: "TU_APP_ID_AQUI"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// ── Database helpers ──
export async function dbSet(path, data) {
  try { await set(ref(db, path), data); return true; }
  catch (e) { console.error("DB set error:", e); return false; }
}

export async function dbGet(path) {
  try {
    const snap = await get(ref(db, path));
    return snap.exists() ? snap.val() : null;
  } catch (e) { console.error("DB get error:", e); return null; }
}

export function dbListen(path, callback) {
  return onValue(ref(db, path), (snap) => {
    callback(snap.exists() ? snap.val() : null);
  });
}

export { db, ref, set, get, onValue, push };
