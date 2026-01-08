import { AGENT_MANAGEMENT_PREFIX } from "../../constants";

export const agentManagementUrls = {
  CREATE_REFERRAL_AGENT: AGENT_MANAGEMENT_PREFIX + "createReferralAgent",
  GET_REFERRAL_AGENTS: AGENT_MANAGEMENT_PREFIX + "getAllReferralAgents",
  GET_AGENTS_BY_TYPE: AGENT_MANAGEMENT_PREFIX + "getAgentsByType",
  LIST_REFERRAL_AGENTS: AGENT_MANAGEMENT_PREFIX + "listReferralAgent",
};
