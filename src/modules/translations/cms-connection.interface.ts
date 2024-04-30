export interface CMSCompetencesCompetency {
    type: string;
    id: string;
    clientCode: string;
    clientLabel: string;
    name: string;
    description: string;
    globalCode: string;
    extProps: any;
}
export interface CMSCompetencesAntiCluster {
    type: string;
    id: string;
    clientCode: string;
    clientLabel: string;
    name: string;
    label: string;
    description: string;
    stallerStoppers: CMSCompetencesCompetency[];
    extProps: any;
}
export interface CMSCompetencesCluster {
    type: string;
    id: string;
    clientCode: string;
    clientLabel: string;
    name: string;
    label: string;
    description: string;
    competencies: CMSCompetencesCompetency[];
    extProps: any;
}
export interface CMSCompetencesAntiFactor {
    type: string;
    id: string;
    clientCode: string;
    clientLabel: string;
    name: string;
    label: string;
    description: string;
    antiClusters: CMSCompetencesAntiCluster[];
    extProps: any;
}
export interface CMSCompetencesFactor {
    type: string;
    id: string;
    clientCode: string;
    clientLabel: string;
    name: string;
    label: string;
    description: string;
    clusters: CMSCompetencesCluster[];
    extProps: any;
}
export interface CMSCompetences {
    type: string;
    id: string;
    name: string;
    description: string;
    modelOrigin: string;
    langs: string[];
    factors: CMSCompetencesFactor[];
    antiFactors: CMSCompetencesAntiFactor[];
    extProps: any;
}

export interface CMSTraitsDriversDocMetaData {
    id: string;
    lang: string;
    tag: string;
}

export interface CMSTraitsDriversTraits {
    type: string;
    config: {
        showHeaderFooter: string;
        showInTableOfContents: string;
        useTitleAsHeading: string;
    };
    content: {
        title: string;
        description: string;
    };
    components: CMSTraitsDriversTraitsComponents;
}

export interface CMSTraitsDriversTraitsComponents {
    content: {
        definitions: {
            [key: string]: {
                [key: string]: {
                    title: string;
                    definition: string;
                    longName: string;
                    abbreviation: string;
                    globalCode: string;
                };
            };
        };
    };
}

export interface CMSTraitsDriversSections {
    frontCover: any;
    aboutThisReport: any;
    howToReadThisReport: any;
    traits: any;
    drivers: any;
    disclaimer: any;
}
export interface CMSTraitsDriversFooter {
    config: {
        showPageNumber: string;
    };
    content: {
        copyright: string;
    };
}

export interface CMSTraitsDriversLabels {
    Customized: string;
    Traits: string;
    Drivers: string;
}

export interface CMSTraitsDriversHeader {
    content: {
        reportTitle: string;
        displayName: string;
        reportDate: string;
    };
}

export interface CMSTraitsDrivers {
    id: string;
    labels: CMSTraitsDriversLabels;
    header: CMSTraitsDriversHeader;
    footer: CMSTraitsDriversFooter;
    sections: CMSTraitsDriversSections;
    docMetaData: CMSTraitsDriversDocMetaData;
}

export interface GetTokenResponse {
    success: boolean;
    token: string;
}
