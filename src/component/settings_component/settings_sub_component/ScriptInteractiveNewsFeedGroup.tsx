/* eslint-disable react/jsx-props-no-spreading */
import { Row, Col, InputNumber, Checkbox, Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { saveTmpSetting } from 'features/feature-setting/reducers/setting.reducer';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import _ from 'lodash';

type Props = {
  isTabActived: boolean;
  settingValues: any;
};

const ScriptInteractiveNewsFeedGroup: React.FC<Props> = ({
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
  const [isInteractPost, setInteractPost] = useState(
    _.get(settingValues, 'isInteract', false)
  );
  const [fileList, setFileList] = useState(
    _.isEmpty(_.get(settingValues, 'commentFile'))
      ? []
      : [_.get(settingValues, 'commentFile')]
  );
  const interactNewsFeedGroup = useMemo(() => {
    return {
      timeView: { from: timeViewFrom, to: timeViewTo },
      numPostsInteract: { from: numPostsInteractFrom, to: numPostsInteractTo },
      isInteract: isInteractPost,
      commentFile:
        fileList.length > 0
          ? {
              uid: _.get(fileList[0], 'uid'),
              name: _.get(fileList[0], 'name'),
              path: _.get(fileList[0], 'path'),
              size: _.get(fileList[0], 'size'),
              type: _.get(fileList[0], 'type'),
            }
          : '',
    };
  }, [
    timeViewFrom,
    timeViewTo,
    numPostsInteractFrom,
    numPostsInteractTo,
    isInteractPost,
    fileList,
  ]);
  const dispatch = useDispatch();
  useEffect(() => {
    if (!isTabActived) {
      dispatch(
        saveTmpSetting('scriptInteraction', {
          interactNewsFeedGroup,
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTabActived]);

  const valueRef = useRef();
  useEffect(() => {
    valueRef.current = { interactNewsFeedGroup };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interactNewsFeedGroup]);

  useEffect(() => {
    return () => {
      if (!isTabActived) {
        return;
      }
      dispatch(saveTmpSetting('scriptInteraction', valueRef.current));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const props = {
    accept: 'text/plain',
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      console.log('file', file);
      setFileList([file]);
      return false;
    },
    fileList,
  };
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
            Number of posts want to like and comment
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
          <span className="label-setting">Interact posts</span>
        </Col>
        <Col>
          <Checkbox
            checked={isInteractPost}
            onChange={(e: CheckboxChangeEvent) =>
              setInteractPost(e.target.checked)
            }
          >
            Random action
          </Checkbox>
        </Col>
      </Row>
      <Row className="row-per-setting">
        <Col span={12}>
          <span className="label-setting">Comment file</span>
        </Col>
        <Col>
          <Upload {...props}>
            <Button icon={<UploadOutlined />}>Select File</Button>
          </Upload>
        </Col>
      </Row>
    </>
  );
};

export default ScriptInteractiveNewsFeedGroup;
