export interface Action {
	number: number | undefined;
	name: string;
}

export interface Tool extends Action {
	damaged: boolean;
}

export type Gift = Action & Consumable;

export interface Quest {
	name: string;
	entry: number | undefined;
	notes: string;
	completed: boolean;
}

export interface Consumable {
	name: string;
	quantity: number;
}

export interface PlayerLog {
	// Reni
	hearts: number;
	magic: number;
	luck: number;
	coins: number | undefined;
	poisoned: boolean;
	jinxed: boolean;

	// Familiar
	familiarName: string;
	familiarEnergy: number;
	familiarAction: Action;

	// Action
	tools: Tool[];
	spells: Action[];
	prompts: Action[];
	gifts: Gift[];

	// Quests & Keywords
	mainQuests: Quest[];
	sideQuests: Quest[];
	keywords: string[];

	// Potions & Ingredients
	potions: Consumable[];
	ingredients: Consumable[];

	// Discoveries & Achievements
	discoveries: boolean[];
	achievements: boolean[];
}
