import React, { Component } from 'react';
import { Modal, Form, Input } from 'antd';
const {TextArea} = Input;
const FormItem = Form.Item;

class MailModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  showModelHandler = (e) => {
    if (e) e.stopPropagation();
    this.setState({
      visible: true,
    });
  };

  hideModelHandler = () => {
    this.setState({
      visible: false,
    });
  };

  okHandler = () => {
    const { onOk } = this.props;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        onOk(values);
        this.hideModelHandler();
      }
    });
  };

  render() {
    const { children } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { subject, email, body } = this.props.record;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };

    return (
      <span>
        <span onClick={this.showModelHandler}>
          { children }
        </span>
        <Modal
          title="Show Letter"
          visible={this.state.visible}
          onOk={this.okHandler}
          onCancel={this.hideModelHandler}
        >
          <Form layout="horizontal" onSubmit={this.okHandler}>
          <FormItem
            {...formItemLayout}
            label="Subject"
          >
          {getFieldDecorator('subject', {
            initialValue: subject,

        rules: [{ required: true, message: 'Please type your subject!', whitespace: true }],
      })(
        <Input   />
      )}
          </FormItem>
            <FormItem
              {...formItemLayout}
              label="Email"
            >
              {
                getFieldDecorator('email', {
                  initialValue: email,
            rules: [{
              type: 'email', message: 'The input is not valid E-mail!',
            }, {
              required: true, message: 'Please input your E-mail!',
            }],
          })(<Input />)
              }
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="Body"
            >
            {getFieldDecorator('body', {
              initialValue: body,

          rules: [{ required: true, message: 'Please type your message!', whitespace: true }],
        })(
          <TextArea />
        )}
            </FormItem>
          </Form>
        </Modal>
      </span>
    );
  }
}

export default Form.create()(MailModal);
