import path from 'path';

const fs = require('fs');

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

const Util = {
  createDirPath,
  getRootBackupDir,
  getFileNameByPath,
  sleep,
  trimChars,
  removeSpecialChars,
};

export default Util;
