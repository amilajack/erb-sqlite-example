import { Button, Checkbox, Col, Divider, Row } from "antd";
import { CheckboxValueType } from "antd/lib/checkbox/Group";
import { EditOutlined } from '@ant-design/icons';

const newsFeedOptionsKeyEdited = ['create_article'];
const newsFeedOptions = [
  {key: 'view_new_feed', value: 'View New Feed'},
  {key: 'view_story', value: 'View Story'},
  {key: 'view_watch', value: 'View Watch'},
  {key: 'read_notification', value: 'Read Notification'},
  {key: 'create_article', value: 'Create Article'},
  {key: 'create_story', value: 'Create Story'},
].map((o, idx) => <Row key={idx}>
  <Checkbox value={o.key}>{o.value}</Checkbox>
  { newsFeedOptionsKeyEdited.includes(o.key) ? <a><EditOutlined onClick={() => {}} /></a> : null }
  </Row>);


const friendOptionsKeyEdited = ['add_friend_uid', 'comment', 'comment_by_uid'];
const friendOptions = [
  {key: 'cancel_friend_request', value: 'Cancel Friend Request'},
  {key: 'accept_friend_request', value: 'Accept Friend Request'},
  {key: 'add_friend_request', value: 'Add Friend Request'},
  {key: 'add_friend_uid', value: 'Add Friend UID'},
  {key: 'comment', value: 'Comment'},
  {key: 'comment_by_uid', value: 'Comment theo UID'},
].map((o, idx) => <Row key={idx}>
  <Checkbox value={o.key}>{o.value}</Checkbox>
  { friendOptionsKeyEdited.includes(o.key) ? <a><EditOutlined onClick={() => {}} /></a> : null }
  </Row>);

const groupOptionsKeyEdited = ['join_group', 'view_group', 'leave_approval_group', 'seeding_check_group'];
const groupOptions = [
  {key: 'join_group', value: 'Join Group'},
  {key: 'view_group', value: 'View Group'},
  {key: 'leave_approval_group', value: 'Leave Approval Group'},
  {key: 'seeding_check_group', value: 'Seeding Group/Check Group'},
].map((o, idx) => <Row key={idx}>
  <Checkbox value={o.key}>{o.value}</Checkbox>
  { groupOptionsKeyEdited.includes(o.key) ? <a><EditOutlined onClick={() => {}} /></a> : null }
  </Row>);

const profileOptionsKeyEdited = ['change_cover', 'rename', 'change_avatar', 'veri_hotmail', 'change_pass'];
const profileOptionsFirst = [
  {key: 'change_cover', value: 'Change Cover'},
  {key: 'rename', value: 'Rename'},
  {key: 'turn_on_2fa', value: 'Turn On 2FA'},
  {key: 'change_avatar', value: 'Change Avatar'},
  {key: 'change_info', value: 'Change Info'},
  {key: 'remove_phone', value: 'Remove Phone'},
  {key: 'veri_hotmail', value: 'Veri Hotmail'},
].map((o, idx) => <Row key={idx}>
  <Checkbox value={o.key}>{o.value}</Checkbox>
  { profileOptionsKeyEdited.includes(o.key) ? <a><EditOutlined onClick={() => {}} /></a> : null }
  </Row>);
const profileOptionsSecond = [
  {key: 'public_wall', value: 'Public Wall'},
  {key: 'backup_birthday', value: 'Backup Birthday'},
  {key: 'backup_friend', value: 'Backup Friend'},
  {key: 'import_contact', value: 'Import Contact'},
  {key: 'backup_groups', value: 'Backup Groups'},
  {key: 'change_pass', value: 'Change Pass'},
  {key: 'add_mail_domain', value: 'Add Mail Domain'},
].map((o, idx) => <Row key={idx}>
  <Checkbox value={o.key}>{o.value}</Checkbox>
  { profileOptionsKeyEdited.includes(o.key) ? <a><EditOutlined onClick={() => {}} /></a> : null }
  </Row>);

const mixOptionsKeyEdited = ['public_wall', 'review_page', 'share_live_stream', 'synthetic_inbox'];
const mixOptions = [
  {key: 'public_wall', value: 'Happy Birthday'},
  {key: 'review_page', value: 'Review Page'},
  {key: 'share_live_stream', value: 'Share Live Stream'},
  {key: 'synthetic_inbox', value: 'Tổng hợp Inbox'},
  {key: 'shutdown_pc', value: 'Shutdown PC'},
].map((o, idx) => <Row key={idx}>
  <Checkbox value={o.key}>{o.value}</Checkbox>
  { mixOptionsKeyEdited.includes(o.key) ? <a><EditOutlined onClick={() => {}} /></a> : null }
  </Row>);

const pageOptionsKeyEdited = ['like_post', 'like_page', 'view_page'];
const pageOptions = [
  {key: 'like_post', value: 'Like Post'},
  {key: 'like_page', value: 'Like Page'},
  {key: 'view_page', value: 'View Page'},
].map((o, idx) => <Row key={idx}>
  <Checkbox value={o.key}>{o.value}</Checkbox>
  { pageOptionsKeyEdited.includes(o.key) ? <a><EditOutlined onClick={() => {}} /></a> : null }
  </Row>);

const FeedFacebookSetting = () => {

  const onChangeNewsFeed = (checkedValues: CheckboxValueType[]) => {
    console.log('checked = ', checkedValues);
  }

  return (
    <div
      style={{
        backgroundColor: 'white',
        padding: '10px'
      }}>
      <Divider orientation="left" orientationMargin={5}>
          Config nuôi Facebook
      </Divider>
      <Row>
        <Col span={3}>
          <Divider orientation="left" orientationMargin={20}>
            News Feed
          </Divider>
          <Checkbox.Group onChange={onChangeNewsFeed}>
            {newsFeedOptions}
          </Checkbox.Group>
        </Col>
        <Col span={3}>
          <Divider orientation="left" orientationMargin={20}>
            Friend
          </Divider>
          <Checkbox.Group onChange={onChangeNewsFeed}>
            {friendOptions}
          </Checkbox.Group>
        </Col>
        <Col span={3}>
          <Divider orientation="left" orientationMargin={20}>
            Group
          </Divider>
          <Checkbox.Group onChange={onChangeNewsFeed}>
            {groupOptions}
          </Checkbox.Group>
        </Col>
        <Col span={6}>
          <Divider orientation="left" orientationMargin={20}>
            Profile
          </Divider>
          <Checkbox.Group onChange={onChangeNewsFeed}>
            <Row>
              <Col style={{marginRight: '10px'}}>
                {profileOptionsFirst}
              </Col>
              <Col>
                {profileOptionsSecond}
              </Col>
            </Row>
          </Checkbox.Group>
        </Col>
        <Col span={3}>
          <Divider orientation="left" orientationMargin={20}>
            Mix
          </Divider>
          <Checkbox.Group onChange={onChangeNewsFeed}>
            {mixOptions}
          </Checkbox.Group>
        </Col>
        <Col span={3}>
          <Divider orientation="left" orientationMargin={20}>
            Page
          </Divider>
          <Checkbox.Group onChange={onChangeNewsFeed}>
            {pageOptions}
          </Checkbox.Group>
        </Col>
      </Row>
      <div style={{textAlign: 'start'}}>
        <Button type="primary">Lưu</Button>
      </div>
    </div>
  );
}

export default FeedFacebookSetting;
