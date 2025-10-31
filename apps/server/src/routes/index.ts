import { Router } from "express";

import motivationsRouter from "./motivations";
import todosRouter from "./todos";

const router = Router();

router.get("/", function (_req, res) {
  res.send("Express API is running");
});

router.use("/todos", todosRouter);
router.use("/motivations", motivationsRouter);

export default router;
