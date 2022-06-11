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
    <el-dialog append-to-body :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="780px">
      <el-form ref="form" inline :model="form" :rules="rules" size="small" label-width="150px">
        <el-form-item label="活动名称" prop="name">
          <el-input v-model="form.name" style="width: 370px;" />
        </el-form-item>
        <el-form-item label="微信引导图">
          <el-upload
            ref="upload2"
            :limit="1"
            :before-upload="beforeAvatarUpload"
            :headers="headers"
            :on-success="handleAvatarSuccessWechat"
            :action="imagesUploadApi"
          >
            <img v-if="form.wechatPicName" :src="baseApi + '/file/图片/' + form.wechatPicName" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>
        <el-form-item label="微信引导图真实地址" prop="wechatPicPath" style="display: none">
          <el-input v-model="form.wechatPicPath" style="width: 370px;display: none" />
        </el-form-item>
        <el-form-item label="小程序活动弹窗图">
          <el-upload
            ref="upload"
            :limit="1"
            :before-upload="beforeAvatarUpload"
            :headers="headers"
            :on-success="handleAvatarSuccessMiniapp"
            :action="imagesUploadApi"
            style="width: 570px"
          >
            <img v-if="form.miniappPicName" :src="baseApi + '/file/图片/' + form.miniappPicName" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>
        <el-form-item label="小程序活动弹窗图真实地址" prop="miniappPicPath" style="display: none">
          <el-input v-model="form.miniappPicPath" style="width: 370px;display: none" />
        </el-form-item>
        <el-form-item label="活动背景图">
          <el-upload
            ref="upload"
            :limit="1"
            :before-upload="beforeAvatarUpload"
            :headers="headers"
            :on-success="handleAvatarSuccessBackground"
            :action="imagesUploadApi"
            style="width: 570px"
          >
            <img v-if="form.backgroundPicName" :src="baseApi + '/file/图片/' + form.backgroundPicName" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>
        <el-form-item label="活动背景图真实地址" prop="backgroundPicPath" style="display: none">
          <el-input v-model="form.backgroundPicPath" style="width: 370px;display: none" />
        </el-form-item>
        <el-form-item label="奖池1图">
          <el-upload
            ref="upload"
            :limit="1"
            :before-upload="beforeAvatarUpload"
            :headers="headers"
            :on-success="handleAvatarSuccessPrizePool1"
            :action="imagesUploadApi"
            style="width: 570px"
          >
            <img v-if="form.prizePoolPicName1" :src="baseApi + '/file/图片/' + form.prizePoolPicName1" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>
        <el-form-item label="奖池1图真实地址" prop="prizePoolPicPath1" style="display: none">
          <el-input v-model="form.prizePoolPicPath1" style="width: 370px;display: none" />
        </el-form-item>
        <el-form-item label="奖池2图">
          <el-upload
            ref="upload"
            :limit="1"
            :before-upload="beforeAvatarUpload"
            :headers="headers"
            :on-success="handleAvatarSuccessPrizePool2"
            :action="imagesUploadApi"
            style="width: 570px"
          >
            <img v-if="form.prizePoolPicName2" :src="baseApi + '/file/图片/' + form.prizePoolPicName2" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>
        <el-form-item label="奖池2图真实地址" prop="prizePoolPicPath2" style="display: none">
          <el-input v-model="form.prizePoolPicPath2" style="width: 370px;display: none" />
        </el-form-item>
        <el-form-item label="红包1图">
          <el-upload
            ref="upload"
            :limit="1"
            :before-upload="beforeAvatarUpload"
            :headers="headers"
            :on-success="handleAvatarSuccessRedEnvelope1"
            :action="imagesUploadApi"
            style="width: 570px"
          >
            <img v-if="form.redEnvelopePicName1" :src="baseApi + '/file/图片/' + form.redEnvelopePicName1" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>
        <el-form-item label="红包1图真实地址" prop="redEnvelopePicPath1" style="display: none">
          <el-input v-model="form.redEnvelopePicPath1" style="width: 370px;display: none" />
        </el-form-item>
        <el-form-item label="选择对应红包1" prop="coupon1">
          <el-select v-model="form.couponId1" style="width: 370px" placeholder="请选择优惠券">
            <el-option
              v-for="item in coupons1"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="红包2图">
          <el-upload
            ref="upload"
            :limit="1"
            :before-upload="beforeAvatarUpload"
            :headers="headers"
            :on-success="handleAvatarSuccessRedEnvelope2"
            :action="imagesUploadApi"
            style="width: 570px"
          >
            <img v-if="form.redEnvelopePicName2" :src="baseApi + '/file/图片/' + form.redEnvelopePicName2" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>
        <el-form-item label="红包2图真实地址" prop="redEnvelopePicPath2" style="display: none">
          <el-input v-model="form.redEnvelopePicPath2" style="width: 370px;display: none" />
        </el-form-item>
        <el-form-item label="选择对应红包2" prop="coupon2">
          <el-select v-model="form.couponId2" style="width: 370px" placeholder="请选择优惠券">
            <el-option
              v-for="item in coupons2"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="红包3图">
          <el-upload
            ref="upload"
            :limit="1"
            :before-upload="beforeAvatarUpload"
            :headers="headers"
            :on-success="handleAvatarSuccessRedEnvelope3"
            :action="imagesUploadApi"
            style="width: 570px"
          >
            <img v-if="form.redEnvelopePicName3" :src="baseApi + '/file/图片/' + form.redEnvelopePicName3" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>
        <el-form-item label="红包3图真实地址" prop="redEnvelopePicPath3" style="display: none">
          <el-input v-model="form.redEnvelopePicPath3" style="width: 370px;display: none" />
        </el-form-item>
        <el-form-item label="选择对应盲盒" prop="box3">
          <el-select v-model="form.boxId3" style="width: 370px" placeholder="请选择盲盒" multiple>
            <el-option
              v-for="item in boxs3"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="是否循环">
          <el-radio-group v-model="form.isLoop" style="width: 370px">
            <el-radio label="1">是</el-radio>
            <el-radio label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="form.isLoop === '1'" label="循环类型" prop="loopType">
          <el-select v-model="form.loopType" style="width: 370px" placeholder="请选择循环类型">
            <el-option label="按周" value="1" />
            <el-option label="按月" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="form.isLoop === '1' && form.loopType === '1' " label="循环日期" prop="loopValue">
          <el-select v-model="form.loopValue" style="width: 370px" placeholder="请选择循环日期" multiple>
            <el-option label="星期一" value="1" />
            <el-option label="星期二" value="2" />
            <el-option label="星期三" value="3" />
            <el-option label="星期四" value="4" />
            <el-option label="星期五" value="5" />
            <el-option label="星期六" value="6" />
            <el-option label="星期日" value="7" />
          </el-select>
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
      <el-table-column prop="name" label="活动名称" />
      <el-table-column prop="path" label="活动分享预览图">
        <template slot-scope="{row}">
          <el-image
            :src=" baseApi + '/file/图片/' + row.sharePicName"
            :preview-src-list="[baseApi + '/file/图片/' + row.sharePicName]"
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
      <el-table-column prop="isLoop" label="是否循环" />
      <el-table-column label="状态" align="center" prop="enabled">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.enabled"
            :disabled="scope.row.id === 1"
            active-color="#409EFF"
            inactive-color="#F56C6C"
            @change="changeEnabled(scope.row, scope.row.enabled,)"
          />
        </template>
      </el-table-column>
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
import { getCoupons } from '@/api/shop/coupon'
import { getBoxs } from '@/api/shop/box'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import rrOperation from '@crud/RR.operation'
import DateRangePicker from '@/components/DateRangePicker'
import pagination from '@crud/Pagination'
import { getToken } from '@/utils/auth'
import { mapGetters } from 'vuex'

// crud交由presenter持有
const defaultForm = { id: null, name: null, wechatPicName: null, wechatPicPath: null, miniappPicName: null, miniappPicPath: null, backgroundPicName: null, backgroundPicPath: null, prizePoolPicName1: null, prizePoolPicPath1: null, prizePoolPicName2: null, prizePoolPicPath2: null, redEnvelopePicName1: null, redEnvelopePicPath1: null, couponId1: null, couponName1: null, redEnvelopePicName2: null, redEnvelopePicPath2: null, couponId2: null, couponName2: null, redEnvelopePicName3: null, redEnvelopePicPath3: null, boxId3: null, boxName3: null, isLoop: null, loopType: null, loopValue: null, loopPartakeNum: null, fixed: '', partakeCondition: null, partakeNum: null, shareText: null, sharePicName: null, sharePicPath: null, enabled: true, saleSort: 999 }
export default {
  name: 'Sale',
  components: { crudOperation, rrOperation, udOperation, DateRangePicker, pagination },
  cruds() {
    return CRUD({ title: '盲盒', url: 'api/sale', crudMethod: { ...crudSale }})
  },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  dicts: ['dept_status'],
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
      coupons1: [], coupons2: [], boxs3: [],
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
  mounted() {
    this.getCoupons()
    this.getBoxs()
  },
  methods: {
    handleAvatarSuccessWechat(response, file, fileList) {
      this.form.wechatPicName = response.realName
      this.form.wechatPicPath = response.path
    },
    handleAvatarSuccessMiniapp(response, file, fileList) {
      this.form.miniappPicName = response.realName
      this.form.miniappPicPath = response.path
    },
    handleAvatarSuccessBackground(response, file, fileList) {
      this.form.backgroundPicName = response.realName
      this.form.backgroundPicPath = response.path
    },
    handleAvatarSuccessPrizePool1(response, file, fileList) {
      this.form.prizePoolPicName1 = response.realName
      this.form.prizePoolPicPath1 = response.path
    },
    handleAvatarSuccessPrizePool2(response, file, fileList) {
      this.form.prizePoolPicName2 = response.realName
      this.form.prizePoolPicPath2 = response.path
    },
    handleAvatarSuccessRedEnvelope1(response, file, fileList) {
      this.form.redEnvelopePicName1 = response.realName
      this.form.redEnvelopePicPath1 = response.path
    },
    handleAvatarSuccessRedEnvelope2(response, file, fileList) {
      this.form.redEnvelopePicName2 = response.realName
      this.form.redEnvelopePicPath2 = response.path
    },
    handleAvatarSuccessRedEnvelope3(response, file, fileList) {
      this.form.redEnvelopePicName3 = response.realName
      this.form.redEnvelopePicPath3 = response.path
    },
    handleAvatarSuccessRedShare(response, file, fileList) {
      this.form.sharePicName = response.realName
      this.form.sharePicPath = response.path
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
    },
    changeEnabled(data, val) {
      this.$confirm('此操作将 "' + this.dict.label.dept_status[val] + '" ' + data.name + '活动, 是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        crudSale.edit(data).then(res => {
          this.crud.notify(this.dict.label.dept_status[val] + '成功', CRUD.NOTIFICATION_TYPE.SUCCESS)
        }).catch(err => {
          data.enabled = !data.enabled
          console.log(err.response.data.message)
        })
      }).catch(() => {
        data.enabled = !data.enabled
      })
    },
    getCoupons() {
      getCoupons({ delFlag: true }).then(res => {
        this.coupons1 = res.content
        this.coupons2 = res.content
      })
    },
    getBoxs() {
      getBoxs({ delFlag: true }).then(res => {
        this.boxs3 = res.content
      })
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
    border:1px dashed #409eff;
    border-radius:10%
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
