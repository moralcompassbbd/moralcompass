import { authenticationMiddleware, authorizationMiddleware } from '../src/middleware/middleware';
import { extractBearerToken } from "../src/utils/auth-utils";
import { mapError } from "../src/error";
import { getCachedManagerStatus, setCachedManagerStatus } from "../src/cache/manager";
import userRepository from "../src/db/user-repository";

jest.mock('../src/utils/auth-utils');
jest.mock('../src/error');
jest.mock('../src/cache/manager');
jest.mock('../src/db/user-repository');

describe('Authentication Middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  test('should return 400 when token is missing', async () => {
    (extractBearerToken as jest.Mock).mockReturnValue(null);

    const req = { headers: { authorization: 'invalid' } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    const next = jest.fn();

    await authenticationMiddleware(req, res, next);

    expect(extractBearerToken).toHaveBeenCalledWith('invalid');
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Missing token' });
    expect(next).not.toHaveBeenCalled();
  });

  test('should return 401 for invalid token', async () => {
    (extractBearerToken as jest.Mock).mockReturnValue('valid-but-incorrect-token');
    (global.fetch as jest.Mock).mockResolvedValue({
      json: jest.fn().mockResolvedValue({ error_description: 'Invalid token' })
    });

    const req = { headers: { authorization: 'Bearer valid-but-incorrect-token' } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    const next = jest.fn();

    await authenticationMiddleware(req, res, next);

    expect(global.fetch).toHaveBeenCalledWith(
      `${process.env.GOOGLE_TOKEN_URL}?id_token=valid-but-incorrect-token`
    );
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid ID token' });
    expect(next).not.toHaveBeenCalled();
  });

  test('should return 403 when token audience mismatches', async () => {
    (extractBearerToken as jest.Mock).mockReturnValue('valid-token');
    (global.fetch as jest.Mock).mockResolvedValue({
      json: jest.fn().mockResolvedValue({ 
        sub: 'user123', 
        email: 'test@example.com',
        aud: 'wrong-client-id'
      })
    });

    const req = { headers: { authorization: 'Bearer valid-token' } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    const next = jest.fn();

    await authenticationMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: 'Token audience mismatch' });
    expect(next).not.toHaveBeenCalled();
  });
});

describe('Authorization Middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should return 500 when googleUser is missing', async () => {
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      locals: {}
    };
    const next = jest.fn();

    await authorizationMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Missing user value' });
    expect(next).not.toHaveBeenCalled();
  });

  test('should proceed if cached manager status is true', async () => {
    (getCachedManagerStatus as jest.Mock).mockReturnValue(true);

    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      locals: {
        googleUser: { sub: 'user123', email: 'test@example.com' }
      }
    };
    const next = jest.fn();

    await authorizationMiddleware(req, res, next);

    expect(getCachedManagerStatus).toHaveBeenCalledWith('user123');
    expect(next).toHaveBeenCalled();
  });

  test('should return 403 if cached manager status is false', async () => {
    (getCachedManagerStatus as jest.Mock).mockReturnValue(false);

    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      locals: {
        googleUser: { sub: 'user123', email: 'test@example.com' }
      }
    };
    const next = jest.fn();

    await authorizationMiddleware(req, res, next);

    expect(getCachedManagerStatus).toHaveBeenCalledWith('user123');
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: 'Not a manager' });
    expect(next).not.toHaveBeenCalled();
  });

  test('should check DB and update cache when no cached status exists', async () => {
    (getCachedManagerStatus as jest.Mock).mockReturnValue(null);
    (userRepository.checkIfUserIsManager as jest.Mock).mockResolvedValue(true);

    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      locals: {
        googleUser: { sub: 'user123', email: 'test@example.com' }
      }
    };
    const next = jest.fn();

    await authorizationMiddleware(req, res, next);

    expect(getCachedManagerStatus).toHaveBeenCalledWith('user123');
    expect(userRepository.checkIfUserIsManager).toHaveBeenCalledWith('user123');
    expect(setCachedManagerStatus).toHaveBeenCalledWith('user123', true);
    expect(next).toHaveBeenCalled();
  });

  test('should return 403 if DB check shows user is not a manager', async () => {
    (getCachedManagerStatus as jest.Mock).mockReturnValue(null);
    (userRepository.checkIfUserIsManager as jest.Mock).mockResolvedValue(false);

    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      locals: {
        googleUser: { sub: 'user123', email: 'test@example.com' }
      }
    };
    const next = jest.fn();

    await authorizationMiddleware(req, res, next);

    expect(getCachedManagerStatus).toHaveBeenCalledWith('user123');
    expect(userRepository.checkIfUserIsManager).toHaveBeenCalledWith('user123');
    expect(setCachedManagerStatus).toHaveBeenCalledWith('user123', false);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: 'Not a manager' });
    expect(next).not.toHaveBeenCalled();
  });
});
