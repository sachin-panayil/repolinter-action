interface RepoLintResult {
    results: RuleResult[];
}

interface RuleResult {
    ruleInfo: RuleInfo;
    status: string;
    lintResult: LintResult;
}

interface RuleInfo {
    ruleType: string;
    name: string;
}

interface LintResult {
    message?: string;
    targets: Target[];
    passed: boolean;
}

interface Target {
    passed: boolean;
    pattern?: string;
}

export function filterForFiles(jsonString: string): string[] {
    try {
        const data: RepoLintResult = JSON.parse(jsonString);
        
        const missingFiles = data.results
            .filter(result => 
                result.status === "NOT_PASSED_ERROR" && 
                result.ruleInfo.ruleType === "file-existence"
            )
        
        console.log(missingFiles);
        return []
    } catch (error) {
        console.error('Error parsing repolinter output:', error);
        return [];
    }
}