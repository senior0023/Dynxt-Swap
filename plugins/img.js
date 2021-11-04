export default ({ app,$axios }, inject) => {
  // Inject $hello(msg) in Vue, context and store.
  inject('imgUrl', url => {
    return $axios.defaults.baseURL+url
  })
}
