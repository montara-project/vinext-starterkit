import { AxiosResponse } from 'axios'

export enum HTTP_METHOD {
  GET,
  POST,
  PUT,
  PATCH,
  DELETE,
}

export type API_METHOD_MAP = {
  [HTTP_METHOD.GET]: 'list' | 'get'
  [HTTP_METHOD.POST]: 'store'
  [HTTP_METHOD.PUT]: 'edit'
  [HTTP_METHOD.PATCH]: 'update'
  [HTTP_METHOD.DELETE]: 'delete'
}

export type Metadata = {
  total?: number
  message?: string
  page?: number
  per_page?: number
  from?: number
  to?: number
  [key: string]: number | string | undefined
}

// For Multiple Response
export type ApiListResponse<TData, TMeta extends Metadata = Metadata> = {
  data: TData[]
  meta: TMeta
}

// For Single Response
export type ApiItemResponse<TData, TMeta extends Metadata = Metadata> = {
  data: TData
  meta: TMeta
  message?: string
}

// For Delete Response
export type ApiDeleteResponse<TMeta extends Metadata = Metadata> = {
  message?: TMeta['message']
}

export type AxiosListResponse<TData> = AxiosResponse<ApiListResponse<TData>>
export type AxiosItemResponse<TData> = AxiosResponse<ApiItemResponse<TData>>
export type AxiosDeleteResponse = AxiosResponse<ApiDeleteResponse>

export type ResourceMethods<TData> = {
  list: (params?: Record<string, unknown>) => Promise<AxiosListResponse<TData>>
  get: (id: string | number) => Promise<AxiosItemResponse<TData>>
  store: (data?: Record<string, unknown>) => Promise<AxiosItemResponse<TData>>
  edit: (id: string | number, data?: Record<string, unknown>) => Promise<AxiosItemResponse<TData>>
  update: (id: string | number, data?: Record<string, unknown>) => Promise<AxiosItemResponse<TData>>
  delete: (id: string | number) => Promise<AxiosDeleteResponse>
}

export type Resources<TMethods extends readonly HTTP_METHOD[], TData> = Pick<
  ResourceMethods<TData>,
  API_METHOD_MAP[TMethods[number]]
>

export interface ResourceProps {
  method: HTTP_METHOD
  url: string
  data?: Record<string, unknown>
  headers?: Record<string, string>
}
