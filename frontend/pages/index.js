import Layout from "../components/Layout";
import Link from "next/link";

function index() {
  return (
    <Layout>
      <h2> Index Page</h2>
      <Link href="/signup">
        <a>Signup</a>
      </Link>
    </Layout>
  );
}

export default index;
