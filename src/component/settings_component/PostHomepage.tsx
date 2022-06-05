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
  Input,
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import TextArea from 'antd/lib/input/TextArea';
import { UploadFile } from 'antd/lib/upload/interface';
import { useDispatch, useSelector } from 'react-redux';
import { saveTmpSetting } from 'features/feature-setting/reducers/setting.reducer';
import { upsertSetting } from 'features/feature-setting/services/setting.service';
import _ from 'lodash';

type Props = {
  isSaveSetting: boolean;
  postHomepageSetting: any;
};

const PostHomepage: React.FC<Props> = ({
  isSaveSetting,
  postHomepageSetting,
}) => {
  const { tmpSetting } = useSelector((state) => _.get(state, 'settings', {}));
  const [linkShare, setLinkShare] = useState(
    _.get(postHomepageSetting, 'linkShare', '')
  );
  const [postContent, setPostContent] = useState<string[]>(
    _.get(postHomepageSetting, 'postContent', [])
  );
  const [photoVideo, setPhotoVideo] = useState<UploadFile[]>(
    _.get(postHomepageSetting, 'photoVideo.photoVideo', [])
  );
  const [numRandomPhotoVideo, setNumRandomPhotoVideo] = useState(
    _.get(postHomepageSetting, 'photoVideo.numRandomPhotoVideo', 1)
  );
  const [isRandomAction, setRandomAction] = useState(
    _.get(postHomepageSetting, 'action.isRandomAction', false)
  );
  const [actionType, setActionType] = useState(
    _.get(postHomepageSetting, 'action.actionType', '')
  );
  const [isTypeVideo, setTypeVideo] = useState(
    _.get(postHomepageSetting, 'postType.isTypeVideo', false)
  );
  const [whoCanSee, setWhoCanSee] = useState(
    _.get(postHomepageSetting, 'whoCanSee', '')
  );
  const [totalPost, setTotalPost] = useState(
    _.get(postHomepageSetting, 'totalPost', 1)
  );
  const [numThread, setNumThread] = useState(
    _.get(postHomepageSetting, 'numThread', 1)
  );

  const postHomepage = useMemo(() => {
    const photoVideos = photoVideo.map((pv) => {
      return {
        uid: _.get(pv, 'uid'),
        name: _.get(pv, 'name'),
        path: _.get(pv, 'path'),
        size: _.get(pv, 'size'),
        type: _.get(pv, 'type'),
      };
    });
    return {
      linkShare,
      postContent,
      photoVideo: {
        photoVideo: photoVideos,
        numRandomPhotoVideo,
      },
      action: {
        isRandomAction,
        actionType,
      },
      postType: {
        isTypeVideo,
      },
      whoCanSee,
      totalPost,
      numThread,
    };
  }, [
    actionType,
    isRandomAction,
    isTypeVideo,
    linkShare,
    numRandomPhotoVideo,
    numThread,
    photoVideo,
    postContent,
    totalPost,
    whoCanSee,
  ]);

  const valueRef = useRef();
  const dispatch = useDispatch();
  useEffect(() => {
    valueRef.current = postHomepage;
    dispatch(saveTmpSetting('postHomepage', postHomepage));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postHomepage]);

  useEffect(() => {
    if (isSaveSetting) {
      dispatch(upsertSetting(tmpSetting));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSaveSetting]);

  useEffect(() => {
    return () => {
      dispatch(saveTmpSetting('postHomepage', valueRef.current));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const propsPhotoVideo = {
    accept: 'image/*, video/*',
    onRemove: (file: UploadFile) => {
      const index = photoVideo.indexOf(file);
      const newFileList = photoVideo.slice();
      newFileList.splice(index, 1);
      setPhotoVideo(newFileList);
    },
    beforeUpload: (file: UploadFile, fileList: UploadFile[]) => {
      const newFileList = photoVideo.slice();
      newFileList.push(...fileList);
      setPhotoVideo(newFileList);
      return false;
    },
    multiple: true,
    fileList: photoVideo,
  };

  return (
    <div
      style={{
        backgroundColor: 'white',
        padding: '10px',
      }}
    >
      <Divider orientation="left" orientationMargin={5}>
        Đăng bài trang cá nhân
      </Divider>
      <Row>
        <Col span={3}>
          <span className="label-setting">Link share</span>
        </Col>
        <Col span={9}>
          <Input
            defaultValue={linkShare}
            onChange={(e) => setLinkShare(e.target.value)}
          />
        </Col>
      </Row>
      <Row>
        <span style={{ fontStyle: 'italic' }}>
          (Enter the link of the article to share with the content, the system
          will delte the link after successfully posting limiting blocking
          features, reducing reach. If share link this post cannot include
          media/feeling/activity)
        </span>
      </Row>
      <Row className="row-per-setting">
        <Col span={3}>
          <span className="label-setting">Post content</span>
        </Col>
        <Col span={9}>
          <TextArea
            defaultValue={postContent.join('\n')}
            onChange={(e) => setPostContent(e.target.value.split(/\r\n|\r|\n/))}
            autoSize={{ minRows: 3, maxRows: 5 }}
          />
        </Col>
      </Row>
      <Row className="row-per-setting">
        <Col span={3}>
          <span className="label-setting">Photo/Video</span>
        </Col>
        <Col span={5}>
          <Upload {...propsPhotoVideo}>
            <Button icon={<UploadOutlined />}>Select File</Button>
          </Upload>
        </Col>
        <Col>
          <Row>
            <Col style={{ padding: '3px 3px 0 0' }}>
              <span>Random</span>
            </Col>
            <Col>
              <InputNumber
                min={1}
                max={100000}
                defaultValue={numRandomPhotoVideo}
                onChange={(value) => setNumRandomPhotoVideo(value)}
              />
            </Col>
            <Col style={{ padding: '3px 0px 0 3px' }}>
              <span>media in list to post.</span>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row className="row-per-setting">
        <Col span={3}>
          <span className="label-setting">Tag friends</span>
        </Col>
        <Col span={5}>
          <span>friends</span>
        </Col>
      </Row>
      <Row className="row-per-setting">
        <Col span={3}>
          <span className="label-setting">Action</span>
        </Col>
        <Col>
          <Row>
            <Checkbox
              checked={isRandomAction}
              onChange={(e) => setRandomAction(e.target.checked)}
            >
              Random action
            </Checkbox>
            <Col>
              <Row>
                <Col>
                  <Radio.Group
                    defaultValue={actionType}
                    onChange={(e: RadioChangeEvent) =>
                      setActionType(e.target.value)
                    }
                  >
                    <Space>
                      <Radio value="action_feeling">Feeling</Radio>
                      <Radio value="action_activity">
                        Activity(Playing...)
                      </Radio>
                    </Space>
                  </Radio.Group>
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row className="row-per-setting">
        <Col span={3}>
          <span className="label-setting">Post type</span>
        </Col>
        <Col>
          <Row>
            <Checkbox
              checked={isTypeVideo}
              onChange={(e) => setTypeVideo(e.target.checked)}
            >
              Video
            </Checkbox>
          </Row>
        </Col>
      </Row>
      <Row className="row-per-setting">
        <Col span={3}>
          <span className="label-setting">Who can see?</span>
        </Col>
        <Col>
          <Row>
            <Radio.Group
              defaultValue={whoCanSee}
              onChange={(e: RadioChangeEvent) => setWhoCanSee(e.target.value)}
            >
              <Space>
                <Radio value="who_can_see_public">Public</Radio>
                <Radio value="who_can_see_friends">Friends</Radio>
                <Radio value="who_can_see_only_me">Only me</Radio>
              </Space>
            </Radio.Group>
          </Row>
        </Col>
      </Row>
      <Row className="row-per-setting">
        <Col span={3}>
          <span className="label-setting">Total post</span>
        </Col>
        <Col>
          <InputNumber
            min={1}
            max={100000}
            defaultValue={totalPost}
            onChange={(value) => setTotalPost(value)}
          />
        </Col>
      </Row>
      <Row className="row-per-setting">
        <Col span={3}>
          <span className="label-setting">Thread</span>
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

export default PostHomepage;
