import axios from 'axios'

console.log(import.meta.env)

export const instance = axios.create({
  baseURL: import.meta.env.PROD
    ? 'https://welbex-test.onrender.com'
    : 'http://localhost:3264',
})

export interface ResponseData {
  name: string
  date: number
  quantity: number
  distance: number
}

export interface FetchDataOptions {
  page: number
  limit: number
  sort?: string
  sort_order?: 'ascending' | 'descending'
  filter?: string
  filter_type?: 'equals' | 'more_than' | 'less_than' | 'contains'
  filter_value?: Primitive
}

export const fetchData = async (params: FetchDataOptions) =>
  instance.get<ResponseData[]>('/', {
    params,
    headers: {
      'Cache-Control': 'no-cache',
      Expires: '0',
      Pragma: 'no-cache',
    },
  })
