import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type TranslationModel = runtime.Types.Result.DefaultSelection<Prisma.$TranslationPayload>;
export type AggregateTranslation = {
    _count: TranslationCountAggregateOutputType | null;
    _min: TranslationMinAggregateOutputType | null;
    _max: TranslationMaxAggregateOutputType | null;
};
export type TranslationMinAggregateOutputType = {
    id: string | null;
    code: string | null;
    nativeName: string | null;
    englishName: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type TranslationMaxAggregateOutputType = {
    id: string | null;
    code: string | null;
    nativeName: string | null;
    englishName: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type TranslationCountAggregateOutputType = {
    id: number;
    code: number;
    data: number;
    nativeName: number;
    englishName: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type TranslationMinAggregateInputType = {
    id?: true;
    code?: true;
    nativeName?: true;
    englishName?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type TranslationMaxAggregateInputType = {
    id?: true;
    code?: true;
    nativeName?: true;
    englishName?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type TranslationCountAggregateInputType = {
    id?: true;
    code?: true;
    data?: true;
    nativeName?: true;
    englishName?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type TranslationAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TranslationWhereInput;
    orderBy?: Prisma.TranslationOrderByWithRelationInput | Prisma.TranslationOrderByWithRelationInput[];
    cursor?: Prisma.TranslationWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | TranslationCountAggregateInputType;
    _min?: TranslationMinAggregateInputType;
    _max?: TranslationMaxAggregateInputType;
};
export type GetTranslationAggregateType<T extends TranslationAggregateArgs> = {
    [P in keyof T & keyof AggregateTranslation]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateTranslation[P]> : Prisma.GetScalarType<T[P], AggregateTranslation[P]>;
};
export type TranslationGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TranslationWhereInput;
    orderBy?: Prisma.TranslationOrderByWithAggregationInput | Prisma.TranslationOrderByWithAggregationInput[];
    by: Prisma.TranslationScalarFieldEnum[] | Prisma.TranslationScalarFieldEnum;
    having?: Prisma.TranslationScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: TranslationCountAggregateInputType | true;
    _min?: TranslationMinAggregateInputType;
    _max?: TranslationMaxAggregateInputType;
};
export type TranslationGroupByOutputType = {
    id: string;
    code: string;
    data: runtime.JsonValue;
    nativeName: string | null;
    englishName: string | null;
    createdAt: Date;
    updatedAt: Date;
    _count: TranslationCountAggregateOutputType | null;
    _min: TranslationMinAggregateOutputType | null;
    _max: TranslationMaxAggregateOutputType | null;
};
type GetTranslationGroupByPayload<T extends TranslationGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<TranslationGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof TranslationGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], TranslationGroupByOutputType[P]> : Prisma.GetScalarType<T[P], TranslationGroupByOutputType[P]>;
}>>;
export type TranslationWhereInput = {
    AND?: Prisma.TranslationWhereInput | Prisma.TranslationWhereInput[];
    OR?: Prisma.TranslationWhereInput[];
    NOT?: Prisma.TranslationWhereInput | Prisma.TranslationWhereInput[];
    id?: Prisma.StringFilter<"Translation"> | string;
    code?: Prisma.StringFilter<"Translation"> | string;
    data?: Prisma.JsonFilter<"Translation">;
    nativeName?: Prisma.StringNullableFilter<"Translation"> | string | null;
    englishName?: Prisma.StringNullableFilter<"Translation"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"Translation"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Translation"> | Date | string;
};
export type TranslationOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    code?: Prisma.SortOrder;
    data?: Prisma.SortOrder;
    nativeName?: Prisma.SortOrderInput | Prisma.SortOrder;
    englishName?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type TranslationWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    code?: string;
    AND?: Prisma.TranslationWhereInput | Prisma.TranslationWhereInput[];
    OR?: Prisma.TranslationWhereInput[];
    NOT?: Prisma.TranslationWhereInput | Prisma.TranslationWhereInput[];
    data?: Prisma.JsonFilter<"Translation">;
    nativeName?: Prisma.StringNullableFilter<"Translation"> | string | null;
    englishName?: Prisma.StringNullableFilter<"Translation"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"Translation"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Translation"> | Date | string;
}, "id" | "code">;
export type TranslationOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    code?: Prisma.SortOrder;
    data?: Prisma.SortOrder;
    nativeName?: Prisma.SortOrderInput | Prisma.SortOrder;
    englishName?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.TranslationCountOrderByAggregateInput;
    _max?: Prisma.TranslationMaxOrderByAggregateInput;
    _min?: Prisma.TranslationMinOrderByAggregateInput;
};
export type TranslationScalarWhereWithAggregatesInput = {
    AND?: Prisma.TranslationScalarWhereWithAggregatesInput | Prisma.TranslationScalarWhereWithAggregatesInput[];
    OR?: Prisma.TranslationScalarWhereWithAggregatesInput[];
    NOT?: Prisma.TranslationScalarWhereWithAggregatesInput | Prisma.TranslationScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"Translation"> | string;
    code?: Prisma.StringWithAggregatesFilter<"Translation"> | string;
    data?: Prisma.JsonWithAggregatesFilter<"Translation">;
    nativeName?: Prisma.StringNullableWithAggregatesFilter<"Translation"> | string | null;
    englishName?: Prisma.StringNullableWithAggregatesFilter<"Translation"> | string | null;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Translation"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"Translation"> | Date | string;
};
export type TranslationCreateInput = {
    id?: string;
    code: string;
    data: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    nativeName?: string | null;
    englishName?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type TranslationUncheckedCreateInput = {
    id?: string;
    code: string;
    data: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    nativeName?: string | null;
    englishName?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type TranslationUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    data?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    nativeName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    englishName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type TranslationUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    data?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    nativeName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    englishName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type TranslationCreateManyInput = {
    id?: string;
    code: string;
    data: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    nativeName?: string | null;
    englishName?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type TranslationUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    data?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    nativeName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    englishName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type TranslationUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    data?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    nativeName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    englishName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type TranslationCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    code?: Prisma.SortOrder;
    data?: Prisma.SortOrder;
    nativeName?: Prisma.SortOrder;
    englishName?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type TranslationMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    code?: Prisma.SortOrder;
    nativeName?: Prisma.SortOrder;
    englishName?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type TranslationMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    code?: Prisma.SortOrder;
    nativeName?: Prisma.SortOrder;
    englishName?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type TranslationSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    code?: boolean;
    data?: boolean;
    nativeName?: boolean;
    englishName?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["translation"]>;
export type TranslationSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    code?: boolean;
    data?: boolean;
    nativeName?: boolean;
    englishName?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["translation"]>;
export type TranslationSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    code?: boolean;
    data?: boolean;
    nativeName?: boolean;
    englishName?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["translation"]>;
export type TranslationSelectScalar = {
    id?: boolean;
    code?: boolean;
    data?: boolean;
    nativeName?: boolean;
    englishName?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type TranslationOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "code" | "data" | "nativeName" | "englishName" | "createdAt" | "updatedAt", ExtArgs["result"]["translation"]>;
export type $TranslationPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Translation";
    objects: {};
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        code: string;
        data: runtime.JsonValue;
        nativeName: string | null;
        englishName: string | null;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["translation"]>;
    composites: {};
};
export type TranslationGetPayload<S extends boolean | null | undefined | TranslationDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$TranslationPayload, S>;
export type TranslationCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<TranslationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: TranslationCountAggregateInputType | true;
};
export interface TranslationDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Translation'];
        meta: {
            name: 'Translation';
        };
    };
    findUnique<T extends TranslationFindUniqueArgs>(args: Prisma.SelectSubset<T, TranslationFindUniqueArgs<ExtArgs>>): Prisma.Prisma__TranslationClient<runtime.Types.Result.GetResult<Prisma.$TranslationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends TranslationFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, TranslationFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__TranslationClient<runtime.Types.Result.GetResult<Prisma.$TranslationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends TranslationFindFirstArgs>(args?: Prisma.SelectSubset<T, TranslationFindFirstArgs<ExtArgs>>): Prisma.Prisma__TranslationClient<runtime.Types.Result.GetResult<Prisma.$TranslationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends TranslationFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, TranslationFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__TranslationClient<runtime.Types.Result.GetResult<Prisma.$TranslationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends TranslationFindManyArgs>(args?: Prisma.SelectSubset<T, TranslationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TranslationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends TranslationCreateArgs>(args: Prisma.SelectSubset<T, TranslationCreateArgs<ExtArgs>>): Prisma.Prisma__TranslationClient<runtime.Types.Result.GetResult<Prisma.$TranslationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends TranslationCreateManyArgs>(args?: Prisma.SelectSubset<T, TranslationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends TranslationCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, TranslationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TranslationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends TranslationDeleteArgs>(args: Prisma.SelectSubset<T, TranslationDeleteArgs<ExtArgs>>): Prisma.Prisma__TranslationClient<runtime.Types.Result.GetResult<Prisma.$TranslationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends TranslationUpdateArgs>(args: Prisma.SelectSubset<T, TranslationUpdateArgs<ExtArgs>>): Prisma.Prisma__TranslationClient<runtime.Types.Result.GetResult<Prisma.$TranslationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends TranslationDeleteManyArgs>(args?: Prisma.SelectSubset<T, TranslationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends TranslationUpdateManyArgs>(args: Prisma.SelectSubset<T, TranslationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends TranslationUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, TranslationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TranslationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends TranslationUpsertArgs>(args: Prisma.SelectSubset<T, TranslationUpsertArgs<ExtArgs>>): Prisma.Prisma__TranslationClient<runtime.Types.Result.GetResult<Prisma.$TranslationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends TranslationCountArgs>(args?: Prisma.Subset<T, TranslationCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], TranslationCountAggregateOutputType> : number>;
    aggregate<T extends TranslationAggregateArgs>(args: Prisma.Subset<T, TranslationAggregateArgs>): Prisma.PrismaPromise<GetTranslationAggregateType<T>>;
    groupBy<T extends TranslationGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: TranslationGroupByArgs['orderBy'];
    } : {
        orderBy?: TranslationGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, TranslationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTranslationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: TranslationFieldRefs;
}
export interface Prisma__TranslationClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface TranslationFieldRefs {
    readonly id: Prisma.FieldRef<"Translation", 'String'>;
    readonly code: Prisma.FieldRef<"Translation", 'String'>;
    readonly data: Prisma.FieldRef<"Translation", 'Json'>;
    readonly nativeName: Prisma.FieldRef<"Translation", 'String'>;
    readonly englishName: Prisma.FieldRef<"Translation", 'String'>;
    readonly createdAt: Prisma.FieldRef<"Translation", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"Translation", 'DateTime'>;
}
export type TranslationFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TranslationSelect<ExtArgs> | null;
    omit?: Prisma.TranslationOmit<ExtArgs> | null;
    where: Prisma.TranslationWhereUniqueInput;
};
export type TranslationFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TranslationSelect<ExtArgs> | null;
    omit?: Prisma.TranslationOmit<ExtArgs> | null;
    where: Prisma.TranslationWhereUniqueInput;
};
export type TranslationFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TranslationSelect<ExtArgs> | null;
    omit?: Prisma.TranslationOmit<ExtArgs> | null;
    where?: Prisma.TranslationWhereInput;
    orderBy?: Prisma.TranslationOrderByWithRelationInput | Prisma.TranslationOrderByWithRelationInput[];
    cursor?: Prisma.TranslationWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.TranslationScalarFieldEnum | Prisma.TranslationScalarFieldEnum[];
};
export type TranslationFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TranslationSelect<ExtArgs> | null;
    omit?: Prisma.TranslationOmit<ExtArgs> | null;
    where?: Prisma.TranslationWhereInput;
    orderBy?: Prisma.TranslationOrderByWithRelationInput | Prisma.TranslationOrderByWithRelationInput[];
    cursor?: Prisma.TranslationWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.TranslationScalarFieldEnum | Prisma.TranslationScalarFieldEnum[];
};
export type TranslationFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TranslationSelect<ExtArgs> | null;
    omit?: Prisma.TranslationOmit<ExtArgs> | null;
    where?: Prisma.TranslationWhereInput;
    orderBy?: Prisma.TranslationOrderByWithRelationInput | Prisma.TranslationOrderByWithRelationInput[];
    cursor?: Prisma.TranslationWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.TranslationScalarFieldEnum | Prisma.TranslationScalarFieldEnum[];
};
export type TranslationCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TranslationSelect<ExtArgs> | null;
    omit?: Prisma.TranslationOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.TranslationCreateInput, Prisma.TranslationUncheckedCreateInput>;
};
export type TranslationCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.TranslationCreateManyInput | Prisma.TranslationCreateManyInput[];
    skipDuplicates?: boolean;
};
export type TranslationCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TranslationSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.TranslationOmit<ExtArgs> | null;
    data: Prisma.TranslationCreateManyInput | Prisma.TranslationCreateManyInput[];
    skipDuplicates?: boolean;
};
export type TranslationUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TranslationSelect<ExtArgs> | null;
    omit?: Prisma.TranslationOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.TranslationUpdateInput, Prisma.TranslationUncheckedUpdateInput>;
    where: Prisma.TranslationWhereUniqueInput;
};
export type TranslationUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.TranslationUpdateManyMutationInput, Prisma.TranslationUncheckedUpdateManyInput>;
    where?: Prisma.TranslationWhereInput;
    limit?: number;
};
export type TranslationUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TranslationSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.TranslationOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.TranslationUpdateManyMutationInput, Prisma.TranslationUncheckedUpdateManyInput>;
    where?: Prisma.TranslationWhereInput;
    limit?: number;
};
export type TranslationUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TranslationSelect<ExtArgs> | null;
    omit?: Prisma.TranslationOmit<ExtArgs> | null;
    where: Prisma.TranslationWhereUniqueInput;
    create: Prisma.XOR<Prisma.TranslationCreateInput, Prisma.TranslationUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.TranslationUpdateInput, Prisma.TranslationUncheckedUpdateInput>;
};
export type TranslationDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TranslationSelect<ExtArgs> | null;
    omit?: Prisma.TranslationOmit<ExtArgs> | null;
    where: Prisma.TranslationWhereUniqueInput;
};
export type TranslationDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TranslationWhereInput;
    limit?: number;
};
export type TranslationDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TranslationSelect<ExtArgs> | null;
    omit?: Prisma.TranslationOmit<ExtArgs> | null;
};
export {};
