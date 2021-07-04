import React from 'react';
import { Modal, Button } from 'antd';
import {
    PlusCircleOutlined
} from '@ant-design/icons';


import FormModal from './shared_form';

export default class AddToken extends React.Component {
    
    state = {
        visible: false,
    };
    
    setModalVisible(visible) {
        this.setState({ visible });
    }

    handleSubmit = (values) => {  
        this.setModalVisible(false);
    };
    
    render() {
        return (
            <>
              <Button type="primary" icon={<PlusCircleOutlined />} onClick={() => this.setModalVisible(true)}>
                添加
              </Button>
              <Modal
                title="添加Token"
                centered
                visible={this.state.visible}
                onCancel={() => this.setModalVisible(false)}
                okButtonProps={{htmlType: 'submit', form: 'editForm'}}
                destroyOnClose
              >
                <FormModal formId="editForm" onSubmit={this.handleSubmit} updateAccessToken={this.props.updateAccessToken} />
              </Modal>
            </>
        );
    }
}
