import {
  GithubOutlined,
  GitlabOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import { Avatar, BackTop, Card, Comment, List, Spin, Tag, Tooltip } from "antd";
import moment from "moment";
import React from "react";
import Highlighter from "react-highlight-words";
import InfiniteScroll from "react-infinite-scroller";
import sanitize from "sanitize-html";
import { getTaskResultsRequest, processLeakRequest } from "../../api/task";
import "./css/results.less";
import SearchForm from "./search";

export default class TaskResults extends React.Component {
  state = {
    results: [],
    loading: false,
    hasMore: true,
    kind: "all",
    keyword: "",
    filed: "",
    page: 1,
    per: 10,
    total: 0,
  };

  componentDidMount() {
    this.getTaskResults({
      kind: this.state.kind,
      page: this.state.page,
      per: this.state.per,
    });
  }
  response = (data) => {
    let total = data.headers["x-total-count"];
    if (total)
      // console.log(data, "....", total);
      this.setState({ total: total });
  };
  getTaskResults = async (data) => {
    let results = await getTaskResultsRequest(data, this.response);
    if (results) {
      // let total = results.total;
      // let tmp = [...this.state.results, ...results.data];
      // results = this.mergeTaskResults(tmp);
      this.setState({ results: results.data, total: results.total });
    }
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

  unique = (arr) => {
    return Array.from(new Set(arr));
  };

  mergeTaskResults = (arr) => {
    let results = [];
    for (let item of arr) {
      let flag = true;
      for (let tmp of results) {
        if (item.id === tmp.id) {
          flag = false;
        }
      }

      if (flag) {
        results.push(item);
      }
    }
    return results;
  };

  loadTaskResults = async (props) => {
    let { results, page } = this.state;
    let data = await getTaskResultsRequest(props, this.response);
    if (data.data.length) {
      let tmp = [...results, ...data.data];
      results = this.mergeTaskResults(tmp);
      this.setState({
        results: results,
        loading: false,
        total: data.total,
        page: page + 1,
      });
    } else {
      this.setState({
        loading: false,
      });
    }
  };

  handleInfiniteOnLoad = () => {
    this.setState({
      loading: true,
    });

    this.loadTaskResults({
      kind: this.state.kind,
      field: this.state.field,
      keyword: this.state.keyword,
      page: this.state.page,
      per: this.state.per,
    });
  };

  removeTaskResults = (id) => {
    let results = [...this.state.results];
    results = results.filter((item) => item.id !== id);
    this.setState({ results: results, total: this.state.total - 1 });
  };

  processLeak = async (data) => {
    await processLeakRequest(data);
    if (data) {
      this.removeTaskResults(data.id);
    }
  };

  warpTag = (item) => {
    const val = `<span style="color:red;">${item.leakiest}</span>`;
    const regS = new RegExp(item.leakiest, "gi");
    let fragment = sanitize(item.fragment.replaceAll(regS, val), {
      allowedTags: ["span"],
    });
    return fragment;
  };

  toFirstUpperCase = (item) => {
    return item.kind.charAt(0).toUpperCase() + item.kind.slice(1);
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

  onSearch = (value) => {
    this.getTaskResults({
      kind: this.state.kind,
      field: value.search_field,
      keyword: value.keyword,
    });

    this.setState({ field: value.search_field, keyword: value.keyword });
  };

  render() {
    return (
      <>
        <SearchForm searching={this.onSearch} keyword={this.state.keyword} />

        <Card
          tabList={this.tabList}
          activeTabKey={this.state.kind}
          onTabChange={(key) => {
            this.setState({
              kind: key,
              page: 1,
              per: 10,
              results: [],
              keyword: "",
            });
            this.getTaskResults({ kind: key, per: 10, page: 1 });
          }}
          tabBarExtraContent={<span>当前监测到{this.state.total}条数据</span>}
        >
          <div className="infinite-container">
            <InfiniteScroll
              initialLoad={false}
              pageStart={0}
              loadMore={this.handleInfiniteOnLoad}
              hasMore={!this.state.loading && this.state.hasMore}
              useWindow={true}
            >
              <BackTop />
              <List
                dataSource={this.state.results}
                renderItem={(item) => (
                  <List.Item>
                    <Comment
                      key={item.id}
                      actions={
                        item.is_white || item.ignore || item.is_process
                          ? [
                              <Tooltip key="comment-basic-like" title="已处理">
                                已处理
                              </Tooltip>,
                            ]
                          : [
                              <Tooltip
                                key="comment-basic-like"
                                title="加入白名单"
                              >
                                <span
                                  onClick={() => {
                                    this.processLeak({
                                      id: item.id,
                                      state_type: 1, // 处理白名单
                                    });
                                  }}
                                >
                                  <span className="comment-action">
                                    加入白名单
                                  </span>
                                </span>
                              </Tooltip>,
                              <Tooltip key="comment-basic-like" title="忽略">
                                <span
                                  key="comment-basic-reply-to"
                                  onClick={() => {
                                    this.processLeak({
                                      id: item.id,
                                      state_type: 0, // 忽略
                                    });
                                  }}
                                >
                                  忽略
                                </span>
                              </Tooltip>,
                              <Tooltip key="comment-basic-like" title="处理">
                                <span
                                  key="comment-basic-reply-to"
                                  onClick={() => {
                                    this.processLeak({
                                      id: item.id,
                                      state_type: 2, // 处理
                                    });
                                  }}
                                >
                                  处理
                                </span>
                              </Tooltip>,
                            ]
                      }
                      author={
                        <div className="author">
                          <span>
                            <a
                              href={item.repo_url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {item.user_name}/{item.repo_name}
                            </a>
                          </span>
                          <span>&nbsp;-&nbsp;</span>
                          <span>
                            <a
                              href={item.html_url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {item.file_name}
                            </a>
                          </span>
                          <Tag className="count">{item.leak_count}</Tag>
                          <br />
                          <span className="data_time">
                            <span>
                              首次监测时间：
                              {moment(item.create_time).format(
                                "YYYY-MM-DD HH:mm:ss"
                              )}
                            </span>
                            <span>
                              最新监测时间：
                              {moment(item.update_time).format(
                                "YYYY-MM-DD HH:mm:ss"
                              )}
                            </span>
                            <span>
                              文件内容时间：
                              {moment(item.last_modified).format(
                                "YYYY-MM-DD HH:mm:ss"
                              )}
                            </span>
                          </span>
                        </div>
                      }
                      avatar={
                        <a href={item.user_url}>
                          <Avatar src={item.user_avatar} alt={item.user_name} />
                        </a>
                      }
                      content={
                        <div>
                          <p className="data_tags">
                            <Tag icon={this.getIcon(item.kind)} color="#55acee">
                              {this.toFirstUpperCase(item)}
                            </Tag>
                            <Tag color="#55acee">{item.leakiest}</Tag>
                          </p>

                          <p className="code_fragment">
                            <Highlighter
                              highlightClassName="leakiest_mark"
                              searchWords={[item.leakiest]}
                              autoEscape={true}
                              textToHighlight={item.fragment}
                            />
                          </p>
                        </div>
                      }
                    />
                  </List.Item>
                )}
              >
                {this.state.loading && this.state.hasMore && (
                  <div className="loading-container">
                    <Spin />
                  </div>
                )}
              </List>
            </InfiniteScroll>
          </div>
        </Card>
      </>
    );
  }
}
