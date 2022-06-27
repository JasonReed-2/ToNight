import { SlashCommandBuilder } from '@discordjs/builders'
import { CommandInteraction } from 'discord.js'
import { Event } from '../../Database_Code/event'

module.exports = {
	data: new SlashCommandBuilder()
		.setName('registerasdriver')
		.setDescription('Register as a driver for an event.')
        .addStringOption(option =>
            option.setName('eventid').setDescription('The event ID to register as a driver for.').setRequired(true)
        )
        .addIntegerOption(option => 
            option.setName('seats').setDescription('How many seats you have in your car').setRequired(true)
        ),
	async execute(interaction: CommandInteraction) {
        // TODO
        // const event_id = interaction.options.getString('eventid', true)
        // const possible_events = (await get_from_db<Event>(db, 'scheduledEvent')).filter((val) => val.eventid === event_id)
        // if (possible_events.length === 0) {
        //     await interaction.reply('This is not a valid event!')
        //     return
        // }

        // const seats = interaction.options.getInteger('seats', true)
        // const driver_id = unique_id().toString()
        // const discord_id = interaction.member?.user.id
        // if (discord_id === undefined) {
        //     await interaction.reply('No Member ID!')
        //     return
        // }
        // try {
        //     insert_into_db(db, driver_table_factory({
        //         eid: event_id,
        //         seats: seats,
        //         discordid: discord_id,
        //         driverid: driver_id
        //     }))
        // } catch {
        //     await interaction.reply('SQL Insertion Error')
        //     return
        // }

        //await interaction.reply(`Registered as a driver For ${possible_events[0].eventname} with ${seats} seats. Your Driver ID is: ${driver_id}`)
	},
};