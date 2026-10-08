<!-- 基础数据-综合判定维护（供应商同步，仅查看） -->
<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="90px"
    >
      <el-form-item label="所属段" prop="segmentCode">
        <el-select v-model="queryParams.segmentCode" placeholder="请选择所属段" clearable class="!w-200px">
          <el-option
            v-for="item in LabSectionEnum"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="判定方式" prop="mode">
        <el-select v-model="queryParams.mode" placeholder="请选择判定方式" clearable class="!w-200px">
          <el-option
            v-for="item in LabComprehensiveModeEnum"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="规则名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入规则名称"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="供应商数据ID" align="center" prop="dataId" width="110" />
      <el-table-column label="规则名称" align="center" prop="name" min-width="200" />
      <el-table-column label="所属段" align="center" width="100">
        <template #default="scope">
          {{ formatSyncSegment(scope.row.segmentCode) }}
        </template>
      </el-table-column>
      <el-table-column label="判定方式" align="center" width="120">
        <template #default="scope">
          {{ getLabComprehensiveModeLabel(scope.row.mode) }}
        </template>
      </el-table-column>
      <el-table-column label="参与检测项目" align="center" min-width="200">
        <template #default="scope">
          {{ formatProjectTypes(scope.row.projectTypes) }}
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" width="80">
        <template #default="scope">
          <el-tag :type="scope.row.status === 1 ? 'success' : 'info'">
            {{ scope.row.status === 1 ? '启用' : '停用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" align="center" prop="dataUpdateTime" width="180" />
      <el-table-column label="操作" align="center" width="90" fixed="right">
        <template #default="scope">
          <el-button link type="primary" @click="openDetail(scope.row.id)">查看</el-button>
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

  <!-- 查看详情弹窗（供应商定义，仅查看） -->
  <el-dialog v-model="detailVisible" :title="detailTitle" width="720px" append-to-body>
    <el-descriptions :column="2" border>
      <el-descriptions-item label="所属段">{{ formatSyncSegment(detailData.segmentCode) }}</el-descriptions-item>
      <el-descriptions-item label="判定方式">{{ getLabComprehensiveModeLabel(detailData.mode) }}</el-descriptions-item>
      <el-descriptions-item label="规则名称" :span="2">{{ detailData.name }}</el-descriptions-item>
      <el-descriptions-item label="参与检测项目" :span="2">
        {{ formatProjectTypes(detailData.projectTypes) }}
      </el-descriptions-item>
      <el-descriptions-item label="主检测项目">{{ getLabProjectTypeLabel(detailData.mainProjectType) || '—' }}</el-descriptions-item>
    </el-descriptions>
    <el-divider content-position="left">综合判定配置</el-divider>
    <div class="config-box">
      <JsonView :value="parseJson(detailData.comprehensiveJson)" context="comprehensive" />
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import {
  getSyncComprehensive,
  getSyncComprehensivePage,
  SyncComprehensiveVO,
  LabComprehensiveModeEnum,
  getLabComprehensiveModeLabel,
  getLabProjectTypeLabel,
  formatSyncSegment
} from '@/api/lab/sync'
import { LabSectionEnum } from '@/api/lab/resource'
import JsonView from '@/views/lab/basedata/sync/components/JsonView.vue'

defineOptions({ name: 'LabBasedataComprehensive' })

const loading = ref(true) // 列表的加载中
const list = ref<SyncComprehensiveVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  segmentCode: undefined,
  mode: undefined,
  name: undefined
})
const queryFormRef = ref() // 搜索的表单

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await getSyncComprehensivePage(queryParams)
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

/** 参与检测项目（逗号分隔的编号转中文） */
const formatProjectTypes = (types?: string) => {
  if (!types) {
    return '—'
  }
  return types
    .split(',')
    .map((t) => getLabProjectTypeLabel(Number(t)))
    .filter(Boolean)
    .join('、')
}

// ==================== 查看详情 ====================
const detailVisible = ref(false) // 弹窗的是否展示
const detailTitle = ref('') // 弹窗的标题
const detailData = ref<SyncComprehensiveVO>({} as SyncComprehensiveVO) // 详情数据

/** 打开详情弹窗 */
const openDetail = async (id: number) => {
  detailVisible.value = true
  const data = await getSyncComprehensive(id)
  detailData.value = data
  detailTitle.value = '综合判定 · ' + data.name
}

/** 解析 JSON 字符串 */
const parseJson = (json?: string) => {
  if (!json) {
    return {}
  }
  try {
    return JSON.parse(json)
  } catch {
    return {}
  }
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>

<style scoped>
.config-box {
  max-height: 380px;
  overflow-y: auto;
  padding: 4px 12px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background-color: var(--bg-card);
}
</style>
