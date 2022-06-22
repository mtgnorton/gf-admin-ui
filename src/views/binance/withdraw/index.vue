<template>
  <div class="app-container">

    <el-row :gutter="20">

      <!--用户数据-->
      <el-col :span="20" :xs="24">
        <el-form :model="queryParams" ref="queryForm" :inline="true">
          <el-form-item label="提现hash" prop="hash">
            <el-input
              v-model="queryParams.hash"
              placeholder="请输入提现hash"
              clearable
              size="small"
              style="width: 240px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="用户地址" prop="user_address">
            <el-input
              v-model="queryParams.user_address"
              placeholder="请输入用户地址"
              clearable
              size="small"
              style="width: 240px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="转入地址" prop="to">
            <el-input
              v-model="queryParams.to"
              placeholder="请输入转入地址"
              clearable
              size="small"
              style="width: 240px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="外部订单id" prop="external_order_id">
            <el-input
              v-model="queryParams.external_order_id"
              placeholder="请输入外部订单id"
              clearable
              size="small"
              style="width: 240px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>


          <el-form-item label="状态" prop="status">
            <el-select
              v-model="queryParams.status"
              placeholder="状态"
              clearable
              size="small"
              style="width: 240px"
            >
              <el-option label="待转出" value="wait_transfer"></el-option>
              <el-option label="转出中" value="process_transfer"></el-option>
              <el-option label="待通知" value="wait_notify"></el-option>
              <el-option label="通知中" value="process_notify"></el-option>
              <el-option label="完成" value="finish"></el-option>


            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>


        <el-table v-loading="loading" :data="withdrawList">
          <el-table-column label="Id" prop="id"/>
          <el-table-column label="货币" prop="symbol"/>
          <el-table-column label="用户地址" prop="user_address"/>
          <el-table-column label="外部用户id" prop="external_user_id"/>
          <el-table-column label="外部订单id" prop="external_order_id"/>
          <el-table-column label="提现hash" prop="hash"/>
          <el-table-column label="转出地址" prop="from"/>
          <el-table-column label="转入地址" prop="to"/>
          <el-table-column label="提现金额" prop="value"/>
          <el-table-column label="状态" prop="status"/>

          <el-table-column label="状态" align="center">
            <template slot-scope="scope">
              <el-tag type="success" v-if="scope.row.status=='wait_transfer'">待转出</el-tag>
              <el-tag type="success" v-if="scope.row.status=='process_transfer'">转出中</el-tag>
              <el-tag type="success" v-if="scope.row.status=='wait_notify'">待通知</el-tag>
              <el-tag type="success" v-if="scope.row.status=='process_notify'">通知中</el-tag>
              <el-tag type="success" v-if="scope.row.status=='finish'">完成</el-tag>
            </template>
          </el-table-column>

          <el-table-column label="创建时间" align="center" prop="create_at"/>
          <el-table-column label="更新时间" align="center" prop="update_at"/>
          <el-table-column
            label="操作"
            align="center"
            width="180"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
              >修改
              </el-button>
              <el-button
                v-if="scope.row.userId !== 1"
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
              >删除
              </el-button>

            </template>
          </el-table-column>

        </el-table>

        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="queryParams.page"
          :limit.sync="queryParams.size"
          @pagination="getList"
        />
      </el-col>
    </el-row>


    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" label-width="80px">
        <el-row>

          <el-form-item label="状态" prop="status">
            <el-select v-model="form.status" placeholder="请选择">
              <el-option key="wait_transfer" value="wait_transfer" label="待转出"></el-option>
              <el-option key="process_transfer" value="process_transfer" label="转出中"></el-option>
              <el-option key="wait_notify" value="wait_notify" label="待通知"></el-option>
              <el-option key="process_notify" value="process_notify" label="通知中"></el-option>
              <el-option key="finish" value="finish" label="完成"></el-option>

            </el-select>
          </el-form-item>


        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click.prevent="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>

import {
  listWithdraw, updateWithdraw, destroyWithdraw
} from '@/api/binance'

export default {
  name: 'withdraw',
  data() {
    return {
      loading: true,
      total: 0,
      withdrawList: [],
      // 查询参数
      queryParams: {
        page: 1,
        size: 10,
        hash: '',
        to: '',
        user_address: '',
        external_order_id: '',
        external_user_id: '',
        status: ''
      },
      form: {
        id: undefined,
        status: undefined
      },
      title: '',
      open: false
    }
  },

  created() {
    this.getList()
  },
  methods: {
    /** 查询列表 */
    getList() {
      this.loading = true
      listWithdraw(this.queryParams).then(response => {
          this.withdrawList = response.data.list
          this.total = response.data.total
          this.loading = false
        }
      )
    },
    /** 提交按钮 */
    submitForm: function() {

      var that = this

      updateWithdraw(this.form).then(response => {
        if (response.code === 0) {
          this.msgSuccess('修改成功')
          this.open = false
          this.getList()
        } else {
          this.msgError(response.msg)
        }
      }).catch(() => {
      })

    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.form.status = row.status
      this.form.id = row.id
      this.resetForm('form')
      this.open = true
      this.title = '修改合约'

    },
    /** 删除按钮操作 */
    handleDelete(row) {

      this.$confirm('是否确认删除用户编号为"' + row.id + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return destroyWithdraw({ 'id': row.id })
      }).then(() => {
        this.getList()
        this.msgSuccess('删除成功')
      }).catch(function() {
      })
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.resetForm('form')
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    resetQuery() {
      this.resetForm('queryForm')
      this.handleQuery()
    }
  }
}
</script>
