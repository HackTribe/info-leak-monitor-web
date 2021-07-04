import React, { Component } from 'react';
import { Form, Input, Select } from 'antd';

import {postAccessTokensRequest} from '../../api/access_token';
const {Option} = Select;

class SharedForm extends Component {
    handleSubmit = async(value) => {
        const result = await postAccessTokensRequest(value);
        if(result){
            this.props.updateAccessToken(result);
        }
        this.props.onSubmit();
    }
    
    render() {
        const formId = this.props.formId;
        
        return (
            <Form id ={formId} layout="horizontal"  onFinish={this.handleSubmit}>
              <Form.Item name="access_token" label="访问令牌" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item name="kind" label="所属网站" rules={[{ required: true }]}>
                <Select
                  allowClear
                >
                  <Option value="github">github</Option>
                  <Option value="gitlab">gitlab</Option>
                </Select>
              </Form.Item>
            </Form>
        );
    }
}

export default SharedForm;
