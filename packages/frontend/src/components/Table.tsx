import { FC } from 'react'
import styled from 'styled-components'
import { theme } from 'style'
import { mix, rgba } from 'polished'

/**
 * ###Column Definition
 * Assigns identifier and column name
 */
export interface ColumnDef {
  /**
   * Column identifier. The identifier that will be used for the data
   */
  id: string
  /**
   * Display value of the column
   */
  title: string
}

export type TableRow = Record<string, Primitive>

export interface TableData {
  /**
   * Contains table column definitions
   */
  columns: ColumnDef[]
  /**
   * Table rows. A row has a record type, where the keys are the column identifiers
   */
  data: TableRow[]
}

/**
 * Represents the data of the visible table
 */
export interface TableProps {
  data: TableData
}

const StyledTable = styled.table`
  font-size: 1.2rem;
  box-shadow: 0 0 100px 1px ${rgba(theme.primary, 0.5)}, 0 0 0 2px ${theme.primary};
  border-radius: 6px;

  th,
  td {
    color: ${theme.front};
    padding: 10px 20px;
  }

  th {
    font-weight: bold;
    color: ${theme.primary};
  }

  tr {
    &:first-child {
      position: relative;
      &:after {
        position: absolute;
        left: 50%;
        translate: -50%;
        bottom: 0;
        display: block;
        content: '';
        width: 80%;
        height: 1px;
        background-color: ${theme.primary};
        mask: linear-gradient(90deg, transparent, white, transparent);
      }
    }
    &:nth-child(2n) {
      background-color: ${mix(0.05, theme.front, theme.back)};
    }
  }
`

export const Table: FC<TableProps> = ({ data: { data, columns } }) => {
  return (
    <StyledTable>
      <tr>
        {columns.map(column => (
          <th key={column.id}>{column.title}</th>
        ))}
      </tr>
      {data.map((row, index) => (
        <tr key={index}>
          {columns.map(column => (
            <td key={column.id}>{row[column.id]}</td>
          ))}
        </tr>
      ))}
    </StyledTable>
  )
}
