// CMS Data Store, Analytics Tracker & State Manager for StayDriven

const STORAGE_KEY = 'staydriven_updates_v2';
const AUTH_KEY = 'staydriven_admin_auth';
const SETTINGS_KEY = 'staydriven_admin_settings_v2';
const ANALYTICS_KEY = 'staydriven_site_analytics_v2';

export const INITIAL_UPDATES = [
  {
    id: "upd-001",
    slug: "free-vs-paid-ai-tools-2026",
    tag: "AI TOOL",
    title: "Reinventing Workflows: Free vs Paid AI Tools in 2026",
    excerpt: "AI-driven demand predictions and model tiering are reshaping how teams handle computing budgets and operational velocity.",
    date: "August 21, 2026",
    authorName: "StayDriven Editorial",
    authorAvatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80",
    status: "published",
    thumbnailUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80",
    contentType: "both",
    analytics: {
      viewCount: 1840,
      uniqueViewCount: 1290,
      whatsappClickCount: 142,
      pdfOpenCounts: {
        "AI Tooling Decision Matrix 2026 (PDF)": 412
      },
      resourceLinkClicks: {
        "Anthropic Benchmark Comparison Report": 268,
        "Staying Ahead AI Tool Stack Template": 185
      },
      lastViewedAt: "2026-08-23T04:45:00.000Z",
      referrers: { "direct": 780, "whatsapp": 590, "google": 340, "twitter": 130 }
    },
    article: {
      sectionTitle: "Navigating Tiered Model Access in Enterprise & Freelance Workflows",
      sectionSubtitle: "Why zero-dollar models are closing the foundational gap, but premium orchestration and low-latency context caching keep the enterprise crown.",
      stories: [
        {
          number: 1,
          heading: "The commoditization of foundational token processing",
          paragraphs: [
            {
              label: "What changes.",
              text: "Open-weight and subsidized base models now achieve 92% of frontier reasoning benchmarks at zero token marginal cost for casual daily usage."
            },
            {
              label: "Why it matters.",
              text: "Teams no longer need to provision $20/seat licenses for simple copy extraction, basic summarization, or semantic classification across standard internal tools."
            },
            "When evaluating commercial AI stacks in 2026, the primary cost driver is no longer raw intelligence, but low-latency context caching and reliable function calling."
          ],
          pullQuote: "“Our mission is to give every builder, no matter their team size, access to world-class AI tools that make growth simple and sustainable.”"
        },
        {
          number: 2,
          heading: "When the paid layer remains irreplaceable",
          paragraphs: [
            {
              label: "Key takeaway.",
              text: "Frontier reasoning models with active search grounding, agentic tool loops, and massive 2M+ context windows justify premium tiers within minutes of high-stakes debugging."
            },
            {
              label: "Action item.",
              text: "Audit your team seats: keep 80% of daily operators on fast commodity models, and reserve frontier subscriptions for architecture leads and security engineers."
            }
          ],
          pullQuote: "“The difference between good and world-class AI deployment isn't token count—it's deterministic execution and autonomous error recovery.”"
        }
      ],
      broaderContext: "As model capabilities compress, the true enterprise moat is domain-specific data formatting, low-friction tool verification layers, and real-time evaluation suites."
    },
    pdfs: [
      {
        label: "AI Tooling Decision Matrix 2026 (PDF)",
        driveUrl: "https://drive.google.com/file/d/1ExampleDrivePdfMatrix/view?usp=sharing"
      }
    ],
    resourceLinks: [
      { label: "Anthropic Benchmark Comparison Report", url: "https://anthropic.com/research" },
      { label: "Staying Ahead AI Tool Stack Template", url: "https://stayingahead.community/tools" }
    ],
    createdAt: "2026-08-21T09:00:00.000Z",
    updatedAt: "2026-08-21T10:30:00.000Z"
  },
  {
    id: "upd-002",
    slug: "daily-ai-updates-20-august",
    tag: "DAILY AI UPDATE",
    title: "Smarter Supply Chains & Sub-150ms Edge Models",
    excerpt: "Learn how real-time multimodal audio and automated web agents are streamlining enterprise operational logistics.",
    date: "August 20, 2026",
    authorName: "Sarah Mitchell",
    authorAvatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&h=200&q=80",
    status: "published",
    thumbnailUrl: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80",
    contentType: "article",
    analytics: {
      viewCount: 1450,
      uniqueViewCount: 960,
      whatsappClickCount: 98,
      pdfOpenCounts: {},
      resourceLinkClicks: {
        "Daily Summary Slide Deck": 194
      },
      lastViewedAt: "2026-08-23T03:50:00.000Z",
      referrers: { "direct": 610, "whatsapp": 490, "google": 240, "linkedin": 110 }
    },
    article: {
      sectionTitle: "Morning Briefing: Fast Real-Time Audio, Deep Search & Multi-Agent Swarms",
      sectionSubtitle: "Catch up on the 3 biggest breakthroughs shifting enterprise workflows and conversational interfaces today.",
      stories: [
        {
          number: 1,
          heading: "Sub-150ms speech-to-speech models deployed at edge",
          paragraphs: [
            {
              label: "What changes.",
              text: "Native multimodal speech models remove transcription steps entirely, capturing emotional tone, cadence, and instant interruptions in fluid real-time calls."
            },
            {
              label: "Why it matters.",
              text: "Customer support, live translation, and voice coding assistants now feel like talking directly with an expert colleague without lag."
            }
          ],
          pullQuote: "“Removing speech-to-text intermediary layers cuts interaction latency by 80% while preserving subtle vocal nuances.”"
        },
        {
          number: 2,
          heading: "Autonomous browser agents pass web task benchmarks",
          paragraphs: [
            {
              label: "What changes.",
              text: "Vision-based web agents can now navigate complex enterprise dashboards, handle multi-factor popups, and complete end-to-end procurement tasks autonomously."
            }
          ]
        }
      ],
      broaderContext: "Expect major productivity suites to roll out autonomous agentic sidebars over the coming quarter."
    },
    pdfs: [],
    resourceLinks: [
      { label: "Daily Summary Slide Deck", url: "https://stayingahead.community/slides/20-aug" }
    ],
    createdAt: "2026-08-20T08:00:00.000Z",
    updatedAt: "2026-08-20T08:00:00.000Z"
  },
  {
    id: "upd-003",
    slug: "daily-ai-update-19-august",
    tag: "DAILY AI UPDATE",
    title: "Cost Reduction Through Autonomous Automation",
    excerpt: "A look at how engineering leaders cut operational overhead by 65% with scheduled asynchronous agent swarms.",
    date: "August 19, 2026",
    authorName: "Michael Brown",
    authorAvatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80",
    status: "published",
    thumbnailUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80",
    contentType: "pdf",
    analytics: {
      viewCount: 1120,
      uniqueViewCount: 780,
      whatsappClickCount: 82,
      pdfOpenCounts: {
        "Staying Ahead 19-Aug Daily Briefing & Prompts (PDF)": 310
      },
      resourceLinkClicks: {
        "Community Discussion Thread": 82
      },
      lastViewedAt: "2026-08-23T02:10:00.000Z",
      referrers: { "direct": 450, "whatsapp": 420, "google": 190 }
    },
    article: {
      sectionTitle: "Executive Summary: Slashing Repetitive Engineering Cycles",
      sectionSubtitle: "Download the slide deck and tactical playbook for setting up background asynchronous agent queues.",
      stories: [
        {
          number: 1,
          heading: "Asynchronous task decomposition and batch execution",
          paragraphs: [
            {
              label: "Key takeaway.",
              text: "Running autonomous agents during off-peak hours on cached context reduces token pricing by 50% and delivers clean PRs before standup."
            }
          ]
        }
      ],
      broaderContext: "Download the attached PDF for the full orchestration architecture."
    },
    pdfs: [
      {
        label: "Staying Ahead 19-Aug Daily Briefing & Prompts (PDF)",
        driveUrl: "https://drive.google.com/file/d/1ExampleDrivePdf19Aug/view?usp=sharing"
      }
    ],
    resourceLinks: [
      { label: "Community Discussion Thread", url: "https://chat.whatsapp.com/staying-ahead" }
    ],
    createdAt: "2026-08-19T08:30:00.000Z",
    updatedAt: "2026-08-19T08:30:00.000Z"
  },
  {
    id: "upd-004",
    slug: "daily-ai-update-18-august",
    tag: "DAILY AI UPDATE",
    title: "From Raw Data to Actionable Spatial Insights",
    excerpt: "Turn complex enterprise metrics and multimodal spatial inputs into clear strategic roadmap decisions.",
    date: "August 18, 2026",
    authorName: "Laura Chen",
    authorAvatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&h=200&q=80",
    status: "published",
    thumbnailUrl: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80",
    contentType: "article",
    analytics: {
      viewCount: 940,
      uniqueViewCount: 650,
      whatsappClickCount: 54,
      pdfOpenCounts: {},
      resourceLinkClicks: {},
      lastViewedAt: "2026-08-22T21:40:00.000Z",
      referrers: { "direct": 410, "whatsapp": 330, "google": 160 }
    },
    article: {
      sectionTitle: "Synthesizing Multimodal Vision Data at Scale",
      sectionSubtitle: "How computer vision models are integrating spatial awareness directly into code editors and design systems.",
      stories: [
        {
          number: 1,
          heading: "Zero-shot visual diffing in CI/CD pipelines",
          paragraphs: [
            {
              label: "What changes.",
              text: "Agents now inspect visual renders of PRs and point out unintended CSS regressions or misaligned padding before review."
            },
            {
              label: "Why it matters.",
              text: "Eliminates design drift and reduces visual QA review time from hours to instantaneous green checks."
            }
          ],
          pullQuote: "“Visual inspection agents catch 94% of layout regressions before human reviewers even open the pull request.”"
        }
      ],
      broaderContext: "Visual QA automation is becoming standard across modern front-end teams."
    },
    pdfs: [],
    resourceLinks: [],
    createdAt: "2026-08-18T08:30:00.000Z",
    updatedAt: "2026-08-18T08:30:00.000Z"
  },
  {
    id: "upd-005",
    slug: "daily-ai-updates-13-august",
    tag: "DAILY AI UPDATE",
    title: "Expanding Globally with Quantized Local AI",
    excerpt: "Deploying air-gapped 70B parameter models running at 35 tokens per second directly on developer laptops.",
    date: "August 13, 2026",
    authorName: "David Johnson",
    authorAvatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&h=200&q=80",
    status: "published",
    thumbnailUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=80",
    contentType: "article",
    analytics: {
      viewCount: 880,
      uniqueViewCount: 610,
      whatsappClickCount: 47,
      pdfOpenCounts: {},
      resourceLinkClicks: {},
      lastViewedAt: "2026-08-22T18:15:00.000Z",
      referrers: { "direct": 390, "whatsapp": 320, "google": 140 }
    },
    article: {
      sectionTitle: "Weekly Momentum: Open Models and Local Inference Engines",
      sectionSubtitle: "A comprehensive roundup of breakthroughs in quantized local AI and confidential computing.",
      stories: [
        {
          number: 1,
          heading: "On-device 70B parameter models running at 35 tok/sec",
          paragraphs: [
            {
              label: "Why it matters.",
              text: "Developer laptops now execute full code review and security audits air-gapped without leaking proprietary source code."
            },
            {
              label: "Action item.",
              text: "Test llama.cpp or Ollama with metal-accelerated 4-bit quantizations on your engineering fleet."
            }
          ]
        }
      ],
      broaderContext: "Privacy-first on-device AI will reshape enterprise compliance over the coming year."
    },
    pdfs: [],
    resourceLinks: [],
    createdAt: "2026-08-13T09:00:00.000Z",
    updatedAt: "2026-08-13T09:00:00.000Z"
  },
  {
    id: "upd-006",
    slug: "the-ai-alignment-files",
    tag: "GUIDE",
    title: "The AI Alignment Files: Production Guardrails",
    excerpt: "Architecting predictable reasoning, schema verification, and eliminating hallucinations in production workflows.",
    date: "August 9, 2026",
    authorName: "StayDriven Editorial",
    authorAvatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80",
    status: "published",
    thumbnailUrl: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80",
    contentType: "both",
    analytics: {
      viewCount: 1680,
      uniqueViewCount: 1190,
      whatsappClickCount: 128,
      pdfOpenCounts: {
        "AI Alignment Playbook 2026 (PDF Edition)": 390
      },
      resourceLinkClicks: {
        "Prompt Guardrail Library": 215,
        "Verification Script GitHub Gist": 178
      },
      lastViewedAt: "2026-08-23T01:30:00.000Z",
      referrers: { "direct": 710, "whatsapp": 540, "google": 310, "reddit": 120 }
    },
    article: {
      sectionTitle: "Architecting Predictable Reasoning and Safe Output Guardrails",
      sectionSubtitle: "The complete tactical playbook for eliminating hallucinations and parse errors in production microservices.",
      stories: [
        {
          number: 1,
          heading: "Deterministic JSON Schema enforcement at the decoding level",
          paragraphs: [
            {
              label: "What changes.",
              text: "Grammar-constrained sampling guarantees valid syntactic formats without relying on prompt engineering hope."
            },
            {
              label: "Why it matters.",
              text: "Eliminates JSON parse errors and prevents downstream pipeline crashes across mission-critical microservices."
            }
          ],
          pullQuote: "“Deterministic schema enforcement turns probabilistic LLM outputs into dependable API payloads.”"
        },
        {
          number: 2,
          heading: "Dual-agent critique and adversarial validation loops",
          paragraphs: [
            {
              label: "Key takeaway.",
              text: "Pairing a generator model with an independent verifier model cuts hallucination rates by over 88%."
            }
          ]
        }
      ],
      broaderContext: "Robust verification beats larger parameter counts in production environments."
    },
    pdfs: [
      {
        label: "AI Alignment Playbook 2026 (PDF Edition)",
        driveUrl: "https://drive.google.com/file/d/1ExampleAlignmentPlaybook/view?usp=sharing"
      }
    ],
    resourceLinks: [
      { label: "Prompt Guardrail Library", url: "https://stayingahead.community/guardrails" },
      { label: "Verification Script GitHub Gist", url: "https://gist.github.com/staying-ahead/evals" }
    ],
    createdAt: "2026-08-09T11:00:00.000Z",
    updatedAt: "2026-08-09T11:00:00.000Z"
  },
  {
    id: "upd-007",
    slug: "setup-guide-claude-code-free-models",
    tag: "GUIDE",
    title: "Setup Guide: CLI Coding Agents with Local Models",
    excerpt: "Configure ultra-responsive terminal assistants with zero token fees through local Ollama proxy routing.",
    date: "July 13, 2026",
    authorName: "Anna Roberts",
    authorAvatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&h=200&q=80",
    status: "published",
    thumbnailUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
    contentType: "article",
    analytics: {
      viewCount: 1320,
      uniqueViewCount: 910,
      whatsappClickCount: 88,
      pdfOpenCounts: {},
      resourceLinkClicks: {
        "Configuration Dotfiles": 164
      },
      lastViewedAt: "2026-08-22T23:10:00.000Z",
      referrers: { "direct": 580, "whatsapp": 410, "google": 270 }
    },
    article: {
      sectionTitle: "Configuring CLI Coding Agents with Local & Subsidized Inference",
      sectionSubtitle: "Step-by-step instructions to set up an ultra-responsive terminal AI assistant without cloud dependencies.",
      stories: [
        {
          number: 1,
          heading: "Proxying terminal agent requests through local Ollama instances",
          paragraphs: [
            {
              label: "What changes.",
              text: "You can seamlessly route CLI coding commands through locally hosted open-source models with zero token fees."
            },
            {
              label: "Why it matters.",
              text: "Provides unlimited offline coding assistance without incurring usage spikes on high-throughput repositories."
            }
          ]
        }
      ],
      broaderContext: "Terminal agents are becoming the standard IDE companion for high-velocity software engineers."
    },
    pdfs: [],
    resourceLinks: [
      { label: "Configuration Dotfiles", url: "https://stayingahead.community/dotfiles" }
    ],
    createdAt: "2026-07-13T10:00:00.000Z",
    updatedAt: "2026-07-13T10:00:00.000Z"
  },
  {
    id: "upd-008",
    slug: "85-ai-terms-explained-in-simple-words",
    tag: "ROADMAP",
    title: "85 AI Terms Explained in Simple Words",
    excerpt: "A comprehensive visual reference guide decoding RAG, temperature, LoRA, and agentic topologies for everyone.",
    date: "July 6, 2026",
    authorName: "StayDriven Editorial",
    authorAvatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80",
    status: "published",
    thumbnailUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
    contentType: "pdf",
    analytics: {
      viewCount: 2210,
      uniqueViewCount: 1620,
      whatsappClickCount: 186,
      pdfOpenCounts: {
        "85 AI Terms Glossary & Visual Flashcards (PDF)": 540
      },
      resourceLinkClicks: {
        "Interactive Web Glossary": 310
      },
      lastViewedAt: "2026-08-23T04:20:00.000Z",
      referrers: { "direct": 920, "whatsapp": 740, "google": 410, "twitter": 140 }
    },
    article: {
      sectionTitle: "Demystifying the Modern AI Vocabulary",
      sectionSubtitle: "From attention mechanisms to vector embeddings: clear, jargon-free explanations for leaders and operators.",
      stories: [
        {
          number: 1,
          heading: "Core concepts decoded for business leaders",
          paragraphs: [
            {
              label: "Key takeaway.",
              text: "Understanding the difference between fine-tuning and retrieval-augmented generation saves months of wasted engineering effort."
            }
          ]
        }
      ],
      broaderContext: "Download the complete flashcard deck in the PDF viewer below."
    },
    pdfs: [
      {
        label: "85 AI Terms Glossary & Visual Flashcards (PDF)",
        driveUrl: "https://drive.google.com/file/d/1Example85TermsGlossary/view?usp=sharing"
      }
    ],
    resourceLinks: [
      { label: "Interactive Web Glossary", url: "https://stayingahead.community/glossary" }
    ],
    createdAt: "2026-07-06T12:00:00.000Z",
    updatedAt: "2026-07-06T12:00:00.000Z"
  },
  {
    id: "upd-009",
    slug: "claude-code-slash-command-cheatsheet",
    tag: "GUIDE",
    title: "Terminal Speed: Claude Code Slash Commands",
    excerpt: "Boost your daily programming throughput by 3x with these verified agentic command shortcuts and patterns.",
    date: "June 30, 2026",
    authorName: "Kevin Lee",
    authorAvatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&h=200&q=80",
    status: "published",
    thumbnailUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80",
    contentType: "both",
    analytics: {
      viewCount: 1540,
      uniqueViewCount: 1080,
      whatsappClickCount: 112,
      pdfOpenCounts: {
        "Printable Slash Commands Cheatsheet (PDF)": 370
      },
      resourceLinkClicks: {},
      lastViewedAt: "2026-08-23T00:45:00.000Z",
      referrers: { "direct": 670, "whatsapp": 520, "google": 280 }
    },
    article: {
      sectionTitle: "Mastering Terminal Agent Shortcuts and Automations",
      sectionSubtitle: "Speed up your terminal workflow and context window hygiene with verified keyboard commands.",
      stories: [
        {
          number: 1,
          heading: "Context optimization with selective file inclusion",
          paragraphs: [
            {
              label: "What changes.",
              text: "Target specific subdirectories instead of letting the agent parse your entire repository, keeping response latency sub-second."
            }
          ]
        }
      ],
      broaderContext: "Small prompt and context optimizations compound into hours saved every week."
    },
    pdfs: [
      {
        label: "Printable Slash Commands Cheatsheet (PDF)",
        driveUrl: "https://drive.google.com/file/d/1ExampleSlashCheatsheet/view?usp=sharing"
      }
    ],
    resourceLinks: [],
    createdAt: "2026-06-30T10:00:00.000Z",
    updatedAt: "2026-06-30T10:00:00.000Z"
  },
  {
    id: "upd-010",
    slug: "your-daily-ai-edge-24-june",
    tag: "DAILY AI UPDATE",
    title: "Synthetic Persona Testing at Scale for Growth",
    excerpt: "Simulate 5,000 user interviews and test value propositions in minutes before launching expensive live A/B tests.",
    date: "June 24, 2026",
    authorName: "Maria Gonzalez",
    authorAvatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80",
    status: "published",
    thumbnailUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80",
    contentType: "article",
    analytics: {
      viewCount: 760,
      uniqueViewCount: 520,
      whatsappClickCount: 39,
      pdfOpenCounts: {},
      resourceLinkClicks: {},
      lastViewedAt: "2026-08-22T14:10:00.000Z",
      referrers: { "direct": 330, "whatsapp": 270, "google": 130 }
    },
    article: {
      sectionTitle: "Special Report: Agentic Workflows Transforming Growth Marketing",
      sectionSubtitle: "From automated keyword clustering to synthetic user interview testing across diverse consumer segments.",
      stories: [
        {
          number: 1,
          heading: "Simulating 5,000 persona responses in 10 minutes",
          paragraphs: [
            {
              label: "What changes.",
              text: "Product teams now validate landing page copy and value propositions against simulated customer cohorts before launching live A/B tests."
            },
            {
              label: "Why it matters.",
              text: "Cuts market validation cycle times from weeks to minutes, allowing teams to iterate copy 10x faster."
            }
          ],
          pullQuote: "“Synthetic customer testing lets growth teams stress-test copy variations against 5,000 distinct personas in under ten minutes.”"
        }
      ],
      broaderContext: "Synthetic testing is rapidly becoming an essential pre-flight checklist item across high-growth startups."
    },
    pdfs: [],
    resourceLinks: [],
    createdAt: "2026-06-24T08:00:00.000Z",
    updatedAt: "2026-06-24T08:00:00.000Z"
  },
  {
    id: "upd-011",
    slug: "10-ways-to-cut-your-ai-token-bill-in-half",
    tag: "GUIDE",
    title: "10 Ways to Cut Your AI Token Bill in Half",
    excerpt: "Practical engineering patterns and prompt caching setups for high-volume enterprise LLM deployment.",
    date: "June 22, 2026",
    authorName: "James Walker",
    authorAvatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80",
    status: "published",
    thumbnailUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
    contentType: "article",
    analytics: {
      viewCount: 1610,
      uniqueViewCount: 1140,
      whatsappClickCount: 134,
      pdfOpenCounts: {},
      resourceLinkClicks: {
        "Token Optimization Checklist": 248
      },
      lastViewedAt: "2026-08-23T03:15:00.000Z",
      referrers: { "direct": 710, "whatsapp": 560, "google": 270 }
    },
    article: {
      sectionTitle: "Practical Engineering Patterns for Cost-Effective LLM Deployment",
      sectionSubtitle: "Stop burning budget on redundant prompt prefixes and uncached system instructions.",
      stories: [
        {
          number: 1,
          heading: "Leveraging Prompt Caching for 90% discount on repetitive context",
          paragraphs: [
            {
              label: "What changes.",
              text: "Placing static instructions at the start of your API calls triggers prompt caching discounts across major AI providers."
            },
            {
              label: "Why it matters.",
              text: "Reduces input token billing from $3.00/M to $0.30/M on heavy enterprise workflows."
            }
          ],
          pullQuote: "“Prompt caching is the single easiest win for software teams integrating LLMs into recurring pipeline jobs.”"
        }
      ],
      broaderContext: "Prompt caching is the single easiest win for software teams integrating LLMs."
    },
    pdfs: [],
    resourceLinks: [
      { label: "Token Optimization Checklist", url: "https://stayingahead.community/token-cut" }
    ],
    createdAt: "2026-06-22T14:00:00.000Z",
    updatedAt: "2026-06-22T14:00:00.000Z"
  },
  {
    id: "upd-012",
    slug: "draft-ai-agents-orchestration-2026",
    tag: "ROADMAP",
    title: "Draft: Autonomous Agent Orchestration Blueprint",
    excerpt: "Designing resilient autonomous worker pools that recover gracefully from tool failures.",
    date: "August 22, 2026",
    authorName: "Olivia Harris",
    authorAvatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&h=200&q=80",
    status: "draft",
    thumbnailUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80",
    contentType: "both",
    analytics: {
      viewCount: 0,
      uniqueViewCount: 0,
      whatsappClickCount: 0,
      pdfOpenCounts: {},
      resourceLinkClicks: {},
      lastViewedAt: null,
      referrers: {}
    },
    article: {
      sectionTitle: "Multi-Agent Architecture: State Machines vs Event Streams",
      sectionSubtitle: "Designing resilient autonomous worker pools that recover gracefully from tool failures.",
      stories: [
        {
          number: 1,
          heading: "State persistence and checkpointing protocols",
          paragraphs: [
            {
              label: "What changes.",
              text: "Agents must store intermediate tool outputs in append-only event logs to enable zero-loss resumption."
            }
          ]
        }
      ],
      broaderContext: "Work in progress — scheduled for publication next Tuesday."
    },
    pdfs: [
      {
        label: "Draft Agentic Topology Diagram (PDF)",
        driveUrl: "https://drive.google.com/file/d/1ExampleAgentDraft/view?usp=sharing"
      }
    ],
    resourceLinks: [],
    createdAt: "2026-08-22T15:00:00.000Z",
    updatedAt: "2026-08-22T17:30:00.000Z"
  },
  {
    id: "upd-013",
    slug: "draft-quantum-ai-briefing",
    tag: "AI TOOL",
    title: "Draft: Quantum-Assisted Optimization Engines",
    excerpt: "Separating current noisy intermediate-scale hardware from future production reality in supply chain ML.",
    date: "August 23, 2026",
    authorName: "Ferra Alexandra",
    authorAvatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80",
    status: "draft",
    thumbnailUrl: "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=1200&q=80",
    contentType: "article",
    analytics: {
      viewCount: 0,
      uniqueViewCount: 0,
      whatsappClickCount: 0,
      pdfOpenCounts: {},
      resourceLinkClicks: {},
      lastViewedAt: null,
      referrers: {}
    },
    article: {
      sectionTitle: "Early Hybrid Solvers in Supply Chain Machine Learning",
      sectionSubtitle: "Separating current noisy intermediate-scale hardware from future production reality.",
      stories: [
        {
          number: 1,
          heading: "Benchmarking classical heuristics against annealers",
          paragraphs: [
            {
              label: "Why it matters.",
              text: "Current classical GPU algorithms still outperform quantum processors on 99% of combinatorial optimization problems."
            }
          ]
        }
      ],
      broaderContext: "Draft notes from our research team."
    },
    pdfs: [],
    resourceLinks: [],
    createdAt: "2026-08-23T01:00:00.000Z",
    updatedAt: "2026-08-23T02:00:00.000Z"
  }
];

const DEFAULT_ABOUT_TEXT = "StayDriven is your intelligence layer for the AI era.\n\nA community and weekly briefing platform delivering practical insights on Daily AI and Tech Updates, Resources, and Roadmaps — built for people who want to understand AI, apply it, and stay ahead.";

export class CMSStore {
  constructor() {
    this.init();
  }

  init() {
    if (!localStorage.getItem(STORAGE_KEY)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_UPDATES));
    } else {
      // Backfill analytics object if missing on existing items
      try {
        const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
        let modified = false;
        stored.forEach(item => {
          if (!item.analytics) {
            item.analytics = {
              viewCount: Math.floor(Math.random() * 400) + 120,
              uniqueViewCount: Math.floor(Math.random() * 250) + 80,
              whatsappClickCount: Math.floor(Math.random() * 40) + 10,
              pdfOpenCounts: {},
              resourceLinkClicks: {},
              lastViewedAt: new Date().toISOString(),
              referrers: { "direct": 120, "whatsapp": 80 }
            };
            modified = true;
          }
          if (item.authorName === 'Vaibhav Sisinty') {
            item.authorName = 'StayDriven Editorial';
            modified = true;
          }
        });
        if (modified) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
        }
      } catch (e) {}
    }

    if (!localStorage.getItem(AUTH_KEY)) {
      localStorage.setItem(AUTH_KEY, JSON.stringify({
        isAuthenticated: false,
        user: null
      }));
    }

    if (!localStorage.getItem(SETTINGS_KEY)) {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify({
        siteName: "StayDriven",
        adminName: "StayDriven Admin",
        adminRole: "Lead Editor & Admin",
        adminEmail: "admin@staydriven.community",
        adminAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80",
        aboutStayingAheadText: DEFAULT_ABOUT_TEXT,
        notificationsEnabled: true
      }));
    } else {
      try {
        const currentSettings = JSON.parse(localStorage.getItem(SETTINGS_KEY));
        let mod = false;
        if (currentSettings && (!currentSettings.aboutStayingAheadText || currentSettings.aboutStayingAheadText.includes("StayDriven is a premier AI intelligence community"))) {
          currentSettings.aboutStayingAheadText = DEFAULT_ABOUT_TEXT;
          mod = true;
        }
        if (currentSettings && currentSettings.adminName === 'Vaibhav Sisinty') {
          currentSettings.adminName = 'StayDriven Admin';
          mod = true;
        }
        if (mod) {
          localStorage.setItem(SETTINGS_KEY, JSON.stringify(currentSettings));
        }
      } catch (e) {}
    }

    // Initialize Site Analytics Log
    if (!localStorage.getItem(ANALYTICS_KEY)) {
      const today = new Date().toISOString().split('T')[0];
      const dailyViews = {};
      const dailyWhatsappClicks = {};
      const dailyUniqueVisitors = {};

      // Seed realistic 30-day history leading up to today
      const now = new Date();
      for (let i = 29; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        const dateKey = d.toISOString().split('T')[0];
        // Trend slightly upwards
        const base = 280 + Math.floor((30 - i) * 14);
        const variance = Math.floor(Math.sin(i * 0.8) * 80) + Math.floor(Math.random() * 60);
        const views = Math.max(120, base + variance);
        const visitors = Math.floor(views * 0.72);
        const waClicks = Math.floor(views * 0.085);

        dailyViews[dateKey] = views;
        dailyUniqueVisitors[dateKey] = visitors;
        dailyWhatsappClicks[dateKey] = waClicks;
      }

      localStorage.setItem(ANALYTICS_KEY, JSON.stringify({
        totalPageViews: 12610,
        totalUniqueVisitors: 8840,
        totalWhatsappClicks: 1040,
        whatsappClicksByLocation: {
          "navbar": 210,
          "hero": 340,
          "footer": 190,
          "sticky_bar": 120,
          "sidebar_about": 180
        },
        todayViews: dailyViews[today] || 485,
        lastTodayDate: today,
        dailyViews,
        dailyWhatsappClicks,
        dailyUniqueVisitors,
        recentEvents: []
      }));
    }
  }

  // =========================================================================
  // ANALYTICS TRACKING ENGINE
  // =========================================================================
  trackEvent(event) {
    if (!event || !event.type) return;

    try {
      const now = new Date();
      const today = now.toISOString().split('T')[0];
      let siteAnalytics = this.getSiteAnalytics();

      // Reset today count if new day
      if (siteAnalytics.lastTodayDate !== today) {
        siteAnalytics.lastTodayDate = today;
        siteAnalytics.todayViews = 0;
      }

      if (!siteAnalytics.dailyViews[today]) siteAnalytics.dailyViews[today] = 0;
      if (!siteAnalytics.dailyUniqueVisitors[today]) siteAnalytics.dailyUniqueVisitors[today] = 0;
      if (!siteAnalytics.dailyWhatsappClicks[today]) siteAnalytics.dailyWhatsappClicks[today] = 0;
      if (!siteAnalytics.whatsappClicksByLocation) siteAnalytics.whatsappClicksByLocation = {};

      const all = this.getAll();
      let modifiedArticles = false;

      if (event.type === 'article_view') {
        const article = all.find(a => a.id === event.articleId || a.slug === event.slug);
        if (article) {
          if (!article.analytics) {
            article.analytics = {
              viewCount: 0,
              uniqueViewCount: 0,
              whatsappClickCount: 0,
              pdfOpenCounts: {},
              resourceLinkClicks: {},
              lastViewedAt: null,
              referrers: {}
            };
          }

          article.analytics.viewCount = (article.analytics.viewCount || 0) + 1;
          article.analytics.lastViewedAt = now.toISOString();

          if (event.isUnique) {
            article.analytics.uniqueViewCount = (article.analytics.uniqueViewCount || 0) + 1;
            siteAnalytics.totalUniqueVisitors = (siteAnalytics.totalUniqueVisitors || 0) + 1;
            siteAnalytics.dailyUniqueVisitors[today] = (siteAnalytics.dailyUniqueVisitors[today] || 0) + 1;
          }

          const ref = (event.referrer && typeof event.referrer === 'string') ? event.referrer.toLowerCase() : 'direct';
          const refKey = ref.includes('whatsapp') ? 'whatsapp' : (ref.includes('google') ? 'google' : (ref.includes('t.co') || ref.includes('twitter') ? 'twitter' : (ref === '' || ref === 'direct' ? 'direct' : 'other')));
          if (!article.analytics.referrers) article.analytics.referrers = {};
          article.analytics.referrers[refKey] = (article.analytics.referrers[refKey] || 0) + 1;

          modifiedArticles = true;
        }

        siteAnalytics.totalPageViews = (siteAnalytics.totalPageViews || 0) + 1;
        siteAnalytics.todayViews = (siteAnalytics.todayViews || 0) + 1;
        siteAnalytics.dailyViews[today] = (siteAnalytics.dailyViews[today] || 0) + 1;

      } else if (event.type === 'whatsapp_click') {
        siteAnalytics.totalWhatsappClicks = (siteAnalytics.totalWhatsappClicks || 0) + 1;
        siteAnalytics.dailyWhatsappClicks[today] = (siteAnalytics.dailyWhatsappClicks[today] || 0) + 1;

        const loc = event.location || 'unknown';
        siteAnalytics.whatsappClicksByLocation[loc] = (siteAnalytics.whatsappClicksByLocation[loc] || 0) + 1;

        if (event.articleId) {
          const article = all.find(a => a.id === event.articleId);
          if (article) {
            if (!article.analytics) article.analytics = { viewCount: 0, uniqueViewCount: 0, whatsappClickCount: 0, pdfOpenCounts: {}, resourceLinkClicks: {}, lastViewedAt: null, referrers: {} };
            article.analytics.whatsappClickCount = (article.analytics.whatsappClickCount || 0) + 1;
            modifiedArticles = true;
          }
        }

      } else if (event.type === 'pdf_interaction') {
        if (event.articleId && event.pdfLabel) {
          const article = all.find(a => a.id === event.articleId);
          if (article) {
            if (!article.analytics) article.analytics = { viewCount: 0, uniqueViewCount: 0, whatsappClickCount: 0, pdfOpenCounts: {}, resourceLinkClicks: {}, lastViewedAt: null, referrers: {} };
            if (!article.analytics.pdfOpenCounts) article.analytics.pdfOpenCounts = {};
            article.analytics.pdfOpenCounts[event.pdfLabel] = (article.analytics.pdfOpenCounts[event.pdfLabel] || 0) + 1;
            modifiedArticles = true;
          }
        }

      } else if (event.type === 'resource_click') {
        if (event.articleId && event.linkLabel) {
          const article = all.find(a => a.id === event.articleId);
          if (article) {
            if (!article.analytics) article.analytics = { viewCount: 0, uniqueViewCount: 0, whatsappClickCount: 0, pdfOpenCounts: {}, resourceLinkClicks: {}, lastViewedAt: null, referrers: {} };
            if (!article.analytics.resourceLinkClicks) article.analytics.resourceLinkClicks = {};
            article.analytics.resourceLinkClicks[event.linkLabel] = (article.analytics.resourceLinkClicks[event.linkLabel] || 0) + 1;
            modifiedArticles = true;
          }
        }
      }

      // Keep recent 20 events for live log
      if (!Array.isArray(siteAnalytics.recentEvents)) siteAnalytics.recentEvents = [];
      siteAnalytics.recentEvents.unshift({
        type: event.type,
        articleId: event.articleId || null,
        label: event.pdfLabel || event.linkLabel || event.location || null,
        timestamp: now.toISOString()
      });
      if (siteAnalytics.recentEvents.length > 20) {
        siteAnalytics.recentEvents = siteAnalytics.recentEvents.slice(0, 20);
      }

      localStorage.setItem(ANALYTICS_KEY, JSON.stringify(siteAnalytics));
      if (modifiedArticles) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
      }
    } catch (e) {
      console.warn("Silent analytics track error:", e);
    }
  }

  getSiteAnalytics() {
    try {
      const data = localStorage.getItem(ANALYTICS_KEY);
      if (data) return JSON.parse(data);
    } catch (e) {}

    return {
      totalPageViews: 0,
      totalUniqueVisitors: 0,
      totalWhatsappClicks: 0,
      whatsappClicksByLocation: {},
      todayViews: 0,
      lastTodayDate: new Date().toISOString().split('T')[0],
      dailyViews: {},
      dailyWhatsappClicks: {},
      dailyUniqueVisitors: {},
      recentEvents: []
    };
  }

  getAnalyticsSummary() {
    const all = this.getAll();
    const site = this.getSiteAnalytics();
    const today = new Date().toISOString().split('T')[0];

    // Compute 30 days series data array
    const chartData = [];
    const now = new Date();
    let totalViewsLast7 = 0;
    let totalViewsPrev7 = 0;

    for (let i = 29; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateKey = d.toISOString().split('T')[0];
      const views = site.dailyViews[dateKey] || 0;
      const unique = site.dailyUniqueVisitors[dateKey] || 0;
      const waClicks = site.dailyWhatsappClicks[dateKey] || 0;

      const dateLabel = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      chartData.push({
        date: dateKey,
        label: dateLabel,
        views,
        unique,
        whatsappClicks: waClicks
      });

      if (i < 7) {
        totalViewsLast7 += views;
      } else if (i >= 7 && i < 14) {
        totalViewsPrev7 += views;
      }
    }

    const trendVsLastWeek = totalViewsPrev7 > 0 
      ? Math.round(((totalViewsLast7 - totalViewsPrev7) / totalViewsPrev7) * 100) 
      : 14;

    // Calculate top performing posts
    const published = all.filter(u => u.status === 'published');
    const postsRanked = [...published].map(item => {
      const a = item.analytics || {
        viewCount: 0,
        uniqueViewCount: 0,
        whatsappClickCount: 0,
        pdfOpenCounts: {},
        resourceLinkClicks: {},
        lastViewedAt: null
      };

      const totalPdfsClicked = Object.values(a.pdfOpenCounts || {}).reduce((acc, c) => acc + c, 0);
      const totalResourcesClicked = Object.values(a.resourceLinkClicks || {}).reduce((acc, c) => acc + c, 0);

      return {
        id: item.id,
        title: item.title,
        tag: item.tag,
        date: item.date,
        createdAt: item.createdAt,
        views: a.viewCount || 0,
        unique: a.uniqueViewCount || 0,
        whatsappClicks: a.whatsappClickCount || 0,
        pdfClicks: totalPdfsClicked,
        resourceClicks: totalResourcesClicked,
        lastViewedAt: a.lastViewedAt,
        conversionRate: a.viewCount > 0 ? ((a.whatsappClickCount / a.viewCount) * 100).toFixed(1) : "0.0",
        rawAnalytics: a
      };
    }).sort((a, b) => b.views - a.views);

    // Sum overall totals from articles if site record is fresh
    const totalArticleViews = published.reduce((acc, p) => acc + (p.analytics?.viewCount || 0), 0);
    const totalArticleUnique = published.reduce((acc, p) => acc + (p.analytics?.uniqueViewCount || 0), 0);
    const totalArticleWa = published.reduce((acc, p) => acc + (p.analytics?.whatsappClickCount || 0), 0);

    const totalViews = Math.max(site.totalPageViews, totalArticleViews);
    const totalUnique = Math.max(site.totalUniqueVisitors, totalArticleUnique);
    const totalWa = Math.max(site.totalWhatsappClicks, totalArticleWa);
    const todayViews = site.todayViews || (site.dailyViews[today] || 0);

    // Overall conversion rate
    const globalConversionRate = totalUnique > 0 ? ((totalWa / totalUnique) * 100).toFixed(1) : "11.8";

    return {
      totalViews,
      totalUnique,
      totalWhatsappClicks: totalWa,
      todayViews,
      trendVsLastWeek: trendVsLastWeek >= 0 ? `+${trendVsLastWeek}%` : `${trendVsLastWeek}%`,
      globalConversionRate: `${globalConversionRate}%`,
      chartData,
      postsRanked,
      whatsappLocations: site.whatsappClicksByLocation || {},
      recentEvents: site.recentEvents || []
    };
  }

  getArticleAnalytics(id) {
    const item = this.getById(id);
    if (!item || !item.analytics) {
      return {
        viewCount: 0,
        uniqueViewCount: 0,
        whatsappClickCount: 0,
        pdfOpenCounts: {},
        resourceLinkClicks: {},
        lastViewedAt: null,
        referrers: {}
      };
    }
    return item.analytics;
  }

  // =========================================================================
  // STANDARD CRUD METHODS
  // =========================================================================
  getAll() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : INITIAL_UPDATES;
    } catch (e) {
      console.error("Error reading updates from localStorage:", e);
      return INITIAL_UPDATES;
    }
  }

  getPublished() {
    return this.getAll().filter(item => item.status === 'published');
  }

  getById(id) {
    return this.getAll().find(item => item.id === id) || null;
  }

  getBySlug(slug) {
    return this.getAll().find(item => item.slug === slug) || null;
  }

  save(updateData) {
    const all = this.getAll();
    const now = new Date().toISOString();
    const settings = this.getSettings();
    
    const formattedData = {
      ...updateData,
      authorName: updateData.authorName || settings.adminName || "StayDriven Editorial",
      authorAvatarUrl: updateData.authorAvatarUrl || settings.adminAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80",
      excerpt: updateData.excerpt || (updateData.article?.sectionSubtitle || (updateData.title + ' — Explore key breakthroughs and actionable insights.')),
      analytics: updateData.analytics || {
        viewCount: 0,
        uniqueViewCount: 0,
        whatsappClickCount: 0,
        pdfOpenCounts: {},
        resourceLinkClicks: {},
        lastViewedAt: null,
        referrers: {}
      }
    };

    if (updateData.id) {
      const index = all.findIndex(item => item.id === updateData.id);
      if (index !== -1) {
        all[index] = {
          ...all[index],
          ...formattedData,
          updatedAt: now
        };
      } else {
        all.unshift({
          ...formattedData,
          createdAt: now,
          updatedAt: now
        });
      }
    } else {
      const newId = `upd-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 4)}`;
      const newSlug = updateData.slug || updateData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const newItem = {
        ...formattedData,
        id: newId,
        slug: newSlug,
        createdAt: now,
        updatedAt: now
      };
      all.unshift(newItem);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    this.notifyChange();
    return updateData.id ? updateData : all[0];
  }

  delete(id) {
    const all = this.getAll().filter(item => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    this.notifyChange();
    return true;
  }

  bulkUpdateStatus(ids, status) {
    const all = this.getAll().map(item => {
      if (ids.includes(item.id)) {
        return { ...item, status, updatedAt: new Date().toISOString() };
      }
      return item;
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    this.notifyChange();
  }

  bulkDelete(ids) {
    const all = this.getAll().filter(item => !ids.includes(item.id));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    this.notifyChange();
  }

  resetToDefaults() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_UPDATES));
    localStorage.removeItem(ANALYTICS_KEY);
    this.init();
    this.notifyChange();
  }

  exportDataJSON() {
    return JSON.stringify(this.getAll(), null, 2);
  }

  importDataJSON(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (Array.isArray(parsed)) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
        this.notifyChange();
        return { success: true, count: parsed.length };
      }
      return { success: false, error: "Uploaded JSON is not an array of updates." };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  getAuth() {
    try {
      const auth = localStorage.getItem(AUTH_KEY);
      return auth ? JSON.parse(auth) : { isAuthenticated: false, user: null };
    } catch (e) {
      return { isAuthenticated: false, user: null };
    }
  }

  login(email, password) {
    if (email && password) {
      const authState = {
        isAuthenticated: true,
        user: {
          email: email.trim(),
          name: email.split('@')[0] || "Admin",
          role: "Lead Editor & Admin",
          loginTime: new Date().toISOString()
        }
      };
      localStorage.setItem(AUTH_KEY, JSON.stringify(authState));
      return { success: true, user: authState.user };
    }
    return { success: false, error: "Please enter your email and password." };
  }

  logout() {
    localStorage.setItem(AUTH_KEY, JSON.stringify({ isAuthenticated: false, user: null }));
  }

  getSettings() {
    try {
      const s = JSON.parse(localStorage.getItem(SETTINGS_KEY));
      return s || {
        siteName: "StayDriven",
        adminName: "StayDriven Admin",
        adminRole: "Lead Editor & Admin",
        adminAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80",
        aboutStayingAheadText: DEFAULT_ABOUT_TEXT
      };
    } catch (e) {
      return {};
    }
  }

  saveSettings(settings) {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    this.notifyChange();
  }

  notifyChange() {
    window.dispatchEvent(new CustomEvent('staydriven_cms_change'));
  }

  getStats() {
    const all = this.getAll();
    const published = all.filter(u => u.status === 'published');
    const drafts = all.filter(u => u.status === 'draft');
    
    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const thisWeek = all.filter(u => {
      const time = new Date(u.createdAt || u.updatedAt).getTime();
      return time >= oneWeekAgo;
    });

    const tagsCount = {};
    all.forEach(u => {
      const t = u.tag || 'OTHER';
      tagsCount[t] = (tagsCount[t] || 0) + 1;
    });

    const pdfsCount = all.reduce((acc, u) => acc + (u.pdfs ? u.pdfs.length : 0), 0);

    return {
      total: all.length,
      publishedCount: published.length,
      draftsCount: drafts.length,
      thisWeekCount: thisWeek.length,
      tagsCount,
      pdfsCount
    };
  }

  static convertDriveUrlToEmbed(url) {
    if (!url) return '';
    try {
      const fileIdMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
      if (fileIdMatch && fileIdMatch[1]) {
        return `https://drive.google.com/file/d/${fileIdMatch[1]}/preview`;
      }
      return url;
    } catch (e) {
      return url;
    }
  }
}

export const cmsStore = new CMSStore();
window.cmsStore = cmsStore;
