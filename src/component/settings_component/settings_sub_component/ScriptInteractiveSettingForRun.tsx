import { Col, Row } from 'antd';
import { PlusCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { useState } from 'react';

const sources = [
  {
    key: 'random_action',
    value: 'Random one action',
  },
  {
    key: 'interact_news_feed',
    value: 'View and interact news feed',
  },
  {
    key: 'interact_notification',
    value: 'View and interact notifications',
  },
  {
    key: 'interact_news_feed_group',
    value: 'View and interact news feed group',
  },
  {
    key: 'interact_video',
    value: 'View and interact video',
  },
  {
    key: 'accept_friend_request',
    value: 'Accept friend request',
  },
  {
    key: 'add_friend_suggestions',
    value: 'Add friend suggestions',
  },
  {
    key: 'inst_art_nav_post',
    value: 'Instant articles navigate post',
  },
  {
    key: 'inst_art_search_keyword',
    value: 'Instant articles search keywords',
  },
];

const ScriptInteractiveSettingForRun = () => {
  const [targets, setTargets] = useState([]);
  return (
    <>
      <Row>
        <Col span={12}>
          {sources.map((s) => (
            <Row key={s.key}>
              <Col span={18}>{s.value}</Col>
              <Col span={6}>
                <a
                  onClick={() => {
                    targets.push(s);
                    setTargets(targets.slice());
                  }}
                >
                  <PlusCircleOutlined />
                </a>
              </Col>
            </Row>
          ))}
        </Col>
        <Col span={12}>
          {targets.map((s, idx) => (
            <Row key={`${s.key}_${idx}`}>
              <Col span={18}>{s.value}</Col>
              <Col span={6}>
                <a
                  onClick={() => {
                    targets.splice(idx, 1);
                    setTargets(targets.slice());
                  }}
                >
                  <MinusCircleOutlined />
                </a>
              </Col>
            </Row>
          ))}
        </Col>
      </Row>
    </>
  );
};

export default ScriptInteractiveSettingForRun;
