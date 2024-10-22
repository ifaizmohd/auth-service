export function extractTokenFromHeader(authHeader: string) {
  return authHeader && authHeader.split(' ')[1];
}
