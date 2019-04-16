import * as maptalks from 'maptalks';

const fans_info = [
  {
    name: '平行线',
    sex: '女',
    birthday: '10-11',
    area: '深圳',
    hobby: '舞蹈',
    style_lab: '为偶像加油',
    location: [-74.00833043131627, 40.71075554599386],
    img_url: require('../assets/images/girl-box.png'),
  },
  {
    name: '平行线',
    sex: '女',
    birthday: '10-11',
    area: '深圳',
    hobby: '舞蹈',
    style_lab: '为偶像加油',
    location: [114.36522552962903, 30.536785877395143],
    img_url: require('../assets/images/girl-box.png'),
  },
  {
    name: '米斯特张',
    sex: '男',
    birthday: '10-11',
    area: '深圳',
    hobby: '吉他',
    style_lab: '为偶像加油',
    location: [114.36150529481513, 30.540019837004557],
    img_url: require('../assets/images/boy-box.png'),
  },
  {
    name: '兔斯基',
    sex: '女',
    birthday: '10-11',
    area: '深圳',
    hobby: '舞蹈',
    style_lab: '为偶像加油',
    location: [114.36916143022925, 30.54064173984419],
    img_url: require('../assets/images/girl-box.png'),
  },
  {
    name: '徐月月1',
    sex: '女',
    birthday: '10-11',
    area: '深圳',
    hobby: '舞蹈',
    style_lab: '为偶像加油',
    location: [114.36226012506721, 30.533847233241946],
    img_url: require('../assets/images/girl-box.png'),
  },
  {
    name: '徐月月2',
    sex: '女',
    birthday: '10-11',
    area: '深圳',
    hobby: '舞蹈',
    style_lab: '为偶像加油',
    location: [114.36488405880071, 30.531017342891374],
    img_url: require('../assets/images/girl-box.png'),
  },
  {
    name: '徐月月3',
    sex: '女',
    birthday: '10-11',
    area: '深圳',
    hobby: '舞蹈',
    style_lab: '为偶像加油',
    location: [114.361649072006, 30.52926028116091],
    img_url: require('../assets/images/boy-box.png'),
  },
  {
    name: '徐月月1',
    sex: '女',
    birthday: '10-11',
    area: '深圳',
    hobby: '舞蹈',
    style_lab: '为偶像加油',
    location: [114.3706531185846, 30.528560557376515],
    img_url: require('../assets/images/boy-box.png'),
  },
  {
    name: '徐月月2',
    sex: '女',
    birthday: '10-11',
    area: '深圳',
    hobby: '舞蹈',
    style_lab: '为偶像加油',
    location: [114.3741576876122, 30.53795198113927],
    img_url: require('../assets/images/girl-box.png'),
  },
  {
    name: '徐月月3',
    sex: '女',
    birthday: '10-11',
    area: '深圳',
    hobby: '舞蹈',
    style_lab: '为偶像加油',
    location: [114.36567483335052, 30.53392497630715],
    img_url: require('../assets/images/boy-box.png'),
  },
  {
    name: '徐月月4',
    sex: '女',
    birthday: '10-11',
    area: '深圳',
    hobby: '舞蹈',
    style_lab: '为偶像加油',
    location: [114.36567483335052, 30.53392497630715],
    img_url: require('../assets/images/boy-box.png'),
  },
];

function animateInfo(map, autoCenter) {
  const random_num = Math.floor(Math.random() * 11);
  const options = {
    single: false,
    width: 346,
    height: 280,
    custom: true,
    autoOpenOn: null,
    content: `${'<div class="content" style= "width:346px;height:313px;">'
      + '<img src="'}${fans_info[random_num].img_url}";stlye="position: absolute;left: 0px;bottom: 0px;">`
      + '<div style=\'width:60%;height:200px;box-sizing:border-box;text-align;left;position:absolute;top:92px;left:100px;\'>'
      + '<div style=\'font-size:16px;color:#FA59F2;display:flex;justify-content:space-between;margin-top:10px\'>'
      + `<div>姓名</div><div style="color:#fff;text-align:left;width:50%">${fans_info[random_num].name}</div></div>`
      + '<div style=\'font-size:16px;color:#FA59F2;display:flex;justify-content:space-between;margin-top:10px\'>'
      + `<div>性别</div><div style="color:#fff;text-align:left;width:50%">${fans_info[random_num].sex}</div></div>`
      + '<div style=\'font-size:16px;color:#FA59F2;display:flex;justify-content:space-between;margin-top:10px\'>'
      + `<div>生日</div><div style="color:#fff;text-align:left;width:50%">${fans_info[random_num].birthday}</div></div>`
      + '<div style=\'font-size:16px;color:#FA59F2;display:flex;justify-content:space-between;margin-top:10px\'>'
      + `<div>区域</div><div style="color:#fff;text-align:left;width:50%">${fans_info[random_num].area}</div></div>`
      + '<div style=\'font-size:16px;color:#FA59F2;display:flex;justify-content:space-between;margin-top:10px\'>'
      + `<div>爱好</div><div style="color:#fff;text-align:left;width:50%">${fans_info[random_num].hobby}</div></div>`
      + '<div style=\'font-size:16px;color:#FA59F2;display:flex;justify-content:space-between;margin-top:10px\'>'
      + `<div>个性签名</div><div style="color:#fff;text-align:left;width:50%">${fans_info[random_num].style_lab}</div></div>`
      + '</div>'
      + '</div>',
  };
  const popover = new maptalks.ui.InfoWindow(options);
  const coordinates = fans_info[random_num].location;
  const coord = new maptalks.Point(coordinates);
  popover.addTo(map).show(coord);
  if (autoCenter) {
    map.panTo(coord);
  }
  return popover;
}

export {
  animateInfo,
};
