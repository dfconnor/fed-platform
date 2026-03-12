'use client';

import { useState, useCallback } from 'react';
import { RVType, RV_TYPE_LABELS, AMENITY_LABELS, FEATURE_LABELS } from '@/types';
import { cn } from '@/lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ListingFormData {
  // Step 1 - RV Type
  rvType: RVType | '';
  // Step 2 - Vehicle Details
  year: string;
  make: string;
  model: string;
  length: string;
  sleeps: string;
  seatbelts: string;
  mileage: string;
  fuelType: string;
  // Step 3 - Location
  address: string;
  city: string;
  state: string;
  zipCode: string;
  // Step 4 - Photos
  photos: string[]; // placeholder filenames
  // Step 5 - Amenities & Features
  amenities: string[];
  features: string[];
  // Step 6 - Pricing
  nightlyRate: string;
  cleaningFee: string;
  securityDeposit: string;
  weeklyDiscount: string;
  monthlyDiscount: string;
  minNights: string;
  maxNights: string;
  // Step 7 - Delivery
  deliveryAvailable: boolean;
  deliveryFeePerMile: string;
  deliveryRadius: string;
  // Step 8 - Rules & Description
  title: string;
  description: string;
  rules: string;
  cancellationPolicy: string;
}

const INITIAL_FORM_DATA: ListingFormData = {
  rvType: '',
  year: '',
  make: '',
  model: '',
  length: '',
  sleeps: '',
  seatbelts: '',
  mileage: '',
  fuelType: '',
  address: '',
  city: '',
  state: '',
  zipCode: '',
  photos: [],
  amenities: [],
  features: [],
  nightlyRate: '',
  cleaningFee: '',
  securityDeposit: '',
  weeklyDiscount: '',
  monthlyDiscount: '',
  minNights: '2',
  maxNights: '30',
  deliveryAvailable: false,
  deliveryFeePerMile: '',
  deliveryRadius: '',
  title: '',
  description: '',
  rules: '',
  cancellationPolicy: 'MODERATE',
};

const STEPS = [
  { id: 1, title: 'RV Type', description: 'What kind of RV is it?' },
  { id: 2, title: 'Vehicle Details', description: 'Tell us about your RV' },
  { id: 3, title: 'Location', description: 'Where is your RV located?' },
  { id: 4, title: 'Photos', description: 'Show off your RV' },
  { id: 5, title: 'Amenities', description: 'What does your RV include?' },
  { id: 6, title: 'Pricing', description: 'Set your rates' },
  { id: 7, title: 'Delivery', description: 'Offer delivery options' },
  { id: 8, title: 'Description', description: 'Describe your RV and rules' },
  { id: 9, title: 'Review', description: 'Review and publish' },
];

const RV_TYPE_ICONS: Partial<Record<RVType, string>> = {
  CLASS_A: 'M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0H21',
  CLASS_B: 'M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25',
  CLASS_C: 'M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0',
  TRAVEL_TRAILER: 'M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875',
  FIFTH_WHEEL: 'M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5',
  CAMPERVAN: 'M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6',
  TEARDROP: 'M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  AIRSTREAM: 'M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
};

const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY',
  'LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND',
  'OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY',
];

// ---------------------------------------------------------------------------
// Step Components
// ---------------------------------------------------------------------------

function StepRVType({ form, setForm }: { form: ListingFormData; setForm: (f: ListingFormData) => void }) {
  const types = Object.entries(RV_TYPE_LABELS) as [RVType, string][];

  return (
    <div>
      <h2 className="section-heading mb-2">What type of RV do you have?</h2>
      <p className="text-gray-500 mb-8">Select the category that best describes your RV.</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {types.map(([type, label]) => (
          <button
            key={type}
            onClick={() => setForm({ ...form, rvType: type })}
            className={cn(
              'flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border-2 transition-all text-center',
              form.rvType === type
                ? 'border-brand-500 bg-brand-50 shadow-md'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            )}
          >
            <svg
              className={cn(
                'w-10 h-10',
                form.rvType === type ? 'text-brand-600' : 'text-gray-400'
              )}
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d={RV_TYPE_ICONS[type] || 'M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25'}
              />
            </svg>
            <span
              className={cn(
                'text-sm font-medium',
                form.rvType === type ? 'text-brand-700' : 'text-gray-700'
              )}
            >
              {label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function StepVehicleDetails({ form, setForm }: { form: ListingFormData; setForm: (f: ListingFormData) => void }) {
  const update = (field: keyof ListingFormData, value: string) =>
    setForm({ ...form, [field]: value });

  return (
    <div>
      <h2 className="section-heading mb-2">Vehicle Details</h2>
      <p className="text-gray-500 mb-8">Provide the key specs for your RV.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
          <input
            type="number"
            className="input-field"
            placeholder="e.g. 2023"
            value={form.year}
            onChange={(e) => update('year', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Make</label>
          <input
            type="text"
            className="input-field"
            placeholder="e.g. Thor Motor Coach"
            value={form.make}
            onChange={(e) => update('make', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
          <input
            type="text"
            className="input-field"
            placeholder="e.g. Palazzo 37.5"
            value={form.model}
            onChange={(e) => update('model', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Length (ft)</label>
          <input
            type="number"
            className="input-field"
            placeholder="e.g. 38"
            value={form.length}
            onChange={(e) => update('length', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Sleeps</label>
          <input
            type="number"
            className="input-field"
            placeholder="e.g. 6"
            value={form.sleeps}
            onChange={(e) => update('sleeps', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Seatbelts</label>
          <input
            type="number"
            className="input-field"
            placeholder="e.g. 4"
            value={form.seatbelts}
            onChange={(e) => update('seatbelts', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mileage</label>
          <input
            type="number"
            className="input-field"
            placeholder="e.g. 12400"
            value={form.mileage}
            onChange={(e) => update('mileage', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Fuel Type</label>
          <select
            className="input-field"
            value={form.fuelType}
            onChange={(e) => update('fuelType', e.target.value)}
          >
            <option value="">Select fuel type</option>
            <option value="Gas">Gas</option>
            <option value="Diesel">Diesel</option>
            <option value="Electric">Electric</option>
            <option value="Hybrid">Hybrid</option>
            <option value="N/A">N/A (Towable)</option>
          </select>
        </div>
      </div>
    </div>
  );
}

function StepLocation({ form, setForm }: { form: ListingFormData; setForm: (f: ListingFormData) => void }) {
  const update = (field: keyof ListingFormData, value: string) =>
    setForm({ ...form, [field]: value });

  return (
    <div>
      <h2 className="section-heading mb-2">Where is your RV located?</h2>
      <p className="text-gray-500 mb-8">This helps renters find your listing. The exact address is only shared after booking.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl">
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
          <input
            type="text"
            className="input-field"
            placeholder="123 Mountain View Dr"
            value={form.address}
            onChange={(e) => update('address', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
          <input
            type="text"
            className="input-field"
            placeholder="Denver"
            value={form.city}
            onChange={(e) => update('city', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
          <select
            className="input-field"
            value={form.state}
            onChange={(e) => update('state', e.target.value)}
          >
            <option value="">Select state</option>
            {US_STATES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Zip Code</label>
          <input
            type="text"
            className="input-field"
            placeholder="80202"
            value={form.zipCode}
            onChange={(e) => update('zipCode', e.target.value)}
          />
        </div>
      </div>

      {/* Map placeholder */}
      <div className="mt-8 bg-forest-50 rounded-2xl h-64 flex items-center justify-center max-w-2xl">
        <div className="text-center text-forest-400">
          <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
          </svg>
          <p className="font-medium">Pin your location on the map</p>
          <p className="text-sm mt-1">Map integration goes here</p>
        </div>
      </div>
    </div>
  );
}

function StepPhotos({ form, setForm }: { form: ListingFormData; setForm: (f: ListingFormData) => void }) {
  const handleFakeUpload = () => {
    const newPhoto = `photo-${form.photos.length + 1}.jpg`;
    setForm({ ...form, photos: [...form.photos, newPhoto] });
  };

  const removePhoto = (idx: number) => {
    setForm({ ...form, photos: form.photos.filter((_, i) => i !== idx) });
  };

  return (
    <div>
      <h2 className="section-heading mb-2">Add Photos</h2>
      <p className="text-gray-500 mb-8">
        Great photos are the #1 driver of bookings. Include exterior shots, interior rooms, and any unique features.
        We recommend at least 10 photos.
      </p>

      {/* Upload Zone */}
      <div
        className="border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center hover:border-brand-400 hover:bg-brand-50/30 transition-colors cursor-pointer"
        onClick={handleFakeUpload}
      >
        <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
        </svg>
        <p className="text-lg font-medium text-gray-700">Drag & drop photos here</p>
        <p className="text-sm text-gray-500 mt-1">or click to browse</p>
        <p className="text-xs text-gray-400 mt-3">JPG, PNG, or WEBP. Max 10MB each.</p>
      </div>

      {/* Photo Grid */}
      {form.photos.length > 0 && (
        <div className="mt-8">
          <p className="text-sm font-medium text-gray-700 mb-3">
            {form.photos.length} photo{form.photos.length !== 1 ? 's' : ''} uploaded
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            {form.photos.map((photo, idx) => (
              <div
                key={idx}
                className="relative aspect-square rounded-xl bg-gradient-to-br from-forest-200 to-forest-400 flex items-center justify-center group"
              >
                <svg className="w-8 h-8 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909" />
                </svg>
                {idx === 0 && (
                  <span className="absolute top-2 left-2 badge bg-white/90 text-gray-700 text-[10px]">
                    Cover
                  </span>
                )}
                <button
                  onClick={() => removePhoto(idx)}
                  className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
            {/* Add more button */}
            <button
              onClick={handleFakeUpload}
              className="aspect-square rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center hover:border-brand-400 hover:bg-brand-50/30 transition-colors"
            >
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function StepAmenities({ form, setForm }: { form: ListingFormData; setForm: (f: ListingFormData) => void }) {
  const toggleAmenity = (key: string) => {
    const amenities = form.amenities.includes(key)
      ? form.amenities.filter((a) => a !== key)
      : [...form.amenities, key];
    setForm({ ...form, amenities });
  };

  const toggleFeature = (key: string) => {
    const features = form.features.includes(key)
      ? form.features.filter((f) => f !== key)
      : [...form.features, key];
    setForm({ ...form, features });
  };

  return (
    <div>
      <h2 className="section-heading mb-2">Amenities & Features</h2>
      <p className="text-gray-500 mb-8">Check everything your RV includes.</p>

      {/* Amenities */}
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Amenities</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-10">
        {Object.entries(AMENITY_LABELS).map(([key, label]) => (
          <label
            key={key}
            className={cn(
              'flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all',
              form.amenities.includes(key)
                ? 'border-brand-500 bg-brand-50'
                : 'border-gray-200 hover:border-gray-300'
            )}
          >
            <input
              type="checkbox"
              className="rounded border-gray-300 text-brand-600 focus:ring-brand-500"
              checked={form.amenities.includes(key)}
              onChange={() => toggleAmenity(key)}
            />
            <span className="text-sm text-gray-700">{label}</span>
          </label>
        ))}
      </div>

      {/* Features */}
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Special Features</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {Object.entries(FEATURE_LABELS).map(([key, label]) => (
          <label
            key={key}
            className={cn(
              'flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all',
              form.features.includes(key)
                ? 'border-brand-500 bg-brand-50'
                : 'border-gray-200 hover:border-gray-300'
            )}
          >
            <input
              type="checkbox"
              className="rounded border-gray-300 text-brand-600 focus:ring-brand-500"
              checked={form.features.includes(key)}
              onChange={() => toggleFeature(key)}
            />
            <span className="text-sm text-gray-700">{label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

function StepPricing({ form, setForm }: { form: ListingFormData; setForm: (f: ListingFormData) => void }) {
  const update = (field: keyof ListingFormData, value: string) =>
    setForm({ ...form, [field]: value });

  const nightlyNum = parseFloat(form.nightlyRate) || 0;
  const estimatedMonthly = nightlyNum * 20; // ~20 nights/month avg
  const outdoorsyMonthly = estimatedMonthly * 0.75; // after 25% fee
  const rivalMonthly = estimatedMonthly * 0.95; // after 5% fee

  return (
    <div>
      <h2 className="section-heading mb-2">Set Your Pricing</h2>
      <p className="text-gray-500 mb-8">
        Competitive pricing gets more bookings. Remember, Rival RV only charges 5% vs 25% on other platforms, so you keep more.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nightly Rate ($)</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
            <input
              type="number"
              className="input-field pl-8"
              placeholder="275"
              value={form.nightlyRate}
              onChange={(e) => update('nightlyRate', e.target.value)}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cleaning Fee ($)</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
            <input
              type="number"
              className="input-field pl-8"
              placeholder="150"
              value={form.cleaningFee}
              onChange={(e) => update('cleaningFee', e.target.value)}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Security Deposit ($)</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
            <input
              type="number"
              className="input-field pl-8"
              placeholder="1500"
              value={form.securityDeposit}
              onChange={(e) => update('securityDeposit', e.target.value)}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">Held on guest&apos;s card, released 3 days after return</p>
        </div>
        <div className="hidden sm:block" />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Weekly Discount (%)</label>
          <input
            type="number"
            className="input-field"
            placeholder="10"
            max={50}
            value={form.weeklyDiscount}
            onChange={(e) => update('weeklyDiscount', e.target.value)}
          />
          <p className="text-xs text-gray-500 mt-1">Applied for 7+ night bookings</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Discount (%)</label>
          <input
            type="number"
            className="input-field"
            placeholder="20"
            max={70}
            value={form.monthlyDiscount}
            onChange={(e) => update('monthlyDiscount', e.target.value)}
          />
          <p className="text-xs text-gray-500 mt-1">Applied for 28+ night bookings</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Nights</label>
          <input
            type="number"
            className="input-field"
            value={form.minNights}
            onChange={(e) => update('minNights', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Maximum Nights</label>
          <input
            type="number"
            className="input-field"
            value={form.maxNights}
            onChange={(e) => update('maxNights', e.target.value)}
          />
        </div>
      </div>

      {/* Earnings Comparison */}
      {nightlyNum > 0 && (
        <div className="mt-8 max-w-2xl">
          <div className="bg-brand-50 border border-brand-200 rounded-2xl p-6">
            <h3 className="font-semibold text-brand-800 mb-3">Estimated Monthly Earnings (20 nights)</h3>
            <div className="flex items-center gap-8">
              <div>
                <p className="text-sm text-gray-600">On Outdoorsy (25% fee)</p>
                <p className="text-lg font-bold text-gray-500 line-through">${outdoorsyMonthly.toFixed(0)}</p>
              </div>
              <div>
                <p className="text-sm text-brand-700 font-medium">On Rival RV (5% fee)</p>
                <p className="text-2xl font-bold text-brand-700">${rivalMonthly.toFixed(0)}</p>
              </div>
              <div className="ml-auto text-right">
                <p className="text-sm text-brand-600">You keep</p>
                <p className="text-lg font-bold text-brand-700">
                  +${(rivalMonthly - outdoorsyMonthly).toFixed(0)}/mo more
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StepDelivery({ form, setForm }: { form: ListingFormData; setForm: (f: ListingFormData) => void }) {
  const update = (field: keyof ListingFormData, value: string | boolean) =>
    setForm({ ...form, [field]: value });

  return (
    <div>
      <h2 className="section-heading mb-2">Delivery Options</h2>
      <p className="text-gray-500 mb-8">
        Offering delivery can increase your bookings by up to 30%. You drive the RV to the renter&apos;s campsite.
      </p>

      {/* Toggle */}
      <label className="flex items-center gap-4 cursor-pointer select-none mb-8">
        <div
          className={cn(
            'relative w-12 h-7 rounded-full transition-colors',
            form.deliveryAvailable ? 'bg-brand-600' : 'bg-gray-300'
          )}
          onClick={() => update('deliveryAvailable', !form.deliveryAvailable)}
        >
          <div
            className={cn(
              'absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform',
              form.deliveryAvailable && 'translate-x-5'
            )}
          />
        </div>
        <div>
          <span className="font-medium text-gray-900">I offer delivery</span>
          <p className="text-sm text-gray-500">I&apos;ll drive my RV to the renter&apos;s location</p>
        </div>
      </label>

      {form.deliveryAvailable && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-lg animate-slide-down">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fee per mile ($)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
              <input
                type="number"
                className="input-field pl-8"
                placeholder="3.50"
                step="0.50"
                value={form.deliveryFeePerMile}
                onChange={(e) => update('deliveryFeePerMile', e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Maximum delivery radius (miles)</label>
            <input
              type="number"
              className="input-field"
              placeholder="75"
              value={form.deliveryRadius}
              onChange={(e) => update('deliveryRadius', e.target.value)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function StepDescription({ form, setForm }: { form: ListingFormData; setForm: (f: ListingFormData) => void }) {
  const update = (field: keyof ListingFormData, value: string) =>
    setForm({ ...form, [field]: value });

  return (
    <div>
      <h2 className="section-heading mb-2">Description & Rules</h2>
      <p className="text-gray-500 mb-8">Help renters understand what makes your RV special.</p>
      <div className="space-y-6 max-w-2xl">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Listing Title</label>
          <input
            type="text"
            className="input-field"
            placeholder="e.g. 2023 Thor Palazzo 37.5 Class A Diesel Pusher"
            value={form.title}
            onChange={(e) => update('title', e.target.value)}
          />
          <p className="text-xs text-gray-500 mt-1">Include year, make, model, and type for best results</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            className="input-field min-h-[200px] resize-y"
            placeholder="Describe your RV, what makes it special, what renters can expect, and any tips for their trip..."
            value={form.description}
            onChange={(e) => update('description', e.target.value)}
          />
          <p className="text-xs text-gray-500 mt-1">
            {form.description.length}/2000 characters
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Rules & Guidelines</label>
          <textarea
            className="input-field min-h-[120px] resize-y"
            placeholder="List your rules, one per line. E.g.:&#10;No smoking inside the RV&#10;Pets allowed with $50 fee&#10;Must be 25+ to rent"
            value={form.rules}
            onChange={(e) => update('rules', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cancellation Policy</label>
          <div className="space-y-3">
            {[
              { value: 'FLEXIBLE', name: 'Flexible', desc: 'Full refund up to 24 hours before trip' },
              { value: 'MODERATE', name: 'Moderate', desc: 'Full refund up to 7 days, 50% refund 3-7 days' },
              { value: 'STRICT', name: 'Strict', desc: 'Full refund up to 30 days, 50% refund 14-30 days' },
            ].map((policy) => (
              <label
                key={policy.value}
                className={cn(
                  'flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all',
                  form.cancellationPolicy === policy.value
                    ? 'border-brand-500 bg-brand-50'
                    : 'border-gray-200 hover:border-gray-300'
                )}
              >
                <input
                  type="radio"
                  name="cancellation"
                  value={policy.value}
                  checked={form.cancellationPolicy === policy.value}
                  onChange={(e) => update('cancellationPolicy', e.target.value)}
                  className="text-brand-600 focus:ring-brand-500"
                />
                <div>
                  <span className="text-sm font-medium text-gray-900">{policy.name}</span>
                  <p className="text-xs text-gray-500">{policy.desc}</p>
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StepReview({ form }: { form: ListingFormData }) {
  return (
    <div>
      <h2 className="section-heading mb-2">Review Your Listing</h2>
      <p className="text-gray-500 mb-8">Make sure everything looks good before publishing.</p>

      <div className="max-w-2xl space-y-6">
        {/* Summary Card */}
        <div className="card p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-forest-200 to-forest-400 flex items-center justify-center flex-shrink-0">
              <svg className="w-10 h-10 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-lg">
                {form.title || `${form.year} ${form.make} ${form.model}`}
              </h3>
              <p className="text-sm text-gray-500">
                {form.rvType ? RV_TYPE_LABELS[form.rvType as RVType] : 'No type selected'} &middot;{' '}
                {form.city}{form.state ? `, ${form.state}` : ''}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Year</span>
              <p className="font-medium text-gray-900">{form.year || '-'}</p>
            </div>
            <div>
              <span className="text-gray-500">Length</span>
              <p className="font-medium text-gray-900">{form.length ? `${form.length} ft` : '-'}</p>
            </div>
            <div>
              <span className="text-gray-500">Sleeps</span>
              <p className="font-medium text-gray-900">{form.sleeps || '-'}</p>
            </div>
            <div>
              <span className="text-gray-500">Fuel</span>
              <p className="font-medium text-gray-900">{form.fuelType || '-'}</p>
            </div>
            <div>
              <span className="text-gray-500">Nightly Rate</span>
              <p className="font-medium text-gray-900">{form.nightlyRate ? `$${form.nightlyRate}` : '-'}</p>
            </div>
            <div>
              <span className="text-gray-500">Cleaning Fee</span>
              <p className="font-medium text-gray-900">{form.cleaningFee ? `$${form.cleaningFee}` : '-'}</p>
            </div>
            <div>
              <span className="text-gray-500">Photos</span>
              <p className="font-medium text-gray-900">{form.photos.length} uploaded</p>
            </div>
            <div>
              <span className="text-gray-500">Amenities</span>
              <p className="font-medium text-gray-900">{form.amenities.length} selected</p>
            </div>
            <div>
              <span className="text-gray-500">Delivery</span>
              <p className="font-medium text-gray-900">
                {form.deliveryAvailable ? `Yes (${form.deliveryRadius} mi)` : 'No'}
              </p>
            </div>
            <div>
              <span className="text-gray-500">Cancellation</span>
              <p className="font-medium text-gray-900 capitalize">
                {form.cancellationPolicy.toLowerCase()}
              </p>
            </div>
          </div>
        </div>

        {/* Amenities */}
        {form.amenities.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Amenities</h3>
            <div className="flex flex-wrap gap-2">
              {form.amenities.map((a) => (
                <span key={a} className="badge bg-brand-50 text-brand-700">
                  {AMENITY_LABELS[a] || a}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Features */}
        {form.features.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Features</h3>
            <div className="flex flex-wrap gap-2">
              {form.features.map((f) => (
                <span key={f} className="badge bg-forest-50 text-forest-700">
                  {FEATURE_LABELS[f] || f}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Description Preview */}
        {form.description && (
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Description</h3>
            <p className="text-gray-600 whitespace-pre-wrap text-sm">{form.description}</p>
          </div>
        )}

        {/* Earnings reminder */}
        <div className="bg-brand-50 border border-brand-200 rounded-xl p-4 text-center">
          <p className="text-sm font-semibold text-brand-800">
            Remember: You keep 95% of every booking on Rival RV
          </p>
          <p className="text-xs text-brand-600 mt-1">
            That&apos;s 20% more per booking than Outdoorsy
          </p>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Page Component
// ---------------------------------------------------------------------------

export default function CreateListingPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<ListingFormData>(INITIAL_FORM_DATA);
  const [isSaving, setIsSaving] = useState(false);

  const canNext = useCallback(() => {
    switch (step) {
      case 1: return !!form.rvType;
      case 2: return !!form.year && !!form.make && !!form.model;
      case 3: return !!form.city && !!form.state;
      case 4: return true; // Photos optional for draft
      case 5: return true;
      case 6: return !!form.nightlyRate;
      case 7: return true;
      case 8: return !!form.title || (!!form.year && !!form.make);
      case 9: return true;
      default: return true;
    }
  }, [step, form]);

  const handleSaveDraft = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      alert('Draft saved! (mock)');
    }, 800);
  };

  const handlePublish = () => {
    alert('Listing published! (mock) - In production this would call the API');
  };

  const renderStep = () => {
    switch (step) {
      case 1: return <StepRVType form={form} setForm={setForm} />;
      case 2: return <StepVehicleDetails form={form} setForm={setForm} />;
      case 3: return <StepLocation form={form} setForm={setForm} />;
      case 4: return <StepPhotos form={form} setForm={setForm} />;
      case 5: return <StepAmenities form={form} setForm={setForm} />;
      case 6: return <StepPricing form={form} setForm={setForm} />;
      case 7: return <StepDelivery form={form} setForm={setForm} />;
      case 8: return <StepDescription form={form} setForm={setForm} />;
      case 9: return <StepReview form={form} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Progress Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="container-wide py-4">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-lg font-semibold text-gray-900">List Your RV</h1>
            <div className="flex items-center gap-3">
              <button
                onClick={handleSaveDraft}
                disabled={isSaving}
                className="btn-ghost text-sm"
              >
                {isSaving ? 'Saving...' : 'Save Draft'}
              </button>
              <span className="text-sm text-gray-500">
                Step {step} of {STEPS.length}
              </span>
            </div>
          </div>

          {/* Step Indicators */}
          <div className="flex items-center gap-1">
            {STEPS.map((s) => (
              <div
                key={s.id}
                className={cn(
                  'h-1.5 flex-1 rounded-full transition-colors',
                  s.id < step
                    ? 'bg-brand-500'
                    : s.id === step
                    ? 'bg-brand-400'
                    : 'bg-gray-200'
                )}
              />
            ))}
          </div>

          {/* Step Labels (desktop) */}
          <div className="hidden lg:flex items-center gap-1 mt-2">
            {STEPS.map((s) => (
              <button
                key={s.id}
                onClick={() => s.id <= step && setStep(s.id)}
                className={cn(
                  'flex-1 text-center text-xs transition-colors',
                  s.id < step
                    ? 'text-brand-600 cursor-pointer hover:text-brand-700'
                    : s.id === step
                    ? 'text-gray-900 font-medium'
                    : 'text-gray-400 cursor-default'
                )}
              >
                {s.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="container-wide py-8 sm:py-12">
        <div className="animate-fade-in">{renderStep()}</div>
      </div>

      {/* Navigation Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-20">
        <div className="container-wide py-4 flex items-center justify-between">
          <button
            onClick={() => setStep(Math.max(1, step - 1))}
            disabled={step === 1}
            className="btn-ghost disabled:opacity-30"
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>

          <div className="flex items-center gap-3">
            {step === STEPS.length ? (
              <button onClick={handlePublish} className="btn-primary px-8">
                Publish Listing
              </button>
            ) : (
              <button
                onClick={() => setStep(Math.min(STEPS.length, step + 1))}
                disabled={!canNext()}
                className="btn-primary px-8"
              >
                Next
                <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Bottom padding for fixed footer */}
      <div className="h-20" />
    </div>
  );
}
