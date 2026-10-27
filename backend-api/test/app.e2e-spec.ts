import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types.js';
import { afterEach, vi } from 'vitest';
import { AppModule } from './../src/app.module.js';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
    );
    await app.init();
  });

  it('/health (GET)', () => {
    return request(app.getHttpServer())
      .get('/health')
      .expect(200)
      .expect(({ body }) => {
        expect(body.status).toBe('ok');
        expect(body.service).toBe('Superhero HQ Submission API');
        expect(new Date(body.timestamp).toISOString()).toBe(body.timestamp);
      });
  });

  it('rejects invalid contact inquiries before forwarding them', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    await request(app.getHttpServer())
      .post('/contact-inquiries')
      .send({ name: '', email: 'not-an-email', subject: '', message: '' })
      .expect(400);

    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('forwards a valid contact inquiry to the protected Payload route', async () => {
    const fetchMock = vi.fn(async () => new Response(null, { status: 201 }));
    vi.stubGlobal('fetch', fetchMock);

    await request(app.getHttpServer())
      .post('/contact-inquiries')
      .send({
        name: 'Test User',
        email: 'TEST@example.com',
        phone: '555-0100',
        subject: 'Project inquiry',
        message: 'Please contact me about a project.',
      })
      .expect(201)
      .expect(({ body }) => {
        expect(body.message).toContain('received successfully');
      });

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/contact-inquiries'),
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({ 'x-internal-api-secret': expect.any(String) }),
      }),
    );
  });

  it('requires explicit newsletter consent', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    await request(app.getHttpServer())
      .post('/newsletter-subscriptions')
      .send({ email: 'reader@example.com', consent: false })
      .expect(400);

    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('forwards a valid consultation request using Payload field values', async () => {
    const fetchMock = vi.fn(async () => new Response(null, { status: 201 }));
    vi.stubGlobal('fetch', fetchMock);

    await request(app.getHttpServer())
      .post('/consultation-requests')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        phone: '555-0101',
        consultationType: 'general',
        preferredDate: '2026-10-25',
        preferredTime: 'morning',
        message: 'Discuss a project.',
      })
      .expect(201);

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/consultation-requests'),
      expect.any(Object),
    );
  });

  it('forwards newsletter signups only with explicit consent', async () => {
    const fetchMock = vi.fn(async () => new Response(null, { status: 201 }));
    vi.stubGlobal('fetch', fetchMock);

    await request(app.getHttpServer())
      .post('/newsletter-subscriptions')
      .send({ email: 'reader@example.com', consent: true })
      .expect(201);

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/newsletter-subscriptions'),
      expect.objectContaining({ method: 'POST' }),
    );
  });

  afterEach(async () => {
    vi.unstubAllGlobals();
    await app.close();
  });
});
