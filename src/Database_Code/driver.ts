import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from "typeorm"
import { Event } from './event'
import { Passenger } from "./passenger"

@Entity()
export class Driver {
    @PrimaryGeneratedColumn("uuid")
    id!: number

    @Column()
    discordId!: string

    @ManyToOne(() => Event, (event) => event.drivers)
    event!: Event

    @OneToMany(() => Passenger, (passenger) => passenger.driver )
    passengers!: Passenger[]

    @Column()
    seats!: number
}