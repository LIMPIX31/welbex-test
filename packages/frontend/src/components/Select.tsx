import styled from 'styled-components'
import { theme } from 'style'

export const Select = styled.select`
  height: 36px;
  border: 2px solid ${theme.primary};
  border-radius: 6px;
  color: ${theme.front};
  font-weight: bold;
  padding: 0 20px;
  cursor: pointer;
  option {
    color: black;
  }
`
