// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * Saucedemo Menu and Navigation Tests
 * Testing the hamburger menu and logout functionality
 */

test.describe('Saucedemo Menu & Navigation', () => {
  
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/');
    await page.fill('[data-test="username"]', process.env.SAUCEDEMO_USERNAME || 'standard_user');
    await page.fill('[data-test="password"]', process.env.SAUCEDEMO_PASSWORD || 'secret_sauce');
    await page.click('[data-test="login-button"]');
  });

  test('should open hamburger menu @chromium @smoke', async ({ page }) => {
    // Click hamburger menu button
    await page.click('#react-burger-menu-btn');
    
    // Verify menu is visible
    const menuItems = page.locator('.bm-item-list');
    await expect(menuItems).toBeVisible();
    
    // Verify all menu items are present
    await expect(page.locator('#inventory_sidebar_link')).toBeVisible();
    await expect(page.locator('#about_sidebar_link')).toBeVisible();
    await expect(page.locator('#logout_sidebar_link')).toBeVisible();
    await expect(page.locator('#reset_sidebar_link')).toBeVisible();
  });

  test('should close hamburger menu @firefox', async ({ page }) => {
    // Open menu
    await page.click('#react-burger-menu-btn');
    await expect(page.locator('.bm-item-list')).toBeVisible();
    
    // Close menu
    await page.click('#react-burger-cross-btn');
    
    // Verify menu is hidden
    await expect(page.locator('.bm-item-list')).not.toBeVisible();
  });

  test('should logout successfully @chromium @webkit', async ({ page }) => {
    // Open menu
    await page.click('#react-burger-menu-btn');
    
    // Click logout
    await page.click('#logout_sidebar_link');
    
    // Verify we're back on login page
    await expect(page).toHaveURL('/');
    await expect(page.locator('[data-test="login-button"]')).toBeVisible();
  });

  test('should navigate to All Items from menu @chromium', async ({ page }) => {
    // Navigate to cart first
    await page.click('.shopping_cart_link');
    await expect(page).toHaveURL('/cart.html');
    
    // Open menu and click All Items
    await page.click('#react-burger-menu-btn');
    await page.click('#inventory_sidebar_link');
    
    // Verify we're back on inventory page
    await expect(page).toHaveURL('/inventory.html');
  });

  test('should reset app state @firefox', async ({ page }) => {
    // Add items to cart
    await page.click('[data-test="add-to-cart-sauce-labs-backpack"]');
    await page.click('[data-test="add-to-cart-sauce-labs-bike-light"]');
    
    // Verify cart has items
    await expect(page.locator('.shopping_cart_badge')).toHaveText('2');
    
    // Open menu and reset app state
    await page.click('#react-burger-menu-btn');
    await page.click('#reset_sidebar_link');
    
    // Close menu
    await page.click('#react-burger-cross-btn');
    
    // Verify cart is cleared
    await expect(page.locator('.shopping_cart_badge')).not.toBeVisible();
  });

  test('should navigate to About page @webkit', async ({ page }) => {
    // Open menu
    await page.click('#react-burger-menu-btn');
    
    // Click About link (this will navigate to external site)
    const [newPage] = await Promise.all([
      page.waitForEvent('popup'),
      page.click('#about_sidebar_link')
    ]);
    
    // Verify new page opened (Sauce Labs website)
    await expect(newPage).toHaveURL(/saucelabs\.com/);
  });

  test('should maintain cart state across pages @chromium', async ({ page }) => {
    // Add item to cart
    await page.click('[data-test="add-to-cart-sauce-labs-backpack"]');
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
    
    // Navigate to product details
    await page.click('[data-test="item-4-title-link"]');
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
    
    // Go back to inventory
    await page.click('[data-test="back-to-products"]');
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
    
    // Navigate to cart
    await page.click('.shopping_cart_link');
    await expect(page.locator('.cart_item')).toHaveCount(1);
  });

  test('should display footer links @chromium @webkit', async ({ page }) => {
    // Verify footer is visible
    const footer = page.locator('.footer');
    await expect(footer).toBeVisible();
    
    // Verify social media links
    await expect(page.locator('[data-test="social-twitter"]')).toBeVisible();
    await expect(page.locator('[data-test="social-facebook"]')).toBeVisible();
    await expect(page.locator('[data-test="social-linkedin"]')).toBeVisible();
    
    // Verify footer text
    await expect(footer).toContainText('© 2024 Sauce Labs');
  });

});

