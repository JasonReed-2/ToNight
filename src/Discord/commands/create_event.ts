import { SlashCommandBuilder } from '@discordjs/builders'
import { CommandInteraction } from 'discord.js'
import { data_source } from '../../Database_Code/datasource'
import { Event } from '../../Database_Code/event'

module.exports = {
	data: new SlashCommandBuilder()
		.setName('createevent')
		.setDescription('Creates a new event.')
        .addStringOption(option =>
            option.setName('name').setDescription('The name of the event.').setRequired(true)
        )
        ,
	async execute(interaction: CommandInteraction) {
        if (interaction.guildId === null) {
            await interaction.reply('No Guild ID!')
            return
        }
        const guild_id = interaction.guildId.toString()
        const event_name = interaction.options.getString('name', true)
        const event = new Event(event_name, guild_id)

        await data_source.manager.save(event)        
        await interaction.reply(`${event_name} Created!\nEvent ID is: ${event.id}`)
	},
};