import { Input } from 'antd';
import styled from 'styled-components';

export const CustomInput = styled(Input)`
  width: 200px;
  border: none;
  @media only screen and (max-width: 768px) {
    width: 35vw;
  }
`;

export const Label = styled.h3`
  margin-bottom: 0px;
  width: 70px;
  @media only screen and (max-width: 768px) {
    width: 70px;
    font-size: 14px;
  }
`;

export const FormWrap = styled.div`
  border: 1px solid #ddd;
  padding: 5px;
  width: 420px;
  @media only screen and (max-width: 768px) {
    width: 100%;
  }
`;
