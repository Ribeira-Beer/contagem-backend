import express from 'express';
import cors from 'cors';
import { revendaRoutes } from './routes/revenda.routes';
import { conferenteRoutes } from './routes/conferente.routes';
import { areaRoutes } from './routes/area.routes';
import { produtoRoutes } from './routes/produto.routes';
import { contagemRoutes } from './routes/contagem.routes';
import { AuthController } from './controllers/auth.controller';
import { authMiddleware } from './middlewares/auth.middleware';
import { usuarioRoutes } from './routes/usuario.routes';
import { prisma } from './config/prisma'; // CORRIGIDO AQUI: Adicionado as chaves { }

const app = express();

app.use(cors());
app.use(express.json());

app.get('/ping', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({
      status: 'ok',
      db: 'connected',
      timestamp: new Date().toISOString(),
    });
  } catch {
    res.status(200).json({
      status: 'ok',
      db: 'warming_up',
      timestamp: new Date().toISOString(),
    });
  }
});

const authController = new AuthController();
app.post('/login', authController.login.bind(authController));

app.use('/usuarios', usuarioRoutes);
app.use('/revendas', authMiddleware, revendaRoutes);
app.use('/conferentes', authMiddleware, conferenteRoutes);
app.use('/areas', authMiddleware, areaRoutes);
app.use('/produtos', authMiddleware, produtoRoutes);
app.use('/contagens', authMiddleware, contagemRoutes);

export { app };
