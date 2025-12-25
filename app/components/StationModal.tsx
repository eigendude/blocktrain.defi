/*
 * Copyright (C) 2025-2026 blocktrain.fi
 * https://github.com/blocktrain/blocktrain-dapp
 *
 * SPDX-License-Identifier: GPL-3.0-or-later
 * See the file LICENSE.txt for more information.
 */

"use client";

import { type JSX, useState } from "react";

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
  const [activeStation, setActiveStation] = useState<Station | null>(null);
  const modalTitle: string =
    activeStation !== null ? activeStation.name : "BlockTrain Stations";

  const handleClose = (): void => {
    if (activeStation !== null) {
      setActiveStation(null);
      return;
    }

    onClose();
  };

  const handleStationSelect = (station: Station): void => {
    setActiveStation(station);
  };

  if (!isOpen) {
    return <></>;
  }

  return (
    <div className={styles.modalOverlay} role="dialog" aria-modal="true">
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>{modalTitle}</h3>
          <button
            type="button"
            className={styles.closeButton}
            aria-label={
              activeStation !== null
                ? "Go back to station list"
                : "Close station list"
            }
            onClick={handleClose}
          >
            {activeStation !== null ? "←" : "×"}
          </button>
        </div>

        <div className={styles.panelContainer}>
          <div
            className={`${styles.panel} ${
              activeStation === null ? styles.panelVisible : styles.panelHidden
            }`}
          >
            <ol className={styles.stationList}>
              {STATIONS.map((station: Station) => (
                <li key={station.name}>
                  <button
                    type="button"
                    className={styles.stationButton}
                    onClick={(): void => handleStationSelect(station)}
                  >
                    <span className={styles.stationName}>{station.name}</span>
                    <span className={styles.stationDescription}>
                      {station.description}
                    </span>
                  </button>
                </li>
              ))}
            </ol>
          </div>

          <div
            className={`${styles.panel} ${styles.detailPanel} ${
              activeStation !== null ? styles.panelVisible : styles.panelHidden
            }`}
          >
            {activeStation !== null ? (
              <div className={styles.detailContent}>
                <p className={styles.detailStationName}>{activeStation.name}</p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
