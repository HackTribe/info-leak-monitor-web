import { Breadcrumb, Button, Layout } from "antd";
import { connect } from "react-redux";
import { Redirect, Route, Switch, withRouter } from "react-router-dom";
import { MenuList, menuList } from "../../config/menu.js";
import { logoutAction } from "../../redux/action/login";
import AccessToken from "../access_token/access_token";
import Home from "../home/home";
import TaskResults from "../tasks/results";
import Tasks from "../tasks/tasks";
import ModifyPassword from "../user/modify_passwd";
import WhiteList from "../whitlist/whitelist";
import "./css/admin.less";

const { Header, Content, Footer, Sider } = Layout;

const Admin = (props) => {
    let { username, isLogin } = props.userInfo;

    const logout = (e) => {
        props.logoutAction();
    };

    const getTitle = () => {
        let { pathname } = props.location;

        let pathKey = "";
        if (pathname.indexOf("tasks/lists") !== -1) {
            pathKey = "list";
        } else if (pathname.indexOf("tasks/lists") !== -1) {
            pathKey = "results";
        } else {
            pathKey = pathname.split("/").reverse()[0];
        }

        let title = [];
        menuList.forEach((item) => {
            if (item.children instanceof Array) {
                let tmp = item.children.find((c_item) => {
                    return c_item.key === pathKey;
                });

                if (tmp) {
                    title.push(item.title);
                    title.push(tmp.title);
                }
            } else {
                if (pathKey === item.key) title.push(item.title);
            }
        });

        return title;
    };

    if (!isLogin) {
        return <Redirect to="/login" />;
    } else {
        return (
            <div className="admin">
                <Layout style={{ minHeight: "100vh" }}>
                    <Sider collapsible={true}>
                        <div className="logo">
                            <h1>HackTribe</h1>
                        </div>
                        <MenuList />
                    </Sider>
                    <Layout className="site-layout">
                        <Header className="site-layout-background">
                            <div className="header-top">
                                欢迎，{username}
                                <Button type="link" size="small" onClick={logout}>
                                    退出登录
                </Button>
                            </div>
                        </Header>
                        <Content style={{ margin: "0 16px" }}>
                            <Breadcrumb style={{ margin: "16px 0" }}>
                                {getTitle().map((item) => {
                                    return <Breadcrumb.Item key={item}>{item}</Breadcrumb.Item>;
                                })}
                            </Breadcrumb>
                            <Switch>
                                <Route path="/admin/home" component={Home} />
                                <Route path="/admin/tasks/list" component={Tasks} />
                                <Route path="/admin/tasks/results" component={TaskResults} />
                                <Route
                                    path="/admin/account/access_token"
                                    component={AccessToken}
                                />
                                <Route
                                    path="/admin/modify-password"
                                    component={ModifyPassword}
                                />
                                <Route path="/admin/whitelist" component={WhiteList} />
                                <Redirect to="/admin/home" />
                            </Switch>
                        </Content>
                        <Footer style={{ textAlign: "center" }}>
                            Copyright ©2020 hacktribe.org
            </Footer>
                    </Layout>
                </Layout>
            </div>
        );
    }
};

const mapStateToProps = (state) => ({ userInfo: state.userInfo });

export default connect(mapStateToProps, {
    logoutAction,
})(withRouter(Admin));
