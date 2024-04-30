import { Injectable } from '@nestjs/common';
import { KfConfigService, KfException } from '@kf-products-core/kfhub_svc_lib';
import {
    Banner,
    BannerEnvironmentConfiguration,
    BannerS3Configuration,
    BannersEnvironmentResponse,
    BannersPutBody,
    BannersQueryBase,
    BannersRawQuery,
    BannerUserFilter,
    BannerWhen,
} from './banners.interface';
import { BannersEnvironmentName, BannersQueryType } from './banners.const';
import { Oopser } from '../../common/oops';
import { Request } from 'express';
import { RequestFactory } from '../../common/request-factory';
import { AuthDetails, AuthMetadata } from '../../common/request-factory.interface';
import {
    bannersConfigurations,
    bannersFilePath,
    bannersS3Configuration,
    environmentFilePath,
} from './banners.configuration';
import axios from 'axios';
import { anyToDecimal, anyToTime } from '../../common/common.utils';
import { KfExceptionCodes as ec } from '../../kfthm-exception-codes.enum';
import { S3, CloudFront } from 'aws-sdk';
import { ApplicationRole } from '../../common/common.interface';
import { PutObjectRequest } from 'aws-sdk/clients/s3';

@Injectable()
export class BannersService {
    protected oopser: Oopser = new Oopser('BannersService');
    protected targetEnvironmentNames: BannersEnvironmentName[];

    constructor(
        protected configService: KfConfigService,
        protected request: RequestFactory,
    ) {}

    async handlePut(request: Request): Promise<any> {
        try {
            const body = request.body as BannersPutBody;
            this.validatePutPayload(body);

            const auth = this.request.getAuthDetails(request);
            const meta = await this.request.getTokenMetadata(auth);
            const name = body.target;

            const isEditAllowed = await this.isEditAllowed(auth, meta);
            if (!isEditAllowed) {
                throw `You're not allowed to update "${name}" environment`;
            }

            const banners = this.readBannersPutPayload(meta, body.banners);
            await this.putObjectToS3(bannersS3Configuration[name], bannersFilePath, Buffer.from(JSON.stringify(banners, null, 4)));

            try {
                await this.invalidateCloudFrontCacheFor(bannersS3Configuration[name], bannersFilePath);
            } catch (ec) {
                this.oopser.logError('invalidateCloudFrontCacheFor', ec);
            }
        } catch (e) {
            this.oopser.logError('handlePut', e);
            throw new KfException({ text: e }, 500, ec.INPUT_VAL_ERR);
        }
        return true;
    }

    protected validatePutPayload(body: BannersPutBody): void {
        const target = body.target;
        if (!target || typeof target !== 'string') {
            throw `Target no provided`;
        }

        const banners = body.banners;
        if (!banners) {
            throw `No banners provided`;
        }
        if (!Array.isArray(banners)) {
            throw `Invalid banners payload`;
        }
        if (!this.getAvailableTargetEnvironmentNames().includes(target as BannersEnvironmentName)) {
            throw `Unknown target ${target}`;
        }
        const config = bannersConfigurations[target];
        if (!config) {
            throw `No configuration provided for ${target}`;
        }
    }

    protected readBannersPutPayload(meta: AuthMetadata, banners: Banner[]): Banner[] {
        return JSON.parse(JSON.stringify(banners.map(b => {
            if (b.isChanged || b.isNew) {
                b.editorId = meta.userId;
                b.modifiedOn = new Date().getTime();
            }
            return {
                key: b.key,
                icon: b.icon,
                noIcon: b.noIcon,
                enabled: b.enabled,
                closable: b.closable,
                dismissable: b.dismissable,
                message: b.message,
                when: b.when,
                messageParams: b.messageParams,
                editorId: b.editorId,
                modifiedOn: b.modifiedOn,
            };
        })));
    }

    async handleGet(request: Request): Promise<any> {
        const query = this.readQueryAs(request.query as BannersRawQuery);
        const auth = this.request.getAuthDetails(request);
        if (BannersQueryType.SNAPSHOT === query.type) {
            return await this.handleSnapshotQuery(query, auth);
        }
        throw `Unknown query type ${query.type}`;
    }

    protected async handleSnapshotQuery(query: BannersQueryBase, auth: AuthDetails): Promise<BannersEnvironmentResponse[]> {
        const meta = await this.request.getTokenMetadata(auth);
        const response: BannersEnvironmentResponse[] = [];

        const isEditAllowed = await this.isEditAllowed(auth, meta);
        const fetchUsingS3 = String(this.configService.get('BANNERS_FETCH_USING_S3') || '').toLowerCase() === 'true';

        for (const name of this.getAvailableTargetEnvironmentNames()) {
            const config = bannersConfigurations[name];
            if (!config) {
                throw `No configuration provided for ${name}`;
            }

            const s3Config = bannersS3Configuration[name];
            if (!s3Config) {
                throw `No s3 configuration provided for ${name}`;
            }

            const entry: BannersEnvironmentResponse = {
                environment: {
                    name,
                    description: config.description,
                    additionalNote: config.additionalNote,
                    readonly: !isEditAllowed,
                },
            };
            if (name === query.source) {
                if (fetchUsingS3) {
                    entry.banners = await this.getBannersForEnvironmentFromS3Bucket(s3Config);
                } else {
                    entry.banners = await this.getBannersForEnvironment(config);
                }
            }
            response.push(entry);
        }

        return response;
    }

    protected readQueryAs<T extends BannersQueryBase>(rawQuery: BannersRawQuery): T {
        try {
            const query = JSON.parse(decodeURIComponent(rawQuery.query)) as T;
            if (!Object.values(BannersQueryType).includes(query.type as BannersQueryType)) {
                throw 'Unknown query type';
            }
            const availableEnvironmentNames = this.getAvailableTargetEnvironmentNames();
            if (!query.source) {
                query.source = availableEnvironmentNames[0];
            }
            if (query.source && !availableEnvironmentNames.includes(query.source as BannersEnvironmentName)) {
                throw `Unknown or unavailable source environment name ${query.source}`;
            }
            return query;
        } catch (e) {
            this.oopser.throwError('readQueryAs', e);
        }
    }

    protected async isEditAllowed(auth: AuthDetails, meta: AuthMetadata): Promise<any> {
        try {
            const roles = await this.getApplicationRoles(auth, meta);
            const parts = ['ADD', 'EDIT', 'UPDATE'];
            return roles.some(r => {
                const name = r.name.toUpperCase();
                return parts.some(part => name.includes(part));
            });
        } catch (e) {
            return false;
        }
    }

    protected getApplicationRoles(auth: AuthDetails, meta: AuthMetadata): Promise<ApplicationRole[]> {
        return this.request.getApplicationRoles({
            auth,
            userId: meta.userId,
            applicationName: 'BANNER_MANAGEMENT',
            module: 'ALL',
        });
    }

    protected getAvailableTargetEnvironmentNames(): BannersEnvironmentName[] {
        if (!this.targetEnvironmentNames) {
            try {
                const key = 'BANNERS_TARGET_ENVIRONMENTS';
                const validEnvironmentNames = Object.values(BannersEnvironmentName);
                const environments = (this.configService.get(key) || '').split(',').map((v) => v.trim());
                if (!environments.length) {
                    throw `No meaningful ${key} value provided`;
                }
                for (const v of environments) {
                    if (!validEnvironmentNames.includes(v)) {
                        throw `Unknown ${key} value ${v}`;
                    }
                }
                this.targetEnvironmentNames = environments;
            } catch (e) {
                this.oopser.throwError('getTargetEnvironmentNames', e);
            }
        }
        return this.targetEnvironmentNames;
    }

    protected async getBannersForEnvironment(configuration: BannerEnvironmentConfiguration): Promise<Banner[]> {
        const banners = [];

        try {
            const contents = (await axios(configuration.environmentFileUrl)).data;
            banners.push(...(contents.banners || []).map((b) => this.mapBanner(b, { isReadonly: true })));
        } catch (e) {
            this.oopser.logError(e);
            this.oopser.logError(`Unable to retrieve ${configuration.environmentFileUrl}`);
        }

        try {
            const contents = (await axios(configuration.bannersFileUrl)).data;
            banners.push(...(contents || []).map((b) => this.mapBanner(b, { isReadonly: false })));
            // tslint:disable-next-line:no-empty
        } catch (e) {
            this.oopser.logError(e);
            this.oopser.logError(`Unable to retrieve ${configuration.bannersFileUrl}`);
        }

        return banners;
    }

    protected async getBannersForEnvironmentFromS3Bucket(configuration: BannerS3Configuration): Promise<Banner[]> {
        const banners = [];

        try {
            const response = await this.getObjectFromS3(configuration, environmentFilePath);
            const contents = JSON.parse(response.Body.toString());
            banners.push(...(contents.banners || []).map((b) => this.mapBanner(b, { isReadonly: true })));
        } catch (e) {
            this.oopser.logError(e);
            this.oopser.logError(`Unable to retrieve ${environmentFilePath} from s3:${configuration.bucket}:${configuration.region}`);
        }

        try {
            const response = await this.getObjectFromS3(configuration, bannersFilePath);
            const contents = JSON.parse(response.Body.toString());
            banners.push(...(contents || []).map((b) => this.mapBanner(b, { isReadonly: false })));
            // tslint:disable-next-line:no-empty
        } catch (e) {
            this.oopser.logError(e);
            this.oopser.logError(`Unable to retrieve ${bannersFilePath} from s3:${configuration.bucket}:${configuration.region}`);
        }

        return banners;
    }

    protected mapBanner(raw: any, override: Partial<Banner>): Banner {
        const banner: Banner = {
            key: String(raw.key),
            icon: typeof raw.icon === 'string' ? raw.icon : undefined,
            noIcon: Boolean(raw.noIcon),
            enabled: Boolean(raw.enabled),
            closable: Boolean(raw.closable),
            dismissable: Boolean(raw.dismissable),
            message: String(raw.message) || '',
            messageParams: raw.messageParams || undefined,
            editorId: anyToDecimal(raw.editorId) || undefined,
            modifiedOn: anyToTime(raw.modifiedOn) || undefined,
        };

        const when: BannerWhen = {};

        const rawWhen = raw.when;
        if (rawWhen) {

            const recurrence = rawWhen.recurrence;
            if (recurrence) {
                const daysRange = anyToDecimal(recurrence.daysRange);
                const every = anyToDecimal(recurrence.every);
                if (daysRange && every) {
                    when.recurrence = {
                        daysRange,
                        every,
                    };
                }
            }

            const rawForUser = rawWhen.forUser;
            if (rawForUser) {

                const clientIds = (rawForUser.clientId || []).map(anyToDecimal).filter(Boolean);
                const userIds = (rawForUser.userId || []).map(anyToDecimal).filter(Boolean);
                const locales = (rawForUser.locale || []).map(v => String(v).trim()).filter(Boolean);

                const forUser: BannerUserFilter = {
                    expirationTime: anyToDecimal(rawForUser.modifiedOn) || undefined,
                    passwordExpirationTime: anyToDecimal(rawForUser.passwordExpirationTime) || undefined,
                    lastLoginTime: anyToDecimal(rawForUser.lastLoginTime) || undefined,
                    accountStatus: anyToDecimal(rawForUser.accountStatus) || undefined,
                    isAdmin: rawForUser.isAdmin === undefined ? undefined : Boolean(rawForUser.isAdmin),
                    isSuperAdmin: rawForUser.isSuperAdmin === undefined ? undefined : Boolean(rawForUser.isSuperAdmin),
                    isKFSuperAdmin: rawForUser.isKFSuperAdmin === undefined ? undefined : Boolean(rawForUser.isKFSuperAdmin),
                    clientId: clientIds.length ? clientIds : undefined,
                    userId: userIds.length ? userIds : undefined,
                    locale: locales.length ? locales : undefined
                };
                for (const k of Object.keys(forUser)) {
                    if (forUser[k] === undefined) {
                        delete forUser[k];
                    }
                }
                if (Object.keys(forUser).length) {
                    when.forUser = forUser;
                }
            }

            const forApps = (rawWhen.forApps || []).map(String).filter(Boolean);
            when.forApps = forApps.length ? forApps : undefined;

            when.isUser = rawWhen.isUser === undefined ? undefined : Boolean(rawWhen.isUser);
            when.dateAfter = anyToTime(rawWhen.dateAfter) || undefined;
            when.dateBefore = anyToTime(rawWhen.dateBefore) || undefined;

            for (const k of Object.keys(when)) {
                if (when[k] === undefined) {
                    delete when[k];
                }
            }
            if (Object.keys(when).length) {
                banner.when = when;
            }
        }

        return Object.assign(banner, override);
    }

    protected async fetchResourceWithS3(config: BannerS3Configuration, key: string): Promise<any> {
        await new S3({
            signatureVersion: 'v4',
            accessKeyId: this.configService.get('AMAZON_SECRET_KEY'),
            secretAccessKey: this.configService.get('AMAZON_ACCESS_ID'),
            region: config.region,
        }).getObject({
            Bucket: config.bucket,
            Key: key,
        }).promise();
    }

    protected async getObjectFromS3(config: BannerS3Configuration, key: string): Promise<any> {
        return new S3({
            signatureVersion: 'v4',
            accessKeyId: this.configService.get('AMAZON_SECRET_KEY'),
            secretAccessKey: this.configService.get('AMAZON_ACCESS_ID'),
            region: config.region,
        }).getObject({
            Bucket: config.bucket,
            Key: key,
        }).promise();
    }

    protected async putObjectToS3(config: BannerS3Configuration, key: string, data: Buffer, override?: PutObjectRequest): Promise<void> {
        return new S3({
            signatureVersion: 'v4',
            accessKeyId: this.configService.get('AMAZON_SECRET_KEY'),
            secretAccessKey: this.configService.get('AMAZON_ACCESS_ID'),
            region: config.region,
        }).putObject(Object.assign({
            ContentType: 'application/json',
            ACL: 'public-read',
            CacheControl: 'no-cache',
        }, override || {}, {
            Bucket: config.bucket,
            Key: key,
            Body: data,
        })).promise();
    }

    protected async invalidateCloudFrontCacheFor(config: BannerS3Configuration, key: string): Promise<void> {
        return new CloudFront({
            signatureVersion: 'v4',
            accessKeyId: this.configService.get('AMAZON_SECRET_KEY'),
            secretAccessKey: this.configService.get('AMAZON_ACCESS_ID'),
            region: config.region,
        }).createInvalidation({
            DistributionId: config.cloudfrontDistributionId,
            InvalidationBatch: {
                CallerReference: `banners-management-${new Date().getTime()}`,
                Paths: {
                    Quantity: 1,
                    Items: [
                        `/${key}`
                    ]
                }
            }
        }).promise()
    }
}