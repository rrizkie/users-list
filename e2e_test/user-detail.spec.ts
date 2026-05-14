import { test, expect, type Page } from '@playwright/test';

const JSON_PLACEHOLDER = 'https://jsonplaceholder.typicode.com';

const mockUser = {
    id: 1,
    name: 'E2E User',
    username: 'e2e_user',
    email: 'e2e@example.test',
    address: {
        street: '123 Mock Street',
        suite: 'Suite 100',
        city: 'Testville',
        zipcode: '12345',
        geo: { lat: '0', lng: '0' },
    },
    phone: '555-0100',
    website: 'e2e.example',
    company: {
        name: 'E2E Corp',
        catchPhrase: 'Mock catch phrase',
        bs: 'e2e-bs',
    },
};

const mockPosts = [
    {
        userId: 1,
        id: 101,
        title: 'First post',
        body: 'First post body for e2e.',
        completed: false,
    },
    {
        userId: 1,
        id: 102,
        title: 'Second post',
        body: 'Second post body for e2e.',
        completed: false,
    },
    { userId: 2, id: 201, title: 'Other user', body: 'Should not appear.', completed: false },
];

const mockTodos = [
    { userId: 1, id: 1, title: 'Open todo for e2e', completed: false },
    { userId: 1, id: 2, title: 'Done todo for e2e', completed: true },
    { userId: 2, id: 3, title: 'Someone else', completed: false },
];

async function mockJsonPlaceholder(page: Page) {
    await page.route(`${JSON_PLACEHOLDER}/users/1`, async (route) => {
        if (route.request().method() !== 'GET') {
            await route.continue();
            return;
        }
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(mockUser),
        });
    });

    await page.route(`${JSON_PLACEHOLDER}/todos`, async (route) => {
        if (route.request().method() !== 'GET') {
            await route.continue();
            return;
        }
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(mockTodos),
        });
    });

    await page.route(`${JSON_PLACEHOLDER}/posts`, async (route) => {
        if (route.request().method() !== 'GET') {
            await route.continue();
            return;
        }
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(mockPosts),
        });
    });
}

test('user detail', async ({ page }) => {
    await mockJsonPlaceholder(page);

    await page.goto('http://localhost:3000/users/1');

    await expect(page.getByText('← Back To List')).toBeVisible();

    await expect(page.getByText('Name', { exact: true })).toBeVisible();
    await expect(page.getByText('E2E User')).toBeVisible();

    await expect(page.getByText('Username')).toBeVisible();
    await expect(page.getByText('e2e_user')).toBeVisible();

    await expect(page.getByText('Email')).toBeVisible();
    await expect(page.getByText('e2e@example.test')).toBeVisible();

    await expect(page.getByText('Phone')).toBeVisible();
    await expect(page.getByText('555-0100')).toBeVisible();

    await expect(page.getByText('Website')).toBeVisible();
    await expect(page.getByText('e2e.example')).toBeVisible();

    await expect(page.getByText('Company')).toBeVisible();
    await expect(page.getByText('E2E Corp (Mock catch phrase)')).toBeVisible();

    await expect(page.getByText('Address')).toBeVisible();
    await expect(
        page.getByText('123 Mock Street Suite 100, Testville, 12345'),
    ).toBeVisible();

    await expect(page.getByText('Total Posts (2)')).toBeVisible();
    await expect(page.getByText('First post body for e2e.')).toBeVisible();
    await expect(page.getByText('Second post body for e2e.')).toBeVisible();

    await expect(page.getByText('Pending Todos (1)')).toBeVisible();
    await expect(page.getByText('☐ Open todo for e2e')).toBeVisible();

    await expect(page.getByText('Completed Todos (1)')).toBeVisible();
    await expect(page.getByText('☑ Done todo for e2e')).toBeVisible();

    await expect(page.getByText('Should not appear.')).toHaveCount(0);
    await expect(page.getByText('Someone else')).toHaveCount(0);
});
