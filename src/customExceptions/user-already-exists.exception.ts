import { HttpException, HttpStatus } from "@nestjs/common";

export class UserAlreadyExistsException extends HttpException {
    constructor(FieldName: string, fieldValue: string){
        super(`User with ${FieldName} '${fieldValue}' already exists`, HttpStatus.CONFLICT)
    }
}
