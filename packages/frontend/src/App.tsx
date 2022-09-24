import { FC, useState } from 'react'
import styled from 'styled-components'
import { Table } from 'components/Table'
import { useData } from 'hooks/useData'
import { ResponseData } from 'api'

const Page = styled.div`
  display: flex;
  height: 100vh;
  align-items: center;
  justify-content: center;
`

export const App: FC = () => {
  const [options, setOptions] = useState({ page: 0, limit: 10 })
  const [data, length, isFetching] = useData(options, [options])

  return (
    <Page>
      <Table<ResponseData>
        totalRows={length}
        data={{
          columns: [
            {
              id: 'name',
              title: 'Имя',
              type: 'string',
              sortable: true,
              filterable: true,
            },
            { id: 'date', title: 'Дата', type: 'number' },
            {
              id: 'quantity',
              title: 'Количество',
              sortable: true,
              filterable: true,
              type: 'number',
            },
            {
              id: 'distance',
              title: 'Расстояние',
              sortable: true,
              filterable: true,
              type: 'number',
            },
          ],
          rows: data ?? [],
        }}
        displayMapping={{
          name: name => name[0].toUpperCase() + name.substring(1),
          distance: dst => (dst / 1000).toFixed(2) + ' km',
          quantity: q => q,
          date: date => new Date(date).toLocaleDateString(),
        }}
        options={options}
        onOptionsChange={setOptions}
        isFetching={isFetching}
      />
    </Page>
  )
}
