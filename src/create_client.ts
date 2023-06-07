// Copyright 2023 the Deno authors. All rights reserved. MIT license.
import { OAuth2Client, OAuth2ClientConfig } from "../deps.ts";

export type Provider = keyof IRequiredOptionsByProvider;

type IRequiredOptionsByProvider = {
  discord: Partial<OAuth2ClientConfig> & {
    redirectUri: string;
    defaults: { scope: string | string[] };
  };
  google: Partial<OAuth2ClientConfig> & {
    redirectUri: string;
    defaults: { scope: string | string[] };
  };
  github: Partial<OAuth2ClientConfig>;
};

type RequiredOptions<T, K extends keyof T> = T[K];

/**
 * @see {@link https://discord.com/developers/docs/topics/oauth2}
 */
function createDiscordClientConfig(
  moreOAuth2ClientConfig: Partial<OAuth2ClientConfig>,
): OAuth2ClientConfig {
  return {
    ...moreOAuth2ClientConfig,
    clientId: Deno.env.get("DISCORD_CLIENT_ID")!,
    clientSecret: Deno.env.get("DISCORD_CLIENT_SECRET")!,
    authorizationEndpointUri: "https://discord.com/oauth2/authorize",
    tokenUri: "https://discord.com/api/oauth2/token",
  };
}

/**
 * @see {@link https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps}
 */
function createGitHubClientConfig(
  moreOAuth2ClientConfig?: Partial<OAuth2ClientConfig>,
): OAuth2ClientConfig {
  return {
    ...moreOAuth2ClientConfig,
    clientId: Deno.env.get("GITHUB_CLIENT_ID")!,
    clientSecret: Deno.env.get("GITHUB_CLIENT_SECRET")!,
    authorizationEndpointUri: "https://github.com/login/oauth/authorize",
    tokenUri: "https://github.com/login/oauth/access_token",
  };
}

/**
 * @see {@link https://developers.google.com/identity/protocols/oauth2/web-server}
 */
function createGoogleClientConfig(
  moreOAuth2ClientConfig: Partial<OAuth2ClientConfig>,
): OAuth2ClientConfig {
  return {
    ...moreOAuth2ClientConfig,
    clientId: Deno.env.get("GOOGLE_CLIENT_ID")!,
    clientSecret: Deno.env.get("GOOGLE_CLIENT_SECRET")!,
    authorizationEndpointUri: "https://accounts.google.com/o/oauth2/v2/auth",
    tokenUri: "https://oauth2.googleapis.com/token",
  };
}

export function createClient<
  T extends Provider,
>(
  provider: T,
  moreOAuth2ClientConfig: RequiredOptions<IRequiredOptionsByProvider, T>,
): OAuth2Client {
  switch (provider) {
    case "discord":
      return new OAuth2Client(
        createDiscordClientConfig(moreOAuth2ClientConfig),
      );
    case "github":
      return new OAuth2Client(createGitHubClientConfig(moreOAuth2ClientConfig));
    case "google":
      return new OAuth2Client(createGoogleClientConfig(moreOAuth2ClientConfig));
    default:
      throw new Error(`Provider ID "${provider}" not supported`);
  }
}
