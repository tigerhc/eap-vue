<template>
  <div>
    <el-upload
      :action="uploadurl"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :before-remove="beforeRemove"
      :limit="12"
      :on-exceed="handleExceed"
      :file-list="imageList"
      class="upload-demo"
      list-type="picture-card"
      multiple>
      <el-button size="small" type="primary">点击上传</el-button>
      <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible" width="500px" height="500px">
      <img :src="dialogImageUrl" width="100%" height="100%" alt="">
    </el-dialog>
  </div>
</template>

<script>
import request from '@/utils/request'
export default {
  name: 'PSelect',
  props: {
    // 图片上传地址
    uploadurl: {
      type: String,
      default: process.env.BASE_API + '/attach/upload?access_token=' + this.$store.getters.token
    },
    removeurl: {
      type: String,
      default: process.env.BASE_API + '/attach/{id}/delete'
    },
    // 原名key，类似于id，触发事件会带上（如果一个页面多个图片上传控件，可以做区分
    imageList: {
      type: Array,
      default: () => []
    }
  },
  data: function() {
    return {
      dialogImageUrl: '',
      dialogVisible: false
    }
  },
  computed: {

  },
  //   下载: attach/{attachId}download/
  // 批量删除: attach/batch/delete 参数ids
  // 删除: attach/{id}/delete
  // 查询: attach/find 参数biz(必填), bizc(选填)
  // 文件上传: attach/upload    参数 file, biz(选填), bizc(选填)
  // 图片上传: attach/uploadImg 参数 file, biz(选填), bizc(选填)
  watch: {

  },
  created() {},
  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList)
      request({
        url: this.removeurl,
        method: 'post'
      }).then((res) => {
      })
    },
    handlePreview(file) {
      console.log(file)
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    }
  }
}
</script>

<style scoped>

</style>
