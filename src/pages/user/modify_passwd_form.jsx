import React, { Component } from 'react';
import { Form, Input,Button } from 'antd';
import {updateUserPasswordRequest} from '../../api/user';
const tailFormItemLayout = {
    wrapperCol: {
        xs: {
            span: 24,
            offset: 0,
        },
        sm: {
            span: 16,
            offset: 8,
        },
    },
};

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
    },
};

class ModifyPasswordFrom extends Component {
    handleSubmit = async(value) => {
        await updateUserPasswordRequest(value);
    }
    
    render() {
        
        return (
            <Form layout="horizontal" {...formItemLayout} onReset={(e)=>{
                console.log(e);
            }} onFinish={this.handleSubmit}>
              <Form.Item name="old_password"
                         label="旧密码"
                         rules={[{ required: true,message:"旧密码不能为空！" }]}>
                <Input.Password placeholder="Old Password" />
              </Form.Item>
              <Form.Item name="new_password"
                         label="新密码"
                         rules={[{ required: true,message:"新密码不能为空！" }]}>
                <Input.Password placeholder="New Password" />
              </Form.Item>
              <Form.Item name="confirm_password"
                         dependencies={['new_password']}
                         label="确认密码"
                         rules={[
                             {
                                 required: true,
                                 message: '确认密码与新密码必须相同!',
                             },
                             ({ getFieldValue }) => ({
                                 validator(rule, value) {
                                     if (!value || getFieldValue('new_password') === value) {
                                         return Promise.resolve();
                                     }
                                     return Promise.reject('确认密码与新密码不相同!');
                                 },
                             })
                         ]}>
                <Input.Password placeholder="Repeat New Password" />
              </Form.Item>
              <Form.Item {...tailFormItemLayout}>
                <Button type="primary" htmlType="submit" className="modify-passowd-submit">提交</Button>
              </Form.Item>
            </Form>

            
        );
    }
}

export default ModifyPasswordFrom;
