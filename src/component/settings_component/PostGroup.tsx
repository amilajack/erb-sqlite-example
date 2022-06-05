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
  postGroupSetting: any;
};

const PostGroup: React.FC<Props> = ({ isSaveSetting, postGroupSetting }) => {
  const { tmpSetting } = useSelector((state) => _.get(state, 'settings', {}));
  const [linkShare, setLinkShare] = useState(
    _.get(postGroupSetting, 'linkShare', '')
  );
  const [postContent, setPostContent] = useState<string[]>(
    _.get(postGroupSetting, 'postContent', [])
  );
  const [photoVideo, setPhotoVideo] = useState<UploadFile[]>(
    _.get(postGroupSetting, 'photoVideo.photoVideo', [])
  );
  const [numRandomPhotoVideo, setNumRandomPhotoVideo] = useState(
    _.get(postGroupSetting, 'photoVideo.numRandomPhotoVideo', 1)
  );
  const [isNoApproval, setNoApproval] = useState(
    _.get(postGroupSetting, 'share.isNoApproval', false)
  );
  const [shareMember, setShareMember] = useState(
    _.get(postGroupSetting, 'share.shareMember', 1)
  );
  const [numShareGroupAccount, setNumShareGroupAccount] = useState(
    _.get(postGroupSetting, 'share.numShareGroupAccount', 1)
  );
  const [timeWaitFrom, setTimeWaitFrom] = useState(
    _.get(postGroupSetting, 'timeWait.timeWaitFrom', 5)
  );
  const [timeWaitTo, setTimeWaitTo] = useState(
    _.get(postGroupSetting, 'timeWait.timeWaitTo', 10)
  );
  const [isTypeVideo, setTypeVideo] = useState(
    _.get(postGroupSetting, 'postType.isTypeVideo', false)
  );
  const [totalShare, setTotalShare] = useState(
    _.get(postGroupSetting, 'totalShare', 1)
  );
  const [numThread, setNumThread] = useState(
    _.get(postGroupSetting, 'numThread', 1)
  );

  const postGroup = useMemo(() => {
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
      share: {
        isNoApproval,
        shareMember,
        numShareGroupAccount,
        timeWait: {
          from: timeWaitFrom,
          to: timeWaitTo,
        },
      },
      postType: {
        isTypeVideo,
      },
      totalShare,
      numThread,
    };
  }, [
    isNoApproval,
    isTypeVideo,
    linkShare,
    numRandomPhotoVideo,
    numShareGroupAccount,
    numThread,
    photoVideo,
    postContent,
    shareMember,
    timeWaitFrom,
    timeWaitTo,
    totalShare,
  ]);

  const valueRef = useRef();
  const dispatch = useDispatch();
  useEffect(() => {
    valueRef.current = postGroup;
    dispatch(saveTmpSetting('postGroup', postGroup));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postGroup]);

  useEffect(() => {
    if (isSaveSetting) {
      dispatch(upsertSetting(tmpSetting));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSaveSetting]);

  useEffect(() => {
    return () => {
      dispatch(saveTmpSetting('postGroup', valueRef.current));
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
    beforeUpload: (files: UploadFile, fileList: UploadFile[]) => {
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
        Đăng bài nhóm
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
          <span className="label-setting">Share to group</span>
        </Col>
        <Col span={3}>
          <Checkbox
            checked={isNoApproval}
            onChange={(e) => setNoApproval(e.target.checked)}
          >
            No Approval
          </Checkbox>
        </Col>
        <Col span={5}>
          <Row>
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
        </Col>
        <Col span={5}>
          <Row>
            <Col style={{ padding: '3px 3px 0 0' }}>
              <span>Share</span>
            </Col>
            <Col>
              <InputNumber
                min={1}
                max={100000}
                defaultValue={numShareGroupAccount}
                onChange={(value) => setNumShareGroupAccount(value)}
              />
            </Col>
            <Col style={{ padding: '3px 0 0 3px' }}>
              <span>Group/Account</span>
            </Col>
          </Row>
        </Col>
        <Col>
          <Row>
            <Col style={{ padding: '3px 3px 0 0' }}>
              <span>Time wait(s)</span>
            </Col>
            <Col>
              <InputNumber
                min={1}
                max={100000}
                defaultValue={timeWaitFrom}
                onChange={(value) => setTimeWaitFrom(value)}
              />
            </Col>
            <Col>
              <span style={{ padding: '0 5px 0 5px' }}>-</span>
            </Col>
            <Col>
              <InputNumber
                min={1}
                max={100000}
                defaultValue={timeWaitTo}
                onChange={(value) => setTimeWaitTo(value)}
              />
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
          <span className="label-setting">Total share</span>
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

export default PostGroup;
