const SESSION_COOKIE = "admin_session";

const getSecret = (): string => process.env.AUTH_SESSION_SECRET ?? "change-me-session-secret";

export const getSessionCookieName = (): string => SESSION_COOKIE;

export const createSessionToken = (email: string): string => {
  return `${email.toLowerCase()}:newsletter-admin:${getSecret()}`;
};

export const isValidSessionToken = (token: string | undefined | null): boolean => {
  if (!token) {
    return false;
  }

  const parts = token.split(":");

  if (parts.length !== 3) {
    return false;
  }

  const [email, role, secret] = parts;

  if (role !== "newsletter-admin") {
    return false;
  }

  if (!email) {
    return false;
  }

  return secret === getSecret();
};
