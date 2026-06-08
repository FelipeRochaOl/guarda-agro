import { Elysia, t } from "elysia";
import { AnalysisController } from "../controllers/analysis.controller";

export const analysisRoutes = new Elysia({ prefix: "/" })
  .decorate("analysisController", new AnalysisController())
  .get(
    "/analysis",
    ({ analysisController, query, set }) =>
      analysisController.getAnalysis(query, set),
    {
      query: t.Object({
        latitude: t.String(),
        longitude: t.String(),
        days: t.String(),
      }),
    },
  )
  .post(
    "/analysis/history",
    ({ analysisController, body, set }) =>
      analysisController.saveHistory(body, set),
    {
      body: t.Object({
        userId: t.String(),
        result: t.Any(),
        locationLabel: t.Optional(t.String()),
      }),
    },
  )
  .get(
    "/analysis/history",
    ({ analysisController, query, set }) =>
      analysisController.getHistory(query, set),
    {
      query: t.Object({
        userId: t.String(),
      }),
    },
  );
