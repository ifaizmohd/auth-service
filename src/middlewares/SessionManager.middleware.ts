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
  if (!sessionId) {
    // Generate a unique session ID;
    sessionId = await SessionService.createNewSession(req?.user);
    res.cookie('sessionId', sessionId, {
      httpOnly: false,
      maxAge: SessionService.EXPIRY_TIME * 1000,
    });
  } else {
    // Save session data.
    const userSessionData = {
      userData: req?.user,
    };
    await SessionService.updateSession(sessionId, userSessionData);
  }
  next();
}
