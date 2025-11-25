import * as runtime from "@prisma/client/runtime/index-browser";
export type * from '../models';
export type * from './prismaNamespace';
export declare const Decimal: typeof runtime.Decimal;
export declare const NullTypes: {
    DbNull: (new (secret: never) => typeof runtime.DbNull);
    JsonNull: (new (secret: never) => typeof runtime.JsonNull);
    AnyNull: (new (secret: never) => typeof runtime.AnyNull);
};
export declare const DbNull: import("@prisma/client-runtime-utils").DbNullClass;
export declare const JsonNull: import("@prisma/client-runtime-utils").JsonNullClass;
export declare const AnyNull: import("@prisma/client-runtime-utils").AnyNullClass;
export declare const ModelName: {
    readonly Email: "Email";
    readonly Customer: "Customer";
    readonly Meeting: "Meeting";
    readonly User: "User";
    readonly Translation: "Translation";
};
export type ModelName = (typeof ModelName)[keyof typeof ModelName];
export declare const TransactionIsolationLevel: {
    readonly ReadUncommitted: "ReadUncommitted";
    readonly ReadCommitted: "ReadCommitted";
    readonly RepeatableRead: "RepeatableRead";
    readonly Serializable: "Serializable";
};
export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel];
export declare const EmailScalarFieldEnum: {
    readonly id: "id";
    readonly email: "email";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type EmailScalarFieldEnum = (typeof EmailScalarFieldEnum)[keyof typeof EmailScalarFieldEnum];
export declare const CustomerScalarFieldEnum: {
    readonly id: "id";
    readonly name: "name";
    readonly email: "email";
    readonly phone: "phone";
    readonly timezone: "timezone";
    readonly companyDetails: "companyDetails";
    readonly adminId: "adminId";
    readonly source: "source";
    readonly level: "level";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type CustomerScalarFieldEnum = (typeof CustomerScalarFieldEnum)[keyof typeof CustomerScalarFieldEnum];
export declare const MeetingScalarFieldEnum: {
    readonly id: "id";
    readonly customerDate: "customerDate";
    readonly customerTime: "customerTime";
    readonly customerTimezone: "customerTimezone";
    readonly agentDate: "agentDate";
    readonly agentTime: "agentTime";
    readonly agentTimezone: "agentTimezone";
    readonly customerId: "customerId";
    readonly agentId: "agentId";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type MeetingScalarFieldEnum = (typeof MeetingScalarFieldEnum)[keyof typeof MeetingScalarFieldEnum];
export declare const UserScalarFieldEnum: {
    readonly id: "id";
    readonly email: "email";
    readonly password: "password";
    readonly name: "name";
    readonly role: "role";
    readonly isAgent: "isAgent";
    readonly timezone: "timezone";
    readonly avatar: "avatar";
    readonly isActive: "isActive";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum];
export declare const TranslationScalarFieldEnum: {
    readonly id: "id";
    readonly code: "code";
    readonly data: "data";
    readonly nativeName: "nativeName";
    readonly englishName: "englishName";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type TranslationScalarFieldEnum = (typeof TranslationScalarFieldEnum)[keyof typeof TranslationScalarFieldEnum];
export declare const SortOrder: {
    readonly asc: "asc";
    readonly desc: "desc";
};
export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];
export declare const JsonNullValueInput: {
    readonly JsonNull: "JsonNull";
};
export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput];
export declare const QueryMode: {
    readonly default: "default";
    readonly insensitive: "insensitive";
};
export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode];
export declare const NullsOrder: {
    readonly first: "first";
    readonly last: "last";
};
export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder];
export declare const JsonNullValueFilter: {
    readonly DbNull: "DbNull";
    readonly JsonNull: "JsonNull";
    readonly AnyNull: "AnyNull";
};
export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter];
