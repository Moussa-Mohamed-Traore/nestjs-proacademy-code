import { Injectable, Inject, forwardRef, UnauthorizedException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';
import authConfig from './config/auth.config';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { LoginDto } from './dto/Login.dto';
import { HashingProvider } from './provider/hashing.provider';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/user.entity';
import { ActiveUserInterface } from './interfaces/active-user.interface';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Injectable()
export class AuthService {
    constructor(
        @Inject(forwardRef(() => UsersService)) private readonly userService: UsersService,
        @Inject(authConfig.KEY)
        private readonly authConfiguration: ConfigType<typeof authConfig>,
        private readonly HashingProvider: HashingProvider,
        private readonly jwtService: JwtService
    ) { }

    isAuthenticated: Boolean = false;

    public async login(loginDto: LoginDto) {
        let user = await this.userService.findUsername(loginDto.username)

        let isEqual: boolean = false;

        isEqual = await this.HashingProvider.comparePassword(loginDto.password, user.password);

        if (!isEqual) {
            throw new UnauthorizedException("incorrect password");
        }

        return this.generateToken(user);
    }

    public async signup(createUserDto: CreateUserDto) {
        return await this.userService.createUser(createUserDto);
    }

    public async refreshToken(refreshTokenDto: RefreshTokenDto) {
        try {
            const { sub } = await this.jwtService.verifyAsync(refreshTokenDto.refreshToken, {
                secret: this.authConfiguration.secret,
                audience: this.authConfiguration.audience,
                issuer: this.authConfiguration.issuer
            })

            const user = await this.userService.findUserById(sub);

            return await this.generateToken(user);

        } catch (error) {
            throw new UnauthorizedException(error);
        }

    }

    private async signToken<T>(userId: number, expiresIn: number, payload?: T) {
        return await this.jwtService.signAsync({
            sub: userId,
            ...payload
        }, {
            secret: this.authConfiguration.secret,
            expiresIn: expiresIn,
            audience: this.authConfiguration.audience,
            issuer: this.authConfiguration.issuer
        })
    }

    private async generateToken(user: User) {
        const accessToken = await this.signToken<Partial<ActiveUserInterface>>(user.id, this.authConfiguration.expiresIn, { email: user.email });
        const refreshToken = await this.signToken(user.id, this.authConfiguration.refreshTokenExpiresIn);
        return {
            accessToken,
            refreshToken
        };
    }
}
