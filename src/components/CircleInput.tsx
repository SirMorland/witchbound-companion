import { Circle } from "./Circle";

interface CircleInputProps {
	value: boolean;
	onChange: (checked: boolean) => void;
}

export function CircleInput({ value, onChange }: CircleInputProps) {
	return (
		<span className="circle-input">
			<input
				type="checkbox"
				checked={value}
				onChange={(e) => onChange(e.target.checked)}
				hidden
			/>
			<Circle checked={value} />
		</span>
	);
}
