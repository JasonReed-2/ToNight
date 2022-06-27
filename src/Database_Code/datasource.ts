import { DataSource } from "typeorm"
import { Event } from './event'
import { Driver } from "./driver"
import { Passenger } from "./passenger"
import { Notify } from './notify'

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