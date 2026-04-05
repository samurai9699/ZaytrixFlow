import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, ChevronRight, ChevronLeft } from 'lucide-react';
import ClientStep from './steps/ClientStep';
import ItemsStep from './steps/ItemsStep';
import DetailsStep from './steps/DetailsStep';
import PreviewStep from './steps/PreviewStep';

interface WizardStep {
  id: string;
  title: string;
  description: string;
}

import type { Client, LineItem } from '../../../types';

export interface WizardDetails {
  invoiceNumber: string;
  issueDate: Date;
  dueDate: Date;
  terms: string;
  notes: string;
}

export interface WizardData {
  client: Client | null;
  items: LineItem[];
  details: WizardDetails;
}

const STEPS: WizardStep[] = [
  {
    id: 'client',
    title: 'Client Details',
    description: 'Select or add a new client',
  },
  {
    id: 'items',
    title: 'Invoice Items',
    description: 'Add products or services',
  },
  {
    id: 'details',
    title: 'Invoice Details',
    description: 'Set payment terms and due date',
  },
  {
    id: 'preview',
    title: 'Preview & Send',
    description: 'Review and send invoice',
  },
];

const CreateInvoiceWizard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<WizardData>({
    client: null,
    items: [],
    details: {
      invoiceNumber: '',
      issueDate: new Date(),
      dueDate: new Date(),
      terms: '',
      notes: '',
    },
  });

  const updateFormData = <K extends keyof WizardData>(step: K, data: WizardData[K]) => {
    setFormData(prev => ({
      ...prev,
      [step]: data,
    }));
  };

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    // TODO: Implement invoice submission
    console.log('Submit invoice:', formData);
    setIsOpen(false);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <ClientStep data={formData.client} onUpdate={(data) => updateFormData('client', data)} />;
      case 1:
        return <ItemsStep data={formData.items} onUpdate={(data) => updateFormData('items', data)} />;
      case 2:
        return <DetailsStep data={formData.details} onUpdate={(data) => updateFormData('details', data)} />;
      case 3:
        return <PreviewStep data={formData} />;
      default:
        return null;
    }
  };

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-primary-600 text-white rounded-lg flex items-center gap-2 hover:bg-primary-700 transition-colors"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Plus size={20} />
        New Invoice
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-4 md:inset-10 bg-white dark:bg-gray-800 rounded-xl shadow-xl z-50 overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Create New Invoice
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Fill in the information below to create a new invoice
                  </p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Progress bar */}
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  {STEPS.map((step, index) => (
                    <div
                      key={step.id}
                      className={`flex items-center ${
                        index < STEPS.length - 1 ? 'flex-1' : ''
                      }`}
                    >
                      <div className="relative flex items-center justify-center">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                            index <= currentStep
                              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30'
                              : 'border-gray-300 dark:border-gray-600'
                          }`}
                        >
                          <span
                            className={`text-sm font-medium ${
                              index <= currentStep
                                ? 'text-primary-600 dark:text-primary-400'
                                : 'text-gray-500 dark:text-gray-400'
                            }`}
                          >
                            {index + 1}
                          </span>
                        </div>
                        <div className="absolute -bottom-6 w-32 text-center">
                          <span
                            className={`text-sm font-medium ${
                              index <= currentStep
                                ? 'text-gray-900 dark:text-white'
                                : 'text-gray-500 dark:text-gray-400'
                            }`}
                          >
                            {step.title}
                          </span>
                        </div>
                      </div>
                      {index < STEPS.length - 1 && (
                        <div
                          className={`h-0.5 flex-1 mx-4 ${
                            index < currentStep
                              ? 'bg-primary-500'
                              : 'bg-gray-300 dark:bg-gray-600'
                          }`}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {renderStep()}
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-between">
                <button
                  onClick={handleBack}
                  disabled={currentStep === 0}
                  className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={20} />
                  Back
                </button>
                <button
                  onClick={currentStep === STEPS.length - 1 ? handleSubmit : handleNext}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg flex items-center gap-2 hover:bg-primary-700 transition-colors"
                >
                  {currentStep === STEPS.length - 1 ? (
                    'Create Invoice'
                  ) : (
                    <>
                      Next
                      <ChevronRight size={20} />
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default CreateInvoiceWizard;
