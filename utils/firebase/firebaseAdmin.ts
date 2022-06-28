import firebaseAdmin from "firebase-admin";

// ONLY USE IN SERVER-SIDE CONTEXT

const adminConfig = {
  type: process.env.FIREBASE_ADMIN_TYPE,
  project_id: process.env.FIREBASE_ADMIN_PROJECT_ID,
  private_key_id: process.env.FIREBASE_ADMIN_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, "\n"),
  client_email: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_ADMIN_CLIENT_ID,
  auth_uri: process.env.FIREBASE_ADMIN_AUTH_URI,
  token_uri: process.env.FIREBASE_ADMIN_TOKEN_URI,
  auth_provider_x509_cert_url:
    process.env.FIREBASE_ADMIN_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_ADMIN_CLIENT_X509_CERT_URL,
} as firebaseAdmin.ServiceAccount;

if (!firebaseAdmin.apps.length) {
  firebaseAdmin.initializeApp(
    {
      databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
      credential: firebaseAdmin.credential.cert(adminConfig),
    }
  );
}

export const auth = firebaseAdmin.auth();
export const db = firebaseAdmin.database();

// TODO: add email verification
export const verifyIdToken = (token) =>
  auth
    .verifyIdToken(token)
    .then(async (decodedToken) => {
      return decodedToken.uid;
    })
    .catch((error) => {
      return "forbidden";
    });

export const sendEmailVerification = async (uid, email, username, req) => {
  console.log("yo");
};
