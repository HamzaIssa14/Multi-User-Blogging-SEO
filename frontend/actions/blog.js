import fetch from "isomorphic-fetch";
import { API } from "../config";
import queryString from "query-string";
import { isAuth } from "./auth";

export const createBlog = (blog, token) => {
  let createBlogEndPoint;

  if (isAuth() && isAuth().role === 1) {
    createBlogEndPoint = `${API}/blog`;
  } else {
    if (isAuth() && isAuth().role === 0) {
      createBlogEndPoint = `${API}/user/blog`;
    }
  }

  return fetch(`${createBlogEndPoint}`, {
    method: "POST",
    headers: {
      Accept: "application/json", // we dont write content-type: application/json because our blog will not be JSON, it will be a form-type that includes images and stff
      Authorization: `Bearer ${token}`,
    },
    body: blog, // we dont need to send JSON.stringify because its not JSON, we are simply sending the form data (the blog)
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

export const listBlogsWithCategoriesAndTags = (skip, limit) => {
  const data = {
    limit,
    skip,
  };

  return fetch(`${API}/blogs-categories-tags`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

export const singleBlog = (slug) => {
  return fetch(`${API}/blog/${slug}`, {
    method: "GET",
  })
    .then((res) => {
      return res.json();
    })
    .catch((err) => console.log(err));
};

export const listRelated = (blog) => {
  return fetch(`${API}/blogs/related`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(blog),
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

export const list = (username) => {
  let listBlogsEndpoint;

  if (username) {
    listBlogsEndpoint = `${API}/${username}/blogs`;
  } else {
    listBlogsEndpoint = `${API}/blogs`;
  }

  return fetch(`${listBlogsEndpoint}`, {
    method: "GET",
  })
    .then((res) => {
      return res.json();
    })
    .catch((err) => console.log(err));
};

export const removeBlog = (slug, token) => {
  let deleteBlogEndPoint;

  if (isAuth() && isAuth().role === 1) {
    deleteBlogEndPoint = `${API}/blog/${slug}`;
  } else {
    if (isAuth() && isAuth().role === 0) {
      deleteBlogEndPoint = `${API}/user/blog/${slug}`;
    }
  }

  return fetch(`${deleteBlogEndPoint}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json", // we dont write content-type: application/json because our blog will not be JSON, it will be a form-type that includes images and stff
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

export const updateBlog = (blog, token, slug) => {
  let updateBlogEndPoint;

  if (isAuth() && isAuth().role === 1) {
    updateBlogEndPoint = `${API}/blog/${slug}`;
  } else {
    if (isAuth() && isAuth().role === 0) {
      updateBlogEndPoint = `${API}/user/blog/${slug}`;
    }
  }

  return fetch(`${updateBlogEndPoint}`, {
    method: "PUT",
    headers: {
      Accept: "application/json", // we dont write content-type: application/json because our blog will not be JSON, it will be a form-type that includes images and stff
      Authorization: `Bearer ${token}`,
    },
    body: blog, // we dont need to send JSON.stringify because its not JSON, we are simply sending the form data (the blog)
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

export const listSearch = (params) => {
  console.log("search params", params); // {search= 'node'}
  let query = queryString.stringify(params); // we save the query, ?limit=100&pagination=10 is an example
  console.log("query params", query); // ?limit=100&pagination=10 is an example
  return fetch(`${API}/blogs/search?${query}`, {
    method: "GET",
  })
    .then((res) => {
      return res.json();
    })
    .catch((err) => console.log(err));
};
