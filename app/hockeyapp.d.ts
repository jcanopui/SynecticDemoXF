export interface hockeyapp {
start: (success: any, failure: any, appId: any, autoSend?: any, ignoreDefaultHandler?: any, loginMode?:any, appSecret?: any) => void;
feedback: (success: any, failure: any) => void;
forceCrash: (success: any, failure: any) => void;
checkForUpdate: (success: any, failure: any) => void;
addMetaData: (success: any, failure: any, data: any) => void;
trackEvent: (success: any, failure: any, eventName: any) => void;

loginMode: {
ANONYMOUS: any,
EMAIL_ONLY: any,
EMAIL_PASSWORD: any,
VALIDATE: any
}
}
declare var hockeyapp:hockeyapp;