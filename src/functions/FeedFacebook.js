import _ from 'lodash';
import DeviceUtil from '../utils/DeviceUtil';
import Util from '../utils/Util';

const loginFacebook = async (serial) => {
  const device = DeviceUtil.createDevice(serial);
  await device.tapExact(676, 1193);
  await Util.sleep(1000);
  await device.input('bbirdenkhilde@gmail.com');
  await Util.sleep(2000);
  await device.tapEnterOrNext();
  await Util.sleep(1000);
  await device.input('edlihknedribb');
  await Util.sleep(2000);
  await device.tapEnterOrNext();
};

const viewInteractNewFeeds = async (serial) => {
  const device = DeviceUtil.createDevice(serial);
  await device.swipeUpSlowAdb(360, 1600);
  await Util.sleep(2000);
  await device.swipeUpSlowAdb(360, 1600);
  await Util.sleep(2000);
  await device.swipeUpSlowAdb(360, 1600);
  await Util.sleep(2000);
  await device.swipeUpSlowAdb(360, 1600);
  await Util.sleep(2000);
  await device.swipeUpSlowAdb(360, 1600);
}

const postInteraction = async (serial, setting) => {
  if (_.isEmpty(_.get(setting, 'linkPostFile', ''))) {
    return;
  }
  const posts = await Util.getContentFileLineByLine(_.get(setting, 'linkPostFile.path', ''));
  if (_.isEmpty(posts)) {
    return;
  }
  const device = DeviceUtil.createDevice(serial);
  const rateAction = _.get(setting, 'action.rateAction', 50);
  let numPost = _.get(setting, 'viewPost.numPost', 1);
  numPost = posts.length < numPost ? posts.length : numPost;
  for (let i = 0; i < numPost; i++) {
    const randomIdx = Util.randomNumber(0, posts.length - 1);
    console.error(`Xem bài post số ${i+1}`);
    await device.openLinkByApp(posts[randomIdx]);
    await Util.sleepArange(_.get(setting, 'viewPost.viewTime.from', 5), _.get(setting, 'viewPost.viewTime.to', 10));
    const isLike = _.get(setting, 'action.isActionLike', false) && Util.matchRate(rateAction);
    while (isLike) {
      const ui = await device.dumpUi();
      if (ui.includes('ERROR: could not get idle state.')) {
        continue;
      }
      if (ui.includes('Like button, pressed. Double tap and hold to change reaction.')) {
        break;
      }
      if (ui.includes('Like button. Double tap and hold to react.')) {
        console.error(`Like bài post số ${i+1}`);
        await device.tapDynamic('Like button. Double tap and hold to react.');
        break;
      }
      await device.swipeUpSlowAdb(360, 1600);
    }
    const isComment = _.get(setting, 'action.isActionComment', false) && Util.matchRate(rateAction);
    const comments = await Util.getContentFileLineByLine(_.get(setting, 'comment.file.path', ''));
    while (isComment && !_.isEmpty(comments)) {
      let ui = await device.dumpUi();
      if (ui.includes('ERROR: could not get idle state.')) {
        continue;
      }
      if (ui.includes('index="1" text="Comment" resource-id="com.facebook.katana:id/(name removed)" class="android.widget.Button" package="com.facebook.katana"')) {
        console.error(`Comment bài post số ${i+1}`);
        await device.tapDynamic('index="1" text="Comment" resource-id="com.facebook.katana:id/(name removed)" class="android.widget.Button" package="com.facebook.katana"');
        await Util.sleep(2000);
        await device.input(comments[Util.randomNumber(0, comments.length)]);
        await Util.sleep(2000);
        ui = await device.dumpUi();
        while (ui.includes('ERROR: could not get idle state.')) {
          ui = await device.dumpUi();
        }
        await device.tapDynamic('index="2" text="" resource-id="" class="android.view.ViewGroup" package="com.facebook.katana" content-desc="Send"');
        await Util.sleep(5000);
        await device.back();
        await Util.sleep(1000);
        await device.back();
        break;
      }
      await device.swipeUpSlowAdb(360, 1600);
    }
    const isShareProfile = _.get(setting, 'action.isActionShareProfile', false) && Util.matchRate(rateAction);
    while (isShareProfile) {
      let ui = await device.dumpUi();
      if (ui.includes('ERROR: could not get idle state.')) {
        continue;
      }
      if (ui.includes('index="2" text="Share" resource-id="com.facebook.katana:id/(name removed)" class="android.widget.Button" package="com.facebook.katana"')) {
        console.error(`Share profile bài post số ${i+1}`);
        await device.tapDynamic('index="2" text="Share" resource-id="com.facebook.katana:id/(name removed)" class="android.widget.Button" package="com.facebook.katana"');
        await Util.sleep(2000);
        ui = await device.dumpUi();
        device.tapDynamic('Share Now');
        await Util.sleep(5000);
        break;
      }
      await device.swipeUpSlowAdb(360, 1600);
    }
    const isShareStory = _.get(setting, 'action.isActionShareStory', false) && Util.matchRate(rateAction);
    while (isShareStory) {
      let ui = await device.dumpUi();
      if (ui.includes('ERROR: could not get idle state.')) {
        continue;
      }
      if (ui.includes('index="2" text="Share" resource-id="com.facebook.katana:id/(name removed)" class="android.widget.Button" package="com.facebook.katana"')) {
        console.error(`Share story bài post số ${i+1}`);
        await device.tapDynamic('index="2" text="Share" resource-id="com.facebook.katana:id/(name removed)" class="android.widget.Button" package="com.facebook.katana"');
        await Util.sleep(3000);
        ui = await device.dumpUi();
        device.tapDynamic('Share to your story');
        await Util.sleep(2000);
        ui = await device.dumpUi();
        device.tapDynamic('index="0" text="Share" resource-id="com.facebook.katana:id/(name removed)" class="android.widget.TextView" package="com.facebook.katana"');
        await Util.sleep(5000);
        ui = await device.dumpUi();
        if (ui.includes('Easily add to your story') && ui.includes('Add a home screen shortcut to your phone to quickly open your camera.')) {
          await device.tapDynamic('NOT NOW');
          await Util.sleep(2000);
        }
        break;
      }
      await device.swipeUpSlowAdb(360, 1600);
    }
    const numShareGroup = _.get(setting, 'action.numShareGroup', 0);
    const rateShareGroup = Util.matchRate(rateAction);
    while (numShareGroup > 0 && rateShareGroup) {
      let ui = await device.dumpUi();
      if (ui.includes('ERROR: could not get idle state.')) {
        continue;
      }
      if (ui.includes('index="2" text="Share" resource-id="com.facebook.katana:id/(name removed)" class="android.widget.Button" package="com.facebook.katana"')) {
        console.error(`Share group bài post số ${i+1}`);
        await device.tapDynamic('index="2" text="Share" resource-id="com.facebook.katana:id/(name removed)" class="android.widget.Button" package="com.facebook.katana"');
        await Util.sleep(3000);
        ui = await device.dumpUi();
        device.tapDynamic('Share to a group');
        await Util.sleep(3000);
        ui = await device.dumpUi();
        const listPoint = Util.getPointsFromListUi(ui, 'android.view.ViewGroup', []);
        let numGroupShared = listPoint.length < numShareGroup ? listPoint.length : numShareGroup;
        while (numGroupShared > 0) {
          const randomPointIdx = Util.randomNumber(0, listPoint.length - 1);
          const randomPoint = listPoint[randomPointIdx];
          await device.tapExact(randomPoint.x, randomPoint.y);
          await Util.sleep(2000);
          ui = await device.dumpUi();
          const isButtonShare = false;
          if (ui.includes('Share Now')) {
            await device.tapDynamic('Share Now');
            isButtonShare = true;
          } else if (ui.includes('index="0" text="POST" resource-id="com.facebook.katana:id/(name removed)" class="android.widget.Button" package="com.facebook.katana" content-desc="POST"')) {
            await device.tapDynamic('index="0" text="POST" resource-id="com.facebook.katana:id/(name removed)" class="android.widget.Button" package="com.facebook.katana" content-desc="POST"');
            if (numGroupShared === 1) {
              await Util.sleep(1000);
              await device.back();
            }
          }
          await Util.sleep(5000);
          numGroupShared--;
          listPoint.splice(randomPointIdx, 1);
          if (isButtonShare) {
            ui = await device.dumpUi();
            await device.tapDynamic('index="2" text="Share" resource-id="com.facebook.katana:id/(name removed)" class="android.widget.Button" package="com.facebook.katana"');
            await Util.sleep(3000);
            ui = await device.dumpUi();
            device.tapDynamic('Share to a group');
            await Util.sleep(3000);
          }
        }
        break;
      }
      await device.swipeUpSlowAdb(360, 1600);
    }
    posts.splice(randomIdx, 1);
    const ui = await device.dumpUi();
    if (ui.includes('Return to Feed')) {
      await device.back();
      await Util.sleep(2000);
    }
  }
}

const feedFacebook = async (serial, settingKey, settingContent) => {
  // await loginFacebook(serial);
  // await Util.sleep(5000);
  switch(settingKey) {
    case 'post_interactive':
      await postInteraction(serial, settingContent);
      // await viewInteractNewFeeds();
      break;
    default:
      break;
  }
};

const FeedFacebook = {
  feedFacebook,
};

export default FeedFacebook;
