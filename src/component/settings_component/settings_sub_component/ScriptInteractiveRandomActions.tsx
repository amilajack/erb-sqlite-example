import { Row, Col, InputNumber } from 'antd';
import { saveTmpSetting } from 'features/feature-setting/reducers/setting.reducer';
import _ from 'lodash';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';

type Props = {
  isTabActived: boolean;
  settingValues: any;
};

const ScriptInteractiveRandomActions: React.FC<Props> = ({
  isTabActived,
  settingValues,
}) => {
  const [actTimeFrom, setActTimeFrom] = useState(
    _.get(settingValues, 'actTime.from', 50)
  );
  const [actTimeTo, setActTimeTo] = useState(
    _.get(settingValues, 'actTime.to', 100)
  );

  const randomAction = useMemo(() => {
    return { actTime: { from: actTimeFrom, to: actTimeTo } };
  }, [actTimeFrom, actTimeTo]);

  const dispatch = useDispatch();
  useEffect(() => {
    if (!isTabActived) {
      dispatch(
        saveTmpSetting('scriptInteraction', {
          randomAction,
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTabActived]);

  const valueRef = useRef();
  useEffect(() => {
    valueRef.current = { randomAction };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [randomAction]);

  useEffect(() => {
    return () => {
      if (!isTabActived) {
        return;
      }
      dispatch(saveTmpSetting('scriptInteraction', valueRef.current));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Row>
        <Col span={12}>
          <span className="label-setting">Random act time (Seconds)</span>
        </Col>
        <Col>
          <InputNumber
            min={1}
            max={100000}
            defaultValue={actTimeFrom}
            onChange={(value) => setActTimeFrom(value)}
          />
        </Col>
        <Col>
          <span style={{ padding: '0 5px 0 5px' }}>-</span>
        </Col>
        <Col>
          <InputNumber
            min={1}
            max={100000}
            defaultValue={actTimeTo}
            onChange={(value) => setActTimeTo(value)}
          />
        </Col>
      </Row>
      <Row style={{ marginTop: '20px' }}>
        <Col span={24}>
          <span className="label-setting">
            The list of actions is randomly selected to process:
          </span>
          <br />
          <span className="label-setting">1. View and interact news feed</span>
          <br />
          <span className="label-setting">
            2. View and interact notifications
          </span>
          <br />
          <span className="label-setting">
            3. View and interact news feed group
          </span>
          <br />
          <span className="label-setting">4. View and interact video</span>
          <br />
          <span className="label-setting">5. Accept friend request</span>
          <br />
          <span className="label-setting">6. Add friend suggestions</span>
        </Col>
      </Row>
    </>
  );
};

export default ScriptInteractiveRandomActions;
