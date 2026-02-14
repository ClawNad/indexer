import { BigInt, Bytes } from "@graphprotocol/graph-ts";
import {
  CurveBuy,
  CurveSell,
  CurveSync,
  CurveGraduate,
} from "../generated/BondingCurve/BondingCurve";
import {
  TokenTrade,
  TokenSnapshot,
  Agent,
  TokenAgent,
  PlatformStats,
} from "../generated/schema";

/** Find the agent linked to a given token address via reverse-lookup entity. */
function findAgentByToken(tokenAddress: Bytes): Agent | null {
  let tokenAgent = TokenAgent.load(tokenAddress.toHexString());
  if (tokenAgent == null) return null;
  return Agent.load(tokenAgent.agent);
}

export function handleCurveBuy(event: CurveBuy): void {
  let agent = findAgentByToken(event.params.token);
  if (agent == null) return; // Not a ClawNad token — skip

  let id =
    event.transaction.hash.toHexString() +
    "-" +
    event.logIndex.toString();

  let trade = new TokenTrade(id);
  trade.agent = agent.id;
  trade.tokenAddress = event.params.token;
  trade.trader = event.params.sender;
  trade.tradeType = "buy";
  trade.monAmount = event.params.amountIn;
  trade.tokenAmount = event.params.amountOut;
  trade.blockNumber = event.block.number;
  trade.txHash = event.transaction.hash;
  trade.blockTimestamp = event.block.timestamp;
  trade.save();

  // Update platform stats
  let stats = PlatformStats.load("platform");
  if (stats != null) {
    stats.totalTrades += 1;
    stats.save();
  }
}

export function handleCurveSell(event: CurveSell): void {
  let agent = findAgentByToken(event.params.token);
  if (agent == null) return;

  let id =
    event.transaction.hash.toHexString() +
    "-" +
    event.logIndex.toString();

  let trade = new TokenTrade(id);
  trade.agent = agent.id;
  trade.tokenAddress = event.params.token;
  trade.trader = event.params.sender;
  trade.tradeType = "sell";
  trade.monAmount = event.params.amountOut;
  trade.tokenAmount = event.params.amountIn;
  trade.blockNumber = event.block.number;
  trade.txHash = event.transaction.hash;
  trade.blockTimestamp = event.block.timestamp;
  trade.save();

  let stats = PlatformStats.load("platform");
  if (stats != null) {
    stats.totalTrades += 1;
    stats.save();
  }
}

export function handleCurveSync(event: CurveSync): void {
  let agent = findAgentByToken(event.params.token);
  if (agent == null) return;

  let id =
    event.transaction.hash.toHexString() +
    "-" +
    event.logIndex.toString();

  let snapshot = new TokenSnapshot(id);
  snapshot.agent = agent.id;
  snapshot.tokenAddress = event.params.token;
  snapshot.realMonReserve = event.params.realMonReserve;
  snapshot.realTokenReserve = event.params.realTokenReserve;
  snapshot.virtualMonReserve = event.params.virtualMonReserve;
  snapshot.virtualTokenReserve = event.params.virtualTokenReserve;
  snapshot.blockNumber = event.block.number;
  snapshot.blockTimestamp = event.block.timestamp;
  snapshot.save();
}

export function handleCurveGraduate(event: CurveGraduate): void {
  let agent = findAgentByToken(event.params.token);
  if (agent == null) return;

  agent.tokenGraduated = true;
  agent.save();
}
