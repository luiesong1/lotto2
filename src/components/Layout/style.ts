import styled from 'styled-components';
import { Layout as AntdLayout } from 'antd';
import { PRIMARY } from 'styles/colors';

const {
  Sider: AntdSider,
  Content: AntdContent,
  Footer: AntdFooter,
} = AntdLayout;

export const Container = styled.div`
  height: 100vh;
`;

type LayoutProps = {
  $marginLeft?: number;
};
export const Layout = styled(AntdLayout)<LayoutProps>`
  margin-left: ${(props) => (props.$marginLeft ? props.$marginLeft : 0)}px;
  min-height: 100vh;
  @media only screen and (max-width: 740px) {
    margin-left: 0px;
  }
`;

export const Sider = styled(AntdSider)`
  overflow: auto;
  height: 100vh;
  position: fixed;
  left: 0;
`;

export const Content = styled(AntdContent)`
  margin: 0px 16px 0px;
  overflow: initial;
`;

export const Footer = styled(AntdFooter)`
  text-align: center;
`;

export const StatusBar = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 100px;
  background-color: white;
  box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.1);
  margin-top: 30px;
  @media only screen and (max-width: 768px) {
    height: auto;
    box-shadow: none;
    background: transparent;
    margin-top: 70px;
    z-index: 0;
    position: relative;
  }
`;

export const StatusWrap = styled.div`
  margin-left: 30px;
  @media only screen and (max-width: 768px) {
    margin: 0;
    margin-right: 15px;
  }
`;
