/*
 * Copyright (C) 2025-2026 blocktrain.defi
 * https://github.com/blocktrain/blocktrain-dapp
 *
 * SPDX-License-Identifier: GPL-3.0-or-later
 * See the file LICENSE.txt for more information.
 */

"use client";

import type { JSX } from "react";

import styles from "./RulesModal.module.css";

export type Rule = {
  name: string;
  description: string;
};

export type RulesModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const RULES: Rule[] = [
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

export function RulesModal({ isOpen, onClose }: RulesModalProps): JSX.Element {
  if (!isOpen) {
    return <></>;
  }

  return (
    <div className={styles.modalOverlay} role="dialog" aria-modal="true">
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>BlockTrain rules</h3>
          <button
            type="button"
            className={styles.closeButton}
            aria-label="Close rules"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <ol className={styles.rulesList}>
          {RULES.map((rule: Rule) => (
            <li key={rule.name}>
              <span className={styles.ruleName}>{rule.name}</span>
              <span className={styles.ruleDescription}>{rule.description}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
