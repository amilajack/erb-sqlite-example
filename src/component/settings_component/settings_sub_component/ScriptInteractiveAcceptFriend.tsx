import _ from 'lodash';
import { Row, Col, InputNumber } from 'antd';
import { saveTmpSetting } from 'features/feature-setting/reducers/setting.reducer';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';

type Props = {
  isTabActived: boolean;
  settingValues: any;
};

const ScriptInteractiveAcceptFriend: React.FC<Props> = ({
  isTabActived,
  settingValues,
}) => {
  const [timeViewFrom, setTimeViewFrom] = useState(
    _.get(settingValues, 'timeView.from', 30)
  );
  const [timeViewTo, setTimeViewTo] = useState(
    _.get(settingValues, 'timeView.to', 60)
  );
  const [numAcceptRequestFrom, setNumAcceptRequestFrom] = useState(
    _.get(settingValues, 'numAcceptRequest.from', 1)
  );
  const [numAcceptRequestTo, setNumAcceptRequestTo] = useState(
    _.get(settingValues, 'numAcceptRequest.to', 1)
  );
  const [timeWaitExceptFrom, setTimeWaitExceptFrom] = useState(
    _.get(settingValues, 'timeWaitExcept.from', 5)
  );
  const [timeWaitExceptTo, setTimeWaitExceptTo] = useState(
    _.get(settingValues, 'timeWaitExcept.to', 10)
  );
  const interactAcceptFriend = useMemo(() => {
    return {
      timeView: { from: timeViewFrom, to: timeViewTo },
      numAcceptRequest: { from: numAcceptRequestFrom, to: numAcceptRequestTo },
      timeWaitExcept: { from: timeWaitExceptFrom, to: timeWaitExceptTo },
    };
  }, [
    timeViewFrom,
    timeViewTo,
    numAcceptRequestFrom,
    numAcceptRequestTo,
    timeWaitExceptFrom,
    timeWaitExceptTo,
  ]);

  const dispatch = useDispatch();
  useEffect(() => {
    if (!isTabActived) {
      dispatch(
        saveTmpSetting('scriptInteraction', {
          interactAcceptFriend,
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTabActived]);

  const valueRef = useRef();
  useEffect(() => {
    Object.assign(valueRef, { current: { interactAcceptFriend } });
  }, [interactAcceptFriend]);

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
            Time view friend requests (Seconds)
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
          <span className="label-setting">Total accept friend request</span>
        </Col>
        <Col>
          <InputNumber
            min={1}
            max={100000}
            defaultValue={numAcceptRequestFrom}
            onChange={(value) => setNumAcceptRequestFrom(value)}
          />
        </Col>
        <Col>
          <span style={{ padding: '0 5px 0 5px' }}>-</span>
        </Col>
        <Col>
          <InputNumber
            min={1}
            max={100000}
            defaultValue={numAcceptRequestTo}
            onChange={(value) => setNumAcceptRequestTo(value)}
          />
        </Col>
      </Row>
      <Row className="row-per-setting">
        <Col span={12}>
          <span className="label-setting">
            Time wait accept friend request (Seconds)
          </span>
        </Col>
        <Col>
          <InputNumber
            min={1}
            max={100000}
            defaultValue={timeWaitExceptFrom}
            onChange={(value) => setTimeWaitExceptFrom(value)}
          />
        </Col>
        <Col>
          <span style={{ padding: '0 5px 0 5px' }}>-</span>
        </Col>
        <Col>
          <InputNumber
            min={1}
            max={100000}
            defaultValue={timeWaitExceptTo}
            onChange={(value) => setTimeWaitExceptTo(value)}
          />
        </Col>
      </Row>
    </>
  );
};

export default ScriptInteractiveAcceptFriend;
