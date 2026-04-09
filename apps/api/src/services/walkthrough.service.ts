import { User } from "../schema/user.schema";
import { StepNode } from "../types/code.types";
import { GithubPullRequestDTO } from "../types/github.types";
import { ICodeService, IWalkthroughService } from "./types.services";


export default function WalkthroughService(codeService: ICodeService ): IWalkthroughService {



    const generateWalkthroughEpisodes = async (user: User, pullRequest: GithubPullRequestDTO): Promise<StepNode[]> => {
        const diff:StepNode[] = await codeService.processGitDiff(user, pullRequest);
        //const output = await ollamaService.askOllama(prompt, 'deepseek-coder');

        /*
        for(const file of diff){
            const prompt = buildFilePrompt(file.content);
            console.log(prompt);
            const output = await ollamaService.askOllama(prompt, 'deepseek-coder');
            fileOutputs.push(output);
        }
        */

        return diff;
    }

    return {
        generateWalkthroughEpisodes
    } 

}
