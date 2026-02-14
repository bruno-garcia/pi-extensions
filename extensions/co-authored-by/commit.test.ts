import { describe, it, expect } from "vitest";
import { isGitCommit, appendTrailers } from "./commit.js";

describe("isGitCommit", () => {
	it("detects git commit -m", () => {
		expect(isGitCommit('git commit -m "fix bug"')).toBe(true);
	});

	it("detects git commit -am", () => {
		expect(isGitCommit('git commit -am "fix bug"')).toBe(true);
	});

	it("detects git commit with flags before -m", () => {
		expect(isGitCommit('git commit --allow-empty -m "init"')).toBe(true);
	});

	it("detects git commit with flags after -m", () => {
		expect(isGitCommit('git commit -m "msg" --no-verify')).toBe(true);
	});

	it("detects git commit -m without space before value", () => {
		expect(isGitCommit('git commit -m"no space"')).toBe(true);
	});

	it("detects git commit with line continuation", () => {
		expect(isGitCommit('git commit \\\n-m "msg"')).toBe(true);
	});

	it("rejects interactive git commit (no -m)", () => {
		expect(isGitCommit("git commit")).toBe(false);
	});

	it("rejects git commit --amend without -m", () => {
		expect(isGitCommit("git commit --amend")).toBe(false);
	});

	it("rejects non-commit git commands", () => {
		expect(isGitCommit("git log --oneline")).toBe(false);
	});

	it("rejects git status", () => {
		expect(isGitCommit("git status")).toBe(false);
	});

	it("rejects git push", () => {
		expect(isGitCommit("git push origin main")).toBe(false);
	});

	it("rejects empty string", () => {
		expect(isGitCommit("")).toBe(false);
	});

	it("detects git commit --amend -m (amend with new message)", () => {
		expect(isGitCommit('git commit --amend -m "new msg"')).toBe(true);
	});

	it("detects git commit with -S (signed) and -m", () => {
		expect(isGitCommit('git commit -S -m "signed commit"')).toBe(true);
	});
});

describe("appendTrailers", () => {
	it("appends trailers to a simple commit command", () => {
		const result = appendTrailers(
			'git commit -m "fix bug"',
			"Claude Sonnet 4",
			"0.52.12",
		);
		expect(result).toBe(
			`git commit -m "fix bug" -m "" -m $'Co-Authored-By: Claude Sonnet 4 <noreply@pi.dev>\\nGenerated-By: pi 0.52.12'`,
		);
	});

	it("trims trailing whitespace from original command", () => {
		const result = appendTrailers(
			'git commit -m "fix"   ',
			"Claude Sonnet 4",
			"0.52.12",
		);
		expect(result).toMatch(/^git commit -m "fix" -m/);
		expect(result).not.toMatch(/\s{2,}-m ""/);
	});

	it("includes model name in Co-Authored-By", () => {
		const result = appendTrailers(
			'git commit -m "msg"',
			"Gemini 2.5 Pro",
			"1.0.0",
		);
		expect(result).toContain("Co-Authored-By: Gemini 2.5 Pro <noreply@pi.dev>");
	});

	it("includes pi version in Generated-By", () => {
		const result = appendTrailers(
			'git commit -m "msg"',
			"Some Model",
			"1.2.3",
		);
		expect(result).toContain("Generated-By: pi 1.2.3");
	});

	it("uses $'' quoting for the trailer block", () => {
		const result = appendTrailers(
			'git commit -m "msg"',
			"Model",
			"1.0.0",
		);
		// The trailers should be in a single $'...' string with \\n separator
		expect(result).toMatch(/-m \$'Co-Authored-By:.*\\nGenerated-By:.*'/);
	});

	it("handles model name with special characters", () => {
		const result = appendTrailers(
			'git commit -m "msg"',
			"openai/gpt-4o",
			"0.50.0",
		);
		expect(result).toContain("Co-Authored-By: openai/gpt-4o <noreply@pi.dev>");
	});
});
