
import { Navbar } from "@/components/Navbar";
import Footer from "@/components/Footer";

const Terms = () => {
  return (
    <div className="min-h-screen bg-cyber-dark text-white flex flex-col">
      <Navbar />
      
      <div className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 bg-gradient-to-r from-cyber-red to-cyber-purple bg-clip-text text-transparent">
            Terms of Service
          </h1>
          
          <div className="glass-card p-8 rounded-lg space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-4">1. Agreement to Terms</h2>
              <p className="text-white/70">
                By accessing or using GRecStudio services, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-4">2. Use License</h2>
              <p className="text-white/70">
                Permission is granted to temporarily use GRecStudio for personal, non-commercial transitory viewing and music production only. This is the grant of a license, not a transfer of title.
              </p>
              <p className="text-white/70 mt-2">
                Under this license, you may not:
              </p>
              <ul className="list-disc pl-5 text-white/70 mt-2 space-y-1">
                <li>Modify or copy the materials except for personal use;</li>
                <li>Use the materials for any commercial purpose;</li>
                <li>Attempt to decompile or reverse engineer any software contained on GRecStudio;</li>
                <li>Remove any copyright or other proprietary notations from the materials;</li>
                <li>Transfer the materials to another person or "mirror" the materials on any other server.</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-4">3. User Content</h2>
              <p className="text-white/70">
                When you upload content to GRecStudio, you retain your rights to your content. However, by uploading, you grant GRecStudio a worldwide, non-exclusive, royalty-free license to use, reproduce, adapt, publish, translate and distribute your content across our platform and promotional materials.
              </p>
              <p className="text-white/70 mt-2">
                You are solely responsible for the content you upload and must have all necessary rights to that content. Content that violates intellectual property rights, contains explicit material, or otherwise violates these terms may be removed without notice.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-4">4. Accounts and Security</h2>
              <p className="text-white/70">
                When you create an account with us, you must provide accurate and complete information. You are responsible for safeguarding the password used to access the service and for any activities or actions under your password.
              </p>
              <p className="text-white/70 mt-2">
                GRecStudio reserves the right to disable any user account at any time if, in our opinion, you have failed to comply with any of the provisions of these Terms of Service.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-4">5. Limitations</h2>
              <p className="text-white/70">
                In no event shall GRecStudio or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on GRecStudio's website, even if GRecStudio or a GRecStudio authorized representative has been notified orally or in writing of the possibility of such damage.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-4">6. Revisions and Errata</h2>
              <p className="text-white/70">
                The materials appearing on GRecStudio's website could include technical, typographical, or photographic errors. GRecStudio does not warrant that any of the materials on its website are accurate, complete or current. GRecStudio may make changes to the materials contained on its website at any time without notice.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-4">7. Governing Law</h2>
              <p className="text-white/70">
                These terms and conditions are governed by and construed in accordance with the laws of the United States and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-4">8. Contact</h2>
              <p className="text-white/70">
                For any questions regarding these Terms of Service, please contact us at legal@grecstudio.com.
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

export default Terms;
