import { Router, Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../models/User";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const router = Router();


router.post("/register", async (req: Request, res: Response) => {
  const { name, lastname, email, password } = req.body;

  if (!name || !lastname || !email || !password) {
    return res.status(400).json({ message: "Todos os campos são obrigatórios." });
  }

  const userRepository = AppDataSource.getRepository(User);

  try {
    const existingUser = await userRepository.findOneBy({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Este e-mail já está em uso." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = userRepository.create({ name, lastname, email, password: hashedPassword });
    await userRepository.save(newUser);

    const { password: _, ...userWithoutPassword } = newUser;
    return res.status(201).json(userWithoutPassword);

  } catch (error) {
    console.error("Erro no registro:", error);
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
});


router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "E-mail e senha são obrigatórios." });
  }

  const userRepository = AppDataSource.getRepository(User);

  try {
    const user = await userRepository.createQueryBuilder("user")
      .where("user.email = :email", { email })
      .addSelect("user.password")
      .getOne();
      
    if (!user) {
      return res.status(401).json({ message: "Credenciais inválidas." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Credenciais inválidas." });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) { throw new Error("JWT_SECRET não definido no .env"); }

    const token = jwt.sign({ id: user.id, email: user.email, name: user.name, lastname: user.lastname }, jwtSecret, { expiresIn: '12h' });
    
    const { password: _, ...userWithoutPassword } = user;
    return res.status(200).json({ user: userWithoutPassword, token });

  } catch (error) {
    console.error("Erro no login:", error);
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
});