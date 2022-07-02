import { SlashCommandBuilder } from '@discordjs/builders'
import { CommandInteraction } from 'discord.js'
import { data_source } from '../../datasource'
import { Event } from '../../Entities/event'

module.exports = {
	data: new SlashCommandBuilder()
		.setName('event')
		.setDescription('Event related commands.')
        .addSubcommand(subcommand => 
            subcommand.setName('create')
            .setDescription('Create a new event')
            .addStringOption(option =>
                option.setName('name')
                .setDescription('The name of the event.')
                .setRequired(true)
            )
            .addStringOption(option => 
                option.setName('location')
                .setDescription('The location of the event.')
                .setRequired(true)
                )
            .addStringOption(option => 
                option.setName('date')
                .setDescription('The date of the event.')
                .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand.setName('list')
		    .setDescription('Lists all events.')
        ),
	async execute(interaction: CommandInteraction) {
        if (interaction.options.getSubcommand() === 'create') {
            await create_event(interaction)
        } else {
            await get_all_events(interaction)
        }
	},
};

const create_event = async (interaction: CommandInteraction) => {
    if (interaction.guildId === null) {
        await interaction.reply('No Guild ID!')
        return
    }
    const guild_id = interaction.guildId.toString()
    const event_name = interaction.options.getString('name', true)
    const location = interaction.options.getString('location', true)
    const date = interaction.options.getString('date', true)
    const event = new Event(event_name, guild_id, location, date)

    await data_source.manager.save(event)        
    await interaction.reply(`${event_name} Created!\nEvent ID is: ${event.id}`)
}

const get_all_events = async (interaction: CommandInteraction) => {
    const events = await data_source.getRepository(Event).find()
    const event_str = events.map((ev) => `${ev.eventName}: ${ev.id}`).join(',\n')
    if (event_str === '') {
        await interaction.reply('No Current Events!')
        return
    }
    await interaction.reply(`Current Events:\n${event_str}`)
}