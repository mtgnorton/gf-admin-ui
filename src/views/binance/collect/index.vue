<template>
  <div class="app-container">

    <el-row :gutter="20">

      <!--用户数据-->
      <el-col :span="20" :xs="24">
        <el-form :model="queryParams" ref="queryForm" :inline="true">
          <el-form-item label="充值hash" prop="recharge_hash">
            <el-input
              v-model="queryParams.recharge_hash"
              placeholder="请输入充值hash"
              clearable
              size="small"
              style="width: 240px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="手续费hash" prop="handfee_hash">
            <el-input
              v-model="queryParams.handfee_hash"
              placeholder="请输入手续费hash"
              clearable
              size="small"
              style="width: 240px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="归集hash" prop="collect_hash">
            <el-input
              v-model="queryParams.collect_hash"
              placeholder="请输入归集hash"
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

          <el-form-item label="状态" prop="status">
            <el-select
              v-model="queryParams.status"
              placeholder="状态"
              clearable
              size="small"
              style="width: 240px"
            >
              <el-option label="待转手续费" value="wait_fee"></el-option>
              <el-option label="转出手续费中" value="process_fee"></el-option>
              <el-option label="待归集" value="wait_collect"></el-option>
              <el-option label="归集中" value="process_collect"></el-option>
              <el-option label="待通知" value="wait_notify"></el-option>
              <el-option label="通知中" value="process_notify"></el-option>
              <el-option label="完成" value="finish"></el-option>
              <el-option label="失败-余额不足" value="miss"></el-option>

            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>


        <el-table v-loading="loading" :data="collectList">
          <el-table-column label="Id" prop="id"/>
          <el-table-column label="货币" prop="symbol"/>
          <el-table-column label="用户地址" prop="user_address"/>
          <el-table-column label="充值hash" prop="recharge_hash"/>
          <el-table-column label="归集hash" prop="collect_hash"/>
          <el-table-column label="手续费hash" prop="handfee_hash"/>
          <el-table-column label="归集金额" prop="value"/>
          <el-table-column label="充值金额" prop="recharge_value"/>

          <el-table-column label="状态" align="center">
            <template slot-scope="scope">
              <el-tag type="success" v-if="scope.row.status=='wait_fee'">待转手续费</el-tag>
              <el-tag type="success" v-if="scope.row.status=='process_fee'">转出手续费中</el-tag>
              <el-tag type="success" v-if="scope.row.status=='wait_collect'">待归集</el-tag>
              <el-tag type="success" v-if="scope.row.status=='process_collect'">归集中</el-tag>
              <el-tag type="success" v-if="scope.row.status=='wait_notify'">待通知</el-tag>
              <el-tag type="success" v-if="scope.row.status=='process_notify'">通知中</el-tag>
              <el-tag type="success" v-if="scope.row.status=='finish'">完成</el-tag>
              <el-tag type="warning" v-if="scope.row.status=='fail_to_low_amount'">充值金额过少</el-tag>
              <el-tag type="danger" v-if="scope.row.status=='fail' || scope.row.status=='miss' ">失败</el-tag>
            </template>
          </el-table-column>

          <el-table-column label="创建时间" align="center" prop="create_at"/>
          <el-table-column label="更新时间" align="center" prop="update_at"/>


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
  listCollect
} from '@/api/binance'

export default {
  name: 'useraddress',
  data() {
    return {
      loading: true,
      total: 0,
      collectList: [],
      // 查询参数
      queryParams: {
        page: 1,
        size: 10,
        recharge_hash: '',
        handfee_hash: '',
        collect_hash: '',
        user_address: '',
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
      listCollect(this.queryParams).then(response => {
          this.collectList = response.data.list
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
