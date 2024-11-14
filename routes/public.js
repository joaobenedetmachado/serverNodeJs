import express from 'express';
import DataModel from '../models/data.js'; // Importando o modelo

const router = express.Router();

// Rota GET para obter todos os dados
router.get('/api/data', async (req, res) => {
    try {
        const data = await DataModel.find();
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao obter dados' });
    }
});

// Rota POST para criar novos dados
router.post('/api/data', async (req, res) => {
    const { temperatura, umidade, nivelGas, gps, nivelLuz, botaoPanico } = req.body;

    const newData = new DataModel({ 
        temperatura, 
        umidade, 
        nivelGas, 
        gps, 
        nivelLuz, 
        botaoPanico 
    });

    try {
        await newData.save();
        res.status(201).json({ message: 'Dados recebidos com sucesso!', data: newData });
    } catch (error) {
        res.status(400).json({ message: 'Erro ao salvar dados', error: error.message });
    }
});

export default router;
