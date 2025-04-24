import React, { useState, useCallback } from 'react';
import pncpApi from './services/api'; // Importa a API
import RequestForm from './components/RequestForm';
import LicitacoesList from './components/LicitacoesList';
import './styles/App.css'; // Importa o CSS principal

function App() {
    // Estados gerenciados pelo App
    const [licitacoes, setLicitacoes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [currentSearchParams, setCurrentSearchParams] = useState(null); 
    const [totalItems, setTotalItems] = useState(0); // NOVO ESTADO para guardar o total de itens

    const fetchData = useCallback(async (searchParams, page) => {
        setLoading(true);
        setError(null);
        const apiParams = {
            dataFinal: searchParams.dataFinal, // Verificar se /search usa isso
            codigoModalidade: searchParams.codigoModalidade,
            cnpjOrgao: searchParams.cnpjOrgao || undefined,
            ufSigla: searchParams.ufSigla,
            pagina: page,
            tamanhoPagina: 10
        };

        Object.keys(apiParams).forEach(key => apiParams[key] === undefined && delete apiParams[key]);

        try {
            console.log(`Buscando página ${page} com params (frontend):`, apiParams);
            const response = await pncpApi.getOpenProposalContracts(apiParams); // A chamada continua a mesma

            const licitacoesData = response?.items || []; // Pegar do array 'items'
            const calculatedTotalItems = response?.total || 0; // Renomear variável local para evitar conflito com o estado
            const calculatedTotalPages = Math.ceil(calculatedTotalItems / apiParams.tamanhoPagina); // Calcular total de páginas

            console.log("Dados extraídos para licitações:", licitacoesData);
            console.log("Total de itens:", calculatedTotalItems);
            console.log("Total de páginas calculado:", calculatedTotalPages);

            setLicitacoes(licitacoesData);
            setCurrentPage(page); // Usar a página que foi solicitada
            setTotalPages(calculatedTotalPages);
            setTotalItems(calculatedTotalItems); // ATUALIZAR o estado totalItems
            setCurrentSearchParams(searchParams);

        } catch (err) {
            console.error("Erro ao buscar licitações:", err);
            const apiErrorMessage = err.response?.data?.message || err.response?.data?.detail || err.response?.data?.error || (typeof err.response?.data === 'string' ? err.response.data.substring(0, 100) : null);
            const fallbackMessage = "Falha ao buscar licitações. Tente novamente.";
            setError(apiErrorMessage || err.message || fallbackMessage);
            setLicitacoes([]);
            setCurrentPage(1);
            setTotalPages(0);
            setTotalItems(0); // RESETAR totalItems em caso de erro
            setCurrentSearchParams(null);
        } finally {
            setLoading(false);
        }
    }, []); 

    const handleSearch = (searchParams) => {
        setTotalItems(0); // Resetar totalItems ao iniciar uma nova busca
        fetchData(searchParams, 1);  
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages && currentSearchParams) {
            fetchData(currentSearchParams, newPage);
        }
    };

    return (
        <div className="App">
            <h1>Consulta de Licitações PNCP</h1>
            {/* Container para layout lado a lado */}
            <div className="main-container">
                {/* Formulário de Busca */}
                <div className="form-container">
                    <RequestForm onSearch={handleSearch} isLoading={loading} />
                </div>

                {/* Container dos Resultados (com scroll e paginação) */}
                <div className="results-container">
                    <LicitacoesList
                        licitacoes={licitacoes}
                        isLoading={loading}
                        error={error}
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalItems={totalItems}  
                        onPageChange={handlePageChange}
                    />
                </div>
            </div>
        </div>
    );
}

export default App;