import type { Consumable } from "../types/player";
import { CircleSelector } from "../components/CircleSelector";

import "./Consumable.css";

const MAX_QUANTITY = 3;

interface ConsumableProps {
	consumable: Consumable;
	onNameChange?: (value: string) => void;
	onQuantityChange?: (value: number) => void;
}

export function Consumable({
	consumable,
	onNameChange,
	onQuantityChange,
}: ConsumableProps) {
	return (
		<div className="consumable">
			<input
				type="text"
				value={consumable.name}
				onChange={(e) => {
					if (!onNameChange) return;
					onNameChange(e.target.value);
				}}
				className="consumable__name"
				disabled={!onNameChange}
			/>
			<div className="consumable__quantity">
				<CircleSelector
					value={consumable.quantity}
					max={MAX_QUANTITY}
					onChange={(quantity) => {
						if (!onQuantityChange) return;
						onQuantityChange(quantity);
					}}
				/>
			</div>
		</div>
	);
}
