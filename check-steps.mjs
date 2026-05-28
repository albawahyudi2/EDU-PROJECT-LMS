import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();
const steps = await p.taskStep.findMany({
  orderBy: { createdAt: 'desc' },
  take: 50
});
console.log('All steps:', JSON.stringify(steps.map(s => ({
  id: s.id,
  instruction: s.instruction,
  referenceImage: s.referenceImage,
  assignmentId: s.assignmentId,
})), null, 2));

const assignments = await p.assignment.findMany({
  orderBy: { createdAt: 'desc' },
  take: 10
});
console.log('Assignments:', JSON.stringify(assignments.map(a => ({
  id: a.id,
  title: a.title,
  type: a.type
})), null, 2));

await p.$disconnect();
