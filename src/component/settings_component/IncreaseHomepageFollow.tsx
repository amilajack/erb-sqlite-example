
/* eslint-disable react/jsx-props-no-spreading */
import { Input, Col, Divider, Row, InputNumber } from 'antd';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { saveTmpSetting } from 'features/feature-setting/reducers/setting.reducer';
import _ from 'lodash';
import { upsertSetting } from 'features/feature-setting/services/setting.service';

type Props = {
  isSaveSetting: boolean;
  increaseHomepageFollowSetting: any;
};

const IncreaseHomepageFollow: React.FC<Props> = ({
  isSaveSetting,
  increaseHomepageFollowSetting,
}) => {
  const { tmpSetting } = useSelector((state) => _.get(state, 'settings', {}));
  const [profileId, setProfileId] = useState(
    _.get(increaseHomepageFollowSetting, 'profileId', '')
  );
  const [totalFollow, setTotalFollow] = useState(
    _.get(increaseHomepageFollowSetting, 'totalFollow', 1)
  );
  const [numThread, setNumThread] = useState(
    _.get(increaseHomepageFollowSetting, 'numThread', 1)
  );

  const increaseHomepageFollow = useMemo(() => {
    return {
      profileId,
      totalFollow,
      numThread,
    };
  }, [profileId, totalFollow, numThread]);

  const valueRef = useRef();
  const dispatch = useDispatch();
  useEffect(() => {
    valueRef.current = increaseHomepageFollow;
    dispatch(saveTmpSetting('increaseHomepageFollow', increaseHomepageFollow));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [increaseHomepageFollow]);

  useEffect(() => {
    if (isSaveSetting) {
      dispatch(upsertSetting(tmpSetting));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSaveSetting]);

  useEffect(() => {
    return () => {
      dispatch(saveTmpSetting('increaseHomepageFollow', valueRef.current));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      style={{
        backgroundColor: 'white',
        padding: '10px',
      }}
    >
      <Divider orientation="left" orientationMargin={5}>
        Tăng theo dõi trang cá nhân
      </Divider>
      <Row>
        <Col span={3}>
          <span className="label-setting">Profile ID</span>
        </Col>
        <Col span={9}>
          <Input
            defaultValue={profileId}
            onChange={(e) => setProfileId(e.target.value)}
          />
        </Col>
      </Row>
      <Row className="row-per-setting">
        <Col span={3}>
          <span className="label-setting">Total follow</span>
        </Col>
        <Col>
          <InputNumber
            min={1}
            max={100000}
            defaultValue={totalFollow}
            onChange={(value) => setTotalFollow(value)}
          />
        </Col>
      </Row>
      <Row className="row-per-setting">
        <Col span={3}>
          <span className="label-setting">Thread</span>
        </Col>
        <Col>
          <InputNumber
            min={1}
            max={100000}
            defaultValue={numThread}
            onChange={(value) => setNumThread(value)}
          />
        </Col>
      </Row>
    </div>
  );
};

export default IncreaseHomepageFollow;
