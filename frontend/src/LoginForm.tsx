import { LoginForm, ProConfigProvider, ProFormText } from '@ant-design/pro-components';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, message } from 'antd';  // 导入 Button 和 message
import { useNavigate } from 'react-router-dom';  // 导入 useNavigate
import { useState } from 'react';

type LoginType = 'phone' | 'account';

export default () => {
  const [loginType, setLoginType] = useState<LoginType>('account');
  const navigate = useNavigate();  // 使用 useNavigate 来实现页面跳转

  // 模拟后端API地址 (假设后端已经提供此API)
  const API_URL = 'http://3.142.76.164:8000/api/v1/users/login';

  // 处理登录
  const handleLogin = async (values: any) => {
    try {
      // 向后端发送登录请求
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: values.username,
          password: values.password,
        }),
      });

      // 解析后端响应
      const data = await response.json();

      // 检查后端是否返回了 token
      if (response.ok) {
        // 登录成功，存储 token 到 localStorage
        localStorage.setItem('authToken', data.token);

        message.success('Login Successed！');
        navigate('/mainForCleaner');  // 登录成功后跳转到列表页面
      } else {
        // 登录失败，显示后端返回的错误消息
        const errorMessage = data.message || 'Login failed: the username or password is incorrect';
        message.error(errorMessage);
        //navigate('/mainForCleaner');//TODO: remove this line
      }
    } catch (error) {
      // 捕获错误，显示错误信息
      message.error(`Login request failed: ${error}`);
      //navigate('/mainForCleaner');//TODO: remove this line
    }
  };

  // 处理注册点击
  const handleRegister = () => {
    navigate('/register');  
  };

  return (
    <ProConfigProvider hashed={false}>
      <LoginForm
        title="OTU Cleaner Book System "
        subTitle="Open Source Cleaner Book Web App"
        onFinish={handleLogin}  
        submitter={{
          render: (props, dom) => {
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
                  type="primary"
                  key="login"
                  onClick={() => navigate('/list')}
                  style={{ marginRight: 10 }}
                >
                  landlord page
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
          placeholder={'Username'}
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
          placeholder={'Password'}
          rules={[
            {
              required: true,
              message: 'please enter your password！',
            },
          ]}
        />
      </LoginForm>
    </ProConfigProvider>
  );
};
