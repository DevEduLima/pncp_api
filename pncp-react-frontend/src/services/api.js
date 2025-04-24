import axios from 'axios';

const BASE_URL = 'http://localhost:3001/api/v1';


/**
 * PNCP API Client for consultation services
 */
const pncpApi = {
 
  
  /**
   * Consult contracts with open proposal period
   * @param {Object} params - Request parameters (data_final, codigo_modalidade, uf, cnpj_orgao, pagina, tamanho_pagina)
   * @returns {Promise<Object>} API response
   */
  async getOpenProposalContracts(params) {
    try {
        const url = `${BASE_URL}/contratacoes/proposta`;
        console.log("Sending request to:", url);
        
      const response = await axios.get(`${BASE_URL}/contratacoes/proposta`, {
        params: params,
        headers: {
          Accept: '*/*',
        },
      });
      console.log("Response data received in api.js:", response.data);
      return response.data;
   
    } catch (error) {
      console.error("API Error in getOpenProposalContracts:", error.response?.data || error.message);
      throw error;
    }
  },

 
 
};

export default pncpApi;