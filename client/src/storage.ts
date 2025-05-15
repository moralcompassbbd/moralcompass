export function getLocalStorageItem<T>(key: string): T | undefined {
    try {
        const stored = localStorage.getItem(key);
        return stored ? (JSON.parse(stored) as T) : undefined;
    } catch {
        return undefined;
    }
}

export function storeLocalStorageItem<T>(key: string, item: T): void {
    localStorage.setItem(key, JSON.stringify(item));
}

export function deleteLocalStorageItem(key: string): void {
    localStorage.removeItem(key);
}
