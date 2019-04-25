import './login.scss';
import * as React from 'react';
import { connect } from 'react-redux';
import {
  Form, Icon, Input, Button, Checkbox,
} from 'antd';
import PropTypes from 'prop-types';

const FormItem = Form.Item;
class LoginForm extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onchange = this.onchange.bind(this);
    this.state = {
      type: 'account',
      autoLogin: true,
    };
  }

  onchange = (event) => {
    const { autoLogin } = this.state;
    console.log(event, autoLogin);
  };

  handleSubmit(e) {
    const { form } = this.props;
    e.preventDefault();
    form.validateFields((err, values) => {
      if (!err) {
        const { type } = this.state;
        const { dispatch, history } = this.props;
        if (!err) {
          history.push('/index/dashboard');
          dispatch({
            type: 'ACTION_LOGIN',
            payload: {
              ...values,
              type,
            },
          });
        }
        console.log('Received values of form: ', values);
      }
    });
  }

  render() {
    const { form: { getFieldDecorator } } = this.props;
    return (
      <div className="login">
        <div className="login-form">
          <h1 className="login-form__title">用户登录</h1>
          <Form onSubmit={this.handleSubmit}>
            <FormItem>
              {getFieldDecorator('userName', {
                rules: [{ required: true, message: '请输入用户名!' }],
              })(
                <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="用户名" />,
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('password', {
                rules: [{ required: true, message: '请输入密码!' }],
              })(
                <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="密码" />,
              )}
            </FormItem>
            <FormItem className="form-item-remember">
              {getFieldDecorator('remember', {
                valuePropName: 'checked',
                initialValue: true,
              })(
                <Checkbox onChange={this.onchange}>记住我</Checkbox>,
              )}
            </FormItem>
            <FormItem>
              <Button type="primary" htmlType="submit" className="login-form-button">登录</Button>
            </FormItem>
          </Form>
        </div>
      </div>
    );
  }
}

LoginForm.propTypes = {
  dispatch: PropTypes.any,
  history: PropTypes.any,
};

const Login = Form.create()(LoginForm);

export default connect()(Login);
