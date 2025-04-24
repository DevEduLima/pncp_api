const express = require('express');
const axios = require('axios');
const cors = require('cors');
const fs = require('fs'); 
const path = require('path');

const app = express();
const PORT = 3001;
// Ajuste a URL base da API PNCP para /api/
const PNCP_API_URL = 'https://pncp.gov.br/api';  

// Configuração do CORS
const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Middleware de log
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    next();
});

// Rota de health check (opcional) - Coloque antes do proxy
app.get('/health', (req, res) => {
    res.status(200).send('Proxy server is running');
});

// Função para mapear nomes de parâmetros
const mapParamsToSnakeCase = (params) => {
    const mapped = {};
    const mapping = {
   
        dataFinal: 'data_final',  
        codigoModalidade: 'modalidades',
        cnpjOrgao: 'cnpj_orgao',  
        ufSigla: 'ufs',
 
        pagina: 'pagina',
        tamanhoPagina: 'tam_pagina',
    };

    for (const key in params) {
        // A lógica de mapeamento continua a mesma para os outros campos
        if (mapping[key] && params[key] !== undefined) {
            mapped[mapping[key]] = params[key];
        } else if (params[key] !== undefined && params[key] !== '' && !mapping[key]) {
             console.warn(`Parâmetro não mapeado: ${key}`);
        }
    }

    // Adicionar parâmetros fixos
    mapped.status = 'recebendo_proposta';
    mapped.ordenacao = '-data';
    mapped.tipos_documento = 'edital';

    return mapped;
};

// Middleware Proxy  
app.use('/api/v1', async (req, res) => {
    // O endpoint alvo na API PNCP será sempre /search/
    const targetUrl = `${PNCP_API_URL}/search/`;

    // Mapeia os parâmetros recebidos do frontend (req.query) para snake_case
    const apiParams = mapParamsToSnakeCase(req.query);

    console.log(`[${new Date().toISOString()}] Proxy received: ${req.method} ${req.originalUrl}`);
    console.log(`[${new Date().toISOString()}] Query Params Received:`, req.query);
    console.log(`[${new Date().toISOString()}] Forwarding ${req.method} request to: ${targetUrl}`);
    console.log(`[${new Date().toISOString()}] Mapped Params for PNCP:`, apiParams);

    try {
        const response = await axios({
            method: 'GET', // /search/ provavelmente é sempre GET
            url: targetUrl,
            params: apiParams, // Usa os parâmetros mapeados
            headers: {
                'Accept': req.headers.accept || 'application/json',  
            },
           
        });

         // --- INÍCIO: Código para salvar a resposta em JSON ---
        const responseData = response.data; // Pega os dados da resposta
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-'); // Cria um timestamp para o nome do arquivo
        const filename = `pncp_response_${timestamp}.json`; // Nome do arquivo
        const filepath = path.join(__dirname, 'responses', filename); // Caminho completo (cria pasta 'responses' se não existir)

        // Garante que o diretório 'responses' exista
        const dirname = path.dirname(filepath);
        if (!fs.existsSync(dirname)) {
            fs.mkdirSync(dirname, { recursive: true });
            console.log(`Diretório criado: ${dirname}`);
        }

        // Converte os dados para JSON formatado (pretty print)
        const jsonData = JSON.stringify(responseData, null, 2);

        // Escreve os dados no arquivo de forma assíncrona
        fs.writeFile(filepath, jsonData, 'utf8', (err) => {
            if (err) {
                console.error(`Erro ao salvar o arquivo JSON (${filename}):`, err);
            } else {
                console.log(`Resposta salva com sucesso em: ${filepath}`);
            }
        });

        // Repassa a resposta JSON para o frontend
        res.status(response.status).json(response.data);

    } catch (error) {
        // Log mais detalhado do erro vindo da API do PNCP
        if (error.response) {
            console.error("Error calling PNCP API - Status:", error.response.status);
            console.error("Error calling PNCP API - Headers:", error.response.headers);
            let errorDataPreview = error.response.data;
             if (errorDataPreview && typeof errorDataPreview !== 'string') { try { errorDataPreview = JSON.stringify(errorDataPreview); } catch (e) { } }
             if (typeof errorDataPreview === 'string') { console.error("Error calling PNCP API - Data Preview:", errorDataPreview.substring(0, 500)); }
             else { console.error("Error calling PNCP API - Data Type:", typeof errorDataPreview); }

            res.status(error.response.status).send(error.response.data || { message: 'Erro ao acessar a API do PNCP' });
        } else {
            console.error("Internal Proxy Error:", error.message);
            res.status(500).json({ message: 'Erro interno no servidor proxy', error: error.message });
        }
    }
});

// Middleware para tratar rotas não encontradas
app.use((req, res) => {
    res.status(404).send('Not Found (Proxy)');  
});

app.listen(PORT, () => {
    console.log(`PNCP Proxy Server running on http://localhost:${PORT}`);
});