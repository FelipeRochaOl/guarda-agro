import { bearer } from "@elysia/bearer";
import { Elysia } from "elysia";
import admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
}

export const auth = new Elysia({ name: "auth" })
  .use(bearer())
  .derive({ as: "scoped" }, async ({ bearer, status, headers }) => {
    if (!bearer) {
      return status(401, {
        error: "Unauthorized",
        message: "Token não informado",
      });
    }

    const token = bearer.replace("Bearer ", "").trim();

    if (!token) {
      return status(401, {
        error: "Unauthorized",
        message: "Token inválido",
      });
    }

    try {
      await admin.auth().verifyIdToken(token);
    } catch {
      return status(401, {
        error: "Unauthorized",
        message: "Token Firebase inválido ou expirado",
      });
    }
  });
