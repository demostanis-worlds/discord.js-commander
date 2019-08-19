import Discord from "discord.js"
import { parseCommandp as parse } from "parse-command"
import Timer from "tiny-timer"

class DiscordCommander {
	constructor(options) {
		this.options = options

		this.options.client.on("message", async message => {
			if(message.author.bot || message.channel instanceof Discord.DMChannel || this.options.disabledChannels.has(message.channel.id)) {
				return
			}

			const argv = await parse(message.content.trim().replace(/\s+/g, " "))
			const commandName = argv.shift()
			const command = this.options.commands.find(cmd => cmd.name === commandName)

			if(command && command.vipOnly && !message.author.roles.has(this.options.vipRole)) {
				message.reply(this.options.vipOnlyCommandMessage(command))
				return
			}

			if(command && command.timeout && !command.inTimeout) {
				command.timer = new Timer()
				command.inTimeout = true

				command.timer.start(command.timeout)

				command.timer.on("done", () => {
					command.inTimeout = false
					delete command.timer
				})
			} else if(command && command.inTimeout) {
				message.reply(this.options.commandInTimeoutMessage(command.timer.time))
				return
			}

			if(commandName && command && command.name === commandName) {
				const argumentList = []
				const optionList = []
				
				for(const argument of command.argumentList) {
					const arg = argv.shift()

					if(argument.required && !arg) {
						message.reply(this.options.argumentRequiredMessage(argument))
						return
					}

					if(command.optionList.find(({ name }) => name === arg)) {
						break
					}

					argumentList.push({
						name: argument.name,
						value: arg
					})
				}

				for(const option of command.optionList) {
					const opt = argv.shift()
					const i = command.optionList.findIndex(({ name }) => name === opt)

					if(!opt) {
						break
					}

					if(option.vipOnly && message.member && !message.member.roles.has(this.options.vipRole)) {
						message.reply(this.options.vipOnlyOptionMessage(option))
						return
					}

					optionList.push({
						name: option.name,
						value: argv[i] || true
					})
				}

				argumentList.get = arg => argumentList.find(({ name }) => name === arg) && argumentList.find(({ name }) => name === arg).value
				optionList.get = arg => optionList.find(({ name }) => name === arg) && optionList.find(({ name }) => name === arg).value

				return command.does(message, argumentList, optionList)
			}
		})
	}
}

export default DiscordCommander
