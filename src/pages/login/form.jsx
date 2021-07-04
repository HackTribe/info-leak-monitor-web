import { Form, Input, Button, message } from 'antd';
import {UserOutlined, LockOutlined, EyeTwoTone, EyeInvisibleOutlined} from '@ant-design/icons';

import LoginRequest from '../../api/login';
import {bindActionCreators} from 'redux';
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';
import * as Actions from "../../redux/action/login";

const LoginForm = (props) => {
    const onFinish = async (values) => {
        let result = await LoginRequest(values);
        
        if (result !== null) {
            props.loginAction(result);
            props.history.replace('/admin');
        } else {
            message.error("登录失败！",2);
        }

    };
    return (
        <Form name="basic"
            initialValues={{
                remember: false,
                }}
                onFinish={onFinish}
        >
            <Form.Item
                name="username"
                rules={[
                {
                    required: true,
                    message: '请输入用户名',
                },
                ]}
            >
                <Input  placeholder="用户名" prefix={<UserOutlined style={{color: 'rgba(0,0,0,.25)'}} />} />
            </Form.Item>

            <Form.Item
                name="password"
                rules={[
                {
                    required: true,
                    message: '请输入密码',
                },
                ]}
            >
                <Input.Password
                    placeholder="密码"
                    prefix={<LockOutlined style={{color:'rgba(0,0,0,.25)'}} />}
                    iconRender={visible => (visible 
                                            ? 
                                            <EyeTwoTone style={{color:'rgba(0,0,0,.25)'}} />
                                            : 
                                            <EyeInvisibleOutlined style={{float:'left',color:'rgba(0,0,0,.25)'}} />
                                            )
                                }
                />
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit" className="login-form-buttom">
                    登录
                </Button>
            </Form.Item>
        </Form>
    );
};

const mapStateToProps = (state) => ({user: state.userInfo});

const mapDispatchToProps = (dispatch) => (
    {
        ...bindActionCreators(Actions, dispatch),
    }
);

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(LoginForm));
