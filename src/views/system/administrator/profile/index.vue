<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="6" :xs="24">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>个人信息</span>
          </div>
          <div>
            <div class="text-center">
              <userAvatar :user="user"/>
            </div>
            <ul class="list-group list-group-striped">
              <li class="list-group-item">
                <svg-icon icon-class="user"/>
                用户名称
                <div class="pull-right">{{ user.username }}</div>
              </li>
              <!--              <li class="list-group-item">-->
              <!--                <svg-icon icon-class="peoples"/>-->
              <!--                所属角色-->
              <!--                <div class="pull-right">{{ roleGroup }}</div>-->
              <!--              </li>-->
              <li class="list-group-item">
                <svg-icon icon-class="date"/>
                创建日期
                <div class="pull-right">{{ user.created_at }}</div>
              </li>
            </ul>
          </div>
        </el-card>
      </el-col>
      <el-col :span="18" :xs="24">
        <el-card>
          <div slot="header" class="clearfix">
            <span>基本资料</span>
          </div>
          <el-form ref="form" :model="user" :rules="rules" label-width="80px">
            <el-form-item label="用户昵称" prop="nickname">
              <el-input v-model="user.nickname"/>
            </el-form-item>
            <el-form-item label="旧密码" prop="old_password">
              <el-input v-model="user.old_password" placeholder="请输入旧密码" type="password"/>
            </el-form-item>
            <el-form-item label="新密码" prop="password">
              <el-input v-model="user.password" placeholder="请输入新密码" type="password"/>
            </el-form-item>
            <el-form-item label="确认密码" prop="password_confirmed">
              <el-input v-model="user.password_confirmed" placeholder="请确认密码" type="password"/>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="mini" @click="submit">保存</el-button>
              <el-button type="danger" size="mini" @click="close">关闭</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import userAvatar from './userAvatar'
import userInfo from './userInfo'
import resetPwd from './resetPwd'
import { getUserProfile } from '@/api/system/user'
import { updateUserProfile } from '../../../../api/system/user'

export default {
  name: 'Profile',
  components: { userAvatar, userInfo, resetPwd },
  data() {
    const equalToPassword = (rule, value, callback) => {
      if (this.user.newPassword !== value) {
        callback(new Error('两次输入的密码不一致'))
      } else {
        callback()
      }
    }
    return {
      test: '1test',
      user: {

        oldPassword: undefined,
        newPassword: undefined,
        confirmPassword: undefined
      },
      // 表单校验
      rules: {
        oldPassword: [
          { required: true, message: '旧密码不能为空', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: '新密码不能为空', trigger: 'blur' },
          { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: '确认密码不能为空', trigger: 'blur' },
          { required: true, validator: equalToPassword, trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getUser()
  },
  methods: {
    getUser() {
      getUserProfile().then(response => {
        this.user = response.data
        console.log(response.data)

      })
    },
    submit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          updateUserProfile(this.user).then(
            response => {
              if (response.code === 0) {
                this.msgSuccess('修改成功')
              } else {
                this.msgError(response.msg)
              }
            }
          )
        }
      })
    },
    close() {
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push({ path: '/index' })
    }
  }
}
</script>
