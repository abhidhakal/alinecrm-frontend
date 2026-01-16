import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function Terms() {
  return (
    <div className="flex w-full flex-col min-h-screen bg-white font-sans">
      <Header />

      <section className="pt-32 pb-20 md:pt-40 md:pb-24 bg-slate-50 border-b border-slate-100">
        <div className="container-width">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Terms of Service</h1>
          <p className="text-slate-500">Last updated: January 27, 2025</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container-width max-w-4xl">
          <div className="prose prose-slate prose-lg max-w-none">
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing or using AlineCRM, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
            </p>

            <h2>2. Description of Service</h2>
            <p>
              AlineCRM provides a cloud-based customer relationship management platform that helps businesses manage contacts, leads, sales pipelines, and customer communications.
            </p>

            <h2>3. User Accounts</h2>
            <p>To use our services, you must:</p>
            <ul>
              <li>Provide accurate and complete registration information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Be at least 18 years old or have parental consent</li>
              <li>Notify us immediately of any unauthorized access</li>
            </ul>

            <h2>4. Acceptable Use</h2>
            <p>You agree not to:</p>
            <ul>
              <li>Use the service for any illegal purpose</li>
              <li>Upload malicious code or content</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Interfere with other users' access to the service</li>
              <li>Send spam or unsolicited communications through our platform</li>
            </ul>

            <h2>5. Data Ownership</h2>
            <p>
              You retain ownership of all data you upload to AlineCRM. We do not claim any intellectual property rights over your content. You grant us a limited license to use your data solely to provide and improve our services.
            </p>

            <h2>6. Payment Terms</h2>
            <p>
              Certain features of AlineCRM require a paid subscription. Payment terms, pricing, and billing cycles are displayed at the time of purchase. All fees are non-refundable unless otherwise stated.
            </p>

            <h2>7. Service Availability</h2>
            <p>
              We strive to maintain high availability but do not guarantee uninterrupted access. We may perform maintenance or updates that temporarily affect service availability.
            </p>

            <h2>8. Termination</h2>
            <p>
              We may suspend or terminate your account if you violate these terms. You may cancel your account at any time through your account settings or by contacting support.
            </p>

            <h2>9. Limitation of Liability</h2>
            <p>
              AlineCRM is provided "as is" without warranties of any kind. We shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the service.
            </p>

            <h2>10. Changes to Terms</h2>
            <p>
              We may update these terms from time to time. Continued use of the service after changes constitutes acceptance of the new terms.
            </p>

            <h2>11. Contact</h2>
            <p>
              For questions about these Terms of Service, please contact us at:
            </p>
            <p>
              <strong>Email:</strong> hi.alinecrm@gmail.com<br />
              <strong>Address:</strong> Anamnagar, Kathmandu, Nepal
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
