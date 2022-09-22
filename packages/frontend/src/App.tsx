import { FC } from 'react'
import styled from 'styled-components'
import { Table } from 'components/Table'

const Page = styled.div`
  display: flex;
  height: 100vh;
  align-items: center;
  justify-content: center;
`

export const App: FC = () => {
  return (
    <Page>
      <Table
        data={{
          columns: [
            { id: 'date', title: 'Дата' },
            { id: 'name', title: 'Имя' },
          ],
          data: [
            {
              date: '2022.05.22',
              name: 'First',
            },
            {
              date: '20202.07.12',
              name: 'Second',
            },
          ],
        }}
      />
    </Page>
  )
}
