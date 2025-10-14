const { tool } = require('@langchain/core/tools');
const { z } = require('zod');
const axios = require('axios');

const searchProduct = tool(async ({query,token}) => {

    const response = await axios.get(`http://localhost:3001/api/products?q={data.query}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    return JSON.stringify(response.data);
    
}, {
    name: 'searchProduct',
    description: 'Search for products in the store based on a query. The input should be a search query string.',
    inputSchema: z.object({
        query: z.string().describe('The search query for products' )
    })
})


const addProductToCart = tool(async ({ productId, qty = 1, token }) => {
    
    const response = await axios.post(`http://localhost:3002/api/cart`, {
        productId,
        qty
    }, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    return JSON.stringify(response.data);
}, { 
    name: 'addProductToCart',
    description: 'Add a product to the shopping cart',
    inputSchema: z.object({
        productId: z.string().describe('The ID of the product to add to the cart'),
        qty:z.number().describe('The quantity of the product to add to the cart').default(1),
    })
})


module.exports = { searchProduct, addProductToCart };