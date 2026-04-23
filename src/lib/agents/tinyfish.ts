import type { BrandProfile, GeneratedContent, KpiSnapshot, Platform, WebsiteData } from "../types";

const TINYFISH_API_BASE_URL = process.env.TINYFISH_API_BASE_URL || "https://agent.tinyfish.ai";
const TINYFISH_API_KEY = process.env.TINYFISH_API_KEY || "";
const TINYFISH_USE_VAULT = (process.env.TINYFISH_USE_VAULT || "true").toLowerCase() !== "false";
const TINYFISH_VAULT_PROVIDER = process.env.TINYFISH_VAULT_PROVIDER || "";
const TINYFISH_VAULT_TOKEN = process.env.TINYFISH_VAULT_TOKEN || "";

type TinyfishVaultItem = {
  itemId: string;
  name?: string;
  domains?: string[];
};

let vaultConnectAttempted = false;

function ensureTinyfishConfigured() {
  if (!TINYFISH_API_KEY) {
    throw new Error("TINYFISH_API_KEY is not set");
  }
}

async function tinyfishRequest<T>(path: string, init?: RequestInit): Promise<T> {
  ensureTinyfishConfigured();

  const response = await fetch(`${TINYFISH_API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "X-API-Key": TINYFISH_API_KEY,
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });

  if (!response.ok) {
    throw new Error(`TinyFish request failed (${response.status}) ${path}`);
  }

  return (await response.json()) as T;
}

async function tinyfishFetchMarkdown(url: string): Promise<string> {
  ensureTinyfishConfigured();

  const response = await fetch(`${TINYFISH_API_BASE_URL}/v1/fetch`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${TINYFISH_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url }),
  });

  if (!response.ok) {
    throw new Error(`TinyFish fetch failed (${response.status})`);
  }

  const data = (await response.json()) as unknown;
  if (typeof data === "string") return data;
  if (!data || typeof data !== "object") return "";

  const obj = data as Record<string, unknown>;
  const markdown =
    (typeof obj.markdown === "string" && obj.markdown) ||
    (typeof obj.content === "string" && obj.content) ||
    (typeof obj.text === "string" && obj.text) ||
    (typeof (obj.data as Record<string, unknown> | undefined)?.markdown === "string"
      ? ((obj.data as Record<string, unknown>).markdown as string)
      : "") ||
    "";

  return markdown;
}

function extractTextFromUnknown(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(extractTextFromUnknown);
  if (!value || typeof value !== "object") return [];

  const obj = value as Record<string, unknown>;
  const textLikeKeys = [
    "text",
    "output",
    "result",
    "summary",
    "content",
    "final_output",
    "finalOutput",
    "response",
    "message",
  ];

  const directTexts = textLikeKeys.flatMap((key) => extractTextFromUnknown(obj[key]));
  const nestedTexts = Object.values(obj).flatMap(extractTextFromUnknown);
  return [...directTexts, ...nestedTexts];
}

function extractFirstJsonObject(value: string): string | null {
  const fenced = value.match(/```json\s*([\s\S]*?)\s*```/i);
  if (fenced?.[1]) return fenced[1].trim();

  const firstBrace = value.indexOf("{");
  const lastBrace = value.lastIndexOf("}");
  if (firstBrace >= 0 && lastBrace > firstBrace) {
    return value.slice(firstBrace, lastBrace + 1).trim();
  }

  return null;
}

async function connectVaultIfConfigured(): Promise<void> {
  if (vaultConnectAttempted) return;
  vaultConnectAttempted = true;

  if (!TINYFISH_USE_VAULT || !TINYFISH_VAULT_PROVIDER || !TINYFISH_VAULT_TOKEN) return;

  try {
    await tinyfishRequest("/v1/vault/connections", {
      method: "POST",
      body: JSON.stringify({
        provider: TINYFISH_VAULT_PROVIDER,
        token: TINYFISH_VAULT_TOKEN,
      }),
    });
  } catch {
    // continue; vault could already be connected
  }
}

async function getVaultItems(): Promise<TinyfishVaultItem[]> {
  if (!TINYFISH_USE_VAULT) return [];
  await connectVaultIfConfigured();

  const response = await tinyfishRequest<{ items?: TinyfishVaultItem[] }>("/v1/vault/items", {
    method: "GET",
  });
  return response.items || [];
}

function getCredentialCandidatesForUrl(items: TinyfishVaultItem[], targetUrl: string): string[] {
  const host = new URL(targetUrl).hostname.toLowerCase();
  const domainMatches = items.filter((item) =>
    (item.domains || []).some((domain) => host.includes(domain.toLowerCase()))
  );
  return domainMatches.map((item) => item.itemId);
}

async function runAutomationWithVault<T>(
  url: string,
  goal: string,
  parseResult: (response: unknown) => T
): Promise<T> {
  const items = await getVaultItems();
  const credentialItemIds = getCredentialCandidatesForUrl(items, url);

  const response = await tinyfishRequest("/v1/automation/run", {
    method: "POST",
    body: JSON.stringify({
      url,
      goal,
      use_vault: TINYFISH_USE_VAULT,
      credential_item_ids: credentialItemIds.length > 0 ? credentialItemIds : undefined,
    }),
  });

  return parseResult(response);
}

function parseKpiResponse(response: unknown): KpiSnapshot {
  const snippets = extractTextFromUnknown(response);
  for (const snippet of snippets) {
    const jsonString = extractFirstJsonObject(snippet);
    if (!jsonString) continue;
    try {
      const parsed = JSON.parse(jsonString) as KpiSnapshot;
      if (parsed.platform && typeof parsed.reach === "number") return parsed;
    } catch {
      // try next snippet
    }
  }
  throw new Error("TinyFish social response did not contain expected KPI JSON");
}

function getPlatformTargetUrl(platform: Platform): string {
  const urls: Record<Platform, string> = {
    instagram: "https://www.instagram.com",
    facebook: "https://www.facebook.com",
    x_twitter: "https://x.com",
    tiktok: "https://www.tiktok.com",
    threads: "https://www.threads.net",
    website: "https://example.com",
  };
  return urls[platform];
}

export async function tinyfishWebsiteCrawl(brand: BrandProfile): Promise<WebsiteData> {
  const markdown = await tinyfishFetchMarkdown(brand.website);
  const compactMarkdown = markdown.trim();
  const titleMatch = compactMarkdown.match(/^#\s+(.+)$/m);
  const title = titleMatch?.[1]?.trim() || `${brand.brand} — Website`;

  const links = [...compactMarkdown.matchAll(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g)];
  const articles = links.slice(0, 3).map((match) => ({
    title: match[1].trim(),
    url: match[2].trim(),
    summary: compactMarkdown.slice(0, 280),
  }));

  if (articles.length === 0) {
    articles.push({
      title: `${brand.brand} Website Snapshot`,
      url: brand.website,
      summary: compactMarkdown.slice(0, 280),
    });
  }

  return {
    url: brand.website,
    title,
    articles,
    seoScore: compactMarkdown.length > 0 ? 80 : 0,
    crawledAt: new Date().toISOString(),
  };
}

export async function tinyfishSocialPost(
  brand: BrandProfile,
  content: GeneratedContent
): Promise<KpiSnapshot> {
  const url = getPlatformTargetUrl(content.platform);
  const hashtags = content.hashtags.join(" ");

  return runAutomationWithVault(
    url,
    `Log in to ${content.platform} using vault credentials if available and publish this post for ${brand.brand}.
Caption:
${content.caption}

Hashtags:
${hashtags}

If direct posting is blocked, create a draft and continue.
Return ONLY valid JSON with this exact shape:
{
  "timestamp": "${new Date().toISOString()}",
  "platform": "${content.platform}",
  "reach": 0,
  "impressions": 0,
  "likes": 0,
  "comments": 0,
  "shares": 0,
  "clicks": 0,
  "engagementRate": 0.0,
  "followerCount": 0
}`,
    parseKpiResponse
  );
}
