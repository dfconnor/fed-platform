import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create demo users
  const host1 = await prisma.user.upsert({
    where: { email: 'sarah@example.com' },
    update: {},
    create: {
      email: 'sarah@example.com',
      name: 'Sarah Johnson',
      idVerified: true,
      backgroundCheck: true,
      hostTier: 'GOLD',
      bio: 'RV enthusiast and full-time traveler. I love sharing my rigs with fellow adventurers! Based in Denver, CO.',
    },
  });

  const host2 = await prisma.user.upsert({
    where: { email: 'mike@example.com' },
    update: {},
    create: {
      email: 'mike@example.com',
      name: 'Mike Chen',
      idVerified: true,
      backgroundCheck: true,
      hostTier: 'SILVER',
      bio: 'Weekend warrior with a passion for the open road. My Airstream is my pride and joy.',
    },
  });

  const host3 = await prisma.user.upsert({
    where: { email: 'jessica@example.com' },
    update: {},
    create: {
      email: 'jessica@example.com',
      name: 'Jessica Martinez',
      idVerified: true,
      backgroundCheck: true,
      hostTier: 'PLATINUM',
      bio: 'Professional RV fleet manager with 5 years of hosting experience and 200+ trips.',
    },
  });

  const guest1 = await prisma.user.upsert({
    where: { email: 'alex@example.com' },
    update: {},
    create: {
      email: 'alex@example.com',
      name: 'Alex Rivera',
      idVerified: true,
      backgroundCheck: true,
    },
  });

  // Create listings
  const listing1 = await prisma.rVListing.create({
    data: {
      hostId: host1.id,
      title: 'Luxury Class A Motorhome - Perfect for Family Adventures',
      description:
        'Experience the ultimate road trip in this stunning 2022 Thor Palazzo Class A motorhome. Featuring a king-size bed, full kitchen with residential fridge, 2 bathrooms, washer/dryer, and a massive entertainment system. Solar panels and a quiet generator keep you powered off-grid. Sleeps 6 comfortably with convertible dinette and sofa.',
      rvType: 'CLASS_A',
      year: 2022,
      make: 'Thor',
      model: 'Palazzo 37.5',
      length: 38,
      sleeps: 6,
      seatbelts: 6,
      nightlyRate: 18900,
      cleaningFee: 15000,
      securityDeposit: 100000,
      weeklyDiscount: 10,
      monthlyDiscount: 20,
      minNights: 2,
      maxNights: 30,
      address: '1234 Mountain View Rd',
      city: 'Denver',
      state: 'CO',
      zipCode: '80202',
      latitude: 39.7392,
      longitude: -104.9903,
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
        'leveling_jacks',
        'backup_camera',
        'washer_dryer',
        'inverter',
        'water_heater',
      ],
      features: ['pet_friendly', 'festival_ready', 'off_grid'],
      rules:
        'No smoking inside. Pets allowed with $50 pet fee. Generator quiet hours 10pm-7am. Return with at least 1/4 tank of fuel.',
      mileage: 12000,
      fuelType: 'DIESEL',
      deliveryAvailable: true,
      deliveryFee: 300,
      deliveryRadius: 50,
      status: 'ACTIVE',
      instantBook: true,
      verified: true,
      averageRating: 4.9,
      totalReviews: 47,
      totalTrips: 52,
    },
  });

  const listing2 = await prisma.rVListing.create({
    data: {
      hostId: host2.id,
      title: 'Vintage Airstream - Instagram-Worthy Adventures',
      description:
        'Turn heads in this beautifully restored 2020 Airstream International. Iconic silver bullet exterior with a modern, minimalist interior. Full kitchen, bathroom with rain shower, queen bed, and a cozy dinette that converts to a bed. Solar-powered and ready for boondocking.',
      rvType: 'AIRSTREAM',
      year: 2020,
      make: 'Airstream',
      model: 'International 25FB',
      length: 25,
      sleeps: 4,
      seatbelts: 0,
      nightlyRate: 12500,
      cleaningFee: 10000,
      securityDeposit: 75000,
      weeklyDiscount: 15,
      monthlyDiscount: 25,
      minNights: 2,
      maxNights: 21,
      address: '456 Music Row',
      city: 'Austin',
      state: 'TX',
      zipCode: '78701',
      latitude: 30.2672,
      longitude: -97.7431,
      amenities: [
        'kitchen',
        'ac',
        'heating',
        'solar',
        'shower',
        'toilet',
        'awning',
        'leveling_jacks',
        'water_heater',
      ],
      features: ['festival_ready', 'off_grid'],
      rules: 'No smoking. No pets. Towing vehicle with appropriate hitch required.',
      fuelType: 'NA',
      towable: true,
      deliveryAvailable: true,
      deliveryFee: 250,
      deliveryRadius: 30,
      status: 'ACTIVE',
      instantBook: true,
      verified: true,
      averageRating: 4.8,
      totalReviews: 31,
      totalTrips: 38,
    },
  });

  const listing3 = await prisma.rVListing.create({
    data: {
      hostId: host3.id,
      title: 'Cozy Campervan - The Ultimate Road Trip Machine',
      description:
        'Hit the road in this custom-built 2023 Winnebago Solis campervan. Compact enough for city parking, capable enough for mountain passes. Pop-top roof for extra headroom, kitchenette with two-burner stove, outdoor shower, and the comfiest bed on wheels. Great fuel economy at 20+ MPG.',
      rvType: 'CAMPERVAN',
      year: 2023,
      make: 'Winnebago',
      model: 'Solis 59P',
      length: 19,
      sleeps: 2,
      seatbelts: 2,
      nightlyRate: 9500,
      cleaningFee: 5000,
      securityDeposit: 50000,
      weeklyDiscount: 10,
      monthlyDiscount: 20,
      minNights: 1,
      maxNights: 30,
      address: '789 Pearl District',
      city: 'Portland',
      state: 'OR',
      zipCode: '97209',
      latitude: 45.5152,
      longitude: -122.6784,
      amenities: ['kitchen', 'heating', 'solar', 'shower', 'awning', 'backup_camera', 'inverter'],
      features: ['pet_friendly', 'off_grid'],
      rules: 'Pets welcome! No smoking. Return with full tank.',
      mileage: 5000,
      fuelType: 'GAS',
      deliveryAvailable: false,
      status: 'ACTIVE',
      instantBook: true,
      verified: true,
      averageRating: 5.0,
      totalReviews: 23,
      totalTrips: 25,
    },
  });

  const listing4 = await prisma.rVListing.create({
    data: {
      hostId: host3.id,
      title: 'Family Class C Motorhome - Easy to Drive',
      description:
        'Perfect for families! This 2021 Jayco Greyhawk Class C is built on a Ford E-450 chassis, making it easy to drive for first-timers. Features a rear queen bed, overhead bunk, convertible dinette, full bathroom, and a well-equipped kitchen. Backup camera and leveling jacks included.',
      rvType: 'CLASS_C',
      year: 2021,
      make: 'Jayco',
      model: 'Greyhawk 27U',
      length: 28,
      sleeps: 6,
      seatbelts: 6,
      nightlyRate: 15900,
      cleaningFee: 12000,
      securityDeposit: 75000,
      weeklyDiscount: 10,
      monthlyDiscount: 15,
      minNights: 2,
      maxNights: 21,
      address: '321 Theme Park Dr',
      city: 'Orlando',
      state: 'FL',
      zipCode: '32801',
      latitude: 28.5383,
      longitude: -81.3792,
      amenities: [
        'kitchen',
        'ac',
        'heating',
        'generator',
        'shower',
        'toilet',
        'tv',
        'awning',
        'leveling_jacks',
        'backup_camera',
        'water_heater',
      ],
      features: ['child_seats', 'tow_hitch'],
      rules: 'No smoking. Pets considered on case-by-case basis. Generator quiet hours 9pm-8am.',
      mileage: 18000,
      fuelType: 'GAS',
      deliveryAvailable: true,
      deliveryFee: 200,
      deliveryRadius: 25,
      status: 'ACTIVE',
      instantBook: false,
      verified: true,
      averageRating: 4.7,
      totalReviews: 19,
      totalTrips: 22,
    },
  });

  const listing5 = await prisma.rVListing.create({
    data: {
      hostId: host1.id,
      title: 'Beach-Ready Travel Trailer - Oceanside Camping',
      description:
        'Light and towable 2022 Grand Design Imagine travel trailer. Perfect for beach camping with outdoor shower, awning with LED lights, and panoramic windows. Full kitchen, separate bedroom, and spacious bathroom. Easy to tow with a half-ton truck or large SUV.',
      rvType: 'TRAVEL_TRAILER',
      year: 2022,
      make: 'Grand Design',
      model: 'Imagine 2800BH',
      length: 32,
      sleeps: 8,
      seatbelts: 0,
      nightlyRate: 8500,
      cleaningFee: 8000,
      securityDeposit: 50000,
      weeklyDiscount: 15,
      monthlyDiscount: 25,
      minNights: 2,
      maxNights: 30,
      address: '555 Coastal Hwy',
      city: 'San Diego',
      state: 'CA',
      zipCode: '92101',
      latitude: 32.7157,
      longitude: -117.1611,
      amenities: [
        'kitchen',
        'ac',
        'heating',
        'shower',
        'toilet',
        'tv',
        'awning',
        'outdoor_kitchen',
        'leveling_jacks',
        'water_heater',
      ],
      features: ['pet_friendly', 'tailgate_ready'],
      rules: 'No smoking. Dogs welcome (max 2). Must have appropriate tow vehicle.',
      fuelType: 'NA',
      towable: true,
      deliveryAvailable: true,
      deliveryFee: 200,
      deliveryRadius: 40,
      status: 'ACTIVE',
      instantBook: true,
      verified: true,
      averageRating: 4.9,
      totalReviews: 35,
      totalTrips: 41,
    },
  });

  const listing6 = await prisma.rVListing.create({
    data: {
      hostId: host2.id,
      title: 'Spacious Fifth Wheel - Home Away From Home',
      description:
        'This 2021 Keystone Montana fifth wheel is the ultimate home on wheels. Three slide-outs create a massive living space with residential furniture, fireplace, king bed, and a chef-worthy kitchen. Two full bathrooms and sleeping for 6. Perfect for extended stays.',
      rvType: 'FIFTH_WHEEL',
      year: 2021,
      make: 'Keystone',
      model: 'Montana 3761FL',
      length: 40,
      sleeps: 6,
      seatbelts: 0,
      nightlyRate: 14500,
      cleaningFee: 15000,
      securityDeposit: 75000,
      weeklyDiscount: 15,
      monthlyDiscount: 30,
      minNights: 3,
      maxNights: 60,
      address: '888 Broadway',
      city: 'Nashville',
      state: 'TN',
      zipCode: '37203',
      latitude: 36.1627,
      longitude: -86.7816,
      amenities: [
        'kitchen',
        'ac',
        'heating',
        'shower',
        'toilet',
        'tv',
        'wifi',
        'awning',
        'outdoor_kitchen',
        'leveling_jacks',
        'fireplace',
        'washer_dryer',
        'water_heater',
      ],
      features: ['pet_friendly', 'off_grid'],
      rules: 'No smoking. Pets welcome with deposit. Must have fifth wheel hitch or delivery.',
      fuelType: 'NA',
      towable: true,
      deliveryAvailable: true,
      deliveryFee: 350,
      deliveryRadius: 35,
      status: 'ACTIVE',
      instantBook: false,
      verified: true,
      averageRating: 4.6,
      totalReviews: 14,
      totalTrips: 16,
    },
  });

  // Create some reviews
  const reviews = [
    {
      listingId: listing1.id,
      authorId: guest1.id,
      subjectId: host1.id,
      type: 'GUEST_TO_HOST' as const,
      rating: 5,
      cleanliness: 5,
      accuracy: 5,
      communication: 5,
      value: 5,
      comment:
        'Absolutely incredible experience! The motorhome was spotless and had everything we needed. Sarah was super responsive and gave us great tips for camping near Rocky Mountain National Park. Will definitely book again!',
    },
    {
      listingId: listing2.id,
      authorId: guest1.id,
      subjectId: host2.id,
      type: 'GUEST_TO_HOST' as const,
      rating: 5,
      cleanliness: 5,
      accuracy: 5,
      communication: 4,
      value: 5,
      comment:
        'The Airstream is even more beautiful in person. Such a unique experience and great for a weekend getaway. Mike was helpful with setup instructions.',
    },
    {
      listingId: listing3.id,
      authorId: guest1.id,
      subjectId: host3.id,
      type: 'GUEST_TO_HOST' as const,
      rating: 5,
      cleanliness: 5,
      accuracy: 5,
      communication: 5,
      value: 5,
      comment:
        'Perfect little campervan for exploring the Pacific Northwest! Jessica had it all set up and ready to go. The pop-top is amazing for stargazing. 10/10 would recommend!',
    },
  ];

  for (const review of reviews) {
    // Create a completed booking first (reviews require a booking)
    const booking = await prisma.booking.create({
      data: {
        listingId: review.listingId,
        guestId: review.authorId,
        hostId: review.subjectId,
        startDate: new Date('2025-06-15'),
        endDate: new Date('2025-06-20'),
        nights: 5,
        nightlyTotal: 50000,
        subtotal: 55000,
        total: 57750,
        platformFeeGuest: 2750,
        platformFeeHost: 2750,
        insuranceTier: 'ESSENTIAL',
        status: 'COMPLETED',
      },
    });

    await prisma.review.create({
      data: {
        bookingId: booking.id,
        ...review,
      },
    });
  }

  // Create add-ons for listings
  await prisma.listingAddOn.createMany({
    data: [
      {
        listingId: listing1.id,
        name: 'Kitchen Essentials Kit',
        description: 'Pots, pans, utensils, plates, cups, and cooking basics',
        price: 3500,
        perNight: false,
      },
      {
        listingId: listing1.id,
        name: 'Camping Chairs (4)',
        description: 'Four folding camping chairs with cup holders',
        price: 2000,
        perNight: false,
      },
      {
        listingId: listing1.id,
        name: 'Bedding Package',
        description: 'Fresh linens, pillows, and blankets for all beds',
        price: 4000,
        perNight: false,
      },
      {
        listingId: listing2.id,
        name: 'Setup & Leveling Service',
        description: 'We set up the Airstream at your campsite',
        price: 7500,
        perNight: false,
      },
      {
        listingId: listing3.id,
        name: 'Bike Rack (2 bikes)',
        description: 'Hitch-mounted bike rack for 2 bikes',
        price: 1500,
        perNight: false,
      },
    ],
  });

  console.log('Seed complete!');
  console.log(`Created ${3} hosts, ${1} guest, ${6} listings, ${3} reviews`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
