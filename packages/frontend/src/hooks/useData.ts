import { DependencyList, useEffect, useState } from 'react'
import { fetchData, FetchDataOptions, ResponseData } from 'api/api'

export const useData = (
  options: FetchDataOptions,
  deps: DependencyList = [],
): [ResponseData[] | null, number, boolean, any] => {
  const [data, setData] = useState<ResponseData[] | null>(null)
  const [fetching, setFetching] = useState(false)
  const [error, setError] = useState(null)
  const [rowsCount, setRowsCount] = useState(0)
  useEffect(() => {
    setFetching(true)
    fetchData(options)
      .then(res => {
        setData(res.data)
        setRowsCount(Math.ceil(+res.headers['total-count'] / options.limit))
      })
      .catch(setError)
      .finally(() => setFetching(false))
  }, [...deps])
  return [data, rowsCount, fetching, error]
}
