import type { MarketplaceItem } from "@/types";

export const marketItems: MarketplaceItem[] = [
  {
    id: "PL-JS-NRG-MKT-001",
    title: 'MacBook Pro 13" (2020)',
    description: "Excellent condition, barely used. Perfect for students. Battery health 95%.",
    price: 450000,
    images: ["https://images.unsplash.com/photo-1517336714731-489689fd1ca4?auto=format&fit=crop&w=800&q=80"],
    condition: "Used",
    category: "Electronics",
    sellerId: "SLR-2025-001",
    seller: {
      id: "SLR-2025-001",
      email: "chidi.o@gmail.com",
      firstName: "Chidi",
      lastName: "Okonkwo",
      role: "seller",
      isVerified: true,
      createdAt: "2025-01-10",
      updatedAt: "2025-01-10"
    },
    university: "University of Jos",
    isAvailable: true,
    tags: ["laptop", "apple", "macbook", "electronics"],
    createdAt: "2025-10-20",
    updatedAt: "2025-10-20"
  },
  {
    id: "PL-JS-BAU-MKT-002",
    title: "Engineering Textbook Bundle (100-200L)",
    description:
      "Complete set of engineering textbooks for 100 and 200 level. Includes Engineering Maths, Physics, and Drawing instruments.",
    price: 25000,
    images: ["https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80"],
    condition: "Used",
    category: "Books",
    sellerId: "SLR-2025-002",
    seller: {
      id: "SLR-2025-002",
       email: "amina.h@gmail.com",
      firstName: "Amina",
      lastName: "Hassan",
      role: "seller",
      isVerified: true,
      createdAt: "2025-01-12",
      updatedAt: "2025-01-12"
    },
    university: "University of Jos",
    isAvailable: true,
    tags: ["textbooks", "engineering", "academics"],
     createdAt: "2025-10-22",
    updatedAt: "2025-10-22"
  },
   {
    id: "PL-JS-ZAR-MKT-003",
    title: "Table Top Fridge (Thermocool)",
    description: "Clean silver table top fridge. Works perfectly. Selling because I'm graduating.",
    price: 85000,
    images: ["https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?auto=format&fit=crop&w=800&q=80"],
    condition: "Used",
    category: "Appliances",
    sellerId: "SLR-2025-003",
    seller: {
        id: "SLR-2025-003",
        email: "david.k@gmail.com",
        firstName: "David",
        lastName: "Kure",
         role: "seller",
      isVerified: false,
      createdAt: "2025-01-15",
      updatedAt: "2025-01-15"
    },
    university: "University of Jos",
    isAvailable: true,
    tags: ["fridge", "appliance", "kitchen"],
     createdAt: "2025-10-25",
    updatedAt: "2025-10-25"
  },
  {
    id: "PL-JS-NRG-MKT-004",
    title: "Ikea Study Desk & Chair",
    description: "White study desk with matching chair. Very sturdy. Brand new, box opened but never assembled.",
    price: 45000,
    images: ["https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=800&q=80"],
    condition: "New",
    category: "Furniture",
    sellerId: "SLR-2025-004",
    seller: {
        id: "SLR-2025-004",
        email: "sarah.m@gmail.com",
        firstName: "Sarah",
        lastName: "Mike",
         role: "seller",
      isVerified: true,
      createdAt: "2025-01-18",
      updatedAt: "2025-01-18"
    },
    university: "University of Jos",
    isAvailable: true,
    tags: ["furniture", "desk", "study"],
     createdAt: "2025-10-26",
    updatedAt: "2025-10-26"
  }
];
