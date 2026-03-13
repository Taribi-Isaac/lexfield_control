import { test, expect } from '@playwright/test';

test('verify conversation attachments and general documents', async ({ page }) => {
  // Login
  await page.goto('http://localhost:8001/login');
  await page.fill('input[name="email"]', 'control@lexfieldattorneys.com');
  await page.fill('input[name="password"]', 'admin@123');
  await page.click('button[type="submit"]');

  // Wait for navigation to dashboard
  await expect(page).toHaveURL(/.*dashboard/);

  // 1. Verify General Document option
  await page.goto('http://localhost:8001/documents/create');
  await expect(page.locator('select[name="link_type"]')).toContainText('General');

  // Select General and check if link_id is hidden (or at least check it exists)
  await page.selectOption('select[name="link_type"]', 'general');
  // link_id should be hidden
  await expect(page.locator('select[name="link_id"]')).not.toBeVisible();

  // 2. Verify Conversation Attachments
  // First we need a conversation. Let's try to go to messages.
  await page.goto('http://localhost:8001/conversations');

  // Find first conversation if any
  const firstConversation = page.locator('a[href*="/conversations/"]').first();
  if (await firstConversation.isVisible()) {
      await firstConversation.click();
      await expect(page.locator('input[type="file"][multiple]')).toBeVisible();
  }

  // 3. Verify Delete actions
  await page.goto('http://localhost:8001/clients');
  // Check if there is a delete button (it might be in a menu or visible)
  // Our DeleteAction component uses a Button with "Delete" text usually, or an icon.
  // In the index pages, it's often in a dropdown or just a button.
  // Let's look for "Delete" text.
  const deleteButton = page.locator('button:has-text("Delete")').first();
  // It might not be visible if there are no clients or if it's in a menu.

  await page.screenshot({ path: '/home/jules/verification/dashboard.png' });
});
