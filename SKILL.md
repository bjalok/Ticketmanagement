# Agent Skills

---

## Triage Agent

Fires immediately when a ticket is selected. Its job is **duplicate detection**.

It embeds the incoming ticket description as a semantic vector and scans both the active incident queue and the resolved ticket history from the last 90 days. It computes cosine similarity scores across the corpus and applies an 80 % confidence threshold. If a match is found above the threshold it flags the ticket as a duplicate and links it to the parent ticket. If nothing crosses the threshold it clears the ticket as unique and the pipeline moves forward.

---

## Investigate Agent

Runs after the Triage Agent completes. Its job is **root cause analysis (RCA)**.

It connects directly to the Databridge pipeline execution logs for the failed run, fetches the full log output, and parses the error stack trace. It walks the exception chain — identifying the primary exception, the underlying cause, and any contributing factors such as IAM permission errors, MPM package version mismatches, or field schema misconfigurations. When complete it renders the raw error log in a terminal panel alongside a numbered root-cause summary so the support agent has a clear, sourced explanation of exactly why the pipeline failed.

---

## Recommendation Agent

Runs after the Investigate Agent completes. Its job is **generating resolution steps** from the knowledge platform.

It takes the confirmed root causes from the RCA and queries three internal knowledge sources — g3doc for configuration guides, Yaqs for known procedures and Q&A, and MoMA for change-log documentation and similar incident resolutions. It maps each RCA finding to concrete fix steps and compiles them into a numbered standard resolution plan that the support agent can follow directly.

---

## LifecycleOps Agent

Runs after the Recommendation Agent completes. Its job is **recent run verification** — determining whether the issue is still active or has self-resolved.

It fetches the pipeline execution history after the original failure timestamp and locates the most recent run attempt. It checks the exit code and exception patterns of that run. If the recent run failed with the same errors it issues a **Reopen** recommendation, confirming the issue is active and recurring. If the recent run succeeded it issues a **Close** recommendation, confirming a transient data-driven failure that resolved on retry.

---

## Support Ops Assistant

Lives in the right column alongside the agent pipeline. It has two functions.

**Pipeline summary** — when a ticket is open it shows a plain-language summary of what the AI pipeline found: whether enrichment was triggered, whether a matching SOP scenario was found, whether a historical ticket match exists, and whether an escalation was raised.

**Knowledge base chat** — a free-text chat interface where the support agent can ask questions about any ticket. It handles ticket-specific detail lookups by ticket ID, duplicate-count queries (running its own telemetry animation to scan Buganizer for matching tickets), and general KB queries matched against the SOP library and historical ticket corpus. If no match is found it suggests escalating to L3.
