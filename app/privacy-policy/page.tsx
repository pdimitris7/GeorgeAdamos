import Navigation from "@/components/navigation";
import Footer from "@/components/footer";

export const metadata = {
  title: "Privacy Policy | George Adamos",
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-black text-white/80 pt-32 pb-24">
        <div className="container-custom max-w-3xl mx-auto px-6">
          <h1 className="font-mono text-3xl md:text-4xl text-white mb-2">
            Privacy Policy
          </h1>
          <p className="font-mono text-xs text-white/40 mb-12 tracking-widest uppercase">
            Last updated: April 2025
          </p>

          <div className="space-y-10 font-mono text-sm leading-relaxed">
            <section>
              <h2 className="text-white text-base mb-3">1. Data Controller</h2>
              <p>
                The data controller responsible for your personal information is{" "}
                <strong className="text-white">George Adamos</strong>. You can
                reach us at{" "}
                <a
                  href="mailto:info@george-adamos.com"
                  className="text-white underline underline-offset-4"
                >
                  info@george-adamos.com
                </a>
                .
              </p>
            </section>

            <section>
              <h2 className="text-white text-base mb-3">2. What Data We Collect</h2>
              <p>
                When you use this website or place a print order, we may collect
                the following information:
              </p>
              <ul className="mt-3 space-y-1 list-disc list-inside text-white/70">
                <li>Full name</li>
                <li>Email address</li>
                <li>Phone number (optional)</li>
                <li>Shipping address</li>
                <li>Order details (selected prints and sizes)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-white text-base mb-3">3. Purpose of Processing</h2>
              <p>
                Your data is used solely to fulfil your order, communicate with
                you regarding shipping, and process delivery. It is not used for
                marketing or advertising without your explicit consent.
              </p>
            </section>

            <section>
              <h2 className="text-white text-base mb-3">4. Sharing with Third Parties</h2>
              <p>
                Your personal data is never sold or disclosed to third parties,
                except to shipping or courier partners strictly necessary to
                complete your order.
              </p>
            </section>

            <section>
              <h2 className="text-white text-base mb-3">5. Data Retention</h2>
              <p>
                Your data is retained for as long as necessary to complete the
                transaction and fulfil any applicable legal obligations.
              </p>
            </section>

            <section>
              <h2 className="text-white text-base mb-3">6. Your Rights</h2>
              <p>
                You have the right to access, correct, delete, and port your
                data, as well as the right to object to its processing. To
                submit a request, contact us at{" "}
                <a
                  href="mailto:info@george-adamos.com"
                  className="text-white underline underline-offset-4"
                >
                  info@george-adamos.com
                </a>
                .
              </p>
            </section>

            <section>
              <h2 className="text-white text-base mb-3">7. Security</h2>
              <p>
                We take appropriate technical and organisational measures to
                protect your data from unauthorised access, loss, or destruction.
              </p>
            </section>

            <section>
              <h2 className="text-white text-base mb-3">8. Contact</h2>
              <p>
                For any questions regarding this policy, please contact us at{" "}
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
