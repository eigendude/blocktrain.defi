/*
 * Copyright (C) 2025-2026 blocktrain.fi
 * https://github.com/blocktrain/blocktrain-dapp
 *
 * SPDX-License-Identifier: GPL-3.0-or-later
 * See the file LICENSE.txt for more information.
 */

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * Externalize packages that are only needed at runtime so Turbopack
   * doesn't attempt to bundle them.
   */
  serverExternalPackages: ["pino-pretty", "lokijs", "encoding"],
};

export default nextConfig;
