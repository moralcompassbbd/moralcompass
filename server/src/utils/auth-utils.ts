export function extractBearerToken(authorizationHeader?: string): string | undefined {
    if(!authorizationHeader){ 
        return undefined;
    } else{
        const parts = authorizationHeader.split(' ');
        if (parts.length !== 2 || parts[0] !== 'Bearer') {
          return undefined;
        } else{
            return parts[1];
        }
    }
}