import { BigInt } from "@graphprotocol/graph-ts";
import { AgentRated } from "../generated/AgentRating/AgentRating";
import { ReputationFeedback, Agent, PlatformStats } from "../generated/schema";

export function handleAgentRated(event: AgentRated): void {
  let id =
    event.transaction.hash.toHexString() +
    "-" +
    event.logIndex.toString();

  // Skip feedback for agents not registered in this factory version
  let agent = Agent.load(event.params.agentId.toString());
  if (agent == null) return;

  let entity = new ReputationFeedback(id);
  entity.agent = event.params.agentId.toString();
  entity.rater = event.params.rater;
  entity.score = event.params.score;
  entity.tag1 = event.params.tag1;
  entity.tag2 = event.params.tag2;
  entity.feedbackHash = event.params.feedbackHash;
  entity.blockNumber = event.block.number;
  entity.txHash = event.transaction.hash;
  entity.blockTimestamp = event.block.timestamp;
  entity.save();

  // Update agent aggregates (agent already loaded above)
  agent.totalFeedback += 1;
  agent.totalScore = agent.totalScore.plus(event.params.score);
  agent.save();

  // Update platform stats
  let stats = PlatformStats.load("platform");
  if (stats != null) {
    stats.totalFeedback += 1;
    stats.save();
  }
}
