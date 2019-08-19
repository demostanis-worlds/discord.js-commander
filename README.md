# Discord.js commander
# Make your Discord bot commands look like Bash commands

# Install
```sh
npm install discord.js-commander
```

# Example
```js
import Discord from "discord.js"
import DiscordCommander from "./discord-commander.js"
import "dotenv/config"

const client = new Discord.Client()

client.on("ready", () => {
	console.log(`Logged in as ${client.user.tag}`)

	const commander = new DiscordCommander({
		client: client,
		commands: [{
			name: "*order-pizza",
			description: "Orders a pizza.",
			timeout: 10000,
			argumentList: [{
				name: "<type>",
				description: "Type of the pizza to order.",
				required: true
			}, {
				name: "<size>",
				description: "Size of the pizza to order.",
				required: false
			}],
			optionList: [{
				name: "--bacon",
				description: "Adds bacon to the pizza."
			}, {
				name: "--cheese",
				description: "Adds cheese to the pizza.",
				vipOnly: true
			}],
			does(message, argumentList, optionList) {
				const type = argumentList.get("<type>")
				const size = argumentList.get("<size>")
				const bacon = optionList.get("--bacon")
				const cheese = optionList.get("--cheese")

				message.channel.send(`Ordering pizza ${type} and size ${size ? size : "normal"} ${bacon ? "with bacon" : "without bacon"} ${cheese ? "and cheese": "and without cheese"}`)
			}
		}],
		argumentRequiredMessage: arg => `you forgot required argument: ${arg.name}.`,
		commandInTimeoutMessage: timeLeft => `please slow down! ${timeLeft}ms left.`,
		vipOnlyCommandMessage: command => `${command.name} command is reserved for VIPs. Become VIP at https://patreon.com/demostanis.`,
		vipOnlyOptionMessage: option => `${option.name} option is reserved for VIPs. Become VIP at https://patreon.com/demostanis.`,
		disabledChannels: client.channels.filter(channel => !(["601766574206222347", "604250599927578624"].indexOf(channel.id) >= 0)),
		vipRole: "604250294846750720"
	})
})

client.login(process.env.TOKEN)
```

# API
- new DiscordCommander(options: Options) => DiscordCommander

```ts
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
```
