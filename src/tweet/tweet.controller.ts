import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, Req } from '@nestjs/common';
import { TweetService } from './tweet.service';
import { CreateTweetDto } from './dtos/create-tweet.dto';
import { UpdateTweetDto } from './dtos/update-tweet.dto';
import { PaginationQueryDto } from 'src/common/pagination/dto/pagination-query.dto';
import { ActiveUser } from 'src/auth/decorators/active-user.decorator';

@Controller('tweet')
export class TweetController {
    constructor(private tweetService: TweetService) { }
    @Get(':userid')
    public GetTweet(@Param('userid', ParseIntPipe) userid: number, @Query() paginationQueryDto: PaginationQueryDto) {
        console.log(paginationQueryDto);
        return this.tweetService.getTweets(userid, paginationQueryDto);
    }

    @Post()
    public createTweet(@Body() tweet: CreateTweetDto, @ActiveUser('sub') userId) {

           return this.tweetService.CreateTweet(tweet, userId);
    }

    @Patch()
    public updateTweet(@Body() updateTweetDto: UpdateTweetDto) {
        return this.tweetService.updateTweet(updateTweetDto);
    }

    @Delete(":id")
    public DeleteTweet(@Param("id", ParseIntPipe) id: number) {
        return this.tweetService.deleteTweet(id);
    }
}
