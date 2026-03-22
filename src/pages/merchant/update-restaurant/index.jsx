import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { useSingleRestaurant, useUpdateRestaurant } from '../../../hooks/restaurant';

// ── Icons (unchanged) ──────────────────────────────────────────────────────────
const Icons = {
  restaurant: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
    </svg>
  ),
  owner: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  phone: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  ),
  email: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  password: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  ),
  location: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  street: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12h18M3 12l2-2m-2 2l2 2m12-2l2-2m-2 2l2 2" />
    </svg>
  ),
  city: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2M9 7h.01M11 7h.01M13 7h.01M15 7h.01" />
    </svg>
  ),
  state: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2 2 2 2-2 2 2 2-2 2 2 2-2 2 2 2-2 2 2" />
    </svg>
  ),
  country: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  pincode: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  coordinates: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
    </svg>
  ),
  success: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
  ),
  error: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
    </svg>
  ),
  arrowLeft: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
  ),
  save: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
    </svg>
  ),
  spinner: (
    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  ),
};

// ── Helpers ────────────────────────────────────────────────────────────────────

/**
 * Normalise the API response shape.
 * Some APIs wrap the doc: { restaurant: {...} }, others return it directly.
 */
// const extractRestaurant = (data) => data?.restaurant ?? data ?? null;
// Before
// const extractRestaurant = (data) => data?.restaurant ?? data ?? null;

// After — handles { data: {...} }, { restaurant: {...} }, or a bare object
const extractRestaurant = (raw) => raw?.data ?? raw?.restaurant ?? raw ?? null;

/** Build the clean form-ready object from raw API data */
const toFormValues = (raw) => ({
  name:          raw.name          ?? '',
  ownerName:     raw.ownerName     ?? '',
  contactNumber: raw.contactNumber ?? '',
  email:         raw.email         ?? '',
  password:      '',                        // always blank for security
  address: {
    street:    raw.address?.street    ?? '',
    city:      raw.address?.city      ?? '',
    state:     raw.address?.state     ?? '',
    country:   raw.address?.country   ?? 'India',
    pincode:   raw.address?.pincode   ?? '',
    latitude:  raw.address?.latitude  != null ? String(raw.address.latitude)  : '',
    longitude: raw.address?.longitude != null ? String(raw.address.longitude) : '',
  },
});

// ── Component ─────────────────────────────────────────────────────────────────

export default function RestaurantUpdateForm() {
  const { rest_id: id } = useParams();
  const navigate = useNavigate();

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage,   setErrorMessage]   = useState('');

  // ── Data fetching ────────────────────────────────────────────────────────────
  const {
    data: rawData,
    isLoading:  isLoadingRestaurant,
    isError:    isFetchError,
    error:      fetchError,
    refetch:    refetchRestaurant,
  } = useSingleRestaurant(id);

  // FIX 1 – normalise API shape so the form always gets a plain restaurant object
  const restaurant = extractRestaurant(rawData);

  // ── Mutation ─────────────────────────────────────────────────────────────────
  // FIX 2 – destructure `isPending` (React Query v5) with `isLoading` as alias
  //         for backward-compat with v4. Whichever your project uses will work.
  const {
    mutateAsync: updateRestaurant,
    isPending:   isUpdating = false,   // React Query v5
    isError:     isUpdateError,
    error:       updateError,
  } = useUpdateRestaurant();

  // ── Form ─────────────────────────────────────────────────────────────────────
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isValid, isSubmitting },
  } = useForm({
    defaultValues: {
      name: '', ownerName: '', contactNumber: '', email: '', password: '',
      address: { street: '', city: '', state: '', country: 'India', pincode: '', latitude: '', longitude: '' },
    },
    mode: 'onChange',
  });

  // FIX 3 – removed `isDataLoaded` flag; just depend on `restaurant` identity.
  //         `reset()` is idempotent and React Query won't change the reference
  //         unless the server returns new data, so this is safe.
  useEffect(() => {
    if (restaurant) {
      reset(toFormValues(restaurant));
    }
  }, [restaurant, reset]);

  // ── Validation helpers ───────────────────────────────────────────────────────
  const validateNoEmoji = (v) => {
    const emojiRegex = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
    return !emojiRegex.test(v) || 'Emojis are not allowed';
  };

  const validateContactNumber = (v) => {
    if (v && !/^\d*$/.test(v))   return 'Only numbers are allowed';
    return /^\d{10,15}$/.test(v) || 'Contact number must be 10–15 digits';
  };

  const validatePincode = (v) => {
    if (v && !/^\d*$/.test(v))  return 'Only numbers are allowed';
    return /^\d{6}$/.test(v)    || 'Pincode must be exactly 6 digits';
  };

  const validateEmail = (v) => {
    if (!v) return true;
    return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(v) || 'Invalid email address';
  };

  const validateCoordinates = (v) => {
    if (!v) return true;
    return !isNaN(v) || 'Must be a valid number';
  };

  // ── Input change handlers ────────────────────────────────────────────────────
  const handlePhoneChange  = (e, onChange) => onChange(e.target.value.replace(/\D/g, '').slice(0, 15));
  const handlePincodeChange = (e, onChange) => onChange(e.target.value.replace(/\D/g, '').slice(0, 6));
  const handleTextChange   = (e, onChange) => {
    onChange(e.target.value.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, ''));
  };

  // ── Submit ───────────────────────────────────────────────────────────────────
  const onSubmit = async (data) => {
    setSuccessMessage('');
    setErrorMessage('');

    try {
      // FIX 4 – use `_id` (not `id`) so the hook's onSuccess cache key matches.
      // FIX 5 – build payload explicitly instead of spreading `data`, so the
      //         password field is only included when the user actually typed one.
      const payload = {
        _id:           id,
        name:          data.name,
        ownerName:     data.ownerName,
        contactNumber: data.contactNumber,
        email:         data.email,
        address: {
          street:    data.address.street,
          city:      data.address.city,
          state:     data.address.state,
          country:   data.address.country,
          pincode:   data.address.pincode,
          ...(data.address.latitude  && { latitude:  parseFloat(data.address.latitude)  }),
          ...(data.address.longitude && { longitude: parseFloat(data.address.longitude) }),
        },
        // Only include password when the user explicitly typed something
        ...(data.password.trim() && { password: data.password }),
      };

      await updateRestaurant(payload);

      setSuccessMessage('Restaurant updated successfully!');

      // Refresh the cache entry so the detail page shows fresh data immediately
      await refetchRestaurant();

      setTimeout(() => navigate(`/restaurants/${id}`), 2000);
    } catch (err) {
      const msg = err?.response?.data?.message ?? err?.message ?? 'Failed to update restaurant';
      setErrorMessage(msg);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // ── Cancel ───────────────────────────────────────────────────────────────────
  const handleCancel = () => {
    if (isDirty && !window.confirm('You have unsaved changes. Are you sure you want to leave?')) return;
    navigate(`/restaurants/${id}`);
  };

  // ── Field configs ────────────────────────────────────────────────────────────
  const formFields = [
    { id: 'name',          label: 'Restaurant Name *', icon: Icons.restaurant, placeholder: 'Enter restaurant name',          validation: { required: 'Restaurant name is required', validate: { noEmoji: validateNoEmoji } }, changeHandler: handleTextChange },
    { id: 'ownerName',     label: 'Owner Name *',      icon: Icons.owner,      placeholder: 'Enter owner name',               validation: { required: 'Owner name is required',       validate: { noEmoji: validateNoEmoji } }, changeHandler: handleTextChange },
    { id: 'contactNumber', label: 'Contact Number *',  icon: Icons.phone,      placeholder: 'Enter 10–15 digit number',       validation: { required: 'Contact number is required',   validate: validateContactNumber },        changeHandler: handlePhoneChange },
    { id: 'email',         label: 'Email Address',     icon: Icons.email,      placeholder: 'Enter email address (optional)', validation: { validate: validateEmail },                                                          changeHandler: handleTextChange },
    { id: 'password',      label: 'New Password',      icon: Icons.password,   placeholder: 'Leave blank to keep current',    validation: {},                            type: 'password',                                     changeHandler: handleTextChange },
  ];

  const addressFields = [
    { id: 'street',    label: 'Street Address *', icon: Icons.street,       placeholder: 'Enter street address',          validation: { required: 'Street address is required', validate: { noEmoji: validateNoEmoji } }, changeHandler: handleTextChange },
    { id: 'city',      label: 'City *',            icon: Icons.city,         placeholder: 'Enter city',                    validation: { required: 'City is required',            validate: { noEmoji: validateNoEmoji } }, changeHandler: handleTextChange },
    { id: 'state',     label: 'State *',           icon: Icons.state,        placeholder: 'Enter state',                   validation: { required: 'State is required',           validate: { noEmoji: validateNoEmoji } }, changeHandler: handleTextChange },
    { id: 'country',   label: 'Country *',         icon: Icons.country,      placeholder: 'Enter country',                 validation: { required: 'Country is required',         validate: { noEmoji: validateNoEmoji } }, changeHandler: handleTextChange },
    { id: 'pincode',   label: 'Pincode *',         icon: Icons.pincode,      placeholder: 'Enter 6-digit pincode',         validation: { required: 'Pincode is required',         validate: validatePincode },               changeHandler: handlePincodeChange },
    { id: 'latitude',  label: 'Latitude',          icon: Icons.coordinates,  placeholder: 'Enter latitude (optional)',      validation: { validate: validateCoordinates },                                                    changeHandler: handleTextChange },
    { id: 'longitude', label: 'Longitude',         icon: Icons.coordinates,  placeholder: 'Enter longitude (optional)',     validation: { validate: validateCoordinates },                                                    changeHandler: handleTextChange },
  ];

  // ── Render helpers ───────────────────────────────────────────────────────────
  const renderField = (field, isAddressField = false) => {
    const fieldPath = isAddressField ? `address.${field.id}` : field.id;
    const error     = isAddressField ? errors.address?.[field.id] : errors[field.id];

    return (
      <div key={field.id} className="space-y-1.5">
        <label htmlFor={field.id} className="block text-sm font-medium text-gray-700">
          {field.label}
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            {field.icon}
          </div>
          <Controller
            name={fieldPath}
            control={control}
            rules={field.validation}
            render={({ field: { onChange, value } }) => (
              <input
                id={field.id}
                type={field.type ?? 'text'}
                value={value ?? ''}
                onChange={(e) => field.changeHandler(e, onChange)}
                placeholder={field.placeholder}
                disabled={isUpdating}
                className={`
                  block w-full pl-10 pr-3 py-2.5
                  bg-white border rounded-xl
                  text-gray-900 placeholder-gray-400
                  focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                  transition duration-200 ease-in-out
                  ${error      ? 'border-red-500 bg-red-50'              : 'border-gray-200 hover:border-gray-300'}
                  ${isUpdating ? 'bg-gray-50 cursor-not-allowed opacity-70' : ''}
                `}
              />
            )}
          />
        </div>
        {error && (
          <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
            <span>{Icons.error}</span>
            {error.message}
          </p>
        )}
      </div>
    );
  };

  // ── Loading / error / not-found states ──────────────────────────────────────
  if (isLoadingRestaurant) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-600">Loading restaurant details…</p>
        </div>
      </div>
    );
  }

  if (isFetchError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center space-y-4">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <span className="text-red-500 text-4xl">!</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Failed to Load</h2>
          <p className="text-gray-600">{fetchError?.message ?? 'Could not load restaurant data'}</p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => refetchRestaurant()} className="px-6 py-2.5 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors">
              Try Again
            </button>
            <button onClick={() => navigate('/restaurants')} className="px-6 py-2.5 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center space-y-4">
          <h2 className="text-2xl font-bold text-gray-800">Restaurant Not Found</h2>
          <p className="text-gray-600">The restaurant you're trying to edit doesn't exist.</p>
          <button onClick={() => navigate('/restaurants')} className="px-6 py-2.5 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors">
            View All Restaurants
          </button>
        </div>
      </div>
    );
  }

  // ── Main render ──────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <button onClick={handleCancel} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4">
            <span>{Icons.arrowLeft}</span>
            Back to Restaurant
          </button>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white text-2xl">✎</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Update Restaurant</h1>
              <p className="text-gray-600 mt-1">
                Editing: <span className="font-medium text-gray-900">{restaurant.name}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Form card */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">

          {/* Alerts */}
          {successMessage && (
            <div className="m-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 text-green-700">
              <span className="flex-shrink-0">{Icons.success}</span>
              <p className="text-sm font-medium">{successMessage}</p>
            </div>
          )}

          {(errorMessage || (isUpdateError && !errorMessage)) && (
            <div className="m-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700">
              <span className="flex-shrink-0">{Icons.error}</span>
              <p className="text-sm font-medium">
                {errorMessage || updateError?.response?.data?.message || 'Update failed. Please try again.'}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-8">

            {/* Basic info */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                <span className="text-blue-500">{Icons.restaurant}</span>
                <h2 className="text-xl font-semibold text-gray-800">Basic Information</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {formFields.map((f) => renderField(f, false))}
              </div>
            </div>

            {/* Address */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                <span className="text-purple-500">{Icons.location}</span>
                <h2 className="text-xl font-semibold text-gray-800">Address Details</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {addressFields.map((f) => renderField(f, true))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-end pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleCancel}
                disabled={isUpdating}
                className="px-6 py-2.5 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUpdating || !isDirty || !isValid || isSubmitting}
                className={`
                  px-6 py-2.5 rounded-xl font-medium flex items-center justify-center gap-2
                  transition-all duration-200 min-w-[140px]
                  ${isUpdating || !isDirty || !isValid || isSubmitting
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl'}
                `}
              >
                {isUpdating ? (
                  <><span>{Icons.spinner}</span> Updating…</>
                ) : (
                  <><span>{Icons.save}</span> Save Changes</>
                )}
              </button>
            </div>

            {/* Status row */}
            <div className="text-xs text-gray-500 flex justify-end items-center gap-4">
              {isDirty
                ? <span className="text-yellow-600">⚠️ You have unsaved changes</span>
                : <span className="text-green-600">✓ No unsaved changes</span>}
              {!isValid && <span className="text-red-500">❌ Please fix validation errors</span>}
            </div>
          </form>
        </div>

        {/* Help card */}
        <div className="mt-6 bg-blue-50 rounded-xl p-4 border border-blue-100">
          <div className="flex items-start gap-3">
            <span className="text-blue-500 flex-shrink-0 mt-0.5">ℹ️</span>
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Updating Restaurant Information</p>
              <p className="text-blue-600">
                Fields marked with * are required. Leave password blank to keep the current password.
                Coordinates are optional but helpful for map integration.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}