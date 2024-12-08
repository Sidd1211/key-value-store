const chai = require('chai');
const chaiHttp = require('chai-http');
const { expect } = chai;
const app = require('../index'); // Replace with your actual app import

chai.use(chaiHttp);

describe('Key-Value Store API', () => {
  // Test: Create a key-value pair
  it('should create a key-value pair', async () => {
    const res = await chai.request(app)
      .post('/api/kv')
      .send({ key: 'testKey', value: 'testValue' });

    expect(res).to.have.status(200);
    expect(res.body.message).to.equal('Key set successfully'); // Adjust to your API response
  });

  // Test: Retrieve the value for a key
  it('should retrieve a value', async () => {
    // Ensure the key-value pair exists
    await chai.request(app)
      .post('/api/kv')
      .send({ key: 'testKey', value: 'testValue' });

    const res = await chai.request(app)
      .get('/api/kv/testKey');

    expect(res).to.have.status(200);
    expect(res.body.value).to.equal('testValue');
  });

  // Test: Delete the key-value pair
  it('should delete a key-value pair', async () => {
    // Ensure the key-value pair exists
    await chai.request(app)
      .post('/api/kv')
      .send({ key: 'testKey', value: 'testValue' });

    const res = await chai.request(app)
      .delete('/api/kv/testKey');

    expect(res).to.have.status(200);
    expect(res.body.message).to.equal('Key deleted successfully'); // Adjust to your API response
  });
});
