import Router from "next/router";
import React, { useState, useEffect } from "react";
import { signin, authenticate, isAuth } from "../../actions/auth";

function SigninComponent() {
  // state
  const [values, setValues] = useState({
    email: "hamzaissa13@gmail.com",
    password: "12345",
    error: "",
    loading: false,
    message: "",
    showForm: true,
  });

  const { email, password, error, loading, message, showForm } = values;

  useEffect(() => {
    isAuth() && Router.push(`/`);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.table({ email, password, error, loading, message, showForm });
    setValues({ ...values, loading: true, err: false });

    const user = { email, password };

    signin(user).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error, loading: false });
      } else {
        // save user token to cookie
        // save user info to localstorage
        //authenticate user
        authenticate(data, () => {
          if (isAuth() && isAuth().role === 1) {
            Router.push(`/admin`);
          } else {
            Router.push(`/user`);
          }
          Router.push(`/`);
        });
        Router.push(`/`); // this will push the user the homepage
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
  const signinForm = () => {
    return (
      <form>
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
          Signin
        </div>
      </form>
    );
  };

  return (
    <>
      {" "}
      {showError()} {showLoading()} {showMessage()} {showForm && signinForm()}{" "}
    </>
  );
}

export default SigninComponent;
