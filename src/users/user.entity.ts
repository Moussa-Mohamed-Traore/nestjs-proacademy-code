import { Profile } from "src/profile/profile.entity";
import { Tweet } from "src/tweet/tweet.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'varchar',
        length: 24,
        nullable: false,
        unique: true
    })
    username: string;
    @Column({
        type: 'varchar',
        length: 100,
        nullable: false
    })
    email: string;
    @Column({
        type: 'varchar',
        length: 100, 
        nullable: false
    })
    password: string;

    @OneToOne(() => Profile, (profile) => profile.user, {
        cascade: ["insert"],
    })
    profile?: Profile;

    @OneToMany(() => Tweet, (tweets) => tweets.user)
    tweets: Tweet
    
    @CreateDateColumn()
    createdAt: Date;
    @UpdateDateColumn()
    updatedAt: Date;
    @DeleteDateColumn()
    DeletedAt: Date;
}