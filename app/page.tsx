/*
 * Copyright (C) 2025-2026 blocktrain.defi
 * https://github.com/blocktrain/blocktrain-dapp
 *
 * SPDX-License-Identifier: GPL-3.0-or-later
 * See the file LICENSE.txt for more information.
 */

"use client";

import { useMiniKit } from "@coinbase/onchainkit/minikit";
import { Wallet } from "@coinbase/onchainkit/wallet";
import { useEffect, useState } from "react";
import { JSX } from "react/jsx-runtime";

// import { useQuickAuth } from "@coinbase/onchainkit/minikit";
import { LegoBrick } from "./components/LegoBrick";
import { StationModal } from "./components/StationModal";
import { VideoBackground } from "./components/VideoBackground";
import styles from "./page.module.css";

export default function Home(): JSX.Element {
  // If you need to verify the user's identity, you can use the useQuickAuth hook.
  // This hook will verify the user's signature and return the user's FID. You can update
  // this to meet your needs. See the /app/api/auth/route.ts file for more details.
  // Note: If you don't need to verify the user's identity, you can get their FID and other user data
  // via `useMiniKit().context?.user`.
  // const { data, isLoading, error } = useQuickAuth<{
  //   userFid: string;
  // }>("/api/auth");

  const { setMiniAppReady, isMiniAppReady }: ReturnType<typeof useMiniKit> =
    useMiniKit();
  const [isStationModalOpen, setIsStationModalOpen] = useState<boolean>(false);

  useEffect((): void => {
    if (!isMiniAppReady) {
      setMiniAppReady();
    }
  }, [setMiniAppReady, isMiniAppReady]);

  return (
    <div className={styles.page}>
      <VideoBackground />

      <div className={styles.container}>
        <header className={styles.headerWrapper}>
          <Wallet />
        </header>

        <div className={styles.content}>
          <LegoBrick />
          <h1 className={styles.title}>blocktrain.defi</h1>

          <button
            type="button"
            className={styles.stationButton}
            onClick={() => setIsStationModalOpen(true)}
          >
            Train Depots
          </button>
        </div>
      </div>

      <StationModal
        isOpen={isStationModalOpen}
        onClose={() => setIsStationModalOpen(false)}
      />
    </div>
  );
}
