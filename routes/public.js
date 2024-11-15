import express from 'express';
import DataModel from '../models/data.js';

const router = express.Router();

// GET ROUTES

// 1. Obter todos os dados
router.get('/api/data', async (req, res) => {
    try {
        const data = await DataModel.find().sort({ createdAt: -1 });
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao obter dados' });
    }
});

// 2. Obter dados mais recentes
router.get('/api/data/latest', async (req, res) => {
    try {
        const latestData = await DataModel.findOne().sort({ createdAt: -1 });
        res.json(latestData);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao obter dado mais recente' });
    }
});

// 3. Obter dados por intervalo de data
router.get('/api/data/range', async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const data = await DataModel.find({
            createdAt: {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            }
        }).sort({ createdAt: -1 });
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao obter dados por intervalo' });
    }
});

// POST ROUTES

// 1. Criar novo registro de dados
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

// 2. Criar múltiplos registros de uma vez
router.post('/api/data/batch', async (req, res) => {
    try {
        const { data } = req.body; // Espera um array de registros
        if (!Array.isArray(data)) {
            return res.status(400).json({ message: 'O corpo da requisição deve conter um array de dados' });
        }

        const savedData = await DataModel.insertMany(data);
        res.status(201).json({ message: 'Dados em lote salvos com sucesso', data: savedData });
    } catch (error) {
        res.status(400).json({ message: 'Erro ao salvar dados em lote', error: error.message });
    }
});

// 3. Criar dados com validação adicional
router.post('/api/data/validated', async (req, res) => {
    try {
        const { temperatura, umidade, nivelGas, gps, nivelLuz, botaoPanico } = req.body;
        
        // Validações adicionais
        if (temperatura < -50 || temperatura > 100) {
            return res.status(400).json({ message: 'Temperatura fora do intervalo válido (-50°C a 100°C)' });
        }
        
        if (umidade < 0 || umidade > 100) {
            return res.status(400).json({ message: 'Umidade deve estar entre 0% e 100%' });
        }
        
        if (nivelGas < 0) {
            return res.status(400).json({ message: 'Nível de gás não pode ser negativo' });
        }

        const newData = new DataModel({
            temperatura,
            umidade,
            nivelGas,
            gps,
            nivelLuz,
            botaoPanico
        });

        await newData.save();
        res.status(201).json({ message: 'Dados validados e salvos com sucesso', data: newData });
    } catch (error) {
        res.status(400).json({ message: 'Erro ao salvar dados validados', error: error.message });
    }
});

export default router;