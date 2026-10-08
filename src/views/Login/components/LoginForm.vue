<template>
  <el-form
    v-show="getShow"
    ref="formLogin"
    :model="loginData.loginForm"
    :rules="LoginRules"
    class="login-form"
    label-position="top"
    label-width="120px"
  >
    <el-row class="mx-[-10px]">
      <el-col :span="24" class="px-10px">
        <el-form-item>
          <LoginFormTitle class="w-full" />
        </el-form-item>
      </el-col>
      <el-col :span="24" class="px-10px">
        <el-form-item v-if="loginData.tenantEnable === 'true'" prop="tenantName">
          <el-select
            v-model="loginData.loginForm.tenantName"
            class="w-full"
            :placeholder="t('login.tenantSelectPlaceholder')"
            filterable
          >
            <template #prefix>
              <Icon icon="ep:house" />
            </template>
            <el-option v-for="tenant in tenantList" :key="tenant.id" :label="tenant.name" :value="tenant.name" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="24" class="px-10px">
        <el-form-item prop="username">
          <el-input
            v-model="loginData.loginForm.username"
            :placeholder="t('login.usernamePlaceholder')"
            :prefix-icon="iconAvatar"
          />
        </el-form-item>
      </el-col>
      <el-col :span="24" class="px-10px">
        <el-form-item prop="password">
          <el-input
            v-model="loginData.loginForm.password"
            :placeholder="t('login.passwordPlaceholder')"
            :prefix-icon="iconLock"
            show-password
            type="password"
            @keyup.enter="getCode()"
          />
        </el-form-item>
      </el-col>
      <el-col :span="24" class="px-10px">
        <el-form-item>
          <el-row justify="space-between" style="width: 100%">
            <el-col :span="6">
              <el-checkbox v-model="loginData.loginForm.rememberMe">
                {{ t('login.remember') }}
              </el-checkbox>
            </el-col>
            <el-col :offset="6" :span="12">
              <el-link
                class="float-right"
                type="primary"
                @click="setLoginState(LoginStateEnum.RESET_PASSWORD)"
              >
                {{ t('login.forgetPassword') }}
              </el-link>
            </el-col>
          </el-row>
        </el-form-item>
      </el-col>
      <el-col :span="24" class="px-10px">
        <el-form-item>
          <el-button :loading="loginLoading" class="w-full" type="primary" @click="getCode()">
            {{ t('login.login') }}
          </el-button>
        </el-form-item>
      </el-col>
      <Verify
        v-if="loginData.captchaEnable === 'true'"
        ref="verify"
        :captchaType="captchaType"
        :imgSize="{ width: '400px', height: '200px' }"
        mode="pop"
        @success="handleLogin"
      />
      <el-col :span="24" class="px-10px">
        <el-form-item>
          <el-button class="w-full sso-btn" @click="setLoginState(LoginStateEnum.SSO)">
            SSO登录/注册
          </el-button>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>
<script lang="ts" setup>
import { ElLoading } from 'element-plus'
import LoginFormTitle from './LoginFormTitle.vue'
import type { RouteLocationNormalizedLoaded } from 'vue-router'

import { useIcon } from '@/hooks/web/useIcon'

import * as authUtil from '@/utils/auth'
import { usePermissionStore } from '@/store/modules/permission'
import * as LoginApi from '@/api/login'
import { LoginStateEnum, useFormValid, useLoginState } from './useLogin'

defineOptions({ name: 'LoginForm' })

const { t } = useI18n()
const iconAvatar = useIcon({ icon: 'ep:avatar' })
const iconLock = useIcon({ icon: 'ep:lock' })
const formLogin = ref()
const { validForm } = useFormValid(formLogin)
const { setLoginState, getLoginState } = useLoginState()
const { currentRoute, push } = useRouter()
const permissionStore = usePermissionStore()
const redirect = ref<string>('')
const loginLoading = ref(false)
const verify = ref()
const captchaType = ref('blockPuzzle') // blockPuzzle 滑块 clickWord 点击文字 pictureWord 文字验证码
const tenantList = ref<{ id: number; name: string }[]>([]) // 组织/厂区（租户）列表

const getShow = computed(() => unref(getLoginState) === LoginStateEnum.LOGIN)

const LoginRules = {
  tenantName: [required],
  username: [required],
  password: [required]
}
const loginData = reactive({
  isShowPassword: false,
  captchaEnable: import.meta.env.VITE_APP_CAPTCHA_ENABLE,
  tenantEnable: import.meta.env.VITE_APP_TENANT_ENABLE,
  loginForm: {
    tenantName: import.meta.env.VITE_APP_DEFAULT_LOGIN_TENANT || '',
    username: import.meta.env.VITE_APP_DEFAULT_LOGIN_USERNAME || '',
    password: import.meta.env.VITE_APP_DEFAULT_LOGIN_PASSWORD || '',
    captchaVerification: '',
    rememberMe: true // 默认记录我。如果不需要，可手动修改
  }
})

// 获取验证码
const getCode = async () => {
  // 情况一，未开启：则直接登录
  if (loginData.captchaEnable === 'false') {
    await handleLogin({})
  } else {
    // 情况二，已开启：则展示验证码；只有完成验证码的情况，才进行登录
    // 弹出验证码
    verify.value.show()
  }
}
// 获取租户 ID
const getTenantId = async () => {
  if (loginData.tenantEnable === 'true') {
    const res = await LoginApi.getTenantIdByName(loginData.loginForm.tenantName)
    authUtil.setTenantId(res)
  }
}
// 记住我
const getLoginFormCache = () => {
  const loginForm = authUtil.getLoginForm()
  if (loginForm) {
    loginData.loginForm = {
      ...loginData.loginForm,
      username: loginForm.username ? loginForm.username : loginData.loginForm.username,
      password: loginForm.password ? loginForm.password : loginData.loginForm.password,
      rememberMe: loginForm.rememberMe,
      tenantName: loginForm.tenantName ? loginForm.tenantName : loginData.loginForm.tenantName
    }
  }
}
// 根据域名，获得租户信息
const getTenantByWebsite = async () => {
  if (loginData.tenantEnable === 'true') {
    const website = location.host
    const res = await LoginApi.getTenantByWebsite(website)
    if (res) {
      loginData.loginForm.tenantName = res.name
      authUtil.setTenantId(res.id)
    }
  }
}
// 加载组织/厂区（租户）列表
const getTenantList = async () => {
  if (loginData.tenantEnable === 'true') {
    tenantList.value = (await LoginApi.getTenantList()) || []
  }
}
const loading = ref() // ElLoading.service 返回的实例
// 登录
const handleLogin = async (params: any) => {
  loginLoading.value = true
  try {
    await getTenantId()
    const data = await validForm()
    if (!data) {
      return
    }
    const loginDataLoginForm = { ...loginData.loginForm }
    loginDataLoginForm.captchaVerification = params.captchaVerification
    const res = await LoginApi.login(loginDataLoginForm)
    if (!res) {
      return
    }
    loading.value = ElLoading.service({
      lock: true,
      text: '正在加载系统中...',
      background: 'rgba(0, 0, 0, 0.7)'
    })
    if (loginDataLoginForm.rememberMe) {
      authUtil.setLoginForm(loginDataLoginForm)
    } else {
      authUtil.removeLoginForm()
    }
    authUtil.setToken(res)
    if (!redirect.value) {
      redirect.value = '/'
    }
    // 判断是否为SSO登录
    if (redirect.value.indexOf('sso') !== -1) {
      window.location.href = window.location.href.replace('/login?redirect=', '')
    } else {
      await push({ path: redirect.value || permissionStore.addRouters[0].path })
    }
  } finally {
    loginLoading.value = false
    loading.value?.close()
  }
}

watch(
  () => currentRoute.value,
  (route: RouteLocationNormalizedLoaded) => {
    redirect.value = route?.query?.redirect as string
  },
  {
    immediate: true
  }
)
onMounted(() => {
  getLoginFormCache()
  getTenantByWebsite()
  getTenantList()
})
</script>

<style lang="scss" scoped>
// 压缩表单项纵向间距，让登录组件更紧凑
:deep(.el-form-item) {
  margin-bottom: 14px;
}

// 输入框：白底、浅灰描边，聚焦橙色
:deep(.el-input__wrapper) {
  min-height: 46px;
  background: #fff;
  border: 1px solid #dcdcdc;
  border-radius: 3px;
  box-shadow: none !important;
  transition:
    border-color 0.15s,
    box-shadow 0.15s;

  &.is-focus {
    border-color: #ea5420;
    box-shadow: 0 0 0 2px rgba(234, 84, 32, 0.18) !important;
  }
}

// 组织/厂区下拉：白底、浅灰描边，与输入框一致
:deep(.el-select__wrapper) {
  min-height: 46px;
  background: #fff;
  border: 1px solid #dcdcdc;
  border-radius: 3px;
  box-shadow: none !important;
  transition:
    border-color 0.15s,
    box-shadow 0.15s;

  &.is-focused {
    border-color: #ea5420;
    box-shadow: 0 0 0 2px rgba(234, 84, 32, 0.18) !important;
  }
}

// 记住我勾选框：橙色圆形
:deep(.el-checkbox__input .el-checkbox__inner) {
  border-radius: 50%;
}

:deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  background-color: #ea5420;
  border-color: #ea5420;
}

:deep(.el-checkbox__input.is-checked .el-checkbox__inner::after) {
  border-color: #fff;
}

// 忘记密码链接：橙色
:deep(.el-link--primary) {
  color: #ea5420;
}

// 登录按钮：橙色纯色
:deep(.el-button--primary) {
  height: 46px;
  background: #ea5420;
  border: none;
  border-radius: 3px;
  letter-spacing: 0.06em;

  &:hover,
  &:focus {
    background: #ea5420;
    filter: brightness(1.06);
  }
}

// SSO 按钮：橙色纯色，与登录按钮一致
.sso-btn {
  height: 46px;
  background: #ea5420;
  border: none;
  border-radius: 3px;
  color: #fff;
  letter-spacing: 0.06em;

  &:hover,
  &:focus {
    background: #ea5420;
    filter: brightness(1.06);
  }
}
</style>

<style lang="scss">
// 暗色模式下登录表单适配：深色输入框、白色文字
html.dark .login-form .el-input__wrapper {
  background: #3f4752;
  border-color: #525b68;
}

html.dark .login-form .el-input__wrapper.is-focus {
  border-color: #ea5420;
}

html.dark .login-form .el-select__wrapper {
  background: #3f4752;
  border-color: #525b68;
}

html.dark .login-form .el-select__wrapper.is-focused {
  border-color: #ea5420;
}

html.dark .login-form .el-input__inner {
  color: #fff;
}

html.dark .login-form .el-select__selected-item {
  color: #fff;
}
</style>
