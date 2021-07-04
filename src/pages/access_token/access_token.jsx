import {
    DeleteOutlined, GithubOutlined, GitlabOutlined
} from "@ant-design/icons";
import { Card, Popconfirm, Space, Table } from "antd";
import React from "react";
import {
    getAccessTokensRequest,
    removeAccessTokensRequest
} from "../../api/access_token";
import AddToken from "./add_token";





export default class AccessToken extends React.Component {
    state = {
        tokens: [],
        kind: "all",
    };

    componentDidMount() {
        this.getAccessTokens();
    }

    getAccessTokens = async (kind) => {
        let result = await getAccessTokensRequest(kind);
        if (result) {
            this.setState({ tokens: result });
        }
    };

    removeAccessTokens = async (kind, token) => {
        let tokens = this.state.tokens;
        await removeAccessTokensRequest(kind, token);
        tokens = tokens.filter((item) => item.access_token !== token);
        this.setState({ tokens });
    };

    updateAccessToken = async (data) => {
        let tokens = [...this.state.tokens];
        tokens.unshift(data);
        this.setState({ tokens });
    };

    tabList = [
        {
            key: "all",
            tab: "全部",
        },
        {
            key: "github",
            tab: "Github",
        },
        {
            key: "gitlab",
            tab: "Gitlab",
        },
    ];

    render() {
        const dataSource = this.state.tokens;
        const columns = [
            {
                title: "Token",
                dataIndex: "access_token",
                key: "access_token",
            },
            {
                title: "类型",
                dataIndex: "kind",
                key: "kind",
                render: (kind) => (
                    <Space size="middle">
                        {kind === "gitlab" ? <GitlabOutlined /> : <GithubOutlined />}
                        {kind}
                    </Space>
                ),
            },

            {
                title: "操作",
                key: "opera",
                render: (item) => (
                    <Space size="middle">
                        <Popconfirm
                            title="您确定删除该条数据吗？删除后将无法恢复！"
                            onConfirm={() => {
                                this.removeAccessTokens(item.kind, item.access_token);
                            }}
                            okText="确定"
                            cancelText="取消"
                        >
                            <DeleteOutlined />
                        </Popconfirm>
                    </Space>
                ),
            },
        ];
        return (
            <Card
                tabBarExtraContent={
                    <AddToken updateAccessToken={this.updateAccessToken} />
                }
                tabList={this.tabList}
                activeTabKey={this.state.kind}
                onTabChange={(key) => {
                    this.setState({ kind: key });
                    this.getAccessTokens(key);
                }}
            >
                <br />
                <Table dataSource={dataSource} columns={columns} bordered rowKey="id" />
            </Card>
        );
    }
}
