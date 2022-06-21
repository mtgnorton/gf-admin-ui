<template>
  <div class="app-container">

    <el-row :gutter="20">

      <!--用户数据-->
      <el-col :span="20" :xs="24">
        <el-form :model="queryParams" ref="queryForm" :inline="true" >
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
          <el-table-column label="失败次数" prop="task.fail_amount" />
          <el-table-column label="失败日志" prop="task.logs" type="expand">
          <template slot-scope="props">
            <el-form label-position="left"  class="demo-table-expand">

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
              <el-tag type="warning" v-if="scope.row.task.status=='fail'">失败</el-tag>

            </template>
          </el-table-column>

          <el-table-column label="创建时间" align="center" prop="task.create_at"/>
          <el-table-column label="更新时间" align="center" prop="task.update_at"/>


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
  </div>
</template>
<script>

import {
  listQueueTask
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

      }
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
