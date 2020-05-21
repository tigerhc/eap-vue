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
      :on-success="handleSuccess"
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
  name: 'PicutreSelect',
  props: {
    // 图片上传地址
    uploadurl: {
      type: String,
      default: process.env.BASE_API + '/attach/upload'
    },
    findurl: {
      type: String,
      default: process.env.BASE_API + '/attach/findimg'
    },
    removeurl: {
      type: String,
      default: process.env.BASE_API + '/attach/{id}/delete'
    },
    limit: {
      type: Number,
      default: -1
    },
    // 原名key，类似于id，触发事件会带上（如果一个页面多个图片上传控件，可以做区分
    fileList: {
      type: Array,
      default: () => []
    },
    biz: {
      type: String,
      default: ''
    }
  },
  data: function() {
    return {
      imageList: [],
      dialogImageUrl: '',
      dialogVisible: false
    }
  },
  computed: {
    access_token() {
      return this.$store.getters.token
    }
  },
  watch: {
    access_token: {
      handler: function(val) {
        console.log(val)
      }
    }
  },
  //   下载: attach/{attachId}download/
  // 批量删除: attach/batch/delete 参数ids
  // 删除: attach/{id}/delete
  // 查询: attach/find 参数biz(必填), bizc(选填)
  // 文件上传: attach/upload    参数 file, biz(选填), bizc(选填)
  // 图片上传: attach/uploadImg 参数 file, biz(选填), bizc(选填)
  created() {},
  mounted() {
    this.getFileList()
  },
  methods: {
    getFileList() {
      request({
        url: this.findurl + '?biz=' + this.biz,
        method: 'get'
      }).then((res) => {
        console.log(res)
        if (res.status === 200 && res.data !== undefined && res.data !== '') {
          this.fileList = res.data
          this.imageList = []
          for (let i = 0; i < this.fileList.length; i++) {
            // [{name: 'food.jpg', url: 'https://xxx.cdn.com/xxx.jpg'}]
            const f = {}
            f.name = this.fileList[i].fileName
            f.url = this.fileList[i].filePath
            f.id = this.fileList[i].id
            this.imageList.push(f)
          }
        } else {
          this.imageList = []
          this.fileList = []
        }
      })
    },
    handleSuccess(response, file, fileList) {
      this.getFileList()
      this.$emit('onSuccess', file)
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
      request({
        url: this.removeurl.replace('{id}', file.id) + '?access_token=' + this.access_token,
        method: 'post'
      }).then((res) => {
        console.log(res)
        // this.fileList.remove(row)
        this.getFileList()
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    handlePreview(file) {
      console.log(file)
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleExceed(files, fileList) {
      // this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    }
  }
}
</script>

<style scoped>

</style>
