import { createAction } from 'redux-actions';

import { ACTION_LOGIN } from '../mutation-types';

export const login = createAction(ACTION_LOGIN, (...props) => props);
