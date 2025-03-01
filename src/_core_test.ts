// Copyright 2023 the Deno authors. All rights reserved. MIT license.
import { assert, assertEquals, Status, type Tokens } from "../deps.ts";
import {
  deleteOAuthSession,
  deleteTokensBySiteSession,
  getOAuthSession,
  getTokensBySiteSession,
  type OAuthSession,
  redirect,
  setOAuthSession,
  setTokensBySiteSession,
} from "./_core.ts";

Deno.test("(get/set/delete)OAuthSession()", async () => {
  const id = crypto.randomUUID();

  // OAuth session doesn't yet exist
  assertEquals(await getOAuthSession(id), null);

  const oauthSession: OAuthSession = {
    state: crypto.randomUUID(),
    codeVerifier: crypto.randomUUID(),
  };
  await setOAuthSession(id, oauthSession);

  assertEquals(await getOAuthSession(id), oauthSession);

  await deleteOAuthSession(id);

  assertEquals(await getOAuthSession(id), null);
});

Deno.test("(get/set/delete)TokensBySiteSession()", async () => {
  const id = crypto.randomUUID();

  // Tokens don't yet exist
  assertEquals(await getTokensBySiteSession(id), null);

  const tokens: Tokens = {
    accessToken: crypto.randomUUID(),
    tokenType: crypto.randomUUID(),
  };
  await setTokensBySiteSession(id, tokens);

  assertEquals(await getTokensBySiteSession(id), tokens);

  await deleteTokensBySiteSession(id);

  assertEquals(await getTokensBySiteSession(id), null);
});

Deno.test("redirect()", () => {
  const location = "/hello-there";

  const response = redirect(location);
  assert(!response.ok);
  assertEquals(response.body, null);
  assertEquals(response.headers.get("location"), location);
  assertEquals(response.status, Status.Found);
});
