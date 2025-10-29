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



















// -------- // -------- GET -------- // -------- //

router.get('/articles', async (req: Request, res: Response) => {
  try{
    const articleRepository = AppDataSource.getRepository(Article);

    // QueryBuilder para selecionar os campos e para fazer o JOIN com a entidade de utilizador.   
    const articles = await articleRepository.createQueryBuilder("article")
      .leftJoinAndSelect("article.user", "user")
      .select([
        "article.id",
        "article.title",
        "article.image",
        "article.content",
        "article.created_at",
        "user.id",
        "user.name",
        "user.lastname",
        "user.profile_picture"
      ]).orderBy("article.created_at", "DESC").getMany();
     
    return res.status(200).json(articles);  

  }
  catch(error){
    console.error('[API Error - Fetching Articles] ', error);
    return res.status(500).json({ message: 'Ocorreu um erro interno no servidor. 31' })
  }
});

router.get('/articles/:id', async (req: Request, res: Response) => {
  try{
    const articleRepository = AppDataSource.getRepository(Article);
    const article_id = parseInt(req.params.id);
  
    const article = await articleRepository.findOneBy({ id: article_id });

    if(!article){
      return res.status(404).json("Artigo não encontrado ou não existe.");
    }

    return res.status(200).json(article);
  }
  catch(error){
    console.error('[API Error - Fetching Article]', error);
    return res.status(500).json({ message: 'Ocorreu um erro interno no servidor. cod3095' })
  }
});

// -------- // -------- POST -------- // -------- //
// (já protegida pelo middleware)
router.post('/articles', protect, upload.single('articleImage'), async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { title, content, tags } = req.body;
      const imageFile = req.file; // Ficheiro da imagem, processado pelo Multer
      const user_id = req.user?.user_id;

      // console.log('### DEBUGGING DADOS RECEBIDOS ###', { title, content, tags, imageFile, user_id });

      if (!title || !content || !tags || !imageFile || !user_id) {
        return res.status(400).json({ message: 'Dados incompletos.' });
      }

      // Faz o upload da imagem para o Cloudinary
      // O req.file.buffer contém os dados binários da imagem
      const uploadResult = await uploadImage(imageFile.buffer, 'articles_escrevak');
      const imageUrl = uploadResult.secure_url; // Pega a URL segura retornada pelo Cloudinary
      const imagePublicId = uploadResult.public_id;

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
        image_public_id: imagePublicId,
        user: currentUser,
      });

      await articleRepository.save(newArticle);

      return res.status(201).json(newArticle);

    } catch (error) {
      console.error('[API Error - Article Creation]', error);
      return res.status(500).json({ message: 'Ocorreu um erro interno no servidor. 32 '});
    }
  },
);

// -------- // -------- PUT -------- // -------- //

router.put('/articles/:id', protect, async (req: AuthenticatedRequest, res: Response) => {
  try{
    const articleRepository = AppDataSource.getRepository(Article);
    const user_id = req.user?.user_id;
    const article_id = parseInt(req.params.id);
    const { title, content, tags } = req.body;

    const articleToUpdate = await articleRepository.findOne({
      where: { id: article_id },
      relations: ['user']
    });

    if(!articleToUpdate){
      return res.status(404).json({ message: 'Artigo não encontrado. 41' });
    }

    if (articleToUpdate.user.id !== user_id){
      return res.status(403).json({ message: 'Acesso negado. Você não é dono deste artigo. 22' });
    }

    articleToUpdate.title = title || articleToUpdate.title;
    articleToUpdate.content = content || articleToUpdate.content;
    articleToUpdate.tags = tags || articleToUpdate.tags;

    await articleRepository.save(articleToUpdate);

    return res.status(200).json(articleToUpdate);
  }
  catch(error){
    console.error('[API Error - Updating Article', error);
    return res.status(500).json({ message: 'Ocorreu um erro interno no servidor. 99' });
  }
});


// -------- // -------- DELETE -------- // -------- //

router.delete('/articles/:id', protect, async (req: AuthenticatedRequest, res: Response) => {
  try{
    const articleRepository = AppDataSource.getRepository(Article);
    const user_id = req.user?.user_id;
    const article_id = parseInt(req.params.id);

    const articleToDelete = await articleRepository.findOne({
      where: { id: article_id },
      relations: ['user']
    });

    if(!articleToDelete){
      return res.status(404).json({ message: 'Artigo não encontrado.' });
    }

    if(articleToDelete.user.id !== user_id){
      return res.status(403).json({ message: 'Acesso negado. Você não é o dono deste artigo.' });
    }

    await articleRepository.save(articleToDelete);

    return res.status(204).send();

  }
  catch(error){
    console.error('[API Error - Deleting Article', error);
    return res.status(500).json({ message: 'Ocorreu um erro interno no servidor. cod: 11' });
  }
});