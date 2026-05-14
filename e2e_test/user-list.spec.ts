import { test, expect, type Page } from '@playwright/test';

const JSON_PLACEHOLDER = 'https://jsonplaceholder.typicode.com';

const baseUserFields = {
    address: {
        street: '1 List St',
        suite: 'A',
        city: 'Listville',
        zipcode: '00000',
        geo: { lat: '0', lng: '0' },
    },
    phone: '555-0000',
    company: {
        name: 'List Co',
        catchPhrase: 'List phrase',
        bs: 'list-bs',
    },
};

const mockUsers = [
    {
        id: 1,
        name: 'List User Alpha',
        username: 'alpha',
        email: 'alpha@e2e-list.test',
        website: 'alpha-list.e2e',
        ...baseUserFields,
    },
    {
        id: 2,
        name: 'List User Beta',
        username: 'beta',
        email: 'beta@e2e-list.test',
        website: 'beta-list.e2e',
        ...baseUserFields,
    },
];

const mockPosts = [
    { userId: 1, id: 101, title: 'P1', body: 'b1', completed: false },
    { userId: 1, id: 102, title: 'P2', body: 'b2', completed: false },
    { userId: 2, id: 201, title: 'P3', body: 'b3', completed: false },
];

const mockTodos = [
    { userId: 1, id: 1, title: 'A done', completed: true },
    { userId: 1, id: 2, title: 'A open', completed: false },
    { userId: 2, id: 3, title: 'B open 1', completed: false },
    { userId: 2, id: 4, title: 'B open 2', completed: false },
];

async function mockJsonPlaceholder(page: Page) {
    await page.route(`${JSON_PLACEHOLDER}/users`, async (route) => {
        if (route.request().method() !== 'GET') {
            await route.continue();
            return;
        }
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(mockUsers),
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

test.beforeEach(async ({ page }) => {
    await mockJsonPlaceholder(page);
});

test('user list', async ({ page }) => {
    await page.goto('http://localhost:3000/users');

    await expect(page.getByRole('heading', { name: 'Users' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Search by name or email' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Name ↑↓' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Email ↑↓' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Website ↑↓' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Total Post ↑↓' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Completed Todos ↑↓' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Pending Todos ↑↓' })).toBeVisible();

    const alphaRow = page.locator('tr').filter({
        has: page.getByRole('cell', { name: 'List User Alpha' }),
    });
    await expect(alphaRow.getByRole('cell', { name: 'alpha@e2e-list.test' })).toBeVisible();
    await expect(alphaRow.getByRole('cell', { name: 'alpha-list.e2e' })).toBeVisible();
    await expect(alphaRow.getByRole('cell', { name: '2', exact: true })).toBeVisible();
    await expect(alphaRow.getByRole('cell', { name: '1', exact: true })).toHaveCount(2);

    const betaRow = page.locator('tr').filter({
        has: page.getByRole('cell', { name: 'List User Beta' }),
    });
    await expect(betaRow.getByRole('cell', { name: 'beta@e2e-list.test' })).toBeVisible();
    await expect(betaRow.getByRole('cell', { name: 'beta-list.e2e' })).toBeVisible();
    await expect(betaRow.getByRole('cell', { name: '1', exact: true })).toBeVisible();
    await expect(betaRow.getByRole('cell', { name: '0', exact: true })).toBeVisible();
    await expect(betaRow.getByRole('cell', { name: '2', exact: true })).toBeVisible();
});

test('redirect to user detail when click row', async ({ page }) => {
    await page.goto('http://localhost:3000/users');
    await page.getByRole('cell', { name: 'List User Alpha' }).click();
    await expect(page).toHaveURL('http://localhost:3000/users/1');
});
