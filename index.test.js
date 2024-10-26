// server.test.js
import request  from "supertest";

describe('GET /api', () => {
  it('should respond with a json message', async () => {
    const response = await request(app).get('/api');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Hello, World!' });
  });
});
