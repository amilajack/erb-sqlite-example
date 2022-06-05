import type { MenuProps } from 'antd';
import { Menu, Layout, Button } from 'antd';
import {
  PlayCircleOutlined,
  ShareAltOutlined,
  VideoCameraOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  WifiOutlined,
  UserOutlined,
  TeamOutlined,
  ProfileOutlined,
  LikeOutlined,
  PlusCircleOutlined,
  FormOutlined,
  DesktopOutlined,
  MoneyCollectOutlined,
} from '@ant-design/icons';
import React, { useState } from 'react';
import ScriptInteractive from './settings_component/ScriptInteractive';
import _ from 'lodash';
import ReelInteractive from './settings_component/ReelInteractive';
import LivestreamInteractive from './settings_component/LivestreamInteractive';
import PostHomepage from './settings_component/PostHomePage';
import PostGroup from './settings_component/PostGroup';
import FeedFanpageInteractive from './settings_component/FeedFanpageInteractive';
import FeedGroupInteractive from './settings_component/FeedGroupInteractive';
import IncreaseFanpageLike from './settings_component/IncreaseFanpageLike';
import IncreaseHomepageFollow from './settings_component/IncreaseHomepageFollow';
import PostInteractiveV2 from './settings_component/PostInteractiveV2';
import PostInteractive from './settings_component/PostInteractive';
import VideoInteractive from './settings_component/VideoInteractive';

const { Sider, Content } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

type Props = {
  isSaveSetting: boolean,
  setting: any,
}

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

const items: MenuProps['items'] = [
  getItem('Chức năng chính', 'main_function', <MoneyCollectOutlined />, [
    getItem(
      'Tạo kịch bản tương tác',
      'script_interactive',
      <PlayCircleOutlined />
    ),
    getItem(
      'Tương tác bài viết V2 (like, share, comment...)',
      'post_interactive_v2',
    <ShareAltOutlined />
    ),
    getItem(
      'Tương tác thước phim (Reels)',
      'reel_interactive',
      <VideoCameraOutlined />
    ),
    getItem(
      'Tương tác Livestream (View, like, share...)',
      'livestream_interactive',
      <WifiOutlined />
    ),
    getItem(
      'Đăng bài trang cá nhân',
      'post_homepage',
      <UserOutlined />
    ),
    getItem(
      'Đăng bài nhóm',
      'post_group',
      <TeamOutlined />
    ),
    getItem(
      'Tương tác nuôi fanpage',
      'feed_fanpage_interactive',
      <ProfileOutlined />
    ),
    getItem(
      'Tương tác nuôi nhóm',
      'feed_group_interactive',
      <ProfileOutlined />
    ),
    getItem(
      'Tăng like fanpage',
      'increase_fanpage_like',
      <LikeOutlined />
    ),
    getItem(
      'Tăng theo dõi trang cá nhân',
      'increase_homepage_follow',
      <PlusCircleOutlined />
    ),
    getItem(
      'Tương tác bài viết (like, comment)',
      'post_interactive',
      <FormOutlined />
    ),
    getItem(
      'Tương tác video (view, like, share)',
      'video_interactive',
      <DesktopOutlined />
    ),
  ]),
];

// submenu keys of first level
const rootSubmenuKeys = ['main_function', 'sub2', 'sub4'];

const Settings: React.FC<Props> = ({ isSaveSetting, setting }) => {
  const [openKeys, setOpenKeys] = useState(['main_function']);
  const [collapsed, setCollapsed] = useState(false);
  const [currentPage, setCurrentPage] = useState('script_interactive');
  const onClickItemMenu: MenuProps['onClick'] = (e) => {
    const { key } = e;
    setCurrentPage(key);
  };
  let page: any;
  switch (currentPage) {
    case 'script_interactive':
      page = <ScriptInteractive isSaveSetting={isSaveSetting} scriptInteractionSetting={_.get(setting, 'scriptInteraction', {})} />;
      break;
    case 'post_interactive_v2':
      page = <PostInteractiveV2 isSaveSetting={isSaveSetting} postInteractionSetting={_.get(setting, 'postInteractionV2', {})} />;
      break;
    case 'reel_interactive':
      page = <ReelInteractive isSaveSetting={isSaveSetting} reelInteractionSetting={_.get(setting, 'reelInteraction', {})} />;
      break;
    case 'livestream_interactive':
      page = <LivestreamInteractive isSaveSetting={isSaveSetting} livestreamInteractionSetting={_.get(setting, 'livestreamInteraction', {})} />;
      break;
    case 'post_homepage':
      page = <PostHomepage isSaveSetting={isSaveSetting} postHomepageSetting={_.get(setting, 'postHomepage', {})} />;
      break;
    case 'post_group':
      page = <PostGroup isSaveSetting={isSaveSetting} postGroupSetting={_.get(setting, 'postGroup', {})} />;
      break;
    case 'feed_fanpage_interactive':
      page = <FeedFanpageInteractive isSaveSetting={isSaveSetting} feedFanpagelInteractionSetting={_.get(setting, 'feedFanpageInteraction', {})} />;
      break;
    case 'feed_group_interactive':
      page = <FeedGroupInteractive isSaveSetting={isSaveSetting} feedGrouplInteractionSetting={_.get(setting, 'feedGroupInteraction', {})} />;
      break;
    case 'increase_fanpage_like':
      page = <IncreaseFanpageLike isSaveSetting={isSaveSetting} increaseFanpageLikeSetting={_.get(setting, 'increaseFanpageLike', {})} />;
      break;
    case 'increase_homepage_follow':
      page = <IncreaseHomepageFollow isSaveSetting={isSaveSetting} increaseHomepageFollowSetting={_.get(setting, 'increaseHomepageFollow', {})} />;
      break;
    case 'post_interactive':
      page = <PostInteractive isSaveSetting={isSaveSetting} postInteractionSetting={_.get(setting, 'postInteraction', {})} />;
      break;
    case 'video_interactive':
      page = <VideoInteractive isSaveSetting={isSaveSetting} videoInteractionSetting={_.get(setting, 'postInteraction', {})} />;
      break;
    default:
      break;
  }

  const onOpenChange: MenuProps['onOpenChange'] = (keys) => {
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    if (rootSubmenuKeys.indexOf(latestOpenKey!) === -1) {
      setOpenKeys(keys);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  };

  return (
    <>
      <Layout>
        <div
          style={{
            backgroundColor: 'white',
            marginTop: '0px',
            marginBottom: '0px',
          }}
        >
          <Button
            type="primary"
            onClick={() => setCollapsed(!collapsed)}
            style={{ marginBottom: 16 }}
          >
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </Button>
          <Sider
            collapsed={collapsed}
            style={{
              backgroundColor: 'white',
              marginTop: '0px',
              marginBottom: '0px',
            }}
            width="300px"
          >
            <Menu
              defaultOpenKeys={['main_function']}
              defaultSelectedKeys={[currentPage]}
              mode="inline"
              openKeys={openKeys}
              onOpenChange={onOpenChange}
              items={items}
              onClick={onClickItemMenu}
            />
          </Sider>
        </div>
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

export default Settings;
