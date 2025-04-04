import express from "express";
import { login, logout, refreshToken, register } from "../controllers/authController";

const router = express.Router();

router.post("/register", async (req, res) => {
	try {
		await register(req, res);
	} catch (error) {
		res.status(500).send({ error: "Internal Server Error" });
	}
});
router.post("/login", async (req, res) => {
	try {
		await login(req, res);
	} catch (error) {
		res.status(500).send({ error: "Internal Server Error" });
	}
});
router.post("/refresh", async (req, res) => {
	try {
		await refreshToken(req, res);
	} catch (error) {
		res.status(500).send({ error: "Internal Server Error" });
	}
});
router.post("/logout", async (req, res) => {
	try {
		await logout(req, res);
	} catch (error) {
		res.status(500).send({ error: "Internal Server Error" });
	}
});

export default router;
