import { User } from "../schema/user.schema"

export interface IAuthenticationService {
    encodeUser: (user:User) => string;
    decodeUser: (token?:string) => Promise<User>;
    authenticate: (code: string) => Promise<User>
    validate: (token?: string) => Promise<User>
}

export interface ServicesModule {
    AuthenticationService: IAuthenticationService
}
