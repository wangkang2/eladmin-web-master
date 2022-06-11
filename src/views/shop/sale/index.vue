<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input v-model="query.blurry" clearable size="small" placeholder="模糊搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <date-range-picker v-model="query.createTime" class="date-item" />
        <rrOperation />
      </div>
      <crudOperation :permission="permission" />
    </div>
    <!--表单渲染-->
    <el-dialog append-to-body :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="580px">
      <el-form ref="form" inline :model="form" :rules="rules" size="small" label-width="80px">
        <el-form-item label="盲盒名称" prop="name">
          <el-input v-model="form.name" style="width: 370px;" />
        </el-form-item>
        <el-form-item label="盲盒图片">
          <el-upload
            ref="upload"
            :limit="1"
            :before-upload="beforeAvatarUpload"
            :headers="headers"
            :on-success="handleAvatarSuccess"
            :action="imagesUploadApi + '?name=' + form.name"
          >
            <img v-if="form.picName" :src="baseApi + '/file/图片/' + form.picName" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>
        <el-form-item label="图片真实地址" prop="picPath" style="display: none">
          <el-input v-model="form.picPath" style="width: 370px;display: none" />
        </el-form-item>
        <el-form-item label="盲盒单价" prop="price">
          <el-input v-model="form.price" style="width: 370px;" />
        </el-form-item>
        <el-form-item label="运货规则" prop="shipRule">
          <el-input v-model="form.shipRule" type="textarea" :rows="2" maxlength="200" show-word-limit style="width: 370px;" />
        </el-form-item>
        <el-form-item label="盲盒描述" prop="saleDescribe">
          <el-input v-model="form.saleDescribe" type="textarea" :rows="2" maxlength="200" show-word-limit style="width: 370px;" />
        </el-form-item>
        <el-form-item label="排序" prop="saleSort">
          <el-input-number
            v-model.number="form.saleSort"
            :min="0"
            :max="999"
            controls-position="right"
            style="width: 370px;"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="crud.cancelCU">取消</el-button>
        <el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
      </div>
    </el-dialog>
    <!--表格渲染-->
    <el-table ref="table" v-loading="crud.loading" :data="crud.data" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
      <el-table-column type="selection" width="55" />
      <el-table-column prop="name" label="盲盒名称" />
      <el-table-column prop="path" label="预览图">
        <template slot-scope="{row}">
          <el-image
            :src=" baseApi + '/file/图片/' + row.picName"
            :preview-src-list="[baseApi + '/file/图片/' + row.picName]"
            fit="contain"
            lazy
            class="el-avatar"
          >
            <div slot="error">
              <i class="el-icon-document" />
            </div>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column prop="price" label="单价" />
      <el-table-column prop="saleSort" label="排序">
        <template slot-scope="scope">
          {{ scope.row.saleSort }}
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建日期" />
      <!--   编辑与删除   -->
      <el-table-column
        v-if="checkPer(['admin','sale:edit','sale:del'])"
        label="操作"
        width="130px"
        align="center"
        fixed="right"
      >
        <template slot-scope="scope">
          <udOperation
            :data="scope.row"
            :permission="permission"
          />
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <pagination />
  </div>
</template>

<script>
import crudSale from '@/api/shop/sale'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import rrOperation from '@crud/RR.operation'
import DateRangePicker from '@/components/DateRangePicker'
import pagination from '@crud/Pagination'
import { getToken } from '@/utils/auth'
import { mapGetters } from 'vuex'

// crud交由presenter持有
const defaultForm = { id: null, name: null, price: null, picName: null, picPath: null, shipRule: null, saleDescribe: null, saleSort: 999 }
export default {
  name: 'Sale',
  components: { crudOperation, rrOperation, udOperation, DateRangePicker, pagination },
  cruds() {
    return CRUD({ title: '盲盒', url: 'api/sale', crudMethod: { ...crudSale }})
  },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  data() {
    const validateMoney = (rule, value, callback) => {
      value = value + ''
      const reg = /^[+-]?(0|([1-9]\d*))(\.\d+)?$/g
      if (!value) {
        callback(new Error('价格不能为空'))
      } else if (!reg.test(value)) {
        callback(new Error('请输入正确格式的金额'))
      } else if (value < 0) {
        callback(new Error('金额不能小于零'))
      } else if (value.indexOf('.') != -1 && value.split('.').length > 2) {
        callback(new Error('请输入正确格式的金额')) // 防止输入多个小数点
      } else if (value.indexOf('.') != -1 && value.split('.')[1].length > 2) {
        callback(new Error('请输入正确的小数位数')) // 小数点后两位
      } else {
        callback()
      }
    }
    return {
      headers: {
        'Authorization': getToken()
      },
      rules: {
        name: [
          { required: true, message: '请输入盲盒名称', trigger: 'blur' }
        ],
        price: [
          { required: true, validator: validateMoney, trigger: 'blur' }
        ],
        saleSort: [
          { required: true, message: '请输入序号', trigger: 'blur', type: 'number' }
        ]
      },
      permission: {
        add: ['admin', 'sale:add'],
        edit: ['admin', 'sale:edit'],
        del: ['admin', 'sale:del']
      }
    }
  },
  computed: {
    ...mapGetters([
      'baseApi',
      'imagesUploadApi'
    ])
  },
  methods: {
    handleAvatarSuccess(response, file, fileList) {
      this.form.picName = response.realName
      this.form.picPath = response.path
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 5MB!')
      }
      return isJPG && isLt2M
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
    border-style: dashed;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
