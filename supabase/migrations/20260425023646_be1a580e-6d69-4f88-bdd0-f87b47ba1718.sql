CREATE TABLE public.site_pages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_key TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL DEFAULT '',
  headline TEXT NOT NULL DEFAULT '',
  subheadline TEXT NOT NULL DEFAULT '',
  body TEXT NOT NULL DEFAULT '',
  meta_title TEXT,
  meta_description TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.site_pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read site pages"
  ON public.site_pages FOR SELECT USING (true);

CREATE POLICY "Anon can update site pages"
  ON public.site_pages FOR UPDATE USING (true);

CREATE POLICY "Anon can insert site pages"
  ON public.site_pages FOR INSERT WITH CHECK (true);

CREATE TRIGGER update_site_pages_updated_at
BEFORE UPDATE ON public.site_pages
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.site_pages
  (page_key, title, headline, subheadline, body)
VALUES (
  'about',
  'About ZDefense',
  'Built on Years of Doing This Work by Hand',
  'ZDefense is not a generic AI company. Expertise-first, AI-amplified — built by a team that spent nearly a decade converting Explanation of Benefits documents and indexing denials before writing a single line of code.',
  '## The Data Advantage

ZTech started by doing the work most technology companies skip — processing raw payer documents, by hand, at scale. We indexed denials. We studied EOBs. We tracked payer behavioral patterns across hundreds of providers before we ever built a dashboard to show it.

That operational history became our data moat. When we built ZDefense, we were not training a generic model on generic data. We were codifying years of institutional knowledge into an intelligence platform that reflects how payers actually behave — not how they say they behave.

The result: ZDefense sees the original payer document, before any provider system transforms it. Cross-payer. Cross-market. At the speed of AI.

## Our Mission

While payers weaponize data and shifting rules against providers, ZDefense turns that same intelligence into your defense. We also catch compliance landmines before they explode.

## Why We Built This

The playing field between payers and providers has never been level. Payers deploy AI to find reasons to deny. ZDefense deploys AI to find reasons to recover — and to stop denials before they exist. We built this platform because providers deserve the same intelligence advantage that has been used against them.'
);