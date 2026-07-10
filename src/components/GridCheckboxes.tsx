import { Circle } from "./Circle";
import "./GridCheckboxes.css";

interface GridCheckboxesProps {
	checked: boolean[];
	onToggle: (index: number) => void;
	startLetter: string;
}

export function GridCheckboxes({
	checked,
	onToggle,
	startLetter,
}: GridCheckboxesProps) {
	const letters = checked.map((_, i) =>
		String.fromCharCode(startLetter.charCodeAt(0) + i),
	);

	return (
		<div className="grid-checkboxes">
			{checked.map((isOn, i) => (
				<label key={i} className="grid-checkboxes__item">
					<input
						type="checkbox"
						checked={isOn}
						onChange={() => onToggle(i)}
						hidden
					/>
					<Circle checked={isOn} />
					<span className="grid-checkboxes__letter">{letters[i]}</span>
				</label>
			))}
		</div>
	);
}
