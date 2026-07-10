import type { PlayerLog } from "../types/player";
import { GridCheckboxes } from "../components/GridCheckboxes";

import "./DiscoveriesAchievementsTab.css";
import "./MainTab.css";

interface DiscoveriesAchievementsTabProps {
	log: PlayerLog;
	onChange: (next: PlayerLog) => void;
}

export function DiscoveriesAchievementsTab({
	log,
	onChange,
}: DiscoveriesAchievementsTabProps) {
	const update = (partial: Partial<PlayerLog>) =>
		onChange({ ...log, ...partial });

	const onDiscoveryToggle = (index: number) => {
		const discoveries = [...log.discoveries];
		discoveries[index] = !discoveries[index];
		update({ discoveries });
	};

	const onAchievementToggle = (index: number) => {
		const achievements = [...log.achievements];
		achievements[index] = !achievements[index];
		update({ achievements });
	};

	return (
		<div className="tab-content discoveries-achievements-tab">
			<fieldset>
				<legend>Discoveries</legend>
				<p className="hint">
					If you gain any of the following Discovery cards during play, mark the
					corresponding bubble. Collect these cards each time you play.
				</p>
				<GridCheckboxes
					checked={log.discoveries}
					onToggle={onDiscoveryToggle}
					startLetter="A"
				/>
			</fieldset>

			<fieldset>
				<legend>Achievements</legend>
				<p className="hint">
					If you gain any of the following achievements during play, mark the
					corresponding bubble.
				</p>
				<GridCheckboxes
					checked={log.achievements}
					onToggle={onAchievementToggle}
					startLetter="A"
				/>
				<p className="hint">
					Each time you gain 3 Achievements:
					<br />
					<span className="golden">READ ENTRY 4003</span>
				</p>
			</fieldset>
		</div>
	);
}
