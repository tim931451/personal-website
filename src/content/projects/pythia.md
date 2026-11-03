---
title: Pythia, AI advisor for SMEs
summary: AI advisor that assesses an SME's AI maturity and proposes use cases with a business case.
context: FHNW MAKEathon
period: October 2026
team: Two-day hackathon, team of 5
status: shipped
order: 2
featured: true
stack: [AWS Bedrock AgentCore, Multi-agent, Guardrails, Streamlit]
---

## Problem

An SME that wants to use AI first needs to know where it stands and which use cases are worth the effort. Pythia assesses the company's AI maturity and proposes use cases, each with a business case.

## Approach and architecture

Seven role agents run on AWS Bedrock AgentCore. They reach their tools through a gateway, work within guardrails and draw on a knowledge base. The team showed the result as a live demo in a Streamlit web app.

## My role

I built the AI core: seven role agents, tools via a gateway, guardrails and a knowledge base on AWS Bedrock AgentCore. A teammate built the frontend and the live demo as a Streamlit web app.

## Status and results

Shipped as a live demo at the two-day FHNW MAKEathon in October 2026. Part of the team will compete again as Team Pythia at Hack Apertus Basel (4 to 5 December 2026).
