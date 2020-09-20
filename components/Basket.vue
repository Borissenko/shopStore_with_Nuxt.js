<template>
  <div class="wrapper"
       :class="{cursorPointer: orderIsDone}"
       @mousedown="orderIsDone ? onShutBasket() : null"
  >
    <div class="header">
      <h1>Корзина</h1>
      <div @click="onShutBasket" class="header__control">
        <div></div>
      </div>
    </div>

    <div v-if="isEmptyBasket && !orderIsDone" class="empty-basket">
      Пока что Вы ничего не добавили в корзину
    </div>

    <div v-else-if="!orderIsDone">
      <div class="list">
        <div class="list__title">Товары в корзине</div>
        <div class="list__products">
          <basket-cart v-for="(item, ind) in GET_PRODUCTS_FROM_BASKET_DEPLOYED"
                       :key="ind"
                       :productId="item.id"
                       :productName="item.name"
                       :starsCount="item.rating"
                       :productImg="item.photo"
                       :productPrice="item.price"
                       @deleteProduct="deleteProductFromBasket"
          />
        </div>
      </div>

      <div class="order">
        <div class="order__title">Оформить заказ</div>
        <div v-for="(field, key, ind) in forms"
             :key="'field' + ind"
             class="order__forms"
        >
          <input type="text"
                 v-model="field.value"
                 :placeholder="field.placeholder"
                 v-mask="field.mask ? field.mask : ''"
                 @blur="$v.forms[key].value.$touch()"
                 :class="{'input-error': $v.forms[key].value.$error || isUntouchedFields,
                          'input-valid': !$v.forms[key].value.$invalid
                         }"
          >
        </div>
      </div>
    </div>

    <div v-else class="order-done">
      <div class="order-done__img"></div>
      <div>Заявка успешно отправлена</div>
      <div>Вскоре наш менеджер свяжется с Вами</div>
    </div>

    <div v-if="!orderIsDone"
         @click="onRapport"
         class="control"
    >
      {{ isEmptyBasket ? 'Перейти к выбору' : 'Отправить' }}
    </div>
  </div>
</template>

<script>
import BasketCart from '@/components/BasketCart'
import AwesomeMask from 'awesome-mask'
import {required} from 'vuelidate/lib/validators'
import isPhone from '@/assets/utils/validation'
import {mapGetters, mapActions} from 'vuex'

export default {
  name: 'Basket',
  components: {
    BasketCart
  },
  data: () => ({
    orderIsDone: false,
    isUntouchedFields: false,
    forms: {
      name: {
        value: '',
        placeholder: 'Ваше имя'
      },
      phone: {
        value: '',
        placeholder: 'Телефон',
        mask: '(999) 999-99-99'
      },
      address: {
        value: '',
        placeholder: 'Адрес'
      },
    }
  }),
  validations: {
    forms: {
      name: {
        value: {required}
      },
      phone: {
        value: {isPhone}
      },
      address: {
        value: {required}
      }
    }
  },
  computed: {
    ...mapGetters([
      'GET_PRODUCTS_FROM_BASKET',
      'GET_PRODUCTS_FROM_BASKET_DEPLOYED'
    ]),
    isEmptyBasket() {
      return this.GET_PRODUCTS_FROM_BASKET.length === 0
    }
  },
  methods: {
    ...mapActions([
      'DELETE_PRODUCT_FROM_BASKET',
      'DELETE_BASKET_TOTAL'
    ]),
    onRapport() {
      if(this.isEmptyBasket) {  // При пустой корзине кнопка просто закрывает окно корзины.
        this.onShutBasket()
        return
      }
      //валидация заполненности полей перед отправкой заказа.
      let dirtyAll = Boolean(this.forms.name.value && this.forms.phone.value && this.forms.address.value)
      let noErrors = !this.$v.forms.$anyError

      if(!dirtyAll)
        this.isUntouchedFields = true

      //Здесь декларируем отправку заказа на сервер собственно.
      if(dirtyAll && noErrors) {
        this.orderIsDone = true
        this.$v.$reset()
        this.DELETE_BASKET_TOTAL()
        // this.POST_ORDER_TO_SERVER({forms: this.forms, order: this.GET_PRODUCTS_FROM_BASKET )
      }
    },
    onShutBasket() {
      this.orderIsDone = false
      this.$v.$reset()
      this.isUntouchedFields = false
      this.$emit('shutBasket')
    },
    deleteProductFromBasket(id) {
      this.DELETE_PRODUCT_FROM_BASKET(id)
    }
  },
  directives: {
    'mask': AwesomeMask
  }
}
</script>

<style scoped lang="scss">
.cursorPointer {
  cursor: pointer;
}

.wrapper {
  box-sizing: border-box;
  width: 100%;
  height: fit-content;
  min-height: rem(600);
  padding: rem(52) rem(48);
  background: $white;
  @extend .panel-bs;
  border-radius: rem(8) 0 0 rem(8);

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: rem(42);

    &__control {
      width: rem(14);
      height: rem(14);
      @extend .flex-center;
      cursor: pointer;

      & ::before {
        display: block;
        width: 20px;
        height: 2px;
        background-color: $black;
        content: '';
        transform: rotate(90deg);
      }

      * {
        width: 20px;
        height: 2px;
        background-color: $black;
        transform: rotate(45deg);
      }
    }
  }

  .empty-basket {
    margin-top: rem(24);
    @extend .font_22;
    color: $black-extra;
  }

  .list {
    margin-top: rem(24);

    &__title {
      @extend .font_18;
      color: $grey;
    }

    &__products {
      margin-top: rem(16);

      > :not(:first-child) {
        margin-top: rem(12);
      }
    }
  }

  .order {
    margin-top: rem(32);

    &__title {
      @extend .font_18;
      color: $grey;
    }

    input {
      width: calc(100% - 1.12rem);
      height: rem(50);
      margin-top: rem(16);

      background: $grey-extra-light;
      border-radius: rem(8);
      border: transparent 1px solid;
      padding-left: rem(14);
      @extend .font_16;
      color: $black;

      & ::placeholder {
        color: $grey-extra-light;
      }

      &:focus {
        outline: 0;
      }
    }

    .input-error {
      border: $error 1px solid;
      color: $error;
    }

    .input-valid {
      border: $valid 1px solid;
      color: $valid;
    }
  }

  .order-done {
    margin-top: rem(60);

    &__img {
      width: 100%;
      height: rem(80);
      background: url('/imgs/ok.jpg') center center no-repeat;
    }

    & :nth-child(2) {
      width: 100%;
      margin-top: rem(24);
      @extend .font_24-bold;
      color: $black-extra;
      text-align: center;
    }

    & :nth-child(3) {
      width: 100%;
      margin-top: rem(2);
      @extend .font_16;
      color: $grey;
      text-align: center;
    }
  }

  .control {
    width: 100%;
    height: rem(50);
    margin-top: rem(24);
    border-radius: rem(8);
    background: $black;
    cursor: pointer;

    @extend .flex-center;
    @extend .font_16;
    color: $white;

    &:hover {
      background: $grey;
    }
  }
}
</style>
