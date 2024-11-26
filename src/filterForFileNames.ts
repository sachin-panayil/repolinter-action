// change file name to pullRequestHelpers

interface RepoLintResult {
    results: RuleResult[];
}

interface RuleResult {
    ruleInfo: RuleInfo;
    status: string;
}

interface RuleInfo {
    ruleType: string;
    name: string;
    ruleConfig: RuleConfig
}

interface RuleConfig {
    globsAny: string[]
}

// step 1 is to get the name of the files that are missing
export function filterForFiles(jsonString: string): string[] {
    try {
        const data: RepoLintResult = JSON.parse(jsonString);
        
        const missingFiles = data.results
            .filter(result => 
                result.status === "NOT_PASSED_ERROR" && 
                result.ruleInfo.ruleType === "file-existence"
            )
            .map(result => {
                const pattern = result.ruleInfo.ruleConfig.globsAny[0]
                return pattern.split("}").pop() || pattern
            })
        
        console.log(missingFiles);
        return []
    } catch (error) {
        console.error('Error parsing repolinter output:', error);
        return [];
    }
}                     