import { Router } from 'express';
import { UsuarioController } from '../controllers/usuario.controller';

const usuarioRoutes = Router();
const usuarioController = new UsuarioController();

usuarioRoutes.post('/', usuarioController.criar.bind(usuarioController));

export { usuarioRoutes };