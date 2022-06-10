/* eslint-disable react/jsx-props-no-spreading */
import { Row, Col, InputNumber, Checkbox, Upload, Button, Divider } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { saveTmpSetting } from 'features/feature-setting/reducers/setting.reducer';
import _ from 'lodash';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';

type Props = {
  isTabActived: boolean;
  settingValues: any;
};

const ScriptInteractiveInsArtNavPost: React.FC<Props> = ({
  isTabActived,
  settingValues,
}) => {
  const [numPostsViewFrom, setNumPostsViewFrom] = useState(
    _.get(settingValues, 'numPostsView.from', 1)
  );
  const [numPostsViewTo, setNumPostsViewTo] = useState(
    _.get(settingValues, 'numPostsView.to', 1)
  );
  const [timeViewPostFrom, setTimeViewPostFrom] = useState(
    _.get(settingValues, 'timeViewPost.from', 30)
  );
  const [timeViewPostTo, setTimeViewPostTo] = useState(
    _.get(settingValues, 'timeViewPost.to', 60)
  );
  const [timeViewAdsFrom, setTimeViewAdsFrom] = useState(
    _.get(settingValues, 'timeViewAds.from', 30)
  );
  const [timeViewAdsTo, setTimeViewAdsTo] = useState(
    _.get(settingValues, 'timeViewAds.to', 60)
  );
  const [isRandomAction, setRandomAction] = useState(
    _.get(settingValues, 'actions.isRandomAction', false)
  );
  const [isActionLikeLove, setActionLikeLove] = useState(
    _.get(settingValues, 'actions.isActionLikeLove', false)
  );
  const [isActionComment, setActionComment] = useState(
    _.get(settingValues, 'actions.isActionComment', false)
  );
  const [isShareProfile, setShareProfile] = useState(
    _.get(settingValues, 'share.isShareProfile', false)
  );
  const [isShareNumGroup, setShareNumGroup] = useState(
    _.get(settingValues, 'share.isShareNumGroup', false)
  );
  const [shareNumGroup, setNumGroup] = useState(
    _.get(settingValues, 'share.shareNumGroup', 1)
  );
  const [isShareNoApproved, setShareNoApproved] = useState(
    _.get(settingValues, 'share.isShareNoApproved', false)
  );
  const [shareMember, setShareMember] = useState(
    _.get(settingValues, 'share.shareMember', 1)
  );
  const [isShareNoMatchGroup, setShareNoMatchGroup] = useState(
    _.get(settingValues, 'share.isShareNoMatchGroup', false)
  );
  const [linkPostFile, setLinkPostFile] = useState(
    _.isEmpty(_.get(settingValues, 'linkPostFile'))
      ? []
      : [_.get(settingValues, 'linkPostFile')]
  );
  const [commentFile, setCommentFile] = useState(
    _.isEmpty(_.get(settingValues, 'commentFile'))
      ? []
      : [_.get(settingValues, 'commentFile')]
  );
  const insArtNavPosts = useMemo(() => {
    return {
      linkPostFile:
        linkPostFile.length > 0
          ? {
              uid: _.get(linkPostFile[0], 'uid'),
              name: _.get(linkPostFile[0], 'name'),
              path: _.get(linkPostFile[0], 'path'),
              size: _.get(linkPostFile[0], 'size'),
              type: _.get(linkPostFile[0], 'type'),
            }
          : '',
      commentFile:
        commentFile.length > 0
          ? {
              uid: _.get(commentFile[0], 'uid'),
              name: _.get(commentFile[0], 'name'),
              path: _.get(commentFile[0], 'path'),
              size: _.get(commentFile[0], 'size'),
              type: _.get(commentFile[0], 'type'),
            }
          : '',
      numPostsView: {
        from: numPostsViewFrom,
        to: numPostsViewTo,
      },
      timeViewPost: {
        from: timeViewPostFrom,
        to: timeViewPostTo,
      },
      timeViewAds: {
        from: timeViewAdsFrom,
        to: timeViewAdsTo,
      },
      actions: {
        isRandomAction,
        isActionLikeLove,
        isActionComment,
      },
      share: {
        isShareProfile,
        isShareNumGroup,
        shareNumGroup,
        isShareNoApproved,
        shareMember,
        isShareNoMatchGroup,
      },
    };
  }, [
    linkPostFile,
    commentFile,
    numPostsViewFrom,
    numPostsViewTo,
    timeViewPostFrom,
    timeViewPostTo,
    timeViewAdsFrom,
    timeViewAdsTo,
    isRandomAction,
    isActionLikeLove,
    isActionComment,
    isShareProfile,
    isShareNumGroup,
    shareNumGroup,
    isShareNoApproved,
    shareMember,
    isShareNoMatchGroup,
  ]);
  const dispatch = useDispatch();
  useEffect(() => {
    if (!isTabActived) {
      dispatch(
        saveTmpSetting('scriptInteraction', {
          insArtNavPosts,
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTabActived]);

  const valueRef = useRef();
  useEffect(() => {
    valueRef.current = { insArtNavPosts };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [insArtNavPosts]);

  useEffect(() => {
    return () => {
      if (!isTabActived) {
        return;
      }
      dispatch(saveTmpSetting('scriptInteraction', valueRef.current));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const propsLinkPost = {
    accept: 'text/plain',
    onRemove: (file: any) => {
      const index = linkPostFile.indexOf(file);
      const newFileList = linkPostFile.slice();
      newFileList.splice(index, 1);
      setLinkPostFile(newFileList);
    },
    beforeUpload: (file: any) => {
      setLinkPostFile([file]);
      return false;
    },
    fileList: linkPostFile,
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
  return (
    <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
      <Row>
        <Col span={12}>
          <span className="label-setting">Link posts</span>
        </Col>
        <Col>
          <Upload {...propsLinkPost}>
            <Button icon={<UploadOutlined />}>Select File</Button>
          </Upload>
        </Col>
      </Row>
      <Row className="row-per-setting">
        <Col span={12}>
          <span className="label-setting">Number post view</span>
        </Col>
        <Col>
          <InputNumber
            min={1}
            max={100000}
            defaultValue={numPostsViewFrom}
            onChange={(value) => setNumPostsViewFrom(value)}
          />
        </Col>
        <Col>
          <span style={{ padding: '0 5px 0 5px' }}>-</span>
        </Col>
        <Col>
          <InputNumber
            min={1}
            max={100000}
            defaultValue={numPostsViewTo}
            onChange={(value) => setNumPostsViewTo(value)}
          />
        </Col>
      </Row>
      <Row className="row-per-setting">
        <Col span={12}>
          <span className="label-setting">Time view post (Seconds)</span>
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
      <Divider />
      <Row className="row-per-setting">
        <Col span={12}>
          <span className="label-setting">Time view ads (Seconds)</span>
        </Col>
        <Col>
          <InputNumber
            min={1}
            max={100000}
            defaultValue={timeViewAdsFrom}
            onChange={(value) => setTimeViewAdsFrom(value)}
          />
        </Col>
        <Col>
          <span style={{ padding: '0 5px 0 5px' }}>-</span>
        </Col>
        <Col>
          <InputNumber
            min={1}
            max={100000}
            defaultValue={timeViewAdsTo}
            onChange={(value) => setTimeViewAdsTo(value)}
          />
        </Col>
      </Row>
      <Divider />
      <Row className="row-per-setting">
        <Col span={12}>
          <span className="label-setting">Actions</span>
        </Col>
        <Col>
          <Checkbox
            checked={isRandomAction}
            onChange={(e) => setRandomAction(e.target.checked)}
          >
            Random action (Yes or No random action selected)
          </Checkbox>
        </Col>
      </Row>
      <Row className="row-per-setting">
        <Col span={12} />
        <Col>
          <Checkbox
            checked={isActionLikeLove}
            onChange={(e) => setActionLikeLove(e.target.checked)}
          >
            Like, Love...
          </Checkbox>
        </Col>
      </Row>
      <Row className="row-per-setting">
        <Col span={12} />
        <Col>
          <Checkbox
            checked={isActionComment}
            onChange={(e) => setActionComment(e.target.checked)}
          >
            Comment
          </Checkbox>
        </Col>
      </Row>
      <Row className="row-per-setting">
        <Col span={12}>
          <span className="label-setting">Comments</span>
        </Col>
        <Col>
          <Upload {...propsComment}>
            <Button icon={<UploadOutlined />}>Select File</Button>
          </Upload>
        </Col>
      </Row>
      <Row className="row-per-setting">
        <Col span={12}>
          <span className="label-setting">Share</span>
        </Col>
        <Col>
          <Checkbox
            checked={isShareProfile}
            onChange={(e) => setShareProfile(e.target.checked)}
          >
            Profile
          </Checkbox>
        </Col>
      </Row>
      <Row className="row-per-setting">
        <Col span={12} />
        <Col style={{ padding: '3px 3px 0 0' }}>
          <Checkbox
            checked={isShareNumGroup}
            onChange={(e: CheckboxChangeEvent) =>
              setShareNumGroup(e.target.checked)
            }
          >
            Groups
          </Checkbox>
        </Col>
        <Col>
          <InputNumber
            min={1}
            max={100000}
            defaultValue={shareNumGroup}
            onChange={(value) => setNumGroup(value)}
          />
        </Col>
      </Row>
      <Row className="row-per-setting">
        <Col span={12} />
        <Col>
          <Checkbox
            checked={isShareNoApproved}
            onChange={(e) => setShareNoApproved(e.target.checked)}
          >
            No approved
          </Checkbox>
        </Col>
      </Row>
      <Row className="row-per-setting">
        <Col span={12} />
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
        <Col span={12} />
        <Col>
          <Checkbox
            checked={isShareNoMatchGroup}
            onChange={(e) => setShareNoMatchGroup(e.target.checked)}
          >
            Share if no match group
          </Checkbox>
        </Col>
      </Row>
    </div>
  );
};

export default ScriptInteractiveInsArtNavPost;
