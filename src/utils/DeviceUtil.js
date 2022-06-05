/* eslint-disable class-methods-use-this */
/* eslint-disable no-plusplus */
/* eslint-disable no-continue */
/* eslint-disable no-await-in-loop */
import DeviceInfoAction from 'functions/DeviceInfoAction';
import AppUtil from './AppUtil';
import RunCmdUtil from './RunCmdUtil';
import Util from './Util';

const cheerio = require('cheerio');

let serialsListForStopAction = [];
const useScrcpy = true;

const ReleaseStopDevice = async (serial) => {
  serialsListForStopAction = serialsListForStopAction.filter(
    (x) => x !== serial
  );
};

const isGoodRoot = async (serial) => {
  const checkRootRes = await RunCmdUtil.runShell(
    `"timeout 1 su -c 'echo root'"`,
    serial
  );
  return JSON.stringify(checkRootRes).replace('echo root', '').includes('root');
};

const isConnectedWifi = async (serial) => {
  try {
    const res = await RunCmdUtil.runShell(
      `"dumpsys netstats | grep -E 'iface=wlan.*networkId'"`,
      serial
    );
    return res.stdout.match(/networkId="(.+?)"/)[1];
  } catch {
    return false;
  }
};

const waitDevice = async (serial) => {
  if (!serial) return;
  await RunCmdUtil.runAdb(`-s ${serial} wait-for-device`);
};

const waitBootComplete = async (serial, timeout = 37) => {
  if (!serial) return;
  const startTime = new Date().getTime();
  while (new Date().getTime() - startTime < timeout * 1000) {
    // eslint-disable-next-line no-await-in-loop
    const res = (
      await RunCmdUtil.runShell(`getprop sys.boot_completed`, serial)
    ).stdout;
    if (res.includes('1')) break;
    await Util.sleep(500);
  }
};

const unsetProxy = async (serial, times = 1) => {
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < times; i++) {
    await RunCmdUtil.runShell(`settings delete global http_proxy`, serial);
    await RunCmdUtil.runShell(
      `settings delete global global_http_proxy_host`,
      serial
    );
    await RunCmdUtil.runShell(
      `settings delete global global_http_proxy_port`,
      serial
    );
    await RunCmdUtil.runShell(`settings put global http_proxy :0`, serial);
  }
};

const setWinSocksProfile = async function (
  serial,
  ip,
  port,
  user = '',
  pass = ''
) {
  const p = {
    ip,
    port,
    user,
    pass,
  };
  const args = [];
  for (const k in p) {
    if (!p[k]) continue;
    args.push(`-e ${k} ${p[k]}`);
  }
  await AppUtil.forceStopApp(serial, 'net.typeblog.socks');
  await RunCmdUtil.runShell(
    `am start -n net.typeblog.socks/.MainActivity ${args.join(' ')}`,
    serial
  );
  await Util.sleep(2000);
  await AppUtil.forceStopApp(serial, 'net.typeblog.socks');
};

const setProxy = async (serial, proxy, times = 1) => {
  // eslint-disable-next-line no-plusplus
  for (let index = 0; index < times; index++) {
    const useSager = localStorage.getItem('use-sager-proxy') == 'true';
    if (useSager) {
      await Utils.ConnectSager(serial, proxy);
    } else {
      await RunCmdUtil.runShell(
        `settings put global http_proxy ${proxy}`,
        serial
      );
    }
  }
};

class Device {
  constructor(serial) {
    this.serial = serial;
    this.ui = '';
    this.hocr = '';
    this.hocrJquery = null;
    this.hocrLines = {};
    this.emptyDump = 0;
  }

  async status(msg) {
    window.global.updateStatus(this.serial, msg);
  }

  async isStop() {
    window.global.isAutoStop(this.serial);
  }

  async runShell(cmd) {
    return RunCmdUtil.runShell(cmd, this.serial);
  }

  async runExecOut(cmd) {
    return RunCmdUtil.runAdb(`-s ${this.serial} exec-out ${cmd}`);
  }

  async runSu(cmd) {
    return RunCmdUtil.runSU(cmd, this.serial);
  }

  async clearPackage(packageId) {
    if (!packageId) return;
    RunCmdUtil.runShell(`pm clear ${packageId}`, this.serial);
  }

  async startActivity(packageId, activity) {
    if (!packageId || !activity) return;
    RunCmdUtil.runSU(`am start -n ${packageId}/${activity}`, this.serial);
  }

  async open(app) {
    return RunCmdUtil.openApp(this.serial, app);
  }

  async openUserApp(app) {
    return RunCmdUtil.openUserApp(this.serial, app);
  }

  async openLink(link) {
    return RunCmdUtil.runShell(
      `am start -a android.intent.action.VIEW -d "${link}"`,
      this.serial
    );
  }

  async close(app) {
    return AppUtil.forceStopApp(this.serial, app);
  }

  async wipe(app) {
    return RunCmdUtil.runShell(`pm clear ${app}`, this.serial);
  }

  async isKeyboardShown() {
    return (
      await AppUtil.runShell(
        `"dumpsys input_method | grep mInputShown"`,
        this.serial
      )
    ).stdout.includes('mInputShown=true');
  }

  async waitKeyboard(counter = 5) {
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < counter; i++) {
      const res = await this.isKeyboardShown();
      if (res) break;
    }
  }

  // eslint-disable-next-line class-methods-use-this
  async getUiDump(serial, toLower = true) {
    while (window.global.stopChangeModem) {
      await Util.sleep(1);
    }
    if (toLower)
      return (
        await RunCmdUtil.runAdb(
          `-s ${serial} exec-out uiautomator dump /dev/tty`
        )
      ).stdout.toLowerCase();
    return (
      await RunCmdUtil.runAdb(`-s ${serial} exec-out uiautomator dump /dev/tty`)
    ).stdout;
  }

  async dumpUi(toLower = false) {
    this.ui = await this.getUiDump(this.serial, toLower);
    if (
      this.ui.toLowerCase().includes('killed') ||
      this.ui.toLowerCase().includes('null root node returned by')
    )
      // eslint-disable-next-line no-plusplus
      this.emptyDump++;
    else this.emptyDump = 0;
    if (this.emptyDump >= 10) {
      const currentActivity = await RunCmdUtil.runShell(
        'dumpsys activity',
        this.serial
      );
      if (
        JSON.stringify(currentActivity).includes('t find service: activity')
      ) {
        throw new Error('CRASH UI');
      } else {
        this.emptyDump = 0;
      }
    }
    return this.ui;
  }

  findAllUiEle(query) {
    if (!query || !this.ui) return [];
    const matches = this.ui.match(/<(.*?)>/g);
    const result = [];
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < matches.length; i++) {
      const item = matches[i];
      if (!item) continue;
      if (!item.includes(query)) continue;
      const props = item
        .match(/\w.*?=".*?"/g)
        .map((x) => {
          if (!x) return {};
          const [, k, v] = x.match(/(.*)="(.*)"/);
          if (!k) return {};
          return { [k]: v || '' };
        })
        .reduce((a, b) => Object.assign(a, b), {});
      if (props.bounds) {
        const [, topX, topY, botX, botY] = props.bounds
          .match(/\[(.*?),(.*?)\]\[(.*?),(.*?)\]/)
          .map((x) => Number(x));
        props.topX = topX;
        props.botX = botX;
        props.topY = topY;
        props.botY = botY;
        props.x = Math.floor((topX + botX) / 2);
        props.y = Math.floor((topY + botY) / 2);
        props.offetX = Math.floor((botX - topX) / 2);
        props.offetY = Math.floor((botY - topY) / 2);
      }
      result.push(props);
    }
    return result;
  }

  findAllUiEleWithBound(query) {
    if (!query || !this.ui) return [];
    const matches = this.ui.match(/<(.*?)>/g);
    const result = [];
    for (let i = 0; i < matches.length; i++) {
      const item = matches[i];
      if (!item) continue;
      if (!item.includes(query)) continue;
      const props = item
        .match(/\w.*?=".*?"/g)
        .map((x) => {
          if (!x) return {};
          const [, k, v] = x.match(/(.*)="(.*)"/);
          if (!k) return {};
          return { [k]: v || '' };
        })
        .reduce((a, b) => Object.assign(a, b), {});
      if (props.bounds && !props.bounds.includes('[0,0][0,0]')) {
        const [, topX, topY, botX, botY] = props.bounds
          .match(/\[(.*?),(.*?)\]\[(.*?),(.*?)\]/)
          .map((x) => Number(x));
        props.topX = topX;
        props.botX = botX;
        props.topY = topY;
        props.botY = botY;
        props.x = Math.floor((topX + botX) / 2);
        props.y = Math.floor((topY + botY) / 2);
        props.offetX = Math.floor((botX - topX) / 2);
        props.offetY = Math.floor((botY - topY) / 2);
        result.push(props);
      }
    }
    return result;
  }

  async sendkey(serial, key) {
    return RunCmdUtil.runShell(`input keyevent ${key}`, serial);
  }

  async enter() {
    return this.sendkey(this.serial, 'KEYCODE_ENTER');
  }

  async back() {
    return this.sendkey(this.serial, 'KEYCODE_BACK');
  }

  async winControl(serial, cmds) {
    let screen = DeviceInfoAction.SCREEN_SIZE_MAPPING[serial];
    if (!screen) screen = { w: 1080, h: 1920 };
    const req = {
      ...screen,
      cmd: cmds,
    };
    const encoded = Buffer.from(JSON.stringify(req)).toString('base64');
    return RunCmdUtil.runShell(`wincontrol ${encoded}`, serial);
  }

  random(from, to) {
    return Math.floor(Math.random() * (to - from)) + from;
  }

  async swipeUp() {
    if (useScrcpy)
      return this.winControl(this.serial, [
        {
          a: 'scroll-down',
          x: Util.randomNumber(400, 700),
          y: Util.randomNumber(400, 700),
          t: 10,
        },
      ]);
    return RunCmdUtil.runShell(
      `input swipe ${this.random(500, 580)} ${this.random(
        1700,
        1800
      )} ${this.random(500, 580)} ${this.random(700, 800)}`,
      this.serial
    );
  }

  async swipeDown() {
    if (useScrcpy)
      this.winControl(this.serial, [
        {
          a: 'scroll-up',
          x: Util.randomNumber(400, 700),
          y: Util.randomNumber(400, 700),
          t: 10,
        },
      ]);
    RunCmdUtil.runShell(
      `input swipe ${this.random(500, 580)} ${this.random(
        700,
        800
      )} ${this.random(500, 580)} ${this.random(1700, 1800)}`,
      this.serial
    );
  }

  async swipeUpAdb2(x, y) {
    RunCmdUtil.runShell(
      `input touchscreen swipe ${x} ${y} ${x} ${Util.randomNumber(80, 120)}`,
      this.serial
    );
  }

  async swipeDownAdb2(x, y) {
    RunCmdUtil.runShell(
      `input touchscreen swipe ${x} ${y} ${x} ${Util.randomNumber(1400, 1600)}`,
      this.serial
    );
  }

  async swipeUpAdb(query) {
    const ele = this.findAllUiEle(query)[0];
    if (!ele) return;
    RunCmdUtil.runShell(
      `input touchscreen swipe ${ele.x} ${ele.y} ${ele.x} 100`,
      this.serial
    );
  }

  async swipeDownAdb(query) {
    const ele = this.findAllUiEle(query)[0];
    if (!ele) return;
    RunCmdUtil.runShell(
      `input touchscreen swipe ${ele.x} ${ele.y} ${ele.x} 1500`,
      this.serial
    );
  }

  async swipeToRefresh() {
    await RunCmdUtil.runShell(
      `"input touchscreen swipe 126 459 126 1000"`,
      this.serial
    );
  }

  async swipeUpToSurfing() {
    await RunCmdUtil.runShell(
      `"input touchscreen swipe 126 1000 126 459"`,
      this.serial
    );
  }

  async tap(x, y) {
    const xAf += this.random(-10, 10);
    const yAf += this.random(-10, 10);
    if (useScrcpy) return this.winControl(this.serial, [{ a: 'tap', xAf, yAf }]);
    return RunCmdUtil.runShell(`input tap ${xAf} ${yAf}`, this.serial);
  }

  async tapExact(x, y) {
    if (useScrcpy) return this.winControl(this.serial, [{ a: 'tap', x, y }]);
    return RunCmdUtil.runShell(`input tap ${x} ${y}`, this.serial);
  }

  async tapBound(bound = '') {
    if (!bound) return;
    const [x1, y1, x2, y2] = bound
      .replace('][', ',')
      .replace(']', '')
      .replace('[', '')
      .split(',')
      .map((x) => Number(x));
    this.tapExact(
      Util.randomNumber(x1 + 10, x2 - 10),
      Util.randomNumber(y1 + 10, y2 - 10)
    );
  }

  getCenterFromBound(bound = '') {
    if (!bound) return [];
    const [x1, y1, x2, y2] = bound
      .replace('][', ',')
      .replace(']', '')
      .replace('[', '')
      .split(',')
      .map((x) => Number(x));
    return [
      Util.randomNumber(x1 + 10, x2 - 10),
      Util.randomNumber(y1 + 10, y2 - 10),
    ];
  }

  getPointFromUi(xml, query) {
    try {
      if (!xml || !query) throw new Error();
      let Regex = /<(.*?)>/g;
      const ArrayTextContent = [];
      let c;
      while ((c = Regex.exec(xml)) !== null) ArrayTextContent.push(c[1]);
      const item = ArrayTextContent.find((s) => s.includes(query));
      if (!item) throw new Error();
      const ArrayPoint = [];
      Regex = /\[(.*?)\]/g;
      while ((c = Regex.exec(item)) !== null) {
        ArrayPoint.push(Number(c[1].split(',')[0]));
        ArrayPoint.push(Number(c[1].split(',')[1]));
      }
      return {
        ArrayPoint,
        x: Math.floor((ArrayPoint[0] + ArrayPoint[2]) / 2),
        y: Math.floor((ArrayPoint[1] + ArrayPoint[3]) / 2),
        x2Subx1: ArrayPoint[2] - ArrayPoint[0],
        y2Suby1: ArrayPoint[3] - ArrayPoint[1],
      };
    } catch (error) {
      console.log(error);
    }
    return { x: 0, y: 0, x2Subx1: 0, y2Suby1: 0 };
  }

  async tapDynamic2(serial, xml, query) {
    const { x, y, ArrayPoint } = this.getPointFromUi(xml, query);
    if (!x || !y || x <= 0 || y <= 0) return;
    const [x1, y1, x2, y2] = ArrayPoint;
    this.tapExact(
      this.serial,
      Util.randomNumber(x1 + 10, x2 - 10),
      Util.randomNumber(y1 + 10, y2 - 10)
    );
  }

  async tapDynamic(query) {
    const { x, y, ArrayPoint } = this.getPointFromUi(this.ui, query);
    if (!x || !y || x <= 0 || y <= 0) return;
    const [x1, y1, x2, y2] = ArrayPoint;
    this.tapExact(
      this.serial,
      Util.randomNumber(x1 + 10, x2 - 10),
      Util.randomNumber(y1 + 10, y2 - 10)
    );
  }

  async tapDynamicLast(query) {
    if (this.ui.split(query).length > 2) {
      this.ui = this.ui.replace(query, '');
    }
    return this.tapDynamic2(this.serial, this.ui, query);
  }

  async tapDynamicNum(query, num = 0) {
    let tmpUi = this.ui;
    for (let i = 0; i < num; i++) {
      tmpUi = tmpUi.replace(query, '');
    }
    if (!tmpUi.includes(query)) {
      tmpUi = this.ui;
    }
    return this.tapDynamic2(this.serial, tmpUi, query);
  }

  async tapDynamicCenter(xml, query) {
    const { x, y } = this.getPointFromUi(xml, query);
    if (!x || !y || x <= 0 || y <= 0) return;
    this.tap(this.serial, x, y / 2);
  }

  async tapEnterOrNext() {
    if (DeviceInfoAction.isXz1(this.serial))
      this.tapBound('[940,1630][1000,1740]');
    else if (DeviceInfoAction.isS9(this.serial)) {
      if (DeviceInfoAction.DEVICE_ROMS[this.serial] === 'PIXEL')
        this.tapBound('[1230,2720][1360,2755]');
      else this.tapBound('[1225,2582][1360,2720]');
    } else if (DeviceInfoAction.isZ3(this.serial)) this.tapBound('[944,1625][1052,1695]');
    else if (DeviceInfoAction.isA3(this.serial)) this.tapBound('[630,1366][667,1408]');
    else if (DeviceInfoAction.is3A(this.serial)) this.tapBound('[950,1945][1010,2030]');
    else if (
      DeviceInfoAction.isA1Pixel(this.serial) &&
      DeviceInfoAction.DEVICE_VERSIONS[this.serial] === 30
    )
      this.tapBound('[922,1785][1003,1837]');
    else if (DeviceInfoAction.isA1Pixel(this.serial))
      this.tapBound('[945,1737][1010,1770]');
    else if (DeviceInfoAction.isA2Pixel(this.serial))
      this.tapBound('[935,1965][1010,1985]');
    else if (DeviceInfoAction.isA2(this.serial))
      this.tapBound('[955,1888][1005,1970]');
    else if (
      DeviceInfoAction.isXZ2(this.serial) &&
      DeviceInfoAction.DEVICE_ROMS[this.emptyDumpserial] === 'SODP'
    )
      this.tapBound('[930,1888][1000,1933]');
    else if (DeviceInfoAction.isXZ2(this.serial)) this.tapBound('[955,1900][1010,1977]');
    else this.tapBound('[945,1783][1000,1837]');
  }

  isNonAccent(str) {
    if (!str) return false;
    str = str.toLowerCase();
    return !!str.match(
      /à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ|è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ|ì|í|ị|ỉ|ĩ|ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ|ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ|ỳ|ý|ỵ|ỷ|ỹ|đ|\u0300|\u0301|\u0303|\u0309|\u0323|\u02C6|\u0306|\u031B/
    );
  }

  async input(text, isClear = true) {
    if (useScrcpy) {
      const cmds = [];
      if (isClear) {
        cmds.push({ a: 'keep-ctrl', d: 29 });
        cmds.push({ a: 'sleep', d: 300 });
      }
      if (this.isNonAccent(text)) {
        const chars = text.split('')
        for (let i = 0; i < chars.length; i++) {
          const c = chars[i];
          if (this.isNonAccent(c)) {
            cmds.push({ a: 'paste', d: c });
          } else {
            cmds.push({ a: 'text2', d: c });
          }
        }
      } else {
        cmds.push({ a: 'text2', d: text });
      }
      return this.winControl(this.serial, cmds);
    }
    if (isClear) {
      await this.sendkey(this.serial, '123');
      await this.sendkey(
        this.serial,
        '--longpress 67 67 67 67 67 67 67 67 67 67 67'
      );
    }
    return RunCmdUtil.runShell(`input text '${text}'`, this.serial);
  }

  async swipeLeft() {
    return RunCmdUtil.runShell(
      `input touchscreen swipe 700 540 100 540`,
      this.serial
    );
  }

  async inputDynamic(query, text, isClear = true) {
    const ele = this.findAllUiEle(query)[0];
    if (!ele) return;
    this.tap(ele.x, ele.y);
    this.input(text, isClear);
  }

  async screencap() {
    const filename = `./${this.serial}.png`;
    if (ipc_function.existsSync(filename)) fs.unlinkSync(filename);
    await this.runExecOut(`screencap -p > ${filename}`);
    return filename;
  }

  async getHocr() {
    // reset old hocr
    this.hocr = '';
    this.hocrJquery = null;
    this.hocrLines = [];
    const imgFile = await this.screencap();
    if (!ipc_function.existsSync(imgFile)) return '';
    let hocrFile = `C:\\WINALL\\tesseract\\output\\${this.serial}`;
    if (ipc_function.existsSync(hocrFile)) fs.unlinkSync(hocrFile);
    await RunCmdUtil.run(
      `C:\\WINALL\\tesseract\\tesseract.exe ${imgFile} ${hocrFile} -l eng hocr`
    );
    hocrFile += '.hocr';
    if (!ipc_function.existsSync(hocrFile)) return '';
    this.hocr = ipc_function.readFileSync(hocrFile).toString();
    this.hocrJquery = cheerio.load(this.hocr);
    this.parseHocrObject();
    return this.hocr;
  }

  parseHocrObject() {
    if (!this.hocrJquery) return;
    const items = this.hocrJquery('span.ocr_line');
    for (let i = 0; i < items.length; i++) {
      const it = items[i];
      const text = this.hocrJquery(it)
        .text()
        .split('\n')
        .map((x) => x.trim())
        .join(' ')
        .trim();
      if (!text) continue;
      const bound = it.attribs.title
        .split(';')[0]
        .replace('bbox ', '')
        .split(' ');
      this.hocrLines[
        text
      ] = `[${bound[0]},${bound[1]}][${bound[2]},${bound[3]}]`;
    }
  }

  existOcr(txt, inside = true) {
    if (this.hocrLines[txt]) {
      return true;
    }
    if (inside) {
      const m = Object.keys(this.hocrLines).find((x) => x.includes(txt));
      if (m) return true;
    }
    return this.hocr.includes(`>${txt}<`);
  }

  getOcrPos(txt) {
    if (!txt) return null;
    const ele = this.hocrJquery(`span.ocrx_word:contains("${txt}")`);
    if (ele && ele.first()) {
      try {
        const bound = ele
          .attr('title')
          .split(';')[0]
          .replace('bbox ', '')
          .split(' ');
        if (bound) return `[${bound[0]},${bound[1]}][${bound[2]},${bound[3]}]`;
      } catch {
        //
      }
    }
    const re = new RegExp(`title='(.+)'>${txt}<`);
    const res = (this.hocr.match(re) || [])[1];
    if (!res) return null;
    const [x, y, x1, y1] = res.replace('bbox ', '').split(';')[0].split(' ');
    return `[${x},${y}][${x1},${y1}]`;
  }

  async clickOcr(txt) {
    const bound = this.getOcrPos(txt);
    if (!bound) return;
    return this.tapBound(bound);
  }

  async reloadChrome() {
    const s9 = DeviceInfoAction.isS9(this.serial);
    if (s9) {
      await this.tap(1343, 181);
      await Util.sleep(2000);
      await this.tap(1343, 181);
    } else if (DeviceInfoAction.isA3(this.serial)) {
      await this.tap(672, 126);
      await Util.sleep(2000);
      await this.tap(672, 126);
    } else if (DeviceInfoAction.is3A(this.serial)) {
      await this.tap(1014, 142);
      await Util.sleep(2000);
      await this.tap(1014, 142);
    } else {
      await this.tap(1000, 150);
      await Util.sleep(2000);
      await this.tap(1000, 150);
    }
  }

  async openChrome(serial, link) {
    if (!serial || !link) return;
    return RunCmdUtil.runShell(
      `am start -n com.android.chrome/com.google.android.apps.chrome.Main -a android.intent.action.VIEW -d '${link}'`,
      serial
    );
  };

  async openChromeLess() {
    return this.openChrome(
      this.serial,
      'https://myaccount.google.com/lesssecureapps'
    );
  }

  async openChromeUnlockCaptcha() {
    return this.openChrome(
      this.serial,
      'https://accounts.google.com/b/0/DisplayUnlockCaptcha'
    );
  }

  async openChromeRecovery() {
    return this.openChrome(
      this.serial,
      'https://myaccount.google.com/recovery/email'
    );
  }

  async openChromeDelete() {
    return this.openChrome(
      this.serial,
      'https://myaccount.google.com/birthday?gar=1'
    );
  }
}

const DeviceUtil = {
  ReleaseStopDevice,
  isGoodRoot,
  isConnectedWifi,
  waitDevice,
  waitBootComplete,
  unsetProxy,
  setWinSocksProfile,
  setProxy,
};

export default DeviceUtil;
