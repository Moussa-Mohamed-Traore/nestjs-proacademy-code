import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { LoginDto } from './dto/Login.dto';
import { AllowAnymous } from './decorators/allow-anymous.decorator';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    @AllowAnymous()
    @HttpCode(HttpStatus.OK)
    async login(@Body() loginDto: LoginDto) {
        return await this.authService.login(loginDto);
    }


    @Post('signup')
    @AllowAnymous()
    async signup(@Body() createUserDto: CreateUserDto) {
        return await this.authService.signup(createUserDto);
    }

    @AllowAnymous()
    @Post('refresh-token')
    @HttpCode(HttpStatus.OK)
    public async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
        return await this.authService.refreshToken(refreshTokenDto);
    }
}
