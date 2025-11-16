import express from "express";
import { PrismaClient } from "./generated/prisma/client";
import { generateKeypair } from "./utils";
import cors from "cors";

const prisma = new PrismaClient();
console.log(prisma);

const app = express();
app.use(express.json());
app.use(cors());

app.post("/signup", async (req, res) => {
	const { username, password } = req.body;

	const { newuser } = await prisma.$transaction(async (tx) => {
		const newuser = await tx.user.create({
			data: { username, password, privateKey: "", publicKey: "" },
		});
		const { address, key } = await generateKeypair(newuser.id);
		const updateduser = await tx.user.update({
			where: {
				id: newuser.id,
			},
			data: {
				privateKey: key,
				publicKey: address,
			},
		});

		return { newuser: updateduser };
	});

	return res.status(200).json({
		id: newuser.id,
		username: newuser.username,
	});
});
app.get("/deposit-address/:userId", async (req, res) => {
	const { userId } = req.params;
	const user = await prisma.user.findFirst({ where: { id: Number(userId) } });
	res.status(200).json({
		address: user?.publicKey,
	});
});

app.post("/erase-database", async (req, res) => {
	await prisma.user.deleteMany();
	res.status(200).json({ message: "All users deleted" });
});

app.listen(3000, () => {
	console.log(`server is running on port: 3000`);
});
