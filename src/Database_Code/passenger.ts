import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from "typeorm"
import { Driver } from "./driver"

@Entity()
export class Passenger {
    @PrimaryGeneratedColumn("uuid")
    id!: number

    @Column()
    discordId!: string

    @ManyToOne(() => Driver, (driver) => driver.passengers)
    driver!: Driver
}