import { Button, Modal } from "antd";
import { SettingOutlined } from '@ant-design/icons';
import Settings from './Settings';
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";
import { getSetting } from "features/feature-setting/services/setting.service";
import { setTmpSetting } from "features/feature-setting/reducers/setting.reducer";

const SettingsManager = () => {
  const [isShowSettingsModal, setShowSettingsModal] = useState(false);
  const [isSaveSetting, setSaveSetting] = useState(false);

  const { setting, tmpSetting } = useSelector((state) => _.get(state, 'settings', {}));
  console.log('tmpSetting', tmpSetting);
  const dispatch = useDispatch();
  useEffect(() => {
    if (isSaveSetting) {
      // setSaveSetting(false);
      setShowSettingsModal(false);
    }
  }, [JSON.stringify(tmpSetting), isSaveSetting]);

  useEffect(() => {
    const settingObj = {};
    if (setting.length > 0) {
      setting.map((s) => {
        Object.assign(settingObj, {[_.camelCase(s.key)]: JSON.parse(s.value)});
      });
    }
    dispatch(setTmpSetting(settingObj));
  }, [setting]);

  useEffect(() => {
    dispatch(getSetting());
  }, []);

  return (
    <>
      <Button
        type="primary"
        icon={<SettingOutlined />}
        onClick={() => setShowSettingsModal(true)}
      >
        Settings
      </Button>
      <Modal
        title="Settings"
        visible={isShowSettingsModal}
        width="100%"
        destroyOnClose
        onOk={() => {
          setSaveSetting(true);
        }}
        onCancel={() => {
          setShowSettingsModal(false);
        }}
        afterClose={() => {
          setSaveSetting(false);
        }}
      >
        <Settings isSaveSetting={isSaveSetting} setting={tmpSetting} />
      </Modal>
    </>
  );
}
export default SettingsManager;
