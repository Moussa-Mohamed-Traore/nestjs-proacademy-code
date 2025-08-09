import { Body, Controller, DefaultValuePipe, Delete, Get, Param, ParseBoolPipe, ParseIntPipe, Patch, Post, Query, ValidationPipe } from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dtos/create-user.dto";

@Controller('users')
export class UsersController {
    constructor(private userService: UsersService) { }

    @Get()
    getUsers() {
        return this.userService.getAllUsers();
    }

    @Post()
    createUsers(@Body() user: CreateUserDto) {
        this.userService.createUser(user);
    }

    @Delete(":id")
    deleteUser(@Param("id", ParseIntPipe) id: number) {
        this.userService.deleteUser(id);
    }
}