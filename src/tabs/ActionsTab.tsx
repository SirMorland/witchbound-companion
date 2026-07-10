import type { PlayerLog, Tool, Gift, Action } from "../types/player";
import { ActionNumber } from "../components/ActionNumber";
import { CircleInput } from "../components/CircleInput";

import "./ActionsTab.css";
import "./MainTab.css";

interface ActionsTabProps {
	log: PlayerLog;
	onChange: (next: PlayerLog) => void;
}

export function ActionsTab({ log, onChange }: ActionsTabProps) {
	const update = (partial: Partial<PlayerLog>) =>
		onChange({ ...log, ...partial });

	// Tools
	const onToolNameChange = (index: number, name: string) => {
		const tools = [...log.tools];
		tools[index] = { ...tools[index], name };
		update({ tools });
	};
	const onToolNumberChange = (index: number, number: number | undefined) => {
		const tools = [...log.tools];
		tools[index] = { ...tools[index], number };
		update({ tools });
	};

	// Spells
	const onSpellNameChange = (index: number, name: string) => {
		const spells = [...log.spells];
		spells[index] = { ...spells[index], name };
		update({ spells });
	};
	const onSpellNumberChange = (index: number, number: number | undefined) => {
		const spells = [...log.spells];
		spells[index] = { ...spells[index], number };
		update({ spells });
	};

	// Prompts
	const onPromptNameChange = (index: number, name: string) => {
		const prompts = [...log.prompts];
		prompts[index] = { ...prompts[index], name };
		update({ prompts });
	};
	const onPromptNumberChange = (index: number, number: number | undefined) => {
		const prompts = [...log.prompts];
		prompts[index] = { ...prompts[index], number };
		update({ prompts });
	};

	// Gifts
	const onGiftNameChange = (index: number, name: string) => {
		const gifts = [...log.gifts];
		gifts[index] = { ...gifts[index], name };
		update({ gifts });
	};
	const onGiftNumberChange = (index: number, number: number | undefined) => {
		const gifts = [...log.gifts];
		gifts[index] = { ...gifts[index], number };
		update({ gifts });
	};
	const onGiftQuantityChange = (index: number, quantity: number) => {
		const gifts = [...log.gifts];
		gifts[index] = { ...gifts[index], quantity };
		update({ gifts });
	};

	const renderTool = (tool: Tool, index: number) => (
		<div key={index} className="action-row">
			<ActionNumber
				action={tool}
				onNumberChange={(number) => onToolNumberChange(index, number)}
				onNameChange={(name) => onToolNameChange(index, name)}
			/>
			<div className="action-row__suffix">
				<label className="damaged-label">
					<CircleInput
						value={tool.damaged}
						onChange={(checked) => {
							const tools = [...log.tools];
							tools[index] = { ...tools[index], damaged: checked };
							update({ tools });
						}}
					/>
					<span className="damaged-text">Damaged</span>
				</label>
			</div>
		</div>
	);

	const renderSpell = (spell: Action, index: number) => (
		<div key={index} className="action-row">
			<ActionNumber
				action={spell}
				onNumberChange={(number) => onSpellNumberChange(index, number)}
				onNameChange={(name) => onSpellNameChange(index, name)}
			/>
		</div>
	);

	const renderPrompt = (prompt: Action, index: number) => (
		<div key={index} className="action-row">
			<ActionNumber
				action={prompt}
				onNumberChange={(number) => onPromptNumberChange(index, number)}
				onNameChange={(name) => onPromptNameChange(index, name)}
			/>
		</div>
	);

	const renderGift = (gift: Gift, index: number) => (
		<div key={index} className="action-row">
			<ActionNumber
				action={gift}
				onNumberChange={(number) => onGiftNumberChange(index, number)}
				onNameChange={(name) => onGiftNameChange(index, name)}
				onQuantityChange={(quantity) => onGiftQuantityChange(index, quantity)}
			/>
		</div>
	);

	return (
		<div className="tab-content actions-tab">
			<fieldset>
				<legend>Basic Actions</legend>
				<p className="hint">
					Can be used to interact with POIs, NPCs, & Encounters
				</p>
				<div className="basic-actions">
					<ActionNumber action={{ number: 1, name: "" }} icon="eye.svg" />
					<ActionNumber action={{ number: 2, name: "" }} icon="hand.svg" />
				</div>
			</fieldset>

			<fieldset>
				<legend>Familiar</legend>
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
			</fieldset>

			<fieldset>
				<legend>Tools</legend>
				<p className="hint">Can be used to interact with POIs & Encounters</p>
				{log.tools.map((tool, i) => renderTool(tool, i))}
				<p className="hint">
					Damaged Tools cannot be used until they are repaired
				</p>
			</fieldset>

			<fieldset>
				<legend>Spells</legend>
				<p className="hint">Can be used to interact with POIs & Encounters</p>
				{log.spells.map((spell, i) => renderSpell(spell, i))}
			</fieldset>

			<fieldset>
				<legend>Prompts</legend>
				<p className="hint">Can be used to interact with NPCs</p>
				{log.prompts.map((prompt, i) => renderPrompt(prompt, i))}
			</fieldset>

			<fieldset>
				<legend>Gifts</legend>
				<p className="hint">
					Can be used to interact with POIs, NPCs, & Encounters
				</p>
				{log.gifts.map((gift, i) => renderGift(gift, i))}
			</fieldset>

			<div className="rulebox">
				<h2>Inventory Rules</h2>
				<p>
					The bubbles in each space represent the max quantity you can hold of
					that particular item.
				</p>
				<p>You cannot carry the same item in multiple spaces.</p>
			</div>
		</div>
	);
}
