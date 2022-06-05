import { Row, Col, InputNumber, Button } from 'antd';
import { saveTmpSetting } from 'features/feature-setting/reducers/setting.reducer';
import { upsertSetting } from 'features/feature-setting/services/setting.service';
import _ from 'lodash';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';

type Props = {
  isTabActived: boolean;
  settingValues: any;
};

const ScriptInteractiveSettings: React.FC<Props> = ({
  isTabActived,
  settingValues,
}) => {
  const [timeWaitLoopFrom, setTimeWaitLoopFrom] = useState(
    _.get(settingValues, 'timeWaitLoop.from', 30)
  );
  const [timeWaitLoopTo, setTimeWaitLoopTo] = useState(
    _.get(settingValues, 'timeWaitLoop.to', 60)
  );
  const [iaCtrRateClick, setIaCtrRateClick] = useState(
    _.get(settingValues, 'iaCtrRateClick', 50)
  );

  const settings = useMemo(() => {
    return {
      timeWaitLoop: { from: timeWaitLoopFrom, to: timeWaitLoopTo },
      iaCtrRateClick,
    };
  }, [timeWaitLoopFrom, timeWaitLoopTo, iaCtrRateClick]);

  const dispatch = useDispatch();
  useEffect(() => {
    if (!isTabActived) {
      dispatch(
        saveTmpSetting('scriptInteraction', {
          settings,
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTabActived]);

  const valueRef = useRef();
  useEffect(() => {
    valueRef.current = { settings };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings]);

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
          <span className="label-setting">Time wait loop (Minutes)</span>
        </Col>
        <Col>
          <InputNumber
            min={1}
            max={100000}
            value={timeWaitLoopFrom}
            onChange={(value) => setTimeWaitLoopFrom(value)}
          />
        </Col>
        <Col>
          <span style={{ padding: '0 5px 0 5px' }}>-</span>
        </Col>
        <Col>
          <InputNumber
            min={1}
            max={100000}
            value={timeWaitLoopTo}
            onChange={(value) => setTimeWaitLoopTo(value)}
          />
        </Col>
      </Row>
      <Row className="row-per-setting">
        <Col span={12}>
          <span className="label-setting">IA CTR Rate Click</span> (Tỉ lệ % nhấn
          xem quảng cáo / số quảng cáo được hiển thị)
        </Col>
        <Col span={12}>
          <InputNumber
            min={1}
            max={100}
            value={iaCtrRateClick}
            formatter={(value) => `${value}%`}
            parser={(value: string) => value.replace('%', '')}
            onChange={(value) => setIaCtrRateClick(value)}
          />
        </Col>
      </Row>
    </>
  );
};

export default ScriptInteractiveSettings;
