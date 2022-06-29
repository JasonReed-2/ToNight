import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from "typeorm"
import { Driver } from './driver'

@Entity()
export class Passenger {
    @PrimaryGeneratedColumn("uuid")
    id!: string

    @Column()
    discordId: string

    @ManyToOne(() => Driver, (driver) => driver.passengers)
    driver: Driver
    
    constructor(driver: Driver, discordId: string) {
        this.driver = driver
        this.discordId = discordId
    }
}