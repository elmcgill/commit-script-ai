import { CommitScriptSchema } from "../schema";
import { RepositoriesModule } from "./types.repository";
import UserRepository from "./user.repository";


export default function registerRepositories(schema:CommitScriptSchema): RepositoriesModule{
   const userRepository = UserRepository(schema.User);

   return {
       UserRepository: userRepository
   }
}
