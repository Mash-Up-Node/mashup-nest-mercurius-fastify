import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { SortOrder } from '../prisma/sort-order.enum';
import { SortOrderInput } from '../prisma/sort-order.input';
import { PostCountOrderByAggregateInput } from './post-count-order-by-aggregate.input';
import { PostMaxOrderByAggregateInput } from './post-max-order-by-aggregate.input';
import { PostMinOrderByAggregateInput } from './post-min-order-by-aggregate.input';

@InputType()
export class PostOrderByWithAggregationInput {

    @Field(() => SortOrder, {nullable:true})
    id?: `${SortOrder}`;

    @Field(() => SortOrder, {nullable:true})
    createdAt?: `${SortOrder}`;

    @Field(() => SortOrder, {nullable:true})
    updatedAt?: `${SortOrder}`;

    @Field(() => SortOrder, {nullable:true})
    title?: `${SortOrder}`;

    @Field(() => SortOrderInput, {nullable:true})
    content?: SortOrderInput;

    @Field(() => SortOrder, {nullable:true})
    authorId?: `${SortOrder}`;

    @Field(() => PostCountOrderByAggregateInput, {nullable:true})
    _count?: PostCountOrderByAggregateInput;

    @Field(() => PostMaxOrderByAggregateInput, {nullable:true})
    _max?: PostMaxOrderByAggregateInput;

    @Field(() => PostMinOrderByAggregateInput, {nullable:true})
    _min?: PostMinOrderByAggregateInput;
}
