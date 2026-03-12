import { PrismaClient } from "../generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import bcrypt from "bcryptjs";

const adapter = new PrismaLibSql({ url: "file:prisma/dev.db" });
const prisma = new PrismaClient({ adapter });

function generateOrderNumber(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `FED-${code}`;
}

async function main() {
  console.log("Seeding database...");

  // Clean existing data
  await prisma.orderItemModifier.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.modifier.deleteMany();
  await prisma.modifierGroup.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.menuCategory.deleteMany();
  await prisma.review.deleteMany();
  await prisma.promotion.deleteMany();
  await prisma.restaurant.deleteMany();
  await prisma.address.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.verificationToken.deleteMany();
  await prisma.user.deleteMany();
  await prisma.platformSettings.deleteMany();

  // ============================================
  // USERS
  // ============================================
  const passwordHash = await bcrypt.hash("admin123", 12);
  const ownerHash = await bcrypt.hash("owner123", 12);
  const customerHash = await bcrypt.hash("customer123", 12);

  const admin = await prisma.user.create({
    data: {
      email: "admin@getfed.com",
      name: "Admin User",
      passwordHash,
      role: "admin",
      emailVerified: new Date(),
    },
  });
  console.log("  Created admin user:", admin.email);

  const owner = await prisma.user.create({
    data: {
      email: "owner@getfed.com",
      name: "Restaurant Owner",
      passwordHash: ownerHash,
      role: "owner",
      phone: "(555) 123-4567",
      emailVerified: new Date(),
    },
  });
  console.log("  Created owner user:", owner.email);

  const customer = await prisma.user.create({
    data: {
      email: "customer@getfed.com",
      name: "Jane Customer",
      passwordHash: customerHash,
      role: "customer",
      phone: "(555) 987-6543",
      emailVerified: new Date(),
    },
  });
  console.log("  Created customer user:", customer.email);

  // Customer address
  await prisma.address.create({
    data: {
      userId: customer.id,
      label: "Home",
      line1: "123 Main Street",
      line2: "Apt 4B",
      city: "Portland",
      state: "OR",
      zip: "97201",
      isDefault: true,
    },
  });

  // ============================================
  // RESTAURANT 1: The Golden Fork
  // ============================================
  const goldenFork = await prisma.restaurant.create({
    data: {
      ownerId: owner.id,
      name: "The Golden Fork",
      slug: "the-golden-fork",
      cuisine: "American",
      description:
        "Contemporary American cuisine with a farm-to-table philosophy. Fresh, seasonal ingredients prepared with passion.",
      phone: "(555) 234-5678",
      email: "hello@thegoldenfork.com",
      website: "https://thegoldenfork.com",
      addressLine1: "456 Oak Avenue",
      city: "Portland",
      state: "OR",
      zip: "97205",
      primaryColor: "#C8102E",
      secondaryColor: "#1B3A4B",
      accentColor: "#F2A900",
      taxRate: 0.0875,
      serviceFee: 1.5,
      estimatedPrepTime: 25,
      businessHours: JSON.stringify({
        monday: { open: "11:00", close: "22:00" },
        tuesday: { open: "11:00", close: "22:00" },
        wednesday: { open: "11:00", close: "22:00" },
        thursday: { open: "11:00", close: "22:00" },
        friday: { open: "11:00", close: "23:00" },
        saturday: { open: "10:00", close: "23:00" },
        sunday: { open: "10:00", close: "21:00" },
      }),
    },
  });
  console.log("  Created restaurant:", goldenFork.name);

  // --- Appetizers ---
  const gfAppetizers = await prisma.menuCategory.create({
    data: {
      restaurantId: goldenFork.id,
      name: "Appetizers",
      description: "Start your meal right",
      sortOrder: 0,
    },
  });

  const gfAppItems = [
    {
      name: "Crispy Calamari",
      description:
        "Lightly battered calamari rings served with marinara and lemon aioli",
      price: 13.99,
      isPopular: true,
      isGlutenFree: false,
    },
    {
      name: "Bruschetta Trio",
      description:
        "Toasted ciabatta topped with tomato basil, roasted pepper, and olive tapenade",
      price: 11.99,
      isVegetarian: true,
    },
    {
      name: "Spinach Artichoke Dip",
      description:
        "Creamy blend of spinach, artichokes, and three cheeses with warm pita chips",
      price: 12.49,
      isVegetarian: true,
      isGlutenFree: true,
    },
    {
      name: "Chicken Wings",
      description:
        "Jumbo wings tossed in your choice of buffalo, BBQ, or garlic parmesan",
      price: 14.99,
      isPopular: true,
      isSpicy: true,
      isGlutenFree: true,
    },
    {
      name: "Soup of the Day",
      description: "Ask your server about today's chef-crafted soup",
      price: 7.99,
      isVegetarian: true,
    },
  ];

  for (let i = 0; i < gfAppItems.length; i++) {
    const item = await prisma.menuItem.create({
      data: {
        categoryId: gfAppetizers.id,
        sortOrder: i,
        ...gfAppItems[i],
      },
    });

    // Add modifier groups to wings
    if (gfAppItems[i].name === "Chicken Wings") {
      const sauceGroup = await prisma.modifierGroup.create({
        data: {
          menuItemId: item.id,
          name: "Sauce",
          required: true,
          minSelect: 1,
          maxSelect: 1,
        },
      });
      await prisma.modifier.createMany({
        data: [
          { modifierGroupId: sauceGroup.id, name: "Buffalo", sortOrder: 0, isDefault: true },
          { modifierGroupId: sauceGroup.id, name: "BBQ", sortOrder: 1 },
          { modifierGroupId: sauceGroup.id, name: "Garlic Parmesan", sortOrder: 2 },
          { modifierGroupId: sauceGroup.id, name: "Mango Habanero", sortOrder: 3, priceAdjustment: 1.0 },
        ],
      });
    }
  }

  // --- Mains ---
  const gfMains = await prisma.menuCategory.create({
    data: {
      restaurantId: goldenFork.id,
      name: "Main Courses",
      description: "Hearty entrees made fresh",
      sortOrder: 1,
    },
  });

  const gfMainItems = [
    {
      name: "Grilled Ribeye Steak",
      description:
        "12oz USDA Prime ribeye with roasted garlic butter, mashed potatoes, and seasonal vegetables",
      price: 34.99,
      isPopular: true,
      isGlutenFree: true,
      calories: 850,
    },
    {
      name: "Pan-Seared Salmon",
      description:
        "Atlantic salmon with lemon dill sauce, wild rice pilaf, and asparagus",
      price: 28.99,
      isGlutenFree: true,
      calories: 620,
    },
    {
      name: "Mushroom Risotto",
      description:
        "Creamy arborio rice with wild mushrooms, truffle oil, and shaved parmesan",
      price: 22.99,
      isVegetarian: true,
      isGlutenFree: true,
      calories: 580,
    },
    {
      name: "Classic Burger",
      description:
        "Half-pound Angus patty with aged cheddar, lettuce, tomato, and house-made pickles on a brioche bun",
      price: 18.99,
      isPopular: true,
      calories: 920,
    },
    {
      name: "Grilled Chicken Sandwich",
      description:
        "Herb-marinated chicken breast with avocado, bacon, and chipotle mayo",
      price: 16.99,
      calories: 680,
    },
  ];

  for (let i = 0; i < gfMainItems.length; i++) {
    const item = await prisma.menuItem.create({
      data: {
        categoryId: gfMains.id,
        sortOrder: i,
        ...gfMainItems[i],
      },
    });

    // Add modifiers to the steak
    if (gfMainItems[i].name === "Grilled Ribeye Steak") {
      const tempGroup = await prisma.modifierGroup.create({
        data: {
          menuItemId: item.id,
          name: "Temperature",
          required: true,
          minSelect: 1,
          maxSelect: 1,
        },
      });
      await prisma.modifier.createMany({
        data: [
          { modifierGroupId: tempGroup.id, name: "Rare", sortOrder: 0 },
          { modifierGroupId: tempGroup.id, name: "Medium Rare", sortOrder: 1, isDefault: true },
          { modifierGroupId: tempGroup.id, name: "Medium", sortOrder: 2 },
          { modifierGroupId: tempGroup.id, name: "Medium Well", sortOrder: 3 },
          { modifierGroupId: tempGroup.id, name: "Well Done", sortOrder: 4 },
        ],
      });

      const sideGroup = await prisma.modifierGroup.create({
        data: {
          menuItemId: item.id,
          name: "Extra Sides",
          required: false,
          minSelect: 0,
          maxSelect: 3,
          sortOrder: 1,
        },
      });
      await prisma.modifier.createMany({
        data: [
          { modifierGroupId: sideGroup.id, name: "Loaded Mashed Potatoes", priceAdjustment: 4.99, sortOrder: 0 },
          { modifierGroupId: sideGroup.id, name: "Grilled Asparagus", priceAdjustment: 3.99, sortOrder: 1 },
          { modifierGroupId: sideGroup.id, name: "Caesar Salad", priceAdjustment: 4.49, sortOrder: 2 },
        ],
      });
    }

    // Add modifiers to burger
    if (gfMainItems[i].name === "Classic Burger") {
      const extrasGroup = await prisma.modifierGroup.create({
        data: {
          menuItemId: item.id,
          name: "Add-ons",
          required: false,
          minSelect: 0,
          maxSelect: 5,
        },
      });
      await prisma.modifier.createMany({
        data: [
          { modifierGroupId: extrasGroup.id, name: "Extra Cheese", priceAdjustment: 1.5, sortOrder: 0 },
          { modifierGroupId: extrasGroup.id, name: "Bacon", priceAdjustment: 2.0, sortOrder: 1 },
          { modifierGroupId: extrasGroup.id, name: "Avocado", priceAdjustment: 2.5, sortOrder: 2 },
          { modifierGroupId: extrasGroup.id, name: "Fried Egg", priceAdjustment: 1.5, sortOrder: 3 },
          { modifierGroupId: extrasGroup.id, name: "Jalape\u00f1os", priceAdjustment: 1.0, sortOrder: 4 },
        ],
      });
    }
  }

  // --- Desserts ---
  const gfDesserts = await prisma.menuCategory.create({
    data: {
      restaurantId: goldenFork.id,
      name: "Desserts",
      description: "Sweet endings",
      sortOrder: 2,
    },
  });

  const gfDessertItems = [
    {
      name: "Chocolate Lava Cake",
      description:
        "Warm chocolate cake with a molten center, served with vanilla bean ice cream",
      price: 11.99,
      isPopular: true,
      isVegetarian: true,
    },
    {
      name: "New York Cheesecake",
      description:
        "Classic creamy cheesecake with graham cracker crust and berry compote",
      price: 10.99,
      isVegetarian: true,
    },
    {
      name: "Cr\u00e8me Br\u00fbl\u00e9e",
      description:
        "Classic French custard with caramelized sugar top and fresh berries",
      price: 9.99,
      isVegetarian: true,
      isGlutenFree: true,
    },
    {
      name: "Tiramisu",
      description:
        "Layers of espresso-soaked ladyfingers and mascarpone cream dusted with cocoa",
      price: 10.49,
      isVegetarian: true,
    },
  ];

  for (let i = 0; i < gfDessertItems.length; i++) {
    await prisma.menuItem.create({
      data: {
        categoryId: gfDesserts.id,
        sortOrder: i,
        ...gfDessertItems[i],
      },
    });
  }

  // --- Drinks ---
  const gfDrinks = await prisma.menuCategory.create({
    data: {
      restaurantId: goldenFork.id,
      name: "Drinks",
      description: "Refreshments and beverages",
      sortOrder: 3,
    },
  });

  const gfDrinkItems = [
    {
      name: "Fresh Lemonade",
      description: "House-made lemonade with fresh mint",
      price: 4.99,
      isVegan: true,
      isGlutenFree: true,
    },
    {
      name: "Iced Tea",
      description: "Freshly brewed black tea served over ice",
      price: 3.49,
      isVegan: true,
      isGlutenFree: true,
    },
    {
      name: "Craft Root Beer",
      description: "Small-batch artisan root beer",
      price: 4.49,
      isVegan: true,
      isGlutenFree: true,
    },
    {
      name: "Espresso",
      description: "Double shot of locally roasted espresso",
      price: 3.99,
      isVegan: true,
      isGlutenFree: true,
    },
  ];

  for (let i = 0; i < gfDrinkItems.length; i++) {
    const item = await prisma.menuItem.create({
      data: {
        categoryId: gfDrinks.id,
        sortOrder: i,
        ...gfDrinkItems[i],
      },
    });

    // Size modifier for lemonade
    if (gfDrinkItems[i].name === "Fresh Lemonade") {
      const sizeGroup = await prisma.modifierGroup.create({
        data: {
          menuItemId: item.id,
          name: "Size",
          required: true,
          minSelect: 1,
          maxSelect: 1,
        },
      });
      await prisma.modifier.createMany({
        data: [
          { modifierGroupId: sizeGroup.id, name: "Regular (16oz)", sortOrder: 0, isDefault: true },
          { modifierGroupId: sizeGroup.id, name: "Large (24oz)", priceAdjustment: 1.5, sortOrder: 1 },
        ],
      });
    }
  }

  // ============================================
  // RESTAURANT 2: Sakura Sushi
  // ============================================
  const sakuraSushi = await prisma.restaurant.create({
    data: {
      ownerId: owner.id,
      name: "Sakura Sushi",
      slug: "sakura-sushi",
      cuisine: "Japanese",
      description:
        "Authentic Japanese cuisine featuring the freshest sushi, sashimi, and traditional dishes.",
      phone: "(555) 345-6789",
      email: "info@sakurasushi.com",
      addressLine1: "789 Cherry Blossom Lane",
      city: "Portland",
      state: "OR",
      zip: "97209",
      primaryColor: "#DC2626",
      secondaryColor: "#1E293B",
      accentColor: "#FCD34D",
      taxRate: 0.0875,
      estimatedPrepTime: 20,
      businessHours: JSON.stringify({
        monday: { open: "11:30", close: "21:30" },
        tuesday: { open: "11:30", close: "21:30" },
        wednesday: { open: "11:30", close: "21:30" },
        thursday: { open: "11:30", close: "22:00" },
        friday: { open: "11:30", close: "22:30" },
        saturday: { open: "12:00", close: "22:30" },
        sunday: { open: "12:00", close: "21:00" },
      }),
    },
  });
  console.log("  Created restaurant:", sakuraSushi.name);

  // --- Sushi Rolls ---
  const ssRolls = await prisma.menuCategory.create({
    data: {
      restaurantId: sakuraSushi.id,
      name: "Sushi Rolls",
      description: "Fresh hand-rolled sushi",
      sortOrder: 0,
    },
  });

  const ssRollItems = [
    {
      name: "California Roll",
      description: "Crab, avocado, and cucumber with sesame seeds",
      price: 12.99,
      isPopular: true,
      isGlutenFree: true,
    },
    {
      name: "Spicy Tuna Roll",
      description: "Fresh tuna with spicy mayo, cucumber, and tempura flakes",
      price: 14.99,
      isPopular: true,
      isSpicy: true,
    },
    {
      name: "Dragon Roll",
      description:
        "Shrimp tempura inside, topped with avocado, eel, and unagi sauce",
      price: 17.99,
      isPopular: true,
    },
    {
      name: "Rainbow Roll",
      description:
        "California roll topped with assorted sashimi including tuna, salmon, and yellowtail",
      price: 18.99,
      isGlutenFree: true,
    },
    {
      name: "Veggie Roll",
      description:
        "Avocado, cucumber, asparagus, and pickled daikon",
      price: 10.99,
      isVegan: true,
      isVegetarian: true,
      isGlutenFree: true,
    },
  ];

  for (let i = 0; i < ssRollItems.length; i++) {
    const item = await prisma.menuItem.create({
      data: {
        categoryId: ssRolls.id,
        sortOrder: i,
        ...ssRollItems[i],
      },
    });

    // Add rice type modifier to all rolls
    const riceGroup = await prisma.modifierGroup.create({
      data: {
        menuItemId: item.id,
        name: "Rice Type",
        required: false,
        minSelect: 0,
        maxSelect: 1,
      },
    });
    await prisma.modifier.createMany({
      data: [
        { modifierGroupId: riceGroup.id, name: "White Rice", sortOrder: 0, isDefault: true },
        { modifierGroupId: riceGroup.id, name: "Brown Rice", priceAdjustment: 1.0, sortOrder: 1 },
      ],
    });
  }

  // --- Sashimi ---
  const ssSashimi = await prisma.menuCategory.create({
    data: {
      restaurantId: sakuraSushi.id,
      name: "Sashimi & Nigiri",
      description: "Premium sliced fish",
      sortOrder: 1,
    },
  });

  const ssSashimiItems = [
    {
      name: "Salmon Sashimi (5pc)",
      description: "Fresh Atlantic salmon, thinly sliced",
      price: 14.99,
      isGlutenFree: true,
    },
    {
      name: "Tuna Sashimi (5pc)",
      description: "Premium bluefin tuna",
      price: 16.99,
      isGlutenFree: true,
    },
    {
      name: "Nigiri Combo (8pc)",
      description:
        "Chef's selection of eight nigiri pieces: tuna, salmon, yellowtail, and shrimp",
      price: 22.99,
      isPopular: true,
      isGlutenFree: true,
    },
    {
      name: "Yellowtail Sashimi (5pc)",
      description: "Delicate hamachi, sliced to perfection",
      price: 15.99,
      isGlutenFree: true,
    },
  ];

  for (let i = 0; i < ssSashimiItems.length; i++) {
    await prisma.menuItem.create({
      data: {
        categoryId: ssSashimi.id,
        sortOrder: i,
        ...ssSashimiItems[i],
      },
    });
  }

  // --- Hot Dishes ---
  const ssHot = await prisma.menuCategory.create({
    data: {
      restaurantId: sakuraSushi.id,
      name: "Hot Dishes",
      description: "Traditional cooked Japanese dishes",
      sortOrder: 2,
    },
  });

  const ssHotItems = [
    {
      name: "Chicken Teriyaki",
      description:
        "Grilled chicken thigh with house-made teriyaki glaze, steamed rice, and vegetables",
      price: 16.99,
    },
    {
      name: "Tempura Udon",
      description:
        "Thick wheat noodles in dashi broth with shrimp and vegetable tempura",
      price: 15.99,
    },
    {
      name: "Beef Ramen",
      description:
        "Rich tonkotsu broth with sliced beef, soft egg, nori, and scallions",
      price: 17.99,
      isPopular: true,
    },
    {
      name: "Vegetable Gyoza (8pc)",
      description:
        "Pan-fried dumplings filled with cabbage, mushroom, and ginger",
      price: 9.99,
      isVegetarian: true,
      isVegan: true,
    },
  ];

  for (let i = 0; i < ssHotItems.length; i++) {
    await prisma.menuItem.create({
      data: {
        categoryId: ssHot.id,
        sortOrder: i,
        ...ssHotItems[i],
      },
    });
  }

  // --- Drinks ---
  const ssDrinks = await prisma.menuCategory.create({
    data: {
      restaurantId: sakuraSushi.id,
      name: "Drinks",
      description: "Japanese beverages",
      sortOrder: 3,
    },
  });

  const ssDrinkItems = [
    {
      name: "Green Tea",
      description: "Traditional Japanese sencha",
      price: 3.49,
      isVegan: true,
      isGlutenFree: true,
    },
    {
      name: "Ramune Soda",
      description: "Classic Japanese marble soda, assorted flavors",
      price: 4.49,
      isVegan: true,
    },
    {
      name: "Miso Soup",
      description: "Silken tofu, wakame seaweed, and scallions in dashi broth",
      price: 3.99,
      isVegetarian: true,
      isGlutenFree: true,
    },
    {
      name: "Matcha Latte",
      description: "Ceremonial-grade matcha whisked with steamed milk",
      price: 5.99,
      isVegetarian: true,
      isGlutenFree: true,
    },
  ];

  for (let i = 0; i < ssDrinkItems.length; i++) {
    await prisma.menuItem.create({
      data: {
        categoryId: ssDrinks.id,
        sortOrder: i,
        ...ssDrinkItems[i],
      },
    });
  }

  // ============================================
  // PROMOTIONS
  // ============================================
  await prisma.promotion.create({
    data: {
      restaurantId: goldenFork.id,
      code: "WELCOME10",
      description: "10% off your first order",
      discountType: "percentage",
      discountValue: 10,
      minOrder: 15.0,
      maxUses: 1000,
      startsAt: new Date(),
      expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    },
  });

  await prisma.promotion.create({
    data: {
      restaurantId: sakuraSushi.id,
      code: "SUSHI5",
      description: "$5 off orders over $30",
      discountType: "fixed",
      discountValue: 5,
      minOrder: 30.0,
      maxUses: 500,
      startsAt: new Date(),
      expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    },
  });

  // ============================================
  // DEMO ORDERS (15+ across different statuses)
  // ============================================
  const gfMenuItems = await prisma.menuItem.findMany({
    where: { category: { restaurantId: goldenFork.id } },
  });
  const ssMenuItems = await prisma.menuItem.findMany({
    where: { category: { restaurantId: sakuraSushi.id } },
  });

  const orderStatuses = [
    "pending",
    "confirmed",
    "preparing",
    "ready",
    "completed",
    "completed",
    "completed",
    "completed",
    "completed",
    "delivered",
    "delivered",
    "delivered",
    "cancelled",
    "completed",
    "completed",
    "preparing",
    "confirmed",
  ];

  const orderTypes = ["pickup", "delivery", "dine_in"];

  for (let i = 0; i < orderStatuses.length; i++) {
    const isGoldenFork = i % 2 === 0;
    const restaurant = isGoldenFork ? goldenFork : sakuraSushi;
    const items = isGoldenFork ? gfMenuItems : ssMenuItems;
    const status = orderStatuses[i];

    // Pick 1-3 random items
    const numItems = Math.floor(Math.random() * 3) + 1;
    const selectedItems: typeof items = [];
    for (let j = 0; j < numItems; j++) {
      const randomItem = items[Math.floor(Math.random() * items.length)];
      selectedItems.push(randomItem);
    }

    const orderItems = selectedItems.map((item) => {
      const qty = Math.floor(Math.random() * 3) + 1;
      return {
        menuItemId: item.id,
        quantity: qty,
        unitPrice: item.price,
        totalPrice: item.price * qty,
      };
    });

    const subtotal = orderItems.reduce((sum, oi) => sum + oi.totalPrice, 0);
    const taxAmount = subtotal * restaurant.taxRate;
    const tipAmount = Math.round(subtotal * (0.15 + Math.random() * 0.1) * 100) / 100;
    const total = subtotal + taxAmount + restaurant.serviceFee + tipAmount;

    // Vary dates: spread orders over the last 30 days
    const daysAgo = Math.floor(Math.random() * 30);
    const hoursAgo = Math.floor(Math.random() * 24);
    const createdAt = new Date(
      Date.now() - daysAgo * 24 * 60 * 60 * 1000 - hoursAgo * 60 * 60 * 1000
    );
    const completedAt =
      status === "completed" || status === "delivered"
        ? new Date(createdAt.getTime() + restaurant.estimatedPrepTime * 60 * 1000)
        : null;

    await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        restaurantId: restaurant.id,
        customerId: customer.id,
        status,
        orderType: orderTypes[i % orderTypes.length],
        subtotal: Math.round(subtotal * 100) / 100,
        taxAmount: Math.round(taxAmount * 100) / 100,
        serviceFee: restaurant.serviceFee,
        tipAmount,
        total: Math.round(total * 100) / 100,
        paymentMethod: "card",
        paymentStatus:
          status === "cancelled" ? "refunded" : status === "pending" ? "pending" : "paid",
        customerName: customer.name,
        customerEmail: customer.email,
        customerPhone: customer.phone,
        createdAt,
        completedAt,
        items: {
          create: orderItems,
        },
      },
    });
  }
  console.log(`  Created ${orderStatuses.length} demo orders`);

  // ============================================
  // REVIEWS
  // ============================================
  await prisma.review.createMany({
    data: [
      {
        restaurantId: goldenFork.id,
        userId: customer.id,
        rating: 5,
        comment: "Incredible steak! Perfectly cooked every time. The service is outstanding.",
      },
      {
        restaurantId: goldenFork.id,
        userId: customer.id,
        rating: 4,
        comment: "Great food, love the calamari. Delivery was a bit slow though.",
      },
      {
        restaurantId: sakuraSushi.id,
        userId: customer.id,
        rating: 5,
        comment: "Best sushi in Portland! The dragon roll is a must-try.",
      },
      {
        restaurantId: sakuraSushi.id,
        userId: customer.id,
        rating: 4,
        comment: "Fresh fish and generous portions. Will definitely order again.",
      },
    ],
  });
  console.log("  Created demo reviews");

  // ============================================
  // PLATFORM SETTINGS
  // ============================================
  await prisma.platformSettings.create({
    data: {
      id: "default",
      platformName: "Fed",
      platformFeePercent: 2.5,
      supportEmail: "support@getfed.com",
    },
  });
  console.log("  Created platform settings");

  console.log("\nSeed completed successfully!");
  console.log("\nDemo accounts:");
  console.log("  Admin:    admin@getfed.com / admin123");
  console.log("  Owner:    owner@getfed.com / owner123");
  console.log("  Customer: customer@getfed.com / customer123");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
