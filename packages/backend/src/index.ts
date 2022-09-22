import express from 'express'
import _data from './db.json'
const app = express()

type DataType = Array<Record<string, string | number | boolean>>

type QueryParams = Partial<{
  page: string
  limit: string
  sort: string
  sort_order: '+' | '-'
  filter: string
  filter_type: 'equals' | 'more_than' | 'less_than' | 'contains'
  filter_value: string
}>

app.get('/', (req, res) => {
  let data = _data as DataType
  const { page, limit, sort, sort_order, filter, filter_type, filter_value } =
    req.query as QueryParams
  if (!page || !limit)
    return res.send({
      error: 'Missing pagination query parameters',
    })
  if (sort && sort_order)
    data.sort((a, b) =>
      sort_order === '-' ? +a[sort] - +b[sort] : +b[sort] - +a[sort],
    )
  if (filter && filter_type && filter_value)
    data = data.filter(v => {
      const value = v[filter]
      switch (filter_type) {
        case 'equals':
          return String(value) === String(filter_value)
        case 'contains':
          return String(value).includes(filter_value)
        case 'less_than':
          return +value < +filter_value
        case 'more_than':
          return +value > +filter_value
      }
    })
  res
    .header('Content-Length', String(data.length))
    .send(data.slice(+page * +limit, +limit))
})

app.listen(3264, '0.0.0.0', () => console.log('Server listening at 3264'))

process.on('SIGINT', () => {
  console.log('Stopping server')
  process.exit()
})
