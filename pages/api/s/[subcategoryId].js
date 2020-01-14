import createFacets from '../../../components/mocks/createFacets'
import createSortOptions from '../../../components/mocks/createSortOptions'
import createProduct from '../../../components/mocks/createProduct'
import colors, { indexForColor } from '../../../components/mocks/colors'
import fulfillAPIRequest from 'react-storefront/props/fulfillAPIRequest'
import createAppData from '../../../components/mocks/createAppData'

export default async function getSubcategory(req, res) {
  let {
    query: { q, subcategoryId = '1', page = 0, filters, sort, more = false },
  } = req

  res.setHeader('cache-control', 'no-cache, no-store, max-age: 0')

  if (filters) {
    filters = JSON.parse(filters)
  } else {
    filters = []
  }

  res.json(
    await fulfillAPIRequest(req, {
      appData: createAppData,
      pageData: () =>
        Promise.resolve({
          id: subcategoryId,
          name: q != null ? `Results for "${q}"` : `Subcategory ${subcategoryId}`,
          title: q != null ? `Results for "${q}"` : `Subcategory ${subcategoryId}`,
          total: 100,
          page: parseInt(page),
          totalPages: 5,
          filters,
          sort,
          sortOptions: createSortOptions(),
          facets: createFacets(),
          products: filterProducts(page, filters, more),
        }),
    }),
  )
}

function filterProducts(page, filters, more) {
  const products = []
  const filteredColors = filters
    ? filters.filter(f => f.startsWith('color')).map(f => f.replace(/^color:/, ''))
    : []
  const count = more ? 20 : 10

  while (products.length < count) {
    if (filteredColors && filteredColors.length) {
      for (let color of filteredColors) {
        const index = indexForColor(color)

        const colorGap = i => Math.floor((page * count) / filteredColors.length) + i

        products.push(
          ...Array.from({ length: count }, (v, i) => colorGap(i)).map(i =>
            createProduct('' + (i * Object.keys(colors).length + index)),
          ),
        )
      }
    } else {
      const id = page * 10 + products.length + 1
      products.push(createProduct(id + ''))
    }
  }

  return products.sort((a, b) => a.id - b.id).slice(0, count)
}
