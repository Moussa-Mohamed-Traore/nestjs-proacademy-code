import { BadRequestException, forwardRef, HttpException, HttpStatus, Inject, Injectable, RequestTimeoutException, UnauthorizedException } from "@nestjs/common";
import { Repository } from "typeorm";
import { User } from "./user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateUserDto } from "./dtos/create-user.dto";
import { Profile } from "src/profile/profile.entity";

import { ConfigService } from "@nestjs/config";
import { UserAlreadyExistsException } from "src/customExceptions/user-already-exists.exception";
import { PaginationProvider } from "src/common/pagination/pagination.provider";
import { PaginationQueryDto } from "src/common/pagination/dto/pagination-query.dto";
import { Paginated } from "src/common/pagination/paginater.interface";
import { HashingProvider } from "src/auth/provider/hashing.provider";

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private configService: ConfigService,
        private readonly paginationProvider: PaginationProvider,
        @Inject(forwardRef(() => HashingProvider))
        private readonly hashingProvider: HashingProvider

    ) { }


    public async getAllUsers(paginationQueryDto: PaginationQueryDto): Promise<Paginated<User>> {
        try {
            return await this.paginationProvider.paginatedQuery(
                paginationQueryDto,
                this.userRepository,
                undefined,
                ['profile']
            )
        } catch (error) {
            if (error.code === 'ECONNREFUSED') {
                throw new RequestTimeoutException('An error occurred. please try again later', {
                    description: "could not connect to database"
                });
            }

            throw error;
        }
    }


    public async createUser(userDto: CreateUserDto) {

        try {
            userDto.profile = userDto.profile ?? {};

            const existingUserWithName = await this.userRepository.findOne({
                where: { username: userDto.username }
            });
            if (existingUserWithName) {
                throw new UserAlreadyExistsException('username', userDto.username);
            }
            const existingUserWithEmail = await this.userRepository.findOne({
                where: { email: userDto.email }
            });
            if (existingUserWithEmail) {
                throw new UserAlreadyExistsException('email', userDto.email);
            }
            const user = this.userRepository.create({
                ...userDto,
                password: await this.hashingProvider.hashPassword(userDto.password)
            });

            return await this.userRepository.save(user);
        } catch (error) {

            if (error.code === 'ECONNREFUSED') {
                throw new RequestTimeoutException('An error occurred. please try again later', {
                    description: "could not connect to database"
                });
            }

            // if (error.code === '23505') {
            //     throw new BadRequestException('There is some duplicate value for the user Database');
            // }

            throw error;

        }
    }

    public async deleteUser(id: number) {

        await this.userRepository.delete(id);
        return { deleted: true };
    }

    
    public async findUserById(id: number) {
        const user = await this.userRepository.findOneBy({ id });
        if (!user) {
            throw new HttpException({
                status: HttpStatus.NOT_FOUND,
                error: "The user with id " + id + " was not found.",
                table: "user"
            }, HttpStatus.NOT_FOUND, {
                description: "The Exception occured because a user with ID " + id + " was not found in users table"
            })
        }

        return user;
    }

    public async findUsername(username: string) {
        let user: User | null = null;
        try {
            user = await this.userRepository.findOneBy({
                username
            })
        } catch (error) {
            throw new RequestTimeoutException(error, {
                description: "User with given username could not be found"
            })
        }

        if (!user) {
            throw new UnauthorizedException("User does not exist!")
        }

        return user;
    }
}