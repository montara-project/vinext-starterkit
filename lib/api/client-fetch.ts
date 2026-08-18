import axios, { AxiosError, AxiosInstance } from 'axios'
import { isEmpty } from 'lodash'

import { authClient, getAccessToken } from '../auth/auth-client'
import { AUTH_STORAGE_KEYS } from '../constants/auth'
import { ms } from '../date'

const timeout = ms('5m')

interface CreateAxiosProps {
  baseURL: string
  storageKey?: string
}

/**
 * Create axios instance
 * @param params
 * @returns
 */
function createAxios({ baseURL, storageKey }: CreateAxiosProps) {
  const axiosInstance = axios.create({ baseURL, timeout })

  // Interceptor Request
  if (storageKey && !isEmpty(storageKey)) {
    axiosInstance.interceptors.request.use(async (config) => {
      const currentConfig = { ...config }

      const accessToken = await getAccessToken()

      // Check Session if exists
      if (accessToken) {
        try {
          currentConfig.headers.Authorization = `Bearer ${accessToken}`
        } catch (error) {
          console.error(error)
        }
      }

      return currentConfig
    })
  }

  // Interceptor Response
  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      if (error.code === 'ERR_NETWORK') {
        throw new Error('Network error')
      }

      if (error.response?.status === 401) {
        if (storageKey === AUTH_STORAGE_KEYS.AUTH_STORAGE) {
          const res = await authClient.signOut()
          if (res.data?.success) {
            window.location.href = '/'
          }
        }
        throw new Error('Unauthorized')
      }

      if (error.response?.status === 403) {
        throw new Error('Forbidden')
      }

      return Promise.reject(error)
    }
  )

  return axiosInstance
}

/**
 * Fetch API
 * @example
 * const fetchApi = new ClientFetchApi({ baseURL: 'https://api.example.com', storageKey: 'token' }).default
 * fetchApi.get('/users')
 */
export class ClientFetchApi {
  private _axiosInstance: AxiosInstance | null
  private readonly _baseURL: string
  private readonly _storageKey?: string

  constructor({ baseURL, storageKey }: CreateAxiosProps) {
    this._axiosInstance = null
    this._baseURL = baseURL
    this._storageKey = storageKey
  }

  public get default(): AxiosInstance {
    if (!this._axiosInstance) {
      this._axiosInstance = createAxios({
        baseURL: this._baseURL,
        storageKey: this._storageKey,
      })

      return this._axiosInstance
    }

    return this._axiosInstance
  }
}
