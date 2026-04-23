import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Layout from "@/components/Layout";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <Layout>
      <section className="bg-[var(--navy)] min-h-[60vh] flex flex-col items-center justify-center text-center px-16">
        <h1 className="text-white text-4xl font-bold">Page Not Found</h1>
        <p className="text-slate-400 mt-3">
          The page you are looking for does not exist.
        </p>
        <Link
          to="/"
          className="bg-[var(--emerald)] text-white px-6 py-3 rounded font-semibold inline-block mt-6"
        >
          Return to Home
        </Link>
      </section>
    </Layout>
  );
};

export default NotFound;
