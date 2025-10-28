import 'reflect-metadata';
import { AppDataSource } from './data-source';
import { Article } from './models/Articles';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Extrai o public_id de uma URL do Cloudinary.
 * Ex: https://res.cloudinary.com/.../v12345/articles_escrevak/image.jpg -> articles_escrevak/image
 * @param url A URL completa da imagem.
 * @returns O public_id da imagem.
 */
const extractPublicIdFromUrl = (url: string): string => {
  // Encontra a parte da URL após a versão (ex: /v123456789/)
  const partsAfterVersion = url.split(/\/v\d+\//)[1];
  if (!partsAfterVersion) {
    throw new Error('Formato de URL do Cloudinary inválido. Não foi possível encontrar a versão.');
  }

  // Remove a extensão do ficheiro (ex: .jpg, .png)
  const publicIdWithExtension = partsAfterVersion;
  const lastDotIndex = publicIdWithExtension.lastIndexOf('.');
  const publicId = publicIdWithExtension.substring(0, lastDotIndex);

  return publicId;
};

const deleteArticle = async (articleId: number) => {
  if (!articleId) {
    console.error('ERRO: Por favor, forneça o ID do artigo a ser excluído.');
    console.log('Uso: ts-node delete-article.ts <ID_DO_ARTIGO>');
    return;
  }

  console.log(`A iniciar a exclusão do artigo com ID: ${articleId}...`);

  try {
    // Conecta à base de dados
    await AppDataSource.initialize();
    console.log('Conexão com a base de dados estabelecida.');
    const articleRepository = AppDataSource.getRepository(Article);

    // Encontra o artigo
    const article = await articleRepository.findOneBy({ id: articleId });
    if (!article) {
      console.error(`Artigo com ID ${articleId} não encontrado.`);
      await AppDataSource.destroy();
      return;
    }
    console.log(`Artigo encontrado: "${article.title}"`);

    // Extrair o public_id e excluir a imagem do Cloudinary
    const publicId = extractPublicIdFromUrl(article.image);
    console.log(`A excluir imagem do Cloudinary com public_id: ${publicId}`);

    const cloudinaryResult = await cloudinary.uploader.destroy(publicId);

    if (cloudinaryResult.result === 'ok') {
      console.log('Imagem excluída com sucesso do Cloudinary.');
    } else {
      // Mesmo que falhe, continua para apagar o artigo da BD
      console.warn('A imagem não foi encontrada ou não pôde ser excluída do Cloudinary.', cloudinaryResult);
    }

    // Excluir o artigo da base de dados
    await articleRepository.remove(article);
    console.log(`Artigo "${article.title}" excluído com sucesso da base de dados.`);

  } catch (error) {
    console.error('Ocorreu um erro durante o processo de exclusão:', error);
  } finally {
    // Fechar a conexão com a base de dados
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      console.log('Conexão com a base de dados fechada.');
    }
  }
};

// Pega o ID do artigo a partir dos argumentos da linha de comando
const articleIdFromArgs = process.argv[2];
deleteArticle(parseInt(articleIdFromArgs));