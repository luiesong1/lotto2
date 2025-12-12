import { useEffect, useLayoutEffect, useState } from 'react';
import { Menu, notification } from 'antd';
import {
  SettingOutlined,
  NotificationOutlined,
  CustomerServiceOutlined,
  SecurityScanOutlined,
  LineChartOutlined,
  FormOutlined,
  UserOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useRecoilState } from 'recoil';

import { logo, menuLogo } from 'assets/images';
import MenuFoldOutlined from '@ant-design/icons/lib/icons/MenuFoldOutlined';
import MenuOutlined from '@ant-design/icons/lib/icons/MenuOutlined';
import useResizeHandler from 'hooks/useHandleResize';
import { useQuery } from '@apollo/client';
import { SeeMyInfoByAdminResponse, SEE_MY_INFO_BY_ADMIN } from 'graphql/query';
import * as S from './style';
import { rolesState } from 'recoil/atoms/roles';

type MenuInfo = {
  key: string;
  keyPath: string[];
};

type MenuData = {
  subMenu?: string;
  item: string;
};

const { SubMenu } = Menu;

export function AsideMenu() {
  const handleLogout = () => {
    localStorage.setItem('accessToken', '');
  };

  const [menu, setMenu] = useState<MenuData>({
    subMenu: '',
    item: '',
  });
  const [toggleMenu, setToggleMenu] = useState(false);
  const [toggleBar, setToggleBar] = useState(true);
  const [roles, setRoles] = useRecoilState(rolesState);

  const navigator = useNavigate();
  const { pathname } = useLocation();
  const { isMobile } = useResizeHandler();

  const toggleChange = () => {
    setToggleMenu(!toggleMenu);
    setToggleBar(!toggleBar);
  };

  const handleMoveHome = () => {
    if (isMobile && !toggleBar && toggleMenu) {
      toggleChange();
    }
    navigator('/');
  };

  const handleClickMenu = (e: MenuInfo) => {
    if (isMobile) {
      toggleChange();
    }

    const [item, subMenu] = e.keyPath;
    if (subMenu) {
      const [, path] = item.split('-');
      setMenu({
        item,
        subMenu,
      });
      return navigator(`/${subMenu}/${path}`);
    } else {
      if (item === 'dashboard') {
        return handleMoveHome();
      }

      setMenu({
        item,
        subMenu: '',
      });
      return navigator(`/${item}`);
    }
  };

  const handleChangeSubMenu = (openKeys: string[]) => {
    if (openKeys.length < 1) {
      return setMenu((prev) => ({ ...prev, subMenu: '' }));
    }

    const [, subMenu] = openKeys;
    setMenu((prev) => ({ ...prev, subMenu }));
  };

  const CheckRole = (keyword: string) => {
    let result;
    if (roles.includes('MASTER')) {
      return true;
    }
    switch (keyword) {
      case 'dashboard':
        result = roles.includes('READ_DASHBOARD');
        break;
      case 'admin':
        result = roles.includes('READ_ADMIN');
        break;
      case 'user':
        result = roles.includes('READ_USER');
        break;
      case 'inquiry':
        result = roles.includes('READ_INQUIRY');
        break;
      case 'giveaway':
        result = roles.includes('READ_GIVEAWAY');
        break;
      case 'broadcastInfo':
        result = roles.includes('READ_BROADCAST_INFO');
        break;
      case 'advertisement':
        result = roles.includes('READ_ADVERTISEMENT');
        break;
      case 'winningNumber':
        result = roles.includes('READ_WINNING_NUMBER');
        break;
      case 'partnershipInquiry':
        result = roles.includes('READ_PARTNERSHIP_INQUIRY');
        break;
      case 'faq':
        result = roles.includes('READ_FAQ');
        break;
      case 'notice':
        result = roles.includes('READ_NOTICE');
        break;
      case 'policy':
        result = roles.includes('READ_POLICY');
        break;
      case 'pushNotification':
        result = roles.some((v) =>
          ['READ_NOTIFICATION', 'READ_USER'].includes(v),
        );
        break;
      case 'youtube':
        result = roles.some((v) =>
          ['READ_YOUTUBE_SUBSCRIPTION', 'READ_STATIC_LINK'].includes(v),
        );
        break;
      case 'registrationInfo':
        result = roles.includes('READ_REGISTRATION_INFO');
        break;
      default:
        break;
    }
    return result;
  };

  useQuery<SeeMyInfoByAdminResponse>(SEE_MY_INFO_BY_ADMIN, {
    onCompleted: (data) => {
      setRoles(data.seeMyInfoByAdmin.adminRoles.map((v) => v.name));
    },
    onError: (e) => {
      notification.error({ message: e.message });
    },
    fetchPolicy: 'no-cache',
  });

  useLayoutEffect(() => {
    const [, subMenu, item] = pathname.split('/');
    if (!subMenu.length) {
      return setMenu({ item: 'dashboard', subMenu: '' });
    }
    if (!item) {
      return setMenu({ item: subMenu, subMenu: '' });
    }

    setMenu({ item: `${subMenu}-${item}`, subMenu });
  }, [pathname]);

  useEffect(() => {
    if (toggleMenu) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [toggleMenu]);

  return (
    <>
      {!isMobile && (
        <S.Sider>
          <S.ImageWrap onClick={handleMoveHome}>
            <S.Image alt="logo" src={menuLogo} />
          </S.ImageWrap>

          <Menu
            theme="dark"
            mode="inline"
            onClick={handleClickMenu}
            onOpenChange={handleChangeSubMenu}
            openKeys={[menu.subMenu ?? '']}
            selectedKeys={[menu.item]}
          >
            {CheckRole('dashboard') && (
              <Menu.Item key="dashboard" icon={<LineChartOutlined />}>
                대시보드
              </Menu.Item>
            )}

            {CheckRole('admin') && (
              <Menu.Item key="admin" icon={<SecurityScanOutlined />}>
                관리자 계정
              </Menu.Item>
            )}

            {CheckRole('user') && (
              <Menu.Item key="users" icon={<UserOutlined />}>
                회원
              </Menu.Item>
            )}
            {(CheckRole('user') || CheckRole('pushNotification')) && (
              <Menu.Item
                key="push-notification"
                icon={<NotificationOutlined />}
              >
                푸시알림
              </Menu.Item>
            )}

            {(CheckRole('giveaway') ||
              CheckRole('broadcastInfo') ||
              CheckRole('youtube')) && (
              <SubMenu
                key="operation"
                icon={<SettingOutlined />}
                title="앱 설정"
              >
                {CheckRole('giveaway') && (
                  <Menu.Item key="operation-prize">경품 설정</Menu.Item>
                )}
                {CheckRole('broadcastInfo') && (
                  <Menu.Item key="operation-live">방송 설정</Menu.Item>
                )}
                {(CheckRole('giveaway') || CheckRole('broadcastInfo')) && (
                  <Menu.Item key="operation-history">내역조회</Menu.Item>
                )}
                {CheckRole('youtube') && (
                  <Menu.Item key="operation-youtube">유튜브 설정</Menu.Item>
                )}
                <Menu.Item key="operation-partner">제휴사 설정</Menu.Item>
              </SubMenu>
            )}

            {CheckRole('advertisement') && (
              <SubMenu
                key="advertisement"
                title="광고 관리"
                icon={<NotificationOutlined />}
              >
                {CheckRole('advertisement') && (
                  <>
                    <Menu.Item key="advertisement-image">이미지 광고</Menu.Item>
                    <Menu.Item key="advertisement-video">영상 광고</Menu.Item>
                  </>
                )}
              </SubMenu>
            )}

            {(CheckRole('winningNumber') || CheckRole('registration')) && (
              <SubMenu
                key="again"
                icon={<CustomerServiceOutlined />}
                title="로또 어게인 추첨"
              >
                {CheckRole('winningNumber') && (
                  <Menu.Item key="again-input">당첨결과 입력</Menu.Item>
                )}
                {CheckRole('winningNumber') && (
                  <Menu.Item key="again-history">과거 당첨결과</Menu.Item>
                )}
                {CheckRole('winningNumber') && (
                  <Menu.Item key="again-detail">당첨 세부내역</Menu.Item>
                )}
                {CheckRole('registrationInfo') && (
                  <Menu.Item key="again-shipping">발송내역 업로드</Menu.Item>
                )}
              </SubMenu>
            )}
            {(CheckRole('partnershipInquiry') ||
              CheckRole('inquiry') ||
              CheckRole('faq') ||
              CheckRole('notice')) && (
              <SubMenu
                key="customer"
                icon={<CustomerServiceOutlined />}
                title="고객센터 관리"
              >
                {CheckRole('partnershipInquiry') && (
                  <Menu.Item key="customer-partner">제휴 문의</Menu.Item>
                )}
                {CheckRole('inquiry') && (
                  <Menu.Item key="customer-inquiry">1:1 문의</Menu.Item>
                )}
                {CheckRole('faq') && (
                  <Menu.Item key="customer-faq">FAQ</Menu.Item>
                )}
                {CheckRole('notice') && (
                  <Menu.Item key="customer-notice">공지사항</Menu.Item>
                )}
              </SubMenu>
            )}

            {CheckRole('policy') && (
              <Menu.Item key="policy" icon={<FormOutlined />}>
                약관 관리
              </Menu.Item>
            )}

            <Menu.Item onClick={handleLogout} icon={<LogoutOutlined />}>
              로그아웃
            </Menu.Item>
          </Menu>
        </S.Sider>
      )}
      {toggleMenu && <S.Mask onClick={toggleChange} />}
      {isMobile && (
        <>
          <S.NavTop isOpen={toggleMenu}>
            <S.ImageWrap onClick={handleMoveHome}>
              <S.Image alt="logo" src={logo} />
            </S.ImageWrap>
            <button
              // type="primary"
              onClick={toggleChange}
              style={{
                width: 60,
                height: 60,
                boxShadow: 'none',
              }}
            >
              {toggleBar ? (
                <MenuOutlined
                  style={{
                    color: '#111',
                  }}
                />
              ) : (
                <MenuFoldOutlined
                  style={{
                    color: '#111',
                  }}
                />
              )}
            </button>
          </S.NavTop>
          {toggleMenu && (
            <Menu
              theme="light"
              mode="inline"
              onClick={handleClickMenu}
              onOpenChange={handleChangeSubMenu}
              openKeys={[menu.subMenu ?? '']}
              selectedKeys={[menu.item]}
              inlineCollapsed={toggleBar}
              style={{
                position: 'fixed',
                zIndex: 100,
                marginTop: '50px',
              }}
            >
              {CheckRole('dashboard') && (
                <Menu.Item key="dashboard" icon={<LineChartOutlined />}>
                  대시보드
                </Menu.Item>
              )}

              {CheckRole('admin') && (
                <Menu.Item key="admin" icon={<SecurityScanOutlined />}>
                  관리자 계정
                </Menu.Item>
              )}

              {CheckRole('user') && (
                <Menu.Item key="users" icon={<UserOutlined />}>
                  회원
                </Menu.Item>
              )}

              {(CheckRole('user') || CheckRole('pushNotification')) && (
                <Menu.Item
                  key="push-notification"
                  icon={<NotificationOutlined />}
                >
                  푸시알림
                </Menu.Item>
              )}

              {(CheckRole('giveaway') ||
                CheckRole('broadcastInfo') ||
                CheckRole('youtube')) && (
                <SubMenu
                  key="operation"
                  icon={<SettingOutlined />}
                  title="앱 설정"
                >
                  {CheckRole('giveaway') && (
                    <Menu.Item key="operation-prize">경품 설정</Menu.Item>
                  )}
                  {CheckRole('broadcastInfo') && (
                    <Menu.Item key="operation-live">방송 설정</Menu.Item>
                  )}
                  {(CheckRole('giveaway') || CheckRole('broadcastInfo')) && (
                    <Menu.Item key="operation-history">내역조회</Menu.Item>
                  )}
                  {CheckRole('youtube') && (
                    <Menu.Item key="operation-youtube">유튜브 설정</Menu.Item>
                  )}
                  <Menu.Item key="operation-partner">제휴사 설정</Menu.Item>
                </SubMenu>
              )}
              <SubMenu
                key="advertisement"
                title="광고 관리"
                icon={<NotificationOutlined />}
              >
                {CheckRole('advertisement') && (
                  <>
                    <Menu.Item key="advertisement-image">이미지 광고</Menu.Item>
                    <Menu.Item key="advertisement-video">영상 광고</Menu.Item>
                  </>
                )}
              </SubMenu>

              {(CheckRole('winningNumber') || CheckRole('registration')) && (
                <SubMenu
                  key="again"
                  icon={<CustomerServiceOutlined />}
                  title="로또 어게인 추첨"
                >
                  {CheckRole('winningNumber') && (
                    <Menu.Item key="again-input">당첨결과 입력</Menu.Item>
                  )}
                  {CheckRole('winningNumber') && (
                    <Menu.Item key="again-history">과거 당첨결과</Menu.Item>
                  )}
                  {CheckRole('winningNumber') && (
                    <Menu.Item key="again-detail">당첨 세부내역</Menu.Item>
                  )}
                  {CheckRole('registrationInfo') && (
                    <Menu.Item key="again-shipping">발송내역 업로드</Menu.Item>
                  )}
                </SubMenu>
              )}
              {(CheckRole('partnershipInquiry') ||
                CheckRole('inquiry') ||
                CheckRole('faq') ||
                CheckRole('notice')) && (
                <SubMenu
                  key="customer"
                  icon={<CustomerServiceOutlined />}
                  title="고객센터 관리"
                >
                  {CheckRole('partnershipInquiry') && (
                    <Menu.Item key="customer-partner">제휴 문의</Menu.Item>
                  )}
                  {CheckRole('inquiry') && (
                    <Menu.Item key="customer-inquiry">1:1 문의</Menu.Item>
                  )}
                  {CheckRole('faq') && (
                    <Menu.Item key="customer-faq">FAQ</Menu.Item>
                  )}
                  {CheckRole('notice') && (
                    <Menu.Item key="customer-notice">공지사항</Menu.Item>
                  )}
                </SubMenu>
              )}

              {CheckRole('policy') && (
                <Menu.Item key="policy" icon={<FormOutlined />}>
                  약관 관리
                </Menu.Item>
              )}

              <Menu.Item onClick={handleLogout} icon={<LogoutOutlined />}>
                로그아웃
              </Menu.Item>
            </Menu>
          )}
        </>
      )}
    </>
  );
}
