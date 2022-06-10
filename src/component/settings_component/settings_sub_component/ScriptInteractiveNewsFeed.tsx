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

const ScriptInteractiveNewsFeed: React.FC<Props> = ({
  isTabActived,
  settingValues,
}) => {
  const [timeViewFrom, setTimeViewFrom] = useState(
    _.get(settingValues, 'timeView.from', 30)
  );
  const [timeViewTo, setTimeViewTo] = useState(
    _.get(settingValues, 'timeView.to', 60)
  );
  const [numPostsInteractFrom, setNumPostsInteractFrom] = useState(
    _.get(settingValues, 'numPostsInteract.from', 1)
  );
  const [numPostsInteractTo, setNumPostsInteractTo] = useState(
    _.get(settingValues, 'numPostsInteract.to', 1)
  );
  const [timeViewPostFrom, setTimeViewPostFrom] = useState(
    _.get(settingValues, 'timeViewPost.from', 5)
  );
  const [timeViewPostTo, setTimeViewPostTo] = useState(
    _.get(settingValues, 'timeViewPost.to', 10)
  );
  const [isInteractPost, setInteractPost] = useState(
    _.get(settingValues, 'isInteract', false)
  );
  const interactNewsFeed = useMemo(() => {
    return {
      timeView: { from: timeViewFrom, to: timeViewTo },
      numPostsInteract: { from: numPostsInteractFrom, to: numPostsInteractTo },
      timeViewPost: { from: timeViewPostFrom, to: timeViewPostTo },
      isInteract: isInteractPost,
    };
  }, [
    timeViewFrom,
    timeViewTo,
    numPostsInteractFrom,
    numPostsInteractTo,
    timeViewPostFrom,
    timeViewPostTo,
    isInteractPost,
  ]);

  const dispatch = useDispatch();
  useEffect(() => {
    if (!isTabActived) {
      dispatch(
        saveTmpSetting('scriptInteraction', {
          interactNewsFeed,
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTabActived]);

  const valueRef = useRef();
  useEffect(() => {
    valueRef.current = { interactNewsFeed };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interactNewsFeed]);

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
            Number of posts want to view and interact
          </span>
        </Col>
        <Col>
          <InputNumber
            min={1}
            max={100000}
            defaultValue={numPostsInteractFrom}
            onChange={(value) => setNumPostsInteractFrom(value)}
          />
        </Col>
        <Col>
          <span style={{ padding: '0 5px 0 5px' }}>-</span>
        </Col>
        <Col>
          <InputNumber
            min={1}
            max={100000}
            defaultValue={numPostsInteractTo}
            onChange={(value) => setNumPostsInteractTo(value)}
          />
        </Col>
      </Row>
      <Row className="row-per-setting">
        <Col span={12}>
          <span className="label-setting">Time view 1 post (Seconds)</span>
        </Col>
        <Col>
          <InputNumber
            min={1}
            max={100000}
            defaultValue={timeViewPostFrom}
            onChange={(value) => setTimeViewPostFrom(value)}
          />
        </Col>
        <Col>
          <span style={{ padding: '0 5px 0 5px' }}>-</span>
        </Col>
        <Col>
          <InputNumber
            min={1}
            max={100000}
            defaultValue={timeViewPostTo}
            onChange={(value) => setTimeViewPostTo(value)}
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

export default ScriptInteractiveNewsFeed;
