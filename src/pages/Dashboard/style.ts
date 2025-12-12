import styled from 'styled-components';
import { PRIMARY } from 'styles/colors';

export const ChartContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  row-gap: 30px;
  margin-bottom: 50px;
  @media only screen and (max-width: 768px) {
    grid-template-columns: repeat(1, 1fr);
    row-gap: 30px;
  }
`;

export const ChartTitle = styled.h4`
  color: ${PRIMARY};
  margin-left: 30px;
  @media only screen and (max-width: 768px) {
    margin: 0;
  }
`;

export const Head = styled.div`
  display: flex;
  justify-content: space-between;
`;
