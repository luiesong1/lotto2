import { Input } from 'antd';
import styled from 'styled-components';
import { PRIMARY } from 'styles/colors';

export const Container = styled.main`
  min-height: 100vh;
  width: 100%;
  max-height: 100vh;
  background: ${PRIMARY};
  display: flex;
  justify-content: center;
  @media only screen and (max-width: 768px) {
    background: #fff;
    padding: 20px;
  }
`;

export const Wrapper = styled.section`
  display: flex;
  justify-content: center;
  align-items: center;

  @media only screen and (max-width: 768px) {
  }
`;

export const Button = styled.button`
  width: 100%;
  background-color: ${PRIMARY};
  border: 0;
  height: 2rem;
  cursor: pointer;
  color: #fff;
  font-weight: bold;
  @media only screen and (max-width: 768px) {
    border: 0;
  }
`;

export const ImageWrap = styled.div`
  width: 100%;
  margin-bottom: 2em;
  text-align: center;
`;

export const Image = styled.img`
  width: 60%;
  height: 60%;
  object-fit: contain;
  @media only screen and (max-width: 768px) {
    width: 70%;
    height: 70%;
  }
`;

export const CustomInput = styled(Input)`
  @media only screen and (max-width: 768px) {
    width: 50%;
    height: 50%;
  }
`;

export const FormWrap = styled.div`
  background: #fff;
  padding: 20px;
  border-radius: 10px;
`;
