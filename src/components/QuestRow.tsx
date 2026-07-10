import type { Quest } from "../types/player";
import { CircleInput } from "./CircleInput";

import "./QuestRow.css";

interface QuestRowProps {
	quest: Quest;
	onToggle: () => void;
	onEdit: () => void;
}

export function QuestRow({ quest, onToggle, onEdit }: QuestRowProps) {
	return (
		<tr className="quest-row" onClick={onEdit}>
			<td>{quest.name || <span className="empty-hint">unnamed</span>}</td>
			<td className="quest-entry">
				{quest.entry != null ? (
					String(quest.entry)
				) : (
					<span className="empty-hint">—</span>
				)}
			</td>
			<td className="quest-notes-preview">
				{quest.notes ? (
					<span className="notes-text">…</span>
				) : (
					<span className="empty-hint">—</span>
				)}
			</td>
			<td className="quest-done">
				<label className="completed-label" onClick={(e) => e.stopPropagation()}>
					<CircleInput value={quest.completed} onChange={() => onToggle()} />
				</label>
			</td>
		</tr>
	);
}
