<template>
  <div class="app-container">

    <el-row :gutter="20">

      <!--用户数据-->
      <el-col :span="20" :xs="24">
        <el-form :model="queryParams" ref="queryForm" :inline="true" >
          <el-form-item label="地址" prop="address">
            <el-input
              v-model="queryParams.address"
              placeholder="请输入地址"
              clearable
              size="small"
              style="width: 240px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="外部用户id" prop="external_user_id">
            <el-input
              v-model="queryParams.external_user_id"
              placeholder="请输入外部用户id"
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


        <el-table v-loading="loading" :data="useraddresses">
          <el-table-column label="用户ID" prop="id"/>
          <el-table-column label="用户地址" prop="address" :show-overflow-tooltip="true"/>
          <el-table-column label="外部用户ID" prop="external_user_id" :show-overflow-tooltip="true" />

          <el-table-column label="创建时间" align="center" prop="create_at" />


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
  listUserAddress
} from '@/api/binance'

export default {
  name: 'useraddress',
  data() {
    return {
      loading: true,
      total: 0,
      useraddresses: [],
      // 查询参数
      queryParams: {
        page: 1,
        size: 10,
        address: '',
        externalUserId: 0
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
      listUserAddress(this.queryParams).then(response => {
          this.useraddresses = response.data.list
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
    },
  }
}
</script>
