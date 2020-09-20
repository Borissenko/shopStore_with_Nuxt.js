<template>
  <div>
    <div class="board">
      <div class="menu">
        <h1>Каталог</h1>
        <div class="menu__category">
          <nuxt-link v-for="(category, ind) in GET_PRODUCT_CATEGORY"
                     :key="ind"
                     :to="`/${category.id}`"
                     no-prefetch
                     exact
          >
            {{ category.name }}
          </nuxt-link>
        </div>
      </div>

      <nuxt-child class="product-list"/>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  computed: {
    ...mapGetters([
      'GET_PRODUCT_CATEGORY'
    ])
  }
}
</script>

<style scoped lang="scss">
.board {
  width: 100%;
  display: flex;
  justify-content: left;

  .menu {
    box-sizing: border-box;
    width: rem(248);
    padding-left: rem(88);

    h1 {
      margin-top: rem(32);
    }

    &__category {
      margin-top: rem(24);
      @extend .font_16-bold;

      & :not(:first-child) {
        margin-top: rem(16);
      }

      a {
        display: block;
        text-decoration: none;
        color: $grey-light;

        &:hover {
          color: $grey;
          cursor: pointer;
        }

        &.nuxt-link-active {
          color: $black;
        }
      }
    }
  }

  .product-list {
    width: calc(93.88% - 15.5rem);
  }
}

</style>
