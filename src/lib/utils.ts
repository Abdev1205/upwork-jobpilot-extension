import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export function createUpworkSearchUrl(keywords: string): string {
  const baseUrl = "https://www.upwork.com/nx/search/jobs/";
  const params = new URLSearchParams({
    client_hires: "1-9,10-",
    payment_verified: "1",
    q: keywords,
    sort: "recency",
  });

  return `${baseUrl}?${params.toString()}`;
}

// Storage utilities
export const storage = {
  get: (key: string): Promise<any> => {
    return new Promise((resolve) => {
      chrome.storage.local.get([key], (result) => {
        resolve(result[key]);
      });
    });
  },

  set: (key: string, value: any): Promise<void> => {
    return new Promise((resolve) => {
      chrome.storage.local.set({ [key]: value }, () => {
        resolve();
      });
    });
  },

  remove: (key: string): Promise<void> => {
    return new Promise((resolve) => {
      chrome.storage.local.remove([key], () => {
        resolve();
      });
    });
  },
};
