import _ from 'lodash';
import RunCmdUtil from 'utils/RunCmdUtil';
import Util from 'utils/Util';
import AppUtil from 'utils/AppUtil';
import { TRUE } from 'node-sass';

const isGoodRoot = async function (serial) {
  const checkRootRes = await RunCmdUtil.runShell(
    `"timeout 1 su -c 'echo root'"`,
    serial
  );
  return JSON.stringify(checkRootRes).replace('echo root', '').includes('root');
};

const mountSystemMagisk = async (serial) => {
  RunCmdUtil.runSU(`mount -o rw,remount /`, serial);
  await Util.sleep(500);
  RunCmdUtil.runSU(`mount -o rw,remount /system`, serial);
  await Util.sleep(500);
  return isGoodRoot(serial);
};

const existSu = async (serial, path) => {
  const r = await RunCmdUtil.runSU(`ls ${path}`, serial);
  if (r.stderr) return false;
  return !r.stdout.includes('No such file or directory');
};

const checkFileExist = async function (serial, file) {
  return !(await RunCmdUtil.runShell(`ls ${file}`, serial)).stdout.includes(
    'No such file or directory'
  );
};

const getAllFiles = async (dir) => {
  // eslint-disable-next-line no-undef
  const subdirs = await ipc_function.readDir(dir);
  const files = await Promise.all(
    subdirs.map(async (subdir) => {
      // eslint-disable-next-line no-undef
      const res = ipc_function.resolvePath(dir, subdir);
      // eslint-disable-next-line no-undef
      return (await ipc_function.statIsDirectory(res)) ? getAllFiles(res) : res;
    })
  );
  return files.reduce((a, f) => a.concat(f), []);
};

const getWinBackFiles = async (dir) => {
  const files = await getAllFiles(dir);
  return files
    .map((filePath) => {
      try {
        // eslint-disable-next-line no-undef
        const stats = ipc_function.statSync(filePath);
        // eslint-disable-next-line no-undef
        const fileName = ipc_function.basename(filePath);
        const folder = Util.trimChars(
          filePath.replace(dir, '').replace(fileName, ''),
          '\\\\'
        );
        const mtime = stats.birthtimeMs;
        const [, d, t] = fileName.replace('.wbk', '').split('_');
        const [day, month, y1, y2] = _.chunk(d.split(''), 2).map((x) =>
          x.join('')
        );
        const [h, m, s] = _.chunk(t.split(''), 2).map((x) => x.join(''));
        return {
          name: fileName,
          path: filePath,
          folder,
          size: Math.floor(stats.size / (1024 * 1024)),
          time: new Date(`${month}-${day}-${y1}${y2} ${h}:${m}:${s}`),
          mtime,
        };
      } catch (err) {
        console.log('getWinBackFiles', err);
        return null;
      }
    })
    .filter((x) => x);
};

const getRootBackupOrgDir = () => {
  const dir = Util.createDirPath('WINALL\\winbackup_org');
  // eslint-disable-next-line no-undef
  if (!ipc_function.existsSync(dir))
    // eslint-disable-next-line no-undef
    ipc_function.mkdirSync(dir, { recursive: true });
  return dir;
};

const backupOrgFiles = async () => {
  return getWinBackFiles(getRootBackupOrgDir());
};

const getAppProfilePaths = (app) => {
  if (!app) return [];
  return [
    '/data/data/',
    '/data/misc/profiles/cur/0/',
    '/data/misc/profiles/ref/',
    '/data/user_de/0/',
  ].map((x) => `${x}${app}`);
};

const searchBackupCore = (text, files) => {
  if (!text) return [];
  const textRst = Util.removeSpecialChars(text.split('@')[0]);
  if (!textRst) return [];
  return files.filter((f) => {
    if (!textRst) return [];
    const name = Util.removeSpecialChars(f.name);
    if (!name) return false;
    return name.toLowerCase().includes(text.toLowerCase());
  });
};

const backupFiles = async () => {
  return getWinBackFiles(Util.getRootBackupDir());
};

const backupAppMulti = async (serial, apps, email) => {
  let fileName = email.split('@')[0];
  // Backup file name

  let hostPath = Util.getRootBackupDir();
  // full path case
  if (fileName && fileName.includes(':')) {
    const fullPath = fileName;
    fileName = Util.getFileNameByPath(fileName);
    hostPath = fullPath.replace(`\\${fileName}`, '');
    hostPath = hostPath.replace(fileName, '');
  }
  await mountSystemMagisk(serial);

  // Check app exists
  let hasExists = false;
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < apps.length; i++) {
    const app = apps[i];
    // eslint-disable-next-line no-await-in-loop
    if (await AppUtil.checkAppExist(serial, app)) {
      hasExists = true;
      break;
    }
  }
  if (!hasExists) {
    console.error('Khong backup duoc');
    return false;
  }

  // Collect apps path
  let appPaths = [];
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < apps.length; i++) {
    // eslint-disable-next-line no-await-in-loop
    await AppUtil.forceStopApp(serial, apps[i]);
    appPaths = [...appPaths, ...getAppProfilePaths(apps[i])];
  }
  const infoPaths = [
    '/system/vendor/Utils',
    '/system/etc/Utils',
    '/data/local/tmp/win_props',
  ];
  let allPaths = [
    ...appPaths,
    ...infoPaths,
    '/data/data/com.google.android.gsf',
    '/data/data/com.google.android.gms/shared_prefs/adid_settings.xml',
    '/data/misc/keystore',
  ];

  // unique paths
  allPaths = _.uniq(allPaths);
  console.log(serial, 'Clean Cache');
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < apps.length; i++) {
    const app = apps[i];
    // eslint-disable-next-line no-await-in-loop
    await RunCmdUtil.runSU(
      `rm -rf /data/data/${app}/cache/* /data/data/${app}/cache_code/*`,
      serial
    );
  }
  await RunCmdUtil.runSU(
    `rm -rf /data/data/com.android.vending/cache/* /data/data/com.android.vending/cache_code/*`,
    serial
  );
  const finalResult = [];
  console.log(serial, 'Collect Info');
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < allPaths.length; i++) {
    const p = allPaths[i];
    // eslint-disable-next-line no-await-in-loop
    const exist = await existSu(serial, p);
    if (exist) finalResult.push(p);
  }

  const excludePaths = [
    'data/data/com.google.android.gsf/lib',
    'data/data/com.google.android.googlequicksearchbox/app_g3_models',
    'data/data/com.google.android.googlequicksearchbox/files/datadownload',
  ];
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < apps.length; i++) {
    excludePaths.push(`data/data/${apps[i]}/lib*`);
  }

  const time = new Date();
  const timeStr = [
    time.getDate(),
    time.getMonth() + 1,
    time.getFullYear(),
    '_',
    time.getHours(),
    time.getMinutes(),
    time.getSeconds(),
    time.getMilliseconds(),
  ]
    .map((x) => String(x))
    .map((x) => (x.length === 1 && x !== '_' ? `0${x}` : x))
    .join('');

  if (!fileName) {
    fileName = `${apps[0]}_${timeStr}.wbk`;
  } else {
    fileName = `${fileName}_${timeStr}.wbk`;
  }
  if (!fileName.includes('.wbk')) {
    fileName += '.wbk';
  }

  const backupFolder = '/mnt/sdcard/backup';
  const guestPath = `${backupFolder}/${fileName}`;
  console.log(serial, 'Create Backup');
  await RunCmdUtil.runSU(`mkdir ${backupFolder}`, serial);
  await RunCmdUtil.runShell(
    `su -c "tar -zcvf ${guestPath} ${finalResult.join(
      ' '
    )} --exclude='*.apk' ${excludePaths
      .map((x) => `--exclude='${x}'`)
      .join(' ')}"`,
    serial
  );
  if (!(await checkFileExist(serial, guestPath))) {
    console.log(serial, 'Backup failed, file is not found');
    return false;
  }
  await RunCmdUtil.runSU(`setenforce 0`, serial);
  await RunCmdUtil.runAdb(`-s ${serial} pull "${guestPath}" "${hostPath}"`);
  // eslint-disable-next-line no-undef
  if (!ipc_function.existsSync(`${hostPath}\\${fileName}`)) {
    return console.log(serial, 'Backup failed, cannot pull file')
  }

  // Override File
  let orgFiles = await backupOrgFiles();
  orgFiles = searchBackupCore(fileName.split('_').shift(), orgFiles);
  let newFiles = await backupFiles();
  const nameOnly = fileName.split('_').shift().toLowerCase();
  newFiles = newFiles
    .filter((x) => x.name.toLowerCase().includes(nameOnly))
    .filter((x) => x.name !== fileName);
  if (!orgFiles || orgFiles.length === 0) {
    const orgFile = newFiles.pop();
    if (orgFile) {
      const newPath = orgFile.path.replace('winbackup', 'winbackup_org');
      const moveFolder = newPath.replace(orgFile.name, '');
      // eslint-disable-next-line no-undef
      if (!ipc_function.existsSync(moveFolder))
        // eslint-disable-next-line no-undef
        ipc_function.mkdirSync(moveFolder, { recursive: true });
      // eslint-disable-next-line no-undef
      ipc_function.renameSync(`${orgFile.path}`, newPath);
    }
  } else {
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < newFiles.length; i++) {
      const f = newFiles[i];
      // eslint-disable-next-line no-await-in-loop, no-undef
      await ipc_function.trash(f.path);
    }
  }

  await RunCmdUtil.runShell(`rm -rf ${guestPath}`, serial);
  console.log(serial, 'Backup Done!');
  // reloadBackupList();
  return true;
};

const DeviceAction = {
  backupAppMulti,
};

export default DeviceAction;
