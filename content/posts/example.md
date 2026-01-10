+++
date = '2026-01-10T22:14:42+09:00'
draft = true
title = 'Example'
+++


## Overview
As Ethereum approaches the **HEgota** upgrade, scaling data availability via **PeerDAS** is becoming a critical priority. While the theoretical specifications are promising, the real-world networking overhead of cell-level retrieval remains under-explored. In this post, I analyze the latency costs associated with PeerDAS cell propagation in a multi-client devnet environment.

## Methodology
To measure the baseline performance, I utilized:
- **Client:** Lighthouse (PeerDAS-enabled branch)
- **Environment:** Local devnet via Kurtosis
- **Metrics:** Cell retrieval time vs. Blob count (6 to 48 blobs)

## Key Findings
Initial benchmarks show that as the number of blobs increases to 48, the networking overhead for sampling individual cells does not scale linearly. This suggests a potential bottleneck in the current `libp2p` gossipsub scoring when handling high-frequency cell messages.

*(Stay tuned for the full dataset in the next post.)*