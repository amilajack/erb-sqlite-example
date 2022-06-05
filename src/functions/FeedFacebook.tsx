import AppUtil from 'utils/AppUtil';
import DeviceUtil from 'utils/DeviceUtil';
import RunCmdUtil from 'utils/RunCmdUtil';
import Util from 'utils/Util';
import DeviceAction from './DeviceAction';
import DeviceInfoAction from './DeviceInfoAction';

let serialsListForStopAction = [];
const changeModemDevices = [];
const MainObj = {};
MainObj.SetStopDevice = (serial) => {
  if (!serialsListForStopAction.includes(serial)) serialsListForStopAction.push(serial);
};
MainObj.ReleaseStopDevice = (serial) => {
  serialsListForStopAction = serialsListForStopAction.filter(
    (x) => x !== serial
  );
  DeviceUtil.ReleaseStopDevice(serial);
};
MainObj.GetStopDevice = (serial, isRemove = false) => {
  if (serialsListForStopAction.includes(serial)) {
    if (isRemove)
      serialsListForStopAction = serialsListForStopAction.filter(
        (s) => s !== serial
      );

    return true;
  }

  return false;
};

const lockDevice = (serial, type) => {
  if (!serial || !type) return;
  // updateProcessStatusForDevice(serial, type, STATUS_PROCESSING);
  // beforeAction(serial);
};
const releaseDevice = (serial, type) => {
  if (!serial || !type) return;
  // afterAction(serial);
  // updateProcessStatusForDevice(serial, type, STATUS_DONE);
};
const releaseDeviceKeepCheck = (serial, type) => {
  if (!serial || !type) return;
  // afterActionRemoveChecked(serial, false);
  // updateProcessStatusForDevice(serial, type, STATUS_DONE);
};

const checkStopGlobal = (serial) => {
  if (MainObj.GetStopDevice(serial)) {
    // updateStatus(serial, 'Stopped'); // TODO
    // releaseDevice(serial); // TODO
    MainObj.ReleaseStopDevice(serial);
    throw new Error('STOP');
  }
};

const _StatusTags = {};
const setStatusTag = (serial, tag) => {
  if (!serial || !tag) return;
  _StatusTags[serial] = tag;
}
let _MicroProxies = [];
const _MicroMapping = [];
const getNextMicroProxy = (serial) => {
  let proxy = '';
  if (_MicroMapping[serial]) proxy = _MicroMapping[serial];
  else proxy = _MicroProxies.shift();
  _MicroMapping[serial] = proxy;
  return proxy;
};
let _TinsoftProxies = [];
const _TinsoftMapping = {};
// eslint-disable-next-line consistent-return
const getNextTinsoftFbProxy = async (serial) => {
  let key = '';
  if (_TinsoftMapping[serial]) key = _TinsoftMapping[serial];
  else key = _TinsoftProxies.shift();
  if (!key) return '';
  _TinsoftMapping[serial] = key;
  let res = (
    await RunCmdUtil.run(
      `curl http://proxy.tinsoftsv.com/api/changeProxy.php?key=${key}`
    )
  ).stdout;
  try {
    res = JSON.parse(res);
    if (!res.success) {
      if ((res.description || '').includes('expired')) {
        // updateStatus(serial, 'Tinsoft Expired!'); // TODO
        await Util.sleep(10000);
      }
      // eslint-disable-next-line no-plusplus
      for (let i = res.next_change; i > 0; i--) {
        // updateStatus(serial, `TinSoft Failed - Wait ${i}s`); // TODO
        // eslint-disable-next-line no-await-in-loop
        await Util.sleep(1000);
      }
      await Util.sleep(10000);
    } else {
      return res.proxy;
    }
  } catch (e) {
    // updateStatus(serial, e.message); // TODO
    await Util.sleep(10000);
  }
};
let _TmProxies = [];
const _TmMapping = {};
// eslint-disable-next-line consistent-return
const getNextTmProxy = async (serial) => {
  let key = '';
  if (_TmMapping[serial]) key = _TmMapping[serial];
  else key = _TmProxies.shift();
  if (!key) return '';
  _TmMapping[serial] = key;
  let res = (
    await RunCmdUtil.run(
      `curl -X POST "https://tmproxy.com/api/proxy/get-new-proxy" -H "accept: application/json" -H "Content-Type: application/json" -d "{\\"api_key\\":\\"${key}\\",\\"id_location\\":0}" --ssl-no-revoke`
    )
  ).stdout;
  try {
    res = JSON.parse(res);
    const proxy = res.data.https;
    if (proxy) return proxy;
    const remainTime = Number(res.message.match(/retry after (\d.*?) /)[1])
    // eslint-disable-next-line no-plusplus
    for (let i = remainTime; i > 0; i--) {
      // updateStatus(serial, `Retry After ${i}s`); // TODO
      // eslint-disable-next-line no-await-in-loop
      await Util.sleep(1000);
    }
    throw new Error('TM Failed');
  } catch (e) {
    // updateStatus(serial, e.message) // TODO
    await Util.sleep(20000);
  }
};

let _GuyProxies = [];
const _GuyMapping = {};
const getProxyGuy = (serial) => {
  if (_GuyMapping[serial]) return _GuyMapping[serial];
  _GuyMapping[serial] = _GuyProxies.shift();
  return _GuyMapping[serial];
};

let _XProxies = [];
const _XProxyMapping = {};
// eslint-disable-next-line consistent-return
const getNextXProxy = async (serial) => {
  let item = '';
  if (_XProxyMapping[serial]) item = _XProxyMapping[serial];
  else item = _XProxies.shift();
  if (!item) return '';
  _XProxyMapping[serial] = item;
  const [proxy, api] = item.split('|');
  let res = (await RunCmdUtil.run(`curl ${api}`)).stdout;
  try {
    res = JSON.parse(res);
    if (res.status) return proxy;
    // updateStatus(serial, 'XProxy Failed: ' + res.msg); // TODO
    await Util.sleep(5000);
  } catch (e) {
    // updateStatus(serial, 'XProxy Error: ' + e.message); // TODO
    await Util.sleep(10000);
  }
};

const offWifi = async (serial) => {
  // updateStatus(serial, 'Turn Off Wifi') // TODO
  await RunCmdUtil.runShell(`svc wifi disable`, serial);
  await RunCmdUtil.runShell(`settings put global wifi_on 0`, serial);
  await RunCmdUtil.runShell(`settings put global airplane_mode_on 1`, serial);
}

const onWifi = async (serial) => {
  // updateStatus(serial, 'Turn On Wifi') // TODO
  await RunCmdUtil.runShell(`settings put global airplane_mode_on 0`, serial);
  await RunCmdUtil.runShell(`settings put global wifi_on 1`, serial);
  await RunCmdUtil.runShell(`svc wifi enable`, serial);
}

const searchBackupCore = (text, files) => {
  if (!text) return []
  text = text.split('@')[0]
  text = Util.removeSpecialChars(text)
  if (!text) return []
  return files.filter(f => {
    if (!text) return []
    let name = Util.removeSpecialChars(f.name)
    if (!name) return false
    return name.toLowerCase().includes(text.toLowerCase())
  })
};

const getUiInfo = () => {
  let uiInfo = {};
  let inputs = $(".app-inputs").find("input");
  for (let i = 0; i < inputs.length; i++) {
    let input = inputs[i];
    let k = input.id;
    let v = input.value;
    if (!v) continue;
    uiInfo[k] = v;
  }
  uiInfo["CountryCode"] = $("#country-action :selected").text();
  uiInfo["SimOperator"] = $("#SimOperator").val();
  // uiInfo['SimOperator'] = $("#operator-name-action :selected").val();
  uiInfo["SimOperatorName"] = $("#operator-name-action :selected").text();
  uiInfo["sdk"] = $("#sdk :selected").val();
  uiInfo["release"] = $("#sdk :selected").text();
  uiInfo["manufacturer"] = $("#man-action :selected").text();
  if (uiInfo["manufacturer"] == "Random") {
    delete uiInfo["manufacturer"];
  }
  return uiInfo;
}

const saveInfoCoreMagisk = async (serial, onlySim, isUnlock, auto, execSoftReboot = true) => {
  let startTime = new Date().getTime()
  // Check serial
  if (!serial) return;
  let device = _devices.find((x) => x.serial == serial);
  if (!device) {
    // Thống báo lỗi, không tìm thấy thiết bị này
    return;
  }
  // Info lấy được từ api
  let newInfo = device.newInfo;
  if (Object.keys(newInfo).length == 0) {
    // Không có info nào cả
    // updateStatus(serial, "Info không thay đổi!"); // TODO
    return;
  }
  let orgModel = device.oldInfo.org_model
  // merge UI info if manual change
  if (!auto) newInfo = Object.assign(newInfo, DeviceInfoAction.getUiInfo());

  if (!isUnlock) {
    updateProcessStatusForDevice(serial, RANDOM_INFO, STATUS_PROCESSING);
    beforeAction(serial);
  }

  let baseSdk = device.oldInfo['base_sdk']

  // Get settings
  let changeLogoutMail = await getSingleSetting('change-logout-mail')
  let changeNotReboot = await getSingleSetting('change-not-reboot')
  if (changeNotReboot) execSoftReboot = false

  updateStatus(serial, "Wiping...");
  await wipeAll(serial);

  updateStatus(serial, "Mount...");
  await mountSystemMagisk(serial)

  if (onlySim) {
    // Remove only Sim Info
    let simPropS7Paths = simPropKeys.map(x => `/system/vendor/Utils/${x}`)
    let simPropA1Paths = simPropKeys.map(x => `/system/system/vendor/Utils/${x}`)
    let simPropA2Paths = simPropKeys.map(x => `/system/system/etc/Utils/${x}`)
    await runSU(`rm -rf ${[...simPropS7Paths, ...simPropA1Paths, ...simPropA2Paths].join(' ')}`, serial)
  } else {
    // Remove all old info
    await runSU("rm -rf /system/vendor/Utils /system/system/vendor/Utils /system/system/etc/Utils /system/etc/Utils /data/adb/modules/win.control/system.prop", serial);
  }

  updateStatus(serial, "Mkdir...");

  // Create folder if not exist
  let infoFolder = '/system/vendor/Utils'
  let deviceEtc = ['A2', 'A3', 'S9', '3A', 'XZ2']
  if (deviceEtc.includes(orgModel)) {
    infoFolder = '/system/etc/Utils'
  } else if (orgModel == 'S7') {
    infoFolder = '/system/vendor/Utils'
  } else if (orgModel == 'Z3') {
    infoFolder = '/system/vendor/Utils'
  } else if (orgModel == 'XZ1') {
    infoFolder = '/system/etc/Utils'
  }

  await runSU(`mkdir ${infoFolder}`, serial)

  updateStatus(serial, "Change1...");

  let noneSystemProperties = [
    'AndroidSeri',
    'BOOTLOADER',
    'BSSID',
    'BaseBand',
    'Bssid',
    // 'BuildDate',
    'CountryCode',
    // 'DateUTC',
    'GLRenderer',
    'GLVendor',
    'IMEI',
    'MEID',
    'MacAddress',
    'Mcc',
    'Mnc',
    'PhoneNumber',
    'SimOperator',
    'SimOperatorName',
    'SimSerial',
    'Ssid',
    'SubscriberId',
    'UserAgent',
    'androidID',
    // 'brand',
    // 'btags',
    // 'btype',
    // 'buser',
    // 'description',
    // 'displayId',
    // 'fingerprint',
    // 'host',
    // 'id',
    // 'incremantal',
    // 'lat',
    // 'lon',
    // 'manufacturer',
    // 'model',
    // 'platform',
    // 'radio',
    'release',
    'sdk',
    // 'security_patch',
    'serial',
    'wifiMac',
    'wifiName',
  ]

  let ignoredInfo = []
  let cmd = [], cmd3 = []
  for (const k in newInfo) {
    let v = newInfo[k];
    if (!noneSystemProperties.includes(k)) continue;
    if (onlySim && !simPropKeys.includes(k)) continue;
    if (orgModel == 'S7' && ignoredInfo.includes(k)) continue
    v = remakeProp(k, v);
    cmd.push(`echo '${v}' > ${infoFolder}/${k}`)
    cmd3.push(`echo 'win.${k}=${v}' >> /data/adb/modules/win.control/system.prop`)
  }
  await runSU(`"${cmd.join(' && ')}"`, serial);
  updateStatus(serial, "Change2...");
  await runSU(`"${cmd3.join(' && ')}"`, serial);
  // Checking save info
  let infoDeviceList = (await runShell(`ls ${infoFolder}`, serial)).stdout.split('\n')
  if (infoDeviceList.length == 0) {
    updateStatus(serial, "Save Utils Error");
    await sleep(10000)
    throw new Error('Error Save')
  }
  if (newInfo['model']) {
    updateStatus(serial, "Change Device Name");
    await runSU(`settings put global device_name ${newInfo['model']}`, serial);
  }

  let timezone = getTimezoneByCountry(newInfo['CountryCode'])

  device.props += `\nro.product.product.model=${newInfo['model']}`
  device.props += `\nril.model_id=${newInfo['model']}`
  if (!onlySim) {
    // OS version
    if (newInfo['release'] && !device.props.includes(`ro.build.version.release=${newInfo['release']}`)) {
      device.props += `\nro.build.version.release=${newInfo['release']}`
      device.props += `\nro.odm.build.version.release=${newInfo['release']}`
      device.props += `\nro.product.build.version.release=${newInfo['release']}`
      device.props += `\nro.system.build.version.release=${newInfo['release']}`
      device.props += `\nro.vendor.build.version.release=${newInfo['release']}`
    }
    if (newInfo['sdk'] && !device.props.includes(`ro.odm.build.version.sdk=${newInfo['sdk']}`)) {
      device.props += `\nro.odm.build.version.sdk=${newInfo['sdk']}`
      device.props += `\nro.product.build.version.sdk=${newInfo['sdk']}`
      device.props += `\nro.system.build.version.sdk=${newInfo['sdk']}`
      device.props += `\nro.vendor.build.version.sdk=${newInfo['sdk']}`
    }
    if (!device.props.includes('ro.debuggable=0')) {
      device.props += `\nro.secure=1`
      device.props += `\nro.debuggable=0`
      device.props += `\nro.build.selinux=0`
    }
    if (execSoftReboot) device.props += `\nsys.boot_completed=`

    // S9 Pixel Props
    if (!device.props.includes('tombstoned.max_tombstone_count=50')) {
      device.props += `\ncache_key.package_info=0`
      device.props += `\ninit.svc.idmap2d=stopped`
      device.props += `\nlogd.logpersistd.enable=true`
      device.props += `\nril.signal.param0=255,-5,255`
      device.props += `\nro.boot.bootreason=reboot,factory_reset`
      device.props += `\nro.build.version.security_patch=2021-11-05`
      device.props += `\nsys.boot.reason=reboot,factory_reset`
      device.props += `\nsys.sysctl.tcp_def_init_rwnd=60`
      device.props += `\ntombstoned.max_tombstone_count=50`
    }

    let persistPropBk = '/data/property/persistent_properties_bk'
    if (!await existSu(serial, persistPropBk)) {
      await runSU(`cp /data/property/persistent_properties ${persistPropBk}`, serial)
      await runAdb(`-s ${serial} push ${getResourcePath()}\\persistent_properties /sdcard/`)
      await runSU(`cp /sdcard/persistent_properties /data/property/`, serial)
      await runSU(`chmod 600 /data/property/persistent_properties`, serial)
    }
    let persistPropContent = (await runSU(`cat /sdcard/persistent_properties`, serial)).stdout || ''
    let prop1 = (persistPropContent.match(/reboot,factory_reset,(.+)/) || [])[1]
    let prop2 = (persistPropContent.match(/reboot,adb,(.+)/) || [])[1]
    let prop3 = (persistPropContent.match(/reboot,shell,(.+)/) || [])[1]
    if (prop1 && !isNaN(Number(prop1))) {
      let newProp1 = Number(prop1) + Random(-99, 99)
      await runSU(`sed -i 's/${prop1}/${newProp1}/g' /data/property/persistent_properties`, serial)
    }
    if (prop2 && !isNaN(Number(prop2))) {
      let newProp2 = Number(prop2) + Random(-99, 99)
      await runSU(`sed -i 's/${prop2}/${newProp2}/g' /data/property/persistent_properties`, serial)
    }
    if (prop3 && !isNaN(Number(prop3))) {
      let newProp3 = Number(prop3) + Random(-99, 99)
      await runSU(`sed -i 's/${prop3}/${newProp3}/g' /data/property/persistent_properties`, serial)
    }

    if (timezone) {
      updateStatus(serial, "Change TimeZone");
      await runSU(`setprop persist.sys.timezone ${timezone}`, serial)
      await runShell(`settings put global time_zone ${timezone}`, serial)
    }

    updateStatus(serial, "Change Props...");
    let propLst = device.props.split('\n')
    let propBatch = _.chunk(propLst, 7)
    for (let i = 0; i < propBatch.length; i++) {
      let cmd = propBatch[i].map(x => `echo '${x}' >> /data/adb/modules/win.control/system.prop`);
      await runSU(`"${cmd.join(' && ')}"`, serial);
    }

    // Clear
    updateStatus(serial, "Cleanup...");
    if (changeLogoutMail && execSoftReboot) {
      await clearAll(serial);
    } else if (changeLogoutMail) {
      await runSU(`sqlite3 /data/system_ce/0/accounts_ce.db 'DELETE FROM accounts;DELETE FROM authtokens; DELETE FROM extras;'`, serial)
      await runSU(`sqlite3 /data/system_de/0/accounts_de.db 'DELETE FROM accounts; DELETE FROM debug_table;'`, serial)
      await runSU(`sqlite3 /data/data/com.google.android.gsf/databases/gservices.db 'DELETE FROM main;DELETE FROM overrides;DELETE FROM saved_secure;DELETE FROM saved_system;DELETE FROM saved_global;'`, serial)
      await runSU(`sqlite3 /data/user/0/com.google.android.gsf/databases/gservices.db 'DELETE FROM main;DELETE FROM overrides;DELETE FROM saved_secure;DELETE FROM saved_system;DELETE FROM saved_global;'`, serial)
      await clearAll(serial, false);
    }
  }
  // Check remove app
  let removeAppAfterChange = await getSingleSetting('change-remove-app')
  let app = await getSingleSetting('app-backup')
  if (removeAppAfterChange && app) {
    updateStatus(serial, `Remove ${app}`)
    await removeApp(serial, app)
  }
  // Reboot
  updateStatus(serial, "Changed, reboot...");
  if (execSoftReboot) {
    await rebootRecovery(serial)
    await sleep(3000);
    await waitDevice(serial);
  }
  await waitBootComplete(serial);

  let earlyProps = []
  if (newInfo['BOOTLOADER'] && baseSdk < 31) {
    earlyProps.push(`ro.boot.bootloader ${newInfo['BOOTLOADER']}`)
    earlyProps.push(`ro.bootloader ${newInfo['BOOTLOADER']}`)
  }
  // baseband
  if (newInfo['BaseBand']) {
    earlyProps.push(`gsm.version.baseband ${newInfo['BaseBand']}`)
    earlyProps.push(`ro.baseband ${newInfo['BaseBand']}`)
  }
  // hardware
  if (newInfo['hardware'] && baseSdk < 31) {
    earlyProps.push(`ro.boot.hardware ${newInfo['hardware']}`)
    earlyProps.push(`ro.hardware ${newInfo['hardware']}`)
  }
  // board
  if (newInfo['board'] && baseSdk < 31) {
    earlyProps.push(`ro.product.board ${newInfo['board']}`)
  }

  if (newInfo['serial']) {
    earlyProps.push(`ro.boot.em.did ${newInfo['serial']}`)
    earlyProps.push(`ro.serialno ${newInfo['serial']}`)
    earlyProps.push(`ro.boot.serialno ${newInfo['serial']}`)
  }

  earlyProps = [
    ...earlyProps,
    `gsm.version.baseband "${newInfo['BaseBand'].replace(new RegExp(' ', 'g'), '\\ ')}"`,
    `gsm.sim.operator.iso-country "${newInfo['CountryCode'].toLowerCase().replace(new RegExp(' ', 'g'), '\\ ')}"`,
    `gsm.operator.iso-country "${newInfo['CountryCode'].toLowerCase().replace(new RegExp(' ', 'g'), '\\ ')}"`,
    `gsm.sim.operator.alpha "${newInfo['SimOperatorName'].replace(new RegExp(' ', 'g'), '\\ ')}"`,
    `gsm.operator.alpha "${newInfo['SimOperatorName'].replace(new RegExp(' ', 'g'), '\\ ')}"`,
    `gsm.sim.operator.numeric "${newInfo['SimOperator'].replace(new RegExp(' ', 'g'), '\\ ')}"`,
    `gsm.operator.numeric "${newInfo['SimOperator'].replace(new RegExp(' ', 'g'), '\\ ')}"`
  ]

  await Promise.all(earlyProps.map(x => {
    return runSU(`resetprop ${x}`, serial)
  }))

  device.newInfo = {}
  device.oldInfo = await getWinInfo(serial);
  updateStatus(serial, "Change Done!");
  if (!isUnlock) {
    afterAction(serial);
    updateProcessStatusForDevice(serial, RANDOM_INFO, STATUS_DONE);
  }
  console.log('ChangeTime: ' + Math.floor(new Date().getTime() - startTime))
}

async function saveInfoMagisk(serial, onlySim, isUnlock, auto, exeSoftReboot = true) {
  await saveInfoCoreMagisk(serial, onlySim, isUnlock, auto, exeSoftReboot)
  await wipeAll(serial)
  successTotal++
  $('#report-change').html(`${successTotal} / ${rebootTotal}`)
  return true
}

let firstRunFb = false;
const feedFacebook = async (serial, proxyType) => {
  if (proxyType === 'modem_vinh116') {
    changeModemDevices.push(serial);
  }

  const getSetProxy = async () => {
    return (
      await RunCmdUtil.runShell(`settings get global http_proxy`, serial)
    ).stdout.trim();
  };
  const checkStop = () => {
    checkStopGlobal(serial);
  };

  const proxyIpv6Country = localStorage.getItem('fb-proxy-ipv6-country');
  // eslint-disable-next-line no-param-reassign
  proxyType = proxyType || localStorage.getItem('fb-proxy-type');
  setStatusTag(serial, proxyType);
  if (proxyType === 'v6') {
    setStatusTag(serial, `${proxyType}-${proxyIpv6Country}`);
  }
  lockDevice(serial, AUTO_NUOI);
  if (!firstRunFb) {
    firstRunFb = true;
    // showLoading() // TODO
    // eslint-disable-next-line no-undef
    _MicroProxies = ipc_function
      .readFileSync(`${Util.getRootInputDir()}\\fb-proxy-micro.txt`)
      .toString()
      .split('\n')
      .filter((x) => x);
    // eslint-disable-next-line no-undef
    _TinsoftProxies = ipc_function
      .readFileSync(`${Util.getRootInputDir()}\\fb-proxy-tinsoft.txt`)
      .toString()
      .split('\n')
      .filter((x) => x);
    // eslint-disable-next-line no-undef
    _TmProxies = ipc_function
      .readFileSync(`${Util.getRootInputDir()}\\fb-proxy-tm.txt`)
      .toString()
      .split('\n')
      .filter((x) => x);
    // eslint-disable-next-line no-undef
    _GuyProxies = ipc_function
      .readFileSync(`${Util.getRootInputDir()}\\fb-proxy-guy.txt`)
      .toString()
      .split('\n')
      .filter((x) => x);
    // eslint-disable-next-line no-undef
    _XProxies = ipc_function
      .readFileSync(`${Util.getRootInputDir()}\\fb-x-proxy.txt`)
      .toString()
      .split('\n')
      .filter((x) => x);
    // hideLoading() // TODO
  }

  const configSimIpType = async (v6 = false) => {
    if (v6) {
      await RunCmdUtil.runSU(
        `content update --uri content://telephony/carriers --bind protocol:s:IPV6 --bind roaming_protocol:s:IPV6 --where "mcc='452'"`,
        serial
      );
    } else {
      await RunCmdUtil.runSU(
        `content update --uri content://telephony/carriers --bind protocol:s:IP --bind roaming_protocol:s:IP --where "mcc='452'"`,
        serial
      );
    }
  };

  const installApks = async () => {
    if (!(await AppUtil.checkAppExist(serial, 'net.typeblog.socks'))) {
      // updateStatus(serial, 'Install WinSocks') // TODO
      await Util.runAdb(
        `-s ${serial} install ${Util.getResourcePath()}\\winsocks.apk`
      );
      await Util.sleep(3000);
    }

    if (!(await AppUtil.checkAppExist(serial, 'io.nekohasekai.sagernet'))) {
      // updateStatus(serial, 'io.nekohasekai.sagernet'); // TODO
      await RunCmdUtil.runAdb(
        `-s ${serial} install ${Util.getResourcePath()}\\sager.apk`
      );
      await Util.sleep(3000);
    }
  };

  const checkIp = async (currentProxy) => {
    try {
      const res = (
        await RunCmdUtil.runShell(
          `curl http://iptoi.com -x ${currentProxy} -m 7`,
          serial
        )
      ).stdout;
      return JSON.parse(res)
    } catch (e) {
      return {};
    }
  };

  const isDeviceAlive = async () => {
    const res = await RunCmdUtil.runAdb('devices');
    return JSON.stringify(res).includes(serial);
  };

  const waitForDeviceNew = async (ts = 60000) => {
    const s = new Date().getTime();
    while (new Date().getTime() - s < ts) {
      // eslint-disable-next-line no-await-in-loop
      if (await isDeviceAlive()) break;
      // eslint-disable-next-line no-await-in-loop
      await Util.sleep(2000);
    }
  };

  const getCurrentStatus = () => {
    return $(`.device-status[serial='${serial}']`)[0].textContent;
  };

  const noteRootStuck = (note = '') => {
    if (!note) return;
    const status = getCurrentStatus() || '';
    if (status.includes(` [`)) {
      // updateStatus(`${status.split('[')[0]} [${note}]`); // TODO
    } else {
      // updateStatus(`${status} [${note}]`); // TODO
    }
  };

  const checkStuckRoot = async () => {
    while (true) {
      console.log('Check Stuck Root');
      checkStop();
      await waitForDeviceNew();
      if (!await isDeviceAlive()) {
        noteRootStuck('Died')
        await Util.sleep(10000)
        continue;
      }
      let rooted = await DeviceUtil.isGoodRoot(serial);
      if (rooted) {
        await Util.sleep(10000)
        continue;
      }
      for(let i; i < 10; i++) {
        rooted = await DeviceUtil.isGoodRoot(serial)
        if (rooted) break
        await Util.sleep(2000)
      }
      if (!rooted) {
        noteRootStuck('Stuck-Reboot')
        await RunCmdUtil.runAdb(`-s ${serial} reboot`)
        await Util.sleep(15000)
      } else {
        await Util.sleep(10000)
      }
    }
  };

  setTimeout(() => {
    checkStuckRoot()
  }, 5000);

  const waitWifiOk = async () => {
    let counter = 0; let emptyDump = false; let errorWifi = false
    while (!await DeviceAction.WifiIsOn(serial)) {
      checkStop();;
      counter++
      await Util.sleep(1000);
      if (counter > 100) {
        // updateStatus(serial, 'Error Wifi') // TODO
        await Util.sleep(3000);
        errorWifi = true;
        break;
      }
      // updateStatus(serial, 'Wait Wifi ' + counter) // TODO
      if (counter % 60 == 0) {
        let bootRes = await RunCmdUtil.runShell('"getprop | grep boot_completed"', serial);
        // updateStatus(serial, 'Wait Wifi ' + counter + ' ' + JSON.stringify(bootRes)) // TODO
        if (!bootRes.stdout.includes('1')) {
          emptyDump = true;
          break;
        }
        await DeviceAction.openWifiSettings(serial);
        await Util.sleep(2000);
        await RunCmdUtil.runShell(`input tap 526 497`, serial);
      }
      if (counter != 15) continue;
      let currentActivity = await RunCmdUtil.runShell('dumpsys activity', serial)
      if (JSON.stringify(currentActivity).includes('t find service')) {
        emptyDump = true;
        break;
      }
      await DeviceAction.openWifiSettings(serial);
    }
    if (emptyDump || errorWifi) {
      // updateStatus(serial, 'Empty Dump - Boot Recovery') // TODO
      await DeviceAction.rebootRecovery(serial);
      await Util.sleep(3000);
      await DeviceUtil.waitDevice(serial);
      await DeviceUtil.waitBootComplete(serial);
      await Util.sleep(3000);
      return false;
    }
    return true;
  };

  for (;;) {
    checkStop()
    // Define variables
    let currentProxy = '', countryByIP = '', noteMicro, portMicro

    // Nuôi gmail
    let feedGmailAcc = ''

    let useSager = localStorage.getItem('use-sager-proxy') == 'true';

    await installApks()

    let curlCheck = (await RunCmdUtil.runShell('curl', serial)).stdout.trim()
    if (!curlCheck.includes('curl --help')) {
      await RunCmdUtil.runAdb(`-s ${serial} push ${Util.getResourcePath()}\\curl /sdcard/`) |
      await RunCmdUtil.runSU(`cp /sdcard/curl /system/bin/`, serial);
      await RunCmdUtil.runSU(`chmod 777 /system/bin/curl`, serial);
    }

    // Remove old proxy
    // updateStatus(serial, 'Remove old proxy') // TODO
    await DeviceUtil.unsetProxy(serial);

    let primaryMail = 'fakeemail@gmail.com|Zxcv123123'
    if (!primaryMail) {
      // updateStatus(serial, 'Empty Mail') // TODO
      releaseDevice(serial, AUTO_NUOI);
      return;
    }
    // updateStatus(serial, 'Start Register With ' + primaryMail) // TODO

    /* Proxy Session */
    if (proxyType == 'micro') {
      let counter = 1;
      for(;;) {
        checkStop();
        // updateStatus(serial, 'Wait Next Proxy IP - ' + counter++) // TODO
        if (currentProxy) break;
        currentProxy = getNextMicroProxy(serial);
        if (currentProxy) break;
        await Util.sleep(5000);
      }
      if (currentProxy) {
        const parts = currentProxy.split(':');
        currentProxy = parts[0] + ':' + parts[1];
        noteMicro = parts[2];
        portMicro = parts[1];
      }

      const waitMicro = localStorage.getItem('wait-micro-change') == 'true';
      let { query, countryCode } = await checkIp(currentProxy);
      while(!query && waitMicro) {
        checkStop();
        // updateStatus(serial, 'Getting IP') // TODO
        const tmp = await checkIp(currentProxy);
        query = (tmp || {}).query || '';
        countryCode = (tmp || {}).countryCode || '';
        await Util.sleep(2000);
      }
      // if (waitMicro) updateStatus(serial, query + ' -> Wait Change') // TODO
      while (waitMicro) {
        checkStop();
        if (!waitMicro) break;
        const res = await checkIp(currentProxy);
        if (res.query && res.query != query) {
          // updateStatus(serial, query + ' -> ' + res.query) // TODO
          break;
        }
        await Util.sleep(2000);
      }
      setStatusTag(serial, [proxyType, portMicro, noteMicro, countryCode].filter(x => x).join('-'));

      // await SetProxy(serial, currentProxy)
    } else if (proxyType == 'tinsoft') {
      for(;;) {
        checkStop();
        // updateStatus(serial, 'Wait Next Proxy IP') // TODO
        currentProxy = await getNextTinsoftFbProxy(serial);
        if (currentProxy) break;
        await Util.sleep(1000);
      }
      // await SetProxy(serial, currentProxy)
    } else if (proxyType == 'tmproxy') {
      for(;;) {
        checkStop();
        // updateStatus(serial, 'Wait Next TM Proxy IP') // TODO
        currentProxy = await getNextTmProxy(serial);
        if (currentProxy) break;
        await Util.sleep(1000);
      }
      // let [ip, port] = currentProxy.split(':')
      // await SetWinSocksProfile(serial, ip, port)
    } else if (proxyType == 'guy') {
      const proxyGuy = getProxyGuy(serial);
      if (!proxyGuy) {
        // releaseDevice(serial, AUTO_NUOI) // TODO
        // updateStatus(serial, 'Empty Proxy Guy') // TODO
        return;
      }
      const [ip, port, user, pass, api] = proxyGuy.split('|');
      await DeviceUtil.setWinSocksProfile(serial, ip, port, user, pass);
      await RunCmdUtil.run(`curl ${api}`);
    } else if (proxyType == 'v6') {
      for(;;) {
        checkStop();
        try {
          // updateStatus(serial, 'Get IP V6') // TODO
          const res = (await RunCmdUtil.run(`curl http://139.180.158.207/get-proxy?country=${proxyIpv6Country}`)).stdout
          const { proxy, country } = JSON.parse(res);
          if (proxy) {
            // updateStatus(serial, `Get IPV6 (${proxyIpv6Country}) - ` + proxy) // TODO
            await Util.sleep(3000);
            // await SetProxy(serial, proxy)
            currentProxy = proxy;
            countryByIP = country;
            break;
          }
        } catch {
          //
        }
        // updateStatus(serial, `Get IPV6 (${proxyIpv6Country}) - Failed`) // TODO
        await Util.sleep(5000);
      }
    } else if (proxyType == 'xproxy') {
      for(;;) {
        checkStop()
        // updateStatus(serial, 'Wait Next Proxy IP') // TODO
        currentProxy = await getNextXProxy(serial);
        if (currentProxy) break;
        await Util.sleep(1000);
      }
      // await SetProxy(serial, currentProxy)
    } else if (proxyType == '4g') {
      await configSimIpType();
    } else if (proxyType == '4gv6') {
      await configSimIpType(true);
    }

    // setReportTotal(serial) // TODO

    // Info email
    let saveNormal;

    if (useSager) {
      await offWifi(serial)
    }
    // updateStatus(serial, 'Lấy mail từ File') // TODO
    // for (;;) {
    //   checkStop()
    //   const { ref } = await getGmailForFeed()
    //   feedGmailAcc = ref
    //   let [m,p,r] = (feedGmailAcc || '').split('|')
    //   if (m && p && r) break
    //   updateStatus(serial, 'File hết mail')
    //   await sleep(1000, 5000)
    // }
    let [m,,] = feedGmailAcc.split('|');
    let files = await Util.backupFiles();
    let file = searchBackupCore(m, files)[0]
    if (file) { // restore mail
      // lockDevice(serial, AUTO_NUOI) // TODO
      // updateStatus(serial, 'Restore Mail') // TODO
      // await restoreApp(serial, file.path) // TODO
    } else { // Change login
      // updateStatus(serial, 'Random Info') // TODO
      // await randomInfo(serial, false, countryByIP) // TODO
      // lockDevice(serial, AUTO_NUOI) // TODO
      if (! await DeviceUtil.isGoodRoot(serial)) {
        // updateStatus(serial, 'Magisk Error - Reboot') // TODO
        await DeviceAction.rebootRecovery(serial);
        await Util.sleep(3000);
        await DeviceUtil.waitDevice(serial);
        await DeviceUtil.waitBootComplete(serial);
        await Util.sleep(3000);
        continue
      }
      // updateStatus(serial, 'Save Info') // TODO
      // TODO
      // let changeNewMagisk = localStorage.getItem('change-new-magisk') == 'true';
      // if (changeNewMagisk) {
      //   saveNormal = await saveInfoMagisk(serial, null, null, true)
      // } else {
      //   saveNormal = await saveInfo(serial, null, null, true)
      // }
    }
    if (useSager) {
      await offWifi(serial)
    }
    // lockDevice(serial, AUTO_NUOI) // TODO

    // Monitor boot complete
    let enteredAndroidMode = false
    for (let i = 0; i < 60; i++) {
      let bootRes = await RunCmdUtil.runShell('"getprop | grep boot_completed"', serial)
      if (bootRes.stdout.includes('1')) {
        enteredAndroidMode = true;
        break;
      }
      await Util.sleep(1000);
    }
    if (!enteredAndroidMode) {
      // updateStatus(serial, 'Stuck Boot - Boot Recovery') // TODO
      await DeviceAction.rebootRecovery(serial);
      await Util.sleep(3000);
      await DeviceUtil.waitDevice(serial);
      await DeviceUtil.waitBootComplete(serial);
      await Util.sleep(3000);
      continue;
    }

    // Setting after change info
    let httpProxyType = ['micro', 'tinsoft', 'tmproxy', 'v6', 'xproxy']
    if (httpProxyType.includes(proxyType)) {
      if (currentProxy) await DeviceUtil.setProxy(serial, currentProxy)
      if (useSager) {
        await onWifi(serial)
        await sleep(3000)
        let res = await waitWifiOk()
        if (!res) continue
      }
      let internalProxy = await getSetProxy()
      if (!internalProxy || internalProxy == 'null' || internalProxy == ':0' && !useSager) {
        updateStatus(serial, 'Proxy Null - ' + (saveNormal ? 'Normal' : 'Recovery'))
        await rebootRecovery(serial, true)
        await sleep(3000)
        await waitDevice(serial)
        await waitBootComplete(serial)
        await sleep(3000)
        continue
      }
    }

    if (!proxyType.includes('4g')) {
      runSU('svc wifi enable', serial)
      let res = await waitWifiOk()
      if (!res) continue
    }
    else {
      runSU('svc wifi disable', serial)
      await configSimIpType(proxyType == '4gv6')
    }

    await sleep(10000)

    if (proxyType == 'guy' || proxyType == 'tmproxy-socks') {
      if (!await VPNOn(serial)) await ConnectWinSocks(serial);
    }

    try {
      if (! await isGoodRoot(serial)) {
        updateStatus(serial, 'Magisk Error')
        throw new Error('Magisk Error')
      }

      await installApks()

      // Check mail đã login hay chưa
      // Nếu chưa thì login
      // Start feed
      let [m,p,r] = feedGmailAcc.split('|')
      let res = await loginGmail(serial, m, p, r)
      if (!res.status) {
        updateStatus(serial, 'Login Failed!');
        continue
      }

      let isYtb = localStorage.getItem('checkbox-react-youtube') === 'true'
      let isGmail = localStorage.getItem('checkbox-react-gmail') === 'true'
      let isSearch = localStorage.getItem('checkbox-react-search') === 'true'
      let isChPlay = localStorage.getItem('checkbox-react-chplay') === 'true'
      let reactList = []
      if (isYtb) reactList.push('youtube')
      if (isGmail) reactList.push('gmail')
      if (isSearch) reactList.push('search')
      if (isChPlay) reactList.push('chplay')
      reactList = _.shuffle(reactList)

      let isSuccess = false
      if (reactList.length == 0) isSuccess = true
      if (reactList.includes('youtube')) {
        await beginFeedGmail();
      }
      for (let i = 0; i < reactList.length; i++) {
        const it = reactList[i];
        let res = false
        if (it == 'youtube') {
          res = await feedYoutube(serial, p)
        } else if (it == 'gmail') {
          res = await feedGmail(serial, m)
        } else if (it == 'search') {
          res = await feedGgSearch(serial)
        } else if (it == 'chplay') {
          res = await feedChplay(serial)
        }
        if (res) isSuccess = true
      }

      let apps = await getSingleSetting("app-backup");
      apps = apps.split('\n').map(x => x.trim()).filter(x => x)
      if (isSuccess) {
        await backupAppMulti(serial, apps)
        setReportSuccess(serial)
      }
    } catch (e) {
      if (e.message == 'CRASH UI' || e.message == 'Magisk Error') {
        updateStatus(serial, 'Empty Dump - Boot Recovery')
        await rebootRecovery(serial, true)
        await sleep(3000)
        await waitDevice(serial)
        await waitBootComplete(serial)
        await sleep(3000)
        continue
      }
      if (e.message == 'STOP') {
        updateStatus(serial, 'Stopped')
        releaseDevice(serial, AUTO_NUOI)
        return
      }
      fs.appendFileSync(`C:\\WINALL\\log-reg.txt`, e.message + '|' + e.stack + '\n')
    }
  }
}

export default FeedFacebook;
