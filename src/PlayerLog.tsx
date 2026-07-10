import type { PlayerLog as PlayerLogData } from "./types/player";
import { MainTab } from "./tabs/MainTab";
import { ActionsTab } from "./tabs/ActionsTab";
import { QuestsKeywordsTab } from "./tabs/QuestsKeywordsTab";
import { PotionsIngredientsTab } from "./tabs/PotionsIngredientsTab";
import { DiscoveriesAchievementsTab } from "./tabs/DiscoveriesAchievementsTab";
import { BroomwaysTab } from "./tabs/BroomwaysTab";
import { NotesTab } from "./tabs/NotesTab";

import type { SortDirection, QuestSort } from "./hooks/usePlayerLogs";

interface PlayerLogProps {
	log: PlayerLogData;
	onChange: (next: PlayerLogData) => void;
	activeTab: number;
	setActiveTab: (updater: React.SetStateAction<number>) => void;
	keywordSort: SortDirection | undefined;
	setKeywordSort: (
		updater: React.SetStateAction<SortDirection | undefined>,
	) => void;
	mainQuestSort: QuestSort | undefined;
	setMainQuestSort: (
		updater: React.SetStateAction<QuestSort | undefined>,
	) => void;
	sideQuestSort: QuestSort | undefined;
	setSideQuestSort: (
		updater: React.SetStateAction<QuestSort | undefined>,
	) => void;
}

const TAB_NAMES = [
	"Main",
	"Actions",
	"Quests",
	"Potions",
	"Discoveries",
	"Broomways",
	"Notes",
] as const;

export function PlayerLog({
	log,
	onChange,
	activeTab,
	setActiveTab,
	mainQuestSort,
	setMainQuestSort,
	sideQuestSort,
	setSideQuestSort,
	keywordSort,
	setKeywordSort,
}: PlayerLogProps) {
	const renderContent = () => {
		switch (activeTab) {
			case 0:
				return <MainTab log={log} onChange={onChange} />;
			case 1:
				return <ActionsTab log={log} onChange={onChange} />;
			case 2:
				return (
					<QuestsKeywordsTab
						log={log}
						onChange={onChange}
						keywordSort={keywordSort}
						setKeywordSort={setKeywordSort}
						mainQuestSort={mainQuestSort}
						setMainQuestSort={setMainQuestSort}
						sideQuestSort={sideQuestSort}
						setSideQuestSort={setSideQuestSort}
					/>
				);
			case 3:
				return <PotionsIngredientsTab log={log} onChange={onChange} />;
			case 4:
				return <DiscoveriesAchievementsTab log={log} onChange={onChange} />;
			case 5:
				return <BroomwaysTab log={log} onChange={onChange} />;
			case 6:
				return <NotesTab log={log} onChange={onChange} />;
			default:
				return <MainTab log={log} onChange={onChange} />;
		}
	};

	return (
		<section>
			{renderContent()}

			<nav className="floating-tabs">
				{TAB_NAMES.map((name, index) => (
					<button
						key={index}
						type="button"
						className={`floating-tab ${activeTab === index ? "active" : ""}`}
						onClick={() => setActiveTab(index)}
					>
						{name}
					</button>
				))}
			</nav>
		</section>
	);
}
