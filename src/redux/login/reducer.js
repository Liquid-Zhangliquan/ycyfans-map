import { handleActions } from 'redux-actions';
import { ACTION_LOGIN } from '../mutation-types';

export default handleActions({
  [ACTION_LOGIN]: (state, action) => Object.assign({}, state, action.payload),
}, {
  userName: '',
  password: '',
  remember: true,
});
