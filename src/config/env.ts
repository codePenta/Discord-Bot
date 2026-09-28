function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing env var: ${name}`);
  return value;
}

export const env = {
  discordToken: required("DISCORD_TOKEN"),
  clientId: required("DISCORD_CLIENT_ID"),
  guildId: required("DISCORD_GUILD_ID"),
  ownerId: required("DISCORD_OWNER_ID"),
  db: {
    host: required("DB_HOST"), // NAS-IP jetzt, Docker-Service-Name später
    port: Number(process.env.DB_PORT ?? 3306),
    user: required("DB_USER"),
    password: required("DB_PASSWORD"),
    database: required("DB_NAME"),
  },
  google: {
    clientId: required("GOOGLE_CLIENT_ID"),
    clientSecret: required("GOOGLE_CLIENT_SECRET"),
    refreshToken: required("GOOGLE_REFRESH_TOKEN"),
  },
};
