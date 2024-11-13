import { NextFunction, Response } from 'express';
import { SessionService } from '../services/Session.service';
import { CustomRequest } from '../controllers/types';

/**
 * Middleware to handle custom sessions
 * @param req
 * @param res
 * @param next
 */
export async function sessionManager(
  req: CustomRequest,
  res: Response,
  next: NextFunction
) {
  let sessionId = req?.cookies?.sessionId;
  // If session ID cookie doesn't exist, create a new session
  if (!sessionId || !SessionService.getUserSession(sessionId)) {
    // Generate a unique session ID;
    sessionId = await SessionService.createNewSession();
    res.cookie('sessionId', sessionId, {
      httpOnly: true,
      maxAge: SessionService.EXPIRY_TIME * 1000,
    });
  }
  // Attach session data to the request object for access in routes
  req.session = SessionService.getUserSession(sessionId);
  next();
}
