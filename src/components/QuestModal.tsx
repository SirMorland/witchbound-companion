import { useState, useRef, useEffect } from "react";
import type { Quest } from "../types/player";
import { CircleInput } from "./CircleInput";

import "./QuestModal.css";

interface QuestModalProps {
	quest: Quest;
	onSave: (patch: Partial<Quest>) => void;
	onDelete?: () => void;
	onClose: () => void;
}

export function QuestModal({
	quest,
	onSave,
	onDelete,
	onClose,
}: QuestModalProps) {
	const [name, setName] = useState(quest.name);
	const [entry, setEntry] = useState(quest.entry ?? "");
	const [notes, setNotes] = useState(quest.notes);
	const [completed, setCompleted] = useState(quest.completed);
	const nameRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		nameRef.current?.focus();
	}, []);

	const handleSave = () => {
		onSave({
			name,
			entry: entry === "" ? undefined : Number(entry),
			notes,
			completed,
		});
		onClose();
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
			handleSave();
		}
	};

	return (
		<div className="quest-overlay" onClick={onClose}>
			<div
				className="quest-panel quest-editor"
				onClick={(e) => e.stopPropagation()}
			>
				<div className="quest-editor-fields">
					<label className="editor-field">
						<span className="editor-label">Quest Name</span>
						<input
							ref={nameRef}
							type="text"
							value={name}
							onChange={(e) => setName(e.target.value)}
							placeholder="Quest name"
						/>
					</label>

					<label className="editor-field">
						<span className="editor-label">Entry</span>
						<input
							type="number"
							value={entry}
							onChange={(e) => setEntry(e.target.value)}
							placeholder="Entry #"
							className="editor-number"
						/>
					</label>

					<label className="completed-editor completed-label">
						<span className="editor-label">Completed</span>
						<div className="completed-circle">
							<CircleInput
								value={completed}
								onChange={(checked) => setCompleted(checked)}
							/>
						</div>
					</label>
				</div>

				<label className="editor-field editor-field-full">
					<span className="editor-label">Notes</span>
					<textarea
						value={notes}
						onChange={(e) => setNotes(e.target.value)}
						onKeyDown={handleKeyDown}
						placeholder="Enter notes…"
					/>
				</label>

				<div className="quest-actions">
					{onDelete && (
						<button
							type="button"
							className="delete-quest-btn"
							onClick={onDelete}
						>
							Delete Quest
						</button>
					)}
					<button type="button" className="cancel-btn" onClick={onClose}>
						Cancel
					</button>
					<button type="button" className="save-btn" onClick={handleSave}>
						Save
					</button>
				</div>
			</div>
		</div>
	);
}
