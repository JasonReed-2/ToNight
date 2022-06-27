import { SlashCommandBuilder } from '@discordjs/builders'
import { CommandInteraction } from 'discord.js'
import { data_source } from '../../Database_Code/datasource'
import { Event } from '../../Database_Code/event'


module.exports = {
	data: new SlashCommandBuilder()
		.setName('getallevents')
		.setDescription('Gets all events.')
        ,
	async execute(interaction: CommandInteraction) {
        const events = await data_source.getRepository(Event).find()
		const event_str = events.map((ev) => `${ev.eventName}: ${ev.id}`).join(',\n')
        await interaction.reply(`Current Events:\n${event_str}`)
	},
};