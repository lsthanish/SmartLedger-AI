import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ 
  title = 'SmartLedger - Personal Finance Tracker', 
  description = 'Take control of your finances with SmartLedger. Track expenses, manage budgets, and gain insights with our intelligent personal finance management platform.',
  keywords = 'personal finance, expense tracker, budget management, financial analytics, money management, spending tracker',
  canonical,
  image = '/og-image.jpg',
  type = 'website'
}) => {
  const siteUrl = process.env.REACT_APP_SITE_URL || 'https://smartledger.app';
  const fullUrl = canonical ? `${siteUrl}${canonical}` : siteUrl;
  const fullImageUrl = `${siteUrl}${image}`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content="index, follow" />
      <meta name="author" content="SmartLedger Team" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />
      
      {/* Open Graph Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:image:alt" content="SmartLedger - Personal Finance Dashboard" />
      <meta property="og:site_name" content="SmartLedger" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />
      <meta name="twitter:image:alt" content="SmartLedger - Personal Finance Dashboard" />
      <meta name="twitter:site" content="@smartledger" />
      <meta name="twitter:creator" content="@smartledger" />
      
      {/* Additional Meta Tags */}
      <meta name="theme-color" content="#10b981" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="SmartLedger" />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "SmartLedger",
          "description": description,
          "url": siteUrl,
          "applicationCategory": "FinanceApplication",
          "operatingSystem": "Any",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          },
          "featureList": [
            "Expense tracking",
            "Budget management",
            "Financial analytics",
            "Transaction categorization",
            "CSV import/export",
            "Real-time insights"
          ]
        })}
      </script>
    </Helmet>
  );
};

export default SEO;