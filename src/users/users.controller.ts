import { Controller, Delete, Get, Param, ParseIntPipe, Query } from "@nestjs/common";
import { UsersService } from "./users.service";
import { PaginationQueryDto } from "src/common/pagination/dto/pagination-query.dto";

@Controller('users')
export class UsersController {
    constructor(private userService: UsersService) { }

    @Get()
    getUsers(@Query() pageQueryDto: PaginationQueryDto) {
        return this.userService.getAllUsers(pageQueryDto);
    }

    @Get(":id")
    getUserById(@Param("id", ParseIntPipe) id: number) {
        return this.userService.findUserById(id);
    }

    // @Post()
    // createUsers(@Body() user: CreateUserDto) {
    //     return this.userService.createUser(user);
    // }

    @Delete(":id")
    deleteUser(@Param("id", ParseIntPipe) id: number) {
        this.userService.deleteUser(id);
    }
}