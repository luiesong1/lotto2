import styled from 'styled-components';
import { Layout as AntdLayout } from 'antd';
import { PRIMARY } from 'styles/colors';

const {
  Sider: AntdSider,
  Content: AntdContent,
  Footer: AntdFooter,
} = AntdLayout;

export const Container = styled.section`
  height: 100vh;
`;

export const ImageWrap = styled.div`
  width: 100%;
  margin: 0.75em auto;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  @media only screen and (max-width: 768px) {
    margin: 0;
    margin-left: 20px;
    justify-content: flex-start;
    align-items: flex-start;
    width: auto;
  }
`;

export const Image = styled.img`
  width: 40%;
  height: 40%;
  /* object-fit: cover; */
`;

type LayoutProps = {
  $marginLeft?: number;
};
export const Layout = styled(AntdLayout)<LayoutProps>`
  margin-left: ${(props) => (props.$marginLeft ? props.$marginLeft : 0)}px;
  min-height: 100vh;
`;

export const Sider = styled(AntdSider)`
  overflow: auto;
  height: 100vh;
  position: fixed;
`;

export const Content = styled(AntdContent)`
  margin: 24px 16px 0px;
  overflow: initial;
`;

export const Footer = styled(AntdFooter)`
  text-align: center;
`;

type NavProps = {
  isOpen?: boolean;
};

export const NavTop = styled.div<NavProps>`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  button {
    background: transparent;
    border: none;
  }
  position: fixed;
  top: 0;
  z-index: 1000;
  height: 50px;
  /* background: ${(props) => (props.isOpen ? '#fff' : 'transparent')}; */
  background: #fff;
`;

export const Mask = styled.div`
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background-color: #000;
  opacity: 0.5;
  z-index: 1;
`;
