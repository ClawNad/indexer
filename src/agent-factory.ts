import { BigInt, Bytes } from "@graphprotocol/graph-ts";
import {
  AgentLaunched,
  AgentRegistered,
  AgentTokenLinked,
  AgentEndpointUpdated,
  AgentWalletUpdated,
  AgentDeactivated,
  AgentReactivated,
} from "../generated/AgentFactory/AgentFactory";
import { Agent, PlatformStats, TokenAgent } from "../generated/schema";

function getOrCreatePlatformStats(): PlatformStats {
  let stats = PlatformStats.load("platform");
  if (stats == null) {
    stats = new PlatformStats("platform");
    stats.totalAgents = 0;
    stats.totalTrades = 0;
    stats.totalRevenue = BigInt.zero();
    stats.totalFeedback = 0;
  }
  return stats;
}

export function handleAgentLaunched(event: AgentLaunched): void {
  let id = event.params.agentId.toString();
  let agent = new Agent(id);
  agent.agentId = event.params.agentId;
  agent.tokenAddress = event.params.token;
  agent.creator = event.params.creator;
  agent.agentWallet = event.params.creator;
  agent.agentURI = event.params.agentURI;
  agent.endpoint = event.params.endpoint;
  agent.tokenName = event.params.tokenName;
  agent.tokenSymbol = event.params.tokenSymbol;
  agent.active = true;
  agent.launchedAt = event.block.timestamp;
  agent.blockNumber = event.block.number;
  agent.txHash = event.transaction.hash;
  agent.totalRevenue = BigInt.zero();
  agent.totalFeedback = 0;
  agent.totalScore = BigInt.zero();
  agent.tokenGraduated = false;
  agent.save();

  // Reverse lookup: token → agent
  let tokenAgent = new TokenAgent(event.params.token.toHexString());
  tokenAgent.agent = id;
  tokenAgent.save();

  let stats = getOrCreatePlatformStats();
  stats.totalAgents += 1;
  stats.save();
}

export function handleAgentRegistered(event: AgentRegistered): void {
  let id = event.params.agentId.toString();
  let agent = new Agent(id);
  agent.agentId = event.params.agentId;
  agent.tokenAddress = null;
  agent.creator = event.params.creator;
  agent.agentWallet = event.params.creator;
  agent.agentURI = event.params.agentURI;
  agent.endpoint = event.params.endpoint;
  agent.tokenName = null;
  agent.tokenSymbol = null;
  agent.active = true;
  agent.launchedAt = event.block.timestamp;
  agent.blockNumber = event.block.number;
  agent.txHash = event.transaction.hash;
  agent.totalRevenue = BigInt.zero();
  agent.totalFeedback = 0;
  agent.totalScore = BigInt.zero();
  agent.tokenGraduated = false;
  agent.save();

  let stats = getOrCreatePlatformStats();
  stats.totalAgents += 1;
  stats.save();
}

export function handleAgentTokenLinked(event: AgentTokenLinked): void {
  let id = event.params.agentId.toString();
  let agent = Agent.load(id);
  if (agent == null) return;
  agent.tokenAddress = event.params.token;
  agent.save();

  // Reverse lookup: token → agent
  let tokenAgent = new TokenAgent(event.params.token.toHexString());
  tokenAgent.agent = id;
  tokenAgent.save();
}

export function handleAgentEndpointUpdated(event: AgentEndpointUpdated): void {
  let id = event.params.agentId.toString();
  let agent = Agent.load(id);
  if (agent == null) return;
  agent.endpoint = event.params.newEndpoint;
  agent.save();
}

export function handleAgentWalletUpdated(event: AgentWalletUpdated): void {
  let id = event.params.agentId.toString();
  let agent = Agent.load(id);
  if (agent == null) return;
  agent.agentWallet = event.params.newWallet;
  agent.save();
}

export function handleAgentDeactivated(event: AgentDeactivated): void {
  let id = event.params.agentId.toString();
  let agent = Agent.load(id);
  if (agent == null) return;
  agent.active = false;
  agent.save();
}

export function handleAgentReactivated(event: AgentReactivated): void {
  let id = event.params.agentId.toString();
  let agent = Agent.load(id);
  if (agent == null) return;
  agent.active = true;
  agent.save();
}
