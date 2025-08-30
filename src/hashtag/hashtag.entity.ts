import { Tweet } from "src/tweet/tweet.entity";
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, DeleteDateColumn } from "typeorm";
@Entity()
export class Hashtag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: "text",
    nullable: false,
    unique: true,
  })
  name: string;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToMany(() => Tweet, (tweets) => tweets.hashtags, {onDelete: 'CASCADE'})
  tweets: Tweet[]; 

}
