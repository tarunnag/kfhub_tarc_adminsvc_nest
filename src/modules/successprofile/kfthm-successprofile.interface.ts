import { Common } from '../../common/common.interface';
import { ProfilesRaw, MetadataLanguagesRaw } from './kfthm-successprofile.service.i';
import { MetadataStrangeHardcodedValuesInResponse } from './kfthm-successprofile.enum';
export interface SuccessProfilesQuery extends Common.Query.DefaultPaginationFilters, Common.Query.DefaultEncodedFilters {
    type: string;
    requestClient: string;
}

export interface DecodedSpQueryParams {
    requestType: string;
    clientId: number;
    userId: number;
    locale: string;
    grade: string;
    level: string;
    langauge: string;
    function: string;
    profileType: string;
    pageIndex: number;
    pageSize: number;
    searchString: string;
    sortBy: string;
    sortColumn: string;
}

export interface SuccessProfiles {
    result: ProfilesRaw[];
    paging: Common.Utils.StandardPagination;
    preferredLanguages: MetadataLanguagesRaw[];
}

export interface SuccessProfilesIds {
    ids: {
        [ProfileType: string]: string[];
    };
}

export interface Metadata {
    metadata: {
        name: MetadataStrangeHardcodedValuesInResponse.NAME;
        value: MetadataStrangeHardcodedValuesInResponse.VALUE;
        searchOn: MetadataSearchOn[];
    }[];
}

interface MetadataSearchOn {
    name: string;
    value: string;
    options: MetadataOption[];
}

interface MetadataOption {
    id: string;
    value: string;
    name: string;
}
