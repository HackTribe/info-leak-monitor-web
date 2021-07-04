import React from 'react';
import {
    Button,
    Form,
    Input,
    Card,
    Select
} from 'antd';


import "./css/results.less";
const { Option } = Select;

const SearchForm = ({ searching, keyword }) => {
    const [form] = Form.useForm();

    return (
        <Card className="searchCard">
          <div className="search">
            <Form
              form={form}
              name="search_form"
              layout="inline"
              initialValues={{"search_field":"user_name",
                              "keyword": keyword}}
              onFinish={(value)=>{
                  searching(value);
              }}
            >
              <Form.Item name="search_field"
                         rules={[{ required: true,message:"选择搜索字段" }]}>
                <Select allowClear>
                  <Option value="user_name">用户名</Option>
                  <Option value="repo_name">仓库名</Option>
                  <Option value="leakiest">关键字</Option>
                </Select>
              </Form.Item>
              <Form.Item name="keyword" rules={[{ required: true,message:"必须输入关键字" }]}>
                <Input type="text" allowClear />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  搜索
                 </Button>
               </Form.Item>
             </Form>
             
           </div>
         </Card>
     );
     
};

export default SearchForm;
