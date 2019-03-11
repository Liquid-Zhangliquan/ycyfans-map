import { handleActions } from 'redux-actions';
import { ACTION_LOGIN } from '../mutation-types';

export default handleActions({
  [ACTION_LOGIN]: (state, action) => {
    console.log(action)
    return Object.assign({}, state, action.payload)
  }
}, {
  userName: '',
  password: '',
  remember: true
})
