import { test, expect } from "@playwright/test";

test.describe("FrameCraft Camera & Portfolio Flow", () => {
  test("allows user to configure grid overlay, capture a photo, inspect AI scorecard, and view in portfolio", async ({ page }) => {
    // 1. Visit the main camera view
    await page.goto("/");

    // Verify brand header is visible
    await expect(page.getByRole("heading", { name: /FrameCraft/i })).toBeVisible();

    // 2. Switch to Practice Scene mode if webcam is active by default
    const liveWebcamBtn = page.getByRole("button", { name: /Live WebCam/i });
    if (await liveWebcamBtn.isVisible()) {
      await liveWebcamBtn.click();
      await expect(page.getByRole("button", { name: /Practice Scene/i })).toBeVisible();
    }

    // 3. Select the 'golden spiral' composition guide
    const goldenSpiralBtn = page.getByRole("button", { name: "golden spiral" });
    await expect(goldenSpiralBtn).toBeVisible();
    await goldenSpiralBtn.click();

    // 4. Click shutter button to take a photo
    const shutterBtn = page.getByTestId("shutter-button");
    await expect(shutterBtn).toBeVisible();
    await shutterBtn.click();

    // 5. Verify Photo Analysis Scorecard modal opens
    const modalTitle = page.getByText("Photo Analysis & Scorecard");
    await expect(modalTitle).toBeVisible();
    await expect(page.getByText("Quality Rating")).toBeVisible();
    await expect(page.getByText("Score Breakdown")).toBeVisible();

    // 6. Dismiss review modal by clicking 'Keep Shooting'
    const keepShootingBtn = page.getByRole("button", { name: /Keep Shooting/i });
    await expect(keepShootingBtn).toBeVisible();
    await keepShootingBtn.click();

    // Verify modal is closed
    await expect(modalTitle).not.toBeVisible();

    // 7. Verify the photo is recorded in the Portfolio gallery
    const portfolioHeading = page.getByText(/Your FrameCraft Portfolio \(1\)/i);
    await expect(portfolioHeading).toBeVisible();
  });
});