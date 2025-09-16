import { test, expect } from '@playwright/test';

test.describe('Game Listing and Navigation', () => {
  test('should display games with titles on index page', async ({ page }) => {
    await page.goto('/');
    
    // Wait for the games to load
    await page.waitForSelector('[data-testid="games-grid"]', { timeout: 10000 });
    
    // Check that games are displayed
    const gameCards = page.locator('[data-testid="game-card"]');
    
    // Wait for at least one game card to be visible
    await expect(gameCards.first()).toBeVisible();
    
    // Check that we have at least one game
    const gameCount = await gameCards.count();
    expect(gameCount).toBeGreaterThan(0);
    
    // Check that each game card has a title
    const firstGameCard = gameCards.first();
    await expect(firstGameCard.locator('[data-testid="game-title"]')).toBeVisible();
    
    // Verify that game titles are not empty
    const gameTitle = await firstGameCard.locator('[data-testid="game-title"]').textContent();
    expect(gameTitle?.trim()).toBeTruthy();
  });

  test('should navigate to correct game details page when clicking on a game', async ({ page }) => {
    await page.goto('/');
    
    // Wait for games to load
    await page.waitForSelector('[data-testid="games-grid"]', { timeout: 10000 });
    
    // Get the first game card and its data attributes
    const firstGameCard = page.locator('[data-testid="game-card"]').first();
    const gameId = await firstGameCard.getAttribute('data-game-id');
    const gameTitle = await firstGameCard.getAttribute('data-game-title');
    
    // Click on the first game
    await firstGameCard.click();
    
    // Verify we're on the correct game details page
    await expect(page).toHaveURL(`/game/${gameId}`);
    
    // Verify the game details page loads
    await page.waitForSelector('[data-testid="game-details"]', { timeout: 10000 });
    
    // Verify the title matches what we clicked on
    const detailsTitle = page.locator('[data-testid="game-details-title"]');
    await expect(detailsTitle).toHaveText(gameTitle || '');
  });

  test('should display game details with all required information', async ({ page }) => {
    // Navigate to a specific game (we'll use game ID 1 as an example)
    await page.goto('/game/1');
    
    // Wait for game details to load
    await page.waitForSelector('[data-testid="game-details"]', { timeout: 10000 });
    
    // Check that the game title is present and not empty
    const gameTitle = page.locator('[data-testid="game-details-title"]');
    await expect(gameTitle).toBeVisible();
    const titleText = await gameTitle.textContent();
    expect(titleText?.trim()).toBeTruthy();
    
    // Check that the game description is present and not empty
    const gameDescription = page.locator('[data-testid="game-details-description"]');
    await expect(gameDescription).toBeVisible();
    const descriptionText = await gameDescription.textContent();
    expect(descriptionText?.trim()).toBeTruthy();
    
    // Check that either publisher or category (or both) are present
    const publisherExists = await page.locator('[data-testid="game-details-publisher"]').isVisible();
    const categoryExists = await page.locator('[data-testid="game-details-category"]').isVisible();
    expect(publisherExists && categoryExists).toBeTruthy();
    
    // If publisher exists, check it has content
    if (publisherExists) {
      const publisherText = await page.locator('[data-testid="game-details-publisher"]').textContent();
      expect(publisherText?.trim()).toBeTruthy();
    }
    
    // If category exists, check it has content
    if (categoryExists) {
      const categoryText = await page.locator('[data-testid="game-details-category"]').textContent();
      expect(categoryText?.trim()).toBeTruthy();
    }
  });

  test('should display a button to back the game', async ({ page }) => {
    await page.goto('/game/1');
    
    // Wait for game details to load
    await page.waitForSelector('[data-testid="game-details"]', { timeout: 10000 });
    
    // Check that the back game button is present
    const backButton = page.locator('[data-testid="back-game-button"]');
    await expect(backButton).toBeVisible();
    await expect(backButton).toContainText('Support This Game');
    
    // Verify the button is clickable
    await expect(backButton).toBeEnabled();
  });

  test('should be able to navigate back to home from game details', async ({ page }) => {
    await page.goto('/game/1');
    
    // Wait for the page to load
    await page.waitForSelector('[data-testid="game-details"]', { timeout: 10000 });
    
    // Find and click the back to all games link
    const backLink = page.locator('a:has-text("Back to all games")');
    await expect(backLink).toBeVisible();
    await backLink.click();
    
    // Verify we're back on the home page
    await expect(page).toHaveURL('/');
    await page.waitForSelector('[data-testid="games-grid"]', { timeout: 10000 });
  });

  test('should handle navigation to non-existent game gracefully', async ({ page }) => {
    // Navigate to a game that doesn't exist
    await page.goto('/game/99999');
    
    // The page should load without crashing
    // Check if there's an error message or if it handles gracefully
    await page.waitForTimeout(3000);
    
    // The page should either show an error or handle it gracefully
    // We expect the page to not crash and still have a valid title
    await expect(page).toHaveTitle(/Game Details - Tailspin Toys/);
  });

  test('should display filter controls and allow filtering by category', async ({ page }) => {
    await page.goto('/');
    
    // Wait for the games to load
    await page.waitForSelector('[data-testid="games-grid"]', { timeout: 10000 });
    
    // Check that filter controls are present
    await expect(page.locator('[data-testid="category-filter"]')).toBeVisible();
    await expect(page.locator('[data-testid="publisher-filter"]')).toBeVisible();
    
    // Get initial number of games
    const initialGameCount = await page.locator('[data-testid="game-card"]').count();
    expect(initialGameCount).toBeGreaterThan(0);
    
    // Select a category filter
    await page.selectOption('[data-testid="category-filter"]', { index: 1 }); // First category (not "All Categories")
    
    // Wait for filtered results
    await page.waitForTimeout(1000);
    
    // Check that active filters indicator appears
    await expect(page.locator('[data-testid="active-filters"]')).toBeVisible();
    
    // Check that the filtered results are different (potentially fewer games)
    const filteredGameCount = await page.locator('[data-testid="game-card"]').count();
    expect(filteredGameCount).toBeGreaterThanOrEqual(0);
    expect(filteredGameCount).toBeLessThanOrEqual(initialGameCount);
  });

  test('should display filter controls and allow filtering by publisher', async ({ page }) => {
    await page.goto('/');
    
    // Wait for the games to load
    await page.waitForSelector('[data-testid="games-grid"]', { timeout: 10000 });
    
    // Get initial number of games
    const initialGameCount = await page.locator('[data-testid="game-card"]').count();
    
    // Select a publisher filter
    await page.selectOption('[data-testid="publisher-filter"]', { index: 1 }); // First publisher (not "All Publishers")
    
    // Wait for filtered results
    await page.waitForTimeout(1000);
    
    // Check that active filters indicator appears
    await expect(page.locator('[data-testid="active-filters"]')).toBeVisible();
    
    // Check that the filtered results are different (potentially fewer games)
    const filteredGameCount = await page.locator('[data-testid="game-card"]').count();
    expect(filteredGameCount).toBeGreaterThanOrEqual(0);
    expect(filteredGameCount).toBeLessThanOrEqual(initialGameCount);
  });

  test('should allow clearing filters and return to all games', async ({ page }) => {
    await page.goto('/');
    
    // Wait for the games to load
    await page.waitForSelector('[data-testid="games-grid"]', { timeout: 10000 });
    
    // Get initial number of games
    const initialGameCount = await page.locator('[data-testid="game-card"]').count();
    
    // Apply both filters
    await page.selectOption('[data-testid="category-filter"]', { index: 1 });
    await page.selectOption('[data-testid="publisher-filter"]', { index: 1 });
    
    // Wait for filtered results
    await page.waitForTimeout(1000);
    
    // Check that active filters indicator appears
    await expect(page.locator('[data-testid="active-filters"]')).toBeVisible();
    
    // Check that clear filters button appears
    await expect(page.locator('[data-testid="clear-filters"]')).toBeVisible();
    
    // Click clear filters
    await page.click('[data-testid="clear-filters"]');
    
    // Wait for results to update
    await page.waitForTimeout(1000);
    
    // Check that active filters indicator is hidden
    await expect(page.locator('[data-testid="active-filters"]')).not.toBeVisible();
    
    // Check that clear filters button is hidden
    await expect(page.locator('[data-testid="clear-filters"]')).not.toBeVisible();
    
    // Check that we're back to showing all games
    const finalGameCount = await page.locator('[data-testid="game-card"]').count();
    expect(finalGameCount).toBe(initialGameCount);
  });

  test('should allow removing individual filter tags', async ({ page }) => {
    await page.goto('/');
    
    // Wait for the games to load
    await page.waitForSelector('[data-testid="games-grid"]', { timeout: 10000 });
    
    // Apply a category filter
    await page.selectOption('[data-testid="category-filter"]', { index: 1 });
    
    // Wait for filtered results
    await page.waitForTimeout(1000);
    
    // Check that active filters indicator appears
    await expect(page.locator('[data-testid="active-filters"]')).toBeVisible();
    
    // Check that the category filter tag is visible
    const categoryTag = page.locator('[data-testid="active-filters"] span').first();
    await expect(categoryTag).toBeVisible();
    
    // Click the remove button on the category tag
    await categoryTag.locator('button').click();
    
    // Wait for results to update
    await page.waitForTimeout(1000);
    
    // Check that active filters indicator is hidden (since no filters are active)
    await expect(page.locator('[data-testid="active-filters"]')).not.toBeVisible();
  });
});
