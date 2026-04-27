import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import dayjs from 'dayjs';

const prisma = new PrismaClient();

/* -------------------- CONSTANTS -------------------- */

const REGIONS = ['North', 'South', 'East', 'West'];
const VEHICLE_CATEGORIES = ['SUV', 'Sedan', 'Truck', 'Hatchback'];
const PART_CATEGORIES = ['Engine', 'Brake', 'Electrical', 'Body'];

/* -------------------- HELPERS -------------------- */

// Skewed towards recent dates (growth simulation)
const randomDate = () => {
  const daysAgo = Math.floor(Math.pow(Math.random(), 2) * 365);
  return dayjs().subtract(daysAgo, 'day').toDate();
};

// Supplier weighting (few suppliers dominate)
const pickWeighted = (arr) => {
  return arr[Math.floor(Math.pow(Math.random(), 2) * arr.length)];
};

// Order status distribution
const weightedOrderStatus = () => {
  const r = Math.random();
  if (r < 0.05) return 'CANCELLED';
  if (r < 0.15) return 'PENDING';
  if (r < 0.35) return 'CONFIRMED';
  if (r < 0.65) return 'SHIPPED';
  return 'DELIVERED';
};

// Delay logic (based on product type)
const isDelayedShipment = (hasParts) => {
  return hasParts
    ? Math.random() < 0.25
    : Math.random() < 0.1;
};

/* -------------------- MAIN -------------------- */

async function main() {
  console.log('🌱 Seeding started...');

  /* -------------------- SUPPLIERS -------------------- */

  const suppliersData = Array.from({ length: 50 }).map(() => ({
    name: faker.company.name(),
    email: faker.internet.email(),
    region: faker.helpers.arrayElement(REGIONS),
    createdAt: randomDate(),
  }));

  await prisma.supplier.createMany({ data: suppliersData });
  const suppliers = await prisma.supplier.findMany();

  /* -------------------- PRODUCTS -------------------- */

  const productsData = [];

  // Vehicles
  for (let i = 0; i < 30; i++) {
    productsData.push({
      name: `${faker.vehicle.manufacturer()} ${faker.vehicle.model()}`,
      type: 'VEHICLE',
      category: faker.helpers.arrayElement(VEHICLE_CATEGORIES),
      price: faker.number.int({ min: 800000, max: 2500000 }),
      createdAt: randomDate(),
    });
  }

  // Parts
  for (let i = 0; i < 150; i++) {
    productsData.push({
      name: faker.commerce.productName(),
      type: 'PART',
      category: faker.helpers.arrayElement(PART_CATEGORIES),
      price: faker.number.int({ min: 500, max: 50000 }),
      createdAt: randomDate(),
    });
  }

  await prisma.product.createMany({ data: productsData });
  const products = await prisma.product.findMany();

  /* -------------------- INVENTORY -------------------- */

  for (const product of products) {
    await prisma.inventory.create({
      data: {
        productId: product.id,
        availableQty: faker.number.int({ min: 500, max: 2000 }),
        reservedQty: 0,
      },
    });
  }

  /* -------------------- ORDERS + ITEMS + SHIPMENTS -------------------- */

  const orders = [];

  for (let i = 0; i < 8000; i++) {
    const supplier = pickWeighted(suppliers);
    const createdAt = randomDate();
    const status = weightedOrderStatus();

    const itemsCount = faker.number.int({ min: 1, max: 5 });

    let totalAmount = 0;
    let hasParts = false;

    const itemsData = [];

    for (let j = 0; j < itemsCount; j++) {
      const product = faker.helpers.arrayElement(products);

      if (product.type === 'PART') hasParts = true;

      const quantity =
        product.type === 'VEHICLE'
          ? faker.number.int({ min: 1, max: 3 })
          : faker.number.int({ min: 5, max: 100 });

      totalAmount += product.price * quantity;

      // Inventory update (REALISTIC)
      const inventory = await prisma.inventory.findUnique({
        where: { productId: product.id},
      });
      if(inventory.availableQty < quantity) {
        //skip this item or reduce quantity
        continue
      }

      await prisma.inventory.update({
        where: { productId: product.id },
        data: {
          availableQty: { decrement: quantity },
          reservedQty: { increment: quantity },
        },
      });

      itemsData.push({
        productId: product.id,
        quantity,
        price: product.price,
      });
    }

    const order = await prisma.order.create({
      data: {
        supplierId: supplier.id,
        status,
        totalAmount,
        createdAt,
        items: {
          create: itemsData,
        },
      },
    });

    orders.push(order);

    /* -------------------- SHIPMENT -------------------- */

    if (status === 'SHIPPED' || status === 'DELIVERED') {
      const shippedAt = dayjs(createdAt).add(
        faker.number.int({ min: 1, max: 4 }),
        'day'
      );

      const expectedDelivery = shippedAt.add(
        faker.number.int({ min: 3, max: 10 }),
        'day'
      );

      const delayed = isDelayedShipment(hasParts);

      let deliveredAt = null;
      let shipmentStatus = 'IN_TRANSIT';

      if (status === 'DELIVERED') {
        shipmentStatus = delayed ? 'DELAYED' : 'DELIVERED';

        deliveredAt = expectedDelivery.add(
          delayed
            ? faker.number.int({ min: 2, max: 7 })
            : faker.number.int({ min: -1, max: 2 }),
          'day'
        );
      }

      await prisma.shipment.create({
        data: {
          orderId: order.id,
          status: shipmentStatus,
          shippedAt: shippedAt.toDate(),
          expectedDelivery: expectedDelivery.toDate(),
          deliveredAt: deliveredAt ? deliveredAt.toDate() : null,
        },
      });
    }
  }

  /* -------------------- SERVICE REQUESTS -------------------- */

  const allShipments = await prisma.shipment.findMany({
    include: { order: true },
  });

  for (const shipment of allShipments) {
    const order = shipment.order;

    // Delay-based complaints
    if (shipment.status === 'DELAYED' && Math.random() < 0.6) {
      await prisma.serviceRequest.create({
        data: {
          supplierId: order.supplierId,
          orderId: order.id,
          type: 'DELAY',
          status: 'RESOLVED',
          createdAt: dayjs(shipment.expectedDelivery)
            .add(1, 'day')
            .toDate(),
          resolvedAt: dayjs(shipment.expectedDelivery)
            .add(faker.number.int({ min: 2, max: 5 }), 'day')
            .toDate(),
        },
      });
    }

    // Random damage complaints (less frequent)
    if (Math.random() < 0.08) {
      await prisma.serviceRequest.create({
        data: {
          supplierId: order.supplierId,
          orderId: order.id,
          type: 'DAMAGED_PART',
          status: 'CLOSED',
          createdAt: dayjs(shipment.deliveredAt || new Date())
            .add(1, 'day')
            .toDate(),
          resolvedAt: dayjs(shipment.deliveredAt || new Date())
            .add(faker.number.int({ min: 2, max: 6 }), 'day')
            .toDate(),
        },
      });
    }
  }

  console.log('✅ Seeding completed!');
}

/* -------------------- RUN -------------------- */

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });