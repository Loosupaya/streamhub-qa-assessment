const { When, Then } = require('@cucumber/cucumber');
const { request, expect } = require('@playwright/test');
const { apiBaseUrl } = require('../../config/env');

async function submitPost(world, payload) {
  const api = await request.newContext();

  try {
    const response = await api.post(`${apiBaseUrl}/posts`, {
      data: payload
    });

    world.apiStatus = response.status();
    world.apiBody = await response.json();

    console.log('\nAPI POST /posts');
    console.log('Status:', world.apiStatus);
    console.log('Response summary:', JSON.stringify({
  userId: world.apiBody.userId ?? null,
  titleLength: world.apiBody.title?.length,
  titlePreview: world.apiBody.title?.slice(0, 80),
  id: world.apiBody.id
}));
  } finally {
    await api.dispose();
  }
}

When('I submit a valid post to the API', async function () {
  await submitPost(this, {
    userId: 1,
    title: 'Streamhub API test',
    body: 'Testing a valid post'
  });
});

When('I submit a post without a user ID', async function () {
  await submitPost(this, {
    title: 'Missing user ID',
    body: 'Testing a missing field'
  });
});

When('I submit a post with an excessively long title', async function () {
  await submitPost(this, {
    userId: 1,
    title: 'A'.repeat(10000),
    body: 'Testing a long title'
  });
});

When('I submit a post with special characters', async function () {
  await submitPost(this, {
    userId: 1,
    title: 'Test @#$%^&*() தமிழ் 🚀',
    body: 'Testing special characters'
  });
});

Then('the API should return a successful creation response', async function () {
  expect(this.apiStatus).toBe(201);
  expect(this.apiBody).toHaveProperty('id');
  expect(this.apiBody.title).toBe('Streamhub API test');
});

Then('I should record the API response for the missing user ID', async function () {
  expect(this.apiStatus).toBeGreaterThanOrEqual(200);
  expect(this.apiStatus).toBeLessThan(300);
  console.log('Missing user ID outcome recorded:', this.apiStatus);
});

Then('I should record the API response for the long title', async function () {
  expect(this.apiStatus).toBeGreaterThanOrEqual(200);
  expect(this.apiStatus).toBeLessThan(300);
  console.log('Long title outcome recorded:', this.apiStatus);
});

Then('the API should return a response for the special characters', async function () {
  expect(this.apiStatus).toBeGreaterThanOrEqual(200);
  expect(this.apiStatus).toBeLessThan(300);
  expect(this.apiBody.title).toContain('தமிழ்');
  console.log('Special characters outcome recorded:', this.apiStatus);
});