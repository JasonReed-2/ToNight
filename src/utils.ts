import { Driver } from './Entities/driver'
import { Event } from './Entities/event'
import { data_source } from './datasource'
import { Passenger } from './Entities/passenger'

export const get_available_seats = async (driver: Driver) => {
    const curr_passengers = await data_source.getRepository(Passenger).findBy({driver: driver})
    return driver.seats - curr_passengers.length
}

export const get_event = async (driver: Driver) => {
    const event = await data_source.getRepository(Event).createQueryBuilder("event").leftJoinAndSelect("event.drivers", "driver").
    where("driver.id = :driverid", {driverid: driver.id}).getOne()
    return event
}