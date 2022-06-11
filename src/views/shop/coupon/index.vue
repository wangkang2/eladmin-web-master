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
      <el-form ref="form" inline :model="form" :rules="rules" size="small" label-width="100px">
        <el-form-item label="优惠券名称" prop="name">
          <el-input v-model="form.name" style="width: 370px;" />
        </el-form-item>
        <el-form-item label="优惠券类型" prop="couponType">
          <el-select v-model="form.couponType" style="width: 370px" placeholder="请选择优惠券类型">
            <el-option label="满减" value="1" />
            <el-option label="打折" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="form.couponType === '1'" label="满减金额" prop="fullReducedAmount">
          <el-input v-model="form.fullReducedAmount" style="width: 130px;" />
        </el-form-item>
        <el-form-item v-if="form.couponType === '1'" label="优惠金额" prop="price">
          <el-input v-model="form.price" style="width: 125px;" />
        </el-form-item>
        <el-form-item v-if="form.couponType === '2'" label="折扣" prop="discount">
          <el-input v-model="form.discount" style="width: 370px;" />
        </el-form-item>
        <el-form-item label="领取条件" prop="receiveCondition">
          <el-select v-model="form.receiveCondition" style="width: 370px" placeholder="请选择领取条件">
            <el-option label="每月" value="1" />
            <el-option label="每周" value="2" />
            <el-option label="不限制" value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="领取次数" prop="receiveNum">
          <el-input-number
            v-model.number="form.receiveNum"
            :min="0"
            :max="999"
            controls-position="right"
            style="width: 370px;"
          />
        </el-form-item>
        <el-form-item label="有效期" prop="validity">
          <el-date-picker v-model="form.validity" required type="datetimerange" align="right" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']" style="width: 370px;" />
        </el-form-item>
        <el-form-item label="排序" prop="couponSort">
          <el-input-number
            v-model.number="form.couponSort"
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
      <el-table-column prop="name" label="优惠券名称" />
      <el-table-column prop="couponType" label="优惠">
        <template slot-scope="scope">
          <span v-if="scope.row.couponType == '1'" style="color: green">满{{ scope.row.fullReducedAmount }}元减{{ scope.row.price }}元</span>
          <span v-else style="color: blue">{{ scope.row.discount }}折</span>
        </template>
      </el-table-column>
      <el-table-column prop="receiveCondition" label="可领取次数">
        <template slot-scope="scope">
          <span v-if="scope.row.receiveCondition == '1'" style="color: green">每月{{ scope.row.receiveNum }}次</span>
          <span v-else-if="scope.row.receiveCondition == '2'" style="color: blue">每周{{ scope.row.receiveNum }}次</span>
          <span v-else="scope.row.receiveCondition == '3'" style="color: red">{{ scope.row.receiveNum }}次</span>
        </template>
      </el-table-column>
      <el-table-column prop="validity" label="有效期">
        <template slot-scope="scope">
          {{ scope.row.validityFrom }} — {{ scope.row.validityTo }}
        </template>
      </el-table-column>
      <el-table-column prop="couponSort" label="排序">
        <template slot-scope="scope">
          {{ scope.row.couponSort }}
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建日期" />
      <!--   编辑与删除   -->
      <el-table-column
        v-if="checkPer(['admin','coupon:edit','coupon:del'])"
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
import crudCoupon from '@/api/shop/coupon'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import rrOperation from '@crud/RR.operation'
import DateRangePicker from '@/components/DateRangePicker'
import pagination from '@crud/Pagination'
import { getToken } from '@/utils/auth'

// crud交由presenter持有
const defaultForm = { id: null, name: null, couponType: '1', fullReducedAmount: null, price: null, discount: null, receiveCondition: '1', receiveNum: 3, validity: '', couponSort: 999 }
export default {
  name: 'Coupon',
  components: { crudOperation, rrOperation, udOperation, DateRangePicker, pagination },
  cruds() {
    return CRUD({ title: '优惠券', url: 'api/coupon', crudMethod: { ...crudCoupon }})
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
    const validateDiscount = (rule, value, callback) => {
      value = value + ''
      const reg = /^[+-]?(0|([1-9]\d*))(\.\d+)?$/g
      if (!value) {
        callback(new Error('折扣不能为空'))
      } else if (!reg.test(value)) {
        callback(new Error('请输入正确格式的折扣'))
      } else if (value < 0) {
        callback(new Error('折扣不能小于0'))
      } else if (value > 10) {
        callback(new Error('折扣不能大于10'))
      } else if (value.indexOf('.') != -1 && value.split('.').length > 2) {
        callback(new Error('请输入正确格式的金额')) // 防止输入多个小数点
      } else if (value.indexOf('.') != -1 && value.split('.')[1].length > 1) {
        callback(new Error('折扣只能有一位小数')) // 小数点后一位
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
          { required: true, message: '请输入优惠券名称', trigger: 'blur' }
        ],
        fullReducedAmount: [
          { required: true, validator: validateMoney, trigger: 'blur' }
        ],
        price: [
          { required: true, validator: validateMoney, trigger: 'blur' }
        ],
        discount: [
          { required: true, validator: validateDiscount, trigger: 'blur' }
        ],
        receiveNum: [
          { required: true, message: '请输入领取次数', trigger: 'blur', type: 'number' }
        ],
        validity: [
          { required: true, message: '请输入有效时间', trigger: 'blur' }
        ],
        couponSort: [
          { required: true, message: '请输入序号', trigger: 'blur', type: 'number' }
        ]
      },
      permission: {
        add: ['admin', 'coupon:add'],
        edit: ['admin', 'coupon:edit'],
        del: ['admin', 'coupon:del']
      }
    }
  },
  methods: {
    [CRUD.HOOK.beforeToEdit](crud, form) {
      form.couponType = form.couponType + ''
      form.receiveCondition = form.receiveCondition + ''
      this.$set(this.form, 'validity', [form.validityFrom, form.validityTo])
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
