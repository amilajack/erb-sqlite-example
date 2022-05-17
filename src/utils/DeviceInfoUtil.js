import { Buffer } from 'buffer';
import RunCmdUtil from './RunCmdUtil';

const DEVICE_ROMS = {};
const DEVICE_VERSIONS = {};
const DEVICE_MODELS = {};
const SCREEN_SIZE_MAPPING = {};

const BufferLib = Buffer;
const convert = (from, to) => (str) => BufferLib.from(str, from).toString(to);
const hexToUtf8 = convert('hex', 'utf8');
const KEY_BASE_64 = hexToUtf8(
  '593249344f484233624756764d7a6b78596d527463413d3d'
);
// defind aes for mobile ROM
const ROM_IV = hexToUtf8('64326c7564475668625449774d6a42416447467561773d3d');
const ROM_KEY = hexToUtf8('64326c756447566862554230595735725147746c65513d3d');

const getSerials = async () => {
  try {
    const r = await RunCmdUtil.runAdb('devices');
    return r.stdout
      .match(/(\w+)\t/g)
      .map((x) => x.replace('\t', ''))
      .sort();
  } catch (err) {
    return [];
  }
};

const getModelName = (result) => {
  if (result.includes('starlte')) {
    return 'S9';
  }
  if (result.includes('herolte')) {
    return 'S7';
  }
  if (result.includes('tissot')) {
    return 'A1';
  }
  if (result.includes('jasmine')) {
    return 'A2';
  }
  if (result.toLowerCase().includes('z3')) {
    return 'Z3';
  }
  if (result.toLowerCase().includes('poplar')) {
    return 'XZ1';
  }
  if (result.includes('S9')) {
    return 'S9';
  }
  if (result.includes('A1')) {
    return 'A1';
  }
  if (result.includes('A2')) {
    return 'A2';
  }
  if (result.includes('laurel_sprout')) {
    return 'A3';
  }
  if (result.includes('sargo')) {
    return '3A';
  }
  if (result.includes('akari')) {
    return 'XZ2';
  }
  return '';
};

const getOrgDeviceModel = async (serial) => {
  let result = (
    await RunCmdUtil.runShell(
      `"echo $(getprop ro.lineage.version) $(getprop ro.carbon.version) $(getprop org.pixelexperience.version.display) $(getprop ro.arrow.version) $(getprop ro.lineagelegal.url) $(getprop ro.build.version.sdk)"`,
      serial
    )
  ).stdout.trim();

  DEVICE_ROMS[serial] = '';
  if (result.toLowerCase().includes('pixel')) {
    DEVICE_ROMS[serial] = 'PIXEL';
  } else if (result.toLowerCase().includes('cr-')) {
    DEVICE_ROMS[serial] = 'CARBON';
  } else if (result.toLowerCase().includes('lineage')) {
    DEVICE_ROMS[serial] = 'LOS';
  } else if (result.toLowerCase().includes('arrow')) {
    DEVICE_ROMS[serial] = 'ARROW';
  }

  DEVICE_VERSIONS[serial] = Number(result.split(' ').pop());

  const m = getModelName(result);
  if (m) return m;
  result = (
    await RunCmdUtil.runShell(`"cat /sdcard/info.txt"`, serial)
  ).stdout.trim();
  if (result.includes('SODP')) {
    DEVICE_ROMS[serial] = 'SODP';
  }
  const [os, ,] = result.split('-');
  if (!DEVICE_ROMS[serial] && os) DEVICE_ROMS[serial] = os;
  if (!DEVICE_ROMS[serial]) DEVICE_ROMS[serial] = 'LOS';
  return getModelName(result);
};

const exist = async (path, serial) => {
  const r = await RunCmdUtil.runShell(`ls ${path}`, serial);
  return !r.stderr;
};

const getAlgorithm = (keyBase64) => {
  const key = Buffer.from(keyBase64, 'base64');
  switch (key.length) {
    case 16:
      return 'aes-128-cbc';
    case 32:
      return 'aes-256-cbc';
    default:
      throw new Error(`Invalid key length: ${key.length}`);
  }
};

const decrypt = (messagebase64, ivBase64, k = null) => {
  const kAft = k || KEY_BASE_64;
  const key = BufferLib.from(kAft, 'base64');
  const iv = BufferLib.from(ivBase64, 'base64');
  const decipher = crypto.createDecipheriv(getAlgorithm(kAft), key, iv);
  let decrypted = decipher.update(messagebase64, 'base64');
  decrypted += decipher.final();
  return decrypted;
};

const decryptProp = (prop) => {
  try {
    return decrypt(prop, ROM_IV, ROM_KEY);
  } catch (err) {
    // console.log(err);
    return prop;
  }
};

const getWinInfo = async (serial) => {
  const orgModel = await getOrgDeviceModel(serial);
  let infoFolder = '/system/vendor/Utils';
  if (await exist('/system/etc/Utils', serial)) {
    infoFolder = '/system/etc/Utils';
  }

  let allPropRaw = '';
  const winInfo = {};
  DEVICE_MODELS[serial] = orgModel;
  if (orgModel === 'XZ1-old') {
    allPropRaw =
      (await RunCmdUtil.runShell(`"getprop | grep persist.win"`, serial))
        .stdout || '';
    allPropRaw
      .replace(/\[/g, '')
      .replace(/\]/g, '')
      .split('\n')
      .forEach((line) => {
        const lineAft = (line || '').trim();
        if (!lineAft) return;
        const [k, v] = lineAft.split(': ');
        winInfo[k.trim().replace('persist.win.', '')] = decryptProp(v.trim());
      });
  } else {
    allPropRaw = (
      await RunCmdUtil.runShell(
        `"cd ${infoFolder} && timeout 3 grep -vI **"`,
        serial
      )
    ).stdout;
    if (
      !allPropRaw.includes('No such file') &&
      !allPropRaw.includes('not found')
    ) {
      allPropRaw.split('\n').forEach((line) => {
        const [k, ...v] = line.split(':');
        winInfo[k.trim()] = decryptProp(v.join(':').trim());
      });
    }
  }

  if (!winInfo.model) {
    winInfo.model = (
      await RunCmdUtil.runShell('getprop ro.product.model', serial)
    ).stdout;
  }
  if (!winInfo.manufacturer) {
    winInfo.manufacturer = (
      await RunCmdUtil.runShell('getprop ro.product.manufacturer', serial)
    ).stdout;
  }
  winInfo.org_model = orgModel;
  const version = DEVICE_VERSIONS[serial]
    ? Number(DEVICE_VERSIONS[serial]) - 19
    : '';
  winInfo.uniq_rom = [orgModel, DEVICE_ROMS[serial], version]
    .filter((x) => x)
    .join('-');
  // Load win_name
  winInfo.win_name = (
    await RunCmdUtil.runShell(`cat /sdcard/win_name`, serial)
  ).stdout;
  winInfo.base_sdk = (
    await RunCmdUtil.runShell(`getprop ro.build.version.sdk`, serial)
  ).stdout;
  // store screen size by serial
  let screen = { w: 1080, h: 1920 };
  if (winInfo.org_model === 'S7') screen = { w: 1440, h: 2560 };
  else if (winInfo.org_model === 'S9') screen = { w: 1440, h: 2960 };
  else if (winInfo.org_model === 'A2') screen = { w: 1080, h: 2160 };
  else if (winInfo.org_model === 'A3') screen = { w: 720, h: 1560 };
  else if (winInfo.org_model === '3A') screen = { w: 1080, h: 2216 };
  else if (winInfo.org_model === 'XZ2') screen = { w: 1080, h: 2160 };
  SCREEN_SIZE_MAPPING[serial] = screen;
  delete winInfo[''];
  return winInfo;
};

const getDeviceProxy = async (serial) => {
  try {
    const raw = (
      await RunCmdUtil.runShell(`"dumpsys wifi | grep HttpProxy"`, serial)
    ).stdout;
    const result = raw.match(/HttpProxy:\s\[(.*?)\]\s(.*?)\s/);
    if (!result[1] || !result[2]) return '';
    return `${result[1]}:${result[2]}`;
  } catch (e) {
    console.log('e', e);
  }
  return '';
};

const DeviceInfoUtil = {
  getSerials,
  getWinInfo,
  getDeviceProxy,
};

export default DeviceInfoUtil;
