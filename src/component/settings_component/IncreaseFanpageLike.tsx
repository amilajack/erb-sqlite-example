
/* eslint-disable react/jsx-props-no-spreading */
import { Input, Col, Divider, Row, InputNumber } from 'antd';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { saveTmpSetting } from 'features/feature-setting/reducers/setting.reducer';
import _ from 'lodash';
import { upsertSetting } from 'features/feature-setting/services/setting.service';

type Props = {
  isSaveSetting: boolean;
  increaseFanpageLikeSetting: any;
};

const IncreaseFanpageLike: React.FC<Props> = ({
  isSaveSetting,
  increaseFanpageLikeSetting,
}) => {
  const { tmpSetting } = useSelector((state) => _.get(state, 'settings', {}));
  const [fanpageId, setFanpageId] = useState(
    _.get(increaseFanpageLikeSetting, 'fanpageId', '')
  );
  const [timeWaitFrom, setTimeWaitFrom] = useState(
    _.get(increaseFanpageLikeSetting, 'timeWait.from', 5)
  );
  const [timeWaitTo, setTimeWaitTo] = useState(
    _.get(increaseFanpageLikeSetting, 'timeWait.to', 10)
  );
  const [total, setTotal] = useState(
    _.get(increaseFanpageLikeSetting, 'total', 1)
  );
  const [numThread, setNumThread] = useState(
    _.get(increaseFanpageLikeSetting, 'numThread', 1)
  );

  const increaseFanpageLike = useMemo(() => {
    return {
      fanpageId,
      timeWait: {
        from: timeWaitFrom,
        to: timeWaitTo,
      },
      total,
      numThread,
    };
  }, [fanpageId, timeWaitFrom, timeWaitTo, total, numThread]);

  const valueRef = useRef();
  const dispatch = useDispatch();
  useEffect(() => {
    valueRef.current = increaseFanpageLike;
    dispatch(saveTmpSetting('increaseFanpageLike', increaseFanpageLike));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [increaseFanpageLike]);

  useEffect(() => {
    if (isSaveSetting) {
      dispatch(upsertSetting(tmpSetting));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSaveSetting]);

  useEffect(() => {
    return () => {
      dispatch(saveTmpSetting('increaseFanpageLike', valueRef.current));
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
        Tăng like fanpage
      </Divider>
      <Row>
        <Col span={3}>
          <span className="label-setting">Fanpage ID</span>
        </Col>
        <Col span={9}>
          <Input
            defaultValue={fanpageId}
            onChange={(e) => setFanpageId(e.target.value)}
          />
        </Col>
      </Row>
      <Row className="row-per-setting">
        <Col span={3}>
          <span className="label-setting">Time wait(s)</span>
        </Col>
        <Col>
          <InputNumber
            min={1}
            max={100000}
            defaultValue={timeWaitFrom}
            onChange={(value) => setTimeWaitFrom(value)}
          />
        </Col>
        <Col>
          <span style={{ padding: '0 5px 0 5px' }}>-</span>
        </Col>
        <Col>
          <InputNumber
            min={1}
            max={100000}
            defaultValue={timeWaitTo}
            onChange={(value) => setTimeWaitTo(value)}
          />
        </Col>
      </Row>
      <Row className="row-per-setting">
        <Col span={3}>
          <span className="label-setting">Total</span>
        </Col>
        <Col>
          <InputNumber
            min={1}
            max={100000}
            defaultValue={total}
            onChange={(value) => setTotal(value)}
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

export default IncreaseFanpageLike;
