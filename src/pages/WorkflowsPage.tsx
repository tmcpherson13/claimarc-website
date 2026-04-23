import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/Layout";

const WorkflowsPage = () => (
  <Layout>
    <Helmet>
      <title>Solutions by Workflow — ZDefense AI³ (Coming Soon)</title>
      <meta
        name="description"
        content="Workflow-specific guides for every major revenue cycle challenge — payer contract benchmarking, denial prevention, overpayment compliance. Coming soon."
      />
      <link rel="canonical" href="https://z-defense-website.lovable.app/workflows" />
    </Helmet>

    <section className="bg-[var(--navy)] min-h-[60vh] flex flex-col items-center justify-center px-6 md:px-12 lg:px-16 text-center">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        <p className="text-[var(--emerald)] text-sm font-semibold uppercase tracking-widest">
          COMING SOON
        </p>
        <h1 className="text-white text-3xl md:text-4xl font-bold mt-2">
          Solutions by Workflow
        </h1>
        <p className="text-slate-400 text-lg max-w-xl mt-4">
          We are building workflow-specific guides for every major revenue
          cycle challenge — from payer contract benchmarking to denial
          prevention to overpayment compliance. Check back after HFMA 2026.
        </p>
        <Link
          to="/contact"
          className="bg-[var(--emerald)] text-white px-6 py-3 rounded font-semibold inline-block mt-8 hover:bg-emerald-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--emerald)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--navy)]"
        >
          Talk to Us About Your Workflow
        </Link>
      </div>
    </section>
  </Layout>
);

export default WorkflowsPage;
