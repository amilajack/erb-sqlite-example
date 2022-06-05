/* eslint-disable no-undef */
import path from 'path';

const getStoredDrive = () => {
  return localStorage.getItem('stored-drive') || 'C:\\';
};

const createDirPath = (subDir) => {
  let rootDir = getStoredDrive();
  if (!rootDir.endsWith('\\')) {
    rootDir += '\\';
  }
  let subDirTmp = subDir;
  if (subDir.startsWith('\\')) {
    subDirTmp = subDir.replace('\\', '');
  }
  return rootDir + subDirTmp;
};

const getRootBackupDir = () => {
  const dir = createDirPath('WINALL\\winbackup');
  // eslint-disable-next-line no-undef
  if (!ipc_function.existsSync(dir))
    // eslint-disable-next-line no-undef
    ipc_function.mkdirSync(dir, { recursive: true });
  return dir;
};

const getFileNameByPath = (filePath) => {
  return path.basename(filePath);
};

const sleep = async (ms) => {
  return new Promise((resolve) => setTimeout(() => resolve(null), ms));
};

const trimChars = (str, c) => {
  const re = new RegExp(`^[${c}]+|[${c}]+$`, 'g');
  return str.replace(re, '');
};

const removeSpecialChars = (raw) => {
  try {
    if (!raw) return raw;
    return raw.trim().replace(/\./g, '').replace(/_/g, '').replace(/ /g, '');
  } catch (er) {
    return '';
  }
};

const getRootInputDir = () => {
  const dir = createDirPath('WINALL\\wininput');
  if (!ipc_function.existsSync(dir))
    ipc_function.mkdirSync(dir, { recursive: true });
  return dir;
};

const getResourcePath = () => {
  return `${ROOT_PATH}\\${isDev ? '' : 'resources\\'}extraResources`.replace(
    `\\resources\\app.asar`,
    ''
  );
};

const getWinBackFiles = async (dir) => {
  const files = await Utils.getAllFiles(dir);
  return files
    .map((filePath) => {
      try {
        const stats = fs.statSync(filePath);
        const fileName = path.basename(filePath);
        if (!fileName.toLowerCase().includes('.wbk')) return null
        let folder = filePath.replace(dir, '').replace(fileName, '');
        folder = folder.trimChars('\\\\');
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
        return null;
      }
    })
    .filter((x) => x);
};

const backupFiles = async () => {
  return getWinBackFiles(Utils.getRootBackupDir());
};

const randomNumber = (minimum, maximum) => {
  return Math.floor(Math.random() * (maximum - minimum + 1)) + minimum
};

const Util = {
  createDirPath,
  getRootBackupDir,
  getFileNameByPath,
  sleep,
  trimChars,
  removeSpecialChars,
  getRootInputDir,
  getResourcePath,
  backupFiles,
  randomNumber,
};

export default Util;
