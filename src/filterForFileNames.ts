interface RepolinterResult {
    results: Array<{
        ruleInfo: {
            ruleConfig: {
                ['file-name']?: string;
                ['file-content']?: string;
            };
        };
        status: string;
        lintResult?: {
            message?: string;
        };
    }>;
}

export function getFileChanges(jsonResult: string): { [key: string]: string } {
    try {
        const data: RepolinterResult = JSON.parse(jsonResult);
        const files: { [key: string]: string } = {};

        for (const result of data.results) {
            console.log(`THESE ARE THE RESULTS: ${result}`)
            if (result.lintResult?.message === "Did not find a file matching the specified patterns") {
                const fileName = result.ruleInfo.ruleConfig['file-name'];
                const content = result.ruleInfo.ruleConfig['file-content'] || '';

                console.log(`THESE ARE THE FILE NAMES: ${fileName}`)
                console.log(`THESE ARE THE FILE CONTENTS: ${content}`)

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