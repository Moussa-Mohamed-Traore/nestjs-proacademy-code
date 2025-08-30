import { Injectable } from '@nestjs/common';
import { CreateHashtagDto } from './dtos/create-hashtag.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Hashtag } from './hashtag.entity';
import { In, Repository } from 'typeorm';

@Injectable()
export class HashtagService {
  constructor(@InjectRepository(Hashtag) private hashtagRepository: Repository<Hashtag>) {}
  public async createHashtag(createHashtagDto: CreateHashtagDto){
    let hashtag = this.hashtagRepository.create(createHashtagDto);
    return await this.hashtagRepository.save(hashtag);
  }

  public async findHashtags(hashtags: number[]){
    return this.hashtagRepository.find({
      where: {id: In(hashtags)},
    })
  }

  public async deleteHashtag(id: number){
    await this.hashtagRepository.delete({id});
    return {deleted: true, id};
  }
  public async softdeleteHashtag(id: number){
    await this.hashtagRepository.softDelete({id});
    return {deleted: true, id};
  }
}