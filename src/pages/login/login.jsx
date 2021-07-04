import React from "react";
import { connect } from "react-redux";
import { withRouter, Redirect } from 'react-router-dom';
import LoginForm from './form';
import './css/login.less';

const Login = (props) => {
    if (props.userInfo.isLogin) {
        return (
            <Redirect to="/admin/home" />
        );
    } else {
        return (
            <div className="login">
                <header>
                    <h1>信息泄露监测系统</h1>
                </header>
                <section>
    
                    <h1>用户登录</h1>
                    <LoginForm />
    
                </section>
            </div>
        );
    }
    
};

const mapStateToProps = (state) => ({userInfo: state.userInfo});

export default connect(mapStateToProps,{})(withRouter(Login));
