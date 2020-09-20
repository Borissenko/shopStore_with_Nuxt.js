<template>
  <div class="wrapper">
    <stars class="stars" :starsCount="starsCount"/>

    <div class="product-img"
         :style="{backgroundImage: `url(${productImg})`}"
    ></div>

    <div @click="onPutProductToBasket"
         class="basket-img"
    ></div>

    <div class="product-name">
      {{productName}}
    </div>

    <div class="product-price">
      {{productPrice}} ₽
    </div>
  </div>
</template>

<script>
import Stars from '@/components/Stars'

export default {
  name: 'ProductCart',
  components: {
    Stars
  },
  props: {
    productId: {
      type: Number,
      required: true
    },
    productCategory: {
      type: Number,
      required: true
    },
    productName: {
      type: String,
      required: true
    },
    starsCount: {
      type: Number,
      required: true
    },
    productImg: {
      type: String,
      required: true
    },
    productPrice: {
      type: Number,
      required: true
    }
  },
  // computed: {
  //   img() {     //for real API only
  //     return process.env.BASE_URL + this.productImg
  //   }
  // },
  methods: {
    onPutProductToBasket() {
      this.$emit('selectedProduct', {id: this.productId, category: this.productCategory})
    }
  }
}
</script>

<style scoped lang="scss">
.wrapper {
  width: rem(264);
  height: rem(272);
  display: grid;
  grid-template-columns: 1fr rem(142) 1fr;
  grid-template-rows: rem(18) rem(180) rem(37) rem(37);

  background: #FFFFFF;
  @extend .card-bs;

  .stars {
    grid-column: 1;
    grid-row: 2;
    place-self: start center;
  }

  .product-img {
    grid-column: 2;
    grid-row: 2;
    background-size: cover;
  }

  .basket-img {
    grid-column: 3;
    grid-row: 2;
    width: rem(12);
    height: rem(14);
    place-self: start end;
    margin-right: rem(18);
    background: url('/imgs/basket_grey.jpg') center center;
    cursor: pointer;
  }

  .product-name {
    grid-column: 1 / span 3;
    grid-row: 3;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    padding: 0 rem(16);

    display: flex;
    align-items: flex-end;
    justify-content: flex-start;
    margin-bottom: rem(3);
    @extend .font_14;
    color: $grey;
  }

  .product-price {
    grid-column: 1 / span 3;
    grid-row: 4;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    padding: 0 rem(16);

    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    margin-top: rem(3);
    @extend .font_14;
    color: $black;
  }

}
</style>
