import type { PlayerLog } from "../types/player";

import "./BroomwaysTab.css";
import "./MainTab.css";

interface BroomwaysTabProps {
	log: PlayerLog;
	onChange: (next: PlayerLog) => void;
}

export function BroomwaysTab({ log, onChange }: BroomwaysTabProps) {
	const update = (partial: Partial<PlayerLog>) =>
		onChange({ ...log, ...partial });

	const onBroomwayChange = (index: number, value: string) => {
		const broomways = [...log.broomways];
		broomways[index] = value;
		update({ broomways });
	};

	return (
		<div className="tab-content broomways-tab">
			<fieldset>
				<legend>Broomways</legend>
				<p className="hint">
					If you find a Broomway in your scene, record the scene number,
					location, and any additional details in one of the spaces below. You
					can interact with a Broomway to move to any other discovered Broomway.
				</p>
				<br />
				<div className="broomways-grid">
					{log.broomways.slice(0, 8).map((value, i) => (
						<textarea
							key={i}
							className="broomway-area"
							value={value}
							onChange={(e) => onBroomwayChange(i, e.target.value)}
						/>
					))}
					<textarea
						className="broomway-area broomway-area-wide"
						value={log.broomways[8]}
						onChange={(e) => onBroomwayChange(8, e.target.value)}
					/>
				</div>
			</fieldset>
		</div>
	);
}
