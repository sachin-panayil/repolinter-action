interface RepolinterResult {
    results: Array<{
        ruleInfo: {
            ruleConfig: {
                ['file-name']: string;
                ['file-content']: string;
            };
        };
        status: string;
        lintResult: {
            message: string;
        };
    }>;
}

export function getFileChanges(jsonResult: string): { [key: string]: string } {
    try {
        const data: RepolinterResult = JSON.parse(jsonResult);
        const files: { [key: string]: string } = {};

        for (const result of data.results) {
            if (result.lintResult.message?.startsWith("Did not find")) {
                const fileName = result.ruleInfo.ruleConfig['file-name'];
                const content = result.ruleInfo.ruleConfig['file-content'] || '';

                if (fileName) {
                    files[fileName] = files[fileName] 
                        ? files[fileName] + '\n' + content 
                        : content;
                }
            }
        }

        return files;
    } catch (error) {
        console.error('Error parsing repolinter results:', error);
        return {};
    }
}