---
title: SOC Triage Assistant
summary: Security incident triage for SMEs, built on Microsoft's GUIDE dataset with 9.5 million evidence records.
context: Machine Learning and Knowledge-Based Systems, FHNW
period: HS 2026
team: Team of 2
status: in progress
order: 3
featured: true
diagram: "Architecture of the SOC Triage Assistant. The GUIDE dataset with 9.5 million evidence records goes through a data pipeline with leakage check into the MITRE ATT&CK mapping, which is part of the ontology and rule engine. The pipeline also feeds the ML models (in progress), which produce the incident triage. Ontology features for the ML models are planned. Everything lives in a reproducible repository and is my part."
stack: [Python, Polars, scikit-learn, NetworkX, MITRE ATT&CK]
---

## Problem

Security incidents have to be triaged before anyone can act on them. The project builds this triage for SMEs on Microsoft's GUIDE dataset, which holds 9.5 million evidence records.

## Approach and architecture

A data pipeline prepares the evidence records and checks for leakage. The records are mapped to MITRE ATT&CK as part of an ontology with a rule engine. The pipeline also feeds the machine learning models, which are in progress; features from the ontology are planned as a further input. The repository is set up to be reproducible.

## My role

I built the data pipeline with a leakage check, the mapping to MITRE ATT&CK, the ontology and rule engine, and the reproducible repository. I am also responsible for the ML models, which are in progress.

## Status and results

In progress. The repository is private.
