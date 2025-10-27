import type { PropertyDetail } from "@/types";

export const propertyDetails: PropertyDetail[] = [
  {
    id: "VC-HS-2025-001",
    title: "2 Bedroom Self-Contain at Naraguta",
    propertyType: "Self-Contain",
    rent: {
      amount: 350000,
      currency: "NGN",
      duration: "year",
    },
    location: {
      address: "Naraguta, near University of Jos Main Campus, Jos, Plateau State",
      googlePin: "https://goo.gl/maps/4t8tYbQYxBvWzS3U7",
    },
    rating: {
      average: 4.3,
      reviewCount: 18,
    },
    landlord: {
      name: "Mr. Sani Musa",
      verified: true,
      id: "LLD-102",
      contactNumber: "+2348091234567",
      whatsapp: "https://wa.me/2348091234567",
      email: "sanimusa@gmail.com",
      agencyName: "Jos Homes Connect",
      profileImage:
        "https://images.unsplash.com/photo-1603415526960-f7e0328d5f47?auto=format&fit=crop&w=600&q=80",
      description:
        "Experienced property agent specializing in student-friendly and secure accommodations around Naraguta.",
    },
    availability: "Available",
    topAmenities: ["Water", "Electricity (Band A)", "Security", "WiFi"],
    thumbnailImage:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1599423300746-b62533397364?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1586105251261-72a756497a12?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80",
    ],
    lastUpdated: "2025-10-25",
    highlighted: true,
    description:
      "A clean and spacious 2-bedroom self-contain located within walking distance to UNIJOS Main Campus. The apartment offers reliable power, borehole water, and secure access. Ideal for students or small families.",
    rules: [
      "No smoking indoors",
      "Respect quiet hours (10 PM - 6 AM)",
      "Rent payable yearly or bi-annually",
    ],
    dimensions: {
      roomSize: "12x14 ft",
      totalArea: "68 sqm",
      floorLevel: "Ground Floor",
    },
    bathroom: { type: "Private", count: 2 },
    kitchen: { access: "Private", hasSink: true },
    utilities: {
      water: true,
      electricity: true,
      wasteDisposal: true,
      internet: false,
      prepaidMeter: true,
    },
    security: {
      gated: true,
      fenced: true,
      securityGuard: true,
      streetLight: true,
    },
    proximity: {
      toCampus: "8 mins walk to UNIJOS Main Campus",
      toMarket: "6 mins to Terminus Market",
      toBusStop: "3 mins walk",
    },
    media: {
      videoTour: "https://www.youtube.com/watch?v=2E4HkJZLwXc",
      view360: "https://kuula.co/share/collection/7YvV5",
      mapEmbed:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3939.865825885326!2d8.88841751478451!3d9.886245292922272",
    },
    metadata: {
      propertyCode: "VC-HS-2025-001",
      verifiedDate: "2025-10-20",
      viewsCount: 215,
      featured: true,
    },
    reviews: {
      cleanliness: 4.5,
      safety: 4.2,
      power: 4.0,
      water: 4.6,
      value: 4.3,
    },
    reviewList: [
      {
        userId: "USR-11",
        userName: "Blessing O.",
        rating: 5,
        comment:
          "Very neat and close to school. The landlord is friendly and reliable.",
        date: "2025-10-18",
      },
      {
        userId: "USR-12",
        userName: "Joseph D.",
        rating: 4,
        comment: "Good power supply and water. Only wish kitchen was bigger.",
        date: "2025-10-19",
      },
    ],
    roommates: [
      { id: "RM-001", name: "Tina", gender: "Female", availability: false },
    ],
    nearbyFacilities: [
      {
        name: "Terminus Market",
        type: "Market",
        distance: "6 mins walk",
        googleMapLink: "https://goo.gl/maps/8BhsdkfjFajkD3v88",
      },
      {
        name: "NTA Clinic",
        type: "Hospital",
        distance: "4 mins drive",
      },
      {
        name: "Campus Express Eatery",
        type: "Eatery",
        distance: "3 mins walk",
      },
    ],
    environment: {
      noiseLevel: "Low",
      powerSupplyRating: 4,
      waterAvailabilityRating: 5,
    },
    paymentTerms: {
      frequency: "Yearly",
      negotiable: true,
      depositRequired: true,
      depositAmount: 50000,
    },
    additionalNotes:
      "Preferred by final-year students. Includes access to shared compound for parking.",
  },

  // --- Second Property ---
  {
    id: "VC-HS-2025-002",
    title: "1 Bedroom Apartment at Rayfield Estate",
    propertyType: "Mini Flat",
    rent: {
      amount: 600000,
      currency: "NGN",
      duration: "year",
    },
    location: {
      address: "Rayfield Estate, Jos South, Plateau State",
      googlePin: "https://goo.gl/maps/b4s5Q4J4nK3LqXQW8",
    },
    rating: {
      average: 4.7,
      reviewCount: 25,
    },
    landlord: {
      name: "Mrs. Sarah Luka",
      verified: true,
      id: "LLD-205",
      contactNumber: "+2348025567834",
      whatsapp: "https://wa.me/2348025567834",
      email: "sarahluka.properties@gmail.com",
      agencyName: "Blue Haven Realty",
      profileImage:
        "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=600&q=80",
      description:
        "Trusted property agent offering premium homes and mini flats in secure Jos neighborhoods.",
    },
    availability: "Available",
    topAmenities: ["Prepaid Meter", "Parking Space", "Security", "Water Heater"],
    thumbnailImage:
      "https://images.unsplash.com/photo-1600585154207-8c8a477b1e8e?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1585412727339-54efc4cb0f37?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1599423300746-b62533397364?auto=format&fit=crop&w=1200&q=80",
    ],
    lastUpdated: "2025-10-21",
    highlighted: false,
    description:
      "Modern one-bedroom mini flat located inside Rayfield Estate. Perfect for working professionals or small families. Comes with full kitchen, prepaid meter, and gated compound.",
    rules: [
      "No loud parties",
      "Pets allowed (small only)",
      "Rent payable yearly only",
    ],
    dimensions: {
      roomSize: "14x16 ft",
      totalArea: "80 sqm",
      floorLevel: "1st Floor",
    },
    bathroom: { type: "Private", count: 1 },
    kitchen: { access: "Private", hasSink: true },
    utilities: {
      water: true,
      electricity: true,
      wasteDisposal: true,
      internet: false,
      prepaidMeter: true,
    },
    security: {
      gated: true,
      fenced: true,
      securityGuard: true,
      streetLight: true,
      cctv: true,
    },
    proximity: {
      toCampus: "25 mins drive to UNIJOS",
      toMarket: "8 mins to Rayfield Market",
      toBusStop: "2 mins walk",
    },
    media: {
      videoTour: "https://www.youtube.com/watch?v=3GwjfUFyY6M",
      view360: "https://kuula.co/share/collection/7YvV5",
      mapEmbed:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3939.865825885326!2d8.89531751478451!3d9.876245292922272",
    },
    metadata: {
      propertyCode: "VC-HS-2025-002",
      verifiedDate: "2025-10-18",
      viewsCount: 342,
      featured: false,
    },
    reviews: {
      cleanliness: 4.8,
      safety: 4.9,
      power: 4.6,
      water: 4.5,
      value: 4.7,
    },
    reviewList: [
      {
        userId: "USR-20",
        userName: "Henry M.",
        rating: 5,
        comment: "Very quiet area, constant light, and great security.",
        date: "2025-10-17",
      },
      {
        userId: "USR-21",
        userName: "Grace T.",
        rating: 4,
        comment: "Nice apartment, just a bit far from school.",
        date: "2025-10-19",
      },
    ],
    nearbyFacilities: [
      {
        name: "Rayfield Supermarket",
        type: "Shop",
        distance: "4 mins walk",
      },
      {
        name: "Rayfield Market",
        type: "Market",
        distance: "8 mins drive",
      },
      {
        name: "St. Luke Clinic",
        type: "Hospital",
        distance: "5 mins drive",
      },
    ],
    environment: {
      noiseLevel: "Low",
      powerSupplyRating: 5,
      waterAvailabilityRating: 4,
    },
    paymentTerms: {
      frequency: "Yearly",
      negotiable: false,
      depositRequired: true,
      depositAmount: 100000,
    },
    additionalNotes:
      "Property is managed by Blue Haven Realty. Tenants enjoy 24/7 gated security and water supply.",
  },

  {
    id: "VC-HS-2025-003",
    title: "Single Room Lodge at Bauchi Road",
    propertyType: "Student Lodge",
    rent: {
      amount: 120000,
      currency: "NGN",
      duration: "year",
    },
    location: {
      address: "Opposite Faculty of Arts, Bauchi Road Campus, Jos, Plateau State",
      googlePin: "https://goo.gl/maps/y9R2fDz3LV8zTqgt9",
    },
    rating: {
      average: 4.0,
      reviewCount: 35,
    },
    landlord: {
      name: "Mr. Danladi Peter",
      verified: true,
      id: "LLD-309",
      contactNumber: "+2348067892345",
      whatsapp: "https://wa.me/2348067892345",
      email: "danladipeters@gmail.com",
      agencyName: "Campus Lodge Properties",
      profileImage:
        "https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&w=600&q=80",
      description:
        "Dedicated to providing affordable student lodges close to UNIJOS Bauchi Road Campus.",
    },
    availability: "Available",
    topAmenities: ["Borehole", "Electricity", "Security", "Shared Kitchen"],
    thumbnailImage:
      "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1599423300746-b62533397364?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1560184897-07d93f0f1f55?auto=format&fit=crop&w=1200&q=80",
    ],
    lastUpdated: "2025-10-15",
    highlighted: false,
    description:
      "Single room lodge designed for students who value privacy and affordability. Comes with borehole water, prepaid light, and a shared kitchen. 5 minutes walk to UNIJOS gate.",
    rules: ["No smoking", "No overnight guests", "Keep shared spaces clean"],
    dimensions: {
      roomSize: "10x12 ft",
      totalArea: "35 sqm",
      floorLevel: "Ground Floor",
    },
    bathroom: { type: "Shared", count: 2 },
    kitchen: { access: "Shared", hasSink: true },
    utilities: {
      water: true,
      electricity: true,
      wasteDisposal: true,
      internet: false,
      prepaidMeter: true,
    },
    security: {
      gated: true,
      fenced: true,
      securityGuard: false,
      streetLight: true,
    },
    proximity: {
      toCampus: "5 mins walk to UNIJOS Bauchi Road Campus",
      toMarket: "3 mins to Student Market",
    },
    media: {
      videoTour: "https://www.youtube.com/watch?v=8tPnX7OPo0Q",
      mapEmbed:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3939.965725885326!2d8.87131751478451!3d9.899245292922272",
    },
    metadata: {
      propertyCode: "VC-HS-2025-003",
      verifiedDate: "2025-10-10",
      viewsCount: 189,
      featured: false,
    },
    reviews: {
      cleanliness: 3.9,
      safety: 4.1,
      power: 4.2,
      water: 4.3,
      value: 4.4,
    },
    reviewList: [
      {
        userId: "USR-33",
        userName: "Sandra P.",
        rating: 4,
        comment:
          "Affordable and close to school. Shared bathroom is clean enough.",
        date: "2025-10-14",
      },
    ],
    roommates: [
      { id: "RM-002", name: "Victor", gender: "Male", availability: true },
    ],
    nearbyFacilities: [
      {
        name: "Campus Express Eatery",
        type: "Eatery",
        distance: "4 mins walk",
      },
      { name: "Student Market", type: "Market", distance: "3 mins walk" },
    ],
    environment: {
      noiseLevel: "Moderate",
      powerSupplyRating: 4,
      waterAvailabilityRating: 4,
    },
    paymentTerms: {
      frequency: "Yearly",
      negotiable: false,
      depositRequired: false,
    },
  },

  // -------------------------------------------------------------------
  // 4️⃣ Property: Shared Apartment at Zaramaganda
  // -------------------------------------------------------------------
  {
    id: "VC-HS-2025-004",
    title: "Shared Apartment at Zaramaganda",
    propertyType: "Shared Flat",
    rent: {
      amount: 250000,
      currency: "NGN",
      duration: "year",
    },
    location: {
      address: "Zaramaganda, off Old Airport Road, Jos South, Plateau State",
      googlePin: "https://goo.gl/maps/HxZjN4cYz6A8kXGz5",
    },
    rating: {
      average: 4.2,
      reviewCount: 9,
    },
    landlord: {
      name: "Mr. Emmanuel Yakubu",
      verified: false,
      id: "LLD-420",
      contactNumber: "+2347035574823",
      whatsapp: "https://wa.me/2347035574823",
      email: "emmayakubu@gmail.com",
      profileImage:
        "https://images.unsplash.com/photo-1590080875831-7a1e8a7a5c6b?auto=format&fit=crop&w=600&q=80",
      description:
        "Friendly landlord renting out part of his self-contained apartment. Ideal for working-class individuals.",
    },
    availability: "Available",
    topAmenities: ["WiFi", "Water", "Kitchen Access", "Security"],
    thumbnailImage:
      "https://images.unsplash.com/photo-1599423300746-b62533397364?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1586105251261-72a756497a12?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?auto=format&fit=crop&w=1200&q=80",
    ],
    lastUpdated: "2025-10-22",
    highlighted: true,
    description:
      "Cozy shared flat with two available rooms, shared kitchen and bathroom. Located in a calm and well-secured area of Zaramaganda. Perfect for young professionals or NYSC members.",
    rules: ["Keep shared areas clean", "No parties", "Respect quiet hours"],
    dimensions: {
      roomSize: "11x12 ft",
      totalArea: "55 sqm",
      floorLevel: "Ground Floor",
    },
    bathroom: { type: "Shared", count: 1 },
    kitchen: { access: "Shared" },
    utilities: {
      water: true,
      electricity: true,
      wasteDisposal: true,
      internet: true,
    },
    security: {
      gated: true,
      fenced: true,
      securityGuard: false,
      streetLight: true,
    },
    proximity: {
      toCampus: "15 mins drive to UNIJOS",
      toMarket: "5 mins to Zaramaganda Mini Market",
    },
    media: {
      videoTour: "https://www.youtube.com/watch?v=sBws8MSXN7A",
    },
    metadata: {
      propertyCode: "VC-HS-2025-004",
      verifiedDate: "2025-10-21",
      viewsCount: 101,
      featured: true,
    },
    reviews: {
      cleanliness: 4.4,
      safety: 4.3,
      power: 4.0,
      water: 4.1,
      value: 4.2,
    },
    reviewList: [
      {
        userId: "USR-34",
        userName: "Kehinde T.",
        rating: 4,
        comment: "Nice and affordable shared space. Quiet neighborhood.",
        date: "2025-10-22",
      },
    ],
    roommates: [
      { id: "RM-003", name: "Lilian", gender: "Female", availability: true },
    ],
    nearbyFacilities: [
      {
        name: "Zaramaganda Mini Market",
        type: "Market",
        distance: "5 mins walk",
      },
      {
        name: "Total Filling Station",
        type: "Shop",
        distance: "3 mins drive",
      },
    ],
    environment: {
      noiseLevel: "Low",
      powerSupplyRating: 3,
      waterAvailabilityRating: 4,
    },
    paymentTerms: {
      frequency: "Yearly",
      negotiable: true,
      depositRequired: true,
      depositAmount: 20000,
    },
  },

  // -------------------------------------------------------------------
  // 5️⃣ Property: 3-Bedroom Bungalow at Rayfield
  // -------------------------------------------------------------------
  {
    id: "VC-HS-2025-005",
    title: "3 Bedroom Fully Detached Bungalow at Rayfield",
    propertyType: "Bungalow",
    rent: {
      amount: 900000,
      currency: "NGN",
      duration: "year",
    },
    location: {
      address: "Rayfield Layout, Jos South, Plateau State",
      googlePin: "https://goo.gl/maps/DeTjJ6VhG2y7Mghq8",
    },
    rating: {
      average: 4.8,
      reviewCount: 13,
    },
    landlord: {
      name: "Mr. Ibrahim Sule",
      verified: true,
      id: "LLD-512",
      contactNumber: "+2348065571245",
      whatsapp: "https://wa.me/2348065571245",
      email: "ibrahimsulehomes@gmail.com",
      agencyName: "Jos Elite Properties",
      profileImage:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=600&q=80",
      description:
        "Trusted realtor offering premium family homes and bungalows across Jos South.",
    },
    availability: "Available",
    topAmenities: [
      "Parking",
      "Prepaid Meter",
      "Water Heater",
      "Fenced Compound",
    ],
    thumbnailImage:
      "https://images.unsplash.com/photo-1599423300746-b62533397364?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1586105251261-72a756497a12?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1599423300746-b62533397364?auto=format&fit=crop&w=1200&q=80",
    ],
    lastUpdated: "2025-10-19",
    highlighted: true,
    description:
      "A fully detached 3-bedroom bungalow with POP ceilings, large compound, borehole water, and prepaid electricity meter. Perfect for families and professionals seeking comfort and privacy.",
    rules: ["No subletting", "Pets allowed", "Pay utility bills on time"],
    dimensions: {
      roomSize: "14x16 ft",
      totalArea: "200 sqm",
      floorLevel: "Ground Floor",
    },
    bathroom: { type: "Private", count: 3 },
    kitchen: { access: "Private" },
    utilities: {
      water: true,
      electricity: true,
      wasteDisposal: true,
      internet: true,
      prepaidMeter: true,
    },
    security: {
      gated: true,
      fenced: true,
      securityGuard: true,
      streetLight: true,
      cctv: true,
    },
    proximity: {
      toCampus: "20 mins drive to UNIJOS",
      toMarket: "10 mins to Rayfield Market",
    },
    media: {
      videoTour: "https://www.youtube.com/watch?v=6lt2JfJdGSY",
    },
    metadata: {
      propertyCode: "VC-HS-2025-005",
      verifiedDate: "2025-10-19",
      viewsCount: 412,
      featured: true,
    },
    reviews: {
      cleanliness: 4.9,
      safety: 4.8,
      power: 4.7,
      water: 4.6,
      value: 4.7,
    },
    reviewList: [
      {
        userId: "USR-40",
        userName: "Tosin A.",
        rating: 5,
        comment: "Luxury at an affordable rate. Constant light and water.",
        date: "2025-10-20",
      },
    ],
    environment: {
      noiseLevel: "Low",
      powerSupplyRating: 5,
      waterAvailabilityRating: 4,
    },
    paymentTerms: {
      frequency: "Yearly",
      negotiable: true,
      depositRequired: true,
      depositAmount: 100000,
    },
  },

  // -------------------------------------------------------------------
  // 6️⃣ Property: Studio Apartment at Old Bukuru Park
  // -------------------------------------------------------------------
  {
    id: "VC-HS-2025-006",
    title: "Studio Apartment at Old Bukuru Park",
    propertyType: "Studio Apartment",
    rent: {
      amount: 180000,
      currency: "NGN",
      duration: "year",
    },
    location: {
      address: "Off Old Bukuru Road, Jos South, Plateau State",
      googlePin: "https://goo.gl/maps/P9x7VQ1VRy84n8EL7",
    },
    rating: {
      average: 4.5,
      reviewCount: 20,
    },
    landlord: {
      name: "Mrs. Ngozi Okeke",
      verified: true,
      id: "LLD-612",
      contactNumber: "+2348064492367",
      whatsapp: "https://wa.me/2348064492367",
      email: "ngoziokekeapartments@gmail.com",
      agencyName: "Okeke Homes Jos",
      profileImage:
        "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?auto=format&fit=crop&w=600&q=80",
      description:
        "Family-owned apartments known for cleanliness, security, and quick maintenance response.",
    },
    availability: "Available",
    topAmenities: ["POP Ceiling", "WiFi", "Water Heater", "Prepaid Meter"],
    thumbnailImage:
      "https://images.unsplash.com/photo-1599423300746-b62533397364?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1586105251261-72a756497a12?auto=format&fit=crop&w=1200&q=80",
    ],
    lastUpdated: "2025-10-26",
    highlighted: false,
    description:
      "Compact but elegant studio apartment suitable for single tenants or NYSC members. Fitted with prepaid meter, borehole water, and POP ceiling. Located in a secure and calm neighborhood.",
    rules: ["No smoking", "No loud music after 10 PM"],
    dimensions: {
      roomSize: "10x14 ft",
      totalArea: "40 sqm",
      floorLevel: "1st Floor",
    },
    bathroom: { type: "Private", count: 1 },
    kitchen: { access: "Private" },
    utilities: {
      water: true,
      electricity: true,
      wasteDisposal: true,
      internet: true,
      prepaidMeter: true,
    },
    security: {
      gated: true,
      fenced: true,
      streetLight: true,
    },
    proximity: {
      toCampus: "15 mins drive to UNIJOS",
      toMarket: "4 mins to Bukuru Market",
    },
    media: {
      videoTour: "https://www.youtube.com/watch?v=eX2qFMC8cFo",
    },
    metadata: {
      propertyCode: "VC-HS-2025-006",
      verifiedDate: "2025-10-25",
      viewsCount: 160,
      featured: false,
    },
    reviews: {
      cleanliness: 4.6,
      safety: 4.5,
      power: 4.4,
      water: 4.7,
      value: 4.5,
    },
    reviewList: [
      {
        userId: "USR-42",
        userName: "Deborah O.",
        rating: 5,
        comment: "Very clean and quiet. Landlady is nice and responsive.",
        date: "2025-10-25",
      },
    ],
    environment: {
      noiseLevel: "Low",
      powerSupplyRating: 4,
      waterAvailabilityRating: 5,
    },
    paymentTerms: {
      frequency: "Yearly",
      negotiable: true,
      depositRequired: true,
      depositAmount: 30000,
    },
  }
];
