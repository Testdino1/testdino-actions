// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * Saucedemo Shopping Cart Tests
 * Testing product browsing and shopping cart functionality
 */

test.describe('Saucedemo Shopping', () => {
  
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/');
    await page.fill('[data-test="username"]', process.env.SAUCEDEMO_USERNAME || 'standard_user');
    await page.fill('[data-test="password"]', process.env.SAUCEDEMO_PASSWORD || 'secret_sauce');
    await page.click('[data-test="login-button"]');
    
    // Wait for inventory page to load
    await expect(page).toHaveURL('/inventory.html');
  });

  test('should display all products on inventory page @chromium @smoke', async ({ page }) => {
    // Verify products are displayed
    const inventoryItems = page.locator('.inventory_item');
    await expect(inventoryItems).toHaveCount(6);
    
    // Verify page title
    await expect(page.locator('.title')).toHaveText('Products');
  });

  test('should add product to cart @chromium @firefox', async ({ page }) => {
    // Add first product to cart
    await page.click('[data-test="add-to-cart-sauce-labs-backpack"]');
    
    // Verify cart badge shows 1 item
    const cartBadge = page.locator('.shopping_cart_badge');
    await expect(cartBadge).toHaveText('1');
    
    // Verify button text changed to "Remove"
    await expect(page.locator('[data-test="remove-sauce-labs-backpack"]')).toBeVisible();
  });

  test('should add multiple products to cart @webkit', async ({ page }) => {
    // Add multiple products
    await page.click('[data-test="add-to-cart-sauce-labs-backpack"]');
    await page.click('[data-test="add-to-cart-sauce-labs-bike-light"]');
    await page.click('[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]');
    
    // Verify cart badge shows 3 items
    const cartBadge = page.locator('.shopping_cart_badge');
    await expect(cartBadge).toHaveText('3');
  });

  test('should remove product from cart @chromium', async ({ page }) => {
    // Add product to cart
    await page.click('[data-test="add-to-cart-sauce-labs-backpack"]');
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
    
    // Remove product from cart
    await page.click('[data-test="remove-sauce-labs-backpack"]');
    
    // Verify cart badge is not visible
    await expect(page.locator('.shopping_cart_badge')).not.toBeVisible();
  });

  test('should navigate to product details page @firefox', async ({ page }) => {
    // Click on product name
    await page.click('[data-test="item-4-title-link"]');
    
    // Verify we're on the product details page
    await expect(page).toHaveURL(/inventory-item\.html/);
    await expect(page.locator('.inventory_details_name')).toContainText('Sauce Labs Backpack');
  });

  test('should sort products by price low to high @chromium @webkit', async ({ page }) => {
    // Sort by price low to high
    await page.selectOption('.product_sort_container', 'lohi');
    
    // Get all prices
    const prices = await page.locator('.inventory_item_price').allTextContents();
    
    // Verify prices are sorted
    const numericPrices = prices.map(p => parseFloat(p.replace('$', '')));
    const sortedPrices = [...numericPrices].sort((a, b) => a - b);
    
    expect(numericPrices).toEqual(sortedPrices);
  });

  test('should sort products by name A to Z @chromium', async ({ page }) => {
    // Default sort should be A to Z
    const productNames = await page.locator('.inventory_item_name').allTextContents();
    const sortedNames = [...productNames].sort();
    
    expect(productNames).toEqual(sortedNames);
  });

  test('should navigate to cart page @firefox @webkit', async ({ page }) => {
    // Add a product to cart
    await page.click('[data-test="add-to-cart-sauce-labs-backpack"]');
    
    // Click on cart icon
    await page.click('.shopping_cart_link');
    
    // Verify we're on the cart page
    await expect(page).toHaveURL('/cart.html');
    await expect(page.locator('.title')).toHaveText('Your Cart');
  });

  test('should view cart with added items @chromium', async ({ page }) => {
    // Add products to cart
    await page.click('[data-test="add-to-cart-sauce-labs-backpack"]');
    await page.click('[data-test="add-to-cart-sauce-labs-bike-light"]');
    
    // Navigate to cart
    await page.click('.shopping_cart_link');
    
    // Verify cart items
    const cartItems = page.locator('.cart_item');
    await expect(cartItems).toHaveCount(2);
  });

  test('should remove item from cart page @webkit', async ({ page }) => {
    // Add product and navigate to cart
    await page.click('[data-test="add-to-cart-sauce-labs-backpack"]');
    await page.click('.shopping_cart_link');
    
    // Remove item from cart
    await page.click('[data-test="remove-sauce-labs-backpack"]');
    
    // Verify cart is empty
    const cartItems = page.locator('.cart_item');
    await expect(cartItems).toHaveCount(0);
  });

  test('should continue shopping from cart @chromium @firefox', async ({ page }) => {
    // Navigate to cart
    await page.click('.shopping_cart_link');
    
    // Click continue shopping
    await page.click('[data-test="continue-shopping"]');
    
    // Verify we're back on inventory page
    await expect(page).toHaveURL('/inventory.html');
  });

});

