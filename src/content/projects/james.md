---
title: James
summary: German-language voice assistant for macOS with local wake word and speech recognition and about 1.7 s to first audio.
context: Personal project
period: Since October 2026
team: Solo
status: in progress
order: 4
featured: true
diagram: "Architecture of James. German voice input goes through a local wake word (openWakeWord) and local speech recognition (Parakeet MLX) to the Claude API with tool use. Claude calls tools for weather, news and web search, runs write actions only after spoken confirmation, and answers through speech output with ElevenLabs and Piper as local fallback. About 1.7 s to first audio."
stack: [openWakeWord, Parakeet MLX, Claude API, ElevenLabs, Piper]
---

## Problem

A voice assistant for macOS that understands German, answers quickly and does not act on its own.

## Approach and architecture

Wake word and speech recognition run locally with openWakeWord and Parakeet MLX. Answers come from the Claude API with tool use for weather, news and web search. Speech output uses ElevenLabs, with Piper as a local fallback. Write actions only run after a spoken confirmation.

## My role

Solo project, I designed and built the whole pipeline.

## Status and results

In progress. About 1.7 s to first audio. The repository is private.
