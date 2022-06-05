/* eslint-disable react/jsx-props-no-spreading */
import {
  Button,
  Col,
  Divider,
  Row,
  Upload,
  InputNumber,
  Checkbox,
  Input,
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { saveTmpSetting } from 'features/feature-setting/reducers/setting.reducer';
import _ from 'lodash';
import { upsertSetting } from 'features/feature-setting/services/setting.service';

type Props = {
  isSaveSetting: boolean;
  videoInteractionSetting: any;
};

const VideoInteractive: React.FC<Props> = ({
  isSaveSetting,
  videoInteractionSetting,
}) => {
  const { tmpSetting } = useSelector((state) => _.get(state, 'settings', {}));
  const [videoIdUrl, setVideoIdUrl] = useState(
    _.get(videoInteractionSetting, 'videoIdUrl', '')
  );
  const [viewTimeFrom, setViewTimeFrom] = useState(
    _.get(videoInteractionSetting, 'viewTime.from', 5)
  );
  const [viewTimeTo, setViewTimeTo] = useState(
    _.get(videoInteractionSetting, 'viewTime.to', 10)
  );
  const [isReactionLikeLove, setReactionLikeLove] = useState(
    _.get(videoInteractionSetting, 'reaction.isReactionLikeLove', false)
  );
  const [isReactionPostContent, setReactionPostContent] = useState(
    _.get(videoInteractionSetting, 'reaction.isReactionPostContent', false)
  );
  const [isReactionComment, setReactionComment] = useState(
    _.get(videoInteractionSetting, 'reaction.isReactionComment', false)
  );
  const [postContentFile, setPostContentFile] = useState(
    _.isEmpty(_.get(videoInteractionSetting, 'postContentFile'))
      ? []
      : [_.get(videoInteractionSetting, 'postContentFile')]
  );
  const [commentFile, setCommentFile] = useState(
    _.isEmpty(_.get(videoInteractionSetting, 'comment.file'))
      ? []
      : [_.get(videoInteractionSetting, 'comment.file')]
  );
  const [isShareProfile, setShareProfile] = useState(
    _.get(videoInteractionSetting, 'share.isShareProfile', false)
  );
  const [isShareGroup, setShareGroup] = useState(
    _.get(videoInteractionSetting, 'share.isShareGroup', false)
  );
  const [isShareNoApproval, setShareNoApproval] = useState(
    _.get(videoInteractionSetting, 'share.isShareNoApproval', false)
  );
  const [shareMember, setShareMember] = useState(
    _.get(videoInteractionSetting, 'share.shareMember', 1)
  );
  const [isShareNoMatchGroup, setShareNoMatchGroup] = useState(
    _.get(videoInteractionSetting, 'share.isShareNoMatchGroup', false)
  );
  const [numShareGroupAccount, setNumShareGroupAccount] = useState(
    _.get(videoInteractionSetting, 'share.numShareGroupAccount', 1)
  );
  const [totalShare, setTotalShare] = useState(
    _.get(videoInteractionSetting, 'share.totalShare', 1)
  );
  const [numThread, setNumThread] = useState(
    _.get(videoInteractionSetting, 'share.numThread', 1)
  );

  const livestreamInteraction = useMemo(() => {
    return {
      videoIdUrl,
      viewTime: {
        from: viewTimeFrom,
        to: viewTimeTo,
      },
      reaction: {
        isReactionLikeLove,
        isReactionPostContent,
        isReactionComment,
      },
      postContentFile:
        postContentFile.length > 0
          ? {
              uid: _.get(postContentFile[0], 'uid'),
              name: _.get(postContentFile[0], 'name'),
              path: _.get(postContentFile[0], 'path'),
              size: _.get(postContentFile[0], 'size'),
              type: _.get(postContentFile[0], 'type'),
            }
          : '',
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
      share: {
        isShareProfile,
        isShareGroup,
        isShareNoApproval,
        shareMember,
        isShareNoMatchGroup,
        numShareGroupAccount,
        totalShare,
        numThread,
      },
    };
  }, [
    commentFile,
    isReactionComment,
    isReactionLikeLove,
    isReactionPostContent,
    isShareGroup,
    isShareNoApproval,
    isShareNoMatchGroup,
    isShareProfile,
    numShareGroupAccount,
    numThread,
    postContentFile,
    shareMember,
    totalShare,
    videoIdUrl,
    viewTimeFrom,
    viewTimeTo,
  ]);

  const propsPostContent = {
    accept: 'text/plain',
    onRemove: (file: any) => {
      const index = postContentFile.indexOf(file);
      const newFileList = postContentFile.slice();
      newFileList.splice(index, 1);
      setPostContentFile(newFileList);
    },
    beforeUpload: (file: any) => {
      setPostContentFile([file]);
      return false;
    },
    fileList: postContentFile,
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
    valueRef.current = livestreamInteraction;
    dispatch(saveTmpSetting('livestreamInteraction', livestreamInteraction));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [livestreamInteraction]);

  useEffect(() => {
    if (isSaveSetting) {
      dispatch(upsertSetting(tmpSetting));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSaveSetting]);

  useEffect(() => {
    return () => {
      dispatch(saveTmpSetting('livestreamInteraction', valueRef.current));
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
        Tương tác Livestream
      </Divider>
      <Row>
        <Col span={3}>
          <span className="label-setting">Video (id or url)</span>
        </Col>
        <Col span={9}>
          <Input
            defaultValue={videoIdUrl}
            onChange={(e) => setVideoIdUrl(e.target.value)}
          />
        </Col>
      </Row>
      <Row className="row-per-setting">
        <Col span={3}>
          <span className="label-setting">View in (s)</span>
        </Col>
        <Col span={12}>
          <Row>
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
          <Row className="row-per-setting">
            <Checkbox
              checked={isReactionLikeLove}
              onChange={(e) => setReactionLikeLove(e.target.checked)}
            >
              Reaction(Like, love, ...)
            </Checkbox>
          </Row>
          <Row className="row-per-setting">
            <Checkbox
              checked={isReactionPostContent}
              onChange={(e) => setReactionPostContent(e.target.checked)}
            >
              Post content
            </Checkbox>
          </Row>
          <Row className="row-per-setting">
            <Checkbox
              checked={isReactionComment}
              onChange={(e) => setReactionComment(e.target.checked)}
            >
              Comment
            </Checkbox>
          </Row>
        </Col>
      </Row>
      <Row className="row-per-setting">
        <Col span={3}>
          <span className="label-setting">File post contents</span>
        </Col>
        <Col>
          <Upload {...propsPostContent}>
            <Button icon={<UploadOutlined />}>Select File</Button>
          </Upload>
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
          </Row>
        </Col>
      </Row>
      <Row className="row-per-setting">
        <Col span={3}>
          <span className="label-setting">Share</span>
        </Col>
        <Col span={12}>
          <Row>
            <Checkbox
              checked={isShareProfile}
              onChange={(e) => setShareProfile(e.target.checked)}
            >
              Profile
            </Checkbox>
          </Row>
          <Row className="row-per-setting">
            <Checkbox
              checked={isShareGroup}
              onChange={(e) => setShareGroup(e.target.checked)}
            >
              Group
            </Checkbox>
          </Row>
          <Row className="row-per-setting">
            <Checkbox
              checked={isShareNoApproval}
              onChange={(e) => setShareNoApproval(e.target.checked)}
            >
              No approval
            </Checkbox>
          </Row>
          <Row className="row-per-setting">
            <Col style={{ padding: '3px 3px 0 0' }}>
              <span>Member {'>'} </span>
            </Col>
            <Col>
              <InputNumber
                min={1}
                max={100000}
                defaultValue={shareMember}
                onChange={(value) => setShareMember(value)}
              />
            </Col>
          </Row>
          <Row className="row-per-setting">
            <Checkbox
              checked={isShareNoApproval}
              onChange={(e) => setShareNoApproval(e.target.checked)}
            >
              No approval
            </Checkbox>
          </Row>
          <Row className="row-per-setting">
            <Col>
              <Checkbox
                checked={isShareNoMatchGroup}
                onChange={(e) => setShareNoMatchGroup(e.target.checked)}
              >
                Share if no match group
              </Checkbox>
            </Col>
          </Row>
          <Row className="row-per-setting">
            <Col style={{ padding: '3px 3px 0 0' }}>
              <span>Group/Account</span>
            </Col>
            <Col>
              <InputNumber
                min={1}
                max={100000}
                defaultValue={numShareGroupAccount}
                onChange={(value) => setNumShareGroupAccount(value)}
              />
            </Col>
          </Row>
          <Row className="row-per-setting">
            <Col style={{ padding: '3px 3px 0 0' }}>
              <span>Total share</span>
            </Col>
            <Col>
              <InputNumber
                min={1}
                max={100000}
                defaultValue={totalShare}
                onChange={(value) => setTotalShare(value)}
              />
            </Col>
          </Row>
          <Row className="row-per-setting">
            <Col style={{ padding: '3px 3px 0 0' }}>
              <span>Thread</span>
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

export default VideoInteractive;
