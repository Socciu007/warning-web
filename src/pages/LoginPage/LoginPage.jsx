import React, { useState, useRef } from "react";
import { Form, Input, Button, message } from "antd";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import "./style.scss";
import { loginUser } from "../../services/serviceUser";
import LoadingComponent from "../../components/LoadingComponent/LoadingComponent";
// import { useMutationHooks } from "../../hooks/useMutationHook";
import { setUser } from "../../redux/slices/userSlice.ts";
// import { jwtDecode } from "jwt-decode";
import storageService from "../../services/storage.service";

const LoginPage = () => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const formRef = useRef(null);

  // Handle login
  const handleLogin = async (values) => {
    setIsLoading(true);
    const res = await loginUser(values);
    if (res.data) {
      const accountLogin = res.data.user;
      if (location?.state) {
        navigate(location?.state);
      } else if (accountLogin.role === "manager") {
        navigate("/manager");
      } else if (accountLogin.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
      storageService.set("accessToken", res.data.accessToken);
      storageService.set("refreshToken", res.data.refreshToken);
      storageService.set("user", JSON.stringify(accountLogin));

      dispatch(
        setUser({
          ...res.data.user,
          accessToken: res.data.accessToken,
          refreshToken: res.data.refreshToken,
        })
      );
      setIsLoading(false);
      message.success(t("Login successfully!"));
    } else {
      message.error(t("Login failed, please try again!"));
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">{t("AquaGuardian system")}</h2>
        <Form
          ref={formRef}
          name="login"
          className="login-form"
          initialValues={{ email: "", password: "" }}
          onFinish={handleLogin}
          layout="vertical"
        >
          <Form.Item
            name="email"
            rules={[{ required: true, message: t("Please enter your email!") }]}
            className="float-label-input"
          >
            <Input placeholder={t("Email")} />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: t("Please enter your password!") },
            ]}
          >
            <Input.Password placeholder={t("Password")} />
          </Form.Item>

          <LoadingComponent isLoading={isLoading}>
            <Form.Item>
              <Button type="primary" htmlType="submit" className="login-button">
                {t("Login")}
              </Button>
            </Form.Item>
          </LoadingComponent>
        </Form>
        <div className="login-link">
          <a href="#">{t("Forgot your password?")}</a>
          <a href="/register">{t("Register a new account")}</a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
