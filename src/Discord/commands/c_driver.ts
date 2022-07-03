import { SlashCommandBuilder } from '@discordjs/builders'
import { CommandInteraction, GuildMember } from 'discord.js'
import { Driver } from '../../Entities/driver'
import { Event } from '../../Entities/event'
import { data_source } from '../../datasource'
import { Passenger } from '../../Entities/passenger'

import {get_available_seats, get_event} from '../../utils'

module.exports = {
	data: new SlashCommandBuilder()
		.setName('driver')
		.setDescription('Driver related commands.')
        .addSubcommand(subcommand =>
            subcommand.setName('register').setDescription('Register as a driver for an event.')
            .addStringOption(option =>
                option.setName('eventid').setDescription('The event ID to register as a driver for.').setRequired(true)
                )
            .addIntegerOption(option =>
                option.setName('seats').setDescription('How many seats you have in your car.').setRequired(true)
                ) 
            )
        .addSubcommand(subcommand => 
            subcommand.setName('list').setDescription('Lists all drivers for an event.')
            .addStringOption(option =>
                option.setName('eventid').setDescription('The ID for the event.').setRequired(true) 
                )
            )
        .addSubcommand(subcommand =>
            subcommand.setName('ridewith').setDescription('Become a passenger for a Driver.')
            .addStringOption(option => 
                option.setName('driverid').setDescription('The driver you want to ride with.').setRequired(true)
                )
            )
            ,
	async execute(interaction: CommandInteraction) {
        if (interaction.options.getSubcommand() === 'register') {
            await register_driver(interaction)
        } else if (interaction.options.getSubcommand() === 'list') {
            await list_drivers(interaction)
        } else if (interaction.options.getSubcommand() === 'ridewith') {
            await become_passenger(interaction)
        }
	},
};

const register_driver = async (interaction: CommandInteraction) => {
    const event_id = interaction.options.getString('eventid', true)
    const discord_id = interaction.member?.user.id
    if (discord_id === undefined) {
        await interaction.reply('No Member ID.')
        return
    }

    const already_driver = await data_source.getRepository(Driver).createQueryBuilder("driver").leftJoinAndSelect("driver.event", "event")
    .where("event.id = :eventid", {eventid: event_id}).andWhere("driver.discordid = :did", {did: discord_id}).getCount() > 0 ? true : false

    if (already_driver) {
        await interaction.reply('You are already a driver for this event.')
        return
    }

    const already_passenger = await data_source.getRepository(Passenger).createQueryBuilder('passenger').leftJoinAndSelect('passenger.driver', "driver").
    leftJoinAndSelect('driver.event', 'event').where("event.id = :eventid", {eventid: event_id}).andWhere('passenger.discordid = :did', {did: discord_id})
    .getCount() > 0 ? true : false

    if (already_passenger) {
        await interaction.reply('You are already a passenger to this event.')
        return
    }

    const event = await data_source.getRepository(Event).findOneBy({
        id: event_id
    })

    if (event === null) {
        await interaction.reply('This is not a valid event.')
        return
    }

    const seats = interaction.options.getInteger('seats', true)
    if (seats <= 0) {
        await interaction.reply('Not Enough Seats.')
        return
    }
    
    const driver = new Driver(event, discord_id, seats)
    await data_source.getRepository(Driver).save(driver)

    await interaction.reply(`Registered as a driver For ${event.eventName} with ${seats} seats. Your Driver ID is: ${driver.id}`)
}

const list_drivers = async (interaction: CommandInteraction) => {
    const event_id = interaction.options.getString('eventid', true)
    const event = await data_source.getRepository(Event).findOneBy({id: event_id})
    
    if (event === null) {
        await interaction.reply('No such event.')
        return
    }

    const drivers = await data_source.getRepository(Driver).findBy({event: event})
    if (drivers.length === 0) {
        await interaction.reply('No drivers for this event.')
        return
    }

    const member_list = await interaction.guild?.members.list()
    if (member_list === undefined) {
        await interaction.reply('No members in this guild.')
        return
    }

    const ret_str: string[] = []
    for (let driver of drivers) {
        const available_seats = await get_available_seats(driver)
        ret_str.push(`${member_list.find((member) => member.id === driver.discordId)?.displayName} - Driver ID: ${driver.id} - Seats Available: ${available_seats}`)
    }

    await interaction.reply(ret_str.join(',\n'))
}

const become_passenger = async (interaction: CommandInteraction) => {
    const driver_id = interaction.options.getString('driverid', true)
    const driver = await data_source.getRepository(Driver).findOneBy({id: driver_id})
    if (driver === null) {
        await interaction.reply('No driver with that ID.')
        return
    }

    const available_seats = await get_available_seats(driver)
    if (available_seats <= 0) {
        await interaction.reply('No seats available.')
        return
    }

    const discord_id = interaction.member?.user.id
    if (discord_id === undefined) {
        await interaction.reply('No Member ID.')
        return
    }

    const member_list = await interaction.guild?.members.list()
    if (member_list === undefined) {
        await interaction.reply('No members in this guild.')
        return
    }

    const disc_driver = member_list.find((mem) => mem.id === driver.discordId)
    const event = await get_event(driver)
    if (event === null) {
        await interaction.reply('Error in event!')
        return
    }

    const already_passenger = await data_source.getRepository(Passenger).createQueryBuilder('passenger').leftJoinAndSelect('passenger.driver', "driver").
    leftJoinAndSelect('driver.event', 'event').where("event.id = :eventid", {eventid: event.id}).andWhere('passenger.discordid = :did', {did: discord_id})
    .getCount() > 0 ? true : false

    if (already_passenger) {
        await interaction.reply('You are already a passenger to this event.')
        return
    }

    const passenger = new Passenger(driver, discord_id)
    await data_source.getRepository(Passenger).save(passenger)

    await interaction.reply(`You are now riding with ${disc_driver?.displayName} to ${event.eventName}. Available seats left: ${available_seats - 1}`)
}