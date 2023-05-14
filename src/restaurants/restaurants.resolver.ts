import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { Restaurant } from './models/restaurant.model';
import { createRestaurantInput } from './dtos/createRestaurant.dto';

@Resolver((of) => Restaurant)
export class RestaurantResolver {
  @Query((returns) => [Restaurant])
  restaurants(@Args('veganOnly') veganOnly: boolean): Restaurant[] {
    return [];
  }

  @Mutation((returns) => Boolean)
  createRestaurant(@Args() createRestaurantInput: createRestaurantInput) {
    console.log(createRestaurantInput);
    return true;
  }
}
