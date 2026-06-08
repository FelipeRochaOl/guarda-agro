import { Elysia, t } from "elysia";
import { NasaController } from "../controllers/nasa.controller";

export const nasaRoutes = new Elysia({ prefix: "/api/nasa" })
  .decorate("nasaController", new NasaController())
  .get(
    "/power",
    ({ nasaController, query, set }) => nasaController.getPowerData(query, set),
    {
      query: t.Object({
        latitude: t.String(),
        longitude: t.String(),
        start: t.String(),
        end: t.String(),
      }),
    },
  )
  .get(
    "/firms",
    ({ nasaController, query, set }) => nasaController.getFirmsData(query, set),
    {
      query: t.Object({
        latitude: t.String(),
        longitude: t.String(),
        days: t.String(),
      }),
    },
  );
