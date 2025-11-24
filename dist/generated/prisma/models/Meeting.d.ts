import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type MeetingModel = runtime.Types.Result.DefaultSelection<Prisma.$MeetingPayload>;
export type AggregateMeeting = {
    _count: MeetingCountAggregateOutputType | null;
    _min: MeetingMinAggregateOutputType | null;
    _max: MeetingMaxAggregateOutputType | null;
};
export type MeetingMinAggregateOutputType = {
    id: string | null;
    customerDate: string | null;
    customerTime: string | null;
    customerTimezone: string | null;
    agentDate: string | null;
    agentTime: string | null;
    agentTimezone: string | null;
    customerId: string | null;
    agentId: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type MeetingMaxAggregateOutputType = {
    id: string | null;
    customerDate: string | null;
    customerTime: string | null;
    customerTimezone: string | null;
    agentDate: string | null;
    agentTime: string | null;
    agentTimezone: string | null;
    customerId: string | null;
    agentId: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type MeetingCountAggregateOutputType = {
    id: number;
    customerDate: number;
    customerTime: number;
    customerTimezone: number;
    agentDate: number;
    agentTime: number;
    agentTimezone: number;
    customerId: number;
    agentId: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type MeetingMinAggregateInputType = {
    id?: true;
    customerDate?: true;
    customerTime?: true;
    customerTimezone?: true;
    agentDate?: true;
    agentTime?: true;
    agentTimezone?: true;
    customerId?: true;
    agentId?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type MeetingMaxAggregateInputType = {
    id?: true;
    customerDate?: true;
    customerTime?: true;
    customerTimezone?: true;
    agentDate?: true;
    agentTime?: true;
    agentTimezone?: true;
    customerId?: true;
    agentId?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type MeetingCountAggregateInputType = {
    id?: true;
    customerDate?: true;
    customerTime?: true;
    customerTimezone?: true;
    agentDate?: true;
    agentTime?: true;
    agentTimezone?: true;
    customerId?: true;
    agentId?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type MeetingAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.MeetingWhereInput;
    orderBy?: Prisma.MeetingOrderByWithRelationInput | Prisma.MeetingOrderByWithRelationInput[];
    cursor?: Prisma.MeetingWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | MeetingCountAggregateInputType;
    _min?: MeetingMinAggregateInputType;
    _max?: MeetingMaxAggregateInputType;
};
export type GetMeetingAggregateType<T extends MeetingAggregateArgs> = {
    [P in keyof T & keyof AggregateMeeting]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateMeeting[P]> : Prisma.GetScalarType<T[P], AggregateMeeting[P]>;
};
export type MeetingGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.MeetingWhereInput;
    orderBy?: Prisma.MeetingOrderByWithAggregationInput | Prisma.MeetingOrderByWithAggregationInput[];
    by: Prisma.MeetingScalarFieldEnum[] | Prisma.MeetingScalarFieldEnum;
    having?: Prisma.MeetingScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: MeetingCountAggregateInputType | true;
    _min?: MeetingMinAggregateInputType;
    _max?: MeetingMaxAggregateInputType;
};
export type MeetingGroupByOutputType = {
    id: string;
    customerDate: string;
    customerTime: string;
    customerTimezone: string;
    agentDate: string | null;
    agentTime: string | null;
    agentTimezone: string | null;
    customerId: string;
    agentId: string | null;
    createdAt: Date;
    updatedAt: Date;
    _count: MeetingCountAggregateOutputType | null;
    _min: MeetingMinAggregateOutputType | null;
    _max: MeetingMaxAggregateOutputType | null;
};
type GetMeetingGroupByPayload<T extends MeetingGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<MeetingGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof MeetingGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], MeetingGroupByOutputType[P]> : Prisma.GetScalarType<T[P], MeetingGroupByOutputType[P]>;
}>>;
export type MeetingWhereInput = {
    AND?: Prisma.MeetingWhereInput | Prisma.MeetingWhereInput[];
    OR?: Prisma.MeetingWhereInput[];
    NOT?: Prisma.MeetingWhereInput | Prisma.MeetingWhereInput[];
    id?: Prisma.StringFilter<"Meeting"> | string;
    customerDate?: Prisma.StringFilter<"Meeting"> | string;
    customerTime?: Prisma.StringFilter<"Meeting"> | string;
    customerTimezone?: Prisma.StringFilter<"Meeting"> | string;
    agentDate?: Prisma.StringNullableFilter<"Meeting"> | string | null;
    agentTime?: Prisma.StringNullableFilter<"Meeting"> | string | null;
    agentTimezone?: Prisma.StringNullableFilter<"Meeting"> | string | null;
    customerId?: Prisma.StringFilter<"Meeting"> | string;
    agentId?: Prisma.StringNullableFilter<"Meeting"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"Meeting"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Meeting"> | Date | string;
    customer?: Prisma.XOR<Prisma.CustomerScalarRelationFilter, Prisma.CustomerWhereInput>;
    agent?: Prisma.XOR<Prisma.UserNullableScalarRelationFilter, Prisma.UserWhereInput> | null;
};
export type MeetingOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    customerDate?: Prisma.SortOrder;
    customerTime?: Prisma.SortOrder;
    customerTimezone?: Prisma.SortOrder;
    agentDate?: Prisma.SortOrderInput | Prisma.SortOrder;
    agentTime?: Prisma.SortOrderInput | Prisma.SortOrder;
    agentTimezone?: Prisma.SortOrderInput | Prisma.SortOrder;
    customerId?: Prisma.SortOrder;
    agentId?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    customer?: Prisma.CustomerOrderByWithRelationInput;
    agent?: Prisma.UserOrderByWithRelationInput;
};
export type MeetingWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.MeetingWhereInput | Prisma.MeetingWhereInput[];
    OR?: Prisma.MeetingWhereInput[];
    NOT?: Prisma.MeetingWhereInput | Prisma.MeetingWhereInput[];
    customerDate?: Prisma.StringFilter<"Meeting"> | string;
    customerTime?: Prisma.StringFilter<"Meeting"> | string;
    customerTimezone?: Prisma.StringFilter<"Meeting"> | string;
    agentDate?: Prisma.StringNullableFilter<"Meeting"> | string | null;
    agentTime?: Prisma.StringNullableFilter<"Meeting"> | string | null;
    agentTimezone?: Prisma.StringNullableFilter<"Meeting"> | string | null;
    customerId?: Prisma.StringFilter<"Meeting"> | string;
    agentId?: Prisma.StringNullableFilter<"Meeting"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"Meeting"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Meeting"> | Date | string;
    customer?: Prisma.XOR<Prisma.CustomerScalarRelationFilter, Prisma.CustomerWhereInput>;
    agent?: Prisma.XOR<Prisma.UserNullableScalarRelationFilter, Prisma.UserWhereInput> | null;
}, "id">;
export type MeetingOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    customerDate?: Prisma.SortOrder;
    customerTime?: Prisma.SortOrder;
    customerTimezone?: Prisma.SortOrder;
    agentDate?: Prisma.SortOrderInput | Prisma.SortOrder;
    agentTime?: Prisma.SortOrderInput | Prisma.SortOrder;
    agentTimezone?: Prisma.SortOrderInput | Prisma.SortOrder;
    customerId?: Prisma.SortOrder;
    agentId?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.MeetingCountOrderByAggregateInput;
    _max?: Prisma.MeetingMaxOrderByAggregateInput;
    _min?: Prisma.MeetingMinOrderByAggregateInput;
};
export type MeetingScalarWhereWithAggregatesInput = {
    AND?: Prisma.MeetingScalarWhereWithAggregatesInput | Prisma.MeetingScalarWhereWithAggregatesInput[];
    OR?: Prisma.MeetingScalarWhereWithAggregatesInput[];
    NOT?: Prisma.MeetingScalarWhereWithAggregatesInput | Prisma.MeetingScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"Meeting"> | string;
    customerDate?: Prisma.StringWithAggregatesFilter<"Meeting"> | string;
    customerTime?: Prisma.StringWithAggregatesFilter<"Meeting"> | string;
    customerTimezone?: Prisma.StringWithAggregatesFilter<"Meeting"> | string;
    agentDate?: Prisma.StringNullableWithAggregatesFilter<"Meeting"> | string | null;
    agentTime?: Prisma.StringNullableWithAggregatesFilter<"Meeting"> | string | null;
    agentTimezone?: Prisma.StringNullableWithAggregatesFilter<"Meeting"> | string | null;
    customerId?: Prisma.StringWithAggregatesFilter<"Meeting"> | string;
    agentId?: Prisma.StringNullableWithAggregatesFilter<"Meeting"> | string | null;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Meeting"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"Meeting"> | Date | string;
};
export type MeetingCreateInput = {
    id?: string;
    customerDate: string;
    customerTime: string;
    customerTimezone: string;
    agentDate?: string | null;
    agentTime?: string | null;
    agentTimezone?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    customer: Prisma.CustomerCreateNestedOneWithoutMeetingsInput;
    agent?: Prisma.UserCreateNestedOneWithoutMeetingsInput;
};
export type MeetingUncheckedCreateInput = {
    id?: string;
    customerDate: string;
    customerTime: string;
    customerTimezone: string;
    agentDate?: string | null;
    agentTime?: string | null;
    agentTimezone?: string | null;
    customerId: string;
    agentId?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type MeetingUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    customerDate?: Prisma.StringFieldUpdateOperationsInput | string;
    customerTime?: Prisma.StringFieldUpdateOperationsInput | string;
    customerTimezone?: Prisma.StringFieldUpdateOperationsInput | string;
    agentDate?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    agentTime?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    agentTimezone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    customer?: Prisma.CustomerUpdateOneRequiredWithoutMeetingsNestedInput;
    agent?: Prisma.UserUpdateOneWithoutMeetingsNestedInput;
};
export type MeetingUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    customerDate?: Prisma.StringFieldUpdateOperationsInput | string;
    customerTime?: Prisma.StringFieldUpdateOperationsInput | string;
    customerTimezone?: Prisma.StringFieldUpdateOperationsInput | string;
    agentDate?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    agentTime?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    agentTimezone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    customerId?: Prisma.StringFieldUpdateOperationsInput | string;
    agentId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type MeetingCreateManyInput = {
    id?: string;
    customerDate: string;
    customerTime: string;
    customerTimezone: string;
    agentDate?: string | null;
    agentTime?: string | null;
    agentTimezone?: string | null;
    customerId: string;
    agentId?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type MeetingUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    customerDate?: Prisma.StringFieldUpdateOperationsInput | string;
    customerTime?: Prisma.StringFieldUpdateOperationsInput | string;
    customerTimezone?: Prisma.StringFieldUpdateOperationsInput | string;
    agentDate?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    agentTime?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    agentTimezone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type MeetingUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    customerDate?: Prisma.StringFieldUpdateOperationsInput | string;
    customerTime?: Prisma.StringFieldUpdateOperationsInput | string;
    customerTimezone?: Prisma.StringFieldUpdateOperationsInput | string;
    agentDate?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    agentTime?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    agentTimezone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    customerId?: Prisma.StringFieldUpdateOperationsInput | string;
    agentId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type MeetingListRelationFilter = {
    every?: Prisma.MeetingWhereInput;
    some?: Prisma.MeetingWhereInput;
    none?: Prisma.MeetingWhereInput;
};
export type MeetingOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type MeetingCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    customerDate?: Prisma.SortOrder;
    customerTime?: Prisma.SortOrder;
    customerTimezone?: Prisma.SortOrder;
    agentDate?: Prisma.SortOrder;
    agentTime?: Prisma.SortOrder;
    agentTimezone?: Prisma.SortOrder;
    customerId?: Prisma.SortOrder;
    agentId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type MeetingMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    customerDate?: Prisma.SortOrder;
    customerTime?: Prisma.SortOrder;
    customerTimezone?: Prisma.SortOrder;
    agentDate?: Prisma.SortOrder;
    agentTime?: Prisma.SortOrder;
    agentTimezone?: Prisma.SortOrder;
    customerId?: Prisma.SortOrder;
    agentId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type MeetingMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    customerDate?: Prisma.SortOrder;
    customerTime?: Prisma.SortOrder;
    customerTimezone?: Prisma.SortOrder;
    agentDate?: Prisma.SortOrder;
    agentTime?: Prisma.SortOrder;
    agentTimezone?: Prisma.SortOrder;
    customerId?: Prisma.SortOrder;
    agentId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type MeetingCreateNestedManyWithoutCustomerInput = {
    create?: Prisma.XOR<Prisma.MeetingCreateWithoutCustomerInput, Prisma.MeetingUncheckedCreateWithoutCustomerInput> | Prisma.MeetingCreateWithoutCustomerInput[] | Prisma.MeetingUncheckedCreateWithoutCustomerInput[];
    connectOrCreate?: Prisma.MeetingCreateOrConnectWithoutCustomerInput | Prisma.MeetingCreateOrConnectWithoutCustomerInput[];
    createMany?: Prisma.MeetingCreateManyCustomerInputEnvelope;
    connect?: Prisma.MeetingWhereUniqueInput | Prisma.MeetingWhereUniqueInput[];
};
export type MeetingUncheckedCreateNestedManyWithoutCustomerInput = {
    create?: Prisma.XOR<Prisma.MeetingCreateWithoutCustomerInput, Prisma.MeetingUncheckedCreateWithoutCustomerInput> | Prisma.MeetingCreateWithoutCustomerInput[] | Prisma.MeetingUncheckedCreateWithoutCustomerInput[];
    connectOrCreate?: Prisma.MeetingCreateOrConnectWithoutCustomerInput | Prisma.MeetingCreateOrConnectWithoutCustomerInput[];
    createMany?: Prisma.MeetingCreateManyCustomerInputEnvelope;
    connect?: Prisma.MeetingWhereUniqueInput | Prisma.MeetingWhereUniqueInput[];
};
export type MeetingUpdateManyWithoutCustomerNestedInput = {
    create?: Prisma.XOR<Prisma.MeetingCreateWithoutCustomerInput, Prisma.MeetingUncheckedCreateWithoutCustomerInput> | Prisma.MeetingCreateWithoutCustomerInput[] | Prisma.MeetingUncheckedCreateWithoutCustomerInput[];
    connectOrCreate?: Prisma.MeetingCreateOrConnectWithoutCustomerInput | Prisma.MeetingCreateOrConnectWithoutCustomerInput[];
    upsert?: Prisma.MeetingUpsertWithWhereUniqueWithoutCustomerInput | Prisma.MeetingUpsertWithWhereUniqueWithoutCustomerInput[];
    createMany?: Prisma.MeetingCreateManyCustomerInputEnvelope;
    set?: Prisma.MeetingWhereUniqueInput | Prisma.MeetingWhereUniqueInput[];
    disconnect?: Prisma.MeetingWhereUniqueInput | Prisma.MeetingWhereUniqueInput[];
    delete?: Prisma.MeetingWhereUniqueInput | Prisma.MeetingWhereUniqueInput[];
    connect?: Prisma.MeetingWhereUniqueInput | Prisma.MeetingWhereUniqueInput[];
    update?: Prisma.MeetingUpdateWithWhereUniqueWithoutCustomerInput | Prisma.MeetingUpdateWithWhereUniqueWithoutCustomerInput[];
    updateMany?: Prisma.MeetingUpdateManyWithWhereWithoutCustomerInput | Prisma.MeetingUpdateManyWithWhereWithoutCustomerInput[];
    deleteMany?: Prisma.MeetingScalarWhereInput | Prisma.MeetingScalarWhereInput[];
};
export type MeetingUncheckedUpdateManyWithoutCustomerNestedInput = {
    create?: Prisma.XOR<Prisma.MeetingCreateWithoutCustomerInput, Prisma.MeetingUncheckedCreateWithoutCustomerInput> | Prisma.MeetingCreateWithoutCustomerInput[] | Prisma.MeetingUncheckedCreateWithoutCustomerInput[];
    connectOrCreate?: Prisma.MeetingCreateOrConnectWithoutCustomerInput | Prisma.MeetingCreateOrConnectWithoutCustomerInput[];
    upsert?: Prisma.MeetingUpsertWithWhereUniqueWithoutCustomerInput | Prisma.MeetingUpsertWithWhereUniqueWithoutCustomerInput[];
    createMany?: Prisma.MeetingCreateManyCustomerInputEnvelope;
    set?: Prisma.MeetingWhereUniqueInput | Prisma.MeetingWhereUniqueInput[];
    disconnect?: Prisma.MeetingWhereUniqueInput | Prisma.MeetingWhereUniqueInput[];
    delete?: Prisma.MeetingWhereUniqueInput | Prisma.MeetingWhereUniqueInput[];
    connect?: Prisma.MeetingWhereUniqueInput | Prisma.MeetingWhereUniqueInput[];
    update?: Prisma.MeetingUpdateWithWhereUniqueWithoutCustomerInput | Prisma.MeetingUpdateWithWhereUniqueWithoutCustomerInput[];
    updateMany?: Prisma.MeetingUpdateManyWithWhereWithoutCustomerInput | Prisma.MeetingUpdateManyWithWhereWithoutCustomerInput[];
    deleteMany?: Prisma.MeetingScalarWhereInput | Prisma.MeetingScalarWhereInput[];
};
export type MeetingCreateNestedManyWithoutAgentInput = {
    create?: Prisma.XOR<Prisma.MeetingCreateWithoutAgentInput, Prisma.MeetingUncheckedCreateWithoutAgentInput> | Prisma.MeetingCreateWithoutAgentInput[] | Prisma.MeetingUncheckedCreateWithoutAgentInput[];
    connectOrCreate?: Prisma.MeetingCreateOrConnectWithoutAgentInput | Prisma.MeetingCreateOrConnectWithoutAgentInput[];
    createMany?: Prisma.MeetingCreateManyAgentInputEnvelope;
    connect?: Prisma.MeetingWhereUniqueInput | Prisma.MeetingWhereUniqueInput[];
};
export type MeetingUncheckedCreateNestedManyWithoutAgentInput = {
    create?: Prisma.XOR<Prisma.MeetingCreateWithoutAgentInput, Prisma.MeetingUncheckedCreateWithoutAgentInput> | Prisma.MeetingCreateWithoutAgentInput[] | Prisma.MeetingUncheckedCreateWithoutAgentInput[];
    connectOrCreate?: Prisma.MeetingCreateOrConnectWithoutAgentInput | Prisma.MeetingCreateOrConnectWithoutAgentInput[];
    createMany?: Prisma.MeetingCreateManyAgentInputEnvelope;
    connect?: Prisma.MeetingWhereUniqueInput | Prisma.MeetingWhereUniqueInput[];
};
export type MeetingUpdateManyWithoutAgentNestedInput = {
    create?: Prisma.XOR<Prisma.MeetingCreateWithoutAgentInput, Prisma.MeetingUncheckedCreateWithoutAgentInput> | Prisma.MeetingCreateWithoutAgentInput[] | Prisma.MeetingUncheckedCreateWithoutAgentInput[];
    connectOrCreate?: Prisma.MeetingCreateOrConnectWithoutAgentInput | Prisma.MeetingCreateOrConnectWithoutAgentInput[];
    upsert?: Prisma.MeetingUpsertWithWhereUniqueWithoutAgentInput | Prisma.MeetingUpsertWithWhereUniqueWithoutAgentInput[];
    createMany?: Prisma.MeetingCreateManyAgentInputEnvelope;
    set?: Prisma.MeetingWhereUniqueInput | Prisma.MeetingWhereUniqueInput[];
    disconnect?: Prisma.MeetingWhereUniqueInput | Prisma.MeetingWhereUniqueInput[];
    delete?: Prisma.MeetingWhereUniqueInput | Prisma.MeetingWhereUniqueInput[];
    connect?: Prisma.MeetingWhereUniqueInput | Prisma.MeetingWhereUniqueInput[];
    update?: Prisma.MeetingUpdateWithWhereUniqueWithoutAgentInput | Prisma.MeetingUpdateWithWhereUniqueWithoutAgentInput[];
    updateMany?: Prisma.MeetingUpdateManyWithWhereWithoutAgentInput | Prisma.MeetingUpdateManyWithWhereWithoutAgentInput[];
    deleteMany?: Prisma.MeetingScalarWhereInput | Prisma.MeetingScalarWhereInput[];
};
export type MeetingUncheckedUpdateManyWithoutAgentNestedInput = {
    create?: Prisma.XOR<Prisma.MeetingCreateWithoutAgentInput, Prisma.MeetingUncheckedCreateWithoutAgentInput> | Prisma.MeetingCreateWithoutAgentInput[] | Prisma.MeetingUncheckedCreateWithoutAgentInput[];
    connectOrCreate?: Prisma.MeetingCreateOrConnectWithoutAgentInput | Prisma.MeetingCreateOrConnectWithoutAgentInput[];
    upsert?: Prisma.MeetingUpsertWithWhereUniqueWithoutAgentInput | Prisma.MeetingUpsertWithWhereUniqueWithoutAgentInput[];
    createMany?: Prisma.MeetingCreateManyAgentInputEnvelope;
    set?: Prisma.MeetingWhereUniqueInput | Prisma.MeetingWhereUniqueInput[];
    disconnect?: Prisma.MeetingWhereUniqueInput | Prisma.MeetingWhereUniqueInput[];
    delete?: Prisma.MeetingWhereUniqueInput | Prisma.MeetingWhereUniqueInput[];
    connect?: Prisma.MeetingWhereUniqueInput | Prisma.MeetingWhereUniqueInput[];
    update?: Prisma.MeetingUpdateWithWhereUniqueWithoutAgentInput | Prisma.MeetingUpdateWithWhereUniqueWithoutAgentInput[];
    updateMany?: Prisma.MeetingUpdateManyWithWhereWithoutAgentInput | Prisma.MeetingUpdateManyWithWhereWithoutAgentInput[];
    deleteMany?: Prisma.MeetingScalarWhereInput | Prisma.MeetingScalarWhereInput[];
};
export type MeetingCreateWithoutCustomerInput = {
    id?: string;
    customerDate: string;
    customerTime: string;
    customerTimezone: string;
    agentDate?: string | null;
    agentTime?: string | null;
    agentTimezone?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    agent?: Prisma.UserCreateNestedOneWithoutMeetingsInput;
};
export type MeetingUncheckedCreateWithoutCustomerInput = {
    id?: string;
    customerDate: string;
    customerTime: string;
    customerTimezone: string;
    agentDate?: string | null;
    agentTime?: string | null;
    agentTimezone?: string | null;
    agentId?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type MeetingCreateOrConnectWithoutCustomerInput = {
    where: Prisma.MeetingWhereUniqueInput;
    create: Prisma.XOR<Prisma.MeetingCreateWithoutCustomerInput, Prisma.MeetingUncheckedCreateWithoutCustomerInput>;
};
export type MeetingCreateManyCustomerInputEnvelope = {
    data: Prisma.MeetingCreateManyCustomerInput | Prisma.MeetingCreateManyCustomerInput[];
    skipDuplicates?: boolean;
};
export type MeetingUpsertWithWhereUniqueWithoutCustomerInput = {
    where: Prisma.MeetingWhereUniqueInput;
    update: Prisma.XOR<Prisma.MeetingUpdateWithoutCustomerInput, Prisma.MeetingUncheckedUpdateWithoutCustomerInput>;
    create: Prisma.XOR<Prisma.MeetingCreateWithoutCustomerInput, Prisma.MeetingUncheckedCreateWithoutCustomerInput>;
};
export type MeetingUpdateWithWhereUniqueWithoutCustomerInput = {
    where: Prisma.MeetingWhereUniqueInput;
    data: Prisma.XOR<Prisma.MeetingUpdateWithoutCustomerInput, Prisma.MeetingUncheckedUpdateWithoutCustomerInput>;
};
export type MeetingUpdateManyWithWhereWithoutCustomerInput = {
    where: Prisma.MeetingScalarWhereInput;
    data: Prisma.XOR<Prisma.MeetingUpdateManyMutationInput, Prisma.MeetingUncheckedUpdateManyWithoutCustomerInput>;
};
export type MeetingScalarWhereInput = {
    AND?: Prisma.MeetingScalarWhereInput | Prisma.MeetingScalarWhereInput[];
    OR?: Prisma.MeetingScalarWhereInput[];
    NOT?: Prisma.MeetingScalarWhereInput | Prisma.MeetingScalarWhereInput[];
    id?: Prisma.StringFilter<"Meeting"> | string;
    customerDate?: Prisma.StringFilter<"Meeting"> | string;
    customerTime?: Prisma.StringFilter<"Meeting"> | string;
    customerTimezone?: Prisma.StringFilter<"Meeting"> | string;
    agentDate?: Prisma.StringNullableFilter<"Meeting"> | string | null;
    agentTime?: Prisma.StringNullableFilter<"Meeting"> | string | null;
    agentTimezone?: Prisma.StringNullableFilter<"Meeting"> | string | null;
    customerId?: Prisma.StringFilter<"Meeting"> | string;
    agentId?: Prisma.StringNullableFilter<"Meeting"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"Meeting"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Meeting"> | Date | string;
};
export type MeetingCreateWithoutAgentInput = {
    id?: string;
    customerDate: string;
    customerTime: string;
    customerTimezone: string;
    agentDate?: string | null;
    agentTime?: string | null;
    agentTimezone?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    customer: Prisma.CustomerCreateNestedOneWithoutMeetingsInput;
};
export type MeetingUncheckedCreateWithoutAgentInput = {
    id?: string;
    customerDate: string;
    customerTime: string;
    customerTimezone: string;
    agentDate?: string | null;
    agentTime?: string | null;
    agentTimezone?: string | null;
    customerId: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type MeetingCreateOrConnectWithoutAgentInput = {
    where: Prisma.MeetingWhereUniqueInput;
    create: Prisma.XOR<Prisma.MeetingCreateWithoutAgentInput, Prisma.MeetingUncheckedCreateWithoutAgentInput>;
};
export type MeetingCreateManyAgentInputEnvelope = {
    data: Prisma.MeetingCreateManyAgentInput | Prisma.MeetingCreateManyAgentInput[];
    skipDuplicates?: boolean;
};
export type MeetingUpsertWithWhereUniqueWithoutAgentInput = {
    where: Prisma.MeetingWhereUniqueInput;
    update: Prisma.XOR<Prisma.MeetingUpdateWithoutAgentInput, Prisma.MeetingUncheckedUpdateWithoutAgentInput>;
    create: Prisma.XOR<Prisma.MeetingCreateWithoutAgentInput, Prisma.MeetingUncheckedCreateWithoutAgentInput>;
};
export type MeetingUpdateWithWhereUniqueWithoutAgentInput = {
    where: Prisma.MeetingWhereUniqueInput;
    data: Prisma.XOR<Prisma.MeetingUpdateWithoutAgentInput, Prisma.MeetingUncheckedUpdateWithoutAgentInput>;
};
export type MeetingUpdateManyWithWhereWithoutAgentInput = {
    where: Prisma.MeetingScalarWhereInput;
    data: Prisma.XOR<Prisma.MeetingUpdateManyMutationInput, Prisma.MeetingUncheckedUpdateManyWithoutAgentInput>;
};
export type MeetingCreateManyCustomerInput = {
    id?: string;
    customerDate: string;
    customerTime: string;
    customerTimezone: string;
    agentDate?: string | null;
    agentTime?: string | null;
    agentTimezone?: string | null;
    agentId?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type MeetingUpdateWithoutCustomerInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    customerDate?: Prisma.StringFieldUpdateOperationsInput | string;
    customerTime?: Prisma.StringFieldUpdateOperationsInput | string;
    customerTimezone?: Prisma.StringFieldUpdateOperationsInput | string;
    agentDate?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    agentTime?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    agentTimezone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    agent?: Prisma.UserUpdateOneWithoutMeetingsNestedInput;
};
export type MeetingUncheckedUpdateWithoutCustomerInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    customerDate?: Prisma.StringFieldUpdateOperationsInput | string;
    customerTime?: Prisma.StringFieldUpdateOperationsInput | string;
    customerTimezone?: Prisma.StringFieldUpdateOperationsInput | string;
    agentDate?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    agentTime?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    agentTimezone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    agentId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type MeetingUncheckedUpdateManyWithoutCustomerInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    customerDate?: Prisma.StringFieldUpdateOperationsInput | string;
    customerTime?: Prisma.StringFieldUpdateOperationsInput | string;
    customerTimezone?: Prisma.StringFieldUpdateOperationsInput | string;
    agentDate?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    agentTime?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    agentTimezone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    agentId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type MeetingCreateManyAgentInput = {
    id?: string;
    customerDate: string;
    customerTime: string;
    customerTimezone: string;
    agentDate?: string | null;
    agentTime?: string | null;
    agentTimezone?: string | null;
    customerId: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type MeetingUpdateWithoutAgentInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    customerDate?: Prisma.StringFieldUpdateOperationsInput | string;
    customerTime?: Prisma.StringFieldUpdateOperationsInput | string;
    customerTimezone?: Prisma.StringFieldUpdateOperationsInput | string;
    agentDate?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    agentTime?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    agentTimezone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    customer?: Prisma.CustomerUpdateOneRequiredWithoutMeetingsNestedInput;
};
export type MeetingUncheckedUpdateWithoutAgentInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    customerDate?: Prisma.StringFieldUpdateOperationsInput | string;
    customerTime?: Prisma.StringFieldUpdateOperationsInput | string;
    customerTimezone?: Prisma.StringFieldUpdateOperationsInput | string;
    agentDate?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    agentTime?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    agentTimezone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    customerId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type MeetingUncheckedUpdateManyWithoutAgentInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    customerDate?: Prisma.StringFieldUpdateOperationsInput | string;
    customerTime?: Prisma.StringFieldUpdateOperationsInput | string;
    customerTimezone?: Prisma.StringFieldUpdateOperationsInput | string;
    agentDate?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    agentTime?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    agentTimezone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    customerId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type MeetingSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    customerDate?: boolean;
    customerTime?: boolean;
    customerTimezone?: boolean;
    agentDate?: boolean;
    agentTime?: boolean;
    agentTimezone?: boolean;
    customerId?: boolean;
    agentId?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    customer?: boolean | Prisma.CustomerDefaultArgs<ExtArgs>;
    agent?: boolean | Prisma.Meeting$agentArgs<ExtArgs>;
}, ExtArgs["result"]["meeting"]>;
export type MeetingSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    customerDate?: boolean;
    customerTime?: boolean;
    customerTimezone?: boolean;
    agentDate?: boolean;
    agentTime?: boolean;
    agentTimezone?: boolean;
    customerId?: boolean;
    agentId?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    customer?: boolean | Prisma.CustomerDefaultArgs<ExtArgs>;
    agent?: boolean | Prisma.Meeting$agentArgs<ExtArgs>;
}, ExtArgs["result"]["meeting"]>;
export type MeetingSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    customerDate?: boolean;
    customerTime?: boolean;
    customerTimezone?: boolean;
    agentDate?: boolean;
    agentTime?: boolean;
    agentTimezone?: boolean;
    customerId?: boolean;
    agentId?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    customer?: boolean | Prisma.CustomerDefaultArgs<ExtArgs>;
    agent?: boolean | Prisma.Meeting$agentArgs<ExtArgs>;
}, ExtArgs["result"]["meeting"]>;
export type MeetingSelectScalar = {
    id?: boolean;
    customerDate?: boolean;
    customerTime?: boolean;
    customerTimezone?: boolean;
    agentDate?: boolean;
    agentTime?: boolean;
    agentTimezone?: boolean;
    customerId?: boolean;
    agentId?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type MeetingOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "customerDate" | "customerTime" | "customerTimezone" | "agentDate" | "agentTime" | "agentTimezone" | "customerId" | "agentId" | "createdAt" | "updatedAt", ExtArgs["result"]["meeting"]>;
export type MeetingInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    customer?: boolean | Prisma.CustomerDefaultArgs<ExtArgs>;
    agent?: boolean | Prisma.Meeting$agentArgs<ExtArgs>;
};
export type MeetingIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    customer?: boolean | Prisma.CustomerDefaultArgs<ExtArgs>;
    agent?: boolean | Prisma.Meeting$agentArgs<ExtArgs>;
};
export type MeetingIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    customer?: boolean | Prisma.CustomerDefaultArgs<ExtArgs>;
    agent?: boolean | Prisma.Meeting$agentArgs<ExtArgs>;
};
export type $MeetingPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Meeting";
    objects: {
        customer: Prisma.$CustomerPayload<ExtArgs>;
        agent: Prisma.$UserPayload<ExtArgs> | null;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        customerDate: string;
        customerTime: string;
        customerTimezone: string;
        agentDate: string | null;
        agentTime: string | null;
        agentTimezone: string | null;
        customerId: string;
        agentId: string | null;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["meeting"]>;
    composites: {};
};
export type MeetingGetPayload<S extends boolean | null | undefined | MeetingDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$MeetingPayload, S>;
export type MeetingCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<MeetingFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: MeetingCountAggregateInputType | true;
};
export interface MeetingDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Meeting'];
        meta: {
            name: 'Meeting';
        };
    };
    findUnique<T extends MeetingFindUniqueArgs>(args: Prisma.SelectSubset<T, MeetingFindUniqueArgs<ExtArgs>>): Prisma.Prisma__MeetingClient<runtime.Types.Result.GetResult<Prisma.$MeetingPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends MeetingFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, MeetingFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__MeetingClient<runtime.Types.Result.GetResult<Prisma.$MeetingPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends MeetingFindFirstArgs>(args?: Prisma.SelectSubset<T, MeetingFindFirstArgs<ExtArgs>>): Prisma.Prisma__MeetingClient<runtime.Types.Result.GetResult<Prisma.$MeetingPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends MeetingFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, MeetingFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__MeetingClient<runtime.Types.Result.GetResult<Prisma.$MeetingPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends MeetingFindManyArgs>(args?: Prisma.SelectSubset<T, MeetingFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$MeetingPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends MeetingCreateArgs>(args: Prisma.SelectSubset<T, MeetingCreateArgs<ExtArgs>>): Prisma.Prisma__MeetingClient<runtime.Types.Result.GetResult<Prisma.$MeetingPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends MeetingCreateManyArgs>(args?: Prisma.SelectSubset<T, MeetingCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends MeetingCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, MeetingCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$MeetingPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends MeetingDeleteArgs>(args: Prisma.SelectSubset<T, MeetingDeleteArgs<ExtArgs>>): Prisma.Prisma__MeetingClient<runtime.Types.Result.GetResult<Prisma.$MeetingPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends MeetingUpdateArgs>(args: Prisma.SelectSubset<T, MeetingUpdateArgs<ExtArgs>>): Prisma.Prisma__MeetingClient<runtime.Types.Result.GetResult<Prisma.$MeetingPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends MeetingDeleteManyArgs>(args?: Prisma.SelectSubset<T, MeetingDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends MeetingUpdateManyArgs>(args: Prisma.SelectSubset<T, MeetingUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends MeetingUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, MeetingUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$MeetingPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends MeetingUpsertArgs>(args: Prisma.SelectSubset<T, MeetingUpsertArgs<ExtArgs>>): Prisma.Prisma__MeetingClient<runtime.Types.Result.GetResult<Prisma.$MeetingPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends MeetingCountArgs>(args?: Prisma.Subset<T, MeetingCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], MeetingCountAggregateOutputType> : number>;
    aggregate<T extends MeetingAggregateArgs>(args: Prisma.Subset<T, MeetingAggregateArgs>): Prisma.PrismaPromise<GetMeetingAggregateType<T>>;
    groupBy<T extends MeetingGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: MeetingGroupByArgs['orderBy'];
    } : {
        orderBy?: MeetingGroupByArgs['orderBy'];
    }, OrderFields extends Prisma.ExcludeUnderscoreKeys<Prisma.Keys<Prisma.MaybeTupleToUnion<T['orderBy']>>>, ByFields extends Prisma.MaybeTupleToUnion<T['by']>, ByValid extends Prisma.Has<ByFields, OrderFields>, HavingFields extends Prisma.GetHavingFields<T['having']>, HavingValid extends Prisma.Has<ByFields, HavingFields>, ByEmpty extends T['by'] extends never[] ? Prisma.True : Prisma.False, InputErrors extends ByEmpty extends Prisma.True ? `Error: "by" must not be empty.` : HavingValid extends Prisma.False ? {
        [P in HavingFields]: P extends ByFields ? never : P extends string ? `Error: Field "${P}" used in "having" needs to be provided in "by".` : [
            Error,
            'Field ',
            P,
            ` in "having" needs to be provided in "by"`
        ];
    }[HavingFields] : 'take' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "take", you also need to provide "orderBy"' : 'skip' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "skip", you also need to provide "orderBy"' : ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, MeetingGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMeetingGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: MeetingFieldRefs;
}
export interface Prisma__MeetingClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    customer<T extends Prisma.CustomerDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.CustomerDefaultArgs<ExtArgs>>): Prisma.Prisma__CustomerClient<runtime.Types.Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    agent<T extends Prisma.Meeting$agentArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Meeting$agentArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface MeetingFieldRefs {
    readonly id: Prisma.FieldRef<"Meeting", 'String'>;
    readonly customerDate: Prisma.FieldRef<"Meeting", 'String'>;
    readonly customerTime: Prisma.FieldRef<"Meeting", 'String'>;
    readonly customerTimezone: Prisma.FieldRef<"Meeting", 'String'>;
    readonly agentDate: Prisma.FieldRef<"Meeting", 'String'>;
    readonly agentTime: Prisma.FieldRef<"Meeting", 'String'>;
    readonly agentTimezone: Prisma.FieldRef<"Meeting", 'String'>;
    readonly customerId: Prisma.FieldRef<"Meeting", 'String'>;
    readonly agentId: Prisma.FieldRef<"Meeting", 'String'>;
    readonly createdAt: Prisma.FieldRef<"Meeting", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"Meeting", 'DateTime'>;
}
export type MeetingFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MeetingSelect<ExtArgs> | null;
    omit?: Prisma.MeetingOmit<ExtArgs> | null;
    include?: Prisma.MeetingInclude<ExtArgs> | null;
    where: Prisma.MeetingWhereUniqueInput;
};
export type MeetingFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MeetingSelect<ExtArgs> | null;
    omit?: Prisma.MeetingOmit<ExtArgs> | null;
    include?: Prisma.MeetingInclude<ExtArgs> | null;
    where: Prisma.MeetingWhereUniqueInput;
};
export type MeetingFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MeetingSelect<ExtArgs> | null;
    omit?: Prisma.MeetingOmit<ExtArgs> | null;
    include?: Prisma.MeetingInclude<ExtArgs> | null;
    where?: Prisma.MeetingWhereInput;
    orderBy?: Prisma.MeetingOrderByWithRelationInput | Prisma.MeetingOrderByWithRelationInput[];
    cursor?: Prisma.MeetingWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.MeetingScalarFieldEnum | Prisma.MeetingScalarFieldEnum[];
};
export type MeetingFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MeetingSelect<ExtArgs> | null;
    omit?: Prisma.MeetingOmit<ExtArgs> | null;
    include?: Prisma.MeetingInclude<ExtArgs> | null;
    where?: Prisma.MeetingWhereInput;
    orderBy?: Prisma.MeetingOrderByWithRelationInput | Prisma.MeetingOrderByWithRelationInput[];
    cursor?: Prisma.MeetingWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.MeetingScalarFieldEnum | Prisma.MeetingScalarFieldEnum[];
};
export type MeetingFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MeetingSelect<ExtArgs> | null;
    omit?: Prisma.MeetingOmit<ExtArgs> | null;
    include?: Prisma.MeetingInclude<ExtArgs> | null;
    where?: Prisma.MeetingWhereInput;
    orderBy?: Prisma.MeetingOrderByWithRelationInput | Prisma.MeetingOrderByWithRelationInput[];
    cursor?: Prisma.MeetingWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.MeetingScalarFieldEnum | Prisma.MeetingScalarFieldEnum[];
};
export type MeetingCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MeetingSelect<ExtArgs> | null;
    omit?: Prisma.MeetingOmit<ExtArgs> | null;
    include?: Prisma.MeetingInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.MeetingCreateInput, Prisma.MeetingUncheckedCreateInput>;
};
export type MeetingCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.MeetingCreateManyInput | Prisma.MeetingCreateManyInput[];
    skipDuplicates?: boolean;
};
export type MeetingCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MeetingSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.MeetingOmit<ExtArgs> | null;
    data: Prisma.MeetingCreateManyInput | Prisma.MeetingCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.MeetingIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type MeetingUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MeetingSelect<ExtArgs> | null;
    omit?: Prisma.MeetingOmit<ExtArgs> | null;
    include?: Prisma.MeetingInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.MeetingUpdateInput, Prisma.MeetingUncheckedUpdateInput>;
    where: Prisma.MeetingWhereUniqueInput;
};
export type MeetingUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.MeetingUpdateManyMutationInput, Prisma.MeetingUncheckedUpdateManyInput>;
    where?: Prisma.MeetingWhereInput;
    limit?: number;
};
export type MeetingUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MeetingSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.MeetingOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.MeetingUpdateManyMutationInput, Prisma.MeetingUncheckedUpdateManyInput>;
    where?: Prisma.MeetingWhereInput;
    limit?: number;
    include?: Prisma.MeetingIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type MeetingUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MeetingSelect<ExtArgs> | null;
    omit?: Prisma.MeetingOmit<ExtArgs> | null;
    include?: Prisma.MeetingInclude<ExtArgs> | null;
    where: Prisma.MeetingWhereUniqueInput;
    create: Prisma.XOR<Prisma.MeetingCreateInput, Prisma.MeetingUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.MeetingUpdateInput, Prisma.MeetingUncheckedUpdateInput>;
};
export type MeetingDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MeetingSelect<ExtArgs> | null;
    omit?: Prisma.MeetingOmit<ExtArgs> | null;
    include?: Prisma.MeetingInclude<ExtArgs> | null;
    where: Prisma.MeetingWhereUniqueInput;
};
export type MeetingDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.MeetingWhereInput;
    limit?: number;
};
export type Meeting$agentArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    where?: Prisma.UserWhereInput;
};
export type MeetingDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MeetingSelect<ExtArgs> | null;
    omit?: Prisma.MeetingOmit<ExtArgs> | null;
    include?: Prisma.MeetingInclude<ExtArgs> | null;
};
export {};
