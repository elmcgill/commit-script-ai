import { User } from "../schema/user.schema";
import { DiffFile, DiffHunk, FileSteps, FlattenedChange, FlattenedDiff, FlattenedFile, Layer, ParsedDiff, Step, StepNode } from "../types/code.types";
import { GithubPullRequestDTO } from "../types/github.types";
import { ICodeService, IGithubService } from "./types.services";

export function CodeService(githubService: IGithubService): ICodeService {

    const splitDiffByFiles = (diff: string): ParsedDiff => {
        const files: DiffFile[] = []

        const fileBlocks = diff.split('\ndiff --git ').slice(1)

        for (const rawFileBlock of fileBlocks) {
            const fileBlock = 'diff --git ' + rawFileBlock
            const lines = fileBlock.split('\n')

            const fileHeader = lines[0]
            const match = fileHeader.match(/a\/(.+?) b\/(.+)/)

            if (!match) continue

            const [, oldPath, newPath] = match

            const file: DiffFile = {
                oldPath,
                newPath,
                hunks: []
            }

            let currentHunk: DiffHunk | null = null

            let oldLine = 0
            let newLine = 0

            for (const line of lines) {
                // 🧩 Hunk header
                if (line.startsWith('@@')) {
                    const hunkMatch = line.match(
                        /@@ -(\d+),?(\d*) \+(\d+),?(\d*) @@/
                    )

                    if (!hunkMatch) continue

                    const [
                        ,
                        oldStart,
                        oldCount,
                        newStart,
                        newCount
                    ] = hunkMatch

                    currentHunk = {
                        header: line,
                        oldStart: Number(oldStart),
                        oldLines: Number(oldCount || 1),
                        newStart: Number(newStart),
                        newLines: Number(newCount || 1),
                        lines: []
                    }

                    file.hunks.push(currentHunk)

                    oldLine = Number(oldStart)
                    newLine = Number(newStart)

                    continue
                }

                if (!currentHunk) continue

                if (line.startsWith('+') && !line.startsWith('+++')) {
                    currentHunk.lines.push({
                        type: 'add',
                        content: line.slice(1).trim(),
                        oldLineNumber: null,
                        newLineNumber: newLine++
                    })
                    continue
                }

                if (line.startsWith('-') && !line.startsWith('---')) {
                    currentHunk.lines.push({
                        type: 'remove',
                        content: line.slice(1).trim(),
                        oldLineNumber: oldLine++,
                        newLineNumber: null
                    })
                    continue
                }

                if (!line.startsWith('\\')) {
                    currentHunk.lines.push({
                        type: 'context',
                        content: line.trim(),
                        oldLineNumber: oldLine++,
                        newLineNumber: newLine++
                    })
                }
            }

            files.push(file)
        }

        return { files }
    }

    const flattenDiff = (parsed: ParsedDiff): FlattenedDiff => {
        return parsed.files.map(file => {
            const changes: FlattenedChange[] = []

            for (const hunk of file.hunks) {
                let currentOldLine = hunk.oldStart
                let currentNewLine = hunk.newStart

                for (const line of hunk.lines) {
                    if (line.type === 'add') {
                        changes.push({
                            lineStart: currentNewLine,
                            added: [line.content],
                            removed: []
                        })
                        currentNewLine++
                    } else if (line.type === 'remove') {
                        changes.push({
                            lineStart: currentNewLine, // you can also track old line if needed
                            added: [],
                            removed: [line.content]
                        })
                        currentOldLine++
                    } else {
                        currentNewLine++
                        currentOldLine++
                    }
                }
            }

            return {
                path: file.newPath,
                changes
            }
        })
    }

    const mergeAdjacentChanges = (flatenedFiles: FlattenedDiff): FlattenedDiff => {
        return flatenedFiles.map(file => {
            const merged: FlattenedChange[] = []
            let last: FlattenedChange | null = null

            for (const change of file.changes) {
                if (
                    last &&
                    change.lineStart <= last.lineStart + (last.added.length || 0) + 1
                ) {
                    last.added.push(...change.added)
                    last.removed.push(...change.removed)
                } else {
                    if (last) merged.push(last)
                    last = { ...change }
                }
            }

            if (last) merged.push(last)
            return { path: file.path, changes: merged }
        })
    }

    const extractImports = (content: string): string[] => {
        const lines = content.split('\n')
        const imports: string[] = []

        for (const line of lines) {
            const trimmed = line.trim()
            if (trimmed.startsWith('import ')) {
                imports.push(trimmed)
            } else if (trimmed === '' || trimmed.startsWith('//')) {
                continue
            } else {
                break
            }
        }

        return imports
    } 

    const parseImportSymbols = (imports: string[]): string[] => {
        const symbols: string[] = []

        for (const imp of imports) {
            const defaultMatch = imp.match(/import\s+(\w+)\s+from/)
            if (defaultMatch) symbols.push(defaultMatch[1])

            const namedMatch = imp.match(/\{([^}]+)\}/)
            if (namedMatch) {
                const names = namedMatch[1].split(',').map(s => s.trim())
                symbols.push(...names)
            }

            const sideEffectMatch = imp.match(/import\s+['"](.*?)['"]/)
            if (sideEffectMatch) {
                const path = sideEffectMatch[1]

                if (/\.(css|scss|sass)$/.test(path)) {
                    const splitPathLength = path.split("/").length;
                    const fileName = path.split("/")[splitPathLength - 1];
                    symbols.push(fileName)
                } else {
                    symbols.push(path)
                }
            }
        }

        return symbols
    }

    const extractExports = (content: string): string[] => {
        const exports: string[] = []
        const regex = /export\s+(?:const|function|class|interface|type)\s+(\w+)/g

        let match
        while ((match = regex.exec(content))) {
            exports.push(match[1])
        }

        const def = content.match(/export default (\w+)/)
        if (def) exports.push(def[1])

        return exports
    }

    function isCSSFile(path: string) {
        return /\.(css|scss|sass)$/.test(path)
    }

    const classifyLayer = (path: string, code: string): Layer => {
        if (isCSSFile(path)) return 'style';

        let frontend = 0
        let backend = 0

        // Path
        if (/frontend|client|web|ui/i.test(path)) frontend += 3
        if (/backend|server|api|controller|service/i.test(path)) backend += 3

        // Extension
        if (/\.(tsx|jsx|css|html)$/.test(path)) frontend += 3
        if (/\.(java|go|rb|php|cs)$/.test(path)) backend += 3

        // Content
        if (/useState|useEffect|<\w+|axios|fetch\(/.test(code)) frontend += 2
        if (/@RestController|@GetMapping|express\(|router\./.test(code)) backend += 2

        if (frontend > backend) return 'frontend'
        if (backend > frontend) return 'backend'
        return 'unknown'
    }

    const buildRawSteps = (file: FlattenedFile): FileSteps => {
        const steps: Step[] = file.changes.map(change => ({
            filePath: file.path,
            title: file.path, // filled by LLM later
            line: change.lineStart,
            code: change.added.length > 0 ? change.added : change.removed
        }))

        return {
            filePath: file.path,
            steps
        }
    }

    const buildGraphSteps = (file: FlattenedFile, imports: string[], exports: string[], fileContent: string): StepNode[] => {
        let stepId = 1;

        return file.changes.map(change => {
            const filePathLength = file.path.split("/").length;
            const fileNameWithExtension = file.path.split("/")[filePathLength - 1];
            const fileName = fileNameWithExtension.split(".")[0];
            return {
                id: String(fileName + stepId++),
                filePath: file.path,
                line: change.lineStart,
                code: change.added,
                layer: classifyLayer(file.path, fileContent),
                imports,
                exports
            }
        })
    }

    const processGitDiff = async (user: User, pullRequest: GithubPullRequestDTO): Promise<StepNode[]> => {
        const diff = await githubService.fetchPullRequestDiff(user, pullRequest);

        const parsedDiff = splitDiffByFiles(diff);

        const flattenedDiff: FlattenedDiff = mergeAdjacentChanges(flattenDiff(parsedDiff));

        //const rawSteps = flattenedDiff.map((diff) => buildRawSteps(diff));

        const fileContents = await githubService.fetchPullRequestFileContents(user, pullRequest, parsedDiff.files.length);

        const allLayeredSteps: StepNode[] = [];

        for (const content of fileContents) {
            const imports = parseImportSymbols(extractImports(content.content));
            const exports = extractExports(content.content);
            const flattenedFile = flattenedDiff.find(file => file.path === content.file);
            if (!flattenedFile) continue;
            const nodeSteps = buildGraphSteps(flattenedFile, imports, exports, content.content);
            allLayeredSteps.push(...nodeSteps);
        }

        return allLayeredSteps;
    }

    return {
        processGitDiff
    }

}
