import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { AppDataSource } from './data-source';
import { router as articlesRoutes } from './routes/article-routes';
import { router as userRoutes } from './routes/user-routes';

dotenv.config();

// --- INICIALIZAÇÃO DA CONEXÃO PRIMEIRO ---
AppDataSource.initialize()
  .then(() => {
    // Este bloco só executa APÓS a conexão com o banco ser bem-sucedida
    console.log("✅ Conexão com o banco de dados estabelecida com sucesso.");

    // --- Configuração da Aplicação Express ---
    const app = express();
    const PORT = process.env.PORT;

    // Middlewares
    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Use as rotas
    app.use('/api', articlesRoutes);
    app.use('/api', userRoutes);

    // Iniciar o servidor Express APENAS DEPOIS da conexão com o DB
    app.listen(PORT, () => {
      console.log(`Servidor rodando em http://localhost:${PORT}`);
    });

  })
  .catch((error) => {
    // Se a conexão com o banco falhar, o servidor nem sobe.
    console.error("Erro ao conectar com o banco de dados:", error);
  });