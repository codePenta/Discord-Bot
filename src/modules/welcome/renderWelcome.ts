export interface WelcomeContext {
  user: string; // Mention, z.B. <@123>
  server: string;
  memberCount: number;
}

// Reine Funktion: leicht testbar, keine discord.js-Abhängigkeit
export function renderWelcome(template: string, ctx: WelcomeContext): string {
  return template
    .replaceAll("{user}", ctx.user)
    .replaceAll("{server}", ctx.server)
    .replaceAll("{count}", String(ctx.memberCount));
}