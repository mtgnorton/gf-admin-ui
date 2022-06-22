<template>
  <div class="app-container">

    <el-row :gutter="20">

      <!--用户数据-->
      <el-col :span="20" :xs="24">
        <el-form :model="queryParams" ref="queryForm" :inline="true">
          <el-form-item label="Hash" prop="hash">
            <el-input
              v-model="queryParams.hash"
              placeholder="请输入Hash"
              clearable
              size="small"
              style="width: 240px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="转出地址" prop="from">
            <el-input
              v-model="queryParams.from"
              placeholder="请输入转出地址"
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


          <el-form-item label="状态" prop="status">
            <el-select
              v-model="queryParams.status"
              placeholder="状态"
              clearable
              size="small"
              style="width: 240px"
            >
              <el-option label="待转出" value="wait"></el-option>
              <el-option label="转出中" value="process"></el-option>
              <el-option label="完成" value="success"></el-option>

            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>


        <el-table v-loading="loading" :data="queueTasks">
          <el-table-column label="Id" prop="task.id"/>
          <el-table-column label="hash" prop="task.hash"/>
          <el-table-column label="货币" prop="task.symbol"/>
          <el-table-column label="转出地址" prop="task.from"/>
          <el-table-column label="转入地址" prop="task.to"/>
          <el-table-column label="金额" prop="task.value"/>
          <el-table-column label="实际手续费(ether)" prop="task.actual_fee"/>
          <el-table-column label="nonce" prop="task.nonce"/>
          <el-table-column label="类型" prop="task.type"/>
          <el-table-column label="失败次数" prop="task.fail_amount"/>
          <el-table-column label="失败日志" prop="task.logs" type="expand">
            <template slot-scope="props">
              <el-form label-position="left" class="demo-table-expand">

                <template v-if="props.row.logs != undefined">
                  <el-form-item v-for="(log,index) in props.row.logs" label="日志内容">
                    <span>{{ log.log }}</span>
                  </el-form-item>

                </template>


              </el-form>
            </template>
          </el-table-column>


          <el-table-column label="关联表id" prop="task.relation_id"/>

          <el-table-column label="状态" align="center">
            <template slot-scope="scope">
              <el-tag type="success" v-if="scope.row.task.status=='wait'">待转出</el-tag>
              <el-tag type="success" v-if="scope.row.task.status=='process'">转出中</el-tag>
              <el-tag type="success" v-if="scope.row.task.status=='success'">成功</el-tag>
              <el-tag type="danger" v-if="scope.row.task.status=='fail'">失败</el-tag>

            </template>
          </el-table-column>

          <el-table-column label="创建时间" align="center" prop="task.create_at"/>
          <el-table-column label="更新时间" align="center" prop="task.update_at"/>

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
              <el-option key="wait" value="wait" label="待转出"></el-option>
              <el-option key="process" value="process" label="转出中"></el-option>
              <el-option key="success" value="success" label="成功"></el-option>
              <el-option key="fail" value="fail" label="失败"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="失败次数" prop="fail_amount">
            <el-input-number :min="0" v-model="form.fail_amount" placeholder="失败次数"/>

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
  listQueueTask, updateQueueTask,destroyQueueTask
} from '@/api/binance'

export default {
  name: 'queueTask',
  data() {
    return {
      loading: true,
      total: 0,
      queueTasks: [],
      // 查询参数
      queryParams: {
        page: 1,
        size: 10,
        hash: '',
        from: '',
        to: '',
        status: ''

      },
      form: {
        id: undefined,
        status: undefined,
        fail_amount: undefined
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
      listQueueTask(this.queryParams).then(response => {
          this.queueTasks = response.data.list
          this.total = response.data.total
          this.loading = false
        }
      )
    },

    /** 提交按钮 */
    submitForm: function() {

      var that = this

      updateQueueTask(this.form).then(response => {
        if (response.code === 0) {
          this.msgSuccess('修改成功')
          this.open = false
          this.getList()
        } else {
          this.msgError(response.msg)
        }
      }).catch(() => {
        that.$set(that.form, 'role_ids', that.form.role_ids)
      })

    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.form.status = row.task.status
      this.form.fail_amount = row.task.fail_amount
      this.form.id = row.task.id
      this.resetForm('form')
      this.open = true
      this.title = '修改合约'

    },
    /** 删除按钮操作 */
    handleDelete(row) {

      this.$confirm('是否确认删除用户编号为"' + row.task.id + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return destroyQueueTask({ 'id': row.task.id })
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
