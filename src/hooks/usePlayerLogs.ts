import { useState, useEffect } from "react";
import type { PlayerLog, Tool, Gift, Action, Quest } from "../types/player";

/* Game design constants */
const DEFAULT_TOOLS_COUNT = 3;
const DEFAULT_SPELLS_COUNT = 4;
const DEFAULT_PROMPTS_COUNT = 6;
const DEFAULT_GIFTS_COUNT = 2;
const MAX_DISCOVERIES = 16;
const MAX_FOLLOWERS = 3;
const MAX_ACHIEVEMENTS = 18;
const BROOMWAYS_COUNT = 9;

const STORAGE_KEY = "witchbound-companion";

export type SortDirection = "asc" | "desc";

export interface QuestSort {
	field: keyof Quest;
	direction: SortDirection;
}

interface StoredState {
	activeTab: number;
	mainQuestSort?: QuestSort;
	sideQuestSort?: QuestSort;
	keywordSort?: SortDirection;
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
		followers: Array.from({ length: MAX_FOLLOWERS }, () => false),
		achievements: Array.from({ length: MAX_ACHIEVEMENTS }, () => false),
		broomways: Array.from({ length: BROOMWAYS_COUNT }, () => ""),
		notes: undefined,
	};
}

function migrateLog(log: PlayerLog): PlayerLog {
	if (!log.followers) {
		return {
			...log,
			followers: Array.from({ length: MAX_FOLLOWERS }, () => false),
		};
	}
	if (!log.broomways) {
		return {
			...log,
			broomways: Array.from({ length: BROOMWAYS_COUNT }, () => ""),
		};
	}
	return log;
}

function loadState(): StoredState {
	const raw = localStorage.getItem(STORAGE_KEY);
	if (!raw)
		return {
			activeTab: 0,
			mainQuestSort: undefined,
			sideQuestSort: undefined,
			keywordSort: undefined,
			logs: [loadDefaultLog()],
		};
	try {
		const parsed = JSON.parse(raw);
		const rawLogs = Array.isArray(parsed.logs) ? parsed.logs : [];
		const needsMigration = rawLogs.some(
			(log: Record<string, unknown>) => !log.followers || !log.broomways,
		);

		return {
			activeTab: parsed.activeTab,
			mainQuestSort: parsed.mainQuestSort,
			sideQuestSort: parsed.sideQuestSort,
			keywordSort: parsed.keywordSort,
			logs: needsMigration
				? rawLogs.map((log: PlayerLog) => migrateLog(log))
				: rawLogs,
		};
	} catch {
		// corrupt data — fall back to default
	}
	return {
		activeTab: 0,
		mainQuestSort: undefined,
		sideQuestSort: undefined,
		keywordSort: undefined,
		logs: [loadDefaultLog()],
	};
}

function saveState(state: StoredState) {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function usePlayerLogs() {
	const [state, setState] = useState<StoredState>(loadState);

	const logs = state.logs;
	const activeTab = state.activeTab;
	const mainQuestSort = state.mainQuestSort;
	const sideQuestSort = state.sideQuestSort;
	const keywordSort = state.keywordSort;

	useEffect(() => {
		saveState(state);
	}, [state]);

	const setLogs = (updater: React.SetStateAction<PlayerLog[]>) =>
		setState((prev) => ({
			...prev,
			logs: typeof updater === "function" ? updater(prev.logs) : updater,
		}));

	const setActiveTab = (updater: React.SetStateAction<number>) =>
		setState((prev) => ({
			...prev,
			activeTab:
				typeof updater === "function" ? updater(prev.activeTab) : updater,
		}));

	const setMainQuestSort = (
		updater: React.SetStateAction<QuestSort | undefined>,
	) =>
		setState((prev) => ({
			...prev,
			mainQuestSort:
				typeof updater === "function" ? updater(prev.mainQuestSort) : updater,
		}));

	const setSideQuestSort = (
		updater: React.SetStateAction<QuestSort | undefined>,
	) =>
		setState((prev) => ({
			...prev,
			sideQuestSort:
				typeof updater === "function" ? updater(prev.sideQuestSort) : updater,
		}));

	const setKeywordSort = (
		updater: React.SetStateAction<SortDirection | undefined>,
	) =>
		setState((prev) => ({
			...prev,
			keywordSort:
				typeof updater === "function" ? updater(prev.keywordSort) : updater,
		}));

	return {
		logs,
		setLogs,
		activeTab,
		setActiveTab,
		mainQuestSort,
		setMainQuestSort,
		sideQuestSort,
		setSideQuestSort,
		keywordSort,
		setKeywordSort,
	};
}
