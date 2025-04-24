import React from 'react';

const LicitacoesList = ({ licitacoes, isLoading, error, currentPage, totalPages, totalItems, onPageChange }) => {

  const formatarData = (dataString) => {
    if (!dataString) return 'N/A';
    try {
      const data = new Date(dataString);
      if (isNaN(data.getTime())) {
        return dataString;
      }
      return data.toLocaleString('pt-BR', {
        dateStyle: 'short',
        timeStyle: 'short'
      });
    } catch (e) {
      console.error("Erro ao formatar data:", dataString, e);
      return dataString;
    }
  };

  if (isLoading) {
    return <div className="spinner"></div>;
  }

  if (error) {
    return <p className="error-message">Erro: {error}</p>;
  }

  if (!isLoading && !error && totalItems === 0 && licitacoes.length === 0) {
    return <p className="info-message">Utilize o formulário para iniciar a busca.</p>;
  }

  if (!isLoading && !error && totalItems === 0 && licitacoes.length === 0) {
    return <p className="info-message">Nenhuma licitação encontrada com os critérios informados.</p>;
  }

  return (
    <div className="licitacoes-list-wrapper">
      <h2>
        Resultados da Consulta
        {totalItems > 0 && ` (${totalItems} ${totalItems === 1 ? 'item encontrado' : 'itens encontrados'})`}
      
      </h2>
      <div className="list-scroll-container">
        <ul>
          {licitacoes.map((item, index) => (
            <li key={item.id || item.numero_controle_pncp || index} className="licitacao-item">
              <h3>{item.description || item.title || 'Objeto não informado'}</h3>
              <p><strong>Órgão:</strong> {item.orgao_nome || 'N/A'} ({item.orgao_cnpj || 'N/A'})</p>
              <p><strong>Unidade:</strong> {item.unidade_nome || 'N/A'} - {item.municipio_nome || 'N/A'}/{item.uf || 'N/A'}</p>
              <p><strong>Modalidade:</strong> {item.modalidade_licitacao_nome || 'N/A'}</p>
              <p><strong>Número:</strong> {item.numero_sequencial || 'N/A'} / {item.ano || 'N/A'}</p>
              <p><strong>Publicação PNCP:</strong> {formatarData(item.data_publicacao_pncp)}</p>
              <p><strong>Abertura Proposta:</strong> N/A</p>
              <p><strong>Encerramento Proposta:</strong> N/A</p>
              <p><strong>Situação:</strong> {item.situacao_nome || 'N/A'}</p>
              {item.item_url && (
                <p><a
                href={`https://pncp.gov.br${item.item_url.replace('/compras/', '/editais/')}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Ver detalhes no PNCP
              </a>
            </p>
              )}
            </li>
          ))}
        </ul>
      </div>

      {totalPages > 1 && (
        <div className="pagination-controls">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1 || isLoading}
          >
            Anterior
          </button>
          <span>Página {currentPage} de {totalPages}</span>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages || isLoading}
          >
            Próxima
          </button>
        </div>
      )}
    </div>
  );
};

export default LicitacoesList;