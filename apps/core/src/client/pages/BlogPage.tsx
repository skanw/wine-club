import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import _Button from '../components/ui/Button'

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
    color: '#E9D9A6', // champagne
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
      color: '#E9D9A6', // champagne
    },
    {
      id: 2,
      title: 'Food and Wine Pairing: The Perfect Match',
      excerpt: 'Master the art of pairing food with wine to enhance your dining experience.',
      author: 'Chef Michael',
      date: 'December 8, 2024',
      category: 'Food Pairing',
      readTime: '7 min read',
      color: '#DCCB8A', // chablis
    },
    {
      id: 3,
      title: 'Wine Storage: Best Practices for Preservation',
      excerpt: 'Learn how to properly store your wine collection to maintain quality and flavor.',
      author: 'Cellar Master David',
      date: 'December 5, 2024',
      category: 'Wine Storage',
      readTime: '5 min read',
      color: '#6E664C', // grape-seed
    },
    {
      id: 4,
      title: 'Organic vs Conventional: The Wine Debate',
      excerpt: 'Understanding the differences between organic and conventional wine production.',
      author: 'Viticulturist Emma',
      date: 'December 3, 2024',
      category: 'Wine Production',
      readTime: '9 min read',
      color: '#E9D9A6',
    },
    {
      id: 5,
      title: 'Wine Investment: Building Your Portfolio',
      excerpt: 'Smart strategies for investing in fine wines and building a valuable collection.',
      author: 'Investment Advisor Robert',
      date: 'November 30, 2024',
      category: 'Wine Investment',
      readTime: '10 min read',
      color: '#DCCB8A',
    },
    {
      id: 6,
      title: 'Sparkling Wines: Beyond Champagne',
      excerpt: 'Discover the world of sparkling wines from Prosecco to Cava and beyond.',
      author: 'Bubbles Specialist Lisa',
      date: 'November 28, 2024',
      category: 'Sparkling Wines',
      readTime: '6 min read',
      color: '#E9D9A6',
    },
  ];

  const [_categories] = useState([
    'All',
    'Wine Reviews',
    'Industry News',
    'Tasting Notes',
    'Food Pairing'
  ])

  return (
    <div className="min-h-screen bg-gradient-to-br from-ivory via-shell to-porcelain">
      {/* Background Blurred Shapes */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-champagne rounded-full blur-3xl opacity-20"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-chablis rounded-full blur-3xl opacity-20"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-grape-seed rounded-full blur-3xl opacity-10"></div>
      </div>

      <div className="relative z-10">
      {/* Hero Section */}
      <section className="py-20 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-6xl font-bold text-cave mb-6">
            {tFallback('blog.hero.title', 'Wine Wisdom & Insights')}
          </h1>
          <p className="text-xl text-grape-seed max-w-3xl mx-auto mb-8">
            {tFallback('blog.hero.subtitle', 'Discover the world of wine through expert insights, tasting guides, and industry knowledge')}
          </p>
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-cave mb-8">
            {tFallback('blog.featured.section', 'Featured Article')}
          </h2>
          <div className="bg-shell rounded-card overflow-hidden shadow-wc border border-porcelain">
            <div className="md:flex">
              <div className="md:w-1/3 relative">
                <div
                  className="h-full min-h-64 flex items-center justify-center"
                  style={{ backgroundColor: featuredPost.color }}
                >
                  <div className="text-cave text-2xl font-bold opacity-80">
                    {featuredPost.title.split(' ')[0]}
                  </div>
                </div>
              </div>
              <div className="md:w-2/3 p-8">
                <div className="flex items-center space-x-4 text-sm text-champagne mb-4">
                  <span className="font-medium">{featuredPost.author}</span>
                  <span>•</span>
                  <span>{featuredPost.date}</span>
                  <span>•</span>
                  <span>{featuredPost.readTime}</span>
                </div>
                <h3 className="text-2xl font-bold text-cave mb-4">
                  {featuredPost.title}
                </h3>
                <p className="text-grape-seed mb-6">
                  {featuredPost.excerpt}
                </p>
                <button className="bg-champagne text-cave px-6 py-3 rounded-lg hover:bg-chablis transition-colors duration-300 shadow-wc">
                  {tFallback('blog.read.more', 'Read More')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-cave mb-12">
            {tFallback('blog.latest.title', 'Latest Articles')}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <article key={post.id} className="bg-shell rounded-card shadow-wc overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-porcelain">
                <div className="h-48 relative">
                  <div
                    className="w-full h-full flex items-center justify-center"
                    style={{ backgroundColor: post.color }}
                  >
                    <div className="text-cave text-xl font-bold opacity-80">
                      {post.title.split(' ')[0]}
                    </div>
                  </div>
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-champagne text-cave text-sm font-medium rounded-full shadow-wc">
                      {post.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h2 className="text-xl font-bold text-cave mb-3 line-clamp-2">
                    {post.title}
                  </h2>
                  <p className="text-grape-seed mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-sm text-champagne">
                    <span>{post.author}</span>
                    <span>{post.readTime}</span>
                  </div>
                  <div className="mt-4">
                    <button className="text-champagne hover:text-chablis font-medium transition-colors duration-300">
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
      <section className="bg-gradient-to-r from-cave to-grape-seed py-16">
        <div className="container-xl text-center">
          <h2 className="text-3xl font-bold text-ivory mb-4">
            {tFallback('blog.newsletter.title', 'Stay Updated')}
          </h2>
          <p className="text-champagne mb-8 max-w-2xl mx-auto">
            {tFallback('blog.newsletter.subtitle', 'Get the latest wine insights, tasting notes, and exclusive offers delivered to your inbox')}
          </p>
          <div className="flex max-w-md mx-auto">
            <input
              type="email"
              placeholder={tFallback('blog.newsletter.placeholder', 'Enter your email')}
              className="flex-1 px-4 py-3 rounded-lg border border-porcelain bg-ivory text-cave placeholder-grape-seed focus:outline-none focus:ring-2 focus:ring-champagne"
            />
            <button className="ml-2 bg-champagne text-cave px-6 py-3 rounded-lg hover:bg-chablis transition-colors duration-300 shadow-wc">
              {tFallback('blog.newsletter.subscribe', 'Subscribe')}
            </button>
          </div>
        </div>
      </section>
      </div>
    </div>
  );
};

export default BlogPage; 