<template>
  <div>
    <div style="display: flex;flex-direction: row;justify-content: end;">
      <el-upload
        :show-file-list="showlist"
        :action="uploadurl"
        :on-error="handleError"
        :on-success="handleSuccess"
        class="upload-demo">
        <el-button size="small" type="primary">点击上传</el-button>
      </el-upload>
      <el-button size="small" type="primary" style="margin-left: 10px;" @click="deleteAll">批量删除</el-button>
    </div>
    <el-table
      :data="fileList"
      style="width: 100%"
      highlight-current-row
      @selection-change="onSelect"
      @select="onSelect"
      @select-all="onSelect">
      <el-table-column type="index" width="50" align="center"/>
      <el-table-column type="selection" width="55"/>
      <el-table-column prop="fileName" label="附件名称" align="center"/>
      <el-table-column prop="fileExt" label="附件类型" align="center"/>
      <el-table-column prop="fileSize" label="附件大小" align="center"/>
      <el-table-column prop="createBy" label="上传者" align="center"/>
      <el-table-column prop="createDate" label="上传时间" align="center"/>
      <el-table-column prop="paraCode" label="操作" align="center">
        <template slot-scope="scope">
          <a :href="host + '/attach/' + scope.row.id + '/download/?access_token='+access_token"><i class="el-icon-download" /></a>
          <i class="el-icon-delete" style="margin-left: 10px;" @click="onDelete(scope.row)"/>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import request from '@/utils/request'
export default {
  name: 'AttachmentSelect',
  props: {
    uploadurl: {
      type: String,
      default: process.env.BASE_API + '/attach/upload'
    },
    findurl: {
      type: String,
      default: process.env.BASE_API + '/attach/findfile'
    },
    removeurl: {
      type: String,
      default: process.env.BASE_API + '/attach/{id}/delete'
    },
    removeurls: {
      type: String,
      default: process.env.BASE_API + '/attach/batch/delete'
    },
    biz: {
      type: String,
      default: ''
    }
  },
  data: function() {
    return {
      fileList: [],
      showlist: false,
      multipleSelection: [],
      host: process.env.BASE_API
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
        } else {
          this.fileList = []
        }
      })
    },
    handleSuccess(response, file, fileList) {
      this.getFileList()
      this.$emit('onSuccess', file)
    },
    // eslint-disable-next-line handle-callback-err
    handleError(err, file, fileList) {
      this.$emit('onError', file)
      this.list = []
    },
    onSelect(row) {
      this.multipleSelection = row
    },
    deleteAll() {
      if (this.multipleSelection.length > 0) {
        const p = [
          '此操作将永久删除数据, 是否继续?',
          '提示',
          {
            type: 'warning'
          }
        ]
        this.$confirm(...p)
          .then(() => {
            const ids = this.multipleSelection.map((i) => i.id).join(',')
            request({
              url: this.removeurls + '?access_token=' + this.access_token + '&ids=' + ids,
              method: 'post'
            }).then((res) => {
              this.getFileList()
              this.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success',
                duration: 2000
              })
            })
          })
          .catch(() => {
            this.$notify({
              type: 'info',
              message: '已取消删除',
              duration: 2000
            })
          })
      } else {
        this.$notify({
          showClose: true,
          message: '请选择至少一条数据删除',
          type: 'error',
          duration: 2000
        })
      }
    },
    onDelete(row) {
      const p = [
        '此操作将永久删除数据, 是否继续?',
        '提示',
        {
          type: 'warning'
        }
      ]
      this.$confirm(...p)
        .then((_) => {
          request({
            url: this.removeurl.replace('{id}', row.id) + '?access_token=' + this.access_token,
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
        })
        .catch((e) => e)
    }
  }
}
</script>

<style scoped>
  .upload-demo ul {
    display: none !important;
  }
  .el-upload-list {
    display: none !important;
  }
</style>
