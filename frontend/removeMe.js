import { useState, useEffect } from "react";
import dynamic from "next/dynamic"; // this makes sure our component only runs onthe client side
import React from "react";
import { withRouter } from "next/router";
import { getCookie, isAuth } from "../../actions/auth";
import { getCategories } from "../../actions/category";
import { getTags } from "../../actions/tag";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "../../node_modules/react-quill/dist/quill.snow.css";
import { QuillModules, QuillFormats } from "../../helpers/quill";

function BlogCreate() {
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);

  const [checkedCategories, setCheckedCategories] = useState([]);
  const [checkedTags, setCheckedTags] = useState([]);

  const [body, setBody] = useState(""); // this is going to be replaced with what is in local storage
  const [values, setValues] = useState({
    error: "",
    sizeError: "",
    success: "",
    formData: "", // form data is going to be the actual blog, all the fields, and image file
    title: "",
    hidePublishButton: false,
  });

  // DESTRUCTURE values state to make it easier
  const { error, sizeError, success, formData, title, hidePublishButton } =
    values;

  // TOKEN WE CAN USE TO UTILIZE AUTHENTICATION REQUIRED ACTIONS
  const token = getCookie("token");

  // INITIZALIZATION OF THE WEB PAGE

  useEffect(() => {
    setValues({ ...values, formData: new FormData() }); // prepping our page for input to formidable data fields and files
    // INIT CATEGORIES METHOD
    // INIT TAGS MTHOD
  }, []);

  const createBlogForm = () => {
    return (
      <form>
        <div className="form-group">
          <label className="text-muted"> Title</label>
          <input type="text" className="form-control" value={title} />
        </div>

        <div className="form-group">
          <ReactQuill
            modules={QuillModules}
            formats={QuillFormats}
            value={body}
            placeholder="Write something amazing..."
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
                <input type="file" accept="image/*" hidden />
              </label>
            </div>
          </div>
          <div>
            <h5>Categories</h5>
            <hr />
            <ul style={{ maxHeight: "200px", overflowY: "scroll" }}></ul>
          </div>
          <div>
            <h5> Tags </h5>
            <hr />
            <ul style={{ maxHeight: "200px", overflowY: "scroll" }}></ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BlogCreate;
