import { Spin } from 'antd';
import React from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import styled from 'styled-components';
const Container = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 101;
  display: flex;
  justify-content: center;
  align-items: center;
`;
function Loader() {
  const antIcon = <LoadingOutlined style={{ fontSize: 45 }} spin />;
  return (
    <Container>
      <Spin indicator={antIcon} />
    </Container>
  );
}

export default Loader;
