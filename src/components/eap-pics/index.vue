<script>
import { mapGetters } from 'vuex'
export default {
  name: 'WSelectPic',
  props: {
    url: {
      type: String,
      default: ''
    },
    list1: {
      type: Array,
      default() {
        return []
      }
    }
  },
  computed: {
    ...mapGetters(['name']),
    $p() {
      return require('@img/' + this.url + '.png')
    } },
  watch: {
    list1: {
      handler(n) {
        this.$forceUpdate(n)
      } }},
  methods: {
    methodThatForces() {
    } },
  render: function(h) {
    return h('div', { style: { backgroundImage: 'url(' + this.$p + ')' }, attrs: { id: 'id' }}, this.list1.map((t, id) => h('div', { style: t }, t['id'])))
  }
}
</script>
<style lang="scss" scoped>
  @import "src/styles/proindex";
  id{
    width: 100%;
    height:100%;
  }
</style>
