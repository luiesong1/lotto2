import styled from 'styled-components';

export const Wrap = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 30px;
`;

export const Label = styled.h3`
  margin: 0;
  width: 100px;
`;

export const ImageWrap = styled.div`
  margin-right: 30px;
  @media only screen and (max-width: 768px) {
    margin-right: 0;
    margin-bottom: 20px;
  }
`;
