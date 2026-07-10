import type { PlayerLog } from "../types/player";
import { Consumable } from "../components/Consumable";

import "./PotionsIngredientsTab.css";

interface PotionsIngredientsTabProps {
	log: PlayerLog;
	onChange: (next: PlayerLog) => void;
}

export function PotionsIngredientsTab({
	log,
	onChange,
}: PotionsIngredientsTabProps) {
	const update = (partial: Partial<PlayerLog>) =>
		onChange({ ...log, ...partial });

	const onPotionNameChange = (index: number, name: string) => {
		const potions = [...log.potions];
		potions[index] = { ...potions[index], name };
		update({ potions });
	};
	const onPotionQuantityChange = (index: number, quantity: number) => {
		const potions = [...log.potions];
		potions[index] = { ...potions[index], quantity };
		update({ potions });
	};

	const onIngredientNameChange = (index: number, name: string) => {
		const ingredients = [...log.ingredients];
		ingredients[index] = { ...ingredients[index], name };
		update({ ingredients });
	};
	const onIngredientQuantityChange = (index: number, quantity: number) => {
		const ingredients = [...log.ingredients];
		ingredients[index] = {
			...ingredients[index],
			quantity,
		};
		update({ ingredients });
	};

	const addPotion = () =>
		update({ potions: [...log.potions, { name: "", quantity: 0 }] });

	const removePotion = (index: number) =>
		update({ potions: log.potions.filter((_, i) => i !== index) });

	const addIngredient = () =>
		update({ ingredients: [...log.ingredients, { name: "", quantity: 0 }] });

	const removeIngredient = (index: number) =>
		update({ ingredients: log.ingredients.filter((_, i) => i !== index) });

	return (
		<div className="tab-content potions-ingredients-tab">
			<fieldset>
				<legend>Potions</legend>
				{log.potions.map((potion, i) => (
					<div key={i} className="consumable-row">
						<Consumable
							consumable={potion}
							onNameChange={(name) => onPotionNameChange(i, name)}
							onQuantityChange={(quantity) =>
								onPotionQuantityChange(i, quantity)
							}
						/>
						<button
							type="button"
							className="btn-remove"
							title="Remove"
							onClick={() => removePotion(i)}
						>
							×
						</button>
					</div>
				))}
				<button type="button" className="btn-secondary" onClick={addPotion}>
					Add Potion
				</button>
			</fieldset>

			<fieldset>
				<legend>Ingredients</legend>
				{log.ingredients.map((ingredient, i) => (
					<div key={i} className="consumable-row">
						<Consumable
							consumable={ingredient}
							onNameChange={(name) => onIngredientNameChange(i, name)}
							onQuantityChange={(quantity) =>
								onIngredientQuantityChange(i, quantity)
							}
						/>
						<button
							type="button"
							className="btn-remove"
							title="Remove"
							onClick={() => removeIngredient(i)}
						>
							×
						</button>
					</div>
				))}
				<button type="button" className="btn-secondary" onClick={addIngredient}>
					Add Ingredient
				</button>
			</fieldset>

			<div className="rulebox">
				<h2>Potion Rules</h2>
				<p>
					You can only brew a potion after acquiring the Brewing Station
					Discovery card.
				</p>
				<p>Potion brewing rules can be found in the rules glossary.</p>
				<p>
					If you obtain a potion before acquiring these cards, you can still
					consume it and refer to the card for its effects.
				</p>
				<p>You may consume a potion at any point during the game.</p>
			</div>
		</div>
	);
}
