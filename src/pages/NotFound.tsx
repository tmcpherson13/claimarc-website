import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Layout from "@/components/Layout";
import SeoHead from "@/components/SeoHead";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 — route not found:", location.pathname);
  }, [location.pathname]);

  return (
    <Layout>
      <SeoHead
        title="Page not found — ClaimARC"
        description="The page you are looking for doesn't exist."
        path="/404"
        noindex
      />
      <section className="flex min-h-[60vh] flex-col items-center justify-center bg-[var(--navy)] px-6 text-center">
        <p className="text-6xl font-extrabold text-[var(--cyan)]">404</p>
        <h1 className="mt-4 text-2xl font-bold text-white md:text-3xl">We couldn't find that page.</h1>
        <p className="mt-3 text-white/60">It may have moved, or the link may be out of date.</p>
        <Link
          to="/"
          className="mt-7 rounded-md bg-[var(--cyan)] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--cyan-dk)]"
        >
          Back to home
        </Link>
      </section>
    </Layout>
  );
};

export default NotFound;
