import { Router } from "express";

import todosRouter from "./todos";

const router = Router();

router.get("/", function (_req, res) {
  res.send("Express API is running");
});

router.use("/todos", todosRouter);

export default router;
