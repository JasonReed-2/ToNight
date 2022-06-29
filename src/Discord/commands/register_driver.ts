import { SlashCommandBuilder } from '@discordjs/builders'
import { CommandInteraction } from 'discord.js'
import { Driver } from '../../Entities/driver'
import { Event } from '../../Entities/event'
import { data_source } from '../../datasource'

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
        const event_id = interaction.options.getString('eventid', true)
        const event = await data_source.getRepository(Event).findOneBy({
            id: event_id
        })
        if (event === null) {
            await interaction.reply('This is not a valid event!')
            return
        }

        const seats = interaction.options.getInteger('seats', true)

        const discord_id = interaction.member?.user.id
        if (discord_id === undefined) {
            await interaction.reply('No Member ID!')
            return
        }

        const driver = new Driver(event, discord_id, seats)
        await data_source.getRepository(Driver).save(driver)

        await interaction.reply(`Registered as a driver For ${event.eventName} with ${seats} seats. Your Driver ID is: ${driver.id}`)
	},
};