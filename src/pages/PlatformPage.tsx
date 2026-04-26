import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Layout from "@/components/Layout";
import TrialCallout from "@/components/TrialCallout";
import CTABand from "@/components/CTABand";
import BADBadge from "@/components/BADBadge";
import HeroAccent from "@/components/HeroAccent";
import PlatformMissionControl from "@/components/PlatformMissionControl";
import ModulePipelineFlow from "@/components/ModulePipelineFlow";
import DefenseNexusFlow from "@/components/DefenseNexusFlow";
import SeoHead from "@/components/SeoHead";
import { PHRASES } from "@/config/terminology";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { getModule, MODULES, type ModuleDefinition } from "@/config/modules";
import { useChatbot } from "@/context/ChatbotContext";

const MODULES_LOOKUP = MODULES.map((m) => m.name);

const LAYER_LABEL: Record<ModuleDefinition["layer"], string> = {
  predict: "PREDICT",
  protect: "PROTECT",
  recover: "RECOVER",
};

const ModuleDetailDialog = ({
  module,
  open,
  onOpenChange,
}: {
  module: ModuleDefinition | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const { open: openChatbot } = useChatbot();
  if (!module) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between gap-3">
            <span className="text-[var(--emerald)] text-xs font-bold uppercase tracking-widest">
              {LAYER_LABEL[module.layer]}
            </span>
            <BADBadge required={module.required} />
          </div>
          <DialogTitle className="text-2xl text-[var(--navy)] mt-2">
            {module.name}
          </DialogTitle>
          <DialogDescription className="text-[var(--emerald)] font-medium">
            {module.tagline}
          </DialogDescription>
        </DialogHeader>

        <p className="text-slate-700 text-sm leading-relaxed">{module.detail}</p>

        <section>
          <h4 className="text-[var(--navy)] text-xs font-bold uppercase tracking-widest mb-2">
            Capabilities
          </h4>
          <ul className="space-y-2">
            {module.capabilities.map((c) => (
              <li key={c} className="flex items-start gap-2 text-sm text-slate-600">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[var(--emerald)] shrink-0" />
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h4 className="text-[var(--navy)] text-xs font-bold uppercase tracking-widest mb-2">
            How it works
          </h4>
          <ol className="space-y-2">
            {module.howItWorks.map((step, i) => (
              <li key={step} className="flex items-start gap-3 text-sm text-slate-600">
                <span className="mt-0.5 h-5 w-5 rounded-full bg-[var(--emerald)]/10 text-[var(--emerald)] text-[11px] font-bold flex items-center justify-center shrink-0">
                  {i + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </section>

        <section>
          <h4 className="text-[var(--navy)] text-xs font-bold uppercase tracking-widest mb-2">
            Outcomes
          </h4>
          <ul className="space-y-2">
            {module.outcomes.map((o) => (
              <li key={o} className="flex items-start gap-2 text-sm text-slate-600">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[var(--emerald)] shrink-0" />
                <span>{o}</span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h4 className="text-[var(--navy)] text-xs font-bold uppercase tracking-widest mb-2">
            Data inputs
          </h4>
          <ul className="space-y-2">
            {module.dataInputs.map((d) => (
              <li key={d} className="flex items-start gap-2 text-sm text-slate-600">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-slate-300 shrink-0" />
                <span>{d}</span>
              </li>
            ))}
          </ul>
        </section>

        <div className="rounded-md bg-slate-50 border border-[var(--lgray)] p-3">
          <p className="text-slate-400 text-xs uppercase tracking-widest">
            Integration & deployment
          </p>
          <p className="text-slate-700 text-sm mt-1">{module.integration}</p>
        </div>

        <div className="border-t border-[var(--lgray)] pt-4">
          <p className="text-slate-400 text-xs uppercase tracking-widest">
            Built for
          </p>
          <p className="text-slate-700 text-sm mt-1">{module.audience}</p>
        </div>

        <Link
          to={module.learnMoreHref}
          onClick={() => onOpenChange(false)}
          className="mt-2 inline-flex items-center gap-1 text-[var(--emerald)] font-semibold text-sm hover:gap-2 transition-all"
        >
          Learn more about {module.name}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </DialogContent>
    </Dialog>
  );
};

const PlatformPage = () => {
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const selectedModule = selectedName ? getModule(selectedName) ?? null : null;
  const { hash } = useLocation();

  // If we land on /platform#<modulename>, open that module's dialog.
  useEffect(() => {
    if (!hash) return;
    const slug = hash.replace(/^#/, "").toLowerCase();
    const match = MODULES_LOOKUP.find((m) => m.toLowerCase() === slug);
    if (match) setSelectedName(match);
  }, [hash]);

  return (
    <Layout>
      <SeoHead
        title="ZDefense Platform — Predict · Protect · Recover"
        description="Nine revenue cycle intelligence modules across Predict, Protect, and Recover. Start with three no-BAA modules; activate the rest as you grow."
        path="/platform"
      />

      {/* SECTION 1: HERO */}
      <section className="relative overflow-hidden bg-[var(--navy)] py-24 px-6 md:px-12 lg:px-16">
        <HeroAccent />
        <div className="absolute inset-0 w-full h-full opacity-70">
          <PlatformMissionControl />
        </div>
        <div className="relative max-w-7xl mx-auto">
          <p className="text-[var(--emerald)] text-sm font-semibold uppercase tracking-widest">
            HOW IT WORKS
          </p>
          <h1 className="text-white text-3xl md:text-4xl lg:text-5xl font-bold max-w-3xl mt-2">
            Modular. Intelligent. Built for the Revenue Cycle.
          </h1>
          <p className="text-slate-300 text-lg md:text-xl max-w-2xl mt-4">
            ZDefense is a modular revenue cycle intelligence platform organized
            into {PHRASES.threeOperationalLayers}. Start with the modules that match
            your biggest pain — no BAA required for three of them. Add modules
            as your organization grows.
          </p>
          <div className="mt-8 flex gap-4 flex-wrap">
            <Link to="/contact" className="bg-[var(--emerald)] text-white px-6 py-3 rounded font-semibold hover:bg-emerald-600 transition-colors">
              Book a Demo
            </Link>
            <Link to="/contact?offer=trial" className="border-2 border-[var(--emerald)] text-[var(--emerald)] px-6 py-3 rounded font-semibold hover:bg-[var(--emerald)]/10 transition-colors">
              Start Your 30-Day Evaluation — No BAA Required
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 1.5: MODULE PIPELINE OVERVIEW — interactive */}
      <section className="bg-[var(--navy-dk)] py-20 px-6 md:px-12 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h2 className="text-white text-3xl md:text-4xl font-bold">
              {PHRASES.nineModulesThreeLayers}
            </h2>
            <p className="text-slate-400 mt-4">
              Intelligence flows in one direction — forward. Every module
              feeds the next. Click any module to see what it does.
            </p>
          </div>
          <ModulePipelineFlow onSelect={setSelectedName} />
        </div>
      </section>

      {/* DATA FOUNDATION */}
      <section className="bg-[var(--navy-dk)] py-20 px-6 md:px-12 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <p className="text-[var(--emerald)] text-[17px] font-semibold uppercase tracking-widest text-center">
            DATA DEFENSE NEXUS
          </p>
          <h2 className="text-white text-3xl md:text-4xl font-bold text-center mt-2 max-w-3xl mx-auto">
            The Data Foundation Behind Every ZDefense Decision
          </h2>
          <p className="text-slate-400 text-lg text-center max-w-3xl mx-auto mt-4">
            Crucible ingests 11 public data sources continuously — the same data your payers use to set rates and write rules. Few platforms in this space are built on a foundation like this, and none currently combine it with cross-portfolio remittance intelligence.
          </p>
          <DefenseNexusFlow className="mt-12" />
        </div>
      </section>

      {/* SECTION 2: NO-BAA ENTRY BAND */}
      <section className="bg-[var(--emerald)] py-14 px-6 md:px-12 lg:px-16 text-center">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-[var(--navy)] text-3xl font-bold">
            Start in 30 minutes. Live data. No BAA required.
          </h2>
          <p className="text-[var(--navy)]/80 text-lg max-w-2xl mx-auto mt-3">
            ContractIntel, Shield, and Prevent run on public payer data only.
            No BAA. No IT involvement. Available for qualifying provider
            organizations. See real payer intelligence within 72 hours.
          </p>
          <Link to="/contact?offer=trial" className="bg-[var(--navy)] text-white px-8 py-3 rounded font-semibold mt-6 inline-block hover:bg-[var(--navy-dk)] transition-colors">
            Start Your 30-Day Evaluation — No BAA Required
          </Link>
          <p className="text-[var(--navy)]/60 text-xs mt-2">
            Available for qualifying provider organizations.
          </p>
        </div>
      </section>

      <CTABand
        headline="See the Platform in Your Market Context"
        subhead="Book a personalized demo or start your 30-day no-obligation evaluation with live payer data today."
        primaryText="Book a Demo"
        primaryHref="/contact"
        secondaryText="Start Your 30-Day Evaluation — No BAA Required"
        secondaryHref="/contact?offer=trial"
      />

      {/* Module detail modal driven by clicks on the pipeline pills */}
      <ModuleDetailDialog
        module={selectedModule}
        open={selectedModule !== null}
        onOpenChange={(o) => {
          if (!o) setSelectedName(null);
        }}
      />
    </Layout>
  );
};

export default PlatformPage;
