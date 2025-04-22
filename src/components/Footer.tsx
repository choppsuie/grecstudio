
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-cyber-darker text-white/70 py-12 border-t border-cyber-red/20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-xl font-bold bg-gradient-to-r from-cyber-red to-cyber-purple bg-clip-text text-transparent mb-4">
              GRecStudio
            </h3>
            <p className="text-sm">
              Create music together in real-time, anywhere. Cloud-based DAW for musicians, producers, and creators.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-white">Product</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/features" className="hover:text-cyber-red transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-cyber-red transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/studio" className="hover:text-cyber-red transition-colors">
                  Studio
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-white">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/support" className="hover:text-cyber-red transition-colors">
                  Support
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-cyber-red transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-white">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/terms" className="hover:text-cyber-red transition-colors">
                  Terms
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-cyber-red transition-colors">
                  Privacy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-cyber-red/20 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm">
            &copy; {currentYear} Guyllotine Records LLC. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-cyber-red transition-colors">
              Twitter
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-cyber-red transition-colors">
              Instagram
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-cyber-red transition-colors">
              YouTube
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
