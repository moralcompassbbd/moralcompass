import { GoogleUser } from "common/models";
import { Request, Response, NextFunction } from "express";
import { extractBearerToken } from "../utils/auth-utils";
import { mapError } from "../error";

export async function verifyGoogleToken(
    req: Request,
    res: Response,
    next: NextFunction
) {
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