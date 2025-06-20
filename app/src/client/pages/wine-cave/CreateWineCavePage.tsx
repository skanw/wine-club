import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAction } from 'wasp/client/operations';
import { createWineCave } from 'wasp/client/operations';

const CreateWineCavePage = () => {
  const navigate = useNavigate();
  const createWineCaveAction = useAction(createWineCave);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    website: '',
    contactEmail: '',
    logoUrl: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.contactEmail.trim()) {
      setError('Name and contact email are required');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      
      await createWineCaveAction({
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        location: formData.location.trim() || undefined,
        website: formData.website.trim() || undefined,
        contactEmail: formData.contactEmail.trim(),
        logoUrl: formData.logoUrl.trim() || undefined,
      });

      alert('Wine cave created successfully! 🍷');
      navigate('/wine-caves');
    } catch (err: any) {
      setError(err.message || 'Failed to create wine cave. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <button 
            onClick={() => navigate('/wine-caves')}
            className="text-yellow-600 hover:text-yellow-700 mr-4"
          >
            ← Back to Wine Caves
          </button>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-2 dark:text-white">
          Create Your Wine Cave
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Set up your wine subscription business and start building your community of wine enthusiasts.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Wine Cave Name */}
            <div className="md:col-span-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Wine Cave Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="e.g., Sunset Vineyard Wine Cave"
                required
              />
            </div>

            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="e.g., Napa Valley, California"
              />
            </div>

            {/* Contact Email */}
            <div>
              <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Contact Email *
              </label>
              <input
                type="email"
                id="contactEmail"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="contact@yourvineyard.com"
                required
              />
            </div>

            {/* Website */}
            <div>
              <label htmlFor="website" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Website
              </label>
              <input
                type="url"
                id="website"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="https://yourvineyard.com"
              />
            </div>

            {/* Logo URL */}
            <div>
              <label htmlFor="logoUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Logo URL
              </label>
              <input
                type="url"
                id="logoUrl"
                name="logoUrl"
                value={formData.logoUrl}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="https://example.com/logo.jpg"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Tell customers about your wine cave, philosophy, and what makes your wines special..."
            />
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-between pt-6">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              * Required fields
            </div>
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => navigate('/wine-caves')}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Creating...' : 'Create Wine Cave'}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Next Steps Preview */}
      <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4">
          🎯 Next Steps After Creating Your Wine Cave
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700 dark:text-blue-300">
          <div className="flex items-start">
            <span className="mr-2">1️⃣</span>
            <span>Set up subscription tiers and pricing plans</span>
          </div>
          <div className="flex items-start">
            <span className="mr-2">2️⃣</span>
            <span>Add your wine inventory with details and tasting notes</span>
          </div>
          <div className="flex items-start">
            <span className="mr-2">3️⃣</span>
            <span>Configure shipping settings and business information</span>
          </div>
          <div className="flex items-start">
            <span className="mr-2">4️⃣</span>
            <span>Launch your subscription portal and start accepting members</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateWineCavePage; 