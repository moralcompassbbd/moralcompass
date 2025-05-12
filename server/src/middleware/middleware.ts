import { GoogleUser } from "common/models";
import { extractBearerToken } from "../utils/auth-utils";
import { mapError } from "../error";
import { getCachedManagerStatus, setCachedManagerStatus } from "../cache/manager";
import userRepository from "../db/user-repository";

export async function authenticationMiddleware(req: any, res: any, next: any) {
    const idToken = extractBearerToken(req.headers.authorization);

    if (!idToken) {
        return res.status(400).json({ error: 'Missing token' });
    } else{
        try {
            const response = await fetch(`${process.env.GOOGLE_TOKEN_URL}?id_token=${idToken}`);
            const googleUser: GoogleUser | any = await response.json();

            if (googleUser.error_description) {
                return res.status(401).json({ error: 'Invalid ID token' });
            } else if (googleUser.aud !== process.env.CLIENT_ID) {
                return res.status(403).json({ error: 'Token audience mismatch' });
            } else{
                res.locals.googleUser = googleUser;
                next();
            }
        } catch (error) {
            const [apiError, status] = mapError(error);
            res.status(status).json(apiError);
        }
    }
}

export async function authorizationMiddleware(req: any, res: any, next: any){
    const googleUser: GoogleUser = res.locals.googleUser;

    if(!googleUser){
        res.status(500).json({ error: 'Missing user value' });
    } else{
        const cached = getCachedManagerStatus(googleUser.sub);
        if (cached === true) {
            next();
        } else if(cached === false){
            res.status(403).json({ error: 'Not a manager' });
        } else {
            const isManager = await userRepository.checkIfUserIsManager(googleUser.sub);
            setCachedManagerStatus(googleUser.sub, isManager);
            if (!isManager){ 
                res.status(403).json({ error: 'Not an manager' });
            } else{
                next();
            }
        }
    }
}