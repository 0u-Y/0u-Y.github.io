---
title: "EIP-7928 Breakout Call #11 - January 28, 2026"
date: 2026-01-29
description: "Summary of EIP-7928 Breakout Call #11: DevNet 2 readiness, benchmarking strategies, and malicious BAL attack vectors"
categories:
  - "Ethereum Protocol"
tags:
  - "EIP-7928"
  - "Block Access Lists"
  - "DevNet"
  - "Breakout Call"
  - "Security"
---

## Introduction

The 11th EIP-7928 breakout call tackled critical questions about Block Access Lists (BAL): How do we measure their real-world impact? What happens when a malicious proposer exploits them? And most importantly — do we actually need state locations in the BAL?

---

## DevNet 2: Ready to Launch

DevNet 2 launch is targeted for next Wednesday at the latest, possibly earlier. DevNet 1 was highly successful with most clients achieving consensus, minimal forks even with EVM fuzzer running, and sync working smoothly across implementations. The foundation laid in DevNet 1 gives the team confidence to move forward quickly.

However, there was a slight delay due to EIP-7778. The receipt modifications proposed in that EIP were recently reverted back to keeping receipts as-is. Despite this change, EIP-7928 itself isn't blocking progress, and the team remains on track for the planned launch timeline.

---

## Client Optimization Readiness

**Production-Ready:**

- **Geth & Besu**: Flags ready for parallel execution, parallel batch I/O, and parallel state root computation
- These two clients alone are sufficient to begin meaningful performance testing

**In Progress:**

- **Nethermind**: Working on parallel transaction execution and state recomputation; batch read not yet started
- **Reth/Erigon**: No updates provided

The key insight: We don't need all clients ready to start gathering critical benchmark data.

---

## Benchmarking Strategy: Why Real State Matters

The core question benchmarking must answer: **Do we actually need state locations in the BAL?**

### Test Environment Requirements

Testing on empty or small pre-state networks is useless. State reads are too fast without realistic data—you won't see any performance difference. The team is planning mainnet shadow fork as the primary testing ground. Only with mainnet-scale state can we measure real impact.

**BloatNet** will be used for future scenario testing—a shadow fork of mainnet with artificially increased state size, letting us test what happens as mainnet continues to grow.

**DevNet 2** won't be used for performance testing. It's an empty network with ~150M gas limit, focused on consensus mechanisms, BAL payload structure, and new Engine API methods. It's about proving correctness, not measuring performance.

### What We're Measuring

Three scenarios will be compared:

1. **Parallel execution only** (baseline)
2. **Parallel execution + Batch I/O** (full optimization)
3. **Individual impact** of each optimization

**The critical question:** Does Batch I/O (which depends on state locations in BAL) provide enough benefit to justify including state locations?

State locations increase BAL size and add complexity, but they enable batch I/O prefetching. We need hard numbers to make this decision.

---

## Engine API Methods: CL-EL Coordination

**The problem:** BAL is part of the execution payload in beacon blocks. Just like transactions, execution layer clients cannot process blocks without the BAL.

### Two Approaches Debated

**Option 1: Required Field (Current Approach)**

- CL must store BAL or blind it (like transactions)
- Requires new Engine API methods: `getPayloadBodiesByRange` and `getPayloadBodiesByHash` must include BAL
- Some CLs depend on these methods for deduplication and reducing disk storage

**Option 2: Optional Field**

- During gossip: CL passes BAL to EL
- During sync: CL passes payload without BAL; EL fetches from DevP2P
- **Problem:** EL can't synchronously process and return payload status; must return 'syncing' state
- Makes execution flow significantly more complex

**Decision:** Keep current approach (required field) with two new Engine API methods. This allows CL clients to prune BAL for storage efficiency but retrieve it from EL when needed for helping other nodes sync.

---

## The Malicious BAL Attack: A Critical Security Issue

This was the most important discussion of the call. Toni presented a detailed attack scenario with visual diagrams.

### Understanding Block Execution

**Without BAL (60M gas limit):**

```
I/O → Execution → I/O → Execution → State Root Calculation
```

Sequential I/O operations slow everything down.

**With BAL - Honest Proposer (300M gas limit):**

```
Batch I/O (parallel) → Minimal I/O → Execution (parallel) → State Root Calc (parallel)
```

Most state pre-cached through batch I/O. Gas limit can increase significantly.

### The Attack Vector

**The fundamental weakness:** State locations in BAL aren't mapped to transaction indices. From any single transaction's perspective, you cannot determine if the BAL's state locations are correct or garbage.

**Attack scenario:**

1. Malicious proposer creates BAL with `(gas_limit - max_tx_size) / 2100` storage slots
2. All declared storage slots are garbage—never accessed
3. Block's transactions only perform heavy computation

**Why this works:**

- Each core executing transactions can validate state diffs correctly
- But storage keys aren't mapped to transaction indices
- No single core can determine if the BAL is invalid
- Only after executing ALL transactions can you realize the BAL was garbage

**The damage:**

- Proposer sacrifices their block (it's invalid)
- Forces validators to waste batch I/O + execution time
- Potentially triggers reorgs on next slot
- Limits how aggressively we can scale gas limits

### Three Proposed Solutions

**Option 1: Do Nothing (Smart Client-Level Detection)**

- Set caps on BAL based on gas limits
- Track gas usage and accessed locations during execution
- Fail early if remaining gas can't access all declared slots
- Uncertainty: Is worst-case still equivalent to having no state locations?

**Option 2: Remove State Locations Entirely**

- Eliminates attack vector completely
- Also eliminates batch I/O benefits
- Depends on benchmark results

**Option 3: Add First Access Index (Most Elegant)**

Map each state location to the transaction index where it's first accessed.

**Benefits:**

- Early failure detection (can fail after first transaction batch, not all transactions)
- Correct-order prefetching
- No duplication of addresses and storage keys

**Costs:**

- Average +4% size increase (1-4 KiB compressed)
- Worst-case: 0.92 MB → 0.97 MB (still 0.43 MB smaller than worst-case calldata block)
- Added implementation complexity

**How it prevents the attack:**

Without first_access_index:

- 8 transactions, 4 cores
- Must execute all 8 before discovering BAL is invalid

With first_access_index:

- Execute first 4 transactions (one per core)
- Each core checks: did this transaction access slots with matching first_access_index?
- Can fail immediately if transaction only does computation
- No need to execute remaining 4 transactions

---

## Additional Discussions

**Specification Status:**

- Felipe and Rahul created comprehensive tests for access edge cases
- Clients passing tests, good alignment across implementations
- Geth's simplification proposal rejected due to potential griefing vector (1-gas call attack)

**Performance Metrics:**

Stefan proposed OpenTelemetry for standardized metrics across clients. Key metrics: prefetching time, parallel execution efficiency, batch I/O performance. Geth and Reth implementing support. Goal: Grafana visualization in Kurtosis for apples-to-apples comparisons.

---

## Key Takeaways

1. **DevNet 2 is ready** — Focus on consensus testing, not performance measurement
2. **State locations decision is data-driven** — Need benchmark results from mainnet shadow fork
3. **Malicious BALs are a real threat** — Not theoretical; could trigger reorgs and limit scaling
4. **First access index is promising** — Elegant solution with modest overhead (~4% size increase)
5. **Hard data required** — No decision until comprehensive benchmarks complete

---

## References

- [EIP-7928 Specification](https://github.com/ethereum/EIPs/pull/7928)
- [PR #11181 (First Access Index)](https://github.com/ethereum/EIPs/pull/11181)
- Call Recording: https://www.youtube.com/watch?v=v4_5quvIJh0&t=354s

---

## Closing Thoughts

What struck me about this call was the maturity of the decision-making process. Nobody rushed to conclusions. Nobody dismissed security concerns as unlikely. Core developers acknowledged uncertainty, proposed multiple solutions with clear tradeoffs, and committed to letting data drive decisions.

---
