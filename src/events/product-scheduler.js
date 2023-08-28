import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import schedule from "node-schedule";
import { Logger } from "../common/utils/logger.js";
import { APP_CONFIG } from "../infrastruture/configs/index.js";
import { RedisClient } from "../infrastruture/connections/redis.js";

const sdk = ThirdwebSDK.fromPrivateKey(APP_CONFIG.wallet.privateKey, APP_CONFIG.chain[APP_CONFIG.chain.default], {
    secretKey: APP_CONFIG.thirdweb.privateKey,
});

const ProjectJobs = {};

/**
 *
 * @param {string} projectSlug
 * @param {Date} endsAt
 */
export function registerProjectAutomationJob(projectSlug, endsAt) {
    const job = schedule.scheduleJob(endsAt, handleRunProjectAutomationAsync.bind(projectSlug));
    ProjectJobs[projectSlug] = job;

    Logger.info(`Register event for project slug - ${projectSlug}`)
}

export async function runOldProjectAutomationJobAsync() {
    // load all project from contract
}

/**
 *
 * @param {string} projectSlug
 */
async function handleRunProjectAutomationAsync(projectSlug) {
    try {
        Logger.info(`======> Project Automation Job - Slug = ${projectSlug}`);
        const contract = await sdk.getContract(APP_CONFIG.contractAddress);

        const result = await contract.call("automateDeliverMoney", [projectSlug]);
        Logger.info(`======> Project Automation Job - Slug = ${projectSlug} - ${result}`);

        // remove job
        RedisClient.getRedisClient().del(`projects_automation:${projectSlug}`);
    } catch (error) {
        Logger.error("Project Automation Job - Failed");
        Logger.error(error);
    }
}
