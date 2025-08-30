import { Injectable } from '@nestjs/common';
import { HashingProvider } from './hashing.provider';
import * as bycript from "bcrypt"

@Injectable()
export class BcryptProvider implements HashingProvider {
    public async hashPassword(password: string | Buffer): Promise<string> {
        let salt = await bycript.genSalt();

        return await bycript.hash(password, salt);
    }

    public async comparePassword(plainPassword: string | Buffer, hashedPassword: string | Buffer): Promise<boolean> {
        return await bycript.compare(plainPassword, hashedPassword);
    }
}
    