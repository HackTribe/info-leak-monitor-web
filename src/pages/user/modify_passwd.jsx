import { Card } from 'antd';
import ModifyPasswordFrom from './modify_passwd_form';
const ModifyPassword = () => {
    return (
        <div className="user-manager">
          <Card title="重设密码">
            <ModifyPasswordFrom />
          </Card>
        </div>
    );
};

export default ModifyPassword;
