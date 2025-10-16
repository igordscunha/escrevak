import { Router, Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Article } from '../models/Articles';
import { User } from '../models/User';
import { uploadImage } from '../services/upload-image';
import { protect, AuthenticatedRequest } from '../middleware/auth-middleware';
import multer from 'multer';

export const router = Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

// (já protegida pelo middleware)
router.post(
  '/articles',
  protect,
  upload.single('articleImage'),
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { title, content, tags } = req.body;
      const imageFile = req.file; // Ficheiro da imagem, processado pelo Multer
      const user_id = req.user?.user_id;

      if (!title || !content || !tags || !imageFile || !user_id) {
        return res.status(400).json({ message: 'Dados incompletos.' });
      }

      // Faz o upload da imagem para o Cloudinary
      // O req.file.buffer contém os dados binários da imagem
      const uploadResult = await uploadImage(imageFile.buffer);
      const imageUrl = uploadResult.secure_url; // 3. Pega a URL segura retornada pelo Cloudinary

      // Procede para salvar no banco de dados, agora com a URL real
      const userRepository = AppDataSource.getRepository(User);
      const currentUser = await userRepository.findOneBy({ id: user_id });

      if (!currentUser) {
        return res.status(404).json({ message: 'Utilizador não encontrado.' });
      }

      const articleRepository = AppDataSource.getRepository(Article);
      const newArticle = articleRepository.create({
        title,
        content,
        tags: JSON.parse(tags),
        image: imageUrl, // Salva a URL do Cloudinary no banco de dados
        user: currentUser,
      });

      await articleRepository.save(newArticle);

      return res.status(201).json(newArticle);

    } catch (error) {
      console.error('[API Error - Article Creation]', error);
      return res.status(500).json({ message: 'Ocorreu um erro interno no servidor.' });
    }
  },
);