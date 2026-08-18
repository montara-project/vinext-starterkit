import { AxiosRequestConfig } from 'axios'
import qs from 'qs'

import { env } from '@/config/env'

import { ClientFetchApi } from '../client-fetch'

const api = new ClientFetchApi({ baseURL: env.NEXT_PUBLIC_OSM_API_URL }).default

const reqConfig: AxiosRequestConfig = {
  headers: {
    'Content-Type': 'application/json',
    'User-Agent': `Mozilla/5.0 (Windows NT 11.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.6998.166 Safari/537.36`, // required to access the API
  },
}

type OSMResources = {
  searchByAddress: (address: string) => Promise<any>
}

const osmResources = (): OSMResources => {
  return {
    searchByAddress: (address: string) => {
      const queryParams = qs.stringify({ q: address, format: 'json', limit: 10 })
      return api.get(`/search?${queryParams}`, reqConfig)
    },
  }
}

export const osmServices = osmResources()
