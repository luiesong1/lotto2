import styled from 'styled-components';
import { PRIMARY } from 'styles/colors';

export const ModalTitle = styled.h2`
  color: ${PRIMARY};
  text-align: center;
`;

export const OtpWrap = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const OtpInput = styled.input`
  border: 1px solid ${PRIMARY};
  width: 15%;
  height: 100px;
  border-radius: 100%;
  margin: 20px 0;
  font-size: 46px;
  text-align: center;
  padding: 10px;
  &:focus-visible {
    outline: none;
    padding: 0px;
    margin: 0px;
  }
  @media only screen and (max-width: 768px) {
    width: 12vw;
    height: 12vw;
    font-size: 5vw;
  }
`;
