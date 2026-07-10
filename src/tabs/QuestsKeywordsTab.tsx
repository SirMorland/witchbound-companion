import { useState } from "react";
import { QuestRow } from "../components/QuestRow";
import { QuestModal } from "../components/QuestModal";

import type { PlayerLog, Quest } from "../types/player";

import "./QuestsKeywordsTab.css";
import "./MainTab.css";

const EMPTY_QUEST = { name: "", entry: undefined, notes: "", completed: false };

interface QuestsKeywordsTabProps {
	log: PlayerLog;
	onChange: (next: PlayerLog) => void;
}

function QuestSection({
	title,
	quests,
	onToggle,
	onSave,
	onRemove,
	onAdd,
	buttonLabel,
}: {
	title: string;
	quests: Quest[];
	onToggle: (index: number) => void;
	onSave: (index: number, patch: Partial<Quest>) => void;
	onRemove: (index: number) => void;
	onAdd: () => void;
	buttonLabel: string;
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

	return (
		<fieldset>
			<legend>{title}</legend>
			<table className="quest-table">
				<thead>
					<tr>
						<th>Quest Name</th>
						<th>Entry</th>
						<th>Notes</th>
						<th>Completed</th>
					</tr>
				</thead>
				<tbody>
					{quests.map((quest, i) => (
						<QuestRow
							key={i}
							quest={quest}
							onToggle={() => onToggle(i)}
							onEdit={() => handleEdit(i)}
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

export function QuestsKeywordsTab({ log, onChange }: QuestsKeywordsTabProps) {
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

	return (
		<div className="tab-content">
			<QuestSection
				title="Main Quests"
				quests={log.mainQuests}
				onToggle={(i) =>
					onMainToggle(i, { completed: !log.mainQuests[i].completed })
				}
				onSave={(i, patch) => onMainNameChange(i, patch)}
				onRemove={(i) => removeQuest("mainQuests", i)}
				onAdd={() => addQuest("mainQuests")}
				buttonLabel="Add Main Quest"
			/>

			<QuestSection
				title="Side Quests"
				quests={log.sideQuests}
				onToggle={(i) =>
					onSideToggle(i, { completed: !log.sideQuests[i].completed })
				}
				onSave={(i, patch) => onSideNameChange(i, patch)}
				onRemove={(i) => removeQuest("sideQuests", i)}
				onAdd={() => addQuest("sideQuests")}
				buttonLabel="Add Side Quest"
			/>

			<fieldset>
				<legend>Keywords</legend>
				<div className="keyword-list">
					{log.keywords.map((kw, i) => (
						<div key={i} className="keyword-row">
							<input
								type="text"
								className="keyword-input"
								value={kw}
								placeholder={`Keyword ${i + 1}`}
								onChange={(e) => updateKeyword(i, e.target.value)}
							/>
							<button
								type="button"
								className="btn-remove"
								title="Remove keyword"
								onClick={() => removeKeyword(i)}
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
