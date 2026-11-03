---
title: Pythia, AI advisor for SMEs
summary: AI advisor that assesses an SME's AI maturity and proposes use cases with a business case.
context: FHNW MAKEathon
period: October 2026
team: Two-day hackathon, team of 5
status: shipped
order: 2
featured: true
diagram: "Architecture of Pythia. The Streamlit web app, built by a teammate, sends the user input through a guardrail to seven role agents on AWS Bedrock AgentCore. The agents use tools via a gateway and a knowledge base, and return the AI maturity assessment and use cases with a business case to the app. My part: guardrail, role agents, gateway and knowledge base."
stack: [AWS Bedrock AgentCore, Multi-agent, Guardrails, Streamlit]
teamStack: [Streamlit]
---

## Problem

An SME that wants to use AI first needs to know where it stands and which use cases are worth the effort. Pythia assesses the company's AI maturity and proposes use cases, each with a business case.

## Approach and architecture

The Streamlit web app sends the user input through a guardrail to seven role agents on AWS Bedrock AgentCore. The agents reach their tools through a gateway and draw on a knowledge base. The result goes back to the app.

## My role

I built the AI core: seven role agents, tools via a gateway, the input guardrail and a knowledge base on AWS Bedrock AgentCore. A teammate built the frontend and the live demo as a Streamlit web app.

## Status and results

Shipped as a live demo at the two-day FHNW MAKEathon in October 2026. Part of the team will compete again as Team Pythia at Hack Apertus Basel (4 to 5 December 2026).
