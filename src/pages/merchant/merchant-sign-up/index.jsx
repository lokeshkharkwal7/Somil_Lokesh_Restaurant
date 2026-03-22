import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import {createRestaurantOnboarding} from '../../../services/restaurant-onboarding'; // BUG 5 FIX: corrected import to match export in services/restaurant-onboarding/index.js
import axios from 'axios';

export default function RestaurantRegistration() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [step, setStep] = useState(1); // 1: Form, 2: QR Code & Transaction ID
  const [formData, setFormData] = useState(null);
  const [transactionId, setTransactionId] = useState('');
  const [transactionError, setTransactionError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      ownerName: '',
      contactNumber: '',
      email: '',
      address: {
        street: '',
        city: '',
        state: '',
        country: '',
        pincode: ''
      }
    }
  });

  // Field icons mapping
  const fieldIcons = {
    name: (
      <svg className="h-5 w-5 text-[#86868b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
      </svg>
    ),
    ownerName: (
      <svg className="h-5 w-5 text-[#86868b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    contactNumber: (
      <svg className="h-5 w-5 text-[#86868b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
    email: (
      <svg className="h-5 w-5 text-[#86868b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    street: (
      <svg className="h-5 w-5 text-[#86868b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    city: (
      <svg className="h-5 w-5 text-[#86868b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2M9 7h.01M11 7h.01M13 7h.01M15 7h.01" />
      </svg>
    ),
    state: (
      <svg className="h-5 w-5 text-[#86868b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2 2 2 2-2 2 2 2-2 2 2 2-2 2 2 2-2 2 2" />
      </svg>
    ),
    country: (
      <svg className="h-5 w-5 text-[#86868b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    pincode: (
      <svg className="h-5 w-5 text-[#86868b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    )
  };

  // Validation helper functions
  const validateNoEmoji = (value) => {
    const emojiRegex = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
    return !emojiRegex.test(value) || 'Emojis are not allowed';
  };

  const validateNoSpecialChars = (value) => {
    const nameRegex = /^[a-zA-Z\s\.\-']*$/;
    return nameRegex.test(value) || 'Only letters, spaces, dots, hyphens, and apostrophes are allowed';
  };

  const validateNoNumbers = (value) => {
    const numberRegex = /\d/;
    return !numberRegex.test(value) || 'Numbers are not allowed';
  };

  const validateContactNumber = (value) => {
    const phoneRegex = /^\d{10,15}$/;
    if (value && !/^\d*$/.test(value)) {
      return 'Only numbers are allowed';
    }
    return phoneRegex.test(value) || 'Contact number must be 10-15 digits';
  };

  const validatePincode = (value) => {
    if (value && !/^\d*$/.test(value)) {
      return 'Only numbers are allowed';
    }
    const pincodeRegex = /^\d{6}$/;
    return pincodeRegex.test(value) || 'Pincode must be exactly 6 digits';
  };

  const validateEmail = (value) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(value) || 'Invalid email address';
  };

  const validateTransactionId = (value) => {
    if (!value.trim()) {
      return 'Transaction ID is required';
    }
    if (value.length < 6) {
      return 'Transaction ID must be at least 6 characters';
    }
    return true;
  };

  // Input handlers
  const handleNameChange = (e, onChange) => {
    let value = e.target.value;
    value = value.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '');
    value = value.replace(/\d/g, '');
    value = value.replace(/[^a-zA-Z\s\.\-']/g, '');
    onChange(value);
  };

  const handleContactNumberChange = (e, onChange) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 15) value = value.slice(0, 15);
    onChange(value);
  };

  const handlePincodeChange = (e, onChange) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 6) value = value.slice(0, 6);
    onChange(value);
  };

  const handleTextChange = (e, onChange) => {
    let value = e.target.value;
    value = value.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '');
    onChange(value);
  };

  // Form fields configuration
  // Form fields configuration
  const formFields = [
    {
      id: 'name',
      label: 'Restaurant Name *',
      type: 'text',
      placeholder: 'please provide the restaurant name',
      section: 'main',
      validation: {
        required: 'Restaurant name is required',
        validate: {
          noEmoji: validateNoEmoji,
          noNumbers: validateNoNumbers,
          validChars: validateNoSpecialChars
        }
      },
      changeHandler: handleNameChange
    },
    {
      id: 'ownerName',
      label: 'Owner Name *',
      type: 'text',
      placeholder: 'please provide the owner name',
      section: 'main',
      validation: {
        required: 'Owner name is required',
        validate: {
          noEmoji: validateNoEmoji,
          noNumbers: validateNoNumbers,
          validChars: validateNoSpecialChars
        }
      },
      changeHandler: handleNameChange
    },
    {
      id: 'contactNumber',
      label: 'Contact Number *',
      type: 'tel',
      placeholder: 'please provide the contact number',
      section: 'main',
      validation: {
        required: 'Contact number is required',
        validate: validateContactNumber
      },
      changeHandler: handleContactNumberChange
    },
    {
      id: 'email',
      label: 'Email Address *',
      type: 'email',
      placeholder: 'please provide the working email address',
      section: 'main',
      validation: {
        required: 'Email is required',
        validate: validateEmail
      },
      changeHandler: handleTextChange
    }
  ];

  const addressFields = [
    {
      id: 'street',
      label: 'Street Address *',
      type: 'text',
      placeholder: 'please provide the street address',
      section: 'address',
      validation: {
        required: 'Street address is required',
        validate: {
          noEmoji: validateNoEmoji
        }
      },
      changeHandler: handleTextChange
    },
    {
      id: 'city',
      label: 'City *',
      type: 'text',
      placeholder: 'please provide the city name',
      section: 'address',
      validation: {
        required: 'City is required',
        validate: {
          noEmoji: validateNoEmoji,
          noNumbers: validateNoNumbers,
          validChars: validateNoSpecialChars
        }
      },
      changeHandler: handleNameChange
    },
    {
      id: 'state',
      label: 'State *',
      type: 'text',
      placeholder: 'please provide the state name',
      section: 'address',
      validation: {
        required: 'State is required',
        validate: {
          noEmoji: validateNoEmoji,
          noNumbers: validateNoNumbers,
          validChars: validateNoSpecialChars
        }
      },
      changeHandler: handleNameChange
    },
    {
      id: 'country',
      label: 'Country *',
      type: 'text',
      placeholder: 'India',
      section: 'address',
      validation: {
        required: 'please provide the country name',
        validate: {
          noEmoji: validateNoEmoji,
          noNumbers: validateNoNumbers,
          validChars: validateNoSpecialChars
        }
      },
      changeHandler: handleNameChange
    },
    {
      id: 'pincode',
      label: 'Pincode *',
      type: 'text',
      placeholder: 'please provide the pincode',
      section: 'address',
      validation: {
        required: 'Pincode is required',
        validate: validatePincode
      },
      changeHandler: handlePincodeChange
    }
  ];

  const renderField = (field, isAddressField = false) => {
    const fieldPath = isAddressField ? `address.${field.id}` : field.id;
    const error = isAddressField ? errors.address?.[field.id] : errors[field.id];

    return (
      <div key={field.id}>
        <label htmlFor={field.id} className="block text-sm font-medium text-[#1d1d1f] mb-1.5 tracking-tight">
          {field.label}
        </label>
        <div className="relative">
          {fieldIcons[field.id] && (
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              {fieldIcons[field.id]}
            </div>
          )}
          <Controller
            name={fieldPath}
            control={control}
            rules={field.validation}
            render={({ field: { onChange, value } }) => (
              <input
                id={field.id}
                type={field.type}
                value={value || ''}
                onChange={(e) => field.changeHandler(e, onChange)}
                className={`block w-full ${fieldIcons[field.id] ? 'pl-11' : 'px-4'} pr-4 py-3.5 bg-[#f5f5f7] border-0 rounded-2xl text-[#1d1d1f] placeholder-[#86868b] focus:ring-2 focus:ring-[#007aff] text-sm`}
                placeholder={field.placeholder}
                style={{ boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.02), 0 1px 2px rgba(255,255,255,0.8)' }}
              />
            )}
          />
        </div>
        {error && (
          <p className="mt-1 text-xs text-[#ff3b30]">{error.message}</p>
        )}
      </div>
    );
  };

  const onFormSubmit = (data) => {
    setFormData(data);
    setStep(2);
  };

  const handleTransactionSubmit = async (e) => {
    e.preventDefault();
    
    // Validate transaction ID
    const validation = validateTransactionId(transactionId);
    if (validation !== true) {
      setTransactionError(validation);
      return;
    }

    setTransactionError('');
    setSubmitting(true);

    try {
      // Add transaction ID to the form data
      const finalData = {
        ...formData,
        transactionId: transactionId,
        // paymentStatus: 'completed'
      };

      // Call the POST API
    //   const response = await axios.post('http://localhost:5000/api/restaurants', finalData, {
    //     headers: {
    //       'Content-Type': 'application/json'
    //     }
    //   });
      const response = await createRestaurantOnboarding(finalData)

      if (response.data) {
        // Navigate to success page
        navigate('/registration-success', { 
          state: { 
            message: "Your response has been noted. Our team will contact you soon." 
          } 
        });
      }
    } catch (err) {
      setTransactionError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Step 2: QR Code and Transaction ID Page
  if (step === 2) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f5f7] relative overflow-hidden py-8">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#f5f5f7] via-[#ffffff] to-[#f0f0f3]"></div>

        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#007aff] opacity-5 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-[#5856d6] opacity-5 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-[#007aff] via-[#5856d6] to-[#ff2d55] opacity-[0.02] rounded-full blur-3xl"></div>
        </div>

        <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '128px 128px'
        }}></div>

        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(0, 122, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 122, 255, 0.03) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}></div>

        {/* Payment Card */}
        <div
          className="relative max-w-3xl w-full space-y-6 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/50"
          style={{
            boxShadow: '0 20px 40px -15px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.02) inset, 0 0 0 1px rgba(255,255,255,0.8) inset'
          }}
        >
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-[#007aff] to-[#5856d6] rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 4v2h12V8H4zm12 4H4v2h12v-2z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
            <h2 className="text-3xl font-semibold text-[#1d1d1f] tracking-tight">Complete Payment</h2>
            <p className="text-sm text-[#86868b] font-normal">
              Scan the QR code to complete your registration
            </p>
          </div>

          <div className="space-y-6">
            {/* QR Code Placeholder */}
            <div className="flex justify-center">
              <div className="w-64 h-64 bg-gradient-to-br from-[#007aff] to-[#5856d6] rounded-2xl flex items-center justify-center shadow-lg p-4">
                <div className="w-full h-full bg-white rounded-xl flex items-center justify-center">
                  {/* This is where you'd put your actual QR code image */}
                  <div className="text-center">
                    <div className="w-48 h-48 mx-auto bg-[#f5f5f7] rounded-lg flex items-center justify-center border-2 border-dashed border-[#007aff]/30">
                      <svg className="w-16 h-16 text-[#007aff]/50" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M3 3h7v7H3V3zm2 2v3h3V5H5zm-2 9h7v7H3v-7zm2 2v3h3v-3H5zm9-13h7v7h-7V3zm2 2v3h3V5h-3zm-2 9h7v7h-7v-7zm2 2v3h3v-3h-3z"/>
                      </svg>
                    </div>
                    <p className="text-xs text-[#86868b] mt-2">Scan with any UPI app</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Amount */}
            <div className="text-center">
              <p className="text-sm text-[#86868b]">Amount to pay</p>
              <p className="text-3xl font-semibold text-[#1d1d1f]">₹ 500</p>
              <p className="text-xs text-[#86868b] mt-1">Subscription fee (Monthly)</p>
            </div>

            {/* Transaction ID Form */}
            <form onSubmit={handleTransactionSubmit} className="space-y-4">
              <div>
                <label htmlFor="transactionId" className="block text-sm font-medium text-[#1d1d1f] mb-1.5 tracking-tight">
                  Enter Transaction ID *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-[#86868b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                    </svg>
                  </div>
                  <input
                    id="transactionId"
                    type="text"
                    value={transactionId}
                    onChange={(e) => {
                      setTransactionId(e.target.value);
                      setTransactionError('');
                    }}
                    className="block w-full pl-11 pr-4 py-3.5 bg-[#f5f5f7] border-0 rounded-2xl text-[#1d1d1f] placeholder-[#86868b] focus:ring-2 focus:ring-[#007aff] text-sm"
                    placeholder="e.g., TXN123456789"
                    style={{ boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.02), 0 1px 2px rgba(255,255,255,0.8)' }}
                  />
                </div>
                {transactionError && (
                  <p className="mt-1 text-xs text-[#ff3b30]">{transactionError}</p>
                )}
                <p className="mt-2 text-xs text-[#86868b]">
                  After making the payment, enter the transaction ID from your UPI app
                </p>
              </div>

              <div className="flex justify-center pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-48 flex justify-center py-2.5 px-6 rounded-xl text-sm font-semibold text-white bg-[#007aff] hover:bg-[#0051a8] focus:outline-none focus:ring-2 focus:ring-[#007aff] focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  style={{ boxShadow: '0 2px 8px rgba(0,122,255,0.3)' }}
                >
                  {submitting ? 'Submitting...' : 'Submit'}
                </button>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-sm text-[#86868b] hover:text-[#007aff]"
                >
                  ← Back to form
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Step 1: Registration Form (your existing form code)
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f5f7] relative overflow-hidden py-8">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#f5f5f7] via-[#ffffff] to-[#f0f0f3]"></div>

      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#007aff] opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-[#5856d6] opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-[#007aff] via-[#5856d6] to-[#ff2d55] opacity-[0.02] rounded-full blur-3xl"></div>
      </div>

      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat',
        backgroundSize: '128px 128px'
      }}></div>

      <div className="absolute inset-0" style={{
        backgroundImage: `linear-gradient(rgba(0, 122, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 122, 255, 0.03) 1px, transparent 1px)`,
        backgroundSize: '50px 50px'
      }}></div>

      {/* Registration Card */}
      <div
        className="relative max-w-3xl w-full space-y-6 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/50 my-8"
        style={{
          boxShadow: '0 20px 40px -15px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.02) inset, 0 0 0 1px rgba(255,255,255,0.8) inset'
        }}
      >
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-[#007aff] to-[#5856d6] rounded-2xl flex items-center justify-center shadow-lg">
              <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
          <h2 className="text-3xl font-semibold text-[#1d1d1f] tracking-tight">Register Your Restaurant</h2>
          <p className="text-sm text-[#86868b] font-normal">
            Fill in the details to create your merchant account
          </p>
        </div>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit(onFormSubmit)}>
          {error && (
            <div className="bg-[#ffe5e5] text-[#ff3b30] px-4 py-3 rounded-xl text-sm flex items-center border border-[#ff3b30]/20">
              <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="bg-[#e5ffe5] text-[#34c759] px-4 py-3 rounded-xl text-sm flex items-center border border-[#34c759]/20">
              <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>{success}</span>
            </div>
          )}

          <div className="space-y-4">
            {/* Main Fields */}
            {formFields.map(field => renderField(field, false))}

            {/* Address Section */}
            <div className="space-y-4 pt-2">
              <h3 className="text-lg font-medium text-[#1d1d1f]">Address Details</h3>
              {addressFields.map(field => renderField(field, true))}
            </div>
          </div>

          <div className="flex justify-center pt-6">
            <button
              type="submit"
              disabled={loading}
              className="w-48 flex justify-center py-2.5 px-6 rounded-xl text-sm font-semibold text-white bg-[#007aff] hover:bg-[#0051a8] focus:outline-none focus:ring-2 focus:ring-[#007aff] focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
              style={{ boxShadow: '0 2px 8px rgba(0,122,255,0.3)' }}
            >
              {loading ? 'Please wait...' : 'Proceed further'}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-[#86868b]">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('/merchant/login')}
                className="text-[#007aff] hover:text-[#0051a8] font-medium"
              >
                Sign In
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}