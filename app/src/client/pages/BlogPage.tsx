import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { routes } from 'wasp/client/router';
import { 
  FaCalendarAlt, 
  FaUser, 
  FaTag, 
  FaArrowRight,
  FaWineBottle,
  FaGlobe,
  FaStar
} from 'react-icons/fa';
import Button from '../components/ui/Button';

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  color: string; // Use this for background color instead of image
  category: string;
  readTime: string;
}

const BlogPage: React.FC = () => {
  const { t: tFallback } = useTranslation();

  const featuredPost = {
    title: tFallback('blog.featured.title', 'The Art of Wine Tasting: A Beginner\'s Guide'),
    excerpt: tFallback('blog.featured.excerpt', 'Learn the fundamentals of wine tasting and develop your palate with our comprehensive guide.'),
    author: tFallback('blog.featured.author', 'Master Sommelier Jean-Pierre'),
    date: tFallback('blog.featured.date', 'December 15, 2024'),
    category: tFallback('blog.featured.category', 'Wine Education'),
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    readTime: '8 min read',
    color: 'var(--wine-red-deep)', // Use CSS custom property
  };

  const blogPosts: BlogPost[] = [
    {
      id: 1,
      title: 'Understanding Wine Regions: A Global Tour',
      excerpt: 'Explore the world\'s most famous wine regions and learn what makes each unique.',
      author: 'Wine Expert Sarah',
      date: 'December 10, 2024',
      category: 'Wine Regions',
      readTime: '6 min read',
      color: 'var(--wine-red-deep)', // Use CSS custom property
    },
    {
      id: 2,
      title: 'Food and Wine Pairing: The Perfect Match',
      excerpt: 'Master the art of pairing food with wine to enhance your dining experience.',
      author: 'Chef Michael',
      date: 'December 8, 2024',
      category: 'Food Pairing',
      readTime: '7 min read',
      color: 'var(--wine-red-burgundy)', // Use CSS custom property
    },
    {
      id: 3,
      title: 'Wine Storage: Best Practices for Preservation',
      excerpt: 'Learn how to properly store your wine collection to maintain quality and flavor.',
      author: 'Cellar Master David',
      date: 'December 5, 2024',
      category: 'Wine Storage',
      readTime: '5 min read',
      color: 'var(--ui-gray-dark)', // Use CSS custom property
    },
    {
      id: 4,
      title: 'Organic vs Conventional: The Wine Debate',
      excerpt: 'Understanding the differences between organic and conventional wine production.',
      author: 'Viticulturist Emma',
      date: 'December 3, 2024',
      category: 'Wine Production',
      readTime: '9 min read',
      color: 'var(--wine-red-deep)',
    },
    {
      id: 5,
      title: 'Wine Investment: Building Your Portfolio',
      excerpt: 'Smart strategies for investing in fine wines and building a valuable collection.',
      author: 'Investment Advisor Robert',
      date: 'November 30, 2024',
      category: 'Wine Investment',
      readTime: '10 min read',
      color: 'var(--wine-red-burgundy)',
    },
    {
      id: 6,
      title: 'Sparkling Wines: Beyond Champagne',
      excerpt: 'Discover the world of sparkling wines from Prosecco to Cava and beyond.',
      author: 'Bubbles Specialist Lisa',
      date: 'November 28, 2024',
      category: 'Sparkling Wines',
      readTime: '6 min read',
      color: 'var(--wine-red-deep)',
    },
  ];

  const categories = [
    { name: tFallback('blog.categories.wineGuide', 'Wine Guides'), icon: <FaWineBottle />, count: 12 },
    { name: tFallback('blog.categories.regions', 'Wine Regions'), icon: <FaGlobe />, count: 8 },
    { name: tFallback('blog.categories.grapes', 'Grape Varieties'), icon: <FaWineBottle />, count: 15 },
    { name: tFallback('blog.categories.reviews', 'Wine Reviews'), icon: <FaStar />, count: 20 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-champagne-50 via-white to-bordeaux-50">
      {/* Hero Section */}
      <section className="py-20 text-center">
        <div className="container-xl">
          <h1 className="text-4xl md:text-6xl font-bold text-bordeaux-900 mb-6">
            {tFallback('blog.hero.title', 'Wine Wisdom & Insights')}
          </h1>
          <p className="text-xl text-bordeaux-700 max-w-3xl mx-auto mb-8">
            {tFallback('blog.hero.subtitle', 'Discover the world of wine through expert insights, tasting guides, and industry knowledge')}
          </p>
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-16">
        <div className="container-xl">
          <h2 className="text-3xl font-bold text-bordeaux-900 mb-8">
            {tFallback('blog.featured.section', 'Featured Article')}
          </h2>
          <div className="bg-white rounded-2xl overflow-hidden shadow-xl">
            <div className="md:flex">
              <div className="md:w-1/3 relative">
                <div
                  className="h-full min-h-64 flex items-center justify-center"
                  style={{ backgroundColor: featuredPost.color }}
                >
                  <div className="text-white text-2xl font-bold opacity-80">
                    {featuredPost.title.split(' ')[0]}
                  </div>
                </div>
              </div>
              <div className="md:w-2/3 p-8">
                <div className="flex items-center space-x-4 text-sm text-bordeaux-600 mb-4">
                  <span className="font-medium">{featuredPost.author}</span>
                  <span>•</span>
                  <span>{featuredPost.date}</span>
                  <span>•</span>
                  <span>{featuredPost.readTime}</span>
                </div>
                <h3 className="text-2xl font-bold text-bordeaux-900 mb-4">
                  {featuredPost.title}
                </h3>
                <p className="text-bordeaux-700 mb-6">
                  {featuredPost.excerpt}
                </p>
                <button className="bg-bordeaux-600 text-white px-6 py-3 rounded-lg hover:bg-bordeaux-700 transition-colors duration-300">
                  {tFallback('blog.read.more', 'Read More')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16">
        <div className="container-xl">
          <h2 className="text-3xl font-bold text-bordeaux-900 mb-12">
            {tFallback('blog.latest.title', 'Latest Articles')}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <article key={post.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="h-48 relative">
                  <div
                    className="w-full h-full flex items-center justify-center"
                    style={{ backgroundColor: post.color }}
                  >
                    <div className="text-white text-xl font-bold opacity-80">
                      {post.title.split(' ')[0]}
                    </div>
                  </div>
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-bordeaux-100 text-bordeaux-800 text-sm font-medium rounded-full">
                      {post.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h2 className="text-xl font-bold text-bordeaux-900 mb-3 line-clamp-2">
                    {post.title}
                  </h2>
                  <p className="text-bordeaux-700 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-sm text-bordeaux-600">
                    <span>{post.author}</span>
                    <span>{post.readTime}</span>
                  </div>
                  <div className="mt-4">
                    <button className="text-bordeaux-600 hover:text-bordeaux-700 font-medium transition-colors duration-300">
                      {tFallback('blog.read.more', 'Read More')} →
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-bordeaux-900 py-16">
        <div className="container-xl text-center">
          <h2 className="text-3xl font-bold text-champagne-100 mb-4">
            {tFallback('blog.newsletter.title', 'Stay Updated')}
          </h2>
          <p className="text-champagne-200 mb-8 max-w-2xl mx-auto">
            {tFallback('blog.newsletter.subtitle', 'Get the latest wine insights, tasting notes, and exclusive offers delivered to your inbox')}
          </p>
          <div className="flex max-w-md mx-auto">
            <input
              type="email"
              placeholder={tFallback('blog.newsletter.placeholder', 'Enter your email')}
              className="flex-1 px-4 py-3 rounded-lg border border-champagne-300 bg-white text-bordeaux-900 placeholder-bordeaux-600 focus:outline-none focus:ring-2 focus:ring-champagne-500"
            />
            <button className="ml-2 bg-champagne-500 text-bordeaux-900 px-6 py-3 rounded-lg hover:bg-champagne-400 transition-colors duration-300">
              {tFallback('blog.newsletter.subscribe', 'Subscribe')}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogPage; 