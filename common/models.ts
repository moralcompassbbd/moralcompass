export type ApiErrorCode = 'unknown_server_error' | 'invalid_route_parameter' | 'not_found' | 'invalid_body';

export type ApiErrorType<C extends ApiErrorCode, T = undefined> = {
    errorCode: C,
    detail: string,
    data: T,
};

export type ApiErrorResponse =
    ApiErrorType<'unknown_server_error'> |
    ApiErrorType<'invalid_route_parameter'> |
    ApiErrorType<'not_found'> |
    ApiErrorType<'invalid_body'>;

export type User = {
    userId: number,
    googleId: string,
    email: string,
    name: string,
    role_name: string,
};

export type Question = {
    questionId: number,
    text: string,
    choices: Choice[],
};

export type QuestionCreateRequest = {
    text: string;
    choices: string[];
};

export type Choice = {
    choiceId: number,
    questionId: number,
    text: string,
    answerCount: number,
};

export type Answer = {
    answerId: number,
    userId: number,
    choiceId: number,
    createdAt: Date,
};

export type AnswerCreateRequest = {
    choiceId: number,
};

export type ButtonOptions = {
    text: string;
    onClick: (e: MouseEvent) => void;
    className?: string;
    backgroundColor?: string;
    textColor?: string;
    type?: "button" | "submit" | "reset";
};

export type GoogleUser = {
    iss: string,
    azp: string,
    aud: string,
    sub: string,
    email: string,
    email_verified: string,
    nbf: string,
    name: string,
    picture: string,
    given_name: string,
    iat: string,
    exp: string,
    jti: string,
    alg: string,
    kid: string,
    typ: string
}
