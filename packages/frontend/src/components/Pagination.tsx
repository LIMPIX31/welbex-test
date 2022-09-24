import { FC, useCallback, useMemo } from 'react'
import styled from 'styled-components'
import { theme } from 'style'

export interface PaginationProps {
  pages: number
  selected: number
  onChange?: (value: number) => void
}

const PageButton = styled.button.attrs<{
  hidden?: boolean
  disabled?: boolean
}>(({ hidden, disabled }) => ({
  disabled: hidden || disabled,
}))<{ hidden?: boolean; active?: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  border-radius: 6px;
  border: 2px solid ${theme.primary};
  opacity: ${({ hidden }) => (hidden ? 0 : 1)};
  cursor: pointer;
  background-color: ${({ active }) => (active ? theme.primary : theme.back)};
  color: ${({ active }) => (!active ? theme.primary : theme.back)};
  user-select: none;

  &[disabled] {
    color: gray !important;
    border-color: gray;
    cursor: not-allowed;
  }
`

const StyledPagination = styled.div`
  display: flex;
  gap: 12px;
  color: ${theme.primary};
  font-weight: 900;
`

export const Pagination: FC<PaginationProps> = ({
  selected,
  pages,
  onChange,
}) => {
  const mode = useMemo(() => {
    if (selected <= 2 || pages < 5) return 'block_start' as const
    if (selected >= pages - 2) return 'block_end' as const
    return 'normal' as const
  }, [pages, selected])

  const shift = useCallback(
    (absolute: number, relative: number) => {
      switch (mode) {
        case 'block_start':
          return relative
        case 'block_end':
          return pages + relative - 5
        default:
          return absolute + relative - 2
      }
    },
    [mode],
  )

  return (
    <StyledPagination>
      <PageButton
        onClick={() => onChange?.(selected - 1)}
        disabled={selected === 0}
      >
        {'<'}
      </PageButton>
      {new Array(5).fill(null).map(
        (v, i) =>
          shift(selected, i) < pages && (
            <PageButton
              key={i}
              active={selected === shift(selected, i)}
              onClick={() => onChange?.(shift(selected, i))}
            >
              {shift(selected, i) + 1}
            </PageButton>
          ),
      )}
      <PageButton
        onClick={() => onChange?.(selected + 1)}
        disabled={selected === pages - 1}
      >
        {'>'}
      </PageButton>
    </StyledPagination>
  )
}
