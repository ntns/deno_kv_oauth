// Copyright 2023 the Deno authors. All rights reserved. MIT license.
import { OAuth2Client, OAuth2ClientConfig } from "../deps.ts";

export type Provider = "discord" | "github" | "google";

type ProviderClientConfig<T extends Provider> = T extends "discord"
  ? DiscordClientConfig
  : T extends "google" ? GoogleClientConfig
  : Partial<OAuth2ClientConfig>;

type DiscordClientConfig = Partial<OAuth2ClientConfig> & {
  redirectUri: string;
  defaults: { scope: string | string[] };
};

/**
 * @see {@link https://discord.com/developers/docs/topics/oauth2}
 */
function createDiscordClientConfig(
  moreOAuth2ClientConfig: DiscordClientConfig,
): OAuth2ClientConfig {
  return {
    ...moreOAuth2ClientConfig,
    clientId: Deno.env.get("DISCORD_CLIENT_ID")!,
    clientSecret: Deno.env.get("DISCORD_CLIENT_SECRET")!,
    authorizationEndpointUri: "https://discord.com/oauth2/authorize",
    tokenUri: "https://discord.com/api/oauth2/token",
  };
}

type GitHubClientConfig = Partial<OAuth2ClientConfig>;

/**
 * @see {@link https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps}
 */
function createGitHubClientConfig(
  moreOAuth2ClientConfig?: GitHubClientConfig,
): OAuth2ClientConfig {
  return {
    ...moreOAuth2ClientConfig,
    clientId: Deno.env.get("GITHUB_CLIENT_ID")!,
    clientSecret: Deno.env.get("GITHUB_CLIENT_SECRET")!,
    authorizationEndpointUri: "https://github.com/login/oauth/authorize",
    tokenUri: "https://github.com/login/oauth/access_token",
  };
}

type GoogleClientConfig = Partial<OAuth2ClientConfig> & {
  redirectUri: string;
  defaults: { scope: string | string[] };
};

/**
 * @see {@link https://developers.google.com/identity/protocols/oauth2/web-server}
 */
function createGoogleClientConfig(
  moreOAuth2ClientConfig: GoogleClientConfig,
): OAuth2ClientConfig {
  return {
    ...moreOAuth2ClientConfig,
    clientId: Deno.env.get("GOOGLE_CLIENT_ID")!,
    clientSecret: Deno.env.get("GOOGLE_CLIENT_SECRET")!,
    authorizationEndpointUri: "https://accounts.google.com/o/oauth2/v2/auth",
    tokenUri: "https://oauth2.googleapis.com/token",
  };
}

export function createClient<T extends Provider>(
  provider: T,
  moreOAuth2ClientConfig?: ProviderClientConfig<T>,
): OAuth2Client {
  switch (provider) {
    case "discord":
      return new OAuth2Client(
        createDiscordClientConfig(
          moreOAuth2ClientConfig as DiscordClientConfig,
        ),
      );
    case "github":
      return new OAuth2Client(
        createGitHubClientConfig(moreOAuth2ClientConfig as GitHubClientConfig),
      );
    case "google":
      return new OAuth2Client(
        createGoogleClientConfig(moreOAuth2ClientConfig as GoogleClientConfig),
      );
    default:
      throw new Error(`Provider ID "${provider}" not supported`);
  }
}
