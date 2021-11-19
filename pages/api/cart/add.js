import { addToCart } from 'react-storefront-connector'
const Analytics = require('analytics-node');

async function handler(req, res) {
  const result = await addToCart(req.body, req, res)
  res.json(result)
  const client = new Analytics('tSfno7s7sNzgotdYGpWwCKAd4OEKzbJT');
  client.track({
    event: 'Item Added',
    userId: '5235623',
    traits: {
      name: 'Rachel Adams',
      email: 'radams@example.com',
      details: result
    }
  });
}

export const config = {
  api: {
    bodyParser: true,
  },
}

export default handler
