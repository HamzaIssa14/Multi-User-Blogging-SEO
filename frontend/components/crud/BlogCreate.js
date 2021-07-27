import Link from "next/link";
import { useState, useEffect } from "react";
import Router from "next/router";
import dynamic from "next/dynamic"; // this makes sure our component only runs onthe client side
import React from "react";
import { withRouter } from "next/router";
import { getCookie, isAuth } from "../../actions/auth";
import { getCategories } from "../../actions/category";
import { getTags } from "../../actions/tag";
import { createBlog } from "../../actions/blog";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "../../node_modules/react-quill/dist/quill.snow.css";
import { QuillModules, QuillFormats } from "../../helpers/quill";

function BlogCreate({ router }) {
  const blogFormLS = () => {
    // if we have a window open
    // if we have a blog saved in our local storage, return the contents
    // Otherwise return false
    if (typeof window === "undefined") {
      return false;
    }
    if (localStorage.getItem("blog")) {
      return JSON.parse(localStorage.getItem("blog")); // return it as an Object
    } else {
      return false;
    }
  };

  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);

  const [checkedCategories, setCheckedCategories] = useState([]); // used for categories
  const [checkedTags, setCheckedTags] = useState([]); // used for tags

  const [body, setBody] = useState(blogFormLS); // so if we open this blog again. or after a refresh, we will have what was last saved in local storage. so we dont lose the state
  const [values, setValues] = useState({
    error: "",
    sizeError: "",
    success: "",
    formData: "", // form data is going to be the actual blog, we use most thing to append to this. formData is literally the blog we send to the action and then to backend
    title: "",
    hidePublishButton: false,
  });

  const { error, sizeError, success, formData, title, hidePublishButton } =
    values;

  const token = getCookie("token");

  useEffect(() => {
    setValues({ ...values, formData: new FormData() });
    initCategories();
    initTags();
  }, [router]); // anytime the page reloads in anyway (because of withRouter)

  const initCategories = () => {
    getCategories().then((data) => {
      if (data && data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setCategories(data);
      }
    });
  };
  const initTags = () => {
    getTags().then((data) => {
      if (data && data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setTags(data);
      }
    });
  };

  const publishBlog = (e) => {
    e.preventDefault();
    console.log(formData);
    // console.log('ready to publishBlog');
    createBlog(formData, token).then((data) => {
      if (data && data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({
          ...values,
          title: "",
          error: "",
          success: `A new blog titled "${data.title}" is created`,
        });
        setBody("");
        setCategories([]);
        setTags([]);
      }
    });
  };
  const handleChange = (name) => (e) => {
    console.log(e.target.value);

    const value = name === "photo" ? e.target.files[0] : e.target.value;
    formData.set(name, value);
    setValues({ ...values, [name]: value, formData: formData, error: "" });
  };
  const handleBody = (e) => {
    // so whenever a user types in the Blog Body/form we do the following:
    // 1. we set the state body with whats typed
    // 2. we set the form body with whats typed
    // 3. we set the local storage with whats typed

    console.log(e);
    setBody(e); //
    formData.set("body", e);
    if (typeof window !== "undefined") {
      // means if we have the window available
      localStorage.setItem("blog", JSON.stringify(e));
    }
  };

  const handleCategoryToggle = (c) => () => {
    setValues({ ...values, error: "" });

    // return the first index, or it will return the number -1
    const clickedCategory = checkedCategories.indexOf(c); // so if this value doesnt exist in the array, it will return -1
    const all = [...checkedCategories]; // whatever is the in the checked state, we save inthe variable all
    if (clickedCategory === -1) {
      all.push(c);
    } else {
      all.splice(clickedCategory, 1); // so if this category is already in the clickedCategory array, if we click it again, we should delete it from the array
    }
    console.log(all);
    setCheckedCategories(all); // update the state of checked categories
    formData.set("categories", all);
    console.log(formData.values);
  };

  const handleTagsToggle = (t) => () => {
    setValues({ ...values, error: "" });

    // return the first index, or it will return the number -1
    const clickedTag = checkedTags.indexOf(t); // so if this value doesnt exist in the array, it will return -1
    const all = [...checkedTags]; // whatever is the in the checked state, we save inthe variable all
    if (clickedTag === -1) {
      all.push(t);
    } else {
      all.splice(clickedTag, 1); // so if this tag is already in the clickedTag array, if we click it again, we should delete it from the array
    }
    console.log(all);
    setCheckedTags(all); // update the state of checked tags
    formData.set("tags", all);
  };
  const showCategories = () => {
    return (
      categories &&
      categories.map((c, i) => {
        return (
          <li key={i} className="list-unstyled">
            <input
              onChange={handleCategoryToggle(c._id)}
              type="checkbox"
              className="mr-2"
            />
            <label className="form-check-label">{c.name}</label>
          </li>
        );
      })
    );
  };
  const showTags = () => {
    return (
      tags &&
      tags.map((t, i) => {
        return (
          <li key={i} className="list-unstyled">
            <input
              onChange={handleTagsToggle(t._id)}
              type="checkbox"
              className="mr-2"
            />
            <label className="form-check-label">{t.name}</label>
          </li>
        );
      })
    );
  };

  const showError = () => {
    return (
      <div
        className="alert alert-danger"
        style={{ display: error ? "" : "none" }}
      >
        {error}
      </div>
    );
  };
  const showSuccess = () => {
    return (
      <div
        className="alert alert-success"
        style={{ display: success ? "" : "none" }}
      >
        {success}
      </div>
    );
  };

  const createBlogForm = () => {
    return (
      <form onSubmit={publishBlog}>
        <div className="form-group">
          <label className="text-muted"> Title</label>
          <input
            type="text"
            className="form-control"
            value={title}
            onChange={handleChange("title")}
          />
        </div>

        <div className="form-group">
          <ReactQuill
            modules={QuillModules}
            formats={QuillFormats}
            value={body}
            placeholder="Write something amazing..."
            onChange={handleBody}
          />
        </div>
        <div>
          <button type="submit" className="btn btn-primary">
            Publish
          </button>
        </div>
      </form>
    );
  };
  return (
    <div className="container-fluid pb-5">
      <div className="row">
        <div className="col-md-8">
          {createBlogForm()}
          <div className="pt-3">
            {showError()}
            {showSuccess()}
          </div>

          <hr />
        </div>
        <div className="col-md-4">
          <div>
            <div className="form-group pb-2">
              <h5>Featured Image</h5>
              <hr />

              <small className="text-muted">Max size: 1mb</small>
              <label className="btn btn-outline-info">
                Upload Featured Image
                <input
                  onChange={handleChange("photo")}
                  type="file"
                  accept="image/*"
                  hidden
                />
              </label>
            </div>
          </div>
          <div>
            <h5>Categories</h5>
            <hr />
            <ul style={{ maxHeight: "200px", overflowY: "scroll" }}>
              {showCategories()}
            </ul>
          </div>
          <div>
            <h5> Tags </h5>
            <hr />
            <ul style={{ maxHeight: "200px", overflowY: "scroll" }}>
              {showTags()}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withRouter(BlogCreate);
