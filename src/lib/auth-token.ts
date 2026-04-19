export function pickAuthToken(data: { data: { auth_token: string } }): string | undefined {
  return data.data.auth_token;
}
