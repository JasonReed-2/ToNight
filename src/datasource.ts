import { DataSource } from "typeorm"
import { Driver } from './Entities/driver'
import { Event } from './Entities/event'
import { Passenger } from './Entities/passenger'
import { Notify } from './Entities/notify'

const CLEAN_DB = true

export const data_source = new DataSource({
    type: 'sqlite',
    database: './db.db',
    entities: [
        Event,
        Driver,
        Passenger,
        Notify
    ],
})

data_source.initialize().then(() => {
    if (CLEAN_DB) {
        data_source.dropDatabase().then(() => {
            data_source.synchronize()
        })
    }
})