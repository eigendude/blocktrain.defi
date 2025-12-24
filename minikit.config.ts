/*
 * Copyright (C) 2025-2026 blocktrain.defi
 * https://github.com/blocktrain/blocktrain-dapp
 *
 * SPDX-License-Identifier: GPL-3.0-or-later
 * See the file LICENSE.txt for more information.
 */

const ROOT_URL: string =
  process.env.NEXT_PUBLIC_URL ||
  (process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`) ||
  "http://localhost:3000";

type MiniAppConfig = {
  accountAssociation: {
    header: string;
    payload: string;
    signature: string;
  };
  baseBuilder: {
    ownerAddress: string;
  };
  miniapp: {
    version: string;
    name: string;
    subtitle: string;
    description: string;
    screenshotUrls: string[];
    iconUrl: string;
    splashImageUrl: string;
    splashBackgroundColor: string;
    homeUrl: string;
    webhookUrl: string;
    primaryCategory: string;
    tags: string[];
    heroImageUrl: string;
    tagline: string;
    ogTitle: string;
    ogDescription: string;
    ogImageUrl: string;
  };
};

/**
 * MiniApp configuration object. Must follow the mini app manifest specification.
 *
 * @see {@link https://docs.base.org/mini-apps/features/manifest}
 */
export const minikitConfig: Readonly<MiniAppConfig> = {
  accountAssociation: {
    header: "",
    payload: "",
    signature: "",
  },
  baseBuilder: {
    ownerAddress: "",
  },
  miniapp: {
    version: "1",
    name: "blocktrain.defi",
    subtitle: "",
    description: "",
    screenshotUrls: [],
    iconUrl: `${ROOT_URL}/icon.png`,
    splashImageUrl: `${ROOT_URL}/splash.png`,
    splashBackgroundColor: "#000000",
    homeUrl: ROOT_URL,
    webhookUrl: `${ROOT_URL}/api/webhook`,
    primaryCategory: "utility",
    tags: ["example"],
    heroImageUrl: `${ROOT_URL}/hero.png`,
    tagline: "",
    ogTitle: "",
    ogDescription: "",
    ogImageUrl: `${ROOT_URL}/hero.png`,
  },
} as const;
