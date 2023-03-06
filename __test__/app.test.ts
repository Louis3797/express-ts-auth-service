import app from '../src/app';
import request from 'supertest';

describe('Test the root path', () => {
  test('It should response the GET method', () => {
    return request(app).get('/').expect(200);
  });
});
