import React, { useState } from 'react';

const RequestForm = ({ onSearch, isLoading }) => {
    const [codigoModalidade, setCodigoModalidade] = useState('');
    const [cnpjOrgao, setCnpjOrgao] = useState('');
    const [uf, setUf] = useState('');
    const [categoriaDocumento, setCategoriaDocumento] = useState('');

    const getFormattedDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}${month}${day}`;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const currentDate = new Date();
        const formattedDate = getFormattedDate(currentDate);

        const searchParams = {
            dataFinal: formattedDate,
            codigoModalidade: codigoModalidade,
            cnpjOrgao: cnpjOrgao,
            ufSigla: uf,
            categoriaDocumento: categoriaDocumento,
        };
        onSearch(searchParams);
    };

    return (
        <form onSubmit={handleSubmit} className="search-form">
            <div>
                <label>Modalidade:</label>
                <select
                    value={codigoModalidade}
                    onChange={(e) => setCodigoModalidade(e.target.value)}
                    required
                    disabled={isLoading}
                >
                    <option value="">Selecione</option>
                    <option value="4|5">Concorrência</option>
                    <option value="12">Credenciamento</option>
                    <option value="8">Dispensa</option>
                    <option value="9">Inexigiblidade</option>
                    <option value="1|13">Leilão</option>
                    <option value="10">Manifestação de Interesse</option>
                    <option value="6|7">Pregão</option>
                </select>
            </div>
 

            <div>
                <label>UF:</label>
                <select
                    value={uf}
                    onChange={(e) => setUf(e.target.value)}
                    required
                    disabled={isLoading}
                >
                    <option value="">Selecione</option>
                    <option value="AC">AC</option>
                    <option value="AL">AL</option>
                    <option value="AP">AP</option>
                    <option value="AM">AM</option>
                    <option value="BA">BA</option>
                    <option value="CE">CE</option>
                    <option value="DF">DF</option>
                    <option value="ES">ES</option>
                    <option value="GO">GO</option>
                    <option value="MA">MA</option>
                    <option value="MT">MT</option>
                    <option value="MS">MS</option>
                    <option value="MG">MG</option>
                    <option value="PA">PA</option>
                    <option value="PB">PB</option>
                    <option value="PR">PR</option>
                    <option value="PE">PE</option>
                    <option value="PI">PI</option>
                    <option value="RJ">RJ</option>
                    <option value="RN">RN</option>
                    <option value="RS">RS</option>
                    <option value="RO">RO</option>
                    <option value="RR">RR</option>
                    <option value="SC">SC</option>
                    <option value="SP">SP</option>
                    <option value="SE">SE</option>
                    <option value="TO">TO</option>
                </select>
            </div>

            <button type="submit" disabled={isLoading}>
                {isLoading ? 'Consultando...' : 'Consultar'}
            </button>
        </form>
    );
};

export default RequestForm;