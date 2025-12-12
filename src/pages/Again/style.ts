import { Input } from 'antd';
import styled from 'styled-components';
import { BLACK } from 'styles/colors';

export const ResultInputContainer = styled.div`
  margin-top: 30px;
  display: flex;
  column-gap: 30px;
  align-items: center;
  justify-items: center;
  @media only screen and (max-width: 769px) {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    row-gap: 30px;
  }
`;

export const ResultInputBox = styled(Input)`
  witdh: 10vw;
  font-size: 5vw;
  border-color: ${BLACK};
  text-align: center;
  @media only screen and (max-width: 768px) {
    width: 18vw;
    height: 18vw;
    font-size: 8vw;
  }
`;

export const BonusNumBox = styled(Input)`
  display: flex;
  width: 100%;
`;

export const CustomInput = styled(Input)`
  width: 120px;
  margin-left: 15px;
  @media only screen and (max-width: 768px) {
    width: 45px;
    font-size: 10px;
  }
`;

export const Label = styled.h3`
  margin-bottom: 0px;
  min-width: 70px;
  max-width: 100px;
  @media only screen and (max-width: 768px) {
    min-width: 50px;
    max-width: 70px;
    font-size: 12px;
  }
`;

export const UploadContainer = styled.div`
  width: 50%;
  @media only screen and (max-width: 768px) {
    width: 100%;
  }
`;
