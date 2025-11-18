'use client';

import { useMemo, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import {
  type GenerationInput,
  type VideoPackage,
  generateVideoPackage,
} from "@/lib/generator";

const defaultInput: GenerationInput = {
  topic: "AI-Powered Notion Workflows",
  targetAudience: "Solo creators",
  desiredLength: "12 minutes",
  tone: "High-energy",
  productionStyle: "Documentary hybrid",
};

export default function Home() {
  const [form, setForm] = useState<GenerationInput>(defaultInput);
  const [seed, setSeed] = useState(1);
  const [packageState, setPackageState] = useState<VideoPackage>(() =>
    generateVideoPackage(defaultInput, seed),
  );

  const workingTitle = useMemo(
    () => packageState.metadata.primaryTitle,
    [packageState.metadata.primaryTitle],
  );

  function handleChange(field: keyof GenerationInput, value: string) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function handleGenerate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextPackage = generateVideoPackage(form, seed);
    setPackageState(nextPackage);
  }

  function handleShuffle() {
    const nextSeed = seed + 1;
    setSeed(nextSeed);
    const nextPackage = generateVideoPackage(form, nextSeed);
    setPackageState(nextPackage);
  }

  return (
    <main className="min-h-screen bg-slate-950 pb-24 text-slate-50">
      <header className="relative overflow-hidden border-b border-slate-800 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <p className="uppercase tracking-[0.35em] text-xs text-slate-400">
            YouTube video lab
          </p>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl">
            Auto-generate your end-to-end YouTube production packet.
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-300">
            Feed the generator a topic and audience. Instantly receive a
            production-ready idea, full script blueprint, image prompts,
            voiceover direction, editing roadmap, and publishing metadata.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3 text-sm text-slate-400">
            <span className="rounded-full border border-slate-800 px-3 py-1">
              📌 Latest concept: {workingTitle}
            </span>
            <span className="rounded-full border border-slate-800 px-3 py-1">
              🔁 Seed #{seed}
            </span>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-5xl flex-col gap-12 px-6 pt-12 md:flex-row">
        <form
          onSubmit={handleGenerate}
          className="sticky top-6 h-max rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur"
        >
          <h2 className="text-lg font-semibold text-slate-100">
            Input your brief
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Craft a bespoke creative treatment tuned to your production intent.
          </p>

          <div className="mt-6 space-y-4">
            <Field
              label="Central topic"
              value={form.topic}
              onChange={(value) => handleChange("topic", value)}
              placeholder="e.g. Building AI-powered Notion workflows"
            />
            <Field
              label="Target audience"
              value={form.targetAudience}
              onChange={(value) => handleChange("targetAudience", value)}
              placeholder="e.g. Solo creators"
            />
            <Field
              label="Desired runtime"
              value={form.desiredLength}
              onChange={(value) => handleChange("desiredLength", value)}
              placeholder="e.g. 12 minutes"
            />
            <Field
              label="Voice & tone"
              value={form.tone}
              onChange={(value) => handleChange("tone", value)}
              placeholder="e.g. High-energy"
            />
            <Field
              label="Production style"
              value={form.productionStyle}
              onChange={(value) => handleChange("productionStyle", value)}
              placeholder="e.g. Documentary hybrid"
            />
          </div>

          <div className="mt-6 flex flex-col gap-3">
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-lg bg-emerald-400/90 px-4 py-2 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-950"
            >
              Generate production package
            </button>
            <button
              type="button"
              onClick={handleShuffle}
              className="inline-flex items-center justify-center rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-slate-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-slate-600 focus:ring-offset-2 focus:ring-offset-slate-950"
            >
              Shuffle creative seed
            </button>
          </div>
        </form>

        <article className="flex-1 space-y-8">
          <ResultSection
            title="Video Idea Blueprint"
            description="Hero positioning and differentiation statements ready for pitch decks or client sign-off."
          >
            <ContentList label="Hook" items={[packageState.idea.hook]} />
            <ContentList
              label="Elevator pitch"
              items={[packageState.idea.elevatorPitch]}
            />
            <ContentList
              label="Audience promise"
              items={[packageState.idea.audiencePromise]}
            />
            <ContentList
              label="Differentiators"
              items={packageState.idea.differentiators}
            />
            <ContentList
              label="Working titles"
              items={packageState.idea.workingTitles}
            />
          </ResultSection>

          <ResultSection
            title="Script Architecture"
            description="Structured beats engineered for high retention and narrative clarity."
          >
            <ContentList
              label="Opening setup"
              items={[packageState.script.opening]}
            />
            <div className="space-y-4">
              {packageState.script.sections.map((section) => (
                <div
                  key={section.id}
                  className="rounded-xl border border-slate-800 bg-slate-900/40 p-4"
                >
                  <h3 className="text-base font-semibold text-slate-100">
                    {section.label}
                  </h3>
                  <p className="mt-1 text-sm text-slate-400">
                    Objective: {section.objective}
                  </p>
                  <ul className="mt-3 space-y-2 text-sm text-slate-300">
                    {section.talkingPoints.map((point) => (
                      <li key={point} className="leading-relaxed">
                        {point}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-3 text-xs uppercase tracking-wide text-emerald-300">
                    Engagement cue: {section.engagementCue}
                  </p>
                </div>
              ))}
            </div>
            <ContentList
              label="Transitions"
              items={packageState.script.transitions}
            />
            <ContentList
              label="Supporting details"
              items={packageState.script.supportingDetails}
            />
            <ContentList label="Outro" items={[packageState.script.outro]} />
            <ContentList
              label="Call to action"
              items={[packageState.script.callToAction]}
            />
          </ResultSection>

          <ResultSection
            title="Visual & Imagery Plan"
            description="Ready-to-use prompts for thumbnail exploration, hero visuals, and scene-level B-roll."
          >
            <ContentList
              label="Hero art direction"
              items={[packageState.imagery.heroPrompt]}
            />
            <div className="space-y-4">
              {packageState.imagery.sectionPrompts.map((prompt) => (
                <div
                  key={prompt.sectionId}
                  className="rounded-xl border border-slate-800 bg-slate-900/40 p-4"
                >
                  <h3 className="text-sm font-semibold text-slate-100">
                    {prompt.sectionId.replace("section", "Section ")}
                  </h3>
                  <p className="mt-1 text-sm text-slate-300">{prompt.prompt}</p>
                  <p className="mt-2 text-xs uppercase tracking-wide text-slate-500">
                    Framing: {prompt.framing}
                  </p>
                </div>
              ))}
            </div>
            <ContentList
              label="Thumbnail concepts"
              items={packageState.imagery.thumbnailConcepts}
            />
            <ContentList
              label="Style notes"
              items={[packageState.imagery.styleNotes]}
            />
            <ContentList
              label="Color palette"
              items={[packageState.imagery.palette.join(" • ")]}
            />
          </ResultSection>

          <ResultSection
            title="Voiceover Direction"
            description="Narration-ready copy paired with cadence markers and emphasis guidance."
          >
            <ContentList
              label="Performance direction"
              items={[packageState.voiceover.direction]}
            />
            <div className="space-y-4">
              {packageState.voiceover.segments.map((segment) => (
                <div
                  key={segment.sectionId}
                  className="rounded-xl border border-slate-800 bg-slate-900/40 p-4"
                >
                  <h3 className="text-sm font-semibold text-slate-100">
                    {segment.sectionId.replace("section", "Section ")}
                  </h3>
                  <p className="mt-1 text-sm text-slate-300">
                    {segment.narration}
                  </p>
                  <p className="mt-2 text-xs uppercase tracking-wide text-slate-500">
                    Cadence: {segment.cadence}
                  </p>
                </div>
              ))}
            </div>
            <ContentList
              label="Pacing notes"
              items={packageState.voiceover.pacingNotes}
            />
            <ContentList
              label="Emphasis words"
              items={[packageState.voiceover.emphasisWords.join(" | ")]}
            />
          </ResultSection>

          <ResultSection
            title="Editing Command Center"
            description="Timeline blueprint, motion design notes, and delivery checklist to speed up post-production."
          >
            <div className="grid gap-4 md:grid-cols-2">
              {packageState.editing.structureBeats.map((beat) => (
                <div
                  key={beat.timecode}
                  className="rounded-xl border border-slate-800 bg-slate-900/40 p-4"
                >
                  <p className="text-xs font-semibold uppercase text-emerald-300">
                    {beat.timecode}
                  </p>
                  <p className="mt-2 text-sm text-slate-100">
                    {beat.description}
                  </p>
                  <p className="mt-2 text-xs text-slate-400">
                    {beat.layerNotes}
                  </p>
                </div>
              ))}
            </div>
            <ContentList
              label="Transitions"
              items={packageState.editing.transitions}
            />
            <ContentList
              label="Motion graphics"
              items={packageState.editing.motionGraphics}
            />
            <ContentList
              label="Sound design"
              items={packageState.editing.soundDesign}
            />
            <ContentList
              label="Delivery checklist"
              items={packageState.editing.deliveryChecklist}
            />
          </ResultSection>

          <ResultSection
            title="Metadata & Publishing"
            description="Optimized upload details with discoverability hooks and chaptering."
          >
            <ContentList
              label="Primary title"
              items={[packageState.metadata.primaryTitle]}
            />
            <ContentList
              label="Description"
              items={[packageState.metadata.description]}
            />
            <ContentList
              label="Tags"
              items={[packageState.metadata.tags.join(", ")]}
            />
            <ContentList
              label="Hashtags"
              items={[packageState.metadata.hashtags.join(" ")]}
            />
            <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
              <h3 className="text-sm font-semibold text-slate-100">Chapters</h3>
              <ul className="mt-2 space-y-2 text-sm text-slate-300">
                {packageState.metadata.chapters.map((chapter) => (
                  <li key={chapter.timestamp} className="flex items-start gap-3">
                    <span className="inline-flex min-w-[3rem] items-center justify-center rounded-full border border-slate-700 px-2 py-0.5 text-xs font-mono text-emerald-300">
                      {chapter.timestamp}
                    </span>
                    <div>
                      <p className="font-medium text-slate-100">
                        {chapter.label}
                      </p>
                      <p className="text-xs text-slate-400">
                        {chapter.summary}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <ContentList
              label="Upload notes"
              items={packageState.metadata.uploadNotes}
            />
          </ResultSection>
        </article>
      </div>
    </main>
  );
}

function Field(props: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  const { label, value, onChange, placeholder } = props;
  return (
    <label className="block text-sm font-medium text-slate-200">
      <span>{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-2 w-full rounded-lg border border-slate-800 bg-slate-950/80 px-3 py-2 text-sm text-slate-100 shadow-inner focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
      />
    </label>
  );
}

function ResultSection(props: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  const { title, description, children } = props;
  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900/40 p-6 shadow-[0_25px_80px_-60px_rgba(16,255,207,0.45)] backdrop-blur">
      <header>
        <h2 className="text-xl font-semibold text-slate-50">{title}</h2>
        <p className="mt-1 text-sm text-slate-400">{description}</p>
      </header>
      <div className="mt-6 space-y-6 text-sm text-slate-200">{children}</div>
    </section>
  );
}

function ContentList(props: { label: string; items: string[] }) {
  const { label, items } = props;
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </h3>
      <ul className="mt-2 space-y-2">
        {items.map((item, index) => (
          <li
            key={`${label}-${index}`}
            className="rounded-xl border border-slate-800 bg-slate-950/50 p-3 leading-relaxed text-slate-200"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
