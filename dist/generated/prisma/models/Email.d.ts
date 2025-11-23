import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type EmailModel = runtime.Types.Result.DefaultSelection<Prisma.$EmailPayload>;
export type AggregateEmail = {
    _count: EmailCountAggregateOutputType | null;
    _min: EmailMinAggregateOutputType | null;
    _max: EmailMaxAggregateOutputType | null;
};
export type EmailMinAggregateOutputType = {
    id: string | null;
    email: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type EmailMaxAggregateOutputType = {
    id: string | null;
    email: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type EmailCountAggregateOutputType = {
    id: number;
    email: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type EmailMinAggregateInputType = {
    id?: true;
    email?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type EmailMaxAggregateInputType = {
    id?: true;
    email?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type EmailCountAggregateInputType = {
    id?: true;
    email?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type EmailAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.EmailWhereInput;
    orderBy?: Prisma.EmailOrderByWithRelationInput | Prisma.EmailOrderByWithRelationInput[];
    cursor?: Prisma.EmailWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | EmailCountAggregateInputType;
    _min?: EmailMinAggregateInputType;
    _max?: EmailMaxAggregateInputType;
};
export type GetEmailAggregateType<T extends EmailAggregateArgs> = {
    [P in keyof T & keyof AggregateEmail]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateEmail[P]> : Prisma.GetScalarType<T[P], AggregateEmail[P]>;
};
export type EmailGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.EmailWhereInput;
    orderBy?: Prisma.EmailOrderByWithAggregationInput | Prisma.EmailOrderByWithAggregationInput[];
    by: Prisma.EmailScalarFieldEnum[] | Prisma.EmailScalarFieldEnum;
    having?: Prisma.EmailScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: EmailCountAggregateInputType | true;
    _min?: EmailMinAggregateInputType;
    _max?: EmailMaxAggregateInputType;
};
export type EmailGroupByOutputType = {
    id: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
    _count: EmailCountAggregateOutputType | null;
    _min: EmailMinAggregateOutputType | null;
    _max: EmailMaxAggregateOutputType | null;
};
type GetEmailGroupByPayload<T extends EmailGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<EmailGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof EmailGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], EmailGroupByOutputType[P]> : Prisma.GetScalarType<T[P], EmailGroupByOutputType[P]>;
}>>;
export type EmailWhereInput = {
    AND?: Prisma.EmailWhereInput | Prisma.EmailWhereInput[];
    OR?: Prisma.EmailWhereInput[];
    NOT?: Prisma.EmailWhereInput | Prisma.EmailWhereInput[];
    id?: Prisma.StringFilter<"Email"> | string;
    email?: Prisma.StringFilter<"Email"> | string;
    createdAt?: Prisma.DateTimeFilter<"Email"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Email"> | Date | string;
};
export type EmailOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type EmailWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.EmailWhereInput | Prisma.EmailWhereInput[];
    OR?: Prisma.EmailWhereInput[];
    NOT?: Prisma.EmailWhereInput | Prisma.EmailWhereInput[];
    email?: Prisma.StringFilter<"Email"> | string;
    createdAt?: Prisma.DateTimeFilter<"Email"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Email"> | Date | string;
}, "id">;
export type EmailOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.EmailCountOrderByAggregateInput;
    _max?: Prisma.EmailMaxOrderByAggregateInput;
    _min?: Prisma.EmailMinOrderByAggregateInput;
};
export type EmailScalarWhereWithAggregatesInput = {
    AND?: Prisma.EmailScalarWhereWithAggregatesInput | Prisma.EmailScalarWhereWithAggregatesInput[];
    OR?: Prisma.EmailScalarWhereWithAggregatesInput[];
    NOT?: Prisma.EmailScalarWhereWithAggregatesInput | Prisma.EmailScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"Email"> | string;
    email?: Prisma.StringWithAggregatesFilter<"Email"> | string;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Email"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"Email"> | Date | string;
};
export type EmailCreateInput = {
    id?: string;
    email: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type EmailUncheckedCreateInput = {
    id?: string;
    email: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type EmailUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type EmailUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type EmailCreateManyInput = {
    id?: string;
    email: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type EmailUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type EmailUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type EmailCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type EmailMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type EmailMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type StringFieldUpdateOperationsInput = {
    set?: string;
};
export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string;
};
export type EmailSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    email?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["email"]>;
export type EmailSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    email?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["email"]>;
export type EmailSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    email?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["email"]>;
export type EmailSelectScalar = {
    id?: boolean;
    email?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type EmailOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "email" | "createdAt" | "updatedAt", ExtArgs["result"]["email"]>;
export type $EmailPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Email";
    objects: {};
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        email: string;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["email"]>;
    composites: {};
};
export type EmailGetPayload<S extends boolean | null | undefined | EmailDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$EmailPayload, S>;
export type EmailCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<EmailFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: EmailCountAggregateInputType | true;
};
export interface EmailDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Email'];
        meta: {
            name: 'Email';
        };
    };
    findUnique<T extends EmailFindUniqueArgs>(args: Prisma.SelectSubset<T, EmailFindUniqueArgs<ExtArgs>>): Prisma.Prisma__EmailClient<runtime.Types.Result.GetResult<Prisma.$EmailPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends EmailFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, EmailFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__EmailClient<runtime.Types.Result.GetResult<Prisma.$EmailPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends EmailFindFirstArgs>(args?: Prisma.SelectSubset<T, EmailFindFirstArgs<ExtArgs>>): Prisma.Prisma__EmailClient<runtime.Types.Result.GetResult<Prisma.$EmailPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends EmailFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, EmailFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__EmailClient<runtime.Types.Result.GetResult<Prisma.$EmailPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends EmailFindManyArgs>(args?: Prisma.SelectSubset<T, EmailFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$EmailPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends EmailCreateArgs>(args: Prisma.SelectSubset<T, EmailCreateArgs<ExtArgs>>): Prisma.Prisma__EmailClient<runtime.Types.Result.GetResult<Prisma.$EmailPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends EmailCreateManyArgs>(args?: Prisma.SelectSubset<T, EmailCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends EmailCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, EmailCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$EmailPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends EmailDeleteArgs>(args: Prisma.SelectSubset<T, EmailDeleteArgs<ExtArgs>>): Prisma.Prisma__EmailClient<runtime.Types.Result.GetResult<Prisma.$EmailPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends EmailUpdateArgs>(args: Prisma.SelectSubset<T, EmailUpdateArgs<ExtArgs>>): Prisma.Prisma__EmailClient<runtime.Types.Result.GetResult<Prisma.$EmailPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends EmailDeleteManyArgs>(args?: Prisma.SelectSubset<T, EmailDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends EmailUpdateManyArgs>(args: Prisma.SelectSubset<T, EmailUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends EmailUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, EmailUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$EmailPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends EmailUpsertArgs>(args: Prisma.SelectSubset<T, EmailUpsertArgs<ExtArgs>>): Prisma.Prisma__EmailClient<runtime.Types.Result.GetResult<Prisma.$EmailPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends EmailCountArgs>(args?: Prisma.Subset<T, EmailCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], EmailCountAggregateOutputType> : number>;
    aggregate<T extends EmailAggregateArgs>(args: Prisma.Subset<T, EmailAggregateArgs>): Prisma.PrismaPromise<GetEmailAggregateType<T>>;
    groupBy<T extends EmailGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: EmailGroupByArgs['orderBy'];
    } : {
        orderBy?: EmailGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, EmailGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEmailGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: EmailFieldRefs;
}
export interface Prisma__EmailClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface EmailFieldRefs {
    readonly id: Prisma.FieldRef<"Email", 'String'>;
    readonly email: Prisma.FieldRef<"Email", 'String'>;
    readonly createdAt: Prisma.FieldRef<"Email", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"Email", 'DateTime'>;
}
export type EmailFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EmailSelect<ExtArgs> | null;
    omit?: Prisma.EmailOmit<ExtArgs> | null;
    where: Prisma.EmailWhereUniqueInput;
};
export type EmailFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EmailSelect<ExtArgs> | null;
    omit?: Prisma.EmailOmit<ExtArgs> | null;
    where: Prisma.EmailWhereUniqueInput;
};
export type EmailFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EmailSelect<ExtArgs> | null;
    omit?: Prisma.EmailOmit<ExtArgs> | null;
    where?: Prisma.EmailWhereInput;
    orderBy?: Prisma.EmailOrderByWithRelationInput | Prisma.EmailOrderByWithRelationInput[];
    cursor?: Prisma.EmailWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.EmailScalarFieldEnum | Prisma.EmailScalarFieldEnum[];
};
export type EmailFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EmailSelect<ExtArgs> | null;
    omit?: Prisma.EmailOmit<ExtArgs> | null;
    where?: Prisma.EmailWhereInput;
    orderBy?: Prisma.EmailOrderByWithRelationInput | Prisma.EmailOrderByWithRelationInput[];
    cursor?: Prisma.EmailWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.EmailScalarFieldEnum | Prisma.EmailScalarFieldEnum[];
};
export type EmailFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EmailSelect<ExtArgs> | null;
    omit?: Prisma.EmailOmit<ExtArgs> | null;
    where?: Prisma.EmailWhereInput;
    orderBy?: Prisma.EmailOrderByWithRelationInput | Prisma.EmailOrderByWithRelationInput[];
    cursor?: Prisma.EmailWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.EmailScalarFieldEnum | Prisma.EmailScalarFieldEnum[];
};
export type EmailCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EmailSelect<ExtArgs> | null;
    omit?: Prisma.EmailOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.EmailCreateInput, Prisma.EmailUncheckedCreateInput>;
};
export type EmailCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.EmailCreateManyInput | Prisma.EmailCreateManyInput[];
    skipDuplicates?: boolean;
};
export type EmailCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EmailSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.EmailOmit<ExtArgs> | null;
    data: Prisma.EmailCreateManyInput | Prisma.EmailCreateManyInput[];
    skipDuplicates?: boolean;
};
export type EmailUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EmailSelect<ExtArgs> | null;
    omit?: Prisma.EmailOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.EmailUpdateInput, Prisma.EmailUncheckedUpdateInput>;
    where: Prisma.EmailWhereUniqueInput;
};
export type EmailUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.EmailUpdateManyMutationInput, Prisma.EmailUncheckedUpdateManyInput>;
    where?: Prisma.EmailWhereInput;
    limit?: number;
};
export type EmailUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EmailSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.EmailOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.EmailUpdateManyMutationInput, Prisma.EmailUncheckedUpdateManyInput>;
    where?: Prisma.EmailWhereInput;
    limit?: number;
};
export type EmailUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EmailSelect<ExtArgs> | null;
    omit?: Prisma.EmailOmit<ExtArgs> | null;
    where: Prisma.EmailWhereUniqueInput;
    create: Prisma.XOR<Prisma.EmailCreateInput, Prisma.EmailUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.EmailUpdateInput, Prisma.EmailUncheckedUpdateInput>;
};
export type EmailDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EmailSelect<ExtArgs> | null;
    omit?: Prisma.EmailOmit<ExtArgs> | null;
    where: Prisma.EmailWhereUniqueInput;
};
export type EmailDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.EmailWhereInput;
    limit?: number;
};
export type EmailDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EmailSelect<ExtArgs> | null;
    omit?: Prisma.EmailOmit<ExtArgs> | null;
};
export {};
