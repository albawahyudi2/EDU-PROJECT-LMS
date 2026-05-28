import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

/**
 * REST HTTP health check endpoint.
 * Used by Railway (and Docker HEALTHCHECK) to verify the service is alive.
 * GraphQL-only healthcheck is NOT sufficient because Railway pings via HTTP GET.
 */
@Controller('health')
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async check() {
    let debugInfo: any = null;
    try {
      const assignments = await this.prisma.assignment.findMany({
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: {
          taskSteps: true,
        },
      });
      debugInfo = assignments.map(a => ({
        id: a.id,
        title: a.title,
        type: a.type,
        taskSteps: a.taskSteps.map(s => ({
          id: s.id,
          stepNumber: s.stepNumber,
          instruction: s.instruction,
          referenceImage: s.referenceImage,
        })),
      }));
    } catch (err: any) {
      debugInfo = { error: err.message };
    }

    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'unknown',
      debugInfo,
    };
  }
}
