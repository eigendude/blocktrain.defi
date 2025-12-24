/*
 * Copyright (C) 2025-2026 blocktrain.fi
 * https://github.com/blocktrain/blocktrain-dapp
 *
 * SPDX-License-Identifier: GPL-3.0-or-later
 * See the file LICENSE.txt for more information.
 */

import { withValidManifest } from "@coinbase/onchainkit/minikit";

import { minikitConfig } from "../../../minikit.config";

export async function GET(): Promise<Response> {
  return Response.json(withValidManifest(minikitConfig));
}
