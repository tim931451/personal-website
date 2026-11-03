---
title: Swiss Legal Agent
summary: Multi-agent system that drafts legal opinions in Swiss employment and tenancy law with verifiable sources.
context: Generative AI and Agent Systems, FHNW
period: HS 2026
team: Team of 2
status: in progress
order: 1
featured: true
diagram: "Architecture of the Swiss Legal Agent. A legal case passes input guardrails (PII redaction, jailbreak detection) and a router with an off-topic check to specialist agents. Their answer goes through a citation check, which returns errors to the agent, and a reviewer, which sends it back at most twice, before the draft opinion with facts, legal question, norms, subsumption, result and sources. Human in the loop on low confidence or a missing source. The agents use Apertus with endpoint routing and the retrieval (BM25 and FAISS) fed by the Fedlex ingestion; the own MCP server fedlex-mcp is planned. A jurisdiction anchor for Swiss federal law sits in every agent prompt. Tracing with LangSmith; the evaluation run compares Apertus with a commercial model using the test set and the LLM-as-a-judge. My parts: guardrails, router, agents, citation check, reviewer, human in the loop, fedlex-mcp, Apertus, tracing and evaluation run. My teammate: retrieval, Fedlex ingestion, test set and LLM-as-a-judge."
stack: [LangGraph, MCP, Apertus, BM25, FAISS, LangSmith]
teamStack: [BM25, FAISS]
---
<!-- TODO(Tim): nach der Abgabe am 23.11.2026 prüfen, ob das Repo öffentlich wird; dann `repo:` setzen. -->

## Problem

A legal opinion in Swiss employment or tenancy law has to rest on the right provisions, cited correctly. The system drafts such opinions so that every source can be checked.

## Approach and architecture

The orchestration runs in LangGraph. Input guardrails redact personal data and detect jailbreaks before any model call. A router rejects off-topic requests and passes each case to specialist agents, whose prompts all carry a jurisdiction anchor: Swiss federal law only. A citation check tests the cited provisions and sends errors back to the agent. A reviewer then sends the draft back at most twice. On low confidence or a missing source, a human takes over. The draft follows a fixed schema: facts, legal question, norms, subsumption, result, sources.

The agents run on Apertus with model-based endpoint routing and draw on a retrieval that combines BM25 and embeddings (FAISS) over the ingested Fedlex law texts. Our own MCP server for Fedlex is built but not yet connected to the graph. LangSmith traces each run. An evaluation run compares Apertus with a commercial model, scored by an LLM-as-a-judge on a test set.

## My role

I built the Apertus integration with model-based endpoint routing, the processing pipeline (the first graph with state and output schema), the jurisdiction anchor in all agent prompts, our own MCP server fedlex-mcp, the LangGraph orchestration (router, specialist agents, reviewer loop, human in the loop), the input guardrails, the citation check, tracing with LangSmith and the evaluation run of Apertus against a commercial model.

My teammate defined the idea and scope and built the test set, the Fedlex ingestion, the retrieval (BM25 and FAISS embeddings), the UI and the LLM-as-a-judge, and led the storyline and presentation.

## Status and results

In progress. Submission on 23 November 2026. The repository is private while the project is a team assignment.
