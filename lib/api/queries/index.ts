import { accountQueries } from './account'
import { categoryQueries } from './category'
import { osmQueries } from './osm'

export const queries = {
  account: accountQueries,
  categories: categoryQueries,
  osm: osmQueries,
} as const
