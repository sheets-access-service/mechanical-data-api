// pages/artifact.ts
import { Page } from '@playwright/test';

export class ArtifactPage {
  constructor(private page: Page) {}

  get artifact() {
    return this.page.locator('.artifact');
  }

  async isGenerationComplete() {
    await this.page.waitForSelector('.artifact', { state: 'visible' });
  }

  async closeArtifact() {
    await this.page.click('.artifact .close-button');
  }

  async sendUserMessage(message: string) {
    await this.page.fill('textarea[name="message"]', message);
    await this.page.click('button:has-text("Send")');
  }

  async getRecentAssistantMessage() {
    return {
      content: await this.page.textContent('.assistant-message:last-child'),
    };
  }
}
