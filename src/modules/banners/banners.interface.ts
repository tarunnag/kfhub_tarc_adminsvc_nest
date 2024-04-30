export interface BannersRawQuery {
    query?: string;
}

export interface BannersQueryBase {
    type: string;
    source: string;
}

export interface BannersEnvironmentResponse {
    environment: BannersEnvironmentDetails;
    banners?: Banner[];
}

export interface BannersEnvironmentDetails {
    name: string;
    description: string;
    additionalNote?: string;
    readonly: boolean;
}

export interface BannerEnvironmentConfiguration {
    description: string;
    additionalNote?: string;
    bannersFileUrl: string;
    environmentFileUrl: string;
}

export interface BannerS3Configuration {
    bucket: string;
    region: string;
    cloudfrontDistributionId: string;
}

export interface BannerUserFilter {
    clientId?: number[];
    userId?: number[];
    locale?: string[];
    expirationTime?: number;
    passwordExpirationTime?: number;
    lastLoginTime?: number;
    accountStatus?: number;
    isAdmin?: boolean;
    isSuperAdmin?: boolean;
    isKFSuperAdmin?: boolean;
}

export interface BannerRecurrence {
    daysRange: number;
    every: number;
}

export interface BannerWhen {
    forApps?: string[];
    isUser?: boolean;
    forUser?: BannerUserFilter;
    dateAfter?: number;
    dateBefore?: number;
    recurrence?: BannerRecurrence;
}

export interface Banner {
    key?: string;
    icon?: string;
    noIcon: boolean;
    enabled: boolean;
    closable: boolean;
    dismissable: boolean;
    message: string;
    messageParams?: { [key: string]: any };
    when?: BannerWhen;

    isNew?: boolean;
    isChanged?: boolean;
    isReadonly?: boolean;

    editorId: number;
    modifiedOn: number;
}

export interface BannersPutBody {
    target: string;
    banners: Banner[];
}
