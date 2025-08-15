import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaClock,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin
} from 'react-icons/fa';
import Button from '../components/ui/Button';

export default function ContactPage() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  // Fallback function for translations
  const tFallback = (key: string, fallback: string) => {
    const translation = t(key);
    return translation === key ? fallback : translation;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Handle form submission (e.g., send to backend, show user notification)
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const contactInfo = [
    {
      icon: <FaEnvelope className="w-6 h-6" />,
      title: tFallback('contact.email.title', 'Email'),
      value: 'hello@vineyardclub.com',
      link: 'mailto:hello@vineyardclub.com'
    },
    {
      icon: <FaPhone className="w-6 h-6" />,
      title: tFallback('contact.phone.title', 'Phone'),
      value: '+1 (555) 123-4567',
      link: 'tel:+15551234567'
    },
    {
      icon: <FaMapMarkerAlt className="w-6 h-6" />,
      title: tFallback('contact.address.title', 'Address'),
      value: tFallback('contact.address.value', '123 Wine Street, Bordeaux, France 33000'),
      link: null
    },
    {
      icon: <FaClock className="w-6 h-6" />,
      title: tFallback('contact.hours.title', 'Business Hours'),
      value: tFallback('contact.hours.value', 'Monday - Friday: 9AM - 6PM CET'),
      link: null
    }
  ];

  const socialLinks = [
    { icon: <FaFacebook />, href: '#', label: 'Facebook' },
    { icon: <FaTwitter />, href: '#', label: 'Twitter' },
    { icon: <FaInstagram />, href: '#', label: 'Instagram' },
    { icon: <FaLinkedin />, href: '#', label: 'LinkedIn' }
  ];

  const subjects = [
    { value: 'general', label: tFallback('contact.form.subjects.general', 'General Inquiry') },
    { value: 'subscription', label: tFallback('contact.form.subjects.subscription', 'Subscription Questions') },
    { value: 'wineSelection', label: tFallback('contact.form.subjects.wineSelection', 'Wine Selection') },
    { value: 'shipping', label: tFallback('contact.form.subjects.shipping', 'Shipping & Delivery') },
    { value: 'billing', label: tFallback('contact.form.subjects.billing', 'Billing & Payments') },
    { value: 'partnership', label: tFallback('contact.form.subjects.partnership', 'Partnership Opportunities') }
  ];

  const faqs = [
    {
      question: tFallback('contact.faq.q1', 'How do I change my delivery frequency?'),
      answer: tFallback('contact.faq.a1', 'You can update your delivery schedule anytime through your member portal.')
    },
    {
      question: tFallback('contact.faq.q2', 'What if I don\'t like a wine?'),
      answer: tFallback('contact.faq.a2', 'We offer a satisfaction guarantee. If you\'re not happy with a wine, we\'ll replace it.')
    },
    {
      question: tFallback('contact.faq.q3', 'How is shipping handled?'),
      answer: tFallback('contact.faq.a3', 'All wines are shipped in temperature-controlled packaging to ensure perfect condition.')
    },
    {
      question: tFallback('contact.faq.q4', 'Can I gift a subscription?'),
      answer: tFallback('contact.faq.a4', 'Yes! We offer beautiful gift packaging and customizable gift messages.')
    }
  ];

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
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-champagne/20 to-chablis/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-cave mb-6">
              {tFallback('contact.hero.title', 'Get in Touch')}
            </h1>
            <p className="text-xl text-grape-seed max-w-3xl mx-auto">
              {tFallback('contact.hero.subtitle', 'We\'re here to help with any questions about our wine club')}
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form and Info */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-shell rounded-card p-8 shadow-wc border border-porcelain">
              <h2 className="text-2xl font-bold text-cave mb-6">
                {tFallback('contact.form.title', 'Send us a Message')}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-grape-seed mb-2">
                      {tFallback('contact.form.name', 'Full Name')}
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-porcelain rounded-lg focus:ring-2 focus:ring-champagne focus:border-transparent bg-ivory text-cave"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-grape-seed mb-2">
                      {tFallback('contact.form.email', 'Email Address')}
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-porcelain rounded-lg focus:ring-2 focus:ring-champagne focus:border-transparent bg-ivory text-cave"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-grape-seed mb-2">
                    {tFallback('contact.form.subject', 'Subject')}
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-porcelain rounded-lg focus:ring-2 focus:ring-champagne focus:border-transparent bg-ivory text-cave"
                  >
                    <option value="">{tFallback('contact.form.selectSubject', 'Select a subject')}</option>
                    {subjects.map((subject) => (
                      <option key={subject.value} value={subject.value}>
                        {subject.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-grape-seed mb-2">
                    {tFallback('contact.form.message', 'Message')}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-porcelain rounded-lg focus:ring-2 focus:ring-champagne focus:border-transparent bg-ivory text-cave resize-none"
                  />
                </div>
                <Button type="submit" variant="primary" size="lg" className="w-full">
                  {tFallback('contact.form.send', 'Send Message')}
                </Button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-cave mb-6">
                  {tFallback('contact.info.title', 'Contact Information')}
                </h2>
                <p className="text-grape-seed mb-8">
                  {tFallback('contact.info.subtitle', 'We\'re here to help with any questions')}
                </p>
              </div>

              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-champagne rounded-lg flex items-center justify-center text-cave shadow-wc">
                      {info.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-cave mb-1">
                        {info.title}
                      </h3>
                      {info.link ? (
                        <a
                          href={info.link}
                          className="text-grape-seed hover:text-champagne transition-colors duration-300"
                        >
                          {info.value}
                        </a>
                      ) : (
                        <p className="text-grape-seed">
                          {info.value}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Social Links */}
              <div>
                <h3 className="text-xl font-semibold text-cave mb-4">
                  {tFallback('contact.social.title', 'Follow Us')}
                </h3>
                <div className="flex space-x-4">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.href}
                      className="w-12 h-12 bg-champagne rounded-lg flex items-center justify-center text-cave hover:bg-chablis transition-colors duration-300 shadow-wc"
                      aria-label={social.label}
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-shell">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-cave mb-4">
              {tFallback('contact.faq.title', 'Frequently Asked Questions')}
            </h2>
            <p className="text-lg text-grape-seed">
              {tFallback('contact.faq.subtitle', 'Find answers to common questions')}
            </p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-ivory rounded-card p-6 shadow-wc border border-porcelain">
                <h3 className="text-lg font-semibold text-cave mb-3">
                  {faq.question}
                </h3>
                <p className="text-grape-seed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      </div>
    </div>
  );
} 