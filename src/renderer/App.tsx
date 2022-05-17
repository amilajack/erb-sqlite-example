import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { Menu, MenuProps, Layout } from 'antd';
import {
  SyncOutlined,
  HistoryOutlined,
  ReloadOutlined,
  SettingOutlined,
  ProfileOutlined,
  KeyOutlined,
} from '@ant-design/icons';
import './App.css';
import React from 'react';
import ChangePage from 'page/ChangePage';
import SettingPage from 'page/SettingPage';
import { useSelector } from 'react-redux';
import CommonFunc from 'common/common';
import _ from 'lodash';
import Loading from 'component/Loading';
import { actions } from 'features';

const { Sider, Content } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group'
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem('Change', 'menu_change', <SyncOutlined />),
  getItem('Backup', 'menu_backup', <HistoryOutlined />),
  getItem('Restore', 'menu_restore', <ReloadOutlined />),
  getItem('Settings', 'menu_setting', <SettingOutlined />),
  getItem('License', 'menu_license', <ProfileOutlined />),
  getItem('Key license', 'menu_key_license', <KeyOutlined />),
];

const MainPage = () => {
  const [currentPage, setCurrentPage] = React.useState('menu_change');
  const onClick: MenuProps['onClick'] = (e) => {
    const { key } = e;
    setCurrentPage(key);
  };
  let page: any;
  switch (currentPage) {
    case 'menu_change':
      page = <ChangePage />;
      break;
    case 'menu_setting':
      page = <SettingPage />;
      break;
    default:
      break;
  }
  const isLoading = useSelector((state) =>
    CommonFunc.isLoading(state, actions)
  );
  return (
    <>
      <Loading isLoading={isLoading} />
      <Layout>
        <Sider
          collapsed
          style={{
            backgroundColor: 'white',
            marginTop: '0px',
            marginBottom: '0px',
          }}
        >
          <Menu
            defaultSelectedKeys={[currentPage]}
            mode="inline"
            theme="light"
            items={items}
            onClick={onClick}
          />
        </Sider>
        <Layout className="site-layout">
          <Content
            style={{
              padding: 24,
              minHeight: 280,
            }}
          >
            {page}
          </Content>
        </Layout>
      </Layout>
    </>
  );
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
      </Routes>
    </Router>
  );
}
