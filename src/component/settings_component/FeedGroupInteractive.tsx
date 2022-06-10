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
  feedGrouplInteractionSetting: any;
};

const FeedGroupInteractive: React.FC<Props> = ({
  isSaveSetting,
  feedGrouplInteractionSetting,
}) => {
  const { tmpSetting } = useSelector((state) => _.get(state, 'settings', {}));
  const [idGroupsFile, setIdGroupsFile] = useState(
    _.isEmpty(_.get(feedGrouplInteractionSetting, 'idGroupsFile'))
      ? []
      : [_.get(feedGrouplInteractionSetting, 'idGroupsFile')]
  );
  const [viewType, setViewType] = useState(
    _.get(feedGrouplInteractionSetting, 'runType.viewType', 'view_sequence')
  );
  const [numGroup, setNumGroup] = useState(
    _.get(feedGrouplInteractionSetting, 'runType.numGroup', 1)
  );
  const [viewTimeFrom, setViewTimeFrom] = useState(
    _.get(feedGrouplInteractionSetting, 'runType.viewTime.from', 5)
  );
  const [viewTimeTo, setViewTimeTo] = useState(
    _.get(feedGrouplInteractionSetting, 'runType.viewTime.to', 10)
  );
  const [isActionJoinGroup, setActionJoinGroup] = useState(
    _.get(feedGrouplInteractionSetting, 'action.isActionJoinGroup', false)
  );
  const [numLikePost, setNumLikePost] = useState(
    _.get(feedGrouplInteractionSetting, 'action.numLikePost', 1)
  );
  const [numComment, setNumComment] = useState(
    _.get(feedGrouplInteractionSetting, 'action.numComment', 1)
  );
  const [numShareProfile, setNumShareProfile] = useState(
    _.get(feedGrouplInteractionSetting, 'action.numShareProfile', 1)
  );
  const [numShareGroup, setShareGroup] = useState(
    _.get(feedGrouplInteractionSetting, 'action.numShareGroup', 1)
  );
  const [commentFile, setCommentFile] = useState(
    _.isEmpty(_.get(feedGrouplInteractionSetting, 'comment.file'))
      ? []
      : [_.get(feedGrouplInteractionSetting, 'comment.file')]
  );
  const [numThread, setNumThread] = useState(
    _.get(feedGrouplInteractionSetting, 'comment.numThread', 1)
  );

  const feedGroupInteraction = useMemo(() => {
    return {
      idGroupsFile:
        idGroupsFile.length > 0
          ? {
              uid: _.get(idGroupsFile[0], 'uid'),
              name: _.get(idGroupsFile[0], 'name'),
              path: _.get(idGroupsFile[0], 'path'),
              size: _.get(idGroupsFile[0], 'size'),
              type: _.get(idGroupsFile[0], 'type'),
            }
          : '',
      runType: {
        viewType,
        numGroup,
        viewTime: {
          from: viewTimeFrom,
          to: viewTimeTo,
        },
      },
      action: {
        isActionJoinGroup,
        numLikePost,
        numComment,
        numShareProfile,
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
    idGroupsFile,
    viewType,
    numGroup,
    viewTimeFrom,
    viewTimeTo,
    isActionJoinGroup,
    numLikePost,
    numComment,
    numShareProfile,
    numShareGroup,
    commentFile,
    numThread,
  ]);

  const propsLinkPost = {
    accept: 'text/plain',
    onRemove: (file: any) => {
      const index = idGroupsFile.indexOf(file);
      const newFileList = idGroupsFile.slice();
      newFileList.splice(index, 1);
      setIdGroupsFile(newFileList);
    },
    beforeUpload: (file: any) => {
      setIdGroupsFile([file]);
      return false;
    },
    fileList: idGroupsFile,
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
    valueRef.current = feedGroupInteraction;
    dispatch(saveTmpSetting('feedGroupInteraction', feedGroupInteraction));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [feedGroupInteraction]);

  useEffect(() => {
    if (isSaveSetting) {
      dispatch(upsertSetting(tmpSetting));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSaveSetting]);

  useEffect(() => {
    return () => {
      dispatch(saveTmpSetting('feedGroupInteraction', valueRef.current));
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
        Tương tác nuôi nhóm
      </Divider>
      <Row>
        <Col span={9}>
          <span className="label-setting">File id fanpages</span>
          <br />
          <span style={{ fontStyle: 'italic' }}>
            (Select the group file to interaction, one group id per line.)
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
              <span>group</span>
            </Col>
            <Col>
              <InputNumber
                min={1}
                max={100000}
                defaultValue={numGroup}
                onChange={(value) => setNumGroup(value)}
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
              checked={isActionJoinGroup}
              onChange={(e) => setActionJoinGroup(e.target.checked)}
            >
              Join Group
            </Checkbox>
          </Row>
          <Row className="row-per-setting">
            <Col style={{ padding: '3px 3px 0 0' }}>
              <span>Like post</span>
            </Col>
            <Col>
              <InputNumber
                min={1}
                max={100000}
                defaultValue={numLikePost}
                onChange={(value) => setNumLikePost(value)}
              />
            </Col>
          </Row>
          <Row className="row-per-setting">
            <Col style={{ padding: '3px 3px 0 0' }}>
              <span>Comment</span>
            </Col>
            <Col>
              <InputNumber
                min={1}
                max={100000}
                defaultValue={numComment}
                onChange={(value) => setNumComment(value)}
              />
            </Col>
          </Row>
          <Row className="row-per-setting">
            <Col style={{ padding: '3px 3px 0 0' }}>
              <span>Share profile</span>
            </Col>
            <Col>
              <InputNumber
                min={1}
                max={100000}
                defaultValue={numShareProfile}
                onChange={(value) => setNumShareProfile(value)}
              />
            </Col>
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

export default FeedGroupInteractive;
