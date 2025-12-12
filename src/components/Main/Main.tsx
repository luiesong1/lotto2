import { Outlet } from 'react-router-dom';

import * as S from './style';

function Main(): JSX.Element {
  return (
    <S.Container>
      <Outlet />
    </S.Container>
  );
}

export default Main;
