<template>
  <div class="app-container">

    <el-row :gutter="20">

      <!--用户数据-->
      <el-col :span="20" :xs="24">
        <el-form :model="queryParams" ref="queryForm" :inline="true">
          <el-form-item label="唯一标识" prop="unique_id">
            <el-input
              v-model="queryParams.unique_id"
              placeholder="请输入唯一标识"
              clearable
              size="small"
              style="width: 240px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>


          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>


        <el-table v-loading="loading" :data="notifyList">
          <el-table-column label="Id" prop="notify.id"/>
          <el-table-column label="类型" prop="notify.type">
            <template slot-scope="scope">
              <el-tag type="success" v-if="scope.row.notify.type=='recharge'">充值</el-tag>
              <el-tag type="success" v-if="scope.row.notify.type=='withdraw'">提现</el-tag>

            </template>
          </el-table-column>
          <el-table-column label="唯一标识" prop="notify.unique_id"/>
          <el-table-column label="通知数据" prop="notify.notify_data"/>
          <el-table-column label="通知地址" prop="notify.notify_address"/>
          <el-table-column label="失败次数" prop="notify.fail_amount"/>

          <el-table-column label="失败日志" prop="notify.logs" type="expand">
            <template slot-scope="props">
              <el-form label-position="left" inline class="demo-table-expand">

                <template v-if="props.row.logs != undefined">
                  <el-form-item v-for="(log,index) in props.row.logs" label="发送时间">
                    <span>{{ log.create_at }}</span>

                  </el-form-item>
                  <el-form-item v-for="(log,index) in props.row.logs" label="日志内容">
                    <span>{{ log.log }}</span>
                  </el-form-item>

                </template>


              </el-form>
            </template>
          </el-table-column>


          <el-table-column label="关联表id" prop="notify.relation_id"/>

          <el-table-column label="状态" align="center">
            <template slot-scope="scope">
              <el-tag type="success" v-if="scope.row.notify.status=='wait'">待通知</el-tag>
              <el-tag type="success" v-if="scope.row.notify.status=='finish'">完成</el-tag>
              <el-tag type="danger" v-if="scope.row.notify.status=='fail'">失败</el-tag>
            </template>
          </el-table-column>

          <el-table-column label="创建时间" align="center" prop="notify.create_at"/>
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
              <el-option key="wait" value="wait" label="待通知"></el-option>
              <el-option key="finish" value="finish" label="完成"></el-option>
              <el-option key="fail" value="fail" label="失败"></el-option>
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
  listNotify, updateNotify, destroyNotify
} from '@/api/binance'

export default {
  name: 'notify',
  data() {
    return {
      loading: true,
      total: 0,
      notifyList: [],
      // 查询参数
      queryParams: {
        page: 1,
        size: 10,
        unique_id: ''

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
      listNotify(this.queryParams).then(response => {
          this.notifyList = response.data.list
          this.total = response.data.total
          this.loading = false
        }
      )
    },
    /** 提交按钮 */
    submitForm: function() {

      var that = this

      updateNotify(this.form).then(response => {
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
      this.form.status = row.notify.status
      this.form.id = row.notify.id
      this.resetForm('form')
      this.open = true
      this.title = '修改合约'

    },
    /** 删除按钮操作 */
    handleDelete(row) {

      this.$confirm('是否确认删除用户编号为"' + row.notify.id + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return destroyNotify({ 'id': row.notify.id })
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
<style>
.demo-table-expand {
  font-size: 0;
}

.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}

.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>
