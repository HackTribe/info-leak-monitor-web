import {
  DeleteOutlined,
  GithubOutlined,
  GitlabOutlined
} from "@ant-design/icons";
import { Card, Popconfirm, Space, Table } from "antd";
import React from "react";
import {
  getWhiteListRequest,
  removeWhiteListRequest
} from "../../api/whitelist";
// import AddWhitList from './add_whitelist';
import "./css/whitelist.less";

export default class WhitList extends React.Component {
  state = {
    whitelists: [],
    kind: "all",
    per: 10,
    page: 1,
    total: -1,
  };

  componentDidMount() {
    this.getWhiteList();
  }

  getWhiteList = async (kind) => {
    let response = await getWhiteListRequest(kind);
    // console.log({
    //   whitelists: response.data,
    //   per: this.state.per,
    //   page: this.state.page,
    //   total: response.total,
    // });
    if (response.data) {
      this.setState({
        whitelists: response.data,
        per: this.state.per,
        page: this.state.page,
        total: response.total,
      });
    }
  };

  removeWhiteList = async (id) => {
    let whitelists = this.state.whitelists;
    await removeWhiteListRequest(id);
    whitelists = whitelists.filter((item) => item.id !== id);
    this.setState({ whitelists });
  };

  updateWhiteList = async (data) => {
    let whitelists = [...this.state.whitelists];
    whitelists.unshift(data);
    this.setState({ whitelists });
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
    const paginationProps = {
      showSizeChanger: false,
      showQuickJumper: false,
      showTotal: () => `共${this.state.total}条`,
      pageSize: this.state.per,
      current: this.state.page,
      total: this.state.total,
      onChange: (kind) => this.getWhiteList(kind),
    };
    const dataSource = this.state.whitelists;
    const columns = [
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
        title: "sha",
        dataIndex: "sha",
        key: "sha",
      },
      {
        title: "文件路径",
        dataIndex: "url_path",
        key: "url_path",
        className: "resultColumns",
      },
      {
        title: "最后更新时间",
        dataIndex: "url_path_last_time",
        key: "url_path_last_time",
      },

      {
        title: "操作",
        key: "opera",
        render: (item) => (
          <Space size="middle">
            <Popconfirm
              title="您确定删除该条数据吗？删除后将无法恢复！"
              onConfirm={() => {
                this.removeWhiteList(item.id);
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
        tabList={this.tabList}
        activeTabKey={this.state.kind}
        onTabChange={(key) => {
          this.setState({ kind: key });
          this.getWhiteList(key);
        }}
      >
        <br />
        <Table
          dataSource={dataSource}
          columns={columns}
          pagination={paginationProps}
          bordered
          rowKey="id"
        />
      </Card>
    );
  }
}
