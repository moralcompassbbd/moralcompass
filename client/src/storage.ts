export function getLocalStorageItem(key: string): any{
    let result;
    try {
        const stored = localStorage.getItem(key);
        result = stored ? JSON.parse(stored) : undefined;
    } catch {
        result = undefined;
    }
    return result;
}

export function storeLocalStorageItem(key: string, item: any){
    localStorage.setItem(key, JSON.stringify(item));
}

export function deleteLocalStorageItem(key: string){
    localStorage.removeItem(key);
}