import { Row, Col, InputNumber } from 'antd';
import { saveTmpSetting } from 'features/feature-setting/reducers/setting.reducer';
import _ from 'lodash';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';

type Props = {
  isTabActived: boolean;
  settingValues: any;
};

const ScriptInteractiveAddFriendSuggest: React.FC<Props> = ({
  isTabActived,
  settingValues,
}) => {
  const [timeViewFrom, setTimeViewFrom] = useState(
    _.get(settingValues, 'timeView.from', 30)
  );
  const [timeViewTo, setTimeViewTo] = useState(
    _.get(settingValues, 'timeView.to', 60)
  );
  const [numAddFriendFrom, setNumAddFriendFrom] = useState(
    _.get(settingValues, 'numAddFriend.from', 1)
  );
  const [numAddFriendTo, setNumAddFriendTo] = useState(
    _.get(settingValues, 'numAddFriend.to', 1)
  );
  const [timeWaitAddFriendFrom, setTimeWaitAddFriendFrom] = useState(
    _.get(settingValues, 'timeWaitAddFriend.from', 5)
  );
  const [timeWaitAddFriendTo, setTimeWaitAddFriendTo] = useState(
    _.get(settingValues, 'timeWaitAddFriend.to', 10)
  );
  const interactAddFriend = useMemo(() => {
    return {
      timeView: { from: timeViewFrom, to: timeViewTo },
      numAddFriend: { from: numAddFriendFrom, to: numAddFriendTo },
      timeWaitAddFriend: {
        from: timeWaitAddFriendFrom,
        to: timeWaitAddFriendTo,
      },
    };
  }, [
    timeViewFrom,
    timeViewTo,
    numAddFriendFrom,
    numAddFriendTo,
    timeWaitAddFriendFrom,
    timeWaitAddFriendTo,
  ]);

  const dispatch = useDispatch();
  useEffect(() => {
    if (!isTabActived) {
      dispatch(
        saveTmpSetting('scriptInteraction', {
          interactAddFriend,
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTabActived]);

  const valueRef = useRef();
  useEffect(() => {
    Object.assign(valueRef, { current: { interactAddFriend } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interactAddFriend]);

  useEffect(() => {
    return () => {
      if (!isTabActived) {
        return;
      }
      dispatch(saveTmpSetting('scriptInteraction', _.get(valueRef, 'current')));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <Row>
        <Col span={12}>
          <span className="label-setting">
            Time view friend suggestions (Seconds)
          </span>
        </Col>
        <Col>
          <InputNumber
            min={1}
            max={100000}
            defaultValue={timeViewFrom}
            onChange={(value) => setTimeViewFrom(value)}
          />
        </Col>
        <Col>
          <span style={{ padding: '0 5px 0 5px' }}>-</span>
        </Col>
        <Col>
          <InputNumber
            min={1}
            max={100000}
            defaultValue={timeViewTo}
            onChange={(value) => setTimeViewTo(value)}
          />
        </Col>
      </Row>
      <Row className="row-per-setting">
        <Col span={12}>
          <span className="label-setting">Total add friend suggestions</span>
        </Col>
        <Col>
          <InputNumber
            min={1}
            max={100000}
            defaultValue={numAddFriendFrom}
            onChange={(value) => setNumAddFriendFrom(value)}
          />
        </Col>
        <Col>
          <span style={{ padding: '0 5px 0 5px' }}>-</span>
        </Col>
        <Col>
          <InputNumber
            min={1}
            max={100000}
            defaultValue={numAddFriendTo}
            onChange={(value) => setNumAddFriendTo(value)}
          />
        </Col>
      </Row>
      <Row className="row-per-setting">
        <Col span={12}>
          <span className="label-setting">
            Time wait add friend suggestions (Seconds)
          </span>
        </Col>
        <Col>
          <InputNumber
            min={1}
            max={100000}
            defaultValue={timeWaitAddFriendFrom}
            onChange={(value) => setTimeWaitAddFriendFrom(value)}
          />
        </Col>
        <Col>
          <span style={{ padding: '0 5px 0 5px' }}>-</span>
        </Col>
        <Col>
          <InputNumber
            min={1}
            max={100000}
            defaultValue={timeWaitAddFriendTo}
            onChange={(value) => setTimeWaitAddFriendTo(value)}
          />
        </Col>
      </Row>
    </>
  );
};

export default ScriptInteractiveAddFriendSuggest;
