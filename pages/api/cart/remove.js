import { removeCartItem } from 'react-storefront-connector'
const Analytics = require('analytics-node');

export default async function handler(req, res) {
  const { item } = req.body || {}
  res.json(await removeCartItem(item, req, res))
  const client = new Analytics('tSfno7s7sNzgotdYGpWwCKAd4OEKzbJT');
  client.track({
    event: 'Item Removed',
    userId: '5235623',
    traits: {
      name: 'Rachel Adams',
      email: 'radams@example.com',
      plan: '42',
      friends: 42
    }
  });
}

export const config = {
  api: {
    bodyParser: true,
  },
}
