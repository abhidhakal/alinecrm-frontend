import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function Privacy() {
  return (
    <div className="flex w-full flex-col min-h-screen bg-white font-sans">
      <Header />

      <section className="pt-32 pb-20 md:pt-40 md:pb-24 bg-slate-50 border-b border-slate-100">
        <div className="container-width">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Privacy Policy</h1>
          <p className="text-slate-500">Last updated: January 27, 2025</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container-width max-w-4xl">
          <div className="prose prose-slate prose-lg max-w-none">
            <h2>1. Introduction</h2>
            <p>
              AlineCRM ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our customer relationship management platform.
            </p>

            <h2>2. Information We Collect</h2>
            <h3>Personal Information</h3>
            <p>We may collect personal information that you voluntarily provide, including:</p>
            <ul>
              <li>Name and email address</li>
              <li>Company name and job title</li>
              <li>Phone number</li>
              <li>Billing and payment information</li>
              <li>Profile pictures</li>
            </ul>

            <h3>Usage Data</h3>
            <p>We automatically collect certain information when you use our platform:</p>
            <ul>
              <li>IP address and browser type</li>
              <li>Device information</li>
              <li>Pages visited and features used</li>
              <li>Time and date of access</li>
            </ul>

            <h2>3. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Provide, maintain, and improve our services</li>
              <li>Process transactions and send related information</li>
              <li>Send you technical notices and support messages</li>
              <li>Respond to your comments and questions</li>
              <li>Analyze usage patterns to improve user experience</li>
            </ul>

            <h2>4. Data Security</h2>
            <p>
              We implement appropriate technical and organizational security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
            </p>

            <h2>5. Data Retention</h2>
            <p>
              We retain your personal information for as long as your account is active or as needed to provide you services. You may request deletion of your account and associated data at any time.
            </p>

            <h2>6. Third-Party Services</h2>
            <p>
              We may use third-party services (such as analytics, payment processors, and email providers) that collect, monitor, and analyze user data. These third parties have their own privacy policies.
            </p>

            <h2>7. Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Object to processing of your data</li>
              <li>Export your data in a portable format</li>
            </ul>

            <h2>8. Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy, please contact us at:
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
