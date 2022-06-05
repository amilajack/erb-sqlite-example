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

const ScriptInteractiveVideo: React.FC<Props> = ({
  isTabActived,
  settingValues,
}) => {
  const [timeViewFrom, setTimeViewFrom] = useState(
    _.get(settingValues, 'timeView.from', 30)
  );
  const [timeViewTo, setTimeViewTo] = useState(
    _.get(settingValues, 'timeView.to', 60)
  );
  const [numVideosInteractFrom, setNumVideosInteractFrom] = useState(
    _.get(settingValues, 'numVideosInteract.from', 1)
  );
  const [numVideosInteractTo, setNumVideosInteractTo] = useState(
    _.get(settingValues, 'numVideosInteract.to', 1)
  );
  const [timeViewVideoFrom, setTimeViewVideoFrom] = useState(
    _.get(settingValues, 'timeViewVideo.from', 5)
  );
  const [timeViewVideoTo, setTimeViewVideoTo] = useState(
    _.get(settingValues, 'timeViewVideo.to', 10)
  );
  const [isInteractFollowFanPg, setInteractFollowFanPg] = useState(
    _.get(settingValues, 'isInteract.followFanPg', false)
  );
  const [isInteractRandomAct, setInteractRandomAct] = useState(
    _.get(settingValues, 'isInteract.randomAct', false)
  );
  const interactVideo = useMemo(() => {
    return {
      timeView: { from: timeViewFrom, to: timeViewTo },
      numVideosInteract: {
        from: numVideosInteractFrom,
        to: numVideosInteractTo,
      },
      timeViewVideo: { from: timeViewVideoFrom, to: timeViewVideoTo },
      isInteract: {
        followFanPg: isInteractFollowFanPg,
        randomAct: isInteractRandomAct,
      },
    };
  }, [
    timeViewFrom,
    timeViewTo,
    numVideosInteractFrom,
    numVideosInteractTo,
    timeViewVideoFrom,
    timeViewVideoTo,
    isInteractFollowFanPg,
    isInteractRandomAct,
  ]);

  const dispatch = useDispatch();
  useEffect(() => {
    if (!isTabActived) {
      dispatch(
        saveTmpSetting('scriptInteraction', {
          interactVideo,
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTabActived]);

  const valueRef = useRef();
  useEffect(() => {
    valueRef.current = { interactVideo };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interactVideo]);

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
          <span className="label-setting">Total time view (Seconds)</span>
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
            Number of videos want to view and interact
          </span>
        </Col>
        <Col>
          <InputNumber
            min={1}
            max={100000}
            defaultValue={numVideosInteractFrom}
            onChange={(value) => setNumVideosInteractFrom(value)}
          />
        </Col>
        <Col>
          <span style={{ padding: '0 5px 0 5px' }}>-</span>
        </Col>
        <Col>
          <InputNumber
            min={1}
            max={100000}
            defaultValue={numVideosInteractTo}
            onChange={(value) => setNumVideosInteractTo(value)}
          />
        </Col>
      </Row>
      <Row className="row-per-setting">
        <Col span={12}>
          <span className="label-setting">Time view 1 video (Seconds)</span>
        </Col>
        <Col>
          <InputNumber
            min={1}
            max={100000}
            defaultValue={timeViewVideoFrom}
            onChange={(value) => setTimeViewVideoFrom(value)}
          />
        </Col>
        <Col>
          <span style={{ padding: '0 5px 0 5px' }}>-</span>
        </Col>
        <Col>
          <InputNumber
            min={1}
            max={100000}
            defaultValue={timeViewVideoTo}
            onChange={(value) => setTimeViewVideoTo(value)}
          />
        </Col>
      </Row>
      <Row className="row-per-setting">
        <Col span={12}>
          <span className="label-setting">Interact videos</span>
        </Col>
        <Col>
          <Checkbox
            checked={isInteractFollowFanPg}
            onChange={(e: CheckboxChangeEvent) =>
              setInteractFollowFanPg(e.target.checked)
            }
          >
            Random follow fanpage
          </Checkbox>
        </Col>
        <Col>
          <Checkbox
            checked={isInteractRandomAct}
            onChange={(e: CheckboxChangeEvent) =>
              setInteractRandomAct(e.target.checked)
            }
          >
            Random (Like, Love, Care, Wow)
          </Checkbox>
        </Col>
      </Row>
    </>
  );
};

export default ScriptInteractiveVideo;
