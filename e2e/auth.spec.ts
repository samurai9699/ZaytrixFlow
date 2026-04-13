import { test, expect } from '@playwright/test';

/**
 * Authentication E2E Tests
 * Ensures that test data is isolated by generating unique credentials.
 * Assumes Supabase local/dev environment does not require email confirmation 
 * or that the testing database handles these gracefully.
 */

test.describe('Authentication Flow', () => {
  const randomString = Math.random().toString(36).substring(2, 8);
  const testEmail = `test_user_${randomString}@example.com`;
  const testPassword = 'TestPassword123!';

  test.describe.configure({ retries: 2 }); // Explicit retries for stability

  test('should display login fields correctly', async ({ page }) => {
    await page.goto('/login');
    
    // Use data-testid for stable locators
    await expect(page.getByTestId('email-input')).toBeVisible();
    await expect(page.getByTestId('password-input')).toBeVisible();
    await expect(page.getByTestId('login-submit')).toBeVisible();
  });

  test('should handle validation errors for empty fields', async ({ page }) => {
    await page.goto('/login');
    await page.getByTestId('login-submit').click();
    
    // Form validation should kick in before network req
    await expect(page.getByText('Invalid email address')).toBeVisible();
    await expect(page.getByText('Password must be at least')).toBeVisible();
  });

  test('should display toast error on invalid credentials', async ({ page }) => {
    await page.goto('/login');
    
    await page.getByTestId('email-input').fill('non_existent_123@example.com');
    await page.getByTestId('password-input').fill('wrongpassword!!!');
    
    await page.getByTestId('login-submit').click();

    // Verify sonner toast is displayed
    const toast = page.locator('[data-sonner-toast]');
    await expect(toast).toBeVisible({ timeout: 10000 });
  });

  // Note: Registration/Login success tests omitted to prevent
  // cluttering of DB if email confirmation is required.
  // In a fully configured test environment, we would seed a known test account
  // via Supabase Admin API and log in utilizing that seed data.
});
