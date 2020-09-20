<template>
  <div class="cart-wrapper">
    <div class="product-img"
         :style="{backgroundImage: `url(${productImg})`}"
    ></div>
    <div class="product-description">
      <div>{{ productName }}</div>
      <div>{{ productPrice }} ₽</div>
    </div>

    <div @click="onDeleteProductInBasket"
         class="bin"
    ></div>

    <stars class="product-stars" :starsCount="starsCount"/>
  </div>
</template>

<script>
import Stars from '@/components/Stars'

export default {
  name: 'BasketCart',
  components: {
    Stars
  },
  props: {
    productId: {
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
    onDeleteProductInBasket() {
      this.$emit('deleteProduct', this.productId)
    }
  }
}
</script>

<style scoped lang="scss">
.cart-wrapper {
  display: grid;
  grid-template-columns: rem(95) rem(34) 1fr rem(42);
  grid-template-rows: 1fr rem(32);

  width: 100%;
  height: rem(120);
  @extend .card-bs;

  .product-img {
    grid-column: 1;
    grid-row: 1 / span 2;
    place-self: center end;
    width: rem(70);
    height: rem(90);
    background-size: cover;
  }

  .product-description {
    grid-column: 3;
    grid-row: 1;
    place-self: start start;
    margin-top: rem(12);

    @extend .font_14;
    color: $grey;

    & :last-child {
      margin-top: rem(6);
      font-weight: bold;
      color: $black;
    }
  }

  .bin {
    grid-column: 4;
    grid-row: 1 / span 2;
    place-self: center start;
    width: rem(20);
    height: rem(22);
    background: url('/imgs/bin.jpg');
    opacity: 0.34;
    cursor: pointer;

    &:hover {
      opacity: 1;
    }
  }

  .product-stars {
    grid-column: 3;
    grid-row: 2;
    place-self: start start;
    margin-left: rem(4);
  }
}
</style>
