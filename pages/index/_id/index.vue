<template>
  <div>
    <div class="panel">
      <div v-click-outside="onShutSortingPanel"
           class="panel__sorting"
      >
        <div @click="onDropSortingPanel"
             class="panel__sorting-title"
        >
          Сортировать по: <span>{{ trimmedChosenSortingType }}</span>
        </div>

        <div class="panel__sorting-list"
             v-show="isSortingPanelDrop"
        >
          <div v-for="(sortingType, ind) in sortingTypes"
               :key="ind"
               @click="onChooseSortingType(sortingType)"
          >
            {{ sortingType.title }}
          </div>
        </div>
      </div>
    </div>
    <div class="list">
      <product-cart v-for="(item, ind) in GET_PRODUCTS({
                                                                           category: $route.params.id,
                                                                           sortingType: chosenSortingType.type
                                                                          })"
                    :key="'product' + ind"
                    :productId="item.id"
                    :productCategory="item.category"
                    :productName="item.name"
                    :starsCount="item.rating"
                    :productImg="item.photo"
                    :productPrice="item.price"
                    @selectedProduct="throwSelectedProductToStore"
      />
    </div>
  </div>
</template>

<script>
import vClickOutside from 'v-click-outside'
import ProductCart from '@/components/ProductCart'
import {mapGetters, mapActions} from 'vuex'
import {SelectedProduct} from '@/assets/utils/constructors'

export default {
  name: 'index',
  components: {
    ProductCart
  },
  async fetch({store, params}) {
    if(store.state[`products_${params.id}`].length === 0)
      await store.dispatch('FETCH_PRODUCTS', params.id)
  },
  data: () => ({
    isSortingPanelDrop: false,
    chosenSortingType: {
      title: 'По цене',
      type: 'price'
    },
    sortingTypes: [
      {
        title: 'По цене',
        type: 'price'
      },
      {
        title: 'По популярности',
        type: 'rating'
      }
    ]
  }),
  computed: {
    ...mapGetters([
      'GET_PRODUCTS'
    ]),
    trimmedChosenSortingType() {
      return this.chosenSortingType.title.slice(3)
    }
  },
  methods: {
    ...mapActions([
      'PUT_PRODUCT_TO_BASKET'
    ]),
    onDropSortingPanel() {
      this.isSortingPanelDrop = !this.isSortingPanelDrop
    },
    onShutSortingPanel() {
      this.isSortingPanelDrop = false
    },
    onChooseSortingType(type) {
      this.chosenSortingType = type
      this.isSortingPanelDrop = false
    },
    throwSelectedProductToStore({category, id}) {
      let basketedItem = new SelectedProduct(category, id)
      this.PUT_PRODUCT_TO_BASKET(basketedItem)
    }
  },
  directives: {
    clickOutside: vClickOutside.directive
  }
}
</script>

<style scoped lang="scss">
.panel {
  display: flex;
  width: 100%;
  height: rem(68);
  align-items: flex-end;
  justify-content: flex-end;

  &__sorting {
    position: relative;
    width: max-content;
    height: rem(22);

    &-title {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      @extend .font_16;
      color: $black;
      cursor: pointer;

      span {
        margin-left: rem(6);
        color: $grey;
      }

      &::after {
        width: rem(5);
        height: rem(5);
        margin: 1px 0 0 rem(4);
        background: url('/imgs/array_down.jpg') center center no-repeat;
        content: '';
      }
    }

    &-list {
      box-sizing: border-box;
      position: absolute;
      top: calc(100% + 0.375rem);
      right: 0;
      width: rem(180);
      padding: rem(4) 0;
      background: $white;
      @extend .card-bs;

      @extend .font_14;
      color: $grey-light;

      & * {
        box-sizing: border-box;
        width: 100%;
        padding: rem(4) rem(12);
        background-origin: padding-box;
      }
    }

    & * :hover {
      background: $grey-extra-light;
      color: $black;
      cursor: pointer;
    }
  }
}

.list {
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  margin-top: rem(28);

  & * {
    margin-top: rem(16);
  }
}
</style>
