<script>
import api from '../eap-table/fetch'
export default {
  name: 'WSelect',
  props: {
    value: { default: '', type: null },
    url: String,
    dict: { type: [Boolean, String], default: false },
    namekey: { type: String, default: 'name' },
    valuekey: { type: String, default: 'id' }
  },
  data: function() {
    return {
      data: [],
      loading: false
    }
  },
  computed: {
    api: function() {
      return api(this.url)
    }
  },
  created() {
    this.getData()
  },
  mounted() {
    console.info(this.value, this.url, this.dict)
  },
  methods: {
    getData() {
      this.loading = true
      this.api.ajaxList({ queryFields: [this.namekey, this.valuekey, ''].join() }).then(
        (resp) => {
          this.data = (resp && resp.data && resp.data.results) || []
          this.loading = false
        },
        (e) => {
          this.loading = false
        }
      )
    }
  },
  render() {
    return (
      <el-select value={this.value} {...{ props: this.$attrs }} onInput={e => this.$emit('input', e)}>
        {this.data.map((op) => {
          return <el-option key={op.id} label={op[this.namekey]} value={op[this.valuekey]}></el-option>
        })}
      </el-select>
    )
  }
}
</script>

<style>
</style>
