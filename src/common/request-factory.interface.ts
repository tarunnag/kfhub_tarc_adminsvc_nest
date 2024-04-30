import { AxiosRequestConfig } from 'axios';

export interface ResponseStatus {
    code: string;
    message: string;
}

export interface Response<T = void> {
    success: boolean;
    status: ResponseStatus;
    data?: T;
}

export interface Headers {
    [key: string]: string;
}

export interface AuthHeaders extends Headers {
    authToken: string;
    'ps-session-id': string;
}

export interface LambdaAuthHeaders extends Headers {
    Authtoken: string;
    'Ps-session-id': string;
}

export interface AuthQueryParams {
    authToken: string;
    'ps-session-id': string;
}

export interface AuthDetails {
    authToken: string;
    sessionId: string;
}

export interface RequestOptions {
    auth: AuthDetails;
}

export interface CallbackRequest<T extends AxiosRequestConfig = any> {
    callback: T;
}

export interface CallbackCallbackRequest<T extends AxiosRequestConfig = any> {
    callback?: AxiosRequestConfig<CallbackRequest<T>>;
}

export interface AuthMetadata {
    userId: number;
    clientId: number;
    locale: string;
}

export interface ApplicationRolesRequestOptions {
    auth: AuthDetails;
    userId: number;
    applicationName: string;
    module?: string;
}
