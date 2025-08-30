import { BadRequestException, ConflictException, Injectable, NotFoundException, RequestTimeoutException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { Tweet } from './tweet.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTweetDto } from './dtos/create-tweet.dto';
import { HashtagService } from 'src/hashtag/hashtag.service';
import { UpdateTweetDto } from './dtos/update-tweet.dto';
import { PaginationQueryDto } from 'src/common/pagination/dto/pagination-query.dto';
import { PaginationProvider } from 'src/common/pagination/pagination.provider';
import { Paginated } from 'src/common/pagination/paginater.interface';
import { ActiveUserInterface } from 'src/auth/interfaces/active-user.interface';

@Injectable()
export class TweetService {
    constructor(
        private readonly userService: UsersService,
        private readonly hashtagService: HashtagService,
        @InjectRepository(Tweet) private readonly tweetRepository: Repository<Tweet>,
        private readonly paginationProvider: PaginationProvider
    ) { }

    public async getTweets(userId: number, pageQueryDto: PaginationQueryDto): Promise<Paginated<Tweet>> {
        let user = await this.userService.findUserById(userId);
        if (!user) {
            throw new NotFoundException(`User with userId ${userId} is not found!`)
        }
        return await this.paginationProvider.paginatedQuery(
            pageQueryDto,
            this.tweetRepository,
            { user: { id: userId } }
        );
    }

    public async CreateTweet(createTweetDto: CreateTweetDto, userId: number) {
        let user;
        let hashtags;
        try {
            user = await this.userService.findUserById(userId);

            if (createTweetDto.hashtags) {
                hashtags = await this.hashtagService.findHashtags(createTweetDto.hashtags || []);
            }
        } catch (error) {
            throw new RequestTimeoutException();
        }
        if (createTweetDto.hashtags?.length !== hashtags?.length) {
            throw new BadRequestException();
        }
        const tweet = this.tweetRepository.create({ ...createTweetDto, user, hashtags });
        try {
            return await this.tweetRepository.save(tweet);
        } catch (error) {
            throw new ConflictException();
        }

    }

    public async updateTweet(updateTweetDto: UpdateTweetDto) {
        let hashtags = await this.hashtagService.findHashtags(updateTweetDto.hashtags || []);
        let tweet = await this.tweetRepository.findOneBy({ id: updateTweetDto.id });

        if (tweet) {
            tweet.text = updateTweetDto.text ?? tweet?.text;
            tweet.image = updateTweetDto.image ?? tweet?.image;
            tweet.hashtags = hashtags;

            return await this.tweetRepository.save(tweet);
        }
    }

    public async deleteTweet(id: number) {
        await this.tweetRepository.delete({
            id
        })

        return { deleted: true, id }
    }
}
