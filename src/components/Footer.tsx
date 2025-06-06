export const Footer = () => {
  return (
    <footer className="bg-midnight text-white py-12">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-2xl font-heading font-bold">PostArc</span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Shape ideas. Share authority. Generate compelling LinkedIn thought-leadership 
              posts in seconds and build your professional influence.
            </p>
            <p className="text-sm text-gray-400">
              © 2024 PostArc. All rights reserved.
            </p>
          </div>
          
          <div>
            <h4 className="font-heading font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-neon transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-neon transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-neon transition-colors">Demo</a></li>
              <li><a href="#" className="hover:text-neon transition-colors">Templates</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-heading font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-neon transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-neon transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-neon transition-colors">Privacy</a></li>
              <li><a href="#" className="hover:text-neon transition-colors">Terms</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};
