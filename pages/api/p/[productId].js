import createProduct from '../../../components/mocks/createProduct'
import createCustomCacheKey from 'moov-xdn/createCustomCacheKey'
import withCaching from 'moov-xdn-next/withCaching'
import fulfillAPIRequest from 'react-storefront/props/fulfillAPIRequest'
import createAppData from '../../../components/mocks/createAppData'

async function getPageData(productId) {
  return Promise.resolve({
    title: `Product ${productId}`,
    product: createProduct(productId),
  })
}

async function fetchProduct(req, res) {
  const {
    query: { productId, color },
  } = req

  // When a query parameter exists, we can fetch custom product data
  // pertaining to specific filters.
  if (color) {
    const data = await getPageData(productId)
    data.carousel = { index: 0 }
    return res.json(data)
  }

  res.json(
    await fulfillAPIRequest(req, {
      appData: createAppData,
      pageData: () => getPageData(productId),
    }),
  )
}

export default withCaching(fetchProduct, {
  edge: {
    maxAgeSeconds: 1000,
    key: createCustomCacheKey().addCookie('currency'),
  },
})
