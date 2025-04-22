
import { Navbar } from "@/components/Navbar";
import Footer from "@/components/Footer";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-cyber-dark text-white flex flex-col">
      <Navbar />
      
      <div className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 bg-gradient-to-r from-cyber-red to-cyber-purple bg-clip-text text-transparent">
            Privacy Policy
          </h1>
          
          <div className="glass-card p-8 rounded-lg space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-4">1. Introduction</h2>
              <p className="text-white/70">
                At GRecStudio, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform. Please read this policy carefully to understand our practices regarding your personal data.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-4">2. Information We Collect</h2>
              <p className="text-white/70">
                We collect several types of information from and about users of our platform, including:
              </p>
              <ul className="list-disc pl-5 text-white/70 mt-2 space-y-1">
                <li>Personal identifiers such as name, email address, and profile information;</li>
                <li>Usage data about how you interact with our platform;</li>
                <li>Audio and musical content you create and upload;</li>
                <li>Communications between you and other users;</li>
                <li>Technical data such as IP address, browser type, and device information.</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-4">3. How We Use Your Information</h2>
              <p className="text-white/70">
                We use the information we collect for various purposes, including:
              </p>
              <ul className="list-disc pl-5 text-white/70 mt-2 space-y-1">
                <li>Providing, maintaining, and improving our platform;</li>
                <li>Processing your transactions and managing your account;</li>
                <li>Communicating with you about updates, features, and support;</li>
                <li>Analyzing usage patterns to enhance user experience;</li>
                <li>Ensuring the security and integrity of our platform;</li>
                <li>Complying with legal obligations.</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-4">4. How We Share Your Information</h2>
              <p className="text-white/70">
                We may share your information in the following circumstances:
              </p>
              <ul className="list-disc pl-5 text-white/70 mt-2 space-y-1">
                <li>With collaborators and other users as part of the platform's functionality;</li>
                <li>With service providers who perform services on our behalf;</li>
                <li>For legal purposes, including to comply with applicable laws and regulations;</li>
                <li>In connection with a merger, acquisition, or sale of all or a portion of our assets;</li>
                <li>With your consent or at your direction.</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-4">5. Data Security</h2>
              <p className="text-white/70">
                We implement appropriate technical and organizational measures to protect your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-4">6. Your Rights</h2>
              <p className="text-white/70">
                Depending on your location, you may have certain rights regarding your personal information, including:
              </p>
              <ul className="list-disc pl-5 text-white/70 mt-2 space-y-1">
                <li>Access to your personal information;</li>
                <li>Correction of inaccurate or incomplete information;</li>
                <li>Deletion of your personal information;</li>
                <li>Restriction or objection to processing;</li>
                <li>Data portability;</li>
                <li>Withdrawal of consent.</li>
              </ul>
              <p className="text-white/70 mt-2">
                To exercise these rights, please contact us using the information provided below.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-4">7. Children's Privacy</h2>
              <p className="text-white/70">
                Our platform is not directed to children under the age of 13, and we do not knowingly collect personal information from children under 13. If we learn we have collected personal information from a child under 13, we will promptly delete that information.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-4">8. Changes to This Privacy Policy</h2>
              <p className="text-white/70">
                We may update this Privacy Policy from time to time. The updated version will be indicated by an updated "Last updated" date. We encourage you to review this Privacy Policy periodically for any changes.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-4">9. Contact Us</h2>
              <p className="text-white/70">
                If you have any questions about this Privacy Policy, please contact us at privacy@grecstudio.com.
              </p>
            </section>
            
            <p className="text-white/70 mt-8 text-sm">
              Last updated: April 22, 2025
            </p>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Privacy;
