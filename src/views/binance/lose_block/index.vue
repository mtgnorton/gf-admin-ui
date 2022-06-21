<template>
  <div class="app-container">

    <el-row :gutter="20">

      <!--用户数据-->
      <el-col :span="20" :xs="24">

        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              type="primary"
              icon="el-icon-plus"
              size="mini"
              @click="handleAdd"
            >新增
            </el-button>
          </el-col>

        </el-row>

        <el-table v-loading="loading" :data="contractList">
          <el-table-column label="id" prop="id"/>
          <el-table-column label="区块号" prop="number" :show-overflow-tooltip="true"/>

          <el-table-column label="是否检测">
            <template slot-scope="scope">
              <el-tag type="success" v-if="scope.row.status==0">否</el-tag>
              <el-tag type="success" v-if="scope.row.status==1">是</el-tag>

            </template>
          </el-table-column>

          <el-table-column label="创建时间" align="center" prop="create_at"/>

          <el-table-column
            label="操作"
            align="center"
            width="180"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope">
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
          <el-col :span="12">
            <el-form-item label="区块号" prop="number">
              <el-input v-model="form.number" placeholder="请输入区块号"/>
            </el-form-item>
          </el-col>
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
  listLoseBlock, storeLoseBlock, updateLoseBlock, infoLoseBlock, destroyLoseBlock
} from '@/api/binance'

export default {
  name: 'lose_block',
  data() {
    return {
      loading: true,
      total: 0,
      // 是否显示弹出层
      open: false,
      form: {},
      title: '',
      contractList: [],
      // 查询参数
      queryParams: {
        page: 1,
        size: 10
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
      listLoseBlock(this.queryParams).then(response => {
          this.contractList = response.data.list
          this.total = response.data.total
          this.loading = false
        }
      )
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        symbol: '',
        address: '',
        decimals: '',
        is_collect_open: true
      }
      this.resetForm('form')
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = '添加合约'

    },

    /** 删除按钮操作 */
    handleDelete(row) {

      this.$confirm('是否确认删除用户编号为"' + row.id + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return destroyLoseBlock({ 'id': row.id })
      }).then(() => {
        this.getList()
        this.msgSuccess('删除成功')
      }).catch(function() {
      })
    },
    /** 提交按钮 */
    submitForm: function() {

      var that = this

      storeLoseBlock(this.form).then(response => {
        if (response.code === 0) {
          this.msgSuccess('新增成功')
          this.open = false
          this.getList()
        } else {
          this.msgError(response.msg)
        }
      })

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
