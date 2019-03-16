import React from 'react';

import { renderRoutes } from 'react-router-config';
import { asyncComponent } from 'react-async-component';
import PendingRouterLoader from '../utils/router';

const Login = asyncComponent({
  resolve: () => new Promise(resolve =>
    // Webpack's code splitting API w/naming
    require.ensure([], (require) => {
      resolve(require('../views/user/login'));
    }, 'login')),
});

const Index = asyncComponent({
  resolve: () => new Promise(resolve =>
    // Webpack's code splitting API w/naming
    require.ensure([], (require) => {
      resolve(require('../views/index'));
    }, 'index')),
});

const Hexagon = asyncComponent({
  resolve: () => new Promise(resolve =>
    // Webpack's code splitting API w/naming
    require.ensure([], (require) => {
      resolve(require('../views/dashboard/Hexagon'));
    }, 'dashboard')),
});

const Cymapmain = asyncComponent({
  resolve: () => new Promise(resolve =>
    // Webpack's code splitting API w/naming
    require.ensure([], (require) => {
      resolve(require('../views/cymapMain/index'));
    }, 'cymapMain')),
});

const mainRouter = [
  {
    name: '工作区',
    key: 'index',
    path: '/index',
    component: Index,
    routes: [],
  },
  {
    name: '登录',
    key: 'login',
    path: '/login',
    component: Login,
    redirect: {
      from: '/',
      to: '/login',
    },
  },
  {
    name: '柱状图',
    key: 'hexagon',
    path: '/hexagon',
    component: Hexagon,
  },
  {
    name: '柱状图2',
    key: 'cymap',
    path: '/',
    component: Cymapmain,
  },
];

const routes = (
  <PendingRouterLoader routes={mainRouter}>
    {renderRoutes(mainRouter)}
  </PendingRouterLoader>
);

export default routes;
