import {
  DeleteOutlined,

  // StopOutlined,
  // PlayCircleOutlined,
  EditOutlined,
  GithubOutlined,
  GitlabOutlined,
  GlobalOutlined,
  QuestionCircleFilled,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Form,
  Input,
  message,
  Modal,
  Popconfirm,
  Radio,
  Select,
  Space,
  Table,
  Tooltip,
} from "antd";
import React from "react";
import {
  getTasksRequest,
  postTaskRequest,
  putTaskRequest,
  removeTaskRequest,
} from "../../api/task";

const { Option } = Select;

const CollectionCreateForm = ({
  visible,
  submitMap,
  onCancel,
  currentDetailData,
}) => {
  const [form] = Form.useForm();
  const layout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 18 },
  };
  let initValues = currentDetailData;
  form.setFieldsValue(initValues);

  return (
    <Modal
      forceRender
      visible={visible}
      title="任务编辑"
      onCancel={() => {
        onCancel();
        form.resetFields();
      }}
      width={800}
      destroyOnClose
      initialValues={initValues}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            form.resetFields();
            form.setFieldsValue(values);
            submitMap(values);
          })
          .catch((info) => {
            message.warn("标记*是必填项！");
          });
      }}
    >
      <Form form={form} {...layout} preserve={false}>
        <Form.Item label="ID" name="id" style={{ display: "none" }}>
          <Input disabled />
        </Form.Item>
        <Form.Item name="name" label="任务名字" rules={[{ required: true }]}>
          <Input placeholder="任务名字" />
        </Form.Item>
        <Form.Item name="kind" label="所属网站" rules={[{ required: true }]}>
          <Select allowClear style={{ width: "250px" }}>
            <Option value="github">github</Option>
            <Option value="gitlab">gitlab</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="keywords"
          label="关键字"
          rules={[{ required: true, message: "必须填写，不允许为空！" }]}
        >
          <Input.TextArea
            className="keywords"
            style={{ height: "200px" }}
            placeholder="关键字必须以逗号分割"
          />
        </Form.Item>
        <Form.Item name="excludes" label="忽略关键字">
          <Input.TextArea
            className="keywords"
            style={{ height: "200px" }}
            placeholder="忽略关键字必须以逗号分割"
          />
        </Form.Item>
        <Form.Item label="最大页数">
          <Form.Item
            name="pages"
            noStyle
            rules={[{ required: true, message: "gthub默认为最大1000页" }]}
          >
            <Input placeholder="1000" style={{ width: "150px" }} />
          </Form.Item>
          <Tooltip title="注意：github最大页数不能超过1000页。" color="#108ee9">
            <QuestionCircleFilled style={{ paddingLeft: "10px" }} />
          </Tooltip>
        </Form.Item>
        <Form.Item label="运行类型">
          <Form.Item
            name="runtime_type"
            noStyle
            rules={[{ required: true, message: "必须选择任务运行类型" }]}
          >
            <Radio.Group>
              <Radio value={1}>周期任务</Radio>
              <Radio value={2}>定时任务</Radio>
            </Radio.Group>
          </Form.Item>
          <Tooltip
            title="周期任务时间最小单位为分钟，注意：定时任务采用的是linux系统CRON语法，如：(*/1 * * * *)每分钟执行一次"
            color="#108ee9"
          >
            <QuestionCircleFilled />
          </Tooltip>
        </Form.Item>

        <Form.Item
          name="runtime"
          label="运行时间"
          rules={[
            { required: true, message: "最小单位按分钟计算或者cron语法" },
          ]}
        >
          <Input placeholder="60 or (* * * * *) for Linux cron" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default class Tasks extends React.Component {
  state = {
    tasks: [],
    visible: false,
    currentDetailData: {},
    kind: "all",
  };

  componentDidMount() {
    this.getTasks();
  }

  getTasks = async (kind) => {
    const tasks = await getTasksRequest(kind);
    if (tasks) {
      this.setState({ tasks: tasks, kind: kind });
    }
  };

  addTask = async (data) => {
    let tasks = [...this.state.tasks];
    tasks.unshift(data);
    this.setState({ tasks });
  };

  updateTask = async (value) => {
    let tasks = [];
    this.state.tasks.map((item) => {
      if (item.id === value.id) {
        item = Object.assign(item, value);
      }
      tasks.push(item);
      return item;
    });

    this.setState({ tasks });
  };

  removeTask = async (id) => {
    let tasks = this.state.tasks;
    await removeTaskRequest(id);
    tasks = tasks.filter((item) => item.id !== id);
    this.setState({ tasks });
  };

  getIcon(kind) {
    switch (kind) {
      case "github":
        return <GithubOutlined />;
      case "gitlab":
        return <GitlabOutlined />;
      default:
        return <GlobalOutlined />;
    }
  }

  onCreate = async (values) => {
    if (typeof values.keywords === "string") {
      values.keywords = values.keywords.split(",");
    }

    if (typeof values.excludes === "string") {
      values.excludes = values.excludes.split(",");
    }

    let result = null;
    if (values.id) {
      result = await putTaskRequest(values);
      this.updateTask(values);
    } else {
      result = await postTaskRequest(values);
      this.addTask(result);
    }
    if (result) {
      this.changeVisible(false);
    }
  };

  changeVisible = (status, item) => {
    this.setState({
      visible: status,
    });
    if (item !== undefined) {
      this.setState({
        currentDetailData: item,
      });
    }
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
    const dataSource = this.state.tasks;

    const columns = [
      {
        title: "任务名称",
        dataIndex: "name",
        key: "name",
      },
      {
        title: "类型",
        dataIndex: "kind",
        key: "kind",
        render: (kind) => (
          <Space size="middle">
            {this.getIcon(kind)}
            {kind}
          </Space>
        ),
      },
      {
        title: "间隔时间",
        dataIndex: "runtime",
        key: "runtime",
      },
      {
        title: "最大页数",
        dataIndex: "pages",
        key: "pages",
      },

      {
        title: "操作",
        key: "opera",
        render: (item) => (
          <Space size="middle">
            <EditOutlined
              style={{ cursor: "pointer" }}
              onClick={() => {
                this.changeVisible(true, item);
              }}
            />
            <Popconfirm
              title="您确定删除该条数据吗？删除后将无法恢复！"
              onConfirm={(e) => {
                this.removeTask(item.id);
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
          <Button
            type="primary"
            onClick={() => {
              this.setState({ currentDetailData: {} });
              this.changeVisible(true, {});
            }}
          >
            添加
          </Button>
        }
        tabList={this.tabList}
        activeTabKey={this.state.kind}
        onTabChange={(key) => {
          this.setState({ kind: key });
          this.getTasks(key);
        }}
      >
        <CollectionCreateForm
          visible={this.state.visible}
          submitMap={this.onCreate}
          onCancel={() => {
            this.setState({ currentDetailData: {} });
            this.changeVisible(false);
          }}
          currentDetailData={this.state.currentDetailData}
        />
        <br />
        <Table
          dataSource={dataSource.data}
          columns={columns}
          bordered
          rowKey="id"
          expandable={{
            expandedRowRender: (record) => (
              <div>
                <p
                  style={{
                    margin: 0,
                    overflow: "hidden",
                    wordBreak: "break-all",
                    textOverflow: "ellipsis",
                  }}
                >
                  关键字：{record.keywords}
                </p>
                <p
                  style={{
                    margin: 0,
                    overflow: "hidden",
                    wordBreak: "break-all",
                    textOverflow: "ellipsis",
                  }}
                >
                  忽略：{record.excludes}
                </p>
              </div>
            ),
          }}
        />
      </Card>
    );
  }
}
