export as namespace DiscordCommander

export interface Options {
	client: Discord.Client
	commands: Commands[]
	argumentRequiredMessage: Function
	commandInTimeoutMessage: Function
	vipOnlyCommandMessage: Function
	vipOnlyOptionMessage: Function
	disabledChannels: Discord.Collection
	vipRole: string
}

export interface Commands {
	name: string
	description: string
	timeout: number
	argumentList: Argument[]
	optionList: Option[]
	does: Function
}

export interface Argument {
	name: string
	description: string
	required: boolean
}

export interface Option {
	name: string
	descriptiob: string
	vipOnly: boolean
}
