import Navigation from "@/components/navigation";
import Footer from "@/components/footer";

export const metadata = {
  title: "Cookies Policy | George Adamos",
};

export default function CookiesPolicyPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-black text-white/80 pt-32 pb-24">
        <div className="container-custom max-w-3xl mx-auto px-6">
          <h1 className="font-mono text-3xl md:text-4xl text-white mb-2">
            Cookies Policy
          </h1>
          <p className="font-mono text-xs text-white/40 mb-12 tracking-widest uppercase">
            Last updated: April 2025
          </p>

          <div className="space-y-10 font-mono text-sm leading-relaxed">
            <section>
              <h2 className="text-white text-base mb-3">1. What Are Cookies</h2>
              <p>
                Cookies are small text files stored on your device when you
                browse a website. They help the site function correctly and
                improve your overall experience.
              </p>
            </section>

            <section>
              <h2 className="text-white text-base mb-3">2. Cookies We Use</h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-white/90 mb-2">Essential Cookies</h3>
                  <p className="text-white/60">
                    These cookies are necessary for the website to function.
                    They include storing your shopping cart (prints cart) in your
                    browser's localStorage so your order is preserved during
                    your visit.
                  </p>
                </div>

                <div>
                  <h3 className="text-white/90 mb-2">Analytics Cookies</h3>
                  <p className="text-white/60">
                    This website may use analytics services (such as Vercel
                    Analytics) to understand how visitors use the site. This
                    data is anonymous and is not linked to your identity.
                  </p>
                </div>

                <div>
                  <h3 className="text-white/90 mb-2">Third-Party Cookies</h3>
                  <p className="text-white/60">
                    We do not use third-party cookies for advertising purposes
                    or to track your behaviour across other websites.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-white text-base mb-3">3. Managing Cookies</h2>
              <p>
                You can control and delete cookies through your browser
                settings. Please note that disabling certain cookies may affect
                the functionality of this website (e.g. the shopping cart).
              </p>
            </section>

            <section>
              <h2 className="text-white text-base mb-3">4. Responsible Party</h2>
              <p>
                The person responsible for cookie use on this website is{" "}
                <strong className="text-white">George Adamos</strong>. For any
                questions, contact us at{" "}
                <a
                  href="mailto:info@george-adamos.com"
                  className="text-white underline underline-offset-4"
                >
                  info@george-adamos.com
                </a>
                .
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
