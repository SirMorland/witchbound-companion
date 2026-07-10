import { useState } from "react";
import { QuestRow } from "../components/QuestRow";
import { QuestModal } from "../components/QuestModal";

import type { PlayerLog, Quest } from "../types/player";
import type { SortDirection, QuestSort } from "../hooks/usePlayerLogs";

import "./QuestsKeywordsTab.css";
import "./MainTab.css";

const EMPTY_QUEST = { name: "", entry: undefined, notes: "", completed: false };

interface QuestsKeywordsTabProps {
	log: PlayerLog;
	onChange: (next: PlayerLog) => void;
	mainQuestSort: QuestSort | undefined;
	setMainQuestSort: (
		updater: React.SetStateAction<QuestSort | undefined>,
	) => void;
	sideQuestSort: QuestSort | undefined;
	setSideQuestSort: (
		updater: React.SetStateAction<QuestSort | undefined>,
	) => void;
	keywordSort: SortDirection | undefined;
	setKeywordSort: (
		updater: React.SetStateAction<SortDirection | undefined>,
	) => void;
}

function QuestSection({
	title,
	quests,
	questsSort,
	onToggleSort,
	onToggle,
	onSave,
	onRemove,
	onAdd,
	buttonLabel,
	sortedOrder,
}: {
	title: string;
	quests: Quest[];
	questsSort: QuestSort | undefined;
	onToggleSort: (field: QuestSort["field"]) => void;
	onToggle: (index: number) => void;
	onSave: (index: number, patch: Partial<Quest>) => void;
	onRemove: (index: number) => void;
	onAdd: () => void;
	buttonLabel: string;
	sortedOrder: number[];
}) {
	const [editingIndex, setEditingIndex] = useState<number | null>(null);
	const [isAdding, setIsAdding] = useState(false);

	const handleEdit = (index: number) => {
		setIsAdding(false);
		setEditingIndex(index);
	};

	const handleAdd = () => {
		setIsAdding(true);
		setEditingIndex(null);
	};

	const handleSave = (patch: Partial<Quest>) => {
		if (isAdding) {
			const newIndex = quests.length;
			onAdd();
			onSave(newIndex, patch);
		} else if (editingIndex !== null) {
			onSave(editingIndex, patch);
		}
		setEditingIndex(null);
		setIsAdding(false);
	};

	const handleDelete = () => {
		if (editingIndex !== null) {
			onRemove(editingIndex);
		}
		setEditingIndex(null);
	};

	const editingQuest = editingIndex !== null ? quests[editingIndex] : null;

	const indicator = (field: QuestSort["field"]) => {
		if (!questsSort || questsSort.field !== field) return "";
		return questsSort.direction === "asc" ? " ▲" : " ▼";
	};

	return (
		<fieldset>
			<legend>{title}</legend>
			<table className="quest-table">
				<thead>
					<tr>
						<th className="sortable" onClick={() => onToggleSort("name")}>
							Quest Name{indicator("name")}
						</th>
						<th className="sortable" onClick={() => onToggleSort("entry")}>
							Entry{indicator("entry")}
						</th>
						<th className="sortable" onClick={() => onToggleSort("completed")}>
							Completed{indicator("completed")}
						</th>
					</tr>
				</thead>
				<tbody>
					{sortedOrder.map((origIndex) => (
						<QuestRow
							key={origIndex}
							quest={quests[origIndex]}
							onToggle={() => onToggle(origIndex)}
							onEdit={() => handleEdit(origIndex)}
						/>
					))}
				</tbody>
			</table>

			{(editingQuest || isAdding) && (
				<QuestModal
					quest={isAdding ? EMPTY_QUEST : editingQuest!}
					onSave={handleSave}
					onDelete={isAdding ? undefined : handleDelete}
					onClose={() => {
						setEditingIndex(null);
						setIsAdding(false);
					}}
				/>
			)}

			<button type="button" className="btn-secondary" onClick={handleAdd}>
				{buttonLabel}
			</button>
		</fieldset>
	);
}

function sortedIndices(
	keywords: string[],
	direction: SortDirection | undefined,
): number[] {
	if (!direction) return keywords.map((_, i) => i);
	const indices = keywords.map((_, i) => i);
	const isEmp = (k: string) => k.trim() === "";
	indices.sort((a, b) => {
		const aEmpty = isEmp(keywords[a]);
		const bEmpty = isEmp(keywords[b]);
		if (aEmpty && !bEmpty) return 1;
		if (!aEmpty && bEmpty) return -1;
		return direction === "asc"
			? keywords[a].localeCompare(keywords[b])
			: keywords[b].localeCompare(keywords[a]);
	});
	return indices;
}

const SORT_ORDER: (SortDirection | undefined)[] = [undefined, "asc", "desc"];
const SORT_ICONS: Record<string, string> = {
	undefined: "",
	asc: " ▲",
	desc: " ▼",
};

function sortedQuestIndices(
	quests: Quest[],
	sort: QuestSort | undefined,
): number[] {
	if (!sort) return quests.map((_, i) => i);
	const indices = quests.map((_, i) => i);
	const isEmptyName = (q: Quest) => q.name.trim() === "";
	const isEmptyEntry = (q: Quest) => q.entry === undefined;
	indices.sort((a, b) => {
		const aEmpty =
			sort.field === "name"
				? isEmptyName(quests[a])
				: sort.field === "entry"
					? isEmptyEntry(quests[a])
					: false;
		const bEmpty =
			sort.field === "name"
				? isEmptyName(quests[b])
				: sort.field === "entry"
					? isEmptyEntry(quests[b])
					: false;
		if (aEmpty && !bEmpty) return 1;
		if (!aEmpty && bEmpty) return -1;
		let cmp = 0;
		if (sort.field === "name") {
			cmp = quests[a].name.localeCompare(quests[b].name);
		} else if (sort.field === "entry") {
			cmp = (quests[a].entry ?? 0) - (quests[b].entry ?? 0);
		} else if (sort.field === "completed") {
			cmp = (quests[a].completed ? 1 : 0) - (quests[b].completed ? 1 : 0);
		}
		return sort.direction === "desc" ? -cmp : cmp;
	});
	return indices;
}

export function QuestsKeywordsTab({
	log,
	onChange,
	mainQuestSort,
	setMainQuestSort,
	sideQuestSort,
	setSideQuestSort,
	keywordSort,
	setKeywordSort,
}: QuestsKeywordsTabProps) {
	const update = (partial: Partial<PlayerLog>) =>
		onChange({ ...log, ...partial });

	const makeQuestUpdater =
		(kind: "mainQuests" | "sideQuests") =>
		(index: number, patch: Partial<Quest>) => {
			const quests = [...log[kind]];
			quests[index] = { ...quests[index], ...patch };
			update({ [kind]: quests });
		};

	const onMainToggle = makeQuestUpdater("mainQuests");
	const onMainNameChange = makeQuestUpdater("mainQuests");

	const onSideToggle = makeQuestUpdater("sideQuests");
	const onSideNameChange = makeQuestUpdater("sideQuests");

	const addQuest = (kind: "mainQuests" | "sideQuests") =>
		update({
			[kind]: [
				...log[kind],
				{ name: "", entry: undefined, notes: "", completed: false },
			],
		});

	const removeQuest = (kind: "mainQuests" | "sideQuests", index: number) =>
		update({ [kind]: log[kind].filter((_, i) => i !== index) });

	const addKeyword = () => update({ keywords: [...log.keywords, ""] });

	const removeKeyword = (index: number) =>
		update({ keywords: log.keywords.filter((_, i) => i !== index) });

	const updateKeyword = (index: number, value: string) => {
		const keywords = [...log.keywords];
		keywords[index] = value;
		update({ keywords });
	};

	const cycleKeywordSort = () => {
		const currentIdx = SORT_ORDER.indexOf(keywordSort);
		const next = SORT_ORDER[(currentIdx + 1) % SORT_ORDER.length];
		setKeywordSort(next);
	};

	const cycleQuestSort =
		(kind: "mainQuests" | "sideQuests") => (field: QuestSort["field"]) => {
			const current = kind === "mainQuests" ? mainQuestSort : sideQuestSort;
			if (!current || current.field !== field) {
				// Switch to this field, start with asc
				const next: QuestSort = { field, direction: "asc" };
				if (kind === "mainQuests") setMainQuestSort(next);
				else setSideQuestSort(next);
			} else if (current.direction === "asc") {
				// Toggle to desc
				const next: QuestSort = { field, direction: "desc" };
				if (kind === "mainQuests") setMainQuestSort(next);
				else setSideQuestSort(next);
			} else {
				// Cycle back to no sort
				if (kind === "mainQuests") setMainQuestSort(undefined);
				else setSideQuestSort(undefined);
			}
		};

	const mainSortedOrder = sortedQuestIndices(log.mainQuests, mainQuestSort);
	const sideSortedOrder = sortedQuestIndices(log.sideQuests, sideQuestSort);
	const keywordSortedOrder = sortedIndices(log.keywords, keywordSort);

	return (
		<div className="tab-content">
			<QuestSection
				title="Main Quests"
				quests={log.mainQuests}
				questsSort={mainQuestSort}
				onToggleSort={cycleQuestSort("mainQuests")}
				onToggle={(i) =>
					onMainToggle(i, { completed: !log.mainQuests[i].completed })
				}
				onSave={(i, patch) => onMainNameChange(i, patch)}
				onRemove={(i) => removeQuest("mainQuests", i)}
				onAdd={() => addQuest("mainQuests")}
				buttonLabel="Add Main Quest"
				sortedOrder={mainSortedOrder}
			/>

			<QuestSection
				title="Side Quests"
				quests={log.sideQuests}
				questsSort={sideQuestSort}
				onToggleSort={cycleQuestSort("sideQuests")}
				onToggle={(i) =>
					onSideToggle(i, { completed: !log.sideQuests[i].completed })
				}
				onSave={(i, patch) => onSideNameChange(i, patch)}
				onRemove={(i) => removeQuest("sideQuests", i)}
				onAdd={() => addQuest("sideQuests")}
				buttonLabel="Add Side Quest"
				sortedOrder={sideSortedOrder}
			/>

			<fieldset>
				<legend>Keywords</legend>
				<span
					className="section-label keyword-sort"
					onClick={cycleKeywordSort}
					title="Click to cycle sort order"
				>
					Keyword
					<span className="sort-indicator">
						{SORT_ICONS[keywordSort ?? "undefined"]}
					</span>
				</span>
				<div className="keyword-list">
					{keywordSortedOrder.map((origIndex) => (
						<div key={origIndex} className="keyword-row">
							<input
								type="text"
								className="keyword-input"
								value={log.keywords[origIndex]}
								placeholder={`Keyword ${origIndex + 1}`}
								onChange={(e) => updateKeyword(origIndex, e.target.value)}
							/>
							<button
								type="button"
								className="btn-remove"
								title="Remove keyword"
								onClick={() => removeKeyword(origIndex)}
							>
								×
							</button>
						</div>
					))}
					<button type="button" className="btn-secondary" onClick={addKeyword}>
						Add Keyword
					</button>
				</div>
			</fieldset>
		</div>
	);
}
