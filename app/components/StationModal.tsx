/*
 * Copyright (C) 2025-2026 blocktrain.defi
 * https://github.com/blocktrain/blocktrain-dapp
 *
 * SPDX-License-Identifier: GPL-3.0-or-later
 * See the file LICENSE.txt for more information.
 */

"use client";

import type { JSX } from "react";

import styles from "./StationModal.module.css";

export type Station = {
  name: string;
  description: string;
};

export type StationModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const STATIONS: Station[] = [
  {
    name: "StudSupply",
    description: "Deposit into the $STUD pool to earn yield.",
  },
  {
    name: "StudLend",
    description:
      "Lend your $STUD deposit to earn more yield and unlock borrowing.",
  },
  {
    name: "TrainMint",
    description:
      "Mint $TRAIN against your locked $STUD deposit; burn $TRAIN to repay.",
  },
  {
    name: "TrainStake",
    description: "Stake concentrated $TRAIN liquidity for maximum yield.",
  },
];

export function StationModal({
  isOpen,
  onClose,
}: StationModalProps): JSX.Element {
  if (!isOpen) {
    return <></>;
  }

  return (
    <div className={styles.modalOverlay} role="dialog" aria-modal="true">
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>BlockTrain Stations</h3>
          <button
            type="button"
            className={styles.closeButton}
            aria-label="Close station list"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <ol className={styles.stationList}>
          {STATIONS.map((station: Station) => (
            <li key={station.name}>
              <span className={styles.stationName}>{station.name}</span>
              <span className={styles.stationDescription}>
                {station.description}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
