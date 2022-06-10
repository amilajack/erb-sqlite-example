/* eslint-disable react/jsx-props-no-spreading */
import {
  Button,
  Col,
  Divider,
  Row,
  Upload,
  Radio,
  Space,
  RadioChangeEvent,
  InputNumber,
  Checkbox,
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { saveTmpSetting } from 'features/feature-setting/reducers/setting.reducer';
import _ from 'lodash';
import { upsertSetting } from 'features/feature-setting/services/setting.service';

type Props = {
  isSaveSetting: boolean;
  feedFanpagelInteractionSetting: any;
};

const FeedFanpageInteractive: React.FC<Props> = ({
  isSaveSetting,
  feedFanpagelInteractionSetting,
}) => {
  const { tmpSetting } = useSelector((state) => _.get(state, 'settings', {}));
  const [idFanpagesFile, setIdFanpagesFile] = useState(
    _.isEmpty(_.get(feedFanpagelInteractionSetting, 'idFanpagesFile'))
      ? []
      : [_.get(feedFanpagelInteractionSetting, 'idFanpagesFile')]
  );
  const [viewType, setViewType] = useState(
    _.get(feedFanpagelInteractionSetting, 'runType.viewType', 'view_sequence')
  );
  const [numFanpage, setNumFanpage] = useState(
    _.get(feedFanpagelInteractionSetting, 'runType.numFanpage', 1)
  );
  const [viewTimeFrom, setViewTimeFrom] = useState(
    _.get(feedFanpagelInteractionSetting, 'runType.viewTime.from', 5)
  );
  const [viewTimeTo, setViewTimeTo] = useState(
    _.get(feedFanpagelInteractionSetting, 'runType.viewTime.to', 10)
  );
  const [isActionLike, setActionLike] = useState(
    _.get(feedFanpagelInteractionSetting, 'action.isActionLike', false)
  );
  const [isActionComment, setActionComment] = useState(
    _.get(feedFanpagelInteractionSetting, 'action.isActionComment', false)
  );
  const [isActionShareProfile, setActionShareProfile] = useState(
    _.get(feedFanpagelInteractionSetting, 'action.isActionShareProfile', false)
  );
  const [numShareGroup, setShareGroup] = useState(
    _.get(feedFanpagelInteractionSetting, 'action.numShareGroup', 1)
  );
  const [commentFile, setCommentFile] = useState(
    _.isEmpty(_.get(feedFanpagelInteractionSetting, 'comment.file'))
      ? []
      : [_.get(feedFanpagelInteractionSetting, 'comment.file')]
  );
  const [numThread, setNumThread] = useState(
    _.get(feedFanpagelInteractionSetting, 'comment.numThread', 1)
  );

  const feedFanpageInteraction = useMemo(() => {
    return {
      idFanpagesFile:
        idFanpagesFile.length > 0
          ? {
              uid: _.get(idFanpagesFile[0], 'uid'),
              name: _.get(idFanpagesFile[0], 'name'),
              path: _.get(idFanpagesFile[0], 'path'),
              size: _.get(idFanpagesFile[0], 'size'),
              type: _.get(idFanpagesFile[0], 'type'),
            }
          : '',
      runType: {
        viewType,
        numFanpage,
        viewTime: {
          from: viewTimeFrom,
          to: viewTimeTo,
        },
      },
      action: {
        isActionLike,
        isActionComment,
        isActionShareProfile,
        numShareGroup,
      },
      comment: {
        file:
          commentFile.length > 0
            ? {
                uid: _.get(commentFile[0], 'uid'),
                name: _.get(commentFile[0], 'name'),
                path: _.get(commentFile[0], 'path'),
                size: _.get(commentFile[0], 'size'),
                type: _.get(commentFile[0], 'type'),
              }
            : '',
        numThread,
      },
    };
  }, [
    idFanpagesFile,
    viewType,
    numFanpage,
    viewTimeFrom,
    viewTimeTo,
    isActionLike,
    isActionComment,
    isActionShareProfile,
    numShareGroup,
    commentFile,
    numThread,
  ]);

  const propsLinkPost = {
    accept: 'text/plain',
    onRemove: (file: any) => {
      const index = idFanpagesFile.indexOf(file);
      const newFileList = idFanpagesFile.slice();
      newFileList.splice(index, 1);
      setIdFanpagesFile(newFileList);
    },
    beforeUpload: (file: any) => {
      setIdFanpagesFile([file]);
      return false;
    },
    fileList: idFanpagesFile,
  };

  const propsComment = {
    accept: 'text/plain',
    onRemove: (file: any) => {
      const index = commentFile.indexOf(file);
      const newFileList = commentFile.slice();
      newFileList.splice(index, 1);
      setCommentFile(newFileList);
    },
    beforeUpload: (file: any) => {
      setCommentFile([file]);
      return false;
    },
    fileList: commentFile,
  };

  // why using ref value??? Because component will restore state from tmpSetting (which clone from setting data)
  const valueRef = useRef();
  const dispatch = useDispatch();
  useEffect(() => {
    valueRef.current = feedFanpageInteraction;
    dispatch(saveTmpSetting('feedFanpageInteraction', feedFanpageInteraction));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [feedFanpageInteraction]);

  useEffect(() => {
    if (isSaveSetting) {
      dispatch(upsertSetting(tmpSetting));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSaveSetting]);

  useEffect(() => {
    return () => {
      dispatch(saveTmpSetting('feedFanpageInteraction', valueRef.current));
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
        Tương tác nuôi fanpage
      </Divider>
      <Row>
        <Col span={9}>
          <span className="label-setting">File id fanpages</span>
          <br />
          <span style={{ fontStyle: 'italic' }}>
            (Select the fanpage file to interaction, one fanpage id per line.)
          </span>
        </Col>
        <Col>
          <Upload {...propsLinkPost}>
            <Button icon={<UploadOutlined />}>Select File</Button>
          </Upload>
        </Col>
      </Row>
      <Row className="row-per-setting">
        <Col span={9}>
          <span className="label-setting">Xem video kiểu</span>
        </Col>
        <Col span={12}>
          <Row>
            <Col>
              <Radio.Group
                defaultValue={viewType}
                onChange={(e: RadioChangeEvent) => setViewType(e.target.value)}
              >
                <Space>
                  <Radio value="view_sequence">Sequence</Radio>
                  <Radio value="view_random">Random</Radio>
                </Space>
              </Radio.Group>
            </Col>
          </Row>
          <Row className="row-per-setting">
            <Col style={{ padding: '3px 3px 0 0' }}>
              <span>fanpage</span>
            </Col>
            <Col>
              <InputNumber
                min={1}
                max={100000}
                defaultValue={numFanpage}
                onChange={(value) => setNumFanpage(value)}
              />
            </Col>
          </Row>
          <Row className="row-per-setting">
            <Col style={{ padding: '3px 3px 0 0' }}>
              <span>Time view page (s)</span>
            </Col>
            <Col>
              <InputNumber
                min={1}
                max={100000}
                defaultValue={viewTimeFrom}
                onChange={(value) => setViewTimeFrom(value)}
              />
            </Col>
            <Col>
              <span style={{ padding: '0 5px 0 5px' }}>-</span>
            </Col>
            <Col>
              <InputNumber
                min={1}
                max={100000}
                defaultValue={viewTimeTo}
                onChange={(value) => setViewTimeTo(value)}
              />
            </Col>
          </Row>
        </Col>
      </Row>
      <Row className="row-per-setting">
        <Col span={9}>
          <span className="label-setting">Actions/Page</span>
        </Col>
        <Col span={12}>
          <Row>
            <Checkbox
              checked={isActionLike}
              onChange={(e) => setActionLike(e.target.checked)}
            >
              Like Post
            </Checkbox>
          </Row>
          <Row className="row-per-setting">
            <Checkbox
              checked={isActionComment}
              onChange={(e) => setActionComment(e.target.checked)}
            >
              Comment
            </Checkbox>
          </Row>
          <Row className="row-per-setting">
            <Checkbox
              checked={isActionShareProfile}
              onChange={(e) => setActionShareProfile(e.target.checked)}
            >
              Share profile
            </Checkbox>
          </Row>
          <Row className="row-per-setting">
            <Col style={{ padding: '3px 3px 0 0' }}>
              <span>Share Group</span>
            </Col>
            <Col>
              <InputNumber
                min={1}
                max={100000}
                defaultValue={numShareGroup}
                onChange={(value) => setShareGroup(value)}
              />
            </Col>
          </Row>
        </Col>
      </Row>
      <Row className="row-per-setting">
        <Col span={9}>
          <span className="label-setting">File bình luận</span>
        </Col>
        <Col>
          <Row>
            <Col>
              <Upload {...propsComment}>
                <Button icon={<UploadOutlined />}>Select File</Button>
              </Upload>
            </Col>
            <Col style={{ padding: '3px 3px 0 0' }}>
              <span>Số luồng</span>
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
        </Col>
      </Row>
    </div>
  );
};

export default FeedFanpageInteractive;
