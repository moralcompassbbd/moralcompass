import { ApiErrorResponse } from "common/models";

export class ApiError extends Error {
    apiError: ApiErrorResponse;

    constructor(apiError?: ApiErrorResponse) {
        apiError ??= {
            errorCode: 'unknown_server_error',
            detail: 'An unexpected error has occurred.',
            data: undefined,
        };

        super(apiError.detail);
        this.apiError = apiError;
    }
}

export function mapError(error: unknown): [ApiErrorResponse, number] {
    if (error instanceof AggregateError) {
        return mapError(error.errors[0]);
    }
    if (error instanceof ApiError) {
        return mapApiError(error.apiError);
    } else {
        return [{
            errorCode: 'unknown_server_error',
            detail: 'An unknown error has occurred.',
            data: undefined,
        }, 500];
    }
}

export function mapApiError(error: ApiErrorResponse): [ApiErrorResponse, number] {
    switch (error.errorCode) {
        case 'invalid_route_parameter':
        case 'not_found':
            return [error, 404];
        case 'invalid_body':
            return [error, 400];
        default:
            return [error, 500];
    }
}
