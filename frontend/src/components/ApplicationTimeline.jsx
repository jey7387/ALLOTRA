import React from 'react';
import { CheckCircle, Clock, XCircle, AlertCircle, FileText, Shield, Home, Calendar } from 'lucide-react';

const ApplicationTimeline = ({ application }) => {
  const steps = [
    {
      key: 'submitted',
      label: 'Application Submitted',
      icon: FileText,
      completed: true,
      date: application.submitted_at,
      description: 'Your application has been successfully submitted'
    },
    {
      key: 'verified',
      label: 'Documents Verified',
      icon: Shield,
      completed: application.status !== 'pending',
      date: application.status !== 'pending' ? application.updated_at : null,
      description: 'Your documents have been verified by the officer'
    },
    {
      key: 'reviewed',
      label: 'Application Reviewed',
      icon: AlertCircle,
      completed: ['approved', 'rejected', 'allotted', 'waitlisted'].includes(application.status),
      date: ['approved', 'rejected', 'allotted', 'waitlisted'].includes(application.status) ? application.updated_at : null,
      description: 'Your application has been reviewed by the housing board'
    },
    {
      key: 'allotted',
      label: 'Housing Allotted',
      icon: Home,
      completed: application.status === 'allotted',
      date: application.status === 'allotted' ? application.allotment?.allotment_date : null,
      description: 'Congratulations! You have been allotted a housing unit'
    }
  ];

  const getStepStatus = (step) => {
    if (step.completed) return 'completed';
    if (steps.indexOf(step) === steps.findIndex(s => !s.completed)) return 'current';
    return 'pending';
  };

  const getStepIcon = (step) => {
    const status = getStepStatus(step);
    const Icon = step.icon;

    if (status === 'completed') {
      return (
        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30">
          <CheckCircle className="h-5 w-5 text-white" />
        </div>
      );
    }

    if (status === 'current') {
      return (
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30 animate-pulse">
          <Clock className="h-5 w-5 text-white" />
        </div>
      );
    }

    return (
      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
        <Clock className="h-5 w-5 text-gray-400" />
      </div>
    );
  };

  const getConnectorClass = (index) => {
    const currentStep = steps[index];
    const nextStep = steps[index + 1];
    
    if (currentStep.completed && nextStep?.completed) {
      return 'bg-gradient-to-r from-green-500 to-emerald-500';
    }
    
    if (currentStep.completed && !nextStep?.completed) {
      return 'bg-gradient-to-r from-green-500 to-gray-200';
    }
    
    return 'bg-gray-200';
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100/50 p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-8">Application Progress</h3>
      
      <div className="relative">
        {/* Progress Line */}
        <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200 -ml-0.5">
          <div 
            className="absolute top-0 left-0 w-full bg-gradient-to-b from-green-500 to-emerald-500 transition-all duration-500"
            style={{ 
              height: `${((steps.filter(s => s.completed).length) / (steps.length - 1)) * 100}%` 
            }}
          />
        </div>

        <div className="space-y-8">
          {steps.map((step, index) => {
            const status = getStepStatus(step);
            return (
              <div key={step.key} className="relative flex items-start space-x-6">
                {/* Step Icon */}
                <div className="relative z-10 flex-shrink-0">
                  {getStepIcon(step)}
                </div>

                {/* Step Content */}
                <div className={`flex-1 pt-1 ${status === 'current' ? 'scale-in' : ''}`}>
                  <div className="flex items-center justify-between">
                    <h4 className={`font-semibold ${
                      status === 'completed' ? 'text-gray-900' : 
                      status === 'current' ? 'text-blue-600' : 'text-gray-400'
                    }`}>
                      {step.label}
                    </h4>
                    {step.date && (
                      <span className="text-sm text-gray-500">
                        {new Date(step.date).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  <p className={`text-sm mt-1 ${
                    status === 'completed' ? 'text-gray-600' : 
                    status === 'current' ? 'text-blue-600 font-medium' : 'text-gray-400'
                  }`}>
                    {step.description}
                  </p>
                  
                  {status === 'current' && (
                    <div className="mt-3 flex items-center space-x-2 text-sm text-blue-600">
                      <Calendar className="h-4 w-4" />
                      <span>In Progress</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Overall Progress */}
      <div className="mt-8 pt-6 border-t border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-gray-700">Overall Progress</span>
          <span className="text-sm font-bold text-blue-600">
            {Math.round((steps.filter(s => s.completed).length / steps.length) * 100)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500"
            style={{ 
              width: `${(steps.filter(s => s.completed).length / steps.length) * 100}%` 
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ApplicationTimeline;
