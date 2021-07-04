import {
    AppstoreOutlined,



    BlockOutlined, LockOutlined, MenuFoldOutlined,
    OrderedListOutlined,





    UnlockOutlined, UnorderedListOutlined, UserOutlined
} from "@ant-design/icons";
import { Menu } from "antd";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import { setTitle } from "../redux/action/title";



const { SubMenu, Item } = Menu;
const menuList = [
    {
        title: "仪表盘",
        key: "home",
        icon: <AppstoreOutlined />,
        path: "/admin/home",
    },
    {
        title: "任务管理",
        key: "tasks",
        icon: <MenuFoldOutlined />,
        children: [
            {
                title: "任务列表",
                key: "list",
                icon: <UnorderedListOutlined />,
                path: "/admin/tasks/list",
            },
            {
                title: "任务结果",
                key: "results",
                icon: <OrderedListOutlined />,
                path: "/admin/tasks/results",
            },
        ],
    },
    {
        title: "白名单列表",
        key: "whitelist",
        icon: <UnlockOutlined />,
        path: "/admin/whitelist",
    },

    {
        title: "访问令牌",
        key: "account",
        icon: <BlockOutlined />,
        children: [
            {
                title: "令牌列表",
                key: "access_token",
                icon: <LockOutlined />,
                path: "/admin/account/access_token",
            },
        ],
    },
    {
        title: "修改密码",
        key: "modify-password",
        icon: <UserOutlined />,
        path: "/admin/modify-password",
    },
];

const MenuList = connect((state) => ({ state: state.title }), {
    setTitle: setTitle,
})(
    withRouter((props) => {
        const createMenuList = (target) => {
            return target.map((item) => {
                if (!item.children) {
                    return (
                        <Item
                            key={item.key}
                            icon={item.icon}
                            onClick={() => {
                                props.setTitle(item.title);
                            }}
                        >
                            <Link to={item.path}>{item.title}</Link>
                        </Item>
                    );
                } else {
                    return (
                        <SubMenu key={item.key} icon={item.icon} title={item.title}>
                            {createMenuList(item.children)}
                        </SubMenu>
                    );
                }
            });
        };
        let { pathname } = props.location;
        let selectKey;
        if (pathname.indexOf("tasks/list") !== -1) {
            selectKey = "list";
        } else if (pathname.indexOf("tasks/results") !== -1) {
            selectKey = "results";
        } else {
            selectKey = pathname.split("/").reverse()[0];
        }

        return (
            <Menu
                theme="dark"
                defaultSelectedKeys={selectKey}
                mode="inline"
                defaultOpenKeys={props.location.pathname.split("/").splice(2)}
            >
                {createMenuList(menuList)}
            </Menu>
        );
    })
);

export { MenuList, menuList };
