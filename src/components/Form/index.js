import React from 'react';
import {Form, Input, Upload, Icon} from 'antd';
import PropTypes from 'prop-types';

const FormItem = Form.Item;

class CommonForm_ extends React.Component {
  static defaultProps = {
    handleSubmit: () => {}
  };

  static propTypes = {
    form: PropTypes.any,
    handleSubmit: PropTypes.func
  };

  constructor (props, context) {
    super(props);
    this.state = {};
  }

  handleSubmit (event) {
    const { handleSubmit } = this.props;
    event.preventDefault();
    handleSubmit(this.props.form);
  }

  normFile = (e) => {
    console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  render () {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem>
          <span>事件原因：</span>
          {getFieldDecorator('userName', {
            rules: [{ required: true, message: '请输入事件原因!' }],
          })(
            <Input placeholder="事件原因" />
          )}
        </FormItem>
        <FormItem>
          <span>现场描述：</span>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: '请输入现场描述!' }],
          })(
            <Input placeholder="现场描述" />
          )}
        </FormItem>
        <FormItem>
          <span>上报时间：</span>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: '请输入上报时间!' }],
          })(
            <Input placeholder="上报时间" />
          )}
        </FormItem>
        <FormItem
          label="拖拽上传"
        >
          <div className="dropbox">
            {getFieldDecorator('dragger', {
              valuePropName: 'fileList',
              getValueFromEvent: this.normFile,
            })(
              <Upload.Dragger name="files" action="/upload.do">
                <p className="ant-upload-drag-icon">
                  <Icon type="inbox" />
                </p>
                <p className="ant-upload-text">单击或拖动文件到该区域上载</p>
                <p className="ant-upload-hint">支持单个或批量上传。</p>
              </Upload.Dragger>
            )}
          </div>
        </FormItem>
      </Form>
    )
  }
}

const CommonForm = Form.create()(CommonForm_);

export default CommonForm;
