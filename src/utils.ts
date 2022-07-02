import { Driver } from './Entities/driver'
import { Event } from './Entities/event'
import { data_source } from './datasource'
import { Passenger } from './Entities/passenger'

export const get_available_seats = async (driver: Driver) => {
    const curr_passengers = await data_source.getRepository(Passenger).findBy({driver: driver})
    return driver.seats - curr_passengers.length
}

export const get_event = async (driver: Driver) => {
    const events = await data_source.getRepository(Event).find()
    for (let event of events) {
        const drivers = await data_source.getRepository(Driver).findBy({event: event})
        for (let curr_driver of drivers) {
            if (curr_driver.id === driver.id) return event
        }
    }
    return null
}