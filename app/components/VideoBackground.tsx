/*
 * Copyright (C) 2025-2026 blocktrain.defi
 * https://github.com/blocktrain/blocktrain-dapp
 *
 * SPDX-License-Identifier: GPL-3.0-or-later
 * See the file LICENSE.txt for more information.
 */

"use client";

import type { JSX } from "react";
import { useEffect, useRef } from "react";

import styles from "./VideoBackground.module.css";

type ShakaModule = typeof import("shaka-player/dist/shaka-player.compiled");
type ShakaNamespace = ShakaModule["default"];
type ShakaPlayerConstructor = ShakaNamespace["Player"];

const DEMO_URL: string =
  "https://stream.mux.com/x1s1daoUyt1HAHHPpqyrIM7G501dbX1Nbx9ES01pTE8rE.m3u8";

export function VideoBackground(): JSX.Element | null {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const videoElement: HTMLVideoElement | null = videoRef.current;

    if (videoElement === null) {
      return undefined;
    }

    let isCancelled: boolean = false;
    let player: InstanceType<ShakaPlayerConstructor> | null = null;

    const initializePlayer = async (): Promise<void> => {
      try {
        const shakaModule: ShakaModule =
          await import("shaka-player/dist/shaka-player.compiled");
        const shaka: ShakaNamespace = shakaModule.default;

        if (isCancelled) {
          return;
        }

        shaka.polyfill.installAll();

        if (!shaka.Player.isBrowserSupported()) {
          console.error("Shaka Player is not supported in this browser.");
          return;
        }

        player = new shaka.Player(videoElement);

        player.configure({
          streaming: {
            useNativeHlsOnSafari: false,
          },
        });

        if (isCancelled) {
          await player.destroy();
          return;
        }

        await player.load(DEMO_URL);

        videoElement.muted = true;
        videoElement.playsInline = true;

        const playPromise: Promise<void> = videoElement.play();

        await playPromise.catch((error: unknown) => {
          console.error("Autoplay was blocked:", error);
        });
      } catch (error: unknown) {
        console.error("Error initializing Shaka Player:", error);
      }
    };

    void initializePlayer();

    return (): void => {
      isCancelled = true;

      if (player !== null) {
        void player.destroy();
      }
    };
  }, []);

  return (
    <div className={styles.videoContainer} aria-hidden={true}>
      <video
        ref={videoRef}
        className={styles.videoElement}
        autoPlay
        muted
        loop
        playsInline
      />
    </div>
  );
}
