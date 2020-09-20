<template>
  <div>
    <div class="header"
         :class="{'opacity-et-basket': isBasketAppear}"
    >
      <div class="header__logo">
        TestList
      </div>
      <div @click="onBasketAppear"
           class="header__basket"
      >
        <div>
          {{ GET_PRODUCTS_FROM_BASKET.length }}
        </div>
      </div>
    </div>

    <Nuxt :class="{'opacity-et-basket': isBasketAppear}"/>

    <basket v-show="isBasketAppear"
            @shutBasket="shutBasket"
            class="basket"
    />
  </div>
</template>

<script>
import vClickOutside from 'v-click-outside'
import Basket from '@/components/Basket'
import {mapActions, mapMutations, mapGetters} from 'vuex'
import {SelectedProduct} from 'assets/utils/constructors'

export default {
  components: {
    Basket
  },
  data: () => ({
    isBasketAppear: false
  }),
  computed: {
    ...mapGetters([
      'GET_PRODUCTS_FROM_BASKET'
    ])
  },
  methods: {
    ...mapActions([
      'FETCH_PRODUCTS'
    ]),
    ...mapMutations([
      'REBUILD_THE_BASKET_FROM_LOCALSTORAGE'
    ]),
    onBasketAppear() {
      this.isBasketAppear = true
    },
    shutBasket() {
      this.isBasketAppear = false
    }
  },
  directives: {
    clickOutside: vClickOutside.directive
  },
  async created() {
    if(process.env.VUE_ENV === 'client' && (this.GET_PRODUCTS_FROM_BASKET.length === 0)) {  // т.е. при перезагрузке сайта
      let LStorageBasketData = localStorage.getItem('basket')

      //1. восстанавливаем данные корзины
      if(LStorageBasketData != null) {
        let separatedTheLStorageBasketData = LStorageBasketData.split('=')
        let reanimatedBasket = []

        for(let item of separatedTheLStorageBasketData) {
          let arrayItem = item.split(',')
          let objectItem = new SelectedProduct(+arrayItem[0], +arrayItem[1])
          reanimatedBasket.push(objectItem)
        }

        this.REBUILD_THE_BASKET_FROM_LOCALSTORAGE(reanimatedBasket)
      }

      //2. дозагружаем востребованнные корзиной группы продуктов
      let basketedProduct = this.GET_PRODUCTS_FROM_BASKET

      if(basketedProduct.length > 0) {
        let basketedProductCategory = []
        for(let item of basketedProduct) {
          basketedProductCategory.push(item.category)
        }
        basketedProductCategory = [...new Set(basketedProductCategory)]   //устраняем повторы

        for await (let category of basketedProductCategory) {     //загружаем продукты тех категорий, которые были востребованы до перезагрузки сайта.
          this.FETCH_PRODUCTS(category)
        }
      }
    }
  }
}
</script>

<style scoped lang="scss">
.header {
  margin: 0;
  display: flex;
  width: 100%;
  height: rem(66);
  align-items: center;
  justify-content: space-between;

  @extend .card-bs;
  border-radius: 0 0 rem(8) rem(8);

  &__logo {
    margin-left: rem(88);

    @extend .font_22-bold;
    color: $grey;
  }

  &__basket {
    position: relative;
    width: rem(34);
    height: rem(34);
    margin-right: rem(104);

    background: url('/imgs/basket.jpg') center center no-repeat;
    background-size: rem(24) rem(26);
    cursor: pointer;

    & :first-child {
      position: absolute;
      right: 0;
      top: 0;
      width: rem(12);
      height: rem(12);

      background: $grey-light;
      border-radius: 50%;

      @extend .flex-center;
      @extend .font_8-bold;
      color: $white;
    }
  }
}

.basket {
  position: absolute;
  top: 0;
  right: 0;
  width: rem(460);
  height: fit-content;
  min-height: 100vh;
}

.opacity-et-basket {
  opacity: 0.2;
}
</style>
