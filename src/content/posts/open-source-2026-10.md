---
title: "Open-source log: October 2026"
description: "October work on Lighthouse and Grandine: peer handling, verification, attestation packing, and fallback execution clients."
pubDatetime: 2026-11-02T04:57:28+09:00
category: open-source
format: monthly
draft: false
lang: en
tags: [monthly, ethereum, lighthouse, grandine]
---

In October, I continued working on Lighthouse and Grandine, covering peer handling, verification, attestation packing, and fallback execution clients.

## Lighthouse

### [Reject peers with conflicting finalized roots at the same epoch #10288](https://github.com/sigp/lighthouse/pull/10288)

- Fixed a case where a peer reporting the same finalized epoch with a conflicting root could reach the sync path.
- Used checkpoints already available in `Status`, avoiding an additional database lookup while preserving the existing admission exceptions.

### [Reuse locally KZG-verified Fulu columns in RPC batches #10363](https://github.com/sigp/lighthouse/pull/10363)

- Worked on avoiding repeated KZG verification when the same column arrives through gossip and RPC.
- Reuse requires **full local verification and an exact content match**. Being in the cache alone is not enough.
- Local measurements showed a benefit, but how often reuse is possible in a running node and the whole-node benefit remain unmeasured.

### [Avoid a temporary buffer in RPC response compression #10410](https://github.com/sigp/lighthouse/pull/10410)

- Changed RPC response compression to write directly into the destination buffer, removing an intermediate allocation and copy.
- Compared the complete output against the existing implementation to check that the encoding stayed unchanged.

## Grandine

### [Implement aggregate-level greedy attestation packing for Gloas #1003](https://github.com/grandinetech/grandine/pull/1003)

- Picked up the Gloas attestation packer work again after putting it off for a while.
- Implemented a **greedy baseline** that selects final on-chain aggregates within the block limit.

With the baseline in place, the next step is optimization. Previous research has treated attestation packing as an **NP-hard optimization problem** and evaluated how close greedy solutions come to the optimum. [Lighthouse’s study](https://sigmaprime.io/blog/optimising-attestation-packing/) is one reference I want to explore.

I plan to first map out how Gloas changes the constraints and structure of the problem, then look for approaches from earlier research that could be useful. I’m curious about which inputs the current greedy approach handles well and where there is room for improvement. I also want to measure **how much packing quality can improve and how much additional computation those gains require**.

This will take some work, but I’m looking forward to it. I want to study the algorithms in more depth by reading the relevant papers and existing implementations, and test whether those ideas help in a real client.

### [Keep fallback execution clients updated #1024](https://github.com/grandinetech/grandine/pull/1024)

- Kept fallback execution clients updated even when the preferred endpoint succeeds. The aim is to keep them ready to take over if the preferred client fails.
- Ran two Geth instances to check synchronization and recovery.
