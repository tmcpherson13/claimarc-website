import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
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
      <Helmet>
        <title>Page Not Found — ZDefense AI³</title>
        <meta name="description" content="The page you are looking for does not exist." />
        <meta name="robots" content="noindex" />
      </Helmet>

      <section className="bg-[var(--navy)] min-h-[60vh] flex flex-col items-center justify-center text-center px-6 md:px-12 lg:px-16">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          <h1 className="text-white text-3xl md:text-4xl font-bold">Page Not Found</h1>
          <p className="text-slate-400 mt-3">
            The page you are looking for does not exist.
          </p>
          <Link
            to="/"
            className="bg-[var(--emerald)] text-white px-6 py-3 rounded font-semibold inline-block mt-6 hover:bg-emerald-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--emerald)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--navy)]"
          >
            Return to Home
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default NotFound;
