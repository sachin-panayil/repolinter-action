import * as fs from 'fs';

interface RepolinterResult {
    results: Array<{
        ruleInfo: {
            ruleConfig: {
                ['file-name']: string;
                ['file-content']: string;
            };
        };
        status: string;
        lintResult?: {
            message?: string;
            passed?: boolean;
        };
    }>;
}

export function getFileChanges(jsonResult: string): { [key: string]: string } {
    try {
        const data: RepolinterResult = JSON.parse(jsonResult);
        const files: { [key: string]: string } = {};

        for (const result of data.results) {
            console.log('\n--- Result ---');
            console.log('Status:', result.status);
            console.log('File Name:', result.ruleInfo.ruleConfig['file-name']);
            console.log('File Content:', result.ruleInfo.ruleConfig['file-content']);
            console.log('Lint Message:', result.lintResult?.message);
            console.log('Lint Status:', result.lintResult?.passed);
            console.log('\n')

            if (result.lintResult?.message?.startsWith("Did not find") || 
                (result.status === "NOT_PASSED_ERROR" && result.lintResult?.passed === false) ) {

                const fileName = result.ruleInfo.ruleConfig['file-name'];
                const newContent = result.ruleInfo.ruleConfig['file-content'] || '';

                if (fileName) {
                    if (fs.existsSync(fileName)) {
                        const existingContent = fs.readFileSync(fileName, 'utf-8');
                        files[fileName] = `${existingContent}\n\n${newContent}`;
                    } else {
                        files[fileName] = files[fileName] 
                        ? files[fileName] + '\n' + newContent 
                        : newContent;
                    }
                }
            }
        }

        return files;
    } catch (error) {
        console.error('Error parsing repolinter results:', error);
        return {};
    }
}