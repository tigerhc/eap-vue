<script>
export default {
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    }
  },
  render(h) {
    return (
      // <keep-alive >
      <router-view />
      // </keep-alive>
    )
  }
}
</script>
