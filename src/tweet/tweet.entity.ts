import { Hashtag } from "src/hashtag/hashtag.entity";
import { User } from "src/users/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()

export class Tweet{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: "text",
        nullable: false
    })
    text: string;


    @Column({
        type: "text",
        nullable: true
    })
    image?: string;
    
    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => User, (user) => user.tweets, {eager: true})
    @JoinColumn()
    user: User;

    @ManyToMany(() => Hashtag, (hashtags) => hashtags.tweets, {eager: true})
    @JoinTable()
    hashtags: Hashtag[];

}