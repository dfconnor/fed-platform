import Link from 'next/link';
import ReviewStars from '@/components/ReviewStars';
import { RV_TYPE_LABELS, AMENITY_LABELS, FEATURE_LABELS, formatCents, formatCentsDecimal } from '@/types';
import { cn } from '@/lib/utils';

// ---------------------------------------------------------------------------
// Mock Data - Comprehensive Class A Motorhome Listing
// ---------------------------------------------------------------------------

const MOCK_LISTING = {
  id: '1',
  title: '2023 Thor Palazzo 37.5 Class A Diesel Pusher',
  rvType: 'CLASS_A' as const,
  year: 2023,
  make: 'Thor Motor Coach',
  model: 'Palazzo 37.5',
  length: 38,
  sleeps: 6,
  seatbelts: 4,
  mileage: 12400,
  fuelType: 'Diesel',
  location: 'Denver, CO',
  city: 'Denver',
  state: 'CO',
  lat: 39.7392,
  lng: -104.9903,
  nightlyRate: 27500, // cents
  cleaningFee: 15000,
  securityDeposit: 150000,
  minNights: 2,
  maxNights: 30,
  weeklyDiscount: 10,
  monthlyDiscount: 20,
  instantBook: true,
  deliveryAvailable: true,
  deliveryFeePerMile: 350, // cents
  deliveryRadius: 75,
  cancellationPolicy: 'MODERATE' as const,
  rating: 4.9,
  reviewCount: 47,
  description: `Experience the ultimate road trip in this luxurious 2023 Thor Palazzo 37.5 Class A Diesel Pusher. This coach is fully loaded with every amenity you need for a comfortable and unforgettable adventure.

The spacious living area features a residential-size refrigerator, full kitchen with 3-burner stove and convection microwave, and a dinette that converts to a bed. The master bedroom includes a king-size bed, ample closet space, and a private entrance to the full bathroom with porcelain toilet, glass-enclosed shower, and dual vanity sinks.

Whether you're heading to a national park, a weekend getaway, or a cross-country road trip, this motorhome has you covered. The Cummins diesel engine provides smooth, powerful driving, and the Freightliner chassis ensures a comfortable ride.

I'll provide a full walkthrough and orientation before your trip, including driving tips and campground recommendations. I'm available 24/7 during your rental for any questions.`,
  amenities: [
    'kitchen',
    'ac',
    'heating',
    'generator',
    'solar',
    'shower',
    'toilet',
    'tv',
    'wifi',
    'awning',
    'outdoor_kitchen',
    'leveling_jacks',
    'backup_camera',
    'washer_dryer',
    'fireplace',
    'inverter',
    'water_heater',
  ],
  features: ['pet_friendly', 'festival_ready', 'tow_hitch'],
  rules: [
    'No smoking inside the RV',
    'Pets allowed with a $50 pet fee',
    'Generator quiet hours: 10 PM - 7 AM',
    'Return with at least 1/4 tank of fuel',
    'Empty waste tanks before return (or pay $75 dump fee)',
    'Maximum 6 occupants',
    'Must be 25+ years old to rent',
    'Valid driver\'s license required',
  ],
  images: [
    { id: '1', url: 'https://images.unsplash.com/photo-1527786356703-4b100091cd2c?w=1200&h=800&fit=crop', alt: 'Exterior Front View' },
    { id: '2', url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop', alt: 'Spacious living area interior' },
    { id: '3', url: 'https://images.unsplash.com/photo-1534187886935-1e1236e856c3?w=800&h=600&fit=crop', alt: 'Campervan on scenic road' },
    { id: '4', url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&h=600&fit=crop', alt: 'Open road adventure' },
    { id: '5', url: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=800&h=600&fit=crop', alt: 'Motorhome at campsite' },
  ],
  host: {
    id: 'host-1',
    name: 'Mike Rodriguez',
    avatar: '/placeholder-avatar.jpg',
    joinDate: 'March 2023',
    responseRate: 99,
    responseTime: 'within an hour',
    superhost: true,
    verified: true,
    listingCount: 3,
    bio: 'Full-time RV enthusiast and retired mechanical engineer. I maintain all my rigs meticulously and love helping first-time RVers have an amazing experience. Based in Denver with easy access to the mountains!',
  },
  reviews: [
    {
      id: 'r1',
      author: 'Jennifer K.',
      avatar: '/placeholder-avatar-2.jpg',
      rating: 5,
      date: 'February 2026',
      text: 'Absolutely amazing RV! Mike was incredibly helpful with the walkthrough and even gave us a list of great campgrounds. The Palazzo is immaculate - you can tell Mike takes great care of it. We took it to Rocky Mountain National Park and it was the trip of a lifetime. Will definitely rent again!',
    },
    {
      id: 'r2',
      author: 'David & Sarah M.',
      avatar: '/placeholder-avatar-3.jpg',
      rating: 5,
      date: 'January 2026',
      text: 'Second time renting from Mike and it just keeps getting better. The diesel pusher handles beautifully on mountain roads. Kitchen setup is restaurant-quality. Kids loved the outdoor kitchen for s\'mores.',
    },
    {
      id: 'r3',
      author: 'Robert T.',
      avatar: '/placeholder-avatar-4.jpg',
      rating: 4,
      date: 'December 2025',
      text: 'Great motorhome, very well maintained. Only minor issue was the WiFi signal was weak in remote areas, but that\'s to be expected. Mike was available by phone the whole time and helped us troubleshoot the leveling jacks at our first campground. Would recommend.',
    },
    {
      id: 'r4',
      author: 'Lisa C.',
      avatar: '/placeholder-avatar-5.jpg',
      rating: 5,
      date: 'November 2025',
      text: 'This was our first RV trip ever and Mike made it so easy. Thorough walkthrough, detailed instruction binder in the coach, and he even delivered it to our campsite! The Palazzo is gorgeous and drives like a dream.',
    },
    {
      id: 'r5',
      author: 'Marcus W.',
      avatar: '/placeholder-avatar-6.jpg',
      rating: 5,
      date: 'October 2025',
      text: 'Five stars all around. Clean, comfortable, fully stocked. The fireplace was a nice touch on cold Colorado evenings. Mike is the gold standard for RV hosts.',
    },
  ],
  addOns: [
    { id: 'ao1', name: 'Kitchen Kit', description: 'Pots, pans, utensils, plates, cups for 6', price: 5000 },
    { id: 'ao2', name: 'Camping Chairs (4)', description: 'Folding camp chairs with cup holders', price: 2500 },
    { id: 'ao3', name: 'Bedding Package', description: 'Sheets, pillows, blankets for all beds', price: 6000 },
    { id: 'ao4', name: 'Outdoor Mat & Lights', description: '9x12 patio mat with LED string lights', price: 3000 },
    { id: 'ao5', name: 'Bike Rack + 2 Bikes', description: 'Hitch-mounted rack with 2 mountain bikes', price: 7500 },
  ],
};

const INSURANCE_TIERS = [
  {
    tier: 'BASIC',
    name: 'Basic Protection',
    price: 2400, // cents/day
    description: '$500K liability, $2,500 deductible',
    recommended: false,
  },
  {
    tier: 'ESSENTIAL',
    name: 'Essential Protection',
    price: 3800,
    description: '$1M liability, roadside assistance, $1,000 deductible',
    recommended: true,
  },
  {
    tier: 'PREMIUM',
    name: 'Premium Protection',
    price: 5500,
    description: '$1M liability, trip cancellation, $500 deductible',
    recommended: false,
  },
];

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function ImageGallery() {
  const mainImage = MOCK_LISTING.images[0];
  const sideImages = MOCK_LISTING.images.slice(1);

  return (
    <div className="relative grid grid-cols-4 grid-rows-2 gap-2 rounded-2xl overflow-hidden h-[400px] sm:h-[480px]">
      {/* Main large image */}
      <div className="col-span-2 row-span-2 relative cursor-pointer hover:opacity-95 transition-opacity">
        <img
          src={mainImage.url}
          alt={mainImage.alt}
          className="h-full w-full object-cover"
        />
      </div>
      {/* 4 smaller images */}
      {sideImages.map((img) => (
        <div
          key={img.id}
          className="relative cursor-pointer hover:opacity-95 transition-opacity"
        >
          <img
            src={img.url}
            alt={img.alt}
            className="h-full w-full object-cover"
          />
        </div>
      ))}
      {/* Show all photos button */}
      <button className="absolute bottom-4 right-4 btn-secondary text-xs px-3 py-2 bg-white/90 backdrop-blur">
        Show all photos
      </button>
    </div>
  );
}

function AmenityIcon({ amenity }: { amenity: string }) {
  // Simple icon mapping using SVG
  const iconPaths: Record<string, string> = {
    kitchen: 'M3 10h18M3 6h18M3 14h18M3 18h18',
    ac: 'M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z',
    heating: 'M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 6.51 6.51 0 0019.5 5.26a6.51 6.51 0 00-4.138-.046z',
    generator: 'M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z',
    solar: 'M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636',
    shower: 'M12 3v2.25M9 3v2.25M15 3v2.25M12 18.75V21m0-18.75h.008v.008H12V2.25zm0 0',
    toilet: 'M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v6a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 12V6z',
    tv: 'M6 20.25h12m-7.5-3v3m3-3v3m-10.125-3h17.25c.621 0 1.125-.504 1.125-1.125V4.875c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125z',
    wifi: 'M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z',
    awning: 'M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75',
    outdoor_kitchen: 'M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.871c1.355 0 2.697.056 4.024.166C17.155 8.51 18 9.473 18 10.608v2.513M15 8.25v-1.5',
    leveling_jacks: 'M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0',
    backup_camera: 'M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169',
    grill: 'M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048',
    washer_dryer: 'M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182',
    fireplace: 'M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048',
    satellite: 'M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314',
    inverter: 'M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z',
    water_heater: 'M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048',
    bike_rack: 'M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25',
  };

  return (
    <svg className="w-5 h-5 text-forest-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d={iconPaths[amenity] || 'M12 6v12m6-6H6'} />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Page Component
// ---------------------------------------------------------------------------

export default async function ListingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const listing = MOCK_LISTING; // In production, fetch by id

  const nightlyDisplay = (listing.nightlyRate / 100).toFixed(0);

  // Calculate "save vs Outdoorsy" for 5-night trip
  const sampleNights = 5;
  const outdoorsyFeeRate = 0.25;
  const rivalFeeRate = 0.05;
  const sampleTotal = listing.nightlyRate * sampleNights;
  const outdoorsyFees = Math.round(sampleTotal * outdoorsyFeeRate);
  const rivalFees = Math.round(sampleTotal * rivalFeeRate);
  const savings = outdoorsyFees - rivalFees;

  return (
    <div className="container-wide py-6 sm:py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <Link href="/search" className="hover:text-brand-600 transition-colors">
          Search
        </Link>
        <span>/</span>
        <Link
          href={`/search?location=${encodeURIComponent(listing.location)}`}
          className="hover:text-brand-600 transition-colors"
        >
          {listing.location}
        </Link>
        <span>/</span>
        <span className="text-gray-900 font-medium truncate">{listing.title}</span>
      </nav>

      {/* Title Section */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="badge bg-brand-50 text-brand-700">
              {RV_TYPE_LABELS[listing.rvType]}
            </span>
            {listing.instantBook && (
              <span className="badge bg-sunset-50 text-sunset-700">Instant Book</span>
            )}
            {listing.deliveryAvailable && (
              <span className="badge bg-sky-50 text-sky-700">Delivery Available</span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{listing.title}</h1>
          <div className="flex items-center gap-4 mt-2">
            <ReviewStars rating={listing.rating} count={listing.reviewCount} size="lg" />
            <span className="text-sm text-gray-500">{listing.location}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-ghost">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m-6.903-3.808a2.25 2.25 0 100-2.186m0 2.186l-9.566 5.314m9.566-7.5l-9.566-5.314" />
            </svg>
            Share
          </button>
          <button className="btn-ghost">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
            Save
          </button>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="relative mb-8">
        <ImageGallery />
      </div>

      {/* Main Content + Sidebar */}
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Left Column - Details */}
        <div className="flex-1 min-w-0">
          {/* Key Specs Row */}
          <div className="flex flex-wrap items-center gap-6 py-6 border-b border-gray-200">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{listing.sleeps}</p>
              <p className="text-sm text-gray-500">Sleeps</p>
            </div>
            <div className="w-px h-10 bg-gray-200" />
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{listing.length} ft</p>
              <p className="text-sm text-gray-500">Length</p>
            </div>
            <div className="w-px h-10 bg-gray-200" />
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{listing.year}</p>
              <p className="text-sm text-gray-500">Year</p>
            </div>
            <div className="w-px h-10 bg-gray-200" />
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{RV_TYPE_LABELS[listing.rvType].split(' ')[0]}</p>
              <p className="text-sm text-gray-500">{RV_TYPE_LABELS[listing.rvType].split(' ').slice(1).join(' ')}</p>
            </div>
            <div className="w-px h-10 bg-gray-200" />
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{listing.mileage.toLocaleString()}</p>
              <p className="text-sm text-gray-500">Miles</p>
            </div>
          </div>

          {/* Host Info Card */}
          <div className="flex items-center gap-4 py-6 border-b border-gray-200">
            <div className="w-14 h-14 rounded-full bg-forest-200 flex items-center justify-center text-forest-700 font-bold text-lg">
              {listing.host.name.split(' ').map((n) => n[0]).join('')}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-gray-900">Hosted by {listing.host.name}</h3>
                {listing.host.superhost && (
                  <span className="badge bg-sunset-50 text-sunset-700 text-xs">Superhost</span>
                )}
                {listing.host.verified && (
                  <svg className="w-5 h-5 text-brand-500" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Joined {listing.host.joinDate} &middot; {listing.host.responseRate}% response rate &middot; Responds {listing.host.responseTime}
              </p>
            </div>
            <Link
              href={`/dashboard/host`}
              className="btn-secondary text-sm py-2 px-4"
            >
              View Profile
            </Link>
          </div>

          {/* Description */}
          <section className="py-8 border-b border-gray-200">
            <h2 className="section-heading text-xl mb-4">About this RV</h2>
            <div className="prose prose-gray max-w-none">
              {listing.description.split('\n\n').map((paragraph, idx) => (
                <p key={idx} className="text-gray-600 leading-relaxed mb-4">
                  {paragraph}
                </p>
              ))}
            </div>
          </section>

          {/* Amenities Grid */}
          <section className="py-8 border-b border-gray-200">
            <h2 className="section-heading text-xl mb-6">Amenities</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {listing.amenities.map((amenity) => (
                <div key={amenity} className="flex items-center gap-3 py-2">
                  <AmenityIcon amenity={amenity} />
                  <span className="text-gray-700">{AMENITY_LABELS[amenity] || amenity}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Features */}
          <section className="py-8 border-b border-gray-200">
            <h2 className="section-heading text-xl mb-6">Features</h2>
            <div className="flex flex-wrap gap-3">
              {listing.features.map((feature) => (
                <span key={feature} className="badge bg-brand-50 text-brand-700 px-4 py-2 text-sm">
                  {FEATURE_LABELS[feature] || feature}
                </span>
              ))}
            </div>
          </section>

          {/* Rules */}
          <section className="py-8 border-b border-gray-200">
            <h2 className="section-heading text-xl mb-6">Rules & Guidelines</h2>
            <ul className="space-y-3">
              {listing.rules.map((rule, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z" />
                  </svg>
                  <span className="text-gray-600">{rule}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Calendar Availability */}
          <section className="py-8 border-b border-gray-200">
            <h2 className="section-heading text-xl mb-6">Availability</h2>
            <div className="bg-gray-50 rounded-2xl p-8 flex items-center justify-center h-64">
              <div className="text-center text-gray-400">
                <svg className="w-16 h-16 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                </svg>
                <p className="font-medium">Calendar View</p>
                <p className="text-sm mt-1">Date picker integration goes here</p>
              </div>
            </div>
          </section>

          {/* Reviews Section */}
          <section className="py-8 border-b border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <h2 className="section-heading text-xl">Reviews</h2>
                <ReviewStars rating={listing.rating} count={listing.reviewCount} size="lg" />
              </div>
            </div>
            <div className="space-y-6">
              {listing.reviews.map((review) => (
                <div key={review.id} className="pb-6 border-b border-gray-100 last:border-0">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-forest-100 flex items-center justify-center text-forest-700 font-semibold text-sm">
                      {review.author.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{review.author}</p>
                      <p className="text-sm text-gray-500">{review.date}</p>
                    </div>
                    <div className="ml-auto">
                      <ReviewStars rating={review.rating} size="sm" />
                    </div>
                  </div>
                  <p className="text-gray-600 leading-relaxed">{review.text}</p>
                </div>
              ))}
            </div>
            {listing.reviewCount > listing.reviews.length && (
              <button className="btn-secondary mt-6 w-full">
                Show all {listing.reviewCount} reviews
              </button>
            )}
          </section>

          {/* Map Location */}
          <section className="py-8 border-b border-gray-200">
            <h2 className="section-heading text-xl mb-6">Location</h2>
            <div className="bg-forest-50 rounded-2xl h-64 flex items-center justify-center">
              <div className="text-center text-forest-400">
                <svg className="w-16 h-16 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                <p className="font-medium">{listing.location}</p>
                <p className="text-sm mt-1">Exact location shown after booking</p>
              </div>
            </div>
          </section>

          {/* Meet Your Host */}
          <section className="py-8 border-b border-gray-200">
            <h2 className="section-heading text-xl mb-6">Meet Your Host</h2>
            <div className="card p-6">
              <div className="flex items-start gap-6">
                <div className="w-20 h-20 rounded-full bg-forest-200 flex items-center justify-center text-forest-700 font-bold text-xl flex-shrink-0">
                  {listing.host.name.split(' ').map((n) => n[0]).join('')}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-semibold text-gray-900">{listing.host.name}</h3>
                    {listing.host.superhost && (
                      <span className="badge bg-sunset-50 text-sunset-700 text-xs">Superhost</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mb-3">
                    Joined {listing.host.joinDate} &middot; {listing.host.listingCount} listings
                  </p>
                  <p className="text-gray-600 leading-relaxed">{listing.host.bio}</p>
                  <div className="flex items-center gap-6 mt-4 text-sm text-gray-500">
                    <span>Response rate: <strong className="text-gray-900">{listing.host.responseRate}%</strong></span>
                    <span>Response time: <strong className="text-gray-900">{listing.host.responseTime}</strong></span>
                  </div>
                  <Link
                    href="/dashboard/messages"
                    className="btn-primary mt-4 inline-flex"
                  >
                    Contact Host
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* Cancellation Policy */}
          <section className="py-8">
            <h2 className="section-heading text-xl mb-6">Cancellation Policy</h2>
            <div className="card p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="badge bg-brand-50 text-brand-700 text-sm px-4 py-1.5 font-semibold capitalize">
                  {listing.cancellationPolicy.toLowerCase()}
                </span>
              </div>
              {listing.cancellationPolicy === 'MODERATE' && (
                <div className="space-y-3 text-gray-600">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-brand-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                    </svg>
                    <span>Full refund up to 7 days before trip start</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-brand-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                    </svg>
                    <span>50% refund 3-7 days before trip start</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" clipRule="evenodd" />
                    </svg>
                    <span>No refund within 3 days of trip start</span>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Right Column - Booking Sidebar */}
        <div className="lg:w-[380px] flex-shrink-0">
          <div className="lg:sticky lg:top-24">
            <div className="card p-6">
              {/* Price */}
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-3xl font-bold text-gray-900">${nightlyDisplay}</span>
                <span className="text-gray-500">/ night</span>
                <div className="ml-auto">
                  <ReviewStars rating={listing.rating} count={listing.reviewCount} size="sm" />
                </div>
              </div>

              {/* Date Pickers */}
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">
                    Check-in
                  </label>
                  <input
                    type="date"
                    className="input-field py-2.5 text-sm"
                    placeholder="Add date"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">
                    Check-out
                  </label>
                  <input
                    type="date"
                    className="input-field py-2.5 text-sm"
                    placeholder="Add date"
                  />
                </div>
              </div>

              {/* Guests */}
              <div className="mb-4">
                <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">
                  Guests
                </label>
                <select className="input-field py-2.5 text-sm">
                  {Array.from({ length: listing.sleeps }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n}>
                      {n} guest{n !== 1 ? 's' : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Insurance Tier */}
              <div className="mb-4">
                <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">
                  Insurance
                </label>
                <div className="space-y-2">
                  {INSURANCE_TIERS.map((tier) => (
                    <label
                      key={tier.tier}
                      className={cn(
                        'flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors',
                        tier.recommended
                          ? 'border-brand-300 bg-brand-50'
                          : 'border-gray-200 hover:border-gray-300'
                      )}
                    >
                      <input
                        type="radio"
                        name="insurance"
                        value={tier.tier}
                        defaultChecked={tier.recommended}
                        className="text-brand-600 focus:ring-brand-500"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-900">{tier.name}</span>
                          {tier.recommended && (
                            <span className="text-xs text-brand-600 font-medium">Recommended</span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">{tier.description}</p>
                      </div>
                      <span className="text-sm font-semibold text-gray-900 whitespace-nowrap">
                        {formatCents(tier.price)}/day
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="border-t border-gray-200 pt-4 mb-4 space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>${nightlyDisplay} x 5 nights</span>
                  <span>{formatCents(listing.nightlyRate * 5)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Cleaning fee</span>
                  <span>{formatCents(listing.cleaningFee)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Insurance (Essential x 5 days)</span>
                  <span>{formatCents(3800 * 5)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Service fee (5%)</span>
                  <span>{formatCents(rivalFees)}</span>
                </div>
                <div className="flex justify-between font-semibold text-gray-900 pt-2 border-t border-gray-100">
                  <span>Total</span>
                  <span>{formatCents(listing.nightlyRate * 5 + listing.cleaningFee + 3800 * 5 + rivalFees)}</span>
                </div>
              </div>

              {/* Book Button */}
              <Link
                href={`/listing/${id}/book`}
                className="btn-primary w-full text-base py-3.5 mb-3"
              >
                {listing.instantBook ? 'Book Now' : 'Request to Book'}
              </Link>

              <p className="text-center text-sm text-gray-500 mb-4">
                You won&apos;t be charged yet
              </p>

              {/* Savings callout */}
              <div className="bg-brand-50 border border-brand-200 rounded-xl p-4 text-center">
                <p className="text-sm font-semibold text-brand-800">
                  Only 5% fee &mdash; save {formatCents(savings)} vs Outdoorsy
                </p>
                <p className="text-xs text-brand-600 mt-1">
                  On a 5-night trip at this rate
                </p>
              </div>

              {/* Security Deposit Note */}
              <p className="text-xs text-gray-400 mt-4 text-center">
                A refundable {formatCents(listing.securityDeposit)} security deposit will be held on your card
              </p>
            </div>

            {/* Quick Info */}
            <div className="mt-4 flex items-center justify-center gap-6 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
                $1M Insured
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                Verified
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
                Secure
              </span>
            </div>
          </div>

          {/* Mobile Fixed Bottom Bar */}
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 flex items-center justify-between lg:hidden z-30">
            <div>
              <span className="text-lg font-bold text-gray-900">${nightlyDisplay}</span>
              <span className="text-sm text-gray-500"> / night</span>
              <div className="flex items-center gap-1 mt-0.5">
                <ReviewStars rating={listing.rating} size="sm" />
                <span className="text-xs text-gray-500">({listing.reviewCount})</span>
              </div>
            </div>
            <Link
              href={`/listing/${id}/book`}
              className="btn-primary px-8"
            >
              {listing.instantBook ? 'Book Now' : 'Request to Book'}
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom spacer for mobile fixed bar */}
      <div className="h-24 lg:hidden" />
    </div>
  );
}
