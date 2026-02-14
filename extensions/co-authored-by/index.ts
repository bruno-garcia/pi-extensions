/**
 * Co-Authored-By Extension
 *
 * Automatically appends git trailers to commit messages when the agent
 * runs `git commit`. Adds:
 *   - The model used (e.g., Claude Sonnet 4)
 *   - The pi version (e.g., pi 0.52.12)
 *
 * Example commit message:
 *   fix: resolve null pointer
 *
 *   Co-Authored-By: Claude Sonnet 4 <noreply@pi.dev>
 *   Generated-By: pi 0.52.12
 */

import type { ExtensionAPI } from "@mariozechner/pi-coding-agent";
import { isToolCallEventType, VERSION } from "@mariozechner/pi-coding-agent";
import { isGitCommit, appendTrailers } from "./commit.js";

export default function (pi: ExtensionAPI) {
	pi.on("tool_call", async (event, ctx) => {
		if (!isToolCallEventType("bash", event)) return;

		const cmd = event.input.command;
		if (!isGitCommit(cmd)) return;

		const model = ctx.model;
		const modelName = model ? (model.name || `${model.provider}/${model.id}`) : "unknown";

		event.input.command = appendTrailers(cmd, modelName, VERSION);
	});
}
