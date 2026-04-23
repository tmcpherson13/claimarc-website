import { Link } from "react-router-dom";
import Layout from "@/components/Layout";

const WorkflowsPage = () => (
  <Layout>
    <section className="bg-[var(--navy)] min-h-[60vh] flex flex-col items-center justify-center px-16 text-center">
      <p className="text-[var(--emerald)] text-sm font-semibold uppercase tracking-widest">
        COMING SOON
      </p>
      <h1 className="text-white text-4xl font-bold mt-2">
        Solutions by Workflow
      </h1>
      <p className="text-slate-400 text-lg max-w-xl mt-4">
        We are building workflow-specific guides for every major revenue
        cycle challenge — from payer contract benchmarking to denial
        prevention to overpayment compliance. Check back after HFMA 2026.
      </p>
      <Link
        to="/contact"
        className="bg-[var(--emerald)] text-white px-6 py-3 rounded font-semibold inline-block mt-8"
      >
        Talk to Us About Your Workflow
      </Link>
    </section>
  </Layout>
);

export default WorkflowsPage;
