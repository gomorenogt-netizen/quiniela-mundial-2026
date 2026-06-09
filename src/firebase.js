import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, onValue, push } from "firebase/database";

// ════════════════════════════════════════════════════
// INSTRUCCIONES: Reemplaza estos valores con los de tu proyecto Firebase
// Ve a: https://console.firebase.google.com → Crear proyecto → 
// Build → Realtime Database → Crear → Reglas: read/write = true
// Luego: Configuración del proyecto → Tu app web → Copiar config
// ════════════════════════════════════════════════════
const firebaseConfig = {
 apiKey: "AIzaSyDsCIaibTSkzrEV-pQ1jy_LL_67Mma6BBU",
  authDomain: "quiniela-mundial-7bcc9.firebaseapp.com",
  databaseURL: "https://quiniela-mundial-7bcc9-default-rtdb.firebaseio.com",
  projectId: "quiniela-mundial-7bcc9",
  storageBucket: "quiniela-mundial-7bcc9.firebasestorage.app",
  messagingSenderId: "100984392941",
  appId: "1:100984392941:web:43d28903723066d27dd0e4",
  measurementId: "G-2CZTZJTBTC"
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
