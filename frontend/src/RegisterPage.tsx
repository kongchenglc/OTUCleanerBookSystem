import { LoginForm, ProConfigProvider, ProFormText, ProFormRadio } from '@ant-design/pro-components';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { VITE_API_URL } from './constant';

type RegisterFormValues = {
  username: string;
  password: string;
  confirmPassword: string;
  lastname: string;
  firstname: string;
  email: string;
  role: string;
};

export default () => {
  const API_URL = VITE_API_URL;
  const navigate = useNavigate();

  const handleRegister = async (values: RegisterFormValues) => {
    const { username, password, lastname, firstname, email, role } = values;

    try {
      const response = await fetch(`${API_URL}/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, lastname, firstname, email, role }), // 使用 role
      });

      if (response.ok) {
        message.success('Registration successful!');
        navigate('/');
      } else {
        const errorText = await response.text();
        console.error('Error Text:', errorText);  // 打印后端返回的 HTML 错误内容
        message.error(`Registration failed: ${errorText}`);
      }
    } catch (error) {
      console.error('Error response:', error);
      message.error(`Registration request failed. Detailed error: ${error.message}`);
    }
  };

  return (
    <ProConfigProvider hashed={false}>
      <LoginForm
        title="Register"
        subTitle="Please fill in the information to create an account"
        onFinish={handleRegister}
        submitter={{
          render: (props) => {
            return (
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}>
                <Button
                  type="default"
                  key="cancel"
                  onClick={() => navigate('/')}
                  style={{ marginRight: 10 }}
                >
                  Cancel
                </Button>
                <Button
                  type="primary"
                  key="register"
                  onClick={() => props.submit()}
                  style={{ marginRight: 10 }}
                >
                  Register
                </Button>
              </div>
            );
          },
        }}
      >
        <ProFormText
          name="username"
          fieldProps={{
            size: 'large',
            prefix: <UserOutlined className={'prefixIcon'} />,
          }}
          placeholder="Username"
          rules={[
            {
              required: true,
              message: 'Please enter your username!',
            },
          ]}
        />

        <ProFormText
          name="email"
          fieldProps={{
            size: 'large',
            prefix: <UserOutlined className={'prefixIcon'} />,
          }}
          placeholder="Email"
          rules={[
            {
              required: true,
              message: 'Please enter your Email!',
            },
          ]}
        />

        <ProFormText
          name="firstname"
          fieldProps={{
            size: 'large',
            prefix: <UserOutlined className={'prefixIcon'} />,
          }}
          placeholder="Firstname"
          rules={[
            {
              required: true,
              message: 'Please enter your firstname!',
            },
          ]}
        />

        <ProFormText
          name="lastname"
          fieldProps={{
            size: 'large',
            prefix: <UserOutlined className={'prefixIcon'} />,
          }}
          placeholder="Lastname"
          rules={[
            {
              required: true,
              message: 'Please enter your lastname!',
            },
          ]}
        />

        <ProFormText.Password
          name="password"
          fieldProps={{
            size: 'large',
            prefix: <LockOutlined className={'prefixIcon'} />,
          }}
          placeholder="Enter password"
          rules={[
            {
              required: true,
              message: 'Please enter your password!',
            },
          ]}
        />

        <ProFormText.Password
          name="confirmPassword"
          fieldProps={{
            size: 'large',
            prefix: <LockOutlined className={'prefixIcon'} />,
          }}
          placeholder="Confirm your password"
          rules={[
            {
              required: true,
              message: 'Please confirm your password!',
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('The two passwords do not match!'));
              },
            }),
          ]}
        />

        <ProFormRadio.Group
          name="role" // 确保与后端字段名一致
          options={[
            { label: 'homeowner', value: 'homeowner' },
            { label: 'cleaner', value: 'cleaner' },
          ]}
          rules={[
            {
              required: true,
              message: 'Please select a user type!',
            },
          ]}
          fieldProps={{
            style: { display: 'flex', justifyContent: 'center' },
          }}
        />
      </LoginForm>
    </ProConfigProvider>
  );
};
