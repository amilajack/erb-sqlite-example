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
  postInteractionSetting: any;
};

const PostInteractiveV2: React.FC<Props> = ({
  isSaveSetting,
  postInteractionSetting,
}) => {
  const { tmpSetting } = useSelector((state) => _.get(state, 'settings', {}));
  const [linkPostFile, setLinkPostFile] = useState(
    _.isEmpty(_.get(postInteractionSetting, 'linkPostFile'))
      ? []
      : [_.get(postInteractionSetting, 'linkPostFile')]
  );
  const [viewType, setViewType] = useState(
    _.get(postInteractionSetting, 'viewPost.viewType', 'view_sequence')
  );
  const [numPost, setNumPost] = useState(
    _.get(postInteractionSetting, 'viewPost.numPost', 1)
  );
  const [viewTimeFrom, setViewTimeFrom] = useState(
    _.get(postInteractionSetting, 'viewPost.viewTime.from', 5)
  );
  const [viewTimeTo, setViewTimeTo] = useState(
    _.get(postInteractionSetting, 'viewPost.viewTime.to', 10)
  );
  const [isActionLike, setActionLike] = useState(
    _.get(postInteractionSetting, 'action.isActionLike', false)
  );
  const [isActionComment, setActionComment] = useState(
    _.get(postInteractionSetting, 'action.isActionComment', false)
  );
  const [isActionShareStory, setActionShareStory] = useState(
    _.get(postInteractionSetting, 'action.isActionShareStory', false)
  );
  const [isActionShareProfile, setActionShareProfile] = useState(
    _.get(postInteractionSetting, 'action.isActionShareProfile', false)
  );
  const [numShareGroup, setShareGroup] = useState(
    _.get(postInteractionSetting, 'action.numShareGroup', 1)
  );
  const [commentFile, setCommentFile] = useState(
    _.isEmpty(_.get(postInteractionSetting, 'comment.file'))
      ? []
      : [_.get(postInteractionSetting, 'comment.file')]
  );
  const [numThread, setNumThread] = useState(
    _.get(postInteractionSetting, 'comment.numThread', 1)
  );

  const postInteraction = useMemo(() => {
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
      viewPost: {
        viewType,
        numPost,
        viewTime: {
          from: viewTimeFrom,
          to: viewTimeTo,
        },
      },
      action: {
        isActionLike,
        isActionComment,
        isActionShareStory,
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
    linkPostFile,
    viewType,
    numPost,
    viewTimeFrom,
    viewTimeTo,
    isActionLike,
    isActionComment,
    isActionShareStory,
    isActionShareProfile,
    numShareGroup,
    commentFile,
    numThread,
  ]);

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

  const valueRef = useRef();
  const dispatch = useDispatch();
  useEffect(() => {
    valueRef.current = postInteraction;
    dispatch(saveTmpSetting('postInteractionV2', postInteraction));
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
      dispatch(saveTmpSetting('postInteractionV2', valueRef.current));
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
        <Col span={6}>
          <span className="label-setting">Link bài viết</span>
          <br />
          <span style={{ fontStyle: 'italic' }}>
            (Bài viết dạng url, mỗi url nằm trên một dòng)
          </span>
        </Col>
        <Col>
          <Upload {...propsLinkPost}>
            <Button icon={<UploadOutlined />}>Select File</Button>
          </Upload>
        </Col>
      </Row>
      <Row className="row-per-setting">
        <Col span={6}>
          <span className="label-setting">Xem bài viết kiểu</span>
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
                defaultValue={numPost}
                onChange={(value) => setNumPost(value)}
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
        <Col span={6}>
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
              checked={isActionShareStory}
              onChange={(e) => setActionShareStory(e.target.checked)}
            >
              Share story
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
        <Col span={6}>
          <span className="label-setting">File bình luận</span>
        </Col>
        <Col>
          <Row className="row-per-setting">
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

export default PostInteractiveV2;
