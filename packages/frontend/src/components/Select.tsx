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
  -webkit-appearance: none;
  -moz-appearance: none;
  background: transparent;
  background-image: url("data:image/svg+xml;utf8,<svg fill='white' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/><path d='M0 0h24v24H0z' fill='none'/></svg>");
  background-repeat: no-repeat;
  background-position-x: 100%;
  background-position-y: 5px;
  position: relative;
  option {
    color: black;
  }
`
