import React from 'react';

import { renderRoutes } from 'react-router-config'
import { asyncComponent } from 'react-async-component';
// const Login = asyncComponent(() => import(/* webpackChunkName: "login" */ '../views/user/login'));
// const Index = asyncComponent(() => import(/* webpackChunkName: "index" */ '../views/index'));
import PendingRouterLoader from '../utils/router';

const Login = asyncComponent({
  resolve: () => new Promise(resolve =>
    // Webpack's code splitting API w/naming
    require.ensure(
      [],
      (require) => {
        resolve(require('../views/user/login'));
      },
      'login'
    )
  )
});

const Index = asyncComponent({
  resolve: () => new Promise(resolve =>
    // Webpack's code splitting API w/naming
    require.ensure(
      [],
      (require) => {
        resolve(require('../views/index'));
      },
      'index'
    )
  )
});

const mainRouter = [
  {
    name: '工作区',
    key: 'index',
    path: '/index',
    component: Index,
    routes: [],
    redirect: {
      from: '/',
      to: '/login'
    }
  },
  {
    name: '登录',
    key: 'login',
    path: '/login',
    component: Login
  }
];

const routes = (
  <PendingRouterLoader routes={mainRouter}>
    {renderRoutes(mainRouter)}
  </PendingRouterLoader>
);

export default routes;
