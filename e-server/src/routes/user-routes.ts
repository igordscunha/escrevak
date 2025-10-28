import { Router, Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../models/User";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import { uploadImage } from '../services/upload-image';
import { DeepPartial } from "typeorm";
import { AuthenticatedRequest, protect } from "../middleware/auth-middleware";


export const router = Router();
const storage = multer.memoryStorage();
const upload = multer({ storage }); 


router.post("/register", upload.single('profilePicture'), async (req: Request, res: Response) => {
  const { name, lastname, email, password, cpf, datebirth } = req.body;
  const imageFile = req.file;

  if (!name || !lastname || !email || !password) {
    return res.status(400).json({ message: "Todos os campos são obrigatórios." });
  }

  const userRepository = AppDataSource.getRepository(User);

  try {

    const existingUser = await userRepository.findOneBy({ email: email });
    if (existingUser) {
      return res.status(409).json({ message: "Este e-mail já está em uso." });
    }

    const cleanedCpf = cpf ? cpf.replace(/[^\d]/g, '') : null;
    if(cleanedCpf){
      const existingCpf = await userRepository.findOneBy({ cpf: cleanedCpf });
      if(existingCpf){
        return res.status(409).json({ message: "Este CPF já está em uso." });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let profilePictureUrl: string | null = null;
    let profilePicturePublicId: string | null = null;

    if(imageFile){
      const uploadResult = await uploadImage(imageFile.buffer, 'user_profile');
      profilePictureUrl = uploadResult.secure_url;
      profilePicturePublicId = uploadResult.public_id;
    }

    const newUser = userRepository.create({
      name,
      lastname,
      email,
      password: hashedPassword,
      cpf: cleanedCpf,
      birth_date: datebirth || null,
      profile_picture: profilePictureUrl,
      profile_picture_public_id: profilePicturePublicId
    } as DeepPartial<User>);

    
    await userRepository.save(newUser);

    const { password: _, cpf: __, ...userSafe } = newUser;
    return res.status(201).json(userSafe);

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

    const token = jwt.sign(
      { user_id: user.id, email: user.email, name: user.name, lastname: user.lastname },
      jwtSecret,
      { expiresIn: '12h' }
    );
    
    const { password: _, ...userWithoutPassword } = user;
    return res.status(200).json({ user: userWithoutPassword, token });

  } catch (error) {
    console.error("Erro no login:", error);
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
});

router.delete("/user/me", protect, async (req: AuthenticatedRequest, res: Response) => {
  try{
    const userRepository = AppDataSource.getRepository(User);
    const user_id = req.user?.user_id;
    
    const userToDelete = await userRepository.findOneBy({ id: user_id });

    if(!userToDelete){
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    await userRepository.remove(userToDelete);

    return res.status(204).send();
  }
  catch(error){
    console.error('[API Error - Deleting User]', error);
    return res.status(500).json({ message: 'Ocorreu um erro interno no servidor. cod: 1092' });
  }
});