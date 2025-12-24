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
import shaka from "shaka-player/dist/shaka-player.ui";

import styles from "./VideoBackground.module.css";

const DEMO_URL =
  "https://stream.mux.com/x1s1daoUyt1HAHHPpqyrIM7G501dbX1Nbx9ES01pTE8rE.m3u8";

export function VideoBackground(): JSX.Element | null {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (!videoRef.current) {
      return undefined;
    }

    shaka.polyfill.installAll();

    if (!shaka.Player.isBrowserSupported()) {
      console.error("Shaka Player is not supported in this browser.");
      return undefined;
    }

    const player = new shaka.Player(videoRef.current);

    player.configure({
      streaming: {
        useNativeHlsOnSafari: false,
      },
    });

    const initializePlayer = async (): Promise<void> => {
      try {
        await player.load(DEMO_URL);
        const videoElement = videoRef.current;

        if (!videoElement) {
          return;
        }

        videoElement.muted = true;
        const playPromise = videoElement.play();

        if (playPromise) {
          await playPromise.catch((error) => {
            console.error("Autoplay was blocked:", error);
          });
        }
      } catch (error) {
        console.error("Error initializing Shaka Player:", error);
      }
    };

    void initializePlayer();

    return () => {
      void player.destroy();
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
