interface GoogleTokenResponse {
  access_token?: string;
  refresh_token?: string;
  expires_in?: number;
  error?: string;
  error_description?: string;
}

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = process.env;
if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
  throw new Error("Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env.local");
}

const REDIRECT_URI = "http://localhost:3000/callback";
const SCOPE = "https://www.googleapis.com/auth/calendar.readonly";

const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
authUrl.searchParams.set("client_id", GOOGLE_CLIENT_ID);
authUrl.searchParams.set("redirect_uri", REDIRECT_URI);
authUrl.searchParams.set("response_type", "code");
authUrl.searchParams.set("scope", SCOPE);
authUrl.searchParams.set("access_type", "offline"); // nötig fürs Refresh-Token
authUrl.searchParams.set("prompt", "consent");       // erzwingt Refresh-Token auch bei Re-Auth

console.log("\nÖffne diese URL im Browser und logge dich ein:\n");
console.log(authUrl.toString());
console.log("\nWarte auf Redirect...\n");

const server = Bun.serve({
  port: 3000,
  async fetch(req) {
    const url = new URL(req.url);
    if (url.pathname !== "/callback") return new Response("Not found", { status: 404 });

    const code = url.searchParams.get("code");
    if (!code) return new Response("Kein Code erhalten.", { status: 400 });

    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        code,
        redirect_uri: REDIRECT_URI,
        grant_type: "authorization_code",
      }),
    });

    const tokens = (await tokenRes.json()) as GoogleTokenResponse;

    if (!tokens.refresh_token) {
      console.error("\nKein Refresh-Token erhalten. Google gibt nur beim allerersten Consent eines Accounts eines aus.");
      console.error("Entferne den Zugriff unter https://myaccount.google.com/permissions und starte das Script erneut.\n");
    } else {
      console.log("\nRefresh-Token erhalten — in .env.local eintragen als:\n");
      console.log(`GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}\n`);
    }

    setTimeout(() => server.stop(), 500);
    return new Response("Fertig, du kannst dieses Fenster schließen und ins Terminal wechseln.");
  },
});
