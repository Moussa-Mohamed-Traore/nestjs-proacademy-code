import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { HashtagService } from './hashtag.service';
import { CreateHashtagDto } from './dtos/create-hashtag.dto';
import { UpdateHashtagDto } from './dtos/update-hashtag.dto';

@Controller('hashtag')
export class HashtagController {
  constructor(private readonly hashtagService: HashtagService) {}

  @Post()
  public CreateNewHashtag(@Body() createHashtagDto: CreateHashtagDto){
    return this.hashtagService.createHashtag(createHashtagDto);
  }

  @Delete(':id')
  public deleteHashtag(@Param('id', ParseIntPipe) id: number){
    return this.hashtagService.deleteHashtag(id);
  }
  @Delete('soft-delete/:id')
  public softdeleteHashtag(@Param('id', ParseIntPipe) id: number){
    return this.hashtagService.softdeleteHashtag(id);
  }
}
