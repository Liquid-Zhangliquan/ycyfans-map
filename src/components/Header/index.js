import './header.scss';
import React from 'react';
import { Menu, Icon } from 'antd';
class GlobalHeader extends React.Component {
  componentWillUnmount() {
  }

  toggle () {
    const { collapsed, onCollapse } = this.props;
    onCollapse(!collapsed);
    this.triggerResizeEvent();
  };

  triggerResizeEvent () {
    const event = document.createEvent('HTMLEvents');
    event.initEvent('resize', true, false);
    window.dispatchEvent(event);
  }

  render() {
    const {
      onMenuClick,
    } = this.props;
    const menu = (
      <Menu className="header-menu" selectedKeys={[]} onClick={onMenuClick}>
        <Menu.Item disabled>
          <Icon type="user" />个人中心
        </Menu.Item>
        <Menu.Item disabled>
          <Icon type="setting" />设置
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="logout">
          <Icon type="logout" />退出登录
        </Menu.Item>
      </Menu>
    );
    return (
      <div className="header">
        Header
      </div>
    );
  }
}

export default GlobalHeader;
