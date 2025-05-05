
export type ApiErrorCode = 'unknown_server_error' | 'invalid_parameter' | 'not_found';

export type ApiErrorType<C extends ApiErrorCode, T = undefined> = {
    errorCode: C,
    detail: string,
    data: T,
};

export type ApiErrorResponse =
    ApiErrorType<'unknown_server_error'> |
    ApiErrorType<'invalid_parameter'> | 
    ApiErrorType<'not_found'>;

export type User = {
    userId: number,
    googleId: string,
    email: string,
    name?: string,
};

export type Question = {
    questionId: number,
    text: string,
    choices: Choice[],
};

export type Choice = {
    choiceId: number,
    questionId: number,
    text: string,
};

export type Answer = {
    answerId: number,
    userId: number,
    choiceId: number,
    createdAt: Date,
};

export type AnswerPostRequest = {
    userId: number,
    choiceId: number,
};
