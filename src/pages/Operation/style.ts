import styled from 'styled-components';

export const SmallTableContainer = styled.div`
  width: 30%;
  margin-bottom: 30px;
  @media only screen and (max-width: 768px) {
    width: 100%;
  }
`;

export const Label = styled.h3`
  margin: 0px;
  margin-right: 10px
  width: 70px;
  @media only screen and (max-width: 768px) {
    width: 50px;
    font-size: 12px;
  }
`;

export const PrizeContainer = styled.div`
  width: 50%;
  @media only screen and (max-width: 768px) {
    width: 100%;
  }
`;
