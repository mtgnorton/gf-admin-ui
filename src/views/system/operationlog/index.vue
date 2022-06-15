<template>
  <div class="app-container">

    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">

      <el-form-item label="类型" prop="businessType">
        <el-select
          v-model="queryParams.admin_id"
          placeholder="管理员名称"
          clearable
          size="small"
          style="width: 240px"
        >
          <el-option
            v-for="(v,k,index) in adminMap"
            :key="index"
            :label="v"
            :value="k"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="请求路径" prop="path">
        <el-input
          v-model="queryParams.path"
          placeholder="请输入请求路径"
          clearable
          style="width: 240px;"
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :data="list" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="编号" align="center" prop="id"/>
      <el-table-column label="管理员名称" align="center" prop="admin_name"/>
      <el-table-column label="请求路径" align="center" prop="path"/>
      <el-table-column label="路径名称" align="center" prop="path_name"/>

      <el-table-column label="请求方法" align="center" prop="method"/>
      <el-table-column label="请求参数" align="center" prop="params" :show-overflow-tooltip="true"/>
      <el-table-column label="响应结果" align="center" prop="response" :show-overflow-tooltip="true"/>

      <el-table-column label="操作日期" align="center" prop="oper_time" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.created_at) }}</span>
        </template>
      </el-table-column>
      <!--      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">-->
      <!--        <template slot-scope="scope">-->
      <!--          <el-button-->
      <!--            size="mini"-->
      <!--            type="text"-->
      <!--            icon="el-icon-view"-->
      <!--            @click="handleView(scope.row,scope.index)"-->
      <!--          >详细-->
      <!--          </el-button>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.page"
      :limit.sync="queryParams.size"
      @pagination="getList"
    />

  </div>
</template>
<script>
import { listOperationLog } from '../../../api/system/operation_log'

export default {
  name: 'OperationLog',
  data() {
    return {
      loading: false,
      queryParams: {
        page: 1,
        size: 10,
        path: '',
        admin_id: '',
      },
      list: [],
      total: 0,
      adminMap:{}
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      listOperationLog(this.queryParams).then(response => {

          this.list = response.data.list
          this.total = response.data.total
          this.loading = false
          this.adminMap = response.data.administrator_map
        }
      )
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.page = 1
      this.getList()
    },

    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id).join(',')
      this.multiple = !selection.length
    }
  }
}
</script>
