import session from 'express-session';

export const initializeSession = () => {
  return session({
    secret: process.env.SESSION_SECRET || 'defaultSecret', // Use the environment variable or a fallback
    resave: false, // Don't resave session if not modified
    saveUninitialized: false, // Only save session if it is initialized
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Only set secure cookies in production
      maxAge: 1000 * 60 * 60 * 24, // 1 day expiration
    },
  });
};
