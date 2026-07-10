import type { PlayerLog } from "../types/player";
import { CircleSelector } from "../components/CircleSelector";
import { CircleInput } from "../components/CircleInput";
import { ActionNumber } from "../components/ActionNumber";

import "./MainTab.css";

const MAX_STAT = 5;

import reniPortrait from "../assets/reni-portrait-1.png?url";
import familiarPortrait from "../assets/familiar-portrait-1.png?url";
import heartsIcon from "../assets/hearts.svg?url";
import magicIcon from "../assets/magic.svg?url";
import luckIcon from "../assets/luck.svg?url";
import energyIcon from "../assets/energy.svg?url";

interface MainTabProps {
	log: PlayerLog;
	onChange: (next: PlayerLog) => void;
}

export function MainTab({ log, onChange }: MainTabProps) {
	const update = (partial: Partial<PlayerLog>) =>
		onChange({ ...log, ...partial });

	return (
		<div className="tab-content">
			<fieldset>
				<legend>Reni</legend>
				<img src={reniPortrait} alt="Portrait of Reni" className="portrait" />

				<div className="property-grid">
					<div className="property">
						<input
							id="coins"
							type="number"
							value={log.coins ?? ""}
							onChange={(e) =>
								update({
									coins:
										e.target.value !== "" ? Number(e.target.value) : undefined,
								})
							}
						/>
						<label htmlFor="coins">Coins:</label>
					</div>

					<div className="property">
						<h2>Hearts</h2>
						<div className="stat">
							<img src={heartsIcon} alt="" className="stat-icon" />
							<CircleSelector
								value={log.hearts}
								max={MAX_STAT}
								onChange={(hearts) => update({ hearts })}
							/>
						</div>
						<p className="hint">
							If your Hearts are reduced to 0, read entry 4000
						</p>
					</div>
					<div className="property">
						<h2>Magic</h2>
						<div className="stat">
							<img src={magicIcon} alt="" className="stat-icon" />
							<CircleSelector
								value={log.magic}
								max={MAX_STAT}
								onChange={(magic) => update({ magic })}
							/>
						</div>
					</div>
					<div className="property">
						<h2>Luck</h2>
						<div className="stat">
							<img src={luckIcon} alt="" className="stat-icon" />
							<CircleSelector
								value={log.luck}
								max={MAX_STAT}
								onChange={(luck) => update({ luck })}
							/>
						</div>
						<p className="hint">
							Spend one point of Luck to re-roll a single die
						</p>
					</div>

					<h2>Conditions</h2>
					<div className="property">
						<label className="condition-label">
							<CircleInput
								value={log.poisoned}
								onChange={() => update({ poisoned: !log.poisoned })}
							/>
							Poisoned
						</label>
						<p className="hint">
							While poisoned, your max Hearts and Magic are reduced to 3
						</p>
					</div>
					<div className="property">
						<label className="condition-label">
							<CircleInput
								value={log.jinxed}
								onChange={() => update({ jinxed: !log.jinxed })}
							/>
							Jinxed
						</label>
						<p className="hint">While Jinxed, your max Luck is reduced to 0</p>
					</div>
				</div>
			</fieldset>

			<fieldset>
				<legend>Familiar</legend>
				<img
					src={familiarPortrait}
					alt="Portrait of Familiar"
					className="portrait"
				/>

				<div className="property-grid">
					<div className="property">
						<input
							id="familiarName"
							type="text"
							value={log.familiarName}
							onChange={(e) => update({ familiarName: e.target.value })}
						/>
						<label htmlFor="familiarName">Name:</label>
					</div>
					<div className="property">
						<h2>Energy</h2>
						<div className="stat">
							<img src={energyIcon} alt="" className="stat-icon" />
							<CircleSelector
								value={log.familiarEnergy}
								max={MAX_STAT}
								onChange={(familiarEnergy) => update({ familiarEnergy })}
							/>
						</div>
					</div>
					<p className="hint">Can be used to interact with POIs & Encounters</p>
					<ActionNumber
						action={log.familiarAction}
						onNumberChange={(number) =>
							update({
								familiarAction: {
									...log.familiarAction,
									number,
								},
							})
						}
						onNameChange={(name) =>
							update({
								familiarAction: { ...log.familiarAction, name },
							})
						}
					/>
				</div>
			</fieldset>
		</div>
	);
}
