// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * Saucedemo Checkout Tests
 * Testing the complete checkout flow
 */

test.describe('Saucedemo Checkout', () => {
  
  test.beforeEach(async ({ page }) => {
    // Login and add product to cart
    await page.goto('/');
    await page.fill('[data-test="username"]', process.env.SAUCEDEMO_USERNAME || 'standard_user');
    await page.fill('[data-test="password"]', process.env.SAUCEDEMO_PASSWORD || 'secret_sauce');
    await page.click('[data-test="login-button"]');
    
    // Add a product to cart
    await page.click('[data-test="add-to-cart-sauce-labs-backpack"]');
    
    // Navigate to cart
    await page.click('.shopping_cart_link');
  });

  test('should proceed to checkout @chromium @smoke', async ({ page }) => {
    // Click checkout button
    await page.click('[data-test="checkout"]');
    
    // Verify we're on checkout step one page
    await expect(page).toHaveURL('/checkout-step-one.html');
    await expect(page.locator('.title')).toHaveText('Checkout: Your Information');
  });

  test('should complete checkout with valid information @chromium @firefox', async ({ page }) => {
    // Go to checkout
    await page.click('[data-test="checkout"]');
    
    // Fill in customer information
    await page.fill('[data-test="firstName"]', 'John');
    await page.fill('[data-test="lastName"]', 'Doe');
    await page.fill('[data-test="postalCode"]', '12345');
    
    // Continue to next step
    await page.click('[data-test="continue"]');
    
    // Verify we're on checkout step two
    await expect(page).toHaveURL('/checkout-step-two.html');
    await expect(page.locator('.title')).toHaveText('Checkout: Overview');
  });

  test('should show error when first name is missing @webkit', async ({ page }) => {
    // Go to checkout
    await page.click('[data-test="checkout"]');
    
    // Fill in partial information (missing first name)
    await page.fill('[data-test="lastName"]', 'Doe');
    await page.fill('[data-test="postalCode"]', '12345');
    
    // Try to continue
    await page.click('[data-test="continue"]');
    
    // Verify error message
    const errorMessage = page.locator('[data-test="error"]');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText('Error: First Name is required');
  });

  test('should show error when last name is missing @chromium', async ({ page }) => {
    // Go to checkout
    await page.click('[data-test="checkout"]');
    
    // Fill in partial information (missing last name)
    await page.fill('[data-test="firstName"]', 'John');
    await page.fill('[data-test="postalCode"]', '12345');
    
    // Try to continue
    await page.click('[data-test="continue"]');
    
    // Verify error message
    const errorMessage = page.locator('[data-test="error"]');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText('Error: Last Name is required');
  });

  test('should show error when postal code is missing @firefox', async ({ page }) => {
    // Go to checkout
    await page.click('[data-test="checkout"]');
    
    // Fill in partial information (missing postal code)
    await page.fill('[data-test="firstName"]', 'John');
    await page.fill('[data-test="lastName"]', 'Doe');
    
    // Try to continue
    await page.click('[data-test="continue"]');
    
    // Verify error message
    const errorMessage = page.locator('[data-test="error"]');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText('Error: Postal Code is required');
  });

  test('should display correct order summary @chromium @webkit', async ({ page }) => {
    // Complete checkout step one
    await page.click('[data-test="checkout"]');
    await page.fill('[data-test="firstName"]', 'John');
    await page.fill('[data-test="lastName"]', 'Doe');
    await page.fill('[data-test="postalCode"]', '12345');
    await page.click('[data-test="continue"]');
    
    // Verify item in summary
    const cartItem = page.locator('.cart_item');
    await expect(cartItem).toHaveCount(1);
    await expect(page.locator('.inventory_item_name')).toContainText('Sauce Labs Backpack');
    
    // Verify price information is displayed
    await expect(page.locator('.summary_subtotal_label')).toBeVisible();
    await expect(page.locator('.summary_tax_label')).toBeVisible();
    await expect(page.locator('.summary_total_label')).toBeVisible();
  });

  test('should complete full checkout process @chromium @firefox @webkit @e2e', async ({ page }) => {
    // Complete checkout step one
    await page.click('[data-test="checkout"]');
    await page.fill('[data-test="firstName"]', 'John');
    await page.fill('[data-test="lastName"]', 'Doe');
    await page.fill('[data-test="postalCode"]', '12345');
    await page.click('[data-test="continue"]');
    
    // Complete checkout step two
    await page.click('[data-test="finish"]');
    
    // Verify order completion
    await expect(page).toHaveURL('/checkout-complete.html');
    await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!');
    await expect(page.locator('.complete-text')).toContainText('Your order has been dispatched');
  });

  test('should cancel checkout and return to cart @webkit', async ({ page }) => {
    // Go to checkout
    await page.click('[data-test="checkout"]');
    
    // Click cancel button
    await page.click('[data-test="cancel"]');
    
    // Verify we're back on cart page
    await expect(page).toHaveURL('/cart.html');
  });

  test('should cancel on overview page and return to inventory @chromium', async ({ page }) => {
    // Complete checkout step one
    await page.click('[data-test="checkout"]');
    await page.fill('[data-test="firstName"]', 'John');
    await page.fill('[data-test="lastName"]', 'Doe');
    await page.fill('[data-test="postalCode"]', '12345');
    await page.click('[data-test="continue"]');
    
    // Cancel from overview page
    await page.click('[data-test="cancel"]');
    
    // Verify we're back on inventory page
    await expect(page).toHaveURL('/inventory.html');
  });

  test('should return home after completing order @firefox', async ({ page }) => {
    // Complete full checkout
    await page.click('[data-test="checkout"]');
    await page.fill('[data-test="firstName"]', 'John');
    await page.fill('[data-test="lastName"]', 'Doe');
    await page.fill('[data-test="postalCode"]', '12345');
    await page.click('[data-test="continue"]');
    await page.click('[data-test="finish"]');
    
    // Click back home button
    await page.click('[data-test="back-to-products"]');
    
    // Verify we're back on inventory page
    await expect(page).toHaveURL('/inventory.html');
    
    // Verify cart is still showing the item (cart persists)
    // Note: In real scenario, cart might be cleared after order
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
  });

});

