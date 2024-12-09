import * as chai from 'chai';
import request from 'supertest';
import chaiHttp from 'chai-http';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

chai.use(chaiHttp);
const { expect } = chai;

let app;
before(async () => {
  const module = await import('../index.js'); // Adjust the path to your actual app import
  app = module.default;
});

describe('Key-Value Store API', () => {
  // Test: Create a key-value pair
  it('should create a key-value pair', async () => {
    const res = await request(app)
      .post('/api')
      .send({ key: 'testKey', value: 'testValue' });
    console.log(res.status)
    expect(res).to.have.status(200);
    expect(res.body.message).to.equal('Key-value pair added successfully');
  });

  // Test: Retrieve the value for a key
  it('should retrieve a value', async () => {
    // Ensure the key-value pair exists
    await request(app)
      .get('/api/')
      .send({ key: 'testKey', value: 'testValue' });

    const res = await request(app)
      .get('/api/testKey');

    expect(res).to.have.status(200);
    expect(res.body.value).to.equal('testValue');
  });

  // Test: Delete the key-value pair
  it('should delete a key-value pair', async () => {
    // Ensure the key-value pair exists
    await request(app)
      .post('/api/')
      .send({ key: 'testKey', value: 'testValue' });

    const res = await request(app)
      .delete('/api/testKey');

    expect(res).to.have.status(200);
    expect(res.body.message).to.equal('Key-value pair deleted successfully');
  });
});
