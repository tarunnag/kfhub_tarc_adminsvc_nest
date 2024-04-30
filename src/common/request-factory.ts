import { KfConfigService } from '@kf-products-core/kfhub_svc_lib';
import { Injectable } from '@nestjs/common';
import {
    ApplicationRolesRequestOptions,
    AuthDetails,
    AuthHeaders,
    AuthMetadata,
    AuthQueryParams,
    Headers,
    LambdaAuthHeaders, //
} from './request-factory.interface';
import { Request } from 'express';
import { RequestFactoryBase } from './request-factory.base';
import axios, { AxiosRequestConfig } from 'axios';
import { ApplicationRole, ApplicationRoleType } from './common.interface';

@Injectable()
export class RequestFactory extends RequestFactoryBase {
    protected readonly appName: string;
    protected readonly apiBase: string;

    constructor(configService: KfConfigService) {
        super();
        this.appName = configService.get('APP_NAME');
        this.apiBase = configService.get('URL_KFHUB_API_BASE');
    }

    protected buildLocalURL(...input: any[]): string {
        return this.buildURL(this.apiBase, ...input);
    }

    getAuthDetails(request: Request): AuthDetails {
        return {
            authToken: this.readHeaderKey(request, 'authtoken'),
            sessionId: this.readHeaderKey(request, 'ps-session-id'),
        };
    }

    protected generateAuthHeaders(options: AuthDetails): AuthHeaders {
        return {
            authToken: options.authToken,
            'ps-session-id': options.sessionId,
        };
    }

    protected generateLambdaAuthHeaders(options: AuthDetails): LambdaAuthHeaders {
        return {
            Authtoken: options.authToken,
            'Ps-session-id': options.sessionId,
        };
    }

    protected generateApplicationHeaders(): Headers {
        return {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': 'true',
            application: this.appName,
        };
    }

    protected generateLambdaRequestHeaders(auth: AuthDetails): Headers {
        return {
            ...this.generateApplicationHeaders(),
            ...this.generateLambdaAuthHeaders(auth),
            'Content-Type': 'application/json',
        };
    }

    protected generateAuthQueryParams(options: AuthDetails): AuthQueryParams {
        return {
            authToken: options.authToken,
            'ps-session-id': options.sessionId,
        };
    }

    protected generateTokenMetadataRequest(options: AuthDetails): AxiosRequestConfig {
        const url = this.buildURL(this.apiBase, '/v1/actions/token/metadata');
        return {
            method: 'GET',
            url,
            headers: {
                ...this.generateApplicationHeaders(),
                ...this.generateAuthHeaders(options),
            },
        };
    }

    protected generateApplicationRolesRequest(options: ApplicationRolesRequestOptions): AxiosRequestConfig {
        const url = this.buildURL(this.apiBase, '/v1/hrms/usermanagement/actions/permissions');
        return {
            method: 'GET',
            url: this.pushQueryParams(url, this.buildRequestQuery({
                appUserId: options.userId,
                applicationName: options.applicationName,
                module: options.module || 'ALL',
            })),
            headers: {
                ...this.generateApplicationHeaders(),
                ...this.generateAuthHeaders(options.auth),
            },
        };
    }

    async getTokenMetadata(auth: AuthDetails): Promise<AuthMetadata> {
        const response = await axios(this.generateTokenMetadataRequest(auth));
        return {
            userId: Number(response.data.userid),
            clientId: Number(response.data.clientId),
            locale: response.data.locale,
        };
    }

    async getApplicationRoles(options: ApplicationRolesRequestOptions): Promise<ApplicationRole[]> {
        const response = await axios(this.generateApplicationRolesRequest(options));
        const roles: ApplicationRole[] = [];
        for (const type of response.data.types) {
            for (const name of (type.names || [])) {
                roles.push(...(name.roles || []).map(role => this.toApplicationRole(role)));
            }
        }
        return roles;
    }

    protected toApplicationRole(raw: any): ApplicationRole {
        return {
            name: raw.roleName,
            description: raw.roleDesc,
            type: (raw.roleType || '').toUpperCase() as ApplicationRoleType,
        };
    }

}
