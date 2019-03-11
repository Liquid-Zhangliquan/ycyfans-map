import React from 'react';
import { connect } from 'react-redux';
import { Layout, Menu, Icon, message } from 'antd';
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
      model: {}
    };

    this.menus = [
      {
        name: '页面模块',
        key: 'dashboard',
        path: '/index/dashboard',
        icon: 'pie-chart'
      },
      {
        name: '地图模块',
        key: 'resources',
        icon: 'database',
        path: '/map'
      },
      {
        name: '扩展模块',
        key: 'schedule',
        icon: 'schedule',
        path: '/plugins'
      }
    ];
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
            {this.state.collapsed ? '' : '菜单'}
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
              onMenuClick={this.handleHeaderClick}
              onCollapse={this.handleMenuCollapse}
            />
          </Header>
          <Content style={{ margin: '0 0' }}>
            <PendingRouterLoader routes={route.routes} redirect={route.redirect}>
              {renderRoutes(route.routes)}
            </PendingRouterLoader>
          </Content>
          <Footer style={{ textAlign: 'center' }}></Footer>
        </Layout>
      </Layout>
    );
  }
}

export default connect()(Index);
