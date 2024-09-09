import session from 'express-session';
import {NODE_ENV, SECRET_KEY} from "@/config/index";

export const initializeSession = () => {
  return session({
    secret: SECRET_KEY || 'defaultSecret', // Use the environment variable or a fallback
    resave: false, // Don't resave session if not modified
    saveUninitialized: false, // Only save session if it is initialized
    cookie: {
      httpOnly: true,
      secure: NODE_ENV === 'production', // Only set secure cookies in production
      maxAge: 1000 * 60 * 60 * 24, // 1 day expiration
    },
  });
};
