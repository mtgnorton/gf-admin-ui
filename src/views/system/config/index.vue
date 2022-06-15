<template>
  <div class="app-container">
  <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="后台配置" name="backend">

      <el-form ref="form" :model="backend" label-width="120px">
        <el-form-item label="开启登录验证码">
          <el-radio v-model="backend.is_open_verify_captcha" label="1">开启</el-radio>
          <el-radio v-model="backend.is_open_verify_captcha" label="0">关闭</el-radio>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submit">保存</el-button>
        </el-form-item>
      </el-form>

    </el-tab-pane>
    <el-tab-pane label="其他配置" name="otherSetting">其他配置</el-tab-pane>
  </el-tabs>
  </div>
</template>


<script>
import { listConfig, updateConfig } from '../../../api/system/config'

export default {
  data() {
    return {
      activeName: 'backend',
      backend: {}
    }
  },

  created() {
    this.getConfigs()
  },
  methods: {
    getConfigs() {
      listConfig({
        'modules': ['backend', 'other']
      }).then(response => {
        console.log(response.data, 6666)

        this.backend = response.data.data.backend
      })
    },

    submit() {
      updateConfig(this.activeName, this[this.activeName]).then(response => {

        this.msgSuccess(response.message)
      })
    },
    handleClick(tab, event) {
      console.log(tab, event)
    }
  }
}
</script>
