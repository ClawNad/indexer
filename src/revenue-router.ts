import { BigInt } from "@graphprotocol/graph-ts";
import {
  RevenueDeposited,
  RevenueDistributed,
  BuybackWithdrawn,
} from "../generated/RevenueRouter/RevenueRouter";
import { RevenueEvent, Agent, PlatformStats } from "../generated/schema";

export function handleRevenueDeposited(event: RevenueDeposited): void {
  let id =
    event.transaction.hash.toHexString() +
    "-" +
    event.logIndex.toString();

  let entity = new RevenueEvent(id);
  entity.agent = event.params.agentId.toString();
  entity.eventType = "deposit";
  entity.paymentToken = event.params.paymentToken;
  entity.amount = event.params.amount;
  entity.fromAddress = event.params.from;
  entity.agentShare = null;
  entity.buybackShare = null;
  entity.platformFee = null;
  entity.toAddress = null;
  entity.blockNumber = event.block.number;
  entity.txHash = event.transaction.hash;
  entity.blockTimestamp = event.block.timestamp;
  entity.save();

  // Update agent total revenue
  let agent = Agent.load(event.params.agentId.toString());
  if (agent != null) {
    agent.totalRevenue = agent.totalRevenue.plus(event.params.amount);
    agent.save();
  }

  // Update platform stats
  let stats = PlatformStats.load("platform");
  if (stats != null) {
    stats.totalRevenue = stats.totalRevenue.plus(event.params.amount);
    stats.save();
  }
}

export function handleRevenueDistributed(event: RevenueDistributed): void {
  let id =
    event.transaction.hash.toHexString() +
    "-" +
    event.logIndex.toString();

  let entity = new RevenueEvent(id);
  entity.agent = event.params.agentId.toString();
  entity.eventType = "distribute";
  entity.paymentToken = event.params.paymentToken;
  entity.amount = event.params.agentShare
    .plus(event.params.buybackShare)
    .plus(event.params.platformFee);
  entity.agentShare = event.params.agentShare;
  entity.buybackShare = event.params.buybackShare;
  entity.platformFee = event.params.platformFee;
  entity.fromAddress = null;
  entity.toAddress = null;
  entity.blockNumber = event.block.number;
  entity.txHash = event.transaction.hash;
  entity.blockTimestamp = event.block.timestamp;
  entity.save();
}

export function handleBuybackWithdrawn(event: BuybackWithdrawn): void {
  let id =
    event.transaction.hash.toHexString() +
    "-" +
    event.logIndex.toString();

  let entity = new RevenueEvent(id);
  entity.agent = event.params.agentId.toString();
  entity.eventType = "buyback";
  entity.paymentToken = event.params.paymentToken;
  entity.amount = event.params.amount;
  entity.toAddress = event.params.to;
  entity.agentShare = null;
  entity.buybackShare = null;
  entity.platformFee = null;
  entity.fromAddress = null;
  entity.blockNumber = event.block.number;
  entity.txHash = event.transaction.hash;
  entity.blockTimestamp = event.block.timestamp;
  entity.save();
}
