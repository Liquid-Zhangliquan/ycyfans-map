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
  },
  {
    name: '柱状图',
    key: 'hexagon',
    path: '/hexagon',
    component: Hexagon,
  },
  {
    redirect: {
      from: '/',
      to: '/login',
    },
  },
];

const routes = (
  <PendingRouterLoader routes={mainRouter}>
    {renderRoutes(mainRouter)}
  </PendingRouterLoader>
);

export default routes;
