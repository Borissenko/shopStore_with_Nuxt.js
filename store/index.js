import {SelectedProduct} from '@/assets/utils/constructors'

export const state = () => ({
  productCategory: [],
  products_1: [],
  products_2: [],
  products_3: [],
  clientBasket: []
})

export const getters = {
  GET_PRODUCT_CATEGORY: state => state.productCategory,
  GET_PRODUCTS: state => ({category, sortingType}) => {
    let dd = state[`products_${category}`].slice()
    return dd.sort((a, b) => a[sortingType] - b[sortingType])
  },
  GET_PRODUCTS_FROM_BASKET: state => state.clientBasket,
  GET_PRODUCTS_FROM_BASKET_DEPLOYED: (state, getters) => {
      let productArticulsEtBasket = state.clientBasket
      let broadItemsEtBasket = []

      for(let {category, id} of productArticulsEtBasket) {
        let products = getters.GET_PRODUCTS({
          category,
          sortingType: 'price'
        }).slice()

        if(products.length > 0) {
          let broadItemForBasket = products.find(item => item.id === id)
          broadItemsEtBasket.push(broadItemForBasket)
        }
      }

      return broadItemsEtBasket
  }
}

export const mutations = {
  SET_PRODUCT_CATEGORY(state, pl) {
    state.productCategory = pl
  },
  SET_PRODUCTS(state, {category, products}) {
    state[`products_${category}`].push(...products)
  },
  PUT_PRODUCT_TO_BASKET(state, product) {
    state.clientBasket.push(product)
  },
  REBUILD_THE_BASKET_FROM_LOCALSTORAGE(state, reanimatedBasket) {
    state.clientBasket = reanimatedBasket
  },
  REFRESHING_BASKET(state, refreshingBasket) {
    state.clientBasket = refreshingBasket
  }
}

export const actions = {
  async nuxtServerInit({getters, dispatch, commit}, {$axios}) {
    let productCategory = []
    try {
      productCategory = await $axios.$get('/API_Data/productCategory/productCategory.json')
    } catch(e) {
      console.log('FETCH_PRODUCTS error = ', e)
    }
    commit('SET_PRODUCT_CATEGORY', productCategory)
    dispatch('FETCH_PRODUCTS', 1)
  },
  async FETCH_PRODUCTS({commit}, categoryId) {
    await this.$axios.$get(`/API_Data/products/products_${categoryId}.json`)
      .then(data => commit('SET_PRODUCTS', {category: categoryId, products: data}))
      .catch(e => console.log('FETCH_PRODUCTS error = ', e))
  },
  PUT_PRODUCT_TO_BASKET({getters, commit}, product) {
    commit('PUT_PRODUCT_TO_BASKET', product)

    // PUT PRODUCT TO LOCALSTORAGE
    let etBasket = getters.GET_PRODUCTS_FROM_BASKET
    let newBasket = ''

    for(let item of etBasket) {
      newBasket = newBasket + '=' + item.category + ',' + item.id
    }
    localStorage.setItem('basket', newBasket.substring(1))
  },
  DELETE_PRODUCT_FROM_BASKET({state, commit}, id) {
    let oneExemplar = false     //что бы удалялся лишь 1 экземпляр схожего продукта, а остальные экземпляры - оставались.

    let refreshingBasket = state.clientBasket.filter(item => {
      if(!oneExemplar) {
        if(item.id === id)
          oneExemplar = true

        return item.id !== id
      } else {
        return true
      }
    })

    // refreshing LocalStorage
    let refreshingString_Basket = ''
    for(let item of refreshingBasket) {
      refreshingString_Basket = refreshingString_Basket + '=' + item.category + ',' + item.id
    }

    if(refreshingString_Basket.length === 0) {
      localStorage.removeItem('basket')
    } else {
      localStorage.setItem('basket', refreshingString_Basket.substring(1))
    }

    // refreshing store
    commit('REFRESHING_BASKET', refreshingBasket)
  },
  DELETE_BASKET_TOTAL({state, commit}) {
    commit('REFRESHING_BASKET', [])
    localStorage.removeItem('basket')
  }
}





