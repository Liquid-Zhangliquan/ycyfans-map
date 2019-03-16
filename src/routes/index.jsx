import React from 'react';

import { renderRoutes } from 'react-router-config';
import loadable from '@loadable/component';
import PendingRouterLoader from '../utils/router';

const mainRouter = [
  {
    name: '工作区',
    key: 'index',
    path: '/index',
    component: loadable(() => import(/* webpackChunkName: 'index' */ '../views/index')),
    routes: [],
  },
  {
    name: '登录',
    key: 'login',
    path: '/login',
    component: loadable(() => import(/* webpackChunkName: 'login' */ '../views/user/login')),
    redirect: {
      from: '/',
      to: '/login',
    },
  },
  {
    name: '柱状图2',
    key: 'cymap',
    path: '/',
    component: loadable(() => import(/* webpackChunkName: 'cymapMain' */ '../views/cymapMain/index')),
  },
];

const routes = (
  <PendingRouterLoader routes={mainRouter}>
    {renderRoutes(mainRouter)}
  </PendingRouterLoader>
);

export default routes;
