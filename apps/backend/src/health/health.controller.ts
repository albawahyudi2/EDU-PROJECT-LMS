import { Controller, Get } from '@nestjs/common';

/**
 * REST HTTP health check endpoint.
 * Used by Railway (and Docker HEALTHCHECK) to verify the service is alive.
 * GraphQL-only healthcheck is NOT sufficient because Railway pings via HTTP GET.
 */
@Controller('health')
export class HealthController {
  @Get()
  check() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'unknown',
    };
  }
}
