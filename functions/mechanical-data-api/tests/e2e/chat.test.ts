// pages/chat.ts
import { Page } from '@playwright/test';

export class ChatPage {
  constructor(private page: Page) {}

  async createNewChat() {
    await this.page.goto('/chat');
    await this.page.click('button:has-text("New Chat")');
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

  async hasChatIdInUrl() {
    await this.page.waitForURL(/chat\/[a-z0-9]+/, { timeout: 5000 });
  }

  async isElementNotVisible(selector: string) {
    await this.page.waitForSelector(selector, { state: 'hidden' });
  }
}
