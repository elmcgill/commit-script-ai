export type LineType = 'context' | 'add' | 'remove'

export type DiffLine = {
    type: LineType
    content: string
    oldLineNumber: number | null
    newLineNumber: number | null
}

export type DiffHunk = {
    header: string
    oldStart: number
    oldLines: number
    newStart: number
    newLines: number
    lines: DiffLine[]
}

export type DiffFile = {
    oldPath: string
    newPath: string
    hunks: DiffHunk[]
}

export type ParsedDiff = {
    files: DiffFile[]
}

export type FlattenedChange = {
  lineStart: number
  added: string[]
  removed: string[]
}

export type FlattenedFile = {
  path: string
  changes: FlattenedChange[]
}

export type FlattenedDiff = FlattenedFile[];

export type Step = {
  filePath: string
  title: string
  line: number
  code: string[]
}

export type FileSteps = {
  filePath: string
  steps: Step[]
}

export type Layer = 'frontend' | 'style' | 'backend' | 'unknown'

export type StepNode = {
    id: string,
    filePath: string,
    line: number,
    code: string[],
    layer: Layer,
    imports: string[],
    exports: string[]
}
