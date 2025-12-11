// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * Saucedemo Login Tests
 * Testing various login scenarios on https://www.saucedemo.com
 */

test.describe('Saucedemo Login', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navigate to the login page before each test
    await page.goto('/');
  });

  test('should login successfully with valid credentials @chromium @smoke', async ({ page }) => {
    // Fill in login credentials
    await page.fill('[data-test="username"]', process.env.SAUCEDEMO_USERNAME || 'standard_user');
    await page.fill('[data-test="password"]', process.env.SAUCEDEMO_PASSWORD || 'secret_sauce');
    
    // Click login button
    await page.click('[data-test="login-button"]');
    
    // Verify successful login by checking the inventory page
    await expect(page).toHaveURL('/inventory.html');
    await expect(page.locator('.title')).toHaveText('Products');
    await expect(page.locator('.shopping_cart_link')).toBeVisible();
  });

  test('should show error for invalid username @chromium @firefox', async ({ page }) => {
    // Fill in invalid credentials
    await page.fill('[data-test="username"]', 'invalid_user');
    await page.fill('[data-test="password"]', 'secret_sauce');
    
    // Click login button
    await page.click('[data-test="login-button"]');
    
    // Verify error message
    const errorMessage = page.locator('[data-test="error"]');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText('Epic sadface: Username and password do not match');
  });

  test('should show error for invalid password @webkit', async ({ page }) => {
    // Fill in invalid credentials
    await page.fill('[data-test="username"]', 'standard_user');
    await page.fill('[data-test="password"]', 'wrong_password');
    
    // Click login button
    await page.click('[data-test="login-button"]');
    
    // Verify error message
    const errorMessage = page.locator('[data-test="error"]');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText('Epic sadface: Username and password do not match');
  });

  test('should show error when username is empty @chromium', async ({ page }) => {
    // Leave username empty
    await page.fill('[data-test="password"]', 'secret_sauce');
    
    // Click login button
    await page.click('[data-test="login-button"]');
    
    // Verify error message
    const errorMessage = page.locator('[data-test="error"]');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText('Epic sadface: Username is required');
  });

  test('should show error when password is empty @firefox', async ({ page }) => {
    // Leave password empty
    await page.fill('[data-test="username"]', 'standard_user');
    
    // Click login button
    await page.click('[data-test="login-button"]');
    
    // Verify error message
    const errorMessage = page.locator('[data-test="error"]');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText('Epic sadface: Password is required');
  });

  test('should show error for locked out user @webkit @negative', async ({ page }) => {
    // Fill in locked out user credentials
    await page.fill('[data-test="username"]', 'locked_out_user');
    await page.fill('[data-test="password"]', 'secret_sauce');
    
    // Click login button
    await page.click('[data-test="login-button"]');
    
    // Verify error message
    const errorMessage = page.locator('[data-test="error"]');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText('Epic sadface: Sorry, this user has been locked out');
  });

  test('should be able to close error message @chromium', async ({ page }) => {
    // Trigger an error
    await page.click('[data-test="login-button"]');
    
    // Verify error is visible
    await expect(page.locator('[data-test="error"]')).toBeVisible();
    
    // Close error message
    await page.click('.error-button');
    
    // Verify error is hidden
    await expect(page.locator('[data-test="error"]')).not.toBeVisible();
  });

});

