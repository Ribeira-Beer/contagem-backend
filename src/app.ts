import express from 'express';
import { revendaRoutes } from './routes/revenda.routes';
import { conferenteRoutes } from './routes/conferente.routes';
import { areaRoutes } from './routes/area.routes';
import { produtoRoutes } from './routes/produto.routes';
import { contagemRoutes } from './routes/contagem.routes';

const app = express();

app.use(express.json());

app.use('/revendas', revendaRoutes);
app.use('/conferentes', conferenteRoutes);
app.use('/areas', areaRoutes);
app.use('/produtos', produtoRoutes);
app.use('/contagens', contagemRoutes)

export { app };