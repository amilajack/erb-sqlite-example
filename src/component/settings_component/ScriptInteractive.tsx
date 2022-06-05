import { Col, Divider, Row, Tabs } from 'antd';
import { useEffect, useState } from 'react';
import ScriptInteractiveAcceptFriend from './settings_sub_component/ScriptInteractiveAcceptFriend';
import ScriptInteractiveAddFriendSuggest from './settings_sub_component/ScriptInteractiveAddFriendSuggest';
import ScriptInteractiveNewsFeed from './settings_sub_component/ScriptInteractiveNewsFeed';
import ScriptInteractiveNewsFeedGroup from './settings_sub_component/ScriptInteractiveNewsFeedGroup';
import ScriptInteractiveInsArtNavPost from './settings_sub_component/ScriptInteractiveInsArtNavPost';
import ScriptInteractiveNotification from './settings_sub_component/ScriptInteractiveNotification';
import ScriptInteractiveRandomActions from './settings_sub_component/ScriptInteractiveRandomActions';
import ScriptInteractiveSettings from './settings_sub_component/ScriptInteractiveSettings';
import ScriptInteractiveVideo from './settings_sub_component/ScriptInteractiveVideo';
import ScriptInteractiveInsArtSearch from './settings_sub_component/ScriptInteractiveInsArtSearch';
import _ from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { upsertSetting } from 'features/feature-setting/services/setting.service';

const { TabPane } = Tabs;

type Props = {
  isSaveSetting: boolean,
  scriptInteractionSetting: any,
}

const ScriptInteractive: React.FC<Props> = ({ isSaveSetting, scriptInteractionSetting }) => {
  const [activeKey, setActiveKey] = useState('settings');
  const { tmpSetting } = useSelector((state) => _.get(state, 'settings', {}));
  const dispatch = useDispatch();
  const saveSettings = () => {
    dispatch(
      upsertSetting(tmpSetting)
    );
  }
  useEffect(() => {
    if (isSaveSetting) {
      saveSettings();
      // setSaveSetting(false);
    }
  }, [JSON.stringify(_.get(tmpSetting, 'scriptInteraction', {}))]);

  return (
    <div
      style={{
        backgroundColor: 'white',
        padding: '10px',
      }}
    >
      <Divider orientation="left" orientationMargin={5}>
        Tạo kịch bản tương tác
      </Divider>
      <Row>
        <Col span={24}>
          <Tabs defaultActiveKey={activeKey} tabPosition="left" style={{ height: 600 }} onTabClick={(key: string) => setActiveKey(key)}>
            <TabPane tab="Settings" key="settings">
              <ScriptInteractiveSettings isTabActived={activeKey === 'settings' && !isSaveSetting} settingValues={_.get(scriptInteractionSetting, 'settings', {})} />
            </TabPane>
            <TabPane tab="Random one action" key="random_one_action">
              <ScriptInteractiveRandomActions isTabActived={activeKey === 'random_one_action' && !isSaveSetting} settingValues={_.get(scriptInteractionSetting, 'randomAction', {})} />
            </TabPane>
            <TabPane tab="View and interact news feed" key="interact_news_feed">
              <ScriptInteractiveNewsFeed isTabActived={activeKey === 'interact_news_feed' && !isSaveSetting} settingValues={_.get(scriptInteractionSetting, 'interactNewsFeed', {})} />
            </TabPane>
            <TabPane tab="View and interact notifications" key="interact_notification">
              <ScriptInteractiveNotification isTabActived={activeKey === 'interact_notification' && !isSaveSetting} settingValues={_.get(scriptInteractionSetting, 'interactNotification', {})} />
            </TabPane>
            <TabPane tab="View and interact news feed group" key="interact_news_feed_group">
              <ScriptInteractiveNewsFeedGroup isTabActived={activeKey === 'interact_news_feed_group' && !isSaveSetting} settingValues={_.get(scriptInteractionSetting, 'interactNewsFeedGroup', {})} />
            </TabPane>
            <TabPane tab="View and interact video" key="interact_video">
              {/* using isSaveSetting for trigger save tmpSetting when click button OK */}
              <ScriptInteractiveVideo isTabActived={activeKey === 'interact_video' && !isSaveSetting} settingValues={_.get(scriptInteractionSetting, 'interactVideo', {})} />
            </TabPane>
            <TabPane tab="Accept friend request" key="accept_friend_request">
              <ScriptInteractiveAcceptFriend isTabActived={activeKey === 'accept_friend_request' && !isSaveSetting} settingValues={_.get(scriptInteractionSetting, 'interactAcceptFriend', {})} />
            </TabPane>
            <TabPane tab="Add friend suggestions" key="add_friend_suggestions">
              <ScriptInteractiveAddFriendSuggest isTabActived={activeKey === 'add_friend_suggestions' && !isSaveSetting} settingValues={_.get(scriptInteractionSetting, 'interactAddFriend', {})} />
            </TabPane>
            <TabPane tab="Instant articles navigate post" key="inst_art_nav_post">
              <ScriptInteractiveInsArtNavPost isTabActived={activeKey === 'inst_art_nav_post' && !isSaveSetting} settingValues={_.get(scriptInteractionSetting, 'insArtNavPosts', {})} />
            </TabPane>
            <TabPane tab="Instant articles search keywords" key="inst_art_search_keyword">
              <ScriptInteractiveInsArtSearch isTabActived={activeKey === 'inst_art_search_keyword' && !isSaveSetting} settingValues={_.get(scriptInteractionSetting, 'insArtSearch', {})} />
            </TabPane>
          </Tabs>
        </Col>
      </Row>
    </div>
  );
};

export default ScriptInteractive;
