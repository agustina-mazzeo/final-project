import { hash } from 'bcrypt';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const rates = [
  {
    name: 'USD',
    USD_FROM: 1,
    USD_TO: 1,
  },
  {
    name: 'EUR',
    USD_FROM: 1 / 0.91021,
    USD_TO: 0.91021,
  },
  {
    name: 'UYU',
    USD_FROM: 1 / 38.967787,
    USD_TO: 38.967787,
  },
];

(async () => {
  await prisma.rate.createMany({
    data: rates,
  });
  await prisma.user.create({
    data: {
      email: 'testing@decemberlabs.com',
      password: await hash('decemberlabs', 10),
      accounts: {
        create: [
          { currency: 'USD', balance: 100 },
          { currency: 'EUR', balance: 100 },
          { currency: 'UYU', balance: 100 },
        ],
      },
    },
  });
})();

console.log('Seeding complete.');
