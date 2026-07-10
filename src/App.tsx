import { useEffect } from "react";
import { usePlayerLogs } from "./hooks/usePlayerLogs";
import { PlayerLog } from "./PlayerLog";
import type { PlayerLog as PlayerLogData } from "./types/player";

import sheetBg from "./assets/sheet.svg?raw";
import tabBg from "./assets/background.svg?raw";

import "./PlayerLog.css";

/** Convert raw SVG source to a data URI */
function svgDataUrl(svg: string): string {
	return "url('data:image/svg+xml;base64," + btoa(svg) + "')";
}

function App() {
	useEffect(() => {
		document.documentElement.style.setProperty(
			"--body-bg",
			svgDataUrl(sheetBg),
		);
		document.documentElement.style.setProperty("--tab-bg", svgDataUrl(tabBg));
	}, []);

	const { logs, setLogs, activeTab, setActiveTab } = usePlayerLogs();
	const current = logs[0];

	const onChange = (next: PlayerLogData) =>
		setLogs((prev) => [next, ...(prev.slice(1) || [])]);

	return current ? (
		<PlayerLog
			log={current}
			onChange={onChange}
			activeTab={activeTab}
			setActiveTab={setActiveTab}
		/>
	) : undefined;
}

export default App;
