import React, { useState, useEffect } from "react";
import { signup, isAuth } from "../../actions/auth";
import Router from "next/router";

function SignupComponent() {
  // state
  const [values, setValues] = useState({
    name: "Hamza",
    email: "hamzaissa13@gmail.com",
    password: "12345",
    error: "",
    loading: false,
    message: "",
    showForm: true,
  });

  useEffect(() => {
    isAuth() && Router.push(`/`);
  }, []);
  const { name, email, password, error, loading, message, showForm } = values;

  const handleSubmit = (e) => {
    e.preventDefault();
    console.table({ name, email, password, error, loading, message, showForm });
    setValues({ ...values, loading: true, err: false });

    const user = { name, email, password };

    signup(user).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error, loading: false });
      } else {
        setValues({
          ...values,
          name: "",
          email: "",
          password: "",
          error: "",
          loading: false,
          message: data.message,
          showForm: false,
        });
      }
    });
  };
  const handleChange = (field) => (e) => {
    setValues({ ...values, error: false, [field]: e.target.value });
  };

  const showLoading = () => {
    return loading ? <div className="alert alert-info">Loading...</div> : "";
  };
  const showError = () => {
    return error ? <div className="alert alert-danger">{error}</div> : "";
  };
  const showMessage = () => {
    return message ? <div className="alert alert-info">{message}</div> : "";
  };
  const signForm = () => {
    return (
      <form>
        <div className="form-group">
          <input
            value={name}
            onChange={handleChange("name")}
            type="text"
            className="form-control"
            placeholder="Type youre name"
          />
        </div>
        <div className="form-group">
          <input
            value={email}
            onChange={handleChange("email")}
            type="email"
            className="form-control"
            placeholder="Type youre email"
          />
        </div>
        <div className="form-group">
          <input
            value={password}
            onChange={handleChange("password")}
            type="password"
            className="form-control"
            placeholder="Type youre password"
          />
        </div>
        <div className="btn btn-primary" onClick={handleSubmit}>
          Signup
        </div>
      </form>
    );
  };

  return (
    <>
      {showError()}
      {showLoading()}
      {showMessage()}
      {showForm && signForm()}
    </>
  );
}

export default SignupComponent;
