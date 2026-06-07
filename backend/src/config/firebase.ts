/**
 * Configuração do Firebase Admin SDK
 * Permite o backend acessar Firestore e outros serviços do Firebase
 */

import admin from "firebase-admin";
import { readFileSync } from "fs";
import { resolve } from "path";

/**
 * Inicializa o Firebase Admin usando credenciais do ambiente
 *
 * Suporta 3 métodos (em ordem de prioridade):
 * 1. FIREBASE_SERVICE_ACCOUNT_JSON: JSON completo da Service Account
 * 2. Arquivo JSON local: guarda-agro-firebase-adminsdk-*.json
 * 3. Variáveis individuais: FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY
 */
function initializeFirebase() {
  // Evita re-inicialização
  if (admin.apps.length > 0) {
    return admin.firestore();
  }

  try {
    // Método 1: JSON completo via variável de ambiente (Vercel)
    if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
      const serviceAccount = JSON.parse(
        process.env.FIREBASE_SERVICE_ACCOUNT_JSON,
      );
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      console.log(
        "[Firebase Config] ✅ Inicializado via FIREBASE_SERVICE_ACCOUNT_JSON",
      );
      return admin.firestore();
    }

    // Método 2: Arquivo JSON local (Desenvolvimento)
    const jsonPath = resolve(
      __dirname,
      "../../guarda-agro-firebase-adminsdk-fbsvc-1ddeef9ea7.json",
    );
    try {
      const serviceAccount = JSON.parse(readFileSync(jsonPath, "utf8"));
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      console.log("[Firebase Config] ✅ Inicializado via arquivo JSON local");
      return admin.firestore();
    } catch (err) {
      // Arquivo não encontrado, tenta método 3
    }

    // Método 3: Variáveis individuais (Fallback)
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

    if (projectId && clientEmail && privateKey) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
      console.log(
        "[Firebase Config] ✅ Inicializado via variáveis individuais",
      );
      return admin.firestore();
    }

    // Nenhum método funcionou
    console.warn(
      "[Firebase Config] ⚠️ Nenhuma credencial encontrada. Usando Application Default Credentials.",
    );
    admin.initializeApp();
    return admin.firestore();
  } catch (error) {
    console.error("[Firebase Config] ❌ Erro ao inicializar:", error);
    throw error;
  }
}

export const db = initializeFirebase();
export { admin };
