"use client";

import { useState } from "react";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", description: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json?.error || "Error");
      setStatus("sent");
      setForm({ name: "", email: "", description: "" });
    } catch {
      setStatus("error");
    }
  }

  return (
    <>
      <Navigation />

      <div className="min-h-screen bg-black text-white pt-20">

        {/* Hero — mirrors the portfolio/prints header block */}
        <div className="bg-black border-b border-white/10 py-16 md:py-24">
          <div className="container-custom">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="font-mono text-4xl md:text-5xl font-normal mb-6 text-white">
                [ ] CONTACT
              </h1>
              <p className="font-mono text-lg leading-relaxed text-white/50">
                Tell me about your project and I will get back to you.
              </p>
            </div>
          </div>
        </div>

        {/* Form area */}
        <main className="pb-24">
        <div className="container-custom max-w-2xl mx-auto px-6 pt-16">

          {/* Form */}
          {status === "sent" ? (
            <div className="border border-white/10 p-8 text-center">
              <p className="font-mono text-white text-lg mb-2">Message sent.</p>
              <p className="font-mono text-white/50 text-sm">
                Thank you — I will be in touch soon.
              </p>
              <button
                onClick={() => setStatus("idle")}
                className="mt-8 font-mono text-xs text-white/40 underline underline-offset-4 hover:text-white transition-colors"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div className="space-y-2">
                <label className="block font-mono text-xs tracking-widest text-white/40 uppercase">
                  Name
                </label>
                <input
                  name="name"
                  type="text"
                  required
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  className="w-full bg-transparent border-b border-white/20 focus:border-white/60 outline-none py-3 font-mono text-sm text-white placeholder:text-white/20 transition-colors"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="block font-mono text-xs tracking-widest text-white/40 uppercase">
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className="w-full bg-transparent border-b border-white/20 focus:border-white/60 outline-none py-3 font-mono text-sm text-white placeholder:text-white/20 transition-colors"
                />
              </div>

              {/* Project description */}
              <div className="space-y-2">
                <label className="block font-mono text-xs tracking-widest text-white/40 uppercase">
                  Project
                </label>
                <textarea
                  name="description"
                  required
                  rows={6}
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Tell me about your project..."
                  className="w-full bg-transparent border-b border-white/20 focus:border-white/60 outline-none py-3 font-mono text-sm text-white placeholder:text-white/20 transition-colors resize-none"
                />
              </div>

              {/* Error */}
              {status === "error" && (
                <p className="font-mono text-xs text-red-400">
                  Something went wrong. Please try again or email directly.
                </p>
              )}

              {/* Submit */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="font-mono text-sm tracking-widest border border-white/30 text-white px-10 py-3 hover:bg-white hover:text-black transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {status === "sending" ? "SENDING…" : "SEND MESSAGE"}
                </button>
              </div>
            </form>
          )}

          {/* Direct email */}
          <div className="mt-20 pt-8 border-t border-white/10">
            <p className="font-mono text-xs text-white/30">
              Or reach me directly at{" "}
              <a
                href="mailto:jorje.adamos@gmail.com"
                className="text-white/50 hover:text-white underline underline-offset-4 transition-colors"
              >
                jorje.adamos@gmail.com
              </a>
            </p>
          </div>

        </div>
        </main>
      </div>

      <Footer />
    </>
  );
}
