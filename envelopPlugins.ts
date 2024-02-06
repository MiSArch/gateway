import { DefaultContext } from "@envelop/core";
import { useGenericAuth } from "@envelop/generic-auth";
import * as jose from "jose";

type UserType =
  | {
      id: string;
      roles: string[];
    }
  | {};

const VALID_ROLES = ["admin", "employee", "buyer"];

/**
 * Used for JWT verification
 */
const JWKS = jose.createRemoteJWKSet(
  new URL(
    "http://localhost:3500/v1.0/invoke/keycloak/method/keycloak/realms/Misarch/protocol/openid-connect/certs"
  )
);

/**
 * Resolves the user from the JWT token
 *
 * @param context GraphQL envelop context used to access request headers
 * @returns The user object if the token is valid, null otherwise
 */
async function resolveUserAuthenticated(
  context: DefaultContext
): Promise<UserType | null> {
  try {
    const authHeader = (context.request as any)?.headers?.get("authorization");
    if (authHeader == undefined) {
      return {};
    }
    let parsedHeader: string;
    if (authHeader.startsWith("Bearer ")) {
      parsedHeader = authHeader.substring("Bearer ".length());
    } else {
      parsedHeader = authHeader;
    }
    const { payload } = await jose.jwtVerify(parsedHeader, JWKS, {});
    const user: UserType = {
      id: payload.sub!,
      roles: getValidRoles(payload),
    };
    context.authHeader = parsedHeader;
    context.authorizedUser = JSON.stringify(user);
    return user;
  } catch (e) {
    return null;
  }
}

/**
 * Retrieves the valid roles from the JWT token
 *
 * @param payload The JWT payload
 * @returns The valid roles
 */
function getValidRoles(payload: jose.JWTPayload): string[] {
  const roles =
    (payload.realm_access as { roles: string[] } | undefined)?.roles || [];
  return roles.filter((role) => VALID_ROLES.includes(role));
}

/**
 * List of Envelop plugins the gateway shall use.
 */
const plugins = [
  useGenericAuth({
    resolveUserFn: resolveUserAuthenticated,
    mode: "protect-all",
  }),
];

export default plugins;
