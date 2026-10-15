---
title: "From a question to a reproducible experiment"
description: "A working structure for investigating Ethereum clients: define the question, collect evidence, and leave room for a different answer."
pubDatetime: 2026-10-01T09:00:00+09:00
category: research
format: investigation
featured: true
sample: true
tags: [ethereum, methodology]
---

## Start with a question

This is a **sample research note**, not a report of completed research. Replace it with a question from your own work.

A useful entry can start before there is a result. Write down the behavior you want to understand, the observation that prompted the question, and what evidence would change your mind.

## Read before measuring

Keep a short reading log. Separate what a source establishes from your interpretation, and record a URL or revision so that you can revisit it.

| Source                                  | Relevant question                   | What to check next                  |
| --------------------------------------- | ----------------------------------- | ----------------------------------- |
| Protocol specification, pinned revision | What behavior is required?          | Identify the relevant section       |
| Client implementation, pinned commit    | Where is that behavior implemented? | Trace callers and state changes     |
| Prior experiment and its dataset        | What was measured?                  | Check whether its assumptions apply |

## Make the experiment repeatable

Record the client version, configuration, machine, input data, and exact command. The following is an illustrative manifest, not a runnable client command:

```json
{
  "client_commit": "replace-with-commit",
  "input_dataset": "replace-with-dataset-and-checksum",
  "question": "replace-with-a-testable-question",
  "repetitions": 5
}
```

![An example experiment workflow: question, evidence, experiment, and review.](/images/research-workflow.svg)

## Results, limitations, and the next question

Leave these sections open until you have measurements. Describe failures and confounding factors alongside successful runs.

- **Observation:** What did you actually measure?
- **Interpretation:** Which explanation fits, and what else might explain it?
- **Limitations:** Which conditions have not been tested?
- **Next step:** What is the smallest experiment that could distinguish the explanations?
