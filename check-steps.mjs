import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();
const steps = await p.taskStep.findMany({ orderBy: { createdAt: 'desc' }, take: 10 });
console.log(JSON.stringify(steps, null, 2));
await p.$disconnect();
