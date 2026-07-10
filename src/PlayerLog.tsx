import type { PlayerLog as PlayerLogData } from "./types/player";
import { MainTab } from "./tabs/MainTab";
import { ActionsTab } from "./tabs/ActionsTab";
import { QuestsKeywordsTab } from "./tabs/QuestsKeywordsTab";
import { PotionsIngredientsTab } from "./tabs/PotionsIngredientsTab";
import { DiscoveriesAchievementsTab } from "./tabs/DiscoveriesAchievementsTab";


interface PlayerLogProps {
	log: PlayerLogData;
	onChange: (next: PlayerLogData) => void;
	activeTab: string;
	setActiveTab: (updater: React.SetStateAction<string>) => void;
}

const TABS = [
	"Main",
	"Actions",
	"Quests & Keywords",
	"Potions & Ingredients",
	"Discoveries & Achievements",
] as const;

export function PlayerLog({
	log,
	onChange,
	activeTab,
	setActiveTab,
}: PlayerLogProps) {
	return (
		<section>
			{activeTab === "Main" && <MainTab log={log} onChange={onChange} />}
			{activeTab === "Actions" && <ActionsTab log={log} onChange={onChange} />}
			{activeTab === "Quests & Keywords" && (
				<QuestsKeywordsTab log={log} onChange={onChange} />
			)}
			{activeTab === "Potions & Ingredients" && (
				<PotionsIngredientsTab log={log} onChange={onChange} />
			)}
			{activeTab === "Discoveries & Achievements" && (
				<DiscoveriesAchievementsTab log={log} onChange={onChange} />
			)}

			<nav className="floating-tabs">
				{TABS.map((tab) => (
					<button
						key={tab}
						type="button"
						className={`floating-tab ${activeTab === tab ? "active" : ""}`}
						onClick={() => setActiveTab(tab)}
					>
						{tab}
					</button>
				))}
			</nav>
		</section>
	);
}
