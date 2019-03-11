import React from 'react';
import { renderRoutes } from 'react-router-config'
import Login from '../views/user/login';
import Index from '../views/index';
import PendingRouterLoader from '../utils/router';

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
