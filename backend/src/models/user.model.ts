
import {Entity, PrimaryGeneratedColumn, Column} from 'typeorm';
@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column()
    nic!: string;

    @Column()
    contactNo!: string;

    @Column({unique:true,nullable:false})
    email!: string;

    @Column({nullable:false})
    password!: string;

    @Column({nullable:false})
    role!:string;
}
