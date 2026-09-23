import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import Card from '../components/Card';
import { CardHeader, CardTitle, CardContent } from '../components/Card';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: 'How do I apply for a housing scheme?',
      answer: 'To apply for a housing scheme, you need to register on our portal, browse available schemes, check eligibility criteria, and submit your application with required documents. The application process is completely online and can be completed in a few simple steps.'
    },
    {
      question: 'What documents are required for application?',
      answer: 'The mandatory documents required are: Identity Proof (Aadhaar/PAN), Address Proof, Income Certificate, and Passport Size Photo. Additional documents may be required depending on the specific scheme requirements.'
    },
    {
      question: 'How is the allotment process conducted?',
      answer: 'The allotment process is conducted through a transparent lottery system. Applications are verified for eligibility, and eligible applicants are entered into a lottery draw. The results are published on the portal and communicated to applicants.'
    },
    {
      question: 'What is the waitlist process?',
      answer: 'If you are not allotted in the initial lottery, you will be placed on a waitlist. As and when units become available due to cancellations or additional allotments, waitlisted applicants are considered in order of their waitlist position.'
    },
    {
      question: 'How can I check my application status?',
      answer: 'You can check your application status by logging into your account and visiting the "My Applications" section. The status is updated in real-time, and you will also receive notifications via email and SMS.'
    },
    {
      question: 'What are the eligibility criteria?',
      answer: 'Eligibility criteria vary by scheme but generally include: age requirements, income limits, residency requirements, and not owning a pucca house. Specific criteria are listed for each scheme in the scheme details.'
    },
    {
      question: 'Can I apply for multiple schemes?',
      answer: 'Yes, you can apply for multiple schemes as long as you meet the eligibility criteria for each scheme. However, you can only be allotted one housing unit across all schemes.'
    },
    {
      question: 'What happens after allotment?',
      answer: 'After allotment, you will receive an allotment letter. You need to pay the required amount within the specified time frame to confirm your allotment. Failure to pay within the time frame may result in cancellation of allotment.'
    },
    {
      question: 'Is there any fee for applying?',
      answer: 'There is no application fee for most government housing schemes. However, you may need to pay a processing fee after allotment. The fee structure is clearly mentioned in each scheme details.'
    },
    {
      question: 'How do I contact support?',
      answer: 'You can contact our support team through the contact form on the portal, email us at support@housing.gov, or call our helpline at 1800-XXX-XXXX. Our support team is available Monday to Friday, 9 AM to 6 PM.'
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <HelpCircle className="h-8 w-8 text-primary-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Frequently Asked Questions</h1>
        <p className="text-gray-600">Find answers to common questions about our housing schemes and application process</p>
      </div>

      {/* FAQ Items */}
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <Card key={index}>
            <CardContent className="p-0">
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium text-gray-900 pr-4">{faq.question}</span>
                {openIndex === index ? (
                  <ChevronUp className="h-5 w-5 text-gray-400 flex-shrink-0" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400 flex-shrink-0" />
                )}
              </button>
              {openIndex === index && (
                <div className="px-6 pb-6 pt-0">
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Contact Section */}
      <Card>
        <CardHeader>
          <CardTitle>Still have questions?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <p className="text-gray-600">If you couldn't find the answer you were looking for, feel free to contact our support team.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                <span className="font-medium">Email:</span>
                <a href="mailto:support@housing.gov" className="text-primary-600 hover:underline">support@housing.gov</a>
              </div>
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                <span className="font-medium">Phone:</span>
                <span>1800-XXX-XXXX</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FAQ;
