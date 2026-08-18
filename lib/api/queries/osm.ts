import { queryOptions } from '@tanstack/react-query'

import { services } from '../services'

const getOSMByAddress = (address: string) =>
  queryOptions({
    queryKey: ['osm-by-address', address],
    queryFn: async () => {
      const res = await services.osm.searchByAddress(address)
      return res.data
    },
  })

export const osmQueries = {
  byAddress: getOSMByAddress,
} as const
