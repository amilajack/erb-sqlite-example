import RunCmdUtil from './RunCmdUtil';

const checkAppExist = async (serial, app) => {
  if (!serial || !app) return false;
  return (
    await RunCmdUtil.runShell(`"pm list packages | grep ${app}"`, serial)
  ).stdout.includes(app);
};

const forceStopApp = async (serial, packageName) => {
  return RunCmdUtil.runShell(`am force-stop ${packageName}`, serial);
};

const AppUtil = {
  checkAppExist,
  forceStopApp,
};

export default AppUtil;
