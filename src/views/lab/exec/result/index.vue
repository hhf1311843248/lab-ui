<!-- 实验结果（只读查看） -->
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
      <el-form-item label="结果编号" prop="resultNo">
        <el-input
          v-model="queryParams.resultNo"
          placeholder="请输入结果编号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="配方编号" prop="formulaCode">
        <el-input
          v-model="queryParams.formulaCode"
          placeholder="请输入配方编号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="工段" prop="section">
        <el-input
          v-model="queryParams.section"
          placeholder="请输入工段"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="检测项" prop="item">
        <el-input
          v-model="queryParams.item"
          placeholder="请输入检测项"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="综合判定" prop="comprehensive">
        <el-select
          v-model="queryParams.comprehensive"
          placeholder="请选择综合判定"
          clearable
          class="!w-240px"
        >
          <el-option v-for="item in judgeOptions" :key="item" :label="item" :value="item" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 实验结果列表 -->
  <ContentWrap>
    <el-table
      v-loading="loading"
      :data="list"
      :stripe="true"
      :show-overflow-tooltip="true"
      row-key="id"
    >
      <el-table-column label="结果编号" align="center" prop="resultNo" width="160" />
      <el-table-column label="配方编号" align="center" prop="formulaCode" width="140" />
      <el-table-column label="工段" align="center" prop="section" width="100" />
      <el-table-column label="检测项" align="center" prop="item" min-width="120" />
      <el-table-column label="检测方法" align="center" prop="method" min-width="140" />
      <el-table-column label="检测值" align="center" prop="value" min-width="100" />
      <el-table-column label="单项判定" align="center" prop="judge" width="100">
        <template #default="scope">
          <el-tag :type="judgeType(scope.row.judge)">{{ scope.row.judge }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="综合判定" align="center" prop="comprehensive" width="100">
        <template #default="scope">
          <el-tag :type="judgeType(scope.row.comprehensive)">{{ scope.row.comprehensive }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="判定时间"
        align="center"
        prop="judgeTime"
        :formatter="dateFormatter"
        width="170"
      />
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
import { dateFormatter } from '@/utils/formatTime'
import { ResultApi, ResultVO } from '@/api/lab/result'

defineOptions({ name: 'LabExecResult' })

const loading = ref(true) // 列表的加载中
const list = ref<ResultVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  resultNo: undefined,
  formulaCode: undefined,
  section: undefined,
  item: undefined,
  comprehensive: undefined
})
const queryFormRef = ref() // 搜索的表单

// 判定选项
const judgeOptions = ['合格', '不合格', '待判定']

/** 判定对应的 el-tag 颜色 */
const judgeType = (judge: string) => {
  switch (judge) {
    case '合格':
      return 'success'
    case '不合格':
      return 'danger'
    case '待判定':
      return 'info'
    default:
      return 'info'
  }
}

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await ResultApi.getPage(queryParams)
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