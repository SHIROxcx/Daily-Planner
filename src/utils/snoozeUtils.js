/**
 * Snooze utility for managing snoozed notifications and reminders
 */
export const SNOOZE_DURATIONS = [5, 10, 15, 30];
/**
 * Snooze manager for tracking and managing snoozed items
 */
export class SnoozeManager {
    constructor() {
        Object.defineProperty(this, "snoozedItems", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
        Object.defineProperty(this, "timers", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
        Object.defineProperty(this, "onResumeCallbacks", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
    }
    /**
     * Snooze an item for the specified duration
     */
    snooze(itemId, itemType, duration, onResume) {
        // Clear any existing snooze for this item
        this.clearSnooze(itemId);
        const now = Date.now();
        const resumeAt = now + duration * 60 * 1000;
        const snoozedItem = {
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
        const timer = setTimeout(() => {
            this.resume(itemId);
        }, duration * 60 * 1000);
        this.timers.set(itemId, timer);
        return snoozedItem;
    }
    /**
     * Resume a snoozed item
     */
    resume(itemId) {
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
    clearSnooze(itemId) {
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
    isSnoozed(itemId) {
        return this.snoozedItems.has(itemId);
    }
    /**
     * Get snooze info for an item
     */
    getSnoozeInfo(itemId) {
        return this.snoozedItems.get(itemId) || null;
    }
    /**
     * Get time remaining for snooze in milliseconds
     */
    getTimeRemaining(itemId) {
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
    getTimeRemainingFormatted(itemId) {
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
    getAllSnoozedItems() {
        return Array.from(this.snoozedItems.values());
    }
    /**
     * Clear all snoozed items
     */
    clearAll() {
        this.timers.forEach((timer) => clearTimeout(timer));
        this.timers.clear();
        this.snoozedItems.clear();
        this.onResumeCallbacks.clear();
    }
    /**
     * Destroy the manager (for cleanup)
     */
    destroy() {
        this.clearAll();
    }
}
// Global snooze manager instance
export const snoozeManager = new SnoozeManager();
