// src/routes/roleRoutes.js
import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
  const roles = ["Owner", "Manager", "Staff", "Wholesale", "Customer", "Retail Customer"];
  res.json(roles);
});

export default router;
