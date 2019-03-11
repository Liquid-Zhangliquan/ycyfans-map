import React from 'react';
import { connect } from 'react-redux';
import { Layout, Menu, Icon, message, Button } from 'antd';
import GlobalHeader from '../components/Header';
import pathToRegexp from 'path-to-regexp';
import PropTypes from 'prop-types';
import PendingRouterLoader from '../utils/router';
import { urlToList } from '../utils/common';
import { renderRoutes } from "react-router-config";
const { Header, Content, Footer, Sider } = Layout;
const SubMenu = Menu.SubMenu;

const getMenuMatchKeys = (flatMenuKeys, paths) => {
  return paths.reduce(
    (matchKeys, path) =>
      matchKeys.concat(flatMenuKeys.filter(item => pathToRegexp(item).test(path))),
    []
  )
};

class Index extends React.Component {
  // static mapStateToProps = function (state) {
  //   console.log(state, this);
  // };

  static propTypes = {
    store: PropTypes.any,
    history: PropTypes.object,
    route: PropTypes.any,
    dispatch: PropTypes.any,
    currentUser: PropTypes.object,
    fetchingNotices: PropTypes.any,
    notices: PropTypes.any,
    location: PropTypes.object
  };

  static contextTypes = {
    store: PropTypes.object
  };

  constructor (props, context) {
    super(props, context);
    this.state = {
      collapsed: false,
      notices: [],
      model: {
        title: '',
        confirmLoading: false,
        width: 360,
        content: '',
        visible: false,
        footer: ''
      }
    };

    this.menus = [];

    this.context.store.subscribe(() => {
      const _data = this.context.store.getState()['notice'];
      _data.then(res => {
        this.setState({
          notices: res
        })
      });
    });
  }

  // 组件已经加载到dom中
  componentDidMount () {
  }

  toggleCollapse = () => {
    this.setState({
      collapsed: !this.state.collapsed
    });
  };

  handleMenuClick = ({ item, key }) => {
    const { history } = this.props;
    history.push(key);
  };

  handleNoticeVisibleChange = (visible) => {
    const { dispatch } = this.props;
    if (visible) {
      dispatch({
        type: 'ACTION_NOTICE',
      });
    }
  };

  handleNoticeClear = (type) => {
    message.success(`清空了${type}`);
    const { dispatch } = this.props;
    dispatch({
      type: 'global/clearNotices',
      payload: type,
    });
  };

  getMenus = () => {
    let selectedKeys = this.getSelectedMenuKeys();
    if (!selectedKeys.length) {
      // selectedKeys = [openKeys[openKeys.length - 1]];
    }
    return <Menu
      theme="dark"
      defaultSelectedKeys={['dashboard']}
      mode="inline"
      onClick={this.handleMenuClick}
      selectedKeys={selectedKeys}
      style={{ padding: '16px 0', width: '100%' }}>
      {this.getMenuItems(this.menus)}
    </Menu>
  };

  getMenuItems = menusData => {
    if (!menusData) {
      return [];
    }
    return menusData
      .map(item => {
        return this.getSubMenuOrItem(item);
      })
      .filter(item => item);
  };

  getSubMenuOrItem = item => {
    if (item.children && item.children.some(child => child.name)) {
      const childrenItems = this.getMenuItems(item.children);
      // 当无子菜单时就不展示菜单
      if (childrenItems && childrenItems.length > 0) {
        return (
          <SubMenu
            title={
              item.icon ? (
                <span>
                  <Icon type={item.icon} />
                  <span>{item.name}</span>
                </span>
              ) : (
                item.name
              )
            }
            key={item.path}>
            {childrenItems}
          </SubMenu>
        );
      }
      return null;
    } else {
      return (
        <Menu.Item key={item.path}>
          {
            item.icon ? (
              <Icon type={item.icon} />
            ) : (null)
          }
          <span>{item.name}</span>
        </Menu.Item>
      );
    }
  };

  handleHeaderClick = ({ key }) => {
    const { dispatch, history } = this.props;
    if (key === 'logout') {
      dispatch({
        type: 'login/logout',
      });
      history.push('/login')
    }
  };

  handleMenuCollapse = () => {};

  getFlatMenuKeys = menu =>
    menu.reduce((keys, item) => {
      keys.push(item.path);
      if (item.children) {
        return keys.concat(this.getFlatMenuKeys(item.children));
      }
      return keys;
    }, []);

  // Get the currently selected menu
  getSelectedMenuKeys = () => {
    const {
      location: { pathname },
    } = this.props;
    return getMenuMatchKeys(this.getFlatMenuKeys(this.menus), urlToList(pathname));
  };

  hideModal = () => {
    this.setState({
      model: {
        visible: false
      }
    });
  };

  render () {
    const { route } = this.props;
    const {
      width, title, content,
      visible, footer, className
    } = this.state.model;
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Sider
          className="main-sider"
          collapsible
          width={210}
          trigger={null}
          collapsed={this.state.collapsed}
          onCollapse={this.onCollapse}>
          <div className="main-logo">
            {this.state.collapsed ? '' : '事件管理系统'}
            <Icon
              className="main-trigger"
              type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
              onClick={this.toggleCollapse}/>
          </div>
          {this.getMenus(this.menus)}
        </Sider>
        <Layout>
          <Header style={{ padding: 0, height: 50 }}>
            <GlobalHeader
              collapsed={this.state.collapsed}
              notices={this.state.notices}
              onNoticeClear={this.handleNoticeClear}
              onMenuClick={this.handleHeaderClick}
              onCollapse={this.handleMenuCollapse}
              onNoticeVisibleChange={this.handleNoticeVisibleChange}
            />
          </Header>
          <Content style={{ margin: '0 0' }}>
            <PendingRouterLoader routes={route.routes} redirect={route.redirect}>
              {renderRoutes(route.routes)}
            </PendingRouterLoader>
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            HDSXTECH ©2018 河南省联网中心
          </Footer>
        </Layout>
      </Layout>
    );
  }
}

export default connect()(Index);
