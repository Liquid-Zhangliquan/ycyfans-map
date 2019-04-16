import * as maptalks from 'maptalks';

const fans_info = [
  {
    name: 'Liquid',
    sex: '男',
    birthday: '11-05',
    area: '深圳',
    hobby: '跑步',
    style_lab: 'hello ycy',
    location: [-5.504763440209672, 54.163612399780305],
    img_url: require('../assets/images/boy-box.png'),
  },
  {
    name: 'RachelXu',
    sex: '女',
    birthday: '10-11',
    area: '深圳',
    hobby: '画画，唱歌',
    style_lab: '为偶像加油',
    location: [0.48055883552672185, 56.32079880777761],
    img_url: require('../assets/images/girl-box.png'),
  },
  {
    name: 'sakitam-fdd',
    sex: '男',
    birthday: '10-11',
    area: '深圳',
    hobby: 'coding',
    style_lab: '为偶像加油',
    location: [1.1263827436652036, 56.09535362032253],
    img_url: require('../assets/images/boy-box.png'),
  },
  {
    name: 'RedemptioM',
    sex: '男',
    birthday: '10-11',
    area: '深圳',
    hobby: '唱歌',
    style_lab: '为偶像加油',
    location: [-4.079166205377078, 50.33703549800893],
    img_url: require('../assets/images/boy-box.png'),
  },
  {
    name: 'CB',
    sex: '男',
    birthday: '10-11',
    area: '深圳',
    hobby: '舞蹈',
    style_lab: '为偶像加油',
    location: [-1.591512108840334, 50.09591198389606],
    img_url: require('../assets/images/boy-box.png'),
  },
  {
    name: 'ikeepers',
    sex: '男',
    birthday: '10-11',
    area: '深圳',
    hobby: '舞蹈',
    style_lab: '为偶像加油',
    location: [-1.4628986308869116, 51.646551356631875],
    img_url: require('../assets/images/boy-box.png'),
  },
  {
    name: 'suyi',
    sex: '男',
    birthday: '10-11',
    area: '深圳',
    hobby: '舞蹈',
    style_lab: '为偶像加油',
    location: [1.6283752862523215, 51.63946367596222],
    img_url: require('../assets/images/boy-box.png'),
  },
  {
    name: '鸡腿堡',
    sex: '女',
    birthday: '10-11',
    area: '深圳',
    hobby: '舞蹈',
    style_lab: '为偶像加油',
    location: [2.432302603881112, 53.71152237002181],
    img_url: require('../assets/images/girl-box.png'),
  },
  {
    name: 'milk',
    sex: '女',
    birthday: '10-11',
    area: '深圳',
    hobby: '舞蹈',
    style_lab: '为偶像加油',
    location: [-2.284799965335651, 51.58273971499065],
    img_url: require('../assets/images/girl-box.png'),
  },
  {
    name: '雷嘎',
    sex: '男',
    birthday: '10-11',
    area: '深圳',
    hobby: '舞蹈',
    style_lab: '为偶像加油',
    location: [-0.8696528443568923, 52.34408339469874],
    img_url: require('../assets/images/boy-box.png'),
  },
  {
    name: '小鹏',
    sex: '男',
    birthday: '10-11',
    area: '深圳',
    hobby: '舞蹈',
    style_lab: '为偶像加油',
    location: [-0.45583918512170385, 53.43073125359362],
    img_url: require('../assets/images/boy-box.png'),
  },
  {
    name: 'YoSun',
    sex: '男',
    birthday: '10-11',
    area: '深圳',
    hobby: '舞蹈',
    style_lab: '为偶像加油',
    location: [-1.1292361009564047, 50.73487870202834],
    img_url: require('../assets/images/boy-box.png'),
  },
  {
    name: 'cenergy',
    sex: '男',
    birthday: '10-11',
    area: '深圳',
    hobby: '舞蹈',
    style_lab: '为偶像加油',
    location: [-0.06301940295566055, 51.34911158479551],
    img_url: require('../assets/images/boy-box.png'),
  },
  {
    name: 'OuYangResume',
    sex: '男',
    birthday: '10-11',
    area: '深圳',
    hobby: '舞蹈',
    style_lab: '为偶像加油',
    location: [-0.21039338641276117, 52.11804903746392],
    img_url: require('../assets/images/boy-box.png'),
  },
  {
    name: '醋溜茶叶蛋',
    sex: '男',
    birthday: '10-11',
    area: '深圳',
    hobby: '舞蹈',
    style_lab: '为偶像加油',
    location: [0.8002234725707922, 52.24805962907644],
    img_url: require('../assets/images/boy-box.png'),
  },
];
// 地图容器，是否定位，所传信息;rerurn单个uimarker对象
function animateInfo(map, autoCenter, params) {
  const random_num = Math.floor(Math.random() * 15);
  const current = params || fans_info[random_num];
  let html = `${'<div class="content" style= "width:346px;height:313px;">'
    + '<img src="'}${current.img_url}";stlye="position: absolute;left: 0px;bottom: 0px;">`
    + '<div style=\'width:60%;height:200px;box-sizing:border-box;text-align;left;position:absolute;top:72px;left:100px;\'>'
    + '<div style=\'font-size:16px;color:#7ad5f8;display:flex;justify-content:space-between;margin-top:10px\'>'
    + `<div>姓名</div><div style="color:#fff;text-align:left;width:50%">${current.name}</div></div>`
    + '<div style=\'font-size:16px;color:#7ad5f8;display:flex;justify-content:space-between;margin-top:10px\'>'
    + `<div>性别</div><div style="color:#fff;text-align:left;width:50%">${current.sex}</div></div>`
    + '<div style=\'font-size:16px;color:#7ad5f8;display:flex;justify-content:space-between;margin-top:10px\'>'
    + `<div>生日</div><div style="color:#fff;text-align:left;width:50%">${current.birthday}</div></div>`
    + '<div style=\'font-size:16px;color:#7ad5f8;display:flex;justify-content:space-between;margin-top:10px\'>'
    + `<div>区域</div><div style="color:#fff;text-align:left;width:50%">${current.area}</div></div>`
    + '<div style=\'font-size:16px;color:#7ad5f8;display:flex;justify-content:space-between;margin-top:10px\'>'
    + `<div>爱好</div><div style="color:#fff;text-align:left;width:50%">${current.hobby}</div></div>`
    + '<div style=\'font-size:16px;color:#7ad5f8;display:flex;justify-content:space-between;margin-top:10px\'>'
    + `<div>个性签名</div><div style="color:#fff;text-align:left;width:50%">${current.style_lab}</div></div>`
    + '</div>'
    + '</div>';
  if (current.sex === '女') {
    html = `${'<div class="content" style= "width:346px;height:313px;">'
      + '<img src="'}${current.img_url}";stlye="position: absolute;left: 0px;bottom: 0px;">`
      + '<div style=\'width:60%;height:200px;box-sizing:border-box;text-align;left;position:absolute;top:72px;left:100px;\'>'
      + '<div style=\'font-size:16px;color:#e068ff;display:flex;justify-content:space-between;margin-top:10px\'>'
      + `<div>姓名</div><div style="color:#fff;text-align:left;width:50%">${current.name}</div></div>`
      + '<div style=\'font-size:16px;color:#e068ff;display:flex;justify-content:space-between;margin-top:10px\'>'
      + `<div>性别</div><div style="color:#fff;text-align:left;width:50%">${current.sex}</div></div>`
      + '<div style=\'font-size:16px;color:#e068ff;display:flex;justify-content:space-between;margin-top:10px\'>'
      + `<div>生日</div><div style="color:#fff;text-align:left;width:50%">${current.birthday}</div></div>`
      + '<div style=\'font-size:16px;color:#e068ff;display:flex;justify-content:space-between;margin-top:10px\'>'
      + `<div>区域</div><div style="color:#fff;text-align:left;width:50%">${current.area}</div></div>`
      + '<div style=\'font-size:16px;color:#e068ff;display:flex;justify-content:space-between;margin-top:10px\'>'
      + `<div>爱好</div><div style="color:#fff;text-align:left;width:50%">${current.hobby}</div></div>`
      + '<div style=\'font-size:16px;color:#e068ff;display:flex;justify-content:space-between;margin-top:10px\'>'
      + `<div>个性签名</div><div style="color:#fff;text-align:left;width:50%">${current.style_lab}</div></div>`
      + '</div>'
      + '</div>';
  }
  const options = {
    single: false,
    width: 346,
    height: 280,
    custom: true,
    autoOpenOn: null,
    content: html,
  };
  const popover = new maptalks.ui.InfoWindow(options);
  const coordinates = current.location;
  const coord = new maptalks.Point(coordinates);
  popover.addTo(map).show(coord);
  if (autoCenter) {
    map.panTo(coord);
  }
  return popover;
}

// 地图容器，是否定位，所传信息;rerurn uimarker集合
function animateRandom(map, autoCenter, start, end) {
  const fans_infoarr = fans_info.slice(start, end);
  console.log(fans_infoarr);
  const uimarkerArr = [];
  for (let i = 0; i < fans_infoarr.length; i++) {
    const current = fans_infoarr[i];
    let html = `${'<div class="content" style= "width:346px;height:313px;">'
      + '<img src="'}${current.img_url}";stlye="position: absolute;left: 0px;bottom: 0px;">`
      + '<div style=\'width:60%;height:200px;box-sizing:border-box;text-align;left;position:absolute;top:72px;left:100px;\'>'
      + '<div style=\'font-size:16px;color:#7ad5f8;display:flex;justify-content:space-between;margin-top:10px\'>'
      + `<div>姓名</div><div style="color:#fff;text-align:left;width:50%">${current.name}</div></div>`
      + '<div style=\'font-size:16px;color:#7ad5f8;display:flex;justify-content:space-between;margin-top:10px\'>'
      + `<div>性别</div><div style="color:#fff;text-align:left;width:50%">${current.sex}</div></div>`
      + '<div style=\'font-size:16px;color:#7ad5f8;display:flex;justify-content:space-between;margin-top:10px\'>'
      + `<div>生日</div><div style="color:#fff;text-align:left;width:50%">${current.birthday}</div></div>`
      + '<div style=\'font-size:16px;color:#7ad5f8;display:flex;justify-content:space-between;margin-top:10px\'>'
      + `<div>区域</div><div style="color:#fff;text-align:left;width:50%">${current.area}</div></div>`
      + '<div style=\'font-size:16px;color:#7ad5f8;display:flex;justify-content:space-between;margin-top:10px\'>'
      + `<div>爱好</div><div style="color:#fff;text-align:left;width:50%">${current.hobby}</div></div>`
      + '<div style=\'font-size:16px;color:#7ad5f8;display:flex;justify-content:space-between;margin-top:10px\'>'
      + `<div>个性签名</div><div style="color:#fff;text-align:left;width:50%">${current.style_lab}</div></div>`
      + '</div>'
      + '</div>';
    if (current.sex === '女') {
      html = `${'<div class="content" style= "width:346px;height:313px;">'
        + '<img src="'}${current.img_url}";stlye="position: absolute;left: 0px;bottom: 0px;">`
        + '<div style=\'width:60%;height:200px;box-sizing:border-box;text-align;left;position:absolute;top:72px;left:100px;\'>'
        + '<div style=\'font-size:16px;color:#e068ff;display:flex;justify-content:space-between;margin-top:10px\'>'
        + `<div>姓名</div><div style="color:#fff;text-align:left;width:50%">${current.name}</div></div>`
        + '<div style=\'font-size:16px;color:#e068ff;display:flex;justify-content:space-between;margin-top:10px\'>'
        + `<div>性别</div><div style="color:#fff;text-align:left;width:50%">${current.sex}</div></div>`
        + '<div style=\'font-size:16px;color:#e068ff;display:flex;justify-content:space-between;margin-top:10px\'>'
        + `<div>生日</div><div style="color:#fff;text-align:left;width:50%">${current.birthday}</div></div>`
        + '<div style=\'font-size:16px;color:#e068ff;display:flex;justify-content:space-between;margin-top:10px\'>'
        + `<div>区域</div><div style="color:#fff;text-align:left;width:50%">${current.area}</div></div>`
        + '<div style=\'font-size:16px;color:#e068ff;display:flex;justify-content:space-between;margin-top:10px\'>'
        + `<div>爱好</div><div style="color:#fff;text-align:left;width:50%">${current.hobby}</div></div>`
        + '<div style=\'font-size:16px;color:#e068ff;display:flex;justify-content:space-between;margin-top:10px\'>'
        + `<div>个性签名</div><div style="color:#fff;text-align:left;width:50%">${current.style_lab}</div></div>`
        + '</div>'
        + '</div>';
    }
    const options = {
      single: false,
      width: 346,
      height: 280,
      custom: true,
      autoOpenOn: null,
      content: html,
    };
    const popover = new maptalks.ui.InfoWindow(options);
    const coordinates = current.location;
    const coord = new maptalks.Point(coordinates);
    popover.addTo(map).show(coord);
    uimarkerArr.push(popover);
  }

  return uimarkerArr;
}

export {
  animateInfo,
  animateRandom,
};
