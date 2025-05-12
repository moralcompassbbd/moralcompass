import { safeParseInt } from "../utils/general-utils";

type CachedEntry = {
    isManager: boolean;
    expiresAt: number;
};
  
const adminCache = new Map<string, CachedEntry>();
const CACHE_TTL_MS = safeParseInt(process.env.ADMIN_CACHE_TTL_MS ?? "", 600000);
  
export function getCachedManagerStatus(sub: string): boolean | undefined {
    const entry = adminCache.get(sub);
    if (!entry){
        return undefined;
    } else if (Date.now() > entry.expiresAt) {
        adminCache.delete(sub);
        return undefined;
    } else{
        return entry.isManager;
    }
    
}
  
export function setCachedManagerStatus(sub: string, isManager: boolean) {
    adminCache.set(sub, {
        isManager,
        expiresAt: Date.now() + CACHE_TTL_MS,
    });
}
  