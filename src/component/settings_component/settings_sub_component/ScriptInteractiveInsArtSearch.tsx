/* eslint-disable react/jsx-props-no-spreading */
import {
  Row,
  Col,
  Input,
  InputNumber,
  Checkbox,
  Upload,
  Button,
  Divider,
  Radio,
  Space,
  RadioChangeEvent,
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { saveTmpSetting } from 'features/feature-setting/reducers/setting.reducer';
import _ from 'lodash';

type Props = {
  isTabActived: boolean;
  settingValues: any;
};

const ScriptInteractiveInsArtSearch: React.FC<Props> = ({
  isTabActived,
  settingValues,
}) => {
  const [idFanpage, setIdFanpage] = useState(
    _.get(settingValues, 'idFanpage', '')
  );
  const [searchType, setSearchType] = useState(
    _.get(settingValues, 'searchType', 'search_post')
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
  const [isInteractionLike, setInteractionLike] = useState(
    _.get(settingValues, 'interaction.isLike', false)
  );
  const [isInteractionComment, setInteractionComment] = useState(
    _.get(settingValues, 'interaction.isComment', false)
  );
  const [isInteractionShareProfile, setInteractionShareProfile] = useState(
    _.get(settingValues, 'interaction.isShareProfile', false)
  );
  const [isInteractionSendMsg, setInteractionSendMsg] = useState(
    _.get(settingValues, 'interaction.isSendMsg', false)
  );
  const [keywordsFile, setKeywordsFile] = useState(
    _.isEmpty(_.get(settingValues, 'keywordsFile'))
      ? []
      : [_.get(settingValues, 'keywordsFile')]
  );
  const [commentFile, setCommentFile] = useState(
    _.isEmpty(_.get(settingValues, 'commentFile'))
      ? []
      : [_.get(settingValues, 'commentFile')]
  );
  const [messageFile, setMessageFile] = useState(
    _.isEmpty(_.get(settingValues, 'messageFile'))
      ? []
      : [_.get(settingValues, 'messageFile')]
  );
  const insArtSearch = useMemo(() => {
    return {
      idFanpage,
      searchType,
      timeViewPost: {
        from: timeViewPostFrom,
        to: timeViewPostTo,
      },
      timeViewAds: {
        from: timeViewAdsFrom,
        to: timeViewAdsTo,
      },
      interaction: {
        isLike: isInteractionLike,
        isComment: isInteractionComment,
        isShareProfile: isInteractionShareProfile,
        isSendMsg: isInteractionSendMsg,
      },
      keywordsFile:
        keywordsFile.length > 0
          ? {
              uid: _.get(keywordsFile[0], 'uid'),
              name: _.get(keywordsFile[0], 'name'),
              path: _.get(keywordsFile[0], 'path'),
              size: _.get(keywordsFile[0], 'size'),
              type: _.get(keywordsFile[0], 'type'),
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
      messageFile:
        messageFile.length > 0
          ? {
              uid: _.get(messageFile[0], 'uid'),
              name: _.get(messageFile[0], 'name'),
              path: _.get(messageFile[0], 'path'),
              size: _.get(messageFile[0], 'size'),
              type: _.get(messageFile[0], 'type'),
            }
          : '',
    };
  }, [
    idFanpage,
    searchType,
    timeViewPostFrom,
    timeViewPostTo,
    timeViewAdsFrom,
    timeViewAdsTo,
    isInteractionLike,
    isInteractionComment,
    isInteractionShareProfile,
    isInteractionSendMsg,
    keywordsFile,
    commentFile,
    messageFile,
  ]);
  const dispatch = useDispatch();
  useEffect(() => {
    if (!isTabActived) {
      dispatch(
        saveTmpSetting('scriptInteraction', {
          insArtSearch,
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTabActived]);

  const valueRef = useRef();
  useEffect(() => {
    valueRef.current = { insArtSearch };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [insArtSearch]);

  useEffect(() => {
    return () => {
      if (!isTabActived) {
        return;
      }
      dispatch(saveTmpSetting('scriptInteraction', valueRef.current));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const propsKeyword = {
    accept: 'text/plain',
    onRemove: (file: any) => {
      const index = keywordsFile.indexOf(file);
      const newFileList = keywordsFile.slice();
      newFileList.splice(index, 1);
      setKeywordsFile(newFileList);
    },
    beforeUpload: (file: any) => {
      setKeywordsFile([file]);
      return false;
    },
    fileList: keywordsFile,
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
  const propsMessage = {
    accept: 'text/plain',
    onRemove: (file: any) => {
      const index = messageFile.indexOf(file);
      const newFileList = messageFile.slice();
      newFileList.splice(index, 1);
      setMessageFile(newFileList);
    },
    beforeUpload: (file: any) => {
      setMessageFile([file]);
      return false;
    },
    fileList: messageFile,
  };
  return (
    <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
      <Row>
        <Col span={3}>
          <span className="label-setting">ID Fanpage</span>
        </Col>
        <Col span={9}>
          <Input
            defaultValue={idFanpage}
            onChange={(e) => setIdFanpage(e.target.value)}
          />
        </Col>
        <Col span={3} style={{ textAlign: 'center' }}>
          <span className="label-setting">Search type</span>
        </Col>
        <Col>
          <Radio.Group
            defaultValue={searchType}
            onChange={(e: RadioChangeEvent) => setSearchType(e.target.value)}
          >
            <Space>
              <Radio value="search_post">Search posts</Radio>
              <Radio value="search_fanpage">Search fanpages</Radio>
            </Space>
          </Radio.Group>
        </Col>
      </Row>
      <Row className="row-per-setting">
        <Col span={12}>
          <span className="label-setting">Keywords file</span>
        </Col>
        <Col>
          <Upload {...propsKeyword}>
            <Button icon={<UploadOutlined />}>Select File</Button>
          </Upload>
        </Col>
      </Row>
      <Row>
        <Col>
          <span>
            File keyword search|keyword click one data per line. Format keyword
            search|keyword to click. Ex:
          </span>
          <br />
          <span>ho ngoc ha yan news|Hồ Ngọc Hà</span>
          <br />
          <span>tin tuc moi yan news|Dịch covid</span>
          <br />
        </Col>
      </Row>
      <Divider />
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
      <Row className="row-per-setting">
        <Col span={12}>
          <span className="label-setting">Random interaction post & ads</span>
        </Col>
        <Col>
          <Checkbox
            checked={isInteractionLike}
            onChange={(e) => setInteractionLike(e.target.checked)}
          >
            Like
          </Checkbox>
        </Col>
      </Row>
      <Row className="row-per-setting">
        <Col span={12} />
        <Col>
          <Checkbox
            checked={isInteractionComment}
            onChange={(e) => setInteractionComment(e.target.checked)}
          >
            Comment
          </Checkbox>
        </Col>
      </Row>
      <Row className="row-per-setting">
        <Col span={12} />
        <Col>
          <Checkbox
            checked={isInteractionShareProfile}
            onChange={(e) => setInteractionShareProfile(e.target.checked)}
          >
            Share profile
          </Checkbox>
        </Col>
      </Row>
      <Row className="row-per-setting">
        <Col span={12} />
        <Col>
          <Checkbox
            checked={isInteractionSendMsg}
            onChange={(e) => setInteractionSendMsg(e.target.checked)}
          >
            Send message
          </Checkbox>
        </Col>
      </Row>
      <Row className="row-per-setting">
        <Col span={12}>
          <span className="label-setting">Comment file</span>
        </Col>
        <Col>
          <Upload {...propsComment}>
            <Button icon={<UploadOutlined />}>Select File</Button>
          </Upload>
        </Col>
      </Row>
      <Row className="row-per-setting">
        <Col span={12}>
          <span className="label-setting">Message file</span>
        </Col>
        <Col>
          <Upload {...propsMessage}>
            <Button icon={<UploadOutlined />}>Select File</Button>
          </Upload>
        </Col>
      </Row>
    </div>
  );
};

export default ScriptInteractiveInsArtSearch;
