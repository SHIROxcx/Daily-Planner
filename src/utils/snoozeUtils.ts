/**
 * Snooze utility for managing snoozed notifications and reminders
 */

export const SNOOZE_DURATIONS = [5, 10, 15, 30] as const;
export type SnoozeDuration = (typeof SNOOZE_DURATIONS)[number];

export interface SnoozedItem {
  id: string;
  itemId: string; // The ID of the notification/reminder being snoozed
  itemType: "notification" | "reminder"; // Type of item being snoozed
  snoozedAt: number; // Timestamp when snoozed
  duration: SnoozeDuration; // Duration in minutes
  resumeAt: number; // Timestamp when snooze expires
}

/**
 * Snooze manager for tracking and managing snoozed items
 */
export class SnoozeManager {
  private snoozedItems: Map<string, SnoozedItem> = new Map();
  private timers: Map<string, ReturnType<typeof setTimeout>> = new Map();
  private onResumeCallbacks: Map<string, () => void> = new Map();

  /**
   * Snooze an item for the specified duration
   */
  snooze(
    itemId: string,
    itemType: "notification" | "reminder",
    duration: SnoozeDuration,
    onResume?: () => void,
  ): SnoozedItem {
    // Clear any existing snooze for this item
    this.clearSnooze(itemId);

    const now = Date.now();
    const resumeAt = now + duration * 60 * 1000;

    const snoozedItem: SnoozedItem = {
      id: `snooze-${itemId}-${now}`,
      itemId,
      itemType,
      snoozedAt: now,
      duration,
      resumeAt,
    };

    this.snoozedItems.set(itemId, snoozedItem);

    // Store callback if provided
    if (onResume) {
      this.onResumeCallbacks.set(itemId, onResume);
    }

    // Set timer to resume after snooze duration
    const timer = setTimeout(
      () => {
        this.resume(itemId);
      },
      duration * 60 * 1000,
    );

    this.timers.set(itemId, timer);

    return snoozedItem;
  }

  /**
   * Resume a snoozed item
   */
  resume(itemId: string): SnoozedItem | null {
    const snoozedItem = this.snoozedItems.get(itemId);

    if (!snoozedItem) {
      return null;
    }

    // Clear timer
    const timer = this.timers.get(itemId);
    if (timer) {
      clearTimeout(timer);
      this.timers.delete(itemId);
    }

    // Call resume callback if set
    const callback = this.onResumeCallbacks.get(itemId);
    if (callback) {
      callback();
      this.onResumeCallbacks.delete(itemId);
    }

    // Remove from snoozed items
    this.snoozedItems.delete(itemId);

    return snoozedItem;
  }

  /**
   * Clear snooze for an item without resuming
   */
  clearSnooze(itemId: string): void {
    const timer = this.timers.get(itemId);
    if (timer) {
      clearTimeout(timer);
      this.timers.delete(itemId);
    }

    this.snoozedItems.delete(itemId);
    this.onResumeCallbacks.delete(itemId);
  }

  /**
   * Check if an item is currently snoozed
   */
  isSnoozed(itemId: string): boolean {
    return this.snoozedItems.has(itemId);
  }

  /**
   * Get snooze info for an item
   */
  getSnoozeInfo(itemId: string): SnoozedItem | null {
    return this.snoozedItems.get(itemId) || null;
  }

  /**
   * Get time remaining for snooze in milliseconds
   */
  getTimeRemaining(itemId: string): number {
    const snoozedItem = this.snoozedItems.get(itemId);
    if (!snoozedItem) {
      return 0;
    }

    const remaining = snoozedItem.resumeAt - Date.now();
    return Math.max(0, remaining);
  }

  /**
   * Get time remaining formatted as a readable string
   */
  getTimeRemainingFormatted(itemId: string): string {
    const remaining = this.getTimeRemaining(itemId);
    if (remaining <= 0) {
      return "0 min";
    }

    const minutes = Math.ceil(remaining / 60000);
    return `${minutes} min`;
  }

  /**
   * Get all snoozed items
   */
  getAllSnoozedItems(): SnoozedItem[] {
    return Array.from(this.snoozedItems.values());
  }

  /**
   * Clear all snoozed items
   */
  clearAll(): void {
    this.timers.forEach((timer) => clearTimeout(timer));
    this.timers.clear();
    this.snoozedItems.clear();
    this.onResumeCallbacks.clear();
  }

  /**
   * Destroy the manager (for cleanup)
   */
  destroy(): void {
    this.clearAll();
  }
}

// Global snooze manager instance
export const snoozeManager = new SnoozeManager();
