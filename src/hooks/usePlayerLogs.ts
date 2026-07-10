import { useState, useEffect } from "react";
import type { PlayerLog, Tool, Gift, Action } from "../types/player";

/* Game design constants */
const DEFAULT_TOOLS_COUNT = 3;
const DEFAULT_SPELLS_COUNT = 4;
const DEFAULT_PROMPTS_COUNT = 6;
const DEFAULT_GIFTS_COUNT = 2;
const MAX_DISCOVERIES = 16;
const MAX_ACHIEVEMENTS = 18;

const STORAGE_KEY = "witchbound-companion";

interface StoredState {
	activeTab: string;
	logs: PlayerLog[];
}

function loadDefaultLog(): PlayerLog {
	return {
		hearts: 0,
		magic: 0,
		luck: 0,
		coins: undefined,
		poisoned: false,
		jinxed: false,
		familiarName: "",
		familiarEnergy: 0,
		familiarAction: { number: undefined, name: "" },
		tools: Array.from(
			{ length: DEFAULT_TOOLS_COUNT },
			() =>
				({
					number: undefined,
					name: "",
					damaged: false,
				}) as Tool,
		),
		spells: Array.from(
			{ length: DEFAULT_SPELLS_COUNT },
			() =>
				({
					number: undefined,
					name: "",
				}) as Action,
		),
		prompts: Array.from(
			{ length: DEFAULT_PROMPTS_COUNT },
			() =>
				({
					number: undefined,
					name: "",
				}) as Action,
		),
		gifts: Array.from(
			{ length: DEFAULT_GIFTS_COUNT },
			() =>
				({
					number: undefined,
					name: "",
					quantity: 0,
				}) as Gift,
		),
		mainQuests: [],
		sideQuests: [],
		keywords: [],
		potions: [],
		ingredients: [],
		discoveries: Array.from({ length: MAX_DISCOVERIES }, () => false),
		achievements: Array.from({ length: MAX_ACHIEVEMENTS }, () => false),
	};
}

function loadState(): StoredState {
	const raw = localStorage.getItem(STORAGE_KEY);
	if (!raw) return { activeTab: "Main", logs: [loadDefaultLog()] };
	try {
		const parsed = JSON.parse(raw);
		return {
			activeTab:
				typeof parsed.activeTab === "string" ? parsed.activeTab : "Main",
			logs: Array.isArray(parsed.logs) ? parsed.logs : [loadDefaultLog()],
		};
	} catch {
		// corrupt data — fall back to default
	}
	return { activeTab: "Main", logs: [loadDefaultLog()] };
}

function saveState(state: StoredState) {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function usePlayerLogs() {
	const [state, setState] = useState<StoredState>(loadState);

	const logs = state.logs;
	const activeTab = state.activeTab;

	useEffect(() => {
		saveState(state);
	}, [state]);

	const setLogs = (updater: React.SetStateAction<PlayerLog[]>) =>
		setState((prev) => ({
			...prev,
			logs: typeof updater === "function" ? updater(prev.logs) : updater,
		}));

	const setActiveTab = (updater: React.SetStateAction<string>) =>
		setState((prev) => ({
			...prev,
			activeTab:
				typeof updater === "function" ? updater(prev.activeTab) : updater,
		}));

	return { logs, setLogs, activeTab, setActiveTab };
}
