import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Layout from "@/components/Layout";
import SeoHead from "@/components/SeoHead";
import { CtaLink } from "@/components/marketing/primitives";

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
      <section className="relative flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
        <p className="display text-7xl tracking-tight">
          <span className="arc-text">404</span>
        </p>
        <h1 className="mt-4 text-2xl font-bold text-[var(--text-hi)] md:text-3xl">
          We couldn't find that page.
        </h1>
        <p className="mt-3 text-[var(--text-mid)]">
          It may have moved, or the link may be out of date.
        </p>
        <div className="mt-7">
          <CtaLink to="/" variant="primary">Back to home</CtaLink>
        </div>
      </section>
    </Layout>
  );
};

export default NotFound;
