import { SetMetadata } from "@nestjs/common"

export const AllowAnymous = () =>{
   return SetMetadata('isPublic', true)
}