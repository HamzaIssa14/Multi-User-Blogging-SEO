import Layout from "../../../components/Layout";
import Admin from "../../../components/auth/Admin";
import BlogUpdate from "../../../components/crud/BlogUpdate";
import Link from "next/link";

function Blog() {
  return (
    <Layout>
      <Admin>
        <div className="row">
          <div className="col-md-12 pt-5 pb-5">
            <h2>Update blog</h2>
          </div>
          <div className="col-md-12">
            <BlogUpdate />
          </div>

          <div className="col-md-6">tag</div>
        </div>
      </Admin>
    </Layout>
  );
}

export default Blog;
