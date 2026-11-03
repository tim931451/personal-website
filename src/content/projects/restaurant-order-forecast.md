---
title: Restaurant order forecast
summary: Pipeline that forecasts restaurant orders from weather data, with a regression model and a dashboard on Google Cloud Run.
context: Data Engineering and Wrangling, FHNW
period: FS 2026
team: Group project
status: shipped
order: 7
stack: [Weather API, Regression, Streamlit, Docker, Google Cloud Run]
repo: https://github.com/tim931451/fus-asia-dashboard
grade: Grade 6.0 (Swiss scale, 6 = best)
draft: true
---
<!-- TODO(Tim): Teamgrösse (2 oder 3) und eigenen Anteil ergänzen, dann `team` anpassen und `draft: true` entfernen. -->

## Problem

Forecast how many orders a restaurant will receive, using the weather as an input.

## Approach and architecture

A pipeline pulls data from a weather API and feeds a regression model. A dashboard shows the forecast. Everything is containerised with Docker and runs on Google Cloud Run.

## My role

<!-- TODO(Tim): eigener Anteil -->

## Status and results

Shipped.
