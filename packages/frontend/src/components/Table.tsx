import styled from 'styled-components'
import { theme } from 'style'
import { mix, rgba } from 'polished'
import { Pagination } from 'components/Pagination'
import { FetchDataOptions } from 'api'
import { mapFactory } from 'utils'
import {
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { Select } from 'components/Select'
import { Input } from 'components/Input'

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
  /**
   * Column values type
   */
  type: 'string' | 'number'
  /**
   * Adds sorting capability to a column
   */
  sortable?: boolean
  /**
   * Adds filtering capability to a column
   */
  filterable?: boolean
}

export interface TableData<T> {
  /**
   * Contains table column definitions
   */
  columns: ColumnDef[]
  /**
   * Table rows. A row has a record type, where the keys are the column identifiers
   */
  rows: T[]
}

export interface TableProps<T> {
  /**
   * Table is fetching status
   */
  isFetching?: boolean
  /**
   * Total number of table rows
   */
  totalRows: number
  /**
   * Represents the data of the visible table
   */
  data: TableData<T>
  /**
   * Converts primitive values to display values
   */
  displayMapping: {
    [K in keyof T]: (value: T[K]) => Primitive
  }
  /**
   * Table pagination and sorting options
   */
  options: FetchDataOptions

  onOptionsChange: (
    options: FetchDataOptions,
  ) => void | SetStateAction<FetchDataOptions>
}

const UpIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
    <path d="M201.4 137.4c12.5-12.5 32.8-12.5 45.3 0l160 160c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L224 205.3 86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l160-160z" />
  </svg>
)

const DownIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
    <path d="M201.4 374.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 306.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z" />
  </svg>
)

const StyledTable = styled.table`
  position: relative;
  font-size: 1.2rem;
  box-shadow: 0 0 200px 1px ${rgba(theme.primary, 0.2)},
    0 0 0 2px ${theme.primary};
  border-radius: 6px;
  table-layout: fixed;

  th,
  td {
    overflow-wrap: anywhere;
    color: ${theme.front};
    padding: 10px 50px;
    width: 250px;
  }

  th {
    font-weight: bold;
    color: ${theme.primary};
    height: 50px;
    cursor: pointer;
    transition: all 0.3s;
    position: relative;

    &:hover {
      background-color: ${mix(0.1, theme.primary, theme.back)};
    }

    svg {
      position: absolute;
      right: 0;
      top: 55%;
      translate: -50% -50%;
      height: 50%;

      path {
        fill: ${theme.primary};
      }
    }
  }

  th section {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
  }

  thead tr {
    position: relative;

    * {
      user-select: none;
    }

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

  tr {
    &:nth-child(2n) {
      background-color: ${mix(0.05, theme.front, theme.back)};
    }
  }
`

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const Filters = styled.div`
  display: flex;
  gap: 12px;
`

const LoadingOverlay = styled.div<{ active?: boolean }>`
  position: absolute;
  top: 50%;
  left: 50%;
  translate: -50% -50%;
  width: 101%;
  height: 101%;
  backdrop-filter: blur(25px);
  opacity: ${({ active }) => (active ? 1 : 0)};
  transition: all 0.3s;
  z-index: 10;
  pointer-events: none;
  border-radius: 16px;
  font-size: 2rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${theme.front};
`

export const Table = <T extends object>({
  data: { rows = [], columns },
  className,
  displayMapping,
  options,
  onOptionsChange,
  totalRows,
  isFetching,
}: TableProps<T> & { className?: string }) => {
  const [sorting, setSorting] = useState<[string, boolean] | undefined>()

  /**
   * reset page on filter or sorting options
   */
  useEffect(() => {
    onOptionsChange({ ...options, page: 0 })
  }, [sorting, options.filter_value, options.filter, options.filter_type])

  /**
   * Update sorting options
   */
  useEffect(() => {
    onOptionsChange({
      ...options,
      sort: sorting?.[0],
      sort_order: sorting?.[1] ? 'descending' : 'ascending',
    })
  }, [sorting])

  /**
   * Sets the column for sorting if it has not been set or changes the sorting direction
   */
  const setSortingColumn = useCallback((column: ColumnDef) => {
    column.sortable &&
      setSorting(sorting => [
        column.id,
        sorting?.[0] === column.id ? !sorting?.[1] : false,
      ])
  }, [])

  /**
   * Returns one of the icons depending on the sorting direction, if no sorting is specified, it returns null
   */
  const sortingIcon = useCallback(
    (column: ColumnDef) => {
      return sorting?.[0] === column.id ? (
        sorting?.[1] ? (
          <UpIcon />
        ) : (
          <DownIcon />
        )
      ) : null
    },
    [sorting],
  )

  /**
   * Transforms table row data into jsx `<td>` tags
   */
  const rowDataToTableData = useCallback(
    (row: T) => {
      const mapped = mapFactory(row, displayMapping)
      return columns.map(column => (
        <td key={column.id}>{mapped[column.id as keyof T]}</td>
      ))
    },
    [displayMapping, columns],
  )

  /**
   * Transforms rows to jsx table `<tr>` tags
   */
  const tableRows = useMemo(() => {
    return rows.map((row, index) => (
      <tr key={index}>{rowDataToTableData(row)}</tr>
    ))
  }, [rows])

  /**
   * Transforms columns to jsx table `<th>` tags
   */
  const tableColumns = useMemo(() => {
    return columns.map(column => (
      <th key={column.id} onClick={() => setSortingColumn(column)}>
        <section>
          <span>{column.title}</span> {sortingIcon(column)}
        </section>
      </th>
    ))
  }, [columns, setSortingColumn, sortingIcon])

  const filterColumnSelectOptions = useMemo(() => {
    return columns.map(
      column =>
        column.filterable && (
          <option value={column.id} key={column.id}>
            {column.title}
          </option>
        ),
    )
  }, [columns])

  const updateFilterTargetColumn = useCallback(
    (value: string) => {
      onOptionsChange({ ...options, filter: value })
    },
    [options],
  )

  const updateFilterType = useCallback(
    (type: string) => {
      onOptionsChange({
        ...options,
        filter: options.filter ?? columns?.[0].id,
        filter_type: type as never,
      })
    },
    [options],
  )

  const filterValueInputType = useMemo(() => {
    return options.filter_type === 'equals' ||
      options.filter_type === 'contains'
      ? 'text'
      : 'number'
  }, [options])

  const updateFilterValue = useCallback(
    (value: string | number) => {
      onOptionsChange({
        ...options,
        filter: options.filter,
        filter_type: options.filter_type,
        filter_value:
          value !== 0
            ? typeof value === 'string'
              ? value.toLowerCase()
              : value
            : undefined,
      })
    },
    [options],
  )

  const filterTypeOptions = useMemo(() => {
    const allowNumeric =
      columns.find(v => v.id === options.filter)?.type === 'number'
    return (
      <>
        <option value={undefined}>Не выбрано</option>
        <option value={'equals'}>Равно</option>
        {allowNumeric && <option value={'more_than'}>Больше чем</option>}
        {allowNumeric && <option value={'less_than'}>Меньше чем</option>}
        <option value={'contains'}>Содержит</option>
      </>
    )
  }, [options, columns])

  return (
    <Container>
      <Filters>
        <Select onChange={e => updateFilterTargetColumn(e.target.value)}>
          <option value={undefined}>Не выбрано</option>
          {filterColumnSelectOptions}
        </Select>
        <Select
          value={options.filter_type}
          onChange={e => updateFilterType(e.target.value)}
        >
          {filterTypeOptions}
        </Select>
        <Input
          placeholder={'Введите значение'}
          type={filterValueInputType}
          onChange={e => updateFilterValue(e.target.value)}
        />
      </Filters>
      <StyledTable className={className}>
        <LoadingOverlay active={isFetching}>Loading...</LoadingOverlay>
        <thead>
          <tr>{tableColumns}</tr>
        </thead>
        <tbody>{tableRows}</tbody>
      </StyledTable>
      <Pagination
        pages={totalRows}
        selected={options.page}
        onChange={value => onOptionsChange({ ...options, page: value })}
      />
    </Container>
  )
}
