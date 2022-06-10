import _ from 'lodash';
// import isDev from 'electron-is-dev';
import md5File from 'md5-file';
import Util from './Util';

// const isDev = require('electron-is-dev');

const adbProductionPath = '.\\resources\\extraResources\\adb.exe';
const adbMd5 = '94226ea671d068461171ec790197adb9';

const isDev =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

const DeviceVersions = {};

const run = async (cmd) => {
  let r;
  const startTime = new Date().getTime();
  try {
    if (!isDev) {
      const md5 = md5File.sync(adbProductionPath);
      if (md5 !== adbMd5) throw new Error('Invalid command!');
    }
    // eslint-disable-next-line no-undef
    const { stdout, stderr } = await ipc_function.execCmd(cmd);
    r = { stdout, stderr };
    return r;
  } catch (err) {
    r = { stdout: '', stderr: _.get(err, 'message') };
    return r;
  } finally {
    Object.assign(r, { time: Math.floor(new Date().getTime() - startTime) });
    if (
      !cmd.includes('devices') &&
      !cmd.includes('uiautomator') &&
      !cmd.includes('wincontrol1') &&
      isDev
    )
      console.log('CMD:', cmd, r);
  }
};

const runAdb = async (cmd) => {
  let adb = 'adb';
  if (!isDev) adb = adbProductionPath;
  return run(`${adb} ${cmd}`);
};

const runShell = async function (cmd, serial) {
  if (!serial) return runAdb(`shell ${cmd}`);
  return runAdb(`-s ${serial} shell ${cmd}`);
};

const isGoodRoot = async (serial) => {
  const checkRootRes = await runShell(`"timeout 1 su -c 'echo root'"`, serial);
  return JSON.stringify(checkRootRes).replace('echo root', '').includes('root');
};

const waitBootComplete = async (serial, timeout = 37) => {
  if (!serial) return;
  const startTime = new Date().getTime();
  while (new Date().getTime() - startTime < timeout * 1000) {
    // eslint-disable-next-line no-await-in-loop
    const res = (await runShell(`getprop sys.boot_completed`, serial)).stdout;
    if (res.includes('1')) break;
    // eslint-disable-next-line no-await-in-loop
    await Util.sleep(500);
  }
};

const runSU = async (cmd, serial) => {
  if (DeviceVersions[serial] > 29) {
    const stillRoot = await isGoodRoot(serial);
    if (!stillRoot) {
      await runShell('reboot', serial);
      await Util.sleep(2);
      await waitBootComplete(serial);
    }
  }
  let newCmd = cmd;
  if (!cmd.startsWith(`"`) && !cmd.endsWith(`"`)) newCmd = `"${cmd}"`;
  if (!serial) return runAdb(`exec-out su -c ${newCmd}`);
  return runAdb(`-s ${serial} exec-out su -c ${newCmd}`);
};

const RunCmdUtil = {
  run,
  runAdb,
  runShell,
  runSU,
};

export default RunCmdUtil;
