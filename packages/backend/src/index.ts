import express from 'express'
import cors from 'cors'
import _data from './db.json'
const app = express()

type DataType = Array<Record<string, string | number | boolean>>

type QueryParams = Partial<{
  page: string
  limit: string
  sort: string
  sort_order: 'ascending' | 'descending'
  filter: string
  filter_type: 'equals' | 'more_than' | 'less_than' | 'contains'
  filter_value: string
}>

app.use(
  cors({
    exposedHeaders: 'Total-Count',
  }),
)

app.get('/', (req, res) => {
  let data = [..._data] as DataType
  const { page, limit, sort, sort_order, filter, filter_type, filter_value } =
    req.query as QueryParams
  if (!page || !limit)
    return res.send({
      error: 'Missing pagination query parameters',
    })
  if (sort && sort_order)
    data.sort((a, b) => {
      const avalue: string | boolean | number = a[sort]
      const bvalue = b[sort]
      if (typeof avalue === 'string' && typeof bvalue === 'string')
        return sort_order === 'ascending'
          ? avalue.localeCompare(String(bvalue))
          : bvalue.localeCompare(String(avalue))
      else
        return sort_order === 'ascending'
          ? +avalue - +bvalue
          : +bvalue - +avalue
    })
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
    .header('Total-Count', String(data.length))
    .send(data.slice(+page * +limit, +page * +limit + +limit))
})

const PORT = process.env.NODE_ENV === 'production' ? 80 : 3264

app.listen(PORT, '0.0.0.0', () => console.log('Server listening at ' + PORT))

process.on('SIGINT', () => {
  console.log('Stopping server')
  process.exit()
})
