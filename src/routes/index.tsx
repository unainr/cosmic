import { FormEvent, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { BlurText } from "@/components/space/BlurText";
import { FadingVideo } from "@/components/space/FadingVideo";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/")({
  component: Index,
});

const heroVideo =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260418_080021_d598092b-c4c2-4e53-8e46-94cf9064cd50.mp4";
const capabilitiesVideo =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260418_094631_d30ab262-45ee-4b7d-99f3-5d5848c8ef13.mp4";

const easeOut = [0.16, 1, 0.3, 1] as const;
const entrance = {
  initial: { filter: "blur(10px)", opacity: 0, y: 20 },
  whileInView: { filter: "blur(0px)", opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.8, ease: easeOut },
};

const MotionDiv = motion.div as React.ComponentType<React.ComponentProps<"div"> & Record<string, unknown>>;
const MotionP = motion.p as React.ComponentType<React.ComponentProps<"p"> & Record<string, unknown>>;
const MotionHeader = motion.header as React.ComponentType<React.ComponentProps<"header"> & Record<string, unknown>>;
const MotionArticle = motion.article as React.ComponentType<React.ComponentProps<"article"> & Record<string, unknown>>;
const MotionSection = motion.section as React.ComponentType<React.ComponentProps<"section"> & Record<string, unknown>>;

const navLinks = [
  { label: "Home", href: "#hero" },
  { label: "Voyages", href: "#voyages" },
  { label: "Worlds", href: "#worlds" },
  { label: "Innovation", href: "#capabilities" },
  { label: "Plan Launch", href: "#plan" },
];
const partners = ["Aeon", "Vela", "Apex", "Orbit", "Zeno"];
const capabilities = [
  {
    title: "AI Navigation",
    body: "Autonomous flight intelligence continuously models trajectory, thermal load, radiation windows, and comfort variables for every passenger profile.",
    tags: ["Adaptive", "Secure", "Live Models", "Crew Assist"],
    path: "M12 2 3.5 20.3 12 16l8.5 4.3L12 2Zm0 4.9 4.6 9.9L12 14.5l-4.6 2.3L12 6.9Z",
  },
  {
    title: "Batch Missions",
    body: "Plan private charters, research payloads, and orbital previews from one operations layer with synchronized launch, crew, and habitat readiness.",
    tags: ["Fleet Sync", "Payload Ready", "Fast Review", "Ops Layer"],
    path: "M4 6.47 5.76 10H20v8H4V6.47M22 4h-4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.89-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4Z",
  },
  {
    title: "Smart Habitats",
    body: "Pressurized suites adjust lighting, oxygen mix, sound, and sleep cycles automatically so every leg of the journey feels composed.",
    tags: ["Bio Rhythm", "Quiet Cabin", "Suite Control", "Premium"],
    path: "M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1Zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7Z",
  },
];

const voyageCards = [
  { title: "Orbital Preview", metric: "90 min", body: "A private Earthrise arc with medical screening, training, and concierge return." },
  { title: "Lunar Transfer", metric: "6 days", body: "A cislunar passage designed around observation, comfort, and guided science windows." },
  { title: "Deep Space Charter", metric: "28+ days", body: "A mission blueprint for founders, institutions, and research crews going beyond the Moon." },
];

const worlds = [
  ["Low Earth Orbit", "Blue marble panoramas with silent cabin drift"],
  ["Lunar Gateway", "Close-pass regolith light and long-horizon observation"],
  ["Mars Trajectory", "Deep-space cruise planning for next-decade crews"],
  ["Research Payloads", "Private labs, imaging windows, and robotic deployment"],
];

const operations = [
  ["01", "Qualification", "Cloud-saved mission requests are reviewed against passenger profile, timing, and mission category."],
  ["02", "Readiness", "Medical, cabin, training, and launch-window checks are coordinated into one private operating plan."],
  ["03", "Mission Desk", "A dedicated flight desk tracks notes, handoff status, and follow-up actions after every inquiry."],
];

const safeguards = [
  "Encrypted request capture",
  "Human qualification review",
  "Passenger readiness checks",
  "Crew support handoff",
  "Launch-window monitoring",
  "Private mission records",
];

const crewSignals = [
  ["Cabin", "Adaptive light, oxygen balance, and pressure comfort for long-duration private travel."],
  ["Training", "Personal simulation blocks prepare guests for launch, drift, and re-entry phases."],
  ["Concierge", "Mission specialists coordinate preferences, notes, and follow-up from one secure record."],
];

const footerLinks = [
  ["Voyages", "#voyages"],
  ["Worlds", "#worlds"],
  ["Operations", "#operations"],
  ["Capabilities", "#capabilities"],
  ["Plan Launch", "#plan"],
];

const missionTypes = ["Orbital Preview", "Lunar Transfer", "Deep Space Charter", "Private Research"] as const;

type MissionType = (typeof missionTypes)[number];

type InquiryForm = {
  full_name: string;
  email: string;
  mission_type: MissionType;
  passengers: number;
  message: string;
};

function ArrowUpRightIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M7 17L17 7" />
      <path d="M7 7h10v10" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <polygon points="6 4 20 12 6 20 6 4" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.2 2.4 3.3 5.4 3.3 9S14.2 18.6 12 21c-2.2-2.4-3.3-5.4-3.3-9S9.8 5.4 12 3Z" />
    </svg>
  );
}

function Navbar() {
  return (
    <nav className="fixed left-0 right-0 top-4 z-50 flex items-center justify-between px-5 md:px-8 lg:px-16">
      <a href="#hero" className="liquid-glass flex h-12 w-12 items-center justify-center rounded-full font-heading text-3xl italic text-foreground" aria-label="Aeon home">
        a
      </a>
      <div className="liquid-glass hidden items-center rounded-full px-1.5 py-1.5 md:flex">
        {navLinks.map((link) => (
          <a key={link.label} href={link.href} className="rounded-full px-3 py-2 font-body text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
            {link.label}
          </a>
        ))}
        <Button asChild variant="comet" size="pill" className="ml-1 text-sm font-medium">
          <a href="#plan">
            Claim a Spot
            <ArrowUpRightIcon />
          </a>
        </Button>
      </div>
      <Button asChild variant="glass" size="icon" className="h-12 w-12 rounded-full md:opacity-0" aria-label="Plan launch">
        <a href="#plan"><ArrowUpRightIcon /></a>
      </Button>
    </nav>
  );
}

function HeroSection() {
  return (
    <section id="hero" className="relative flex min-h-screen overflow-hidden bg-background">
      <FadingVideo src={heroVideo} className="absolute left-1/2 top-0 z-0 -translate-x-1/2 object-cover object-top" style={{ width: "120%", height: "120%" }} />
      <div className="relative z-10 flex min-h-screen w-full flex-col">
        <Navbar />
        <main className="flex flex-1 flex-col items-center justify-center px-4 pt-24 text-center">
          <MotionDiv {...entrance} transition={{ ...entrance.transition, delay: 0.4 }} className="liquid-glass flex max-w-[92vw] items-center gap-2 rounded-full px-2 py-1.5">
            <span className="rounded-full bg-primary px-3 py-1 font-body text-xs font-semibold text-primary-foreground">New</span>
            <span className="pr-3 font-body text-sm text-muted-foreground">Maiden Crewed Voyage to Mars Arrives 2026</span>
          </MotionDiv>

          <BlurText text="Venture Past Our Sky Across the Universe" className="mt-6 flex max-w-2xl flex-wrap justify-center gap-y-[0.1em] font-heading text-6xl italic leading-[0.8] text-foreground md:text-7xl lg:text-[5.5rem]" />

          <MotionP {...entrance} transition={{ ...entrance.transition, delay: 0.8 }} className="mt-4 max-w-2xl font-body text-sm font-light leading-tight text-foreground md:text-base">
            Discover the universe in ways once unimaginable. Our pioneering vessels and breakthrough engineering bring deep-space exploration within reach—secure and extraordinary.
          </MotionP>

          <MotionDiv {...entrance} transition={{ ...entrance.transition, delay: 1.1 }} className="mt-6 flex flex-wrap items-center justify-center gap-5">
            <Button asChild variant="glass" size="pill" className="text-sm font-medium">
              <a href="#plan">
                Start Your Voyage
                <ArrowUpRightIcon />
              </a>
            </Button>
            <a href="#capabilities" className="flex items-center gap-2 font-body text-sm font-medium text-foreground transition-transform hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
              View Liftoff
              <PlayIcon />
            </a>
          </MotionDiv>

          <MotionDiv {...entrance} transition={{ ...entrance.transition, delay: 1.3 }} className="mt-8 flex flex-col items-stretch gap-4 sm:flex-row">
            <StatCard icon={<ClockIcon />} value="34.5 Min" label="Average cabin simulation time" />
            <StatCard icon={<GlobeIcon />} value="2.8B+" label="Mapped orbital data points" />
          </MotionDiv>
        </main>

        <MotionDiv {...entrance} transition={{ ...entrance.transition, delay: 1.4 }} className="flex flex-col items-center gap-4 px-4 pb-8">
          <div className="liquid-glass rounded-full px-3.5 py-1 font-body text-xs font-medium text-foreground">Collaborating with top aerospace pioneers globally</div>
          <div className="flex flex-wrap justify-center gap-8 font-heading text-2xl italic text-foreground md:gap-16 md:text-3xl">
            {partners.map((partner) => (
              <span key={partner}>{partner}</span>
            ))}
          </div>
        </MotionDiv>
      </div>
    </section>
  );
}

function StatCard({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="liquid-glass w-[220px] rounded-[1.25rem] p-5 text-left text-foreground transition-transform hover:-translate-y-1">
      {icon}
      <div className="mt-7 font-heading text-4xl italic leading-none">{value}</div>
      <div className="mt-2 font-body text-xs font-light text-foreground">{label}</div>
    </div>
  );
}

function VoyagesSection() {
  return (
    <MotionSection id="voyages" {...entrance} className="relative overflow-hidden bg-background px-6 py-24 md:px-16 lg:px-20">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
        <div>
          <p className="mb-6 font-body text-sm text-muted-foreground">// Voyages</p>
          <h2 className="font-heading text-5xl italic leading-[0.9] text-foreground md:text-7xl">Designed for private space access</h2>
        </div>
        <p className="max-w-2xl font-body text-base font-light leading-snug text-muted-foreground md:text-lg">
          Each itinerary is coordinated across crew readiness, medical review, cabin environment, and mission windows so the experience feels calm before it feels impossible.
        </p>
      </div>
      <div className="mx-auto mt-12 grid max-w-7xl gap-5 md:grid-cols-3">
        {voyageCards.map((card, index) => (
          <MotionArticle key={card.title} {...entrance} transition={{ ...entrance.transition, delay: index * 0.12 }} className="liquid-glass min-h-[280px] rounded-[1.25rem] p-6 text-foreground">
            <div className="flex items-center justify-between gap-4">
              <span className="font-body text-sm text-muted-foreground">0{index + 1}</span>
              <span className="liquid-glass rounded-full px-3 py-1 font-body text-xs text-foreground">{card.metric}</span>
            </div>
            <h3 className="mt-20 font-heading text-4xl italic leading-none">{card.title}</h3>
            <p className="mt-4 font-body text-sm font-light leading-snug text-muted-foreground">{card.body}</p>
          </MotionArticle>
        ))}
      </div>
    </MotionSection>
  );
}

function WorldsSection() {
  return (
    <section id="worlds" className="relative overflow-hidden bg-background px-6 py-24 md:px-16 lg:px-20">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_1.25fr]">
        <MotionHeader {...entrance}>
          <p className="mb-6 font-body text-sm text-muted-foreground">// Worlds</p>
          <h2 className="font-heading text-5xl italic leading-[0.9] text-foreground md:text-7xl">A cleaner route to the edge of everything</h2>
        </MotionHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          {worlds.map(([title, body], index) => (
            <MotionArticle key={title} {...entrance} transition={{ ...entrance.transition, delay: index * 0.1 }} className="liquid-glass rounded-[1.25rem] p-6">
              <div className="mb-14 h-1 w-12 rounded-full bg-primary" />
              <h3 className="font-heading text-3xl italic leading-none text-foreground">{title}</h3>
              <p className="mt-3 font-body text-sm font-light leading-snug text-muted-foreground">{body}</p>
            </MotionArticle>
          ))}
        </div>
      </div>
    </section>
  );
}

function OperationsSection() {
  return (
    <section id="operations" className="relative overflow-hidden bg-background px-6 py-24 md:px-16 lg:px-20">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
        <MotionHeader {...entrance}>
          <p className="mb-6 font-body text-sm text-muted-foreground">// Mission Operations</p>
          <h2 className="font-heading text-5xl italic leading-[0.9] text-foreground md:text-7xl">A calmer backend for impossible journeys</h2>
          <p className="mt-6 max-w-xl font-body text-base font-light leading-snug text-muted-foreground">
            Every request moves through a structured cloud-backed pipeline so private missions feel curated, trackable, and professionally handled from first contact.
          </p>
        </MotionHeader>
        <div className="grid gap-4">
          {operations.map(([step, title, body], index) => (
            <MotionArticle key={title} {...entrance} transition={{ ...entrance.transition, delay: index * 0.1 }} className="liquid-glass grid gap-6 rounded-[1.25rem] p-6 text-foreground sm:grid-cols-[90px_1fr]">
              <div className="font-heading text-5xl italic leading-none text-muted-foreground">{step}</div>
              <div>
                <h3 className="font-heading text-4xl italic leading-none">{title}</h3>
                <p className="mt-3 max-w-2xl font-body text-sm font-light leading-snug text-muted-foreground">{body}</p>
              </div>
            </MotionArticle>
          ))}
        </div>
      </div>
    </section>
  );
}

function SafeguardsSection() {
  return (
    <section className="relative overflow-hidden bg-background px-6 py-24 md:px-16 lg:px-20">
      <div className="mx-auto max-w-7xl">
        <MotionHeader {...entrance} className="max-w-3xl">
          <p className="mb-6 font-body text-sm text-muted-foreground">// Safety Layer</p>
          <h2 className="font-heading text-5xl italic leading-[0.9] text-foreground md:text-7xl">Built for trust before liftoff</h2>
        </MotionHeader>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {safeguards.map((item, index) => (
            <MotionArticle key={item} {...entrance} transition={{ ...entrance.transition, delay: index * 0.07 }} className="liquid-glass flex min-h-[150px] flex-col justify-between rounded-[1.25rem] p-5 text-foreground">
              <div className="h-2 w-2 rounded-full bg-primary" />
              <h3 className="mt-10 font-heading text-3xl italic leading-none">{item}</h3>
            </MotionArticle>
          ))}
        </div>
      </div>
    </section>
  );
}

function CrewExperienceSection() {
  return (
    <section className="relative overflow-hidden bg-background px-6 py-24 md:px-16 lg:px-20">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch">
        <MotionDiv {...entrance} className="liquid-glass-strong flex min-h-[420px] flex-col justify-between rounded-[1.25rem] p-7 text-foreground">
          <div>
            <p className="mb-6 font-body text-sm text-muted-foreground">// Crew Experience</p>
            <h2 className="font-heading text-5xl italic leading-[0.9] md:text-7xl">Private travel, mission-grade calm</h2>
          </div>
          <p className="mt-16 max-w-2xl font-body text-base font-light leading-snug text-muted-foreground md:text-lg">
            The experience layer is designed like a premium flight deck: fewer distractions, clearer decisions, and a human team behind every automated signal.
          </p>
        </MotionDiv>
        <div className="grid gap-4">
          {crewSignals.map(([title, body], index) => (
            <MotionArticle key={title} {...entrance} transition={{ ...entrance.transition, delay: index * 0.1 }} className="liquid-glass rounded-[1.25rem] p-6 text-foreground">
              <div className="mb-10 flex items-center justify-between gap-4">
                <span className="font-heading text-4xl italic leading-none">{title}</span>
                <span className="liquid-glass rounded-full px-3 py-1 font-body text-xs text-muted-foreground">0{index + 1}</span>
              </div>
              <p className="font-body text-sm font-light leading-snug text-muted-foreground">{body}</p>
            </MotionArticle>
          ))}
        </div>
      </div>
    </section>
  );
}

function CapabilitiesSection() {
  return (
    <section id="capabilities" className="relative min-h-screen overflow-hidden bg-background">
      <FadingVideo src={capabilitiesVideo} className="absolute inset-0 z-0 h-full w-full object-cover" />
      <div className="relative z-10 flex min-h-screen flex-col px-6 pb-10 pt-24 md:px-16 lg:px-20">
        <MotionHeader {...entrance} className="mb-auto">
          <p className="mb-6 font-body text-sm text-muted-foreground">// Capabilities</p>
          <h2 className="font-heading text-6xl italic leading-[0.9] text-foreground md:text-7xl lg:text-[6rem]">
            Production<br />evolved
          </h2>
        </MotionHeader>

        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
          {capabilities.map((capability, index) => (
            <MotionArticle key={capability.title} {...entrance} transition={{ ...entrance.transition, delay: 0.15 * index }} className="liquid-glass flex min-h-[360px] flex-col rounded-[1.25rem] p-6 transition-transform hover:-translate-y-1">
              <div className="flex items-start justify-between gap-4">
                <div className="liquid-glass flex h-11 w-11 shrink-0 items-center justify-center rounded-[0.75rem] text-foreground">
                  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d={capability.path} />
                  </svg>
                </div>
                <div className="flex max-w-[70%] flex-wrap justify-end gap-1.5">
                  {capability.tags.map((tag) => (
                    <span key={tag} className="liquid-glass whitespace-nowrap rounded-full px-3 py-1 font-body text-[11px] text-muted-foreground">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex-1" />
              <div className="mt-6">
                <h3 className="font-heading text-3xl italic leading-none text-foreground md:text-4xl">{capability.title}</h3>
                <p className="mt-3 max-w-[32ch] font-body text-sm font-light leading-snug text-muted-foreground">{capability.body}</p>
              </div>
            </MotionArticle>
          ))}
        </div>
      </div>
    </section>
  );
}

function PlanSection() {
  const [form, setForm] = useState<InquiryForm>({
    full_name: "",
    email: "",
    mission_type: "Orbital Preview",
    passengers: 2,
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [error, setError] = useState("");

  const isReady = useMemo(() => {
    return form.full_name.trim().length >= 2 && /\S+@\S+\.\S+/.test(form.email) && form.passengers >= 1 && form.passengers <= 12;
  }, [form]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!isReady) {
      setStatus("error");
      setError("Please add a valid name, email, and passenger count.");
      return;
    }

    setStatus("submitting");
    const { error: submitError } = await supabase.from("voyage_inquiries").insert({
      full_name: form.full_name.trim(),
      email: form.email.trim(),
      mission_type: form.mission_type,
      passengers: form.passengers,
      message: form.message.trim() || null,
      status: "new",
    });

    if (submitError) {
      setStatus("error");
      setError("We could not save your request. Please try again.");
      return;
    }

    setStatus("success");
    setForm({ full_name: "", email: "", mission_type: "Orbital Preview", passengers: 2, message: "" });
  }

  return (
    <section id="plan" className="relative overflow-hidden bg-background px-6 py-24 md:px-16 lg:px-20">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
        <MotionHeader {...entrance}>
          <p className="mb-6 font-body text-sm text-muted-foreground">// Plan Launch</p>
          <h2 className="font-heading text-5xl italic leading-[0.9] text-foreground md:text-7xl">Begin with a private mission request</h2>
          <p className="mt-6 max-w-xl font-body text-base font-light leading-snug text-muted-foreground">
            Submit your preferred mission and passenger profile. The request is saved securely in Cloud for follow-up and qualification.
          </p>
          <div className="mt-8 grid max-w-xl grid-cols-3 gap-3">
            {[["24h", "response"], ["4", "review steps"], ["12", "max guests"]].map(([value, label]) => (
              <div key={label} className="liquid-glass rounded-[1.25rem] p-4">
                <div className="font-heading text-3xl italic leading-none text-foreground">{value}</div>
                <div className="mt-1 font-body text-xs text-muted-foreground">{label}</div>
              </div>
            ))}
          </div>
        </MotionHeader>

        <MotionDiv {...entrance} className="liquid-glass-strong rounded-[1.25rem] p-5 md:p-7">
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Full name">
                <input value={form.full_name} onChange={(event) => setForm((current) => ({ ...current, full_name: event.target.value.slice(0, 120) }))} className="field-control" placeholder="Nova Clarke" required minLength={2} maxLength={120} />
              </Field>
              <Field label="Email">
                <input value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value.slice(0, 255) }))} className="field-control" placeholder="nova@domain.com" type="email" required maxLength={255} />
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-[1fr_140px]">
              <Field label="Mission type">
                <select value={form.mission_type} onChange={(event) => setForm((current) => ({ ...current, mission_type: event.target.value as MissionType }))} className="field-control">
                  {missionTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </Field>
              <Field label="Passengers">
                <input value={form.passengers} onChange={(event) => setForm((current) => ({ ...current, passengers: Number(event.target.value) }))} className="field-control" type="number" min={1} max={12} required />
              </Field>
            </div>

            <Field label="Mission notes">
              <textarea value={form.message} onChange={(event) => setForm((current) => ({ ...current, message: event.target.value.slice(0, 1000) }))} className="field-control min-h-32 resize-none" placeholder="Tell us your preferred window, destination, or research goals." maxLength={1000} />
            </Field>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="font-body text-sm text-muted-foreground" aria-live="polite">
                {status === "success" ? "Request received. Mission desk will follow up shortly." : error || "Cloud-backed inquiry capture is active."}
              </p>
              <Button type="submit" variant="comet" size="pill" disabled={status === "submitting" || !isReady} className="text-sm font-medium">
                {status === "submitting" ? "Sending" : "Send Request"}
                <ArrowUpRightIcon />
              </Button>
            </div>
          </form>
        </MotionDiv>
      </div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-2 font-body text-sm text-muted-foreground">
      {label}
      {children}
    </label>
  );
}

function Footer() {
  return (
    <footer className="relative overflow-hidden bg-background px-6 pb-8 pt-20 md:px-16 lg:px-20">
      <div className="mx-auto max-w-7xl">
        <div className="liquid-glass-strong rounded-[1.25rem] p-6 md:p-8">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <a href="#hero" className="font-heading text-6xl italic leading-none text-foreground md:text-8xl" aria-label="Aeon home">Aeon</a>
              <p className="mt-5 max-w-xl font-body text-sm font-light leading-snug text-muted-foreground md:text-base">
                Cinematic private space access with cloud-backed mission requests, curated readiness, and an operations desk built for the next generation of explorers.
              </p>
            </div>
            <div className="grid gap-8 sm:grid-cols-2">
              <div>
                <h3 className="font-body text-sm font-medium text-foreground">Explore</h3>
                <div className="mt-4 grid gap-2">
                  {footerLinks.map(([label, href]) => (
                    <a key={label} href={href} className="font-body text-sm text-muted-foreground transition-colors hover:text-foreground">{label}</a>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-body text-sm font-medium text-foreground">Mission Desk</h3>
                <div className="mt-4 grid gap-2 font-body text-sm text-muted-foreground">
                  <span>mission@aeon.space</span>
                  <span>Private launch review</span>
                  <span>24h request response</span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-12 flex flex-col gap-4 border-t border-border/40 pt-5 font-body text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <span>© 2026 Aeon Space Travel. All rights reserved.</span>
            <span>Orbital Preview · Lunar Transfer · Deep Space Charter</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <HeroSection />
      <VoyagesSection />
      <WorldsSection />
      <OperationsSection />
      <CapabilitiesSection />
      <SafeguardsSection />
      <CrewExperienceSection />
      <PlanSection />
      <Footer />
    </div>
  );
}
