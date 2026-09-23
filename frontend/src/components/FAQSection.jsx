import React, { useState } from 'react';
import { HelpCircle, Search, ChevronDown, ChevronUp } from 'lucide-react';
import Card from './Card';
import { CardHeader, CardTitle, CardContent } from './Card';

const FAQSection = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedItem, setExpandedItem] = useState(null);

  const faqs = [
    {
      id: 1,
      category: 'Application Process',
      question: 'How do I apply for a housing scheme?',
      answer: 'To apply for a housing scheme, first browse the available schemes on the Schemes page. Click on a scheme to view details, then click the "Apply Now" button. Fill out the application form with your personal details, family information, and upload required documents. Review your application and submit it.'
    },
    {
      id: 2,
      category: 'Application Process',
      question: 'What documents are required for application?',
      answer: 'Required documents typically include: Identity proof (Aadhaar card, PAN card), Address proof, Income certificate, Passport size photographs, and any other documents specified in the scheme requirements. All documents should be scanned and uploaded in PDF or JPG format.'
    },
    {
      id: 3,
      category: 'Eligibility',
      question: 'Who is eligible to apply for housing schemes?',
      answer: 'Eligibility criteria vary by scheme but generally include: Indian citizenship, minimum age requirement (usually 18+), annual income limits as specified by the scheme, no prior allotment from the housing board, and residency requirements. Check individual scheme details for specific eligibility criteria.'
    },
    {
      id: 4,
      category: 'Eligibility',
      question: 'Can I apply for multiple schemes simultaneously?',
      answer: 'Yes, you can apply for multiple housing schemes simultaneously if you meet the eligibility criteria for each scheme. However, you can only accept one allotment at a time. If you are allotted a unit in one scheme, your applications for other schemes will be automatically withdrawn.'
    },
    {
      id: 5,
      category: 'Application Status',
      question: 'How can I check my application status?',
      answer: 'You can check your application status by logging into your account and visiting the Dashboard or Applications page. The status will show as Pending, Under Review, Approved, Rejected, Waitlisted, or Allotted. You will also receive notifications via email and in-app notifications for status updates.'
    },
    {
      id: 6,
      category: 'Application Status',
      question: 'What does waitlisted status mean?',
      answer: 'Waitlisted status means your application has been approved but there are no available units at the moment. You will be placed in a queue based on priority criteria. When a unit becomes available, it will be allotted to the next applicant in the queue. You can check your rank in the waitlist on the Application Details page.'
    },
    {
      id: 7,
      category: 'Payment',
      question: 'What is the payment process after allotment?',
      answer: 'After allotment, you will receive an allotment letter with payment instructions. You need to pay the initial deposit within the specified timeframe (usually 30 days). The remaining amount can be paid in installments as per the scheme terms. Payment can be made online through the portal or at designated bank branches.'
    },
    {
      id: 8,
      category: 'Payment',
      question: 'What payment methods are accepted?',
      answer: 'We accept online payments through UPI, net banking, credit/debit cards, and demand drafts. Cash payments are not accepted. All payment receipts will be available in your account dashboard.'
    },
    {
      id: 9,
      category: 'Documents',
      question: 'How do I upload documents?',
      answer: 'Documents can be uploaded during the application process. Each document field has an upload button. Click the button, select the file from your device, and upload. Ensure documents are clear, readable, and within the specified size limit (usually 2MB per file). Accepted formats are PDF, JPG, and PNG.'
    },
    {
      id: 10,
      category: 'Documents',
      question: 'Can I update my documents after submission?',
      answer: 'Documents can be updated only if your application is in Pending status. Once your application moves to Under Review or later stages, documents cannot be updated. If you need to update documents, contact the housing board office with valid reasons.'
    },
    {
      id: 11,
      category: 'Account',
      question: 'How do I reset my password?',
      answer: 'To reset your password, click on Forgot Password on the login page. Enter your registered email address, and you will receive a password reset link. Click the link and create a new password. If you do not receive the email, check your spam folder or contact support.'
    },
    {
      id: 12,
      category: 'Account',
      question: 'Can I change my registered email or phone number?',
      answer: 'Yes, you can update your email and phone number from the Profile page. However, you may need to verify the new email/phone number through OTP. Contact support if you face any issues with updating your contact details.'
    }
  ];

  const categories = [...new Set(faqs.map(faq => faq.category))];

  const filteredFAQs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleExpand = (id) => {
    setExpandedItem(expandedItem === id ? null : id);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <HelpCircle className="h-6 w-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-900">Frequently Asked Questions</h2>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search FAQs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/50 backdrop-blur-sm"
            />
          </div>
        </CardContent>
      </Card>

      {/* Category Filter */}
      {searchTerm === '' && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSearchTerm('')}
            className="px-4 py-2 rounded-full bg-blue-600 text-white font-medium text-sm transition-all duration-300 hover:bg-blue-700"
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSearchTerm(category)}
              className="px-4 py-2 rounded-full bg-gray-100 text-gray-700 font-medium text-sm transition-all duration-300 hover:bg-gray-200"
            >
              {category}
            </button>
          ))}
        </div>
      )}

      {/* FAQ List */}
      <div className="space-y-4">
        {filteredFAQs.length === 0 ? (
          <div className="text-center py-12">
            <HelpCircle className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No FAQs Found</h3>
            <p className="text-gray-500">Try a different search term</p>
          </div>
        ) : (
          filteredFAQs.map((faq) => (
            <Card key={faq.id} className="hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <button
                  onClick={() => toggleExpand(faq.id)}
                  className="w-full text-left flex items-start justify-between"
                >
                  <div className="flex-1">
                    <span className="text-xs font-semibold text-blue-600 mb-2 block">
                      {faq.category}
                    </span>
                    <h3 className="text-lg font-semibold text-gray-900">{faq.question}</h3>
                  </div>
                  {expandedItem === faq.id ? (
                    <ChevronUp className="h-5 w-5 text-gray-400 flex-shrink-0 ml-4 mt-1" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400 flex-shrink-0 ml-4 mt-1" />
                  )}
                </button>

                {expandedItem === faq.id && (
                  <div className="mt-4 pt-4 border-t border-gray-100 slide-up">
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Contact Support */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="p-6 text-center">
          <HelpCircle className="h-12 w-12 mx-auto text-blue-600 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Still have questions?</h3>
          <p className="text-gray-600 mb-4">Can't find what you're looking for? Contact our support team.</p>
          <Button variant="primary">Contact Support</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default FAQSection;
