---
title: LexLoop
summary: A contextual bandit learns which of three LLM agents solves a legal case best, rewarded via an LLM-as-a-judge rubric.
context: Reinforcement Learning, FHNW
period: HS 2026
team: Team of 4
status: in progress
order: 5
stack: [Python, Gymnasium, LiteLLM, pytest]
---

## Problem

Three LLM agents can work on the same legal case, but not equally well. The project lets a learner decide which agent to use for which case.

## Approach and architecture

A contextual bandit picks one of three LLM agents for each case. Its reward comes from an LLM-as-a-judge rubric. The environment is built with Gymnasium, model calls go through LiteLLM, and tests run with pytest.

## My role

I built the environment, the run logging and the Apertus integration, and I am responsible for documentation and QA.

## Status and results

In progress. The repository is private.
