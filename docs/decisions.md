# Monkey Ventures - Decision Log

This document records important decisions made during the development of Monkey Ventures and Summit Studio.

The purpose is to preserve reasoning so future work stays consistent and we don't repeatedly revisit settled decisions.

---

# Decision 001

## Company Structure

Decision

Monkey Ventures will be the parent company.

Summit Studio Agency is the first business.

Reason

The long-term goal is to build multiple AI-powered businesses rather than a single website agency.

Future businesses will share processes, documentation, automation, and infrastructure.

Status

Permanent

---

# Decision 002

## First Business

Decision

Launch Summit Studio Agency first.

Reason

A website agency has:

- Low startup cost
- Immediate revenue potential
- High demand
- Reusable workflows
- Valuable technical lessons

Revenue from Summit Studio can fund future ventures.

Status

Permanent

---

# Decision 003

## AI Responsibilities

Decision

Separate responsibilities between AI assistants.

ChatGPT

- CTO
- Project Manager
- Business Strategy
- Architecture
- Documentation

Claude

- Senior Software Engineer
- Frontend Developer
- UI/UX Designer
- Code Generation

Reason

Each model specializes in different strengths.

Separating responsibilities reduces context switching and improves consistency.

Status

Permanent

---

# Decision 004

## Website Architecture

Decision

Use one reusable Website Engine.

Businesses supply only data and themes.

Reason

Avoid maintaining separate codebases.

Allows dozens of websites to share one application.

Future businesses should only require:

business.ts

theme.ts

Status

Permanent

---

# Decision 005

## Multi-Business Switching

Decision

Use environment variables to switch between businesses.

Reason

One deployment pipeline.

One codebase.

Easy scaling.

Future additions require minimal work.

Status

Permanent

---

# Decision 006

## Deployment Platform

Decision

Deploy using Vercel.

Reason

- Excellent Next.js support
- GitHub integration
- Automatic deployments
- Minimal server management
- Fast preview deployments

Status

Permanent

---

# Decision 007

## Domain

Decision

Use

summitstudioagency.com

Reason

Professional.

Easy to understand.

Available.

Scalable.

Status

Permanent

---

# Decision 008

## Website Strategy

Decision

Build demo websites before contacting businesses.

Reason

Showing value is significantly stronger than asking owners to imagine a finished product.

New workflow:

Research

↓

Generate Website

↓

Deploy Demo

↓

Contact Owner

Status

Permanent

---

# Decision 009

## Sales Positioning

Decision

Never market AI.

Reason

Customers purchase results.

AI is an internal tool.

Clients care about:

- More leads
- Better branding
- Professional appearance
- Higher conversion

Status

Permanent

---

# Decision 010

## Reviews

Decision

Never fabricate testimonials.

Reason

Maintains trust and avoids legal or ethical concerns.

Use:

- Aggregate ratings
- Review counts
- Paraphrased themes

Never:

- Invent names
- Invent quotations
- Copy review text verbatim

Status

Permanent

---

# Decision 011

## Images

Decision

Use placeholder images in demo websites.

Reason

Avoid copyright concerns.

Replace with client images after purchase.

Status

Permanent

---

# Decision 012

## Development Philosophy

Decision

Build systems instead of one-off websites.

Reason

Every improvement should make future websites easier to produce.

Reusable assets include:

- Components
- Templates
- Prompts
- Design system
- Documentation

Status

Permanent

---

# Decision 013

## Documentation

Decision

Maintain project documentation inside the GitHub repository.

Core documents:

project-brief.md

roadmap.md

session-log.md

decisions.md

Reason

Documentation should be version-controlled alongside the codebase.

This avoids relying on AI chat history.

Status

Permanent

---

# Decision 014

## Project Folder Structure

Decision

Rename the project from

Martinez Landscaping

to

website-engine

Reason

The software is not a client website.

It is the reusable engine that powers every client website.

Client data belongs in business configuration files, not in the application name.

Status

Permanent

---

# Decision 015

## Technical Debt Policy

Decision

Do not interrupt business development to upgrade dependencies unless necessary.

Reason

Working software that acquires customers is more valuable than constantly upgrading frameworks.

Schedule periodic maintenance sprints instead.

Status

Review every 1–2 months.

---

# Decision 016

## Customer Acquisition Strategy

Decision

Prioritize obtaining the first paying customer before adding major new features.

Reason

Customer feedback is more valuable than speculative improvements.

The business should validate demand before expanding functionality.

Status

Current Priority

---

# Decision 017

## Design Philosophy

Decision

Every website should feel like it came from a premium web agency rather than an AI generator.

Reason

The competitive advantage is quality and consistency, not AI itself.

Future work should establish:

- Summit Studio Design System
- Prompt Library
- Reusable UI Components
- Quality Standards

Status

Current Priority

---

# Future Decisions

Record all significant decisions here before implementing them.

Examples:

- Pricing model
- Hosting strategy
- CRM architecture
- Payment processor
- Proposal templates
- Client onboarding workflow
- AI automation tools
- Marketing strategy