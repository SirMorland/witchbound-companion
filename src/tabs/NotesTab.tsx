import type { PlayerLog } from "../types/player";

import "./NotesTab.css";
import "./MainTab.css";

interface NotesTabProps {
	log: PlayerLog;
	onChange: (next: PlayerLog) => void;
}

export function NotesTab({ log, onChange }: NotesTabProps) {
	const update = (partial: Partial<PlayerLog>) =>
		onChange({ ...log, ...partial });

	const onNotesChange = (value: string) => {
		update({ notes: value });
	};

	return (
		<div className="tab-content notes-tab">
			<fieldset>
				<legend>Notes</legend>
				<textarea
					className="notes-area"
					value={log.notes ?? ""}
					onChange={(e) => onNotesChange(e.target.value)}
				/>
			</fieldset>
		</div>
	);
}
