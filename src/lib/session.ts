import nextAppSession from 'next-app-session';

// Your session data type
type MySessionData = {
   grantId?: string;
   email?: string;
}

export const session = nextAppSession<MySessionData>({
   // Options
   name: 'slotify_session',
   secret: process.env.SESSION_SECRET,
}); 