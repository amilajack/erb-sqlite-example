import { Row, Col, InputNumber, Checkbox } from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { saveTmpSetting } from 'features/feature-setting/reducers/setting.reducer';
import _ from 'lodash';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';

type Props = {
  isTabActived: boolean;
  settingValues: any;
};

const ScriptInteractiveNotification: React.FC<Props> = ({
  isTabActived,
  settingValues,
}) => {
  const [timeViewFrom, setTimeViewFrom] = useState(
    _.get(settingValues, 'timeView.from', 30)
  );
  const [timeViewTo, setTimeViewTo] = useState(
    _.get(settingValues, 'timeView.to', 60)
  );
  const [numNotisInteractFrom, setNumNotisInteractFrom] = useState(
    _.get(settingValues, 'numNotisInteract.from', 1)
  );
  const [numNotisInteractTo, setNumNotisInteractTo] = useState(
    _.get(settingValues, 'numNotisInteract.to', 1)
  );
  const [timeViewNotiFrom, setTimeViewNotiFrom] = useState(
    _.get(settingValues, 'timeViewNoti.from', 5)
  );
  const [timeViewNotiTo, setTimeViewNotiTo] = useState(
    _.get(settingValues, 'timeViewNoti.to', 10)
  );
  const [isInteractPost, setInteractPost] = useState(
    _.get(settingValues, 'isInteract', false)
  );
  const interactNotification = useMemo(() => {
    return {
      timeView: { from: timeViewFrom, to: timeViewTo },
      numNotisInteract: { from: numNotisInteractFrom, to: numNotisInteractTo },
      timeViewNoti: { from: timeViewNotiFrom, to: timeViewNotiTo },
      isInteract: isInteractPost,
    };
  }, [
    timeViewFrom,
    timeViewTo,
    numNotisInteractFrom,
    numNotisInteractTo,
    timeViewNotiFrom,
    timeViewNotiTo,
    isInteractPost,
  ]);

  const dispatch = useDispatch();
  useEffect(() => {
    if (!isTabActived) {
      dispatch(
        saveTmpSetting('scriptInteraction', {
          interactNotification,
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTabActived]);

  const valueRef = useRef();
  useEffect(() => {
    valueRef.current = { interactNotification };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interactNotification]);

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
          <span className="label-setting">
            Total time view notifications (Seconds)
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
          <span className="label-setting">
            Number of notifications want to view and interact
          </span>
        </Col>
        <Col>
          <InputNumber
            min={1}
            max={100000}
            defaultValue={numNotisInteractFrom}
            onChange={(value) => setNumNotisInteractFrom(value)}
          />
        </Col>
        <Col>
          <span style={{ padding: '0 5px 0 5px' }}>-</span>
        </Col>
        <Col>
          <InputNumber
            min={1}
            max={100000}
            defaultValue={numNotisInteractTo}
            onChange={(value) => setNumNotisInteractTo(value)}
          />
        </Col>
      </Row>
      <Row className="row-per-setting">
        <Col span={12}>
          <span className="label-setting">
            Time view 1 notification (Seconds)
          </span>
        </Col>
        <Col>
          <InputNumber
            min={1}
            max={100000}
            defaultValue={timeViewNotiFrom}
            onChange={(value) => setTimeViewNotiFrom(value)}
          />
        </Col>
        <Col>
          <span style={{ padding: '0 5px 0 5px' }}>-</span>
        </Col>
        <Col>
          <InputNumber
            min={1}
            max={100000}
            defaultValue={timeViewNotiTo}
            onChange={(value) => setTimeViewNotiTo(value)}
          />
        </Col>
      </Row>
      <Row className="row-per-setting">
        <Col span={12}>
          <span className="label-setting">Interact posts</span>
        </Col>
        <Col>
          <Checkbox
            checked={isInteractPost}
            onChange={(e: CheckboxChangeEvent) =>
              setInteractPost(e.target.checked)
            }
          >
            Random (Like, Love, Care, Wow)
          </Checkbox>
        </Col>
      </Row>
    </>
  );
};

export default ScriptInteractiveNotification;
