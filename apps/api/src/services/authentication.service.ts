import jwt from 'jsonwebtoken';
import { IUserRepository } from "../repository/types.repository";
import { User } from "../schema/user.schema";
import axios from 'axios';

export function AuthenticationService(userRepository: IUserRepository) {
    const JWT_SECRET = process.env.NODE_JWT_SECRET as string ?? '';

    const { create, readById } = userRepository;

    const encodeUser = (user:User):string => {
        return jwt.sign(
            user.id,
            JWT_SECRET
        )
    }

    const decodeUser = async (token?: string):Promise<User> => {
        if(!token) throw new Error('Missing request token');

        const decoded = jwt.verify(token, JWT_SECRET) as string;

        if(!decoded) throw new Error('JWT Token does not exist');

        //Otherwise fetch user from database
        const userFromToken = await readById(decoded);
        
        if(!userFromToken) throw new Error('Invalid user');

        return userFromToken;
    }

    const authenticate = async (code: string): Promise<User> => {
        const tokenResponse = await axios.post(
            "https://github.com/login/oauth/access_token",
            {
                client_id: process.env.NODE_GITHUB_CLIENT_ID,
                client_secret: process.env.NODE_GITHUB_CLIENT_SECRET,
                code
            },
            {
                headers: { accept: 'application/json' }
            }
        );

        const accessToken = tokenResponse.data.access_token;

        const userResponse = await axios.get("https://api.github.com/user",
            { headers: { Authorization: `Bearer ${accessToken}` } }
        );

        const user = userResponse.data;
        const persistedUser = await create({
            token: accessToken,
            username: user.login,
            fullName: user.name,
            avatar: user.avatar_url,
            repositoryOutlink: user.repos_url
        });

        return persistedUser.dataValues;
    }

    const validate = async (token?: string): Promise<User> => {
        return decodeUser(token);
    }

    return {
        encodeUser,
        decodeUser,
        authenticate,
        validate
    }

}
