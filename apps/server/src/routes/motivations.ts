import { Router } from "express";

import { motivationalMessages } from "../data/motivations";

const router = Router();

router.get("/", (_req, res) => {
  if (motivationalMessages.length === 0) {
    return res.status(500).json({ message: "No motivational messages configured." });
  }

  const randomIndex = Math.floor(Math.random() * motivationalMessages.length);
  const message = motivationalMessages[randomIndex];

  return res.json({ message });
});

export default router;
