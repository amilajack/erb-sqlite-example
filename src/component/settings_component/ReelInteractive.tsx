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
  reelInteractionSetting: any;
};

const ReelInteractive: React.FC<Props> = ({
  isSaveSetting,
  reelInteractionSetting,
}) => {
  const { tmpSetting } = useSelector((state) => _.get(state, 'settings', {}));
  const [linkVideoFile, setLinkVideoFile] = useState(
    _.isEmpty(_.get(reelInteractionSetting, 'linkVideoFile'))
      ? []
      : [_.get(reelInteractionSetting, 'linkVideoFile')]
  );
  const [viewType, setViewType] = useState(
    _.get(reelInteractionSetting, 'viewReel.viewType', 'view_sequence')
  );
  const [numVideo, setNumVideo] = useState(
    _.get(reelInteractionSetting, 'viewReel.numVideo', 1)
  );
  const [viewTimeFrom, setViewTimeFrom] = useState(
    _.get(reelInteractionSetting, 'viewReel.viewTime.from', 5)
  );
  const [viewTimeTo, setViewTimeTo] = useState(
    _.get(reelInteractionSetting, 'viewReel.viewTime.to', 10)
  );
  const [isActionLike, setActionLike] = useState(
    _.get(reelInteractionSetting, 'action.isActionLike', false)
  );
  const [isActionComment, setActionComment] = useState(
    _.get(reelInteractionSetting, 'action.isActionComment', false)
  );
  const [isActionShareProfile, setActionShareProfile] = useState(
    _.get(reelInteractionSetting, 'action.isActionShareProfile', false)
  );
  const [numShareGroup, setShareGroup] = useState(
    _.get(reelInteractionSetting, 'action.numShareGroup', 0)
  );
  const [commentFile, setCommentFile] = useState(
    _.isEmpty(_.get(reelInteractionSetting, 'comment.file'))
      ? []
      : [_.get(reelInteractionSetting, 'comment.file')]
  );
  const [numThread, setNumThread] = useState(
    _.get(reelInteractionSetting, 'comment.numThread', 1)
  );

  const reelInteraction = useMemo(() => {
    return {
      linkVideoFile:
        linkVideoFile.length > 0
          ? {
              uid: _.get(linkVideoFile[0], 'uid'),
              name: _.get(linkVideoFile[0], 'name'),
              path: _.get(linkVideoFile[0], 'path'),
              size: _.get(linkVideoFile[0], 'size'),
              type: _.get(linkVideoFile[0], 'type'),
            }
          : '',
      viewReel: {
        viewType,
        numVideo,
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
    linkVideoFile,
    viewType,
    numVideo,
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
      const index = linkVideoFile.indexOf(file);
      const newFileList = linkVideoFile.slice();
      newFileList.splice(index, 1);
      setLinkVideoFile(newFileList);
    },
    beforeUpload: (file: any) => {
      setLinkVideoFile([file]);
      return false;
    },
    fileList: linkVideoFile,
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
    valueRef.current = reelInteraction;
    dispatch(saveTmpSetting('reelInteraction', reelInteraction));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reelInteraction]);

  useEffect(() => {
    if (isSaveSetting) {
      dispatch(upsertSetting(tmpSetting));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSaveSetting]);

  useEffect(() => {
    return () => {
      dispatch(saveTmpSetting('reelInteraction', valueRef.current));
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
        Tương tác thước phim
      </Divider>
      <Row>
        <Col span={3}>
          <span className="label-setting">Link bài viết</span>
        </Col>
        <Col>
          <Upload {...propsLinkPost}>
            <Button icon={<UploadOutlined />}>Select File</Button>
          </Upload>
        </Col>
      </Row>
      <Row className="row-per-setting">
        <Col span={3}>
          <span className="label-setting">Xem video kiểu</span>
        </Col>
        <Col span={12}>
          <Row className="row-per-setting">
            <Col>
              <Radio.Group
                defaultValue={viewType}
                onChange={(e: RadioChangeEvent) => setViewType(e.target.value)}
              >
                <Space>
                  <Radio value="view_sequence">Lần lượt</Radio>
                  <Radio value="view_random">Ngẫu nhiên</Radio>
                </Space>
              </Radio.Group>
            </Col>
          </Row>
          <Row className="row-per-setting">
            <Col style={{ padding: '3px 3px 0 0' }}>
              <span>bài viết</span>
            </Col>
            <Col>
              <InputNumber
                min={1}
                max={100000}
                defaultValue={numVideo}
                onChange={(value) => setNumVideo(value)}
              />
            </Col>
          </Row>
          <Row className="row-per-setting">
            <Col style={{ padding: '3px 3px 0 0' }}>
              <span>Thời gian xem (s)</span>
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
        <Col span={3}>
          <span className="label-setting">Tương tác</span>
        </Col>
        <Col span={12}>
          <Row>
            <Checkbox
              checked={isActionLike}
              onChange={(e) => setActionLike(e.target.checked)}
            >
              Like
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
                min={0}
                max={100000}
                defaultValue={numShareGroup}
                onChange={(value) => setShareGroup(value)}
              />
            </Col>
          </Row>
        </Col>
      </Row>
      <Row className="row-per-setting">
        <Col span={3}>
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

export default ReelInteractive;
