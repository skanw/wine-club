import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-champagne-50 via-white to-bordeaux-50 flex items-center justify-center">
      <div className="container-xl text-center">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-9xl font-bold text-bordeaux-600 mb-4">404</h1>
            <h2 className="text-3xl font-bold text-bordeaux-900 mb-4">
              Page Not Found
            </h2>
            <p className="text-lg text-bordeaux-700 mb-8">
              Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or you entered the wrong URL.
            </p>
          </div>
          
          <div className="space-y-4">
            <Link
              to="/"
              className="inline-block bg-bordeaux-600 text-white px-8 py-3 rounded-lg hover:bg-bordeaux-700 transition-colors duration-300 font-medium"
            >
              Go Back Home
            </Link>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Link
                to="/about"
                className="text-bordeaux-600 hover:text-bordeaux-700 font-medium"
              >
                About Us
              </Link>
              <Link
                to="/contact"
                className="text-bordeaux-600 hover:text-bordeaux-700 font-medium"
              >
                Contact Support
              </Link>
              <Link
                to="/blog"
                className="text-bordeaux-600 hover:text-bordeaux-700 font-medium"
              >
                Read Our Blog
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 