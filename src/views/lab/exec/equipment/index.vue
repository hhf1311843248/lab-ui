<!-- 设备监控（只读监控 + 状态展示） -->
<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="100px"
    >
      <el-form-item label="设备名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入设备名称"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="所属工段" prop="section">
        <el-input
          v-model="queryParams.section"
          placeholder="请输入所属工段"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable class="!w-240px">
          <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 设备监控列表 -->
  <ContentWrap>
    <el-table
      v-loading="loading"
      :data="list"
      :stripe="true"
      :show-overflow-tooltip="true"
      row-key="id"
    >
      <el-table-column label="设备名称" align="center" prop="name" min-width="160" />
      <el-table-column label="所属工段" align="center" prop="section" width="120" />
      <el-table-column label="状态" align="center" prop="status" width="120">
        <template #default="scope">
          <el-tag :type="equipmentStatusType(scope.row.status)">
            {{ equipmentStatusText(scope.row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="温度" align="center" prop="temp" width="120">
        <template #default="scope">
          {{ scope.row.temp }}{{ scope.row.temp ? '℃' : '' }}
        </template>
      </el-table-column>
      <el-table-column label="利用率" align="center" prop="util" width="120">
        <template #default="scope">
          {{ scope.row.util }}{{ scope.row.util ? '%' : '' }}
        </template>
      </el-table-column>
      <el-table-column label="OEE" align="center" prop="oee" width="120">
        <template #default="scope">
          {{ scope.row.oee }}{{ scope.row.oee ? '%' : '' }}
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination
      :total="total"
      v-model:page="queryParams.pageNo"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
  </ContentWrap>
</template>

<script setup lang="ts">
import { EquipmentApi, EquipmentVO } from '@/api/lab/equipment'

defineOptions({ name: 'LabExecEquipment' })

const loading = ref(true) // 列表的加载中
const list = ref<EquipmentVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  name: undefined,
  section: undefined,
  status: undefined
})
const queryFormRef = ref() // 搜索的表单

// 状态选项
const statusOptions = ['running', 'idle', 'alarm', 'maintenance']

/** 状态对应的中文文案 */
const equipmentStatusText = (status: string) => {
  switch (status) {
    case 'running':
      return '运行中'
    case 'idle':
      return '空闲'
    case 'alarm':
      return '报警'
    case 'maintenance':
      return '维修中'
    default:
      return status
  }
}

/** 状态对应的 el-tag 颜色 */
const equipmentStatusType = (status: string) => {
  switch (status) {
    case 'running':
      return 'success'
    case 'idle':
      return 'info'
    case 'alarm':
      return 'danger'
    case 'maintenance':
      return 'warning'
    default:
      return 'info'
  }
}

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await EquipmentApi.getPage(queryParams)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.pageNo = 1
  getList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  handleQuery()
}

/** 初始化 */
onMounted(() => {
  getList()
})
</script>