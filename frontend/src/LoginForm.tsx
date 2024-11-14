import { LoginForm, ProConfigProvider, ProFormText } from '@ant-design/pro-components';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

type LoginType = 'phone' | 'account';

export default () => {
  const [loginType, setLoginType] = useState<LoginType>('account');
  const navigate = useNavigate();

  const API_URL = 'http://localhost:8000/api/v1/users/login';

  const handleLogin = async (values: any) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: values.username,
          password: values.password,
        }),
        credentials: 'include', // 允许携带 cookie
      });

      const data = await response.json();
      console.log('Response Data:', data);

      if (response.ok) {
        const { accessToken, user } = data.data;
        const { role } = user;

        // Store token and user info in localStorage
        localStorage.setItem('authToken', accessToken);
        localStorage.setItem('userInfo', JSON.stringify(user));

        message.success('Login Successful!');

        // Redirect based on role
        if (role === 'cleaner') {
          navigate('/mainForCleaner');
        } else if (role === 'homeowner') {
          navigate('/list');
        } else {
          message.error('Unknown user role.');
        }
      } else {
        const errorMessage = data.message || 'Login failed: the username or password is incorrect';
        message.error(errorMessage);
      }
    } catch (error) {
      console.error('Detailed Error:', error);
      message.error(`Login request failed: ${error}`);
    }
  };

  const handleRegister = () => {
    navigate('/register');
  };

  return (
    <ProConfigProvider hashed={false}>
      <LoginForm
        title="OTU Cleaner Book System"
        subTitle="Open Source Cleaner Book Web App"
        onFinish={handleLogin}
        submitter={{
          render: (props) => {
            return (
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}>
                <Button
                  type="primary"
                  key="login"
                  onClick={() => props.submit()}
                  style={{ marginRight: 10 }}
                >
                  Login
                </Button>

                <Button
                  type="default"
                  key="register"
                  onClick={handleRegister}
                >
                  Sign up
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
        <ProFormText.Password
          name="password"
          fieldProps={{
            size: 'large',
            prefix: <LockOutlined className={'prefixIcon'} />,
          }}
          placeholder="Password"
          rules={[
            {
              required: true,
              message: 'Please enter your password!',
            },
          ]}
        />
      </LoginForm>
    </ProConfigProvider>
  );
};
