import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  ShieldCheck, 
  Clock, 
  Users, 
  Home, 
  TrendingUp,
  ArrowRight,
  CheckCircle
} from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';
import ProgressBar from '../components/ProgressBar';

const LandingPage = () => {
  const features = [
    {
      icon: ShieldCheck,
      title: 'Transparent Process',
      description: 'Fair and transparent allotment process with complete visibility into application status.',
    },
    {
      icon: Clock,
      title: 'Real-time Updates',
      description: 'Get instant notifications about your application status and waitlist position.',
    },
    {
      icon: Users,
      title: 'Easy Application',
      description: 'Simple and intuitive application process with document upload support.',
    },
  ];

  const stats = [
    { value: '5000+', label: 'Homes Allotted' },
    { value: '50+', label: 'Active Schemes' },
    { value: '10000+', label: 'Registered Citizens' },
    { value: '98%', label: 'Satisfaction Rate' },
  ];

  const steps = [
    {
      number: '01',
      title: 'Register',
      description: 'Create your account with basic information and complete verification.',
    },
    {
      number: '02',
      title: 'Browse Schemes',
      description: 'Explore available housing schemes and check eligibility criteria.',
    },
    {
      number: '03',
      title: 'Apply Online',
      description: 'Submit your application with required documents and track progress.',
    },
    {
      number: '04',
      title: 'Get Allotted',
      description: 'Receive your allotment letter and move into your new home.',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 via-white to-accent-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Building2 className="h-4 w-4 mr-2" />
                State Housing Board Portal
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
                Your Dream Home
                <span className="text-primary-600"> Awaits</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Apply for government housing schemes online. Track your application, 
                check waitlist status, and get notified about allotments.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/register">
                  <Button variant="primary" size="lg" className="w-full sm:w-auto">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-primary-100 to-accent-100 rounded-2xl p-8 lg:p-12">
                <div className="grid grid-cols-2 gap-4">
                  {stats.map((stat, index) => (
                    <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
                      <div className="text-3xl font-bold text-primary-600 mb-1">{stat.value}</div>
                      <div className="text-sm text-gray-600">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Our Portal?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience a modern, transparent, and efficient housing allotment process.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <div className="bg-primary-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Simple steps to get your dream home through our portal.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white rounded-xl p-6 shadow-sm h-full">
                  <div className="text-4xl font-bold text-primary-200 mb-4">{step.number}</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600 text-sm">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
                    <ArrowRight className="h-6 w-6 text-primary-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Home className="h-16 w-16 text-white mx-auto mb-6" />
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Ready to Find Your Home?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of citizens who have found their dream homes through our portal.
          </p>
          <Link to="/register">
            <Button variant="secondary" size="lg">
              Start Your Application
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                Benefits of Using Our Portal
              </h2>
              <div className="space-y-4">
                {[
                  '24/7 access to application status',
                  'Digital document submission',
                  'Real-time waitlist tracking',
                  'Instant notifications and updates',
                  'Secure and transparent process',
                  'Easy allotment letter download',
                ].map((benefit, index) => (
                  <div key={index} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-accent-600 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-accent-50 to-primary-50 rounded-2xl p-8 lg:p-12">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Application Time</span>
                  <span className="text-2xl font-bold text-primary-600">5 mins</span>
                </div>
                <ProgressBar value={5} max={10} color="accent" />
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Processing Time</span>
                  <span className="text-2xl font-bold text-primary-600">7 days</span>
                </div>
                <ProgressBar value={7} max={30} color="accent" />
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Success Rate</span>
                  <span className="text-2xl font-bold text-primary-600">98%</span>
                </div>
                <ProgressBar value={98} max={100} color="accent" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
