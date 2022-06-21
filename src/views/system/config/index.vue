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


      <el-tab-pane label="币安出入金配置" name="binance">
        <el-form ref="form" :model="binance" label-width="120px">
          <el-form-item label="归集地址">
            <el-input v-model="binance.collect_address"></el-input>
          </el-form-item>
          <el-form-item label="手续费和提现地址">
            <el-input v-model="binance.fee_withdraw_address"></el-input>
          </el-form-item>
          <el-form-item label="手续费和提现地址私钥">
            <el-input v-model="binance.fee_withdraw_private_key"></el-input>
          </el-form-item>

          <el-form-item label="通知地址">
            <el-input v-model="binance.notify_address" placeholder="需要以http或https开头"></el-input>
          </el-form-item>

          <el-form-item label="最小充值金额(单位ether)">
            <el-input v-model="binance.min_collect_amount" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="网络选择">

            <el-radio-group v-model="binance.net_type">
              <el-radio label="main_net">主网</el-radio>
              <el-radio label="test_net">测试网</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submit">保存</el-button>
          </el-form-item>
        </el-form>

      </el-tab-pane>
    </el-tabs>
  </div>
</template>


<script>
import { listConfig, updateConfig } from '../../../api/system/config'

export default {
  data() {
    return {
      activeName: 'backend',
      backend: {},
      binance: {}
    }
  },

  created() {
    this.getConfigs()
  },
  methods: {
    getConfigs() {
      listConfig({
        'modules': ['backend', 'binance']
      }).then(response => {
        console.log(response.data, 6666)

        this.backend = response.data.data.backend
        this.binance = response.data.data.binance
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
