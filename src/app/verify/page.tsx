'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import ImageUploader from '@/components/ImageUploader';
import VerificationBadge from '@/components/VerificationBadge';
import type { UploadedImage } from '@/lib/upload-types';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const STEPS = [
  { label: 'ID Type' },
  { label: 'Upload ID' },
  { label: 'Selfie' },
  { label: 'Driver Info' },
  { label: 'Result' },
] as const;

const ID_TYPES = [
  {
    value: 'drivers_license',
    label: "Driver's License",
    description: 'US or international driver\'s license',
    recommended: true,
    icon: (
      <svg className="h-8 w-8 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
      </svg>
    ),
  },
  {
    value: 'passport',
    label: 'Passport',
    description: 'US or foreign passport',
    recommended: false,
    icon: (
      <svg className="h-8 w-8 text-forest-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
      </svg>
    ),
  },
  {
    value: 'state_id',
    label: 'State ID',
    description: 'State-issued identification card',
    recommended: false,
    icon: (
      <svg className="h-8 w-8 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z" />
      </svg>
    ),
  },
];

const US_STATES = [
  { value: 'AL', label: 'Alabama' }, { value: 'AK', label: 'Alaska' },
  { value: 'AZ', label: 'Arizona' }, { value: 'AR', label: 'Arkansas' },
  { value: 'CA', label: 'California' }, { value: 'CO', label: 'Colorado' },
  { value: 'CT', label: 'Connecticut' }, { value: 'DE', label: 'Delaware' },
  { value: 'FL', label: 'Florida' }, { value: 'GA', label: 'Georgia' },
  { value: 'HI', label: 'Hawaii' }, { value: 'ID', label: 'Idaho' },
  { value: 'IL', label: 'Illinois' }, { value: 'IN', label: 'Indiana' },
  { value: 'IA', label: 'Iowa' }, { value: 'KS', label: 'Kansas' },
  { value: 'KY', label: 'Kentucky' }, { value: 'LA', label: 'Louisiana' },
  { value: 'ME', label: 'Maine' }, { value: 'MD', label: 'Maryland' },
  { value: 'MA', label: 'Massachusetts' }, { value: 'MI', label: 'Michigan' },
  { value: 'MN', label: 'Minnesota' }, { value: 'MS', label: 'Mississippi' },
  { value: 'MO', label: 'Missouri' }, { value: 'MT', label: 'Montana' },
  { value: 'NE', label: 'Nebraska' }, { value: 'NV', label: 'Nevada' },
  { value: 'NH', label: 'New Hampshire' }, { value: 'NJ', label: 'New Jersey' },
  { value: 'NM', label: 'New Mexico' }, { value: 'NY', label: 'New York' },
  { value: 'NC', label: 'North Carolina' }, { value: 'ND', label: 'North Dakota' },
  { value: 'OH', label: 'Ohio' }, { value: 'OK', label: 'Oklahoma' },
  { value: 'OR', label: 'Oregon' }, { value: 'PA', label: 'Pennsylvania' },
  { value: 'RI', label: 'Rhode Island' }, { value: 'SC', label: 'South Carolina' },
  { value: 'SD', label: 'South Dakota' }, { value: 'TN', label: 'Tennessee' },
  { value: 'TX', label: 'Texas' }, { value: 'UT', label: 'Utah' },
  { value: 'VT', label: 'Vermont' }, { value: 'VA', label: 'Virginia' },
  { value: 'WA', label: 'Washington' }, { value: 'WV', label: 'West Virginia' },
  { value: 'WI', label: 'Wisconsin' }, { value: 'WY', label: 'Wyoming' },
  { value: 'DC', label: 'District of Columbia' },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function VerifyPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [verificationResult, setVerificationResult] = useState<'success' | 'failure' | null>(null);
  const [failureReason, setFailureReason] = useState('');

  // Step 1: ID type
  const [selectedIdType, setSelectedIdType] = useState<string | null>(null);
  const [showWhySection, setShowWhySection] = useState(false);

  // Step 2: ID photos
  const [idFrontPhotos, setIdFrontPhotos] = useState<UploadedImage[]>([]);
  const [idBackPhotos, setIdBackPhotos] = useState<UploadedImage[]>([]);

  // Step 3: Selfie
  const [selfiePhotos, setSelfiePhotos] = useState<UploadedImage[]>([]);

  // Step 4: Driver info
  const [licenseNumber, setLicenseNumber] = useState('');
  const [licenseState, setLicenseState] = useState('');
  const [licenseExpiry, setLicenseExpiry] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [yearsLicensed, setYearsLicensed] = useState('');
  const [noDui, setNoDui] = useState(false);
  const [noMajor, setNoMajor] = useState(false);
  const [noMinor, setNoMinor] = useState(false);

  // -------------------------------------------------------------------------
  // Step validation
  // -------------------------------------------------------------------------

  function canProceed(): boolean {
    switch (currentStep) {
      case 0:
        return !!selectedIdType;
      case 1: {
        const hasFront = idFrontPhotos.length > 0;
        const needsBack = selectedIdType !== 'passport';
        return needsBack ? hasFront && idBackPhotos.length > 0 : hasFront;
      }
      case 2:
        return selfiePhotos.length > 0;
      case 3:
        return (
          licenseNumber.trim().length > 0 &&
          licenseState.length === 2 &&
          licenseExpiry.length > 0 &&
          dateOfBirth.length > 0 &&
          yearsLicensed.length > 0 &&
          noDui &&
          noMajor &&
          noMinor
        );
      default:
        return false;
    }
  }

  // -------------------------------------------------------------------------
  // API calls
  // -------------------------------------------------------------------------

  const submitStep = useCallback(
    async (step: string, payload: Record<string, unknown>) => {
      setIsSubmitting(true);
      try {
        const res = await fetch('/api/verify/identity', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ step, ...payload }),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({ error: 'Request failed' }));
          throw new Error(err.error || 'Verification step failed');
        }
        return await res.json();
      } finally {
        setIsSubmitting(false);
      }
    },
    [],
  );

  async function handleNext() {
    if (!canProceed()) return;

    try {
      switch (currentStep) {
        case 0:
          // ID type selection -- no API call, just advance
          setCurrentStep(1);
          break;

        case 1:
          await submitStep('id_document', {
            idType: selectedIdType,
            idFrontPhoto: idFrontPhotos[0]?.url || '',
            idBackPhoto: idBackPhotos[0]?.url,
          });
          setCurrentStep(2);
          break;

        case 2:
          await submitStep('selfie', {
            selfiePhoto: selfiePhotos[0]?.url || '',
          });
          setCurrentStep(3);
          break;

        case 3: {
          setCurrentStep(4);
          setIsProcessing(true);

          const result = await submitStep('driver_info', {
            licenseNumber,
            licenseState,
            licenseExpiry,
            dateOfBirth,
            yearsLicensed: parseInt(yearsLicensed, 10),
          });

          // Simulate processing delay
          await new Promise((r) => setTimeout(r, 2000));
          setIsProcessing(false);

          if (result?.verification?.status === 'VERIFIED') {
            setVerificationResult('success');
          } else {
            setVerificationResult('failure');
            setFailureReason(
              result?.verification?.rejectionReason || 'Verification could not be completed.',
            );
          }
          break;
        }
      }
    } catch (err) {
      if (currentStep === 3) {
        setIsProcessing(false);
        setVerificationResult('failure');
        setFailureReason(err instanceof Error ? err.message : 'An unexpected error occurred.');
      }
    }
  }

  function handleBack() {
    if (currentStep > 0 && currentStep < 4) {
      setCurrentStep(currentStep - 1);
    }
  }

  function handleTryAgain() {
    setCurrentStep(0);
    setVerificationResult(null);
    setIsProcessing(false);
    setFailureReason('');
  }

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Identity Verification</h1>
          <p className="mt-2 text-sm text-gray-500">
            Verify your identity to unlock full access to the Rival RV marketplace.
          </p>
        </div>

        {/* Progress bar */}
        <div className="mb-10">
          <div className="flex items-center justify-between">
            {STEPS.map((step, i) => (
              <div key={step.label} className="flex items-center flex-1 last:flex-none">
                {/* Step circle */}
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      'h-8 w-8 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-colors',
                      i < currentStep
                        ? 'bg-brand-500 border-brand-500 text-white'
                        : i === currentStep
                          ? 'bg-brand-600 border-brand-600 text-white'
                          : 'bg-white border-gray-300 text-gray-400',
                    )}
                  >
                    {i < currentStep ? (
                      <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path
                          fillRule="evenodd"
                          d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      i + 1
                    )}
                  </div>
                  <span
                    className={cn(
                      'mt-1.5 text-[10px] sm:text-xs font-medium whitespace-nowrap',
                      i <= currentStep ? 'text-brand-600' : 'text-gray-400',
                    )}
                  >
                    {step.label}
                  </span>
                </div>
                {/* Connecting line */}
                {i < STEPS.length - 1 && (
                  <div
                    className={cn(
                      'flex-1 h-0.5 mx-2 mt-[-18px]',
                      i < currentStep ? 'bg-brand-500' : 'bg-gray-300',
                    )}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step content card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Step 1: ID Type Selection */}
          {currentStep === 0 && (
            <div className="p-6 sm:p-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-1">Select ID Type</h2>
              <p className="text-sm text-gray-500 mb-6">
                Choose the type of government-issued ID you will use for verification.
              </p>

              <div className="space-y-3">
                {ID_TYPES.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setSelectedIdType(type.value)}
                    className={cn(
                      'w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left',
                      selectedIdType === type.value
                        ? 'border-brand-500 bg-brand-50 ring-1 ring-brand-200'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50',
                    )}
                  >
                    <div className="shrink-0">{type.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900">{type.label}</span>
                        {type.recommended && (
                          <span className="badge bg-brand-100 text-brand-700 text-[10px]">
                            Recommended
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mt-0.5">{type.description}</p>
                    </div>
                    <div
                      className={cn(
                        'h-5 w-5 rounded-full border-2 shrink-0 flex items-center justify-center',
                        selectedIdType === type.value
                          ? 'border-brand-500 bg-brand-500'
                          : 'border-gray-300',
                      )}
                    >
                      {selectedIdType === type.value && (
                        <svg className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                          <path
                            fillRule="evenodd"
                            d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {/* Why we need this */}
              <div className="mt-6 border-t border-gray-100 pt-4">
                <button
                  type="button"
                  onClick={() => setShowWhySection(!showWhySection)}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 font-medium"
                >
                  <svg
                    className={cn('h-4 w-4 transition-transform', showWhySection && 'rotate-90')}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                  Why we need this
                </button>
                {showWhySection && (
                  <div className="mt-3 ml-6 text-sm text-gray-500 space-y-2">
                    <p>
                      Identity verification helps keep the Rival RV community safe. We verify every
                      user to prevent fraud, protect against unauthorized access, and build trust
                      between hosts and guests.
                    </p>
                    <p>
                      Your personal information is encrypted and handled in compliance with privacy
                      regulations. We never share your documents with other users.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 2: ID Upload */}
          {currentStep === 1 && (
            <div className="p-6 sm:p-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-1">Upload Your ID</h2>
              <p className="text-sm text-gray-500 mb-6">
                Take a clear photo of your{' '}
                {ID_TYPES.find((t) => t.value === selectedIdType)?.label || 'ID'}.
              </p>

              {/* Front of ID */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Front of ID <span className="text-red-500">*</span>
                </label>
                <ImageUploader
                  onUpload={setIdFrontPhotos}
                  category="verification"
                  maxFiles={1}
                />
              </div>

              {/* Back of ID (not for passport) */}
              {selectedIdType !== 'passport' && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Back of ID <span className="text-red-500">*</span>
                  </label>
                  <ImageUploader
                    onUpload={setIdBackPhotos}
                    category="verification"
                    maxFiles={1}
                  />
                </div>
              )}

              {/* Photo requirements */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Photo Requirements</h3>
                <ul className="text-sm text-gray-500 space-y-1.5">
                  <li className="flex items-start gap-2">
                    <svg className="h-4 w-4 text-brand-500 mt-0.5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                    </svg>
                    Clear, well-lit photo with no blur
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="h-4 w-4 text-brand-500 mt-0.5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                    </svg>
                    No glare or reflections
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="h-4 w-4 text-brand-500 mt-0.5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                    </svg>
                    All four corners of the ID must be visible
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="h-4 w-4 text-brand-500 mt-0.5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                    </svg>
                    Place ID on a flat, dark surface
                  </li>
                </ul>
              </div>

              {/* Example placeholder */}
              <div className="mt-4 bg-gray-100 rounded-xl p-6 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-48 h-28 bg-gray-200 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center mx-auto">
                    <svg className="h-10 w-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                    </svg>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">Example: ID positioned correctly</p>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Selfie */}
          {currentStep === 2 && (
            <div className="p-6 sm:p-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-1">Take a Selfie</h2>
              <p className="text-sm text-gray-500 mb-6">
                We need a photo of your face to match against your ID.
              </p>

              <ImageUploader
                onUpload={setSelfiePhotos}
                category="verification"
                maxFiles={1}
              />

              {/* Instructions */}
              <div className="mt-6 bg-gray-50 rounded-xl p-4 space-y-3">
                <h3 className="text-sm font-medium text-gray-700">Selfie Guidelines</h3>
                <ul className="text-sm text-gray-500 space-y-1.5">
                  <li className="flex items-start gap-2">
                    <svg className="h-4 w-4 text-brand-500 mt-0.5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                    </svg>
                    Face the camera directly
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="h-4 w-4 text-brand-500 mt-0.5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                    </svg>
                    Good, even lighting on your face
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="h-4 w-4 text-red-400 mt-0.5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                    </svg>
                    No sunglasses, hats, or face coverings
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="h-4 w-4 text-brand-500 mt-0.5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                    </svg>
                    Photo must match the face on your ID
                  </li>
                </ul>
              </div>

              {/* Why a selfie? */}
              <div className="mt-4 bg-sky-50 rounded-xl p-4 flex gap-3">
                <svg className="h-5 w-5 text-sky-600 mt-0.5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-sky-800">Why a selfie?</p>
                  <p className="text-sm text-sky-700 mt-0.5">
                    We use biometric matching to compare your selfie with the photo on your ID.
                    This ensures no one else can use your documents for verification.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Driver Information */}
          {currentStep === 3 && (
            <div className="p-6 sm:p-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-1">Driver Information</h2>
              <p className="text-sm text-gray-500 mb-6">
                Provide your driver&apos;s license details for our driving record check.
              </p>

              <div className="space-y-4">
                {/* License number */}
                <div>
                  <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    License Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="licenseNumber"
                    type="text"
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                    placeholder="e.g. D1234567"
                    className="input-field"
                  />
                </div>

                {/* State */}
                <div>
                  <label htmlFor="licenseState" className="block text-sm font-medium text-gray-700 mb-1">
                    State <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="licenseState"
                    value={licenseState}
                    onChange={(e) => setLicenseState(e.target.value)}
                    className="input-field"
                  >
                    <option value="">Select state...</option>
                    {US_STATES.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Expiry + DOB row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="licenseExpiry" className="block text-sm font-medium text-gray-700 mb-1">
                      License Expiry <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="licenseExpiry"
                      type="date"
                      value={licenseExpiry}
                      onChange={(e) => setLicenseExpiry(e.target.value)}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
                      Date of Birth <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="dateOfBirth"
                      type="date"
                      value={dateOfBirth}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                      className="input-field"
                    />
                  </div>
                </div>

                {/* Years of experience */}
                <div>
                  <label htmlFor="yearsLicensed" className="block text-sm font-medium text-gray-700 mb-1">
                    Years of Driving Experience <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="yearsLicensed"
                    value={yearsLicensed}
                    onChange={(e) => setYearsLicensed(e.target.value)}
                    className="input-field"
                  >
                    <option value="">Select...</option>
                    {Array.from({ length: 49 }, (_, i) => i + 2).map((y) => (
                      <option key={y} value={y}>
                        {y === 50 ? '50+' : y} years
                      </option>
                    ))}
                  </select>
                </div>

                {/* Declarations */}
                <div className="border-t border-gray-100 pt-4 mt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Declarations</h3>
                  <div className="space-y-3">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={noDui}
                        onChange={(e) => setNoDui(e.target.checked)}
                        className="mt-0.5 h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                      />
                      <span className="text-sm text-gray-600">
                        I have no DUI/DWI convictions in the past 7 years
                      </span>
                    </label>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={noMajor}
                        onChange={(e) => setNoMajor(e.target.checked)}
                        className="mt-0.5 h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                      />
                      <span className="text-sm text-gray-600">
                        I have no major driving violations in the past 3 years
                      </span>
                    </label>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={noMinor}
                        onChange={(e) => setNoMinor(e.target.checked)}
                        className="mt-0.5 h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                      />
                      <span className="text-sm text-gray-600">
                        I have no more than 2 minor violations/accidents in the past 3 years
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Processing / Result */}
          {currentStep === 4 && (
            <div className="p-6 sm:p-8">
              {isProcessing && (
                <div className="text-center py-12">
                  {/* Spinning shield */}
                  <div className="inline-flex items-center justify-center mb-6">
                    <svg
                      className="h-16 w-16 text-brand-500 animate-spin"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                      />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Verifying Your Identity</h2>
                  <p className="text-sm text-gray-500 mb-6">
                    Please wait while we process your documents...
                  </p>
                  {/* Progress dots */}
                  <div className="flex items-center justify-center gap-1.5">
                    <div className="h-2 w-2 rounded-full bg-brand-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="h-2 w-2 rounded-full bg-brand-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="h-2 w-2 rounded-full bg-brand-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}

              {verificationResult === 'success' && (
                <div className="text-center py-12">
                  {/* Green checkmark */}
                  <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-brand-100 mb-6">
                    <svg className="h-10 w-10 text-brand-600" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>

                  <h2 className="text-2xl font-bold text-gray-900 mb-2">You&apos;re Verified!</h2>
                  <p className="text-sm text-gray-500 mb-4">
                    Your identity has been successfully verified.
                  </p>

                  {/* Badge preview */}
                  <div className="inline-flex items-center gap-2 bg-gray-50 rounded-full px-4 py-2 mb-6">
                    <VerificationBadge level="fully_verified" size="lg" showLabel />
                  </div>

                  <p className="text-sm text-gray-500 mb-8">
                    Your verified badge is now visible across the platform.
                  </p>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <Link href="/search" className="btn-primary px-8">
                      Browse RVs
                    </Link>
                    <Link href="/dashboard/guest" className="btn-secondary px-8">
                      Go to Dashboard
                    </Link>
                  </div>
                </div>
              )}

              {verificationResult === 'failure' && (
                <div className="text-center py-12">
                  {/* Red X */}
                  <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-red-100 mb-6">
                    <svg className="h-10 w-10 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>

                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Verification Failed</h2>
                  <p className="text-sm text-gray-500 mb-2">
                    We were unable to verify your identity.
                  </p>
                  {failureReason && (
                    <p className="text-sm text-red-600 mb-8 max-w-md mx-auto">
                      Reason: {failureReason}
                    </p>
                  )}

                  <button
                    type="button"
                    onClick={handleTryAgain}
                    className="btn-primary px-8"
                  >
                    Try Again
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Navigation buttons */}
          {currentStep < 4 && (
            <div className="px-6 py-4 sm:px-8 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
              <button
                type="button"
                onClick={handleBack}
                disabled={currentStep === 0}
                className={cn(
                  'btn-ghost gap-1.5',
                  currentStep === 0 && 'invisible',
                )}
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
                Back
              </button>

              <button
                type="button"
                onClick={handleNext}
                disabled={!canProceed() || isSubmitting}
                className={cn(
                  'btn-primary gap-1.5',
                  (!canProceed() || isSubmitting) && 'opacity-50 cursor-not-allowed',
                )}
              >
                {isSubmitting ? (
                  <>
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    {currentStep === 3 ? 'Submit & Verify' : 'Next'}
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
