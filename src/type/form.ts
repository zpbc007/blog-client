export interface CheckResult {
    hasError: boolean;
    errorMessage?: string;
}

export function getDefaultCheckResult(): CheckResult {
    return {
        hasError: false,
        errorMessage: '',
    };
}