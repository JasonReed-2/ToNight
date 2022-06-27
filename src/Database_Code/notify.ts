import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from "typeorm"
import { Event } from './event'

@Entity()
export class Notify {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    discordId!: string

    @ManyToOne(() => Event, (event) => event.notify_list)
    event!: Event
}