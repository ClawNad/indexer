# ClawNad Indexer

The Graph subgraph that indexes all ClawNad on-chain events on Monad (chain 143).

## What it indexes

- **AgentFactory** — agent creation, metadata updates, wallet linking
- **RevenueRouter** — revenue deposits, distributions, platform fees
- **AgentRating** — reputation feedback submissions
- **BondingCurve (nad.fun)** — token trades (buys/sells), price snapshots

## Entities

| Entity | Description |
|---|---|
| `Agent` | Registered agent with identity, token, metadata, and aggregated stats |
| `TokenTrade` | Individual buy/sell transaction on nad.fun bonding curve |
| `TokenSnapshot` | Periodic price/volume snapshots for charting |
| `ReputationFeedback` | Individual rating with score, tags, and comment |
| `RevenueEvent` | Revenue deposit or distribution event |
| `PlatformStats` | Global platform metrics (total agents, volume, revenue) |

## Setup

```bash
npm install
```

## Build

```bash
# Generate AssemblyScript types from schema + ABIs
npx graph codegen

# Compile the subgraph
npx graph build
```

## Deploy

Deployed to The Graph Studio on the Monad network.

```bash
# Authenticate (one-time)
npx graph auth --studio <deploy-key>

# Deploy
npx graph deploy --studio clawnad-indexer
```

## Query Endpoint

```
https://api.studio.thegraph.com/query/113915/clawnad-indexer/v0.0.5
```

## Contract Addresses (Monad Mainnet)

| Contract | Address |
|---|---|
| AgentFactory | `0xB0C3Db074C3eaaF1DC80445710857f6c39c0e822` |
| RevenueRouter | `0xbF5b983F3F75c02d72B452A15885fb69c95b3f2F` |
| AgentRating | `0xEb6850d45Cb177C930256a62ed31093189a0a9a7` |
| nad.fun BondingCurve | `0x6F6B8F1a20703309951a5127c45B49b1CD981A22` |
| Agent Token | `0x64F1416846cb28C805D7D82Dc49B81aB51567777` |

## Project Structure

```
schema.graphql     — Entity definitions
subgraph.yaml      — Data sources and event handlers
abis/              — Contract ABIs (AgentFactory, RevenueRouter, AgentRating, BondingCurve)
src/               — AssemblyScript event handler mappings
```

## License

MIT
