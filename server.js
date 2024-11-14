import express from 'express';
import connectDB from './db.js'; // Importando a conexão com o DB
import publicRoutes from './routes/public.js';

const app = express();
app.use(express.json());

// Conectar ao banco de dados
connectDB();

// Usar as rotas
app.use('/', publicRoutes);

// Iniciar o servidor
app.listen(3000, () => console.log("Servidor Rodando na porta 3000"));
