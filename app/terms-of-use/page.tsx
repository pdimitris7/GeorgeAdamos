import Navigation from "@/components/navigation";
import Footer from "@/components/footer";

export const metadata = {
  title: "Terms of Use | George Adamos",
};

export default function TermsOfUsePage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-black text-white/80 pt-32 pb-24">
        <div className="container-custom max-w-3xl mx-auto px-6">
          <h1 className="font-mono text-3xl md:text-4xl text-white mb-2">
            Terms of Use
          </h1>
          <p className="font-mono text-xs text-white/40 mb-12 tracking-widest uppercase">
            Last updated: April 2025
          </p>

          <div className="space-y-10 font-mono text-sm leading-relaxed">
            <section>
              <h2 className="text-white text-base mb-3">1. Acceptance of Terms</h2>
              <p>
                By using this website (george-adamos.com) you agree to these
                Terms of Use in full. If you do not agree, please do not use
                the site.
              </p>
            </section>

            <section>
              <h2 className="text-white text-base mb-3">2. Intellectual Property</h2>
              <p>
                All photography, text, graphics, and design on this website are
                the intellectual property of{" "}
                <strong className="text-white">George Adamos</strong> and are
                protected by applicable copyright law. Reproduction,
                distribution, or commercial use without prior written permission
                is strictly prohibited.
              </p>
            </section>

            <section>
              <h2 className="text-white text-base mb-3">3. Print Orders</h2>
              <p>
                Submitting an order through this website does not constitute a
                binding purchase contract. Each order is confirmed by email, and
                the final cost — including shipping — is agreed with you before
                any charge is made.
              </p>
            </section>

            <section>
              <h2 className="text-white text-base mb-3">4. Pricing & Availability</h2>
              <p>
                Prices displayed on the website may change without prior notice.
                Availability of prints is not guaranteed and is subject to
                stock.
              </p>
            </section>

            <section>
              <h2 className="text-white text-base mb-3">5. Limitation of Liability</h2>
              <p>
                This website is provided "as is". George Adamos is not liable
                for any damages arising from the use or inability to use this
                website, or for any errors or omissions in its content.
              </p>
            </section>

            <section>
              <h2 className="text-white text-base mb-3">6. Changes to Terms</h2>
              <p>
                We reserve the right to modify these Terms of Use at any time.
                Changes take effect upon publication on the website. Continued
                use of the site after changes are posted constitutes your
                acceptance of the updated terms.
              </p>
            </section>

            <section>
              <h2 className="text-white text-base mb-3">7. Governing Law</h2>
              <p>
                These Terms of Use are governed by Greek law. Any disputes shall
                fall under the jurisdiction of the competent courts of Athens,
                Greece.
              </p>
            </section>

            <section>
              <h2 className="text-white text-base mb-3">8. Contact</h2>
              <p>
                For any questions regarding these Terms, please contact{" "}
                <strong className="text-white">George Adamos</strong> at{" "}
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
