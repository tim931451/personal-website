---
title: Swiss Legal Agent
summary: Multi-agent system that drafts legal opinions in Swiss employment and tenancy law with verifiable sources.
context: Generative AI and Agent Systems, FHNW
period: HS 2026
team: Team of 2
status: in progress
order: 1
featured: true
stack: [LangGraph, MCP, Apertus, BM25, FAISS, LangSmith]
---
<!-- TODO(Tim): nach der Abgabe am 23.11.2026 prüfen, ob das Repo öffentlich wird; dann `repo:` setzen. -->

## Problem

A legal opinion in Swiss employment or tenancy law has to rest on the right provisions, cited correctly. The system drafts such opinions so that every source can be checked.

## Approach and architecture

A router in LangGraph passes each case to specialist agents. A reviewer loop checks the draft, with a human in the loop. Law texts from Fedlex come from our own MCP server. Retrieval combines BM25 and embeddings (FAISS). Guardrails redact personal data, and a citation check tests the cited provisions. LangSmith traces each run. An evaluation compares the Swiss model Apertus with a commercial model, scored by an LLM-as-a-judge.

## My role

I built the Apertus integration with model-based endpoint routing, the processing pipeline with a jurisdiction anchor, our own MCP server fedlex-mcp, the LangGraph orchestration (router, specialist agents, reviewer loop, human in the loop), the input guardrails, the citation check, tracing with LangSmith and the evaluation run of Apertus against a commercial model.

My teammate defined the idea and scope and built the test set, the Fedlex ingestion, the retrieval (BM25 and FAISS embeddings), the UI and the LLM-as-a-judge, and led the storyline and presentation.

## Status and results

In progress. Submission on 23 November 2026. The repository is private while the project is a team assignment.
