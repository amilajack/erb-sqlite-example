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
  postInteractionSetting: any;
};

const PostInteractive: React.FC<Props> = ({
  isSaveSetting,
  postInteractionSetting,
}) => {
  const { tmpSetting } = useSelector((state) => _.get(state, 'settings', {}));
  const [urlPost, setUrlPost] = useState(
    _.get(postInteractionSetting, 'urlPost')
  );
  const [viewTimeFrom, setViewTimeFrom] = useState(
    _.get(postInteractionSetting, 'viewTime.from', 5)
  );
  const [viewTimeTo, setViewTimeTo] = useState(
    _.get(postInteractionSetting, 'viewTime.to', 10)
  );
  const [isActionLike, setActionLike] = useState(
    _.get(postInteractionSetting, 'action.isActionLike', false)
  );
  const [isActionComment, setActionComment] = useState(
    _.get(postInteractionSetting, 'action.isActionComment', false)
  );
  const [isActionShareProfile, setActionShareProfile] = useState(
    _.get(postInteractionSetting, 'action.isActionShareProfile', false)
  );
  const [commentFile, setCommentFile] = useState(
    _.isEmpty(_.get(postInteractionSetting, 'comment.file'))
      ? []
      : [_.get(postInteractionSetting, 'comment.file')]
  );
  const [numThread, setNumThread] = useState(
    _.get(postInteractionSetting, 'numThread', 1)
  );

  const postInteraction = useMemo(() => {
    return {
      urlPost,
      viewTime: {
        from: viewTimeFrom,
        to: viewTimeTo,
      },
      action: {
        isActionLike,
        isActionComment,
        isActionShareProfile,
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
    urlPost,
    viewTimeFrom,
    viewTimeTo,
    isActionLike,
    isActionComment,
    isActionShareProfile,
    commentFile,
    numThread,
  ]);

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
    valueRef.current = postInteraction;
    dispatch(saveTmpSetting('postInteraction', postInteraction));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postInteraction]);

  useEffect(() => {
    if (isSaveSetting) {
      dispatch(upsertSetting(tmpSetting));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSaveSetting]);

  useEffect(() => {
    return () => {
      dispatch(saveTmpSetting('postInteraction', valueRef.current));
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
        Tương tác bài viết
      </Divider>
      <Row>
        <Col span={12}>
          <span className="label-setting">Url post</span>
        </Col>
        <Col span={9}>
          <Input
            defaultValue={urlPost}
            onChange={(e) => setUrlPost(e.target.value)}
            placeholder="Enter the facebook post id"
          />
        </Col>
      </Row>
      <Row className="row-per-setting">
        <Col span={12}>
          <span className="label-setting">Comment</span>
          <br />
          <span style={{ fontStyle: 'italic' }}>
            (1 comment per line spin &#123;content 1|content 2|content
            n...&#125; [r] random emoji [c], [C] ramdom charactor, [datetime]
            get current datetime)
          </span>
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
        <Col span={12}>
          <span className="label-setting">View post (s)</span>
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
        </Col>
      </Row>
      <Row className="row-per-setting">
        <Col span={12}>
          <span className="label-setting">Actions</span>
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
        </Col>
      </Row>
      <Row className="row-per-setting">
        <Col span={12} className="label-setting">
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
    </div>
  );
};

export default PostInteractive;
