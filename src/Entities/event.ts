import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from "typeorm"
import { Driver } from './driver'
import { Notify } from './notify'

@Entity()
export class Event {
    @PrimaryGeneratedColumn("uuid")
    id!: string
    
    @Column()
    eventName: string
    
    @Column()
    guildId: string
    
    @OneToMany(() => Driver, (driver) => driver.event)
    drivers?: Driver[]
    
    @OneToMany(() => Notify, (notify) => notify.event)
    notify_list?: Notify[]

    constructor(event_name: string, guild_id: string) {
        this.eventName = event_name
        this.guildId = guild_id
    }
}