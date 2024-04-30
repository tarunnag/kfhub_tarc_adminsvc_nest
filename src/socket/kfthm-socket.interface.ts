export class Clients {
    loggedInUserClientId: number;

    socketId: string;

    fileUUID?: string;
}

export enum EVENTS {
    STATUS = 'status',
}
