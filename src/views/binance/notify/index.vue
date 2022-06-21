<template>
  <div class="app-container">

    <el-row :gutter="20">

      <!--用户数据-->
      <el-col :span="20" :xs="24">
        <el-form :model="queryParams" ref="queryForm" :inline="true" >
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
              <el-form label-position="left"  inline class="demo-table-expand">

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
              <el-tag type="success" v-if="scope.row.notify.status=='fail'">失败</el-tag>
            </template>
          </el-table-column>

          <el-table-column label="创建时间" align="center" prop="notify.create_at"/>


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
  listNotify
} from '@/api/binance'

export default {
  name: 'queueTask',
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
      listNotify(this.queryParams).then(response => {
          this.notifyList = response.data.list
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
