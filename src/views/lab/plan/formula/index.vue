<!-- 实验策划-配方 -->
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
      <el-form-item label="配方编号" prop="code">
        <el-input
          v-model="queryParams.code"
          placeholder="请输入配方编号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-200px"
        />
      </el-form-item>
      <el-form-item label="工段" prop="section">
        <el-select v-model="queryParams.section" placeholder="请选择工段" clearable class="!w-200px">
          <el-option v-for="item in sectionOptions" :key="item" :label="item" :value="item" />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable class="!w-200px">
          <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
        <el-button
          type="primary"
          plain
          @click="openForm('create')"
          v-hasPermi="['lab:formula:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="配方编号" align="center" prop="code" min-width="140">
        <template #default="scope">
          <el-button link type="primary" @click="openForm('update', scope.row.id)">
            {{ scope.row.code }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="工段" align="center" prop="section" min-width="120" />
      <el-table-column label="版本" align="center" prop="version" min-width="80" />
      <el-table-column label="当前版本" align="center" prop="current" min-width="90" />
      <el-table-column label="研发分类" align="center" prop="rdClass" min-width="110" />
      <el-table-column label="正负极" align="center" prop="pole" min-width="80" />
      <el-table-column label="优先级" align="center" prop="prio" min-width="80" />
      <el-table-column label="状态" align="center" prop="status" min-width="90" />
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="170px"
      />
      <el-table-column label="操作" align="center" width="160" fixed="right">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['lab:formula:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['lab:formula:delete']"
          >
            删除
          </el-button>
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

  <!-- 表单弹窗：新增/修改 -->
  <el-dialog v-model="dialogVisible" :title="dialogTitle" width="1100px" append-to-body>
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="130px"
      v-loading="formLoading"
    >
      <el-tabs v-model="activeTab">
        <!-- 基础信息 -->
        <el-tab-pane label="基础信息" name="base">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="配方编号" prop="code">
                <el-input v-model="formData.code" placeholder="请输入配方编号" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="工段" prop="section">
                <el-select
                  v-model="formData.section"
                  placeholder="请选择工段"
                  class="!w-100%"
                  clearable
                  @change="handleSectionChange"
                >
                  <el-option v-for="item in sectionOptions" :key="item" :label="item" :value="item" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="版本" prop="version">
                <el-input v-model="formData.version" placeholder="请输入版本" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="当前版本" prop="current">
                <el-radio-group v-model="formData.current">
                  <el-radio value="是">是</el-radio>
                  <el-radio value="否">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="体系编号" prop="sysCode">
                <el-input v-model="formData.sysCode" placeholder="请输入体系编号" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="研发分类" prop="rdClass">
                <el-input v-model="formData.rdClass" placeholder="请输入研发分类" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="正负极" prop="pole">
                <el-input v-model="formData.pole" placeholder="请输入正负极" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="代次" prop="gen">
                <el-input v-model="formData.gen" placeholder="请输入代次" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="标称比容量" prop="cap">
                <el-input v-model="formData.cap" placeholder="请输入标称比容量(mAh/g)" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="材料化学式" prop="formula">
                <el-input v-model="formData.formula" placeholder="请输入材料化学式" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="工艺路线" prop="route">
                <el-select
                  v-model="formData.route"
                  placeholder="请选择工艺路线"
                  class="!w-100%"
                  clearable
                  :disabled="!formData.section"
                  @change="handleRouteChange($event, false)"
                >
                  <el-option
                    v-for="r in routeOptions"
                    :key="r.id"
                    :label="`${r.code} | ${r.name}`"
                    :value="r.code"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="优先级" prop="prio">
                <el-input v-model="formData.prio" placeholder="请输入优先级" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="验证背景一级" prop="bg1">
                <el-input v-model="formData.bg1" placeholder="请输入验证背景一级" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="验证背景二级" prop="bg2">
                <el-input v-model="formData.bg2" placeholder="请输入验证背景二级" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="攻坚点一级" prop="atk1">
                <el-input v-model="formData.atk1" placeholder="请输入攻坚点一级" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="攻坚点二级" prop="atk2">
                <el-input v-model="formData.atk2" placeholder="请输入攻坚点二级" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="变量因子" prop="factor">
                <el-input v-model="formData.factor" placeholder="请输入变量因子" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="验证目的" prop="purpose">
                <el-input v-model="formData.purpose" placeholder="请输入验证目的" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="状态" prop="status">
                <el-select v-model="formData.status" placeholder="请选择状态" class="!w-100%">
                  <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-tab-pane>

        <!-- 投料信息（仅配方段/合成段） -->
        <el-tab-pane v-if="showPlanTabs" label="投料信息" name="feed">
          <el-table :data="formData.feedList" border>
            <el-table-column label="明细序号" type="index" align="center" width="60" />
            <el-table-column label="投料工序" prop="feedProc" min-width="110">
              <template #default="{ row }">
                <el-form-item class="mb-0px!">
                  <el-input v-model="row.feedProc" placeholder="投料工序" />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="序号" prop="seq" min-width="80">
              <template #default="{ row }">
                <el-form-item class="mb-0px!">
                  <el-input-number v-model="row.seq" :min="0" controls-position="right" class="!w-100%" />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="投料顺序" prop="feedSeq" min-width="90">
              <template #default="{ row }">
                <el-form-item class="mb-0px!">
                  <el-input-number v-model="row.feedSeq" :min="0" controls-position="right" class="!w-100%" />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="物料编号" prop="materialCode" min-width="120">
              <template #default="{ row }">
                <el-form-item class="mb-0px!">
                  <el-input v-model="row.materialCode" placeholder="物料编号" />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="一级分类" prop="cat1" min-width="100">
              <template #default="{ row }">
                <el-form-item class="mb-0px!">
                  <el-input v-model="row.cat1" placeholder="一级分类" />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="二级分类" prop="cat2" min-width="100">
              <template #default="{ row }">
                <el-form-item class="mb-0px!">
                  <el-input v-model="row.cat2" placeholder="二级分类" />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="投料量" prop="quantity" min-width="100">
              <template #default="{ row }">
                <el-form-item class="mb-0px!">
                  <el-input-number v-model="row.quantity" :min="0" controls-position="right" class="!w-100%" />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="单位" prop="unit" min-width="80">
              <template #default="{ row }">
                <el-form-item class="mb-0px!">
                  <el-input v-model="row.unit" placeholder="单位" />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="称量偏差%" prop="deviation" min-width="100">
              <template #default="{ row }">
                <el-form-item class="mb-0px!">
                  <el-input-number v-model="row.deviation" :min="0" controls-position="right" class="!w-100%" />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="60">
              <template #default="{ $index }">
                <el-button link type="danger" @click="handleDeleteFeed($index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-button type="primary" plain class="mt-2" @click="handleAddFeed">
            <Icon icon="ep:plus" class="mr-5px" /> 新增投料
          </el-button>
        </el-tab-pane>

        <!-- 实验方案（仅配方段/合成段，UI 参照原型 dashboard-new-02） -->
        <el-tab-pane v-if="showPlanTabs" label="实验方案" name="scheme">
          <div class="scheme-head">实验方案 · 按所选工艺路线的工序维护参数</div>
          <!-- 工序页签 -->
          <div class="scheme-subtabs">
            <div
              v-for="(step, i) in formData.routeSteps"
              :key="i"
              class="subtab"
              :class="{ active: activeProc === step.procName, 'is-disabled': step.procName === '称量' }"
              @click="onProcTabClick(step.procName)"
            >
              {{ i + 1 }}. {{ step.procName }}
            </div>
          </div>
          <div v-if="!formData.routeSteps.length" class="scheme-empty">
            请先在「基础信息」页签选择工艺路线
          </div>
          <!-- 工序配置面板 -->
          <div
            v-for="step in formData.routeSteps"
            :key="step.procName"
            v-show="activeProc === step.procName"
            class="scheme-pane"
          >
            <!-- 称量：置灰，无配置 -->
            <div v-if="step.procName === '称量'" class="scheme-hint">称量工序无需配置参数</div>

            <!-- 合浆：脱泡方法 + 震荡频率（参照示例图片） -->
            <div v-else-if="step.procName === '合浆'" class="form-grid two">
              <el-form-item label="脱泡方法">
                <el-select v-model="formData.schemeMap['合浆']['脱泡方法']" placeholder="请选择脱泡方法" class="!w-100%">
                  <el-option
                    v-for="m in defoamOptions"
                    :key="m.id"
                    :label="m.projectName"
                    :value="m.projectName"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="震荡频率(r/min)">
                <el-input-number
                  v-model="formData.schemeMap['合浆']['震荡频率(r/min)']"
                  :min="50"
                  :max="3000"
                  class="!w-100%"
                />
              </el-form-item>
            </div>

            <!-- 表征：检查项表格 + 综合判定 -->
            <div v-else-if="step.procName === '表征'">
              <div class="form-sec">表征检测项</div>
              <el-table :data="charItems" border size="small">
                <el-table-column label="检测项" min-width="160">
                  <template #default="{ row }">{{ row }}</template>
                </el-table-column>
                <el-table-column label="检测方法">
                  <template #default="{ row }">
                    <el-select v-model="formData.schemeMap['表征'][`${row}-方法`]" placeholder="请选择" class="!w-100%">
                      <el-option
                        v-for="m in methodOptions[row] || []"
                        :key="m.id"
                        :label="m.projectName"
                        :value="m.projectName"
                      />
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column label="检测判定">
                  <template #default="{ row }">
                    <el-select v-model="formData.schemeMap['表征'][`${row}-判定`]" placeholder="请选择" class="!w-100%">
                      <el-option v-for="j in judgeOptions[row] || []" :key="j.id" :label="j.name" :value="j.name" />
                    </el-select>
                  </template>
                </el-table-column>
              </el-table>
              <div class="form-sec" style="margin-top: 16px">综合判定</div>
              <el-select
                v-model="formData.schemeMap['表征']['综合判定']"
                placeholder="请选择综合判定"
                class="!w-340px"
              >
                <el-option v-for="c in comprehensiveOptions" :key="c.id" :label="c.name" :value="c.name" />
              </el-select>
            </div>

            <!-- 涂布：膜材设置（数量驱动） + 涂布设置（逐片配置，参照示例图片） -->
            <div v-else-if="step.procName === '涂布'">
              <div class="form-sec">膜材设置</div>
              <div class="form-grid two">
                <el-form-item label="正负极类型">
                  <el-select v-model="formData.schemeMap['涂布']['正负极类型']" placeholder="请选择" class="!w-100%">
                    <el-option label="正极" value="正极" />
                    <el-option label="负极" value="负极" />
                  </el-select>
                </el-form-item>
                <el-form-item label="膜材数量（片）">
                  <el-input-number
                    v-model="formData.schemeMap['涂布']['膜材数量']"
                    :min="1"
                    :max="20"
                    class="!w-100%"
                    @change="syncCoatingRows"
                  />
                </el-form-item>
              </div>
              <div class="form-sec" style="margin-top: 14px">涂布设置</div>
              <el-table :data="coatingRows" border size="small">
                <el-table-column label="膜材" min-width="90">
                  <template #default="{ row }">{{ row.label }}</template>
                </el-table-column>
                <el-table-column label="涂布方式">
                  <template #default="{ row }">
                    <el-select v-model="formData.schemeMap['涂布'][`${row.key}-涂布方式`]" placeholder="请选择" class="!w-100%">
                      <el-option label="线棒" value="线棒" />
                      <el-option label="刮刀" value="刮刀" />
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column label="涂布厚度（μm）">
                  <template #default="{ row }">
                    <el-select
                      v-if="formData.schemeMap['涂布'][`${row.key}-涂布方式`] === '线棒'"
                      v-model="formData.schemeMap['涂布'][`${row.key}-涂布厚度`]"
                      placeholder="请选择规格"
                      class="!w-100%"
                    >
                      <el-option v-for="s in coatingSpecs" :key="s" :label="`${s} μm`" :value="s" />
                    </el-select>
                    <el-input-number
                      v-else
                      v-model="formData.schemeMap['涂布'][`${row.key}-涂布厚度`]"
                      :min="0"
                      :precision="1"
                      class="!w-100%"
                    />
                  </template>
                </el-table-column>
                <el-table-column label="涂布速度（mm/s）">
                  <template #default="{ row }">
                    <el-input-number
                      v-model="formData.schemeMap['涂布'][`${row.key}-涂布速度`]"
                      :min="0"
                      class="!w-100%"
                    />
                  </template>
                </el-table-column>
              </el-table>
            </div>

            <!-- 烘干 -->
            <div v-else-if="step.procName === '烘干'" class="form-grid two">
              <el-form-item label="目标温度(℃)">
                <el-input-number v-model="formData.schemeMap['烘干']['目标温度(℃)']" :min="0" class="!w-100%" />
              </el-form-item>
              <el-form-item label="烘干时间(min)">
                <el-input-number v-model="formData.schemeMap['烘干']['烘干时间(min)']" :min="0" class="!w-100%" />
              </el-form-item>
            </div>

            <!-- 混料 -->
            <div v-else-if="step.procName === '混料'" class="form-grid two">
              <el-form-item label="声共振时间(min)">
                <el-input-number v-model="formData.schemeMap['混料']['声共振时间']" :min="0" class="!w-100%" />
              </el-form-item>
            </div>

            <!-- 烧结 -->
            <div v-else-if="step.procName === '烧结'" class="form-grid two">
              <el-form-item label="起始温度(℃)">
                <el-input-number v-model="formData.schemeMap['烧结']['起始温度']" :min="0" class="!w-100%" />
              </el-form-item>
            </div>

            <!-- 粉碎 -->
            <div v-else-if="step.procName === '粉碎'" class="form-grid two">
              <el-form-item label="破碎时间(min)">
                <el-input-number v-model="formData.schemeMap['粉碎']['破碎时间']" :min="0" class="!w-100%" />
              </el-form-item>
            </div>

            <!-- 其他工序：兜底 -->
            <div v-else class="form-grid two">
              <el-form-item label="工艺参数">
                <el-input v-model="formData.schemeMap[step.procName]['工艺参数']" placeholder="请输入工艺参数" />
              </el-form-item>
              <el-form-item label="备注">
                <el-input v-model="formData.schemeMap[step.procName]['备注']" placeholder="请输入备注" />
              </el-form-item>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="submitForm" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime'
import {
  createFormula,
  deleteFormula,
  FormulaFeedVO,
  FormulaSchemeVO,
  FormulaVO,
  getFormula,
  getFormulaPage,
  updateFormula
} from '@/api/lab/formula'
import { getRoute, getRoutePage, RouteVO } from '@/api/lab/route'
import {
  getSyncComprehensivePage,
  getSyncJudgePage,
  getSyncMethodPage,
  SyncComprehensiveVO,
  SyncJudgeVO,
  SyncMethodVO
} from '@/api/lab/sync'

defineOptions({ name: 'LabPlanFormula' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<FormulaVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  code: undefined,
  section: undefined,
  status: undefined
})
const queryFormRef = ref() // 搜索的表单

// 工段选项（显示名）
const sectionOptions = ['合成段', '配方段', '组装段', '热压段', '测试段']
// 工段名称 → 编码（lab_route.sec 存储编码，如 S01）
const SECTION_CODE: Record<string, string> = {
  合成段: 'S01',
  配方段: 'S02',
  组装段: 'S03',
  热压段: 'S04',
  测试段: 'S05'
}
// 表征检查项（按工段）
const CHAR_ITEMS: Record<string, string[]> = {
  配方段: ['固含量检测', '细度检测', '流变检测'],
  合成段: ['XRD检测', '离子电导率检测']
}
// 检查项 → 供应商项目类型（lab_sync_method.project_type）
const CHECK_ITEM_TYPE: Record<string, number> = {
  固含量检测: 1, // 水分检测（固含量/干物质）
  细度检测: 2,
  流变检测: 3,
  'XRD检测': 5,
  离子电导率检测: 6
}
// 合浆-脱泡方法：项目类型 4（脱泡检测）
const DEFOAM_PROJECT_TYPE = 4
// 状态选项
const statusOptions = ['新建', '评审中', '已下达', '取消']

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await getFormulaPage(queryParams)
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

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    await message.delConfirm()
    await deleteFormula(id)
    message.success(t('common.delSuccess'))
    await getList()
  } catch {}
}

// ==================== 表单弹窗 ====================
const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formRef = ref() // 表单 Ref
const activeTab = ref('base') // 当前激活的 Tab
const activeProc = ref('') // 实验方案当前工序页签
// 工艺路线下拉（按工段加载）
const routeOptions = ref<RouteVO[]>([])
// 实验方案选项（按页签实时调后端 sync 接口，不做一次性缓存）
const defoamOptions = ref<SyncMethodVO[]>([]) // 合浆-脱泡方法
const methodOptions = reactive<Record<string, SyncMethodVO[]>>({}) // 表征-检测方法
const judgeOptions = reactive<Record<string, SyncJudgeVO[]>>({}) // 表征-检测判定
const comprehensiveOptions = ref<SyncComprehensiveVO[]>([]) // 表征-综合判定
// 涂布线棒厚度规格（μm）
const coatingSpecs = [3, 5, 10, 15, 20]

const formData = ref({
  id: undefined,
  section: '',
  code: '',
  version: '',
  current: '',
  sysCode: '',
  rdClass: '',
  pole: '',
  gen: '',
  cap: '',
  formula: '',
  route: '',
  routeSteps: [] as any[],
  prio: '',
  bg1: '',
  bg2: '',
  atk1: '',
  atk2: '',
  factor: '',
  purpose: '',
  status: '',
  feedList: [] as FormulaFeedVO[],
  schemeList: [] as FormulaSchemeVO[],
  schemeMap: {} as Record<string, Record<string, any>>
})
const formRules = reactive({
  code: [{ required: true, message: '配方编号不能为空', trigger: 'blur' }],
  procName: [{ required: true, message: '工序名称不能为空', trigger: 'blur' }],
  paramKey: [{ required: true, message: '参数名不能为空', trigger: 'blur' }]
})

// 仅配方段/合成段展示投料信息与实验方案
const showPlanTabs = computed(() => ['配方段', '合成段'].includes(formData.value.section))

// 当前工段的表征检查项
const charItems = computed(() => CHAR_ITEMS[formData.value.section] || [])

/** 打开弹窗 */
const openForm = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = type === 'create' ? '新增配方' : '编辑配方'
  formType.value = type
  activeTab.value = 'base'
  activeProc.value = ''
  routeOptions.value = []
  resetForm()
  // 修改时，加载数据
  if (id) {
    formLoading.value = true
    try {
      const data = await getFormula(id)
      formData.value = data
      formData.value.feedList = data.feedList || []
      formData.value.schemeList = data.schemeList || []
      formData.value.routeSteps = []
      buildSchemeMap(data.schemeList)
      // 恢复工艺路线（含工序页签），保留已保存的实验方案
      if (data.section) {
        await loadRoutes()
        if (data.route && routeOptions.value.some((r) => r.code === data.route)) {
          await handleRouteChange(data.route, true)
        }
      }
    } finally {
      formLoading.value = false
    }
  }
}

/** 工段变化：重置工艺路线与实验方案，并按工段加载路线 */
const handleSectionChange = async () => {
  formData.value.route = ''
  formData.value.routeSteps = []
  formData.value.schemeMap = {}
  activeProc.value = ''
  await loadRoutes()
}

/** 按工段加载工艺路线（sec 需传工段编码） */
const loadRoutes = async () => {
  const secCode = SECTION_CODE[formData.value.section] || ''
  routeOptions.value = secCode
    ? (await getRoutePage({ sec: secCode, pageSize: 200 }))?.list || []
    : []
}

/** 工艺路线变化：加载工序列表，初始化实验方案页签 */
const handleRouteChange = async (code?: string, preserve = false) => {
  formData.value.route = code || ''
  formData.value.routeSteps = []
  if (!code) {
    formData.value.schemeMap = {}
    activeProc.value = ''
    return
  }
  const route = routeOptions.value.find((r) => r.code === code)
  const detail = await getRoute(route?.id)
  formData.value.routeSteps = detail?.steps || []
  if (preserve) {
    // 编辑回显：保留已保存值，但补齐缺失工序/参数键，避免模板访问报错
    ensureSchemeMap()
  } else {
    initSchemeMap()
  }
  activeProc.value = formData.value.routeSteps[0]?.procName || ''
}

/** 补齐实验方案各工序的参数字典（不覆盖已有值） */
const ensureSchemeMap = () => {
  formData.value.routeSteps.forEach((step) => {
    const proc = step.procName
    if (!formData.value.schemeMap[proc]) {
      formData.value.schemeMap[proc] = {}
    }
    const defaults = buildProcDefaults(proc)
    Object.keys(defaults).forEach((k) => {
      if (formData.value.schemeMap[proc][k] === undefined) {
        formData.value.schemeMap[proc][k] = defaults[k]
      }
    })
  })
}

/** 初始化实验方案各工序参数默认键 */
const initSchemeMap = () => {
  const map: Record<string, Record<string, any>> = {}
  formData.value.routeSteps.forEach((step) => {
    map[step.procName] = buildProcDefaults(step.procName)
  })
  formData.value.schemeMap = map
}

/** 按工序名构建默认参数字典 */
const buildProcDefaults = (proc: string) => {
  const d: Record<string, any> = {}
  if (proc === '合浆') {
    d['脱泡方法'] = ''
    d['震荡频率(r/min)'] = undefined
  } else if (proc === '表征') {
    charItems.value.forEach((it) => {
      d[`${it}-方法`] = ''
      d[`${it}-判定`] = ''
    })
    d['综合判定'] = ''
  } else if (proc === '涂布') {
    d['正负极类型'] = ''
    d['膜材数量'] = 1
    buildCoatingRows(d, 1)
  } else if (proc === '烘干') {
    d['目标温度(℃)'] = undefined
    d['烘干时间(min)'] = undefined
  } else if (proc === '混料') {
    d['声共振时间'] = undefined
  } else if (proc === '烧结') {
    d['起始温度'] = undefined
  } else if (proc === '粉碎') {
    d['破碎时间'] = undefined
  } else {
    d['工艺参数'] = ''
    d['备注'] = ''
  }
  return d
}

/** 生成涂布逐膜材行参数键 */
const buildCoatingRows = (d: Record<string, any>, count: number) => {
  for (let i = 1; i <= count; i++) {
    d[`膜材${i}-涂布方式`] = ''
    d[`膜材${i}-涂布厚度`] = undefined
    d[`膜材${i}-涂布速度`] = undefined
  }
}

/** 膜材数量变化：同步涂布设置行（新增/删除逐片参数键） */
const syncCoatingRows = () => {
  const map = formData.value.schemeMap['涂布']
  if (!map) {
    return
  }
  const count = Number(map['膜材数量']) || 1
  buildCoatingRows(map, count)
  // 删除超出数量的行
  let i = count + 1
  while (map[`膜材${i}-涂布方式`] !== undefined) {
    delete map[`膜材${i}-涂布方式`]
    delete map[`膜材${i}-涂布厚度`]
    delete map[`膜材${i}-涂布速度`]
    i++
  }
}

// 涂布设置行（由膜材数量驱动）
const coatingRows = computed(() => {
  const count = Number(formData.value.schemeMap['涂布']?.['膜材数量']) || 1
  return Array.from({ length: count }, (_, i) => ({ label: `膜材 ${i + 1}`, key: `膜材${i + 1}` }))
})

/** 由已保存的 schemeList 还原 schemeMap */
const buildSchemeMap = (list: FormulaSchemeVO[]) => {
  const map: Record<string, Record<string, any>> = {}
  ;(list || []).forEach((row) => {
    if (!row.procName) {
      return
    }
    if (!map[row.procName]) {
      map[row.procName] = {}
    }
    map[row.procName][row.paramKey] = row.paramValue
  })
  formData.value.schemeMap = map
}

/** 工序页签点击：切换 + 实时调后端 sync 接口加载选项 */
const onProcTabClick = async (proc: string) => {
  if (proc === '称量') {
    return
  }
  activeProc.value = proc
  if (proc === '合浆') {
    // 脱泡方法：查 lab_sync_method（脱泡检测，projectType=4）
    await loadDefoamMethods()
  }
  if (proc === '表征') {
    // 综合判定：查 lab_sync_comprehensive（按所属段）
    await loadComprehensive()
    // 检测方法/检测判定：按检查项查 lab_sync_method / lab_sync_judge
    for (const item of charItems.value) {
      await loadMethods(item)
      await loadJudges(item)
    }
  }
}

/** 按所属段 + 项目类型查询 lab_sync_method（仅启用 status=1） */
const querySyncMethods = async (projectType?: number) => {
  const secCode = SECTION_CODE[formData.value.section] || ''
  const list =
    (await getSyncMethodPage({
      segmentCode: secCode,
      projectType,
      pageSize: 200
    }))?.list || []
  return list.filter((m) => m.status === 1)
}

/** 合浆-脱泡方法（项目类型 4-脱泡检测） */
const loadDefoamMethods = async () => {
  defoamOptions.value = await querySyncMethods(DEFOAM_PROJECT_TYPE)
}

/** 表征-检测方法（按检查项项目类型） */
const loadMethods = async (item: string) => {
  methodOptions[item] = await querySyncMethods(CHECK_ITEM_TYPE[item])
}

/** 表征-检测判定（按检查项项目类型查 lab_sync_judge） */
const loadJudges = async (item: string) => {
  const secCode = SECTION_CODE[formData.value.section] || ''
  const list =
    (await getSyncJudgePage({
      segmentCode: secCode,
      projectType: CHECK_ITEM_TYPE[item],
      pageSize: 200
    }))?.list || []
  judgeOptions[item] = list.filter((j) => j.status === 1)
}

/** 表征-综合判定（按所属段查 lab_sync_comprehensive） */
const loadComprehensive = async () => {
  const secCode = SECTION_CODE[formData.value.section] || ''
  const list =
    (await getSyncComprehensivePage({ segmentCode: secCode, pageSize: 200 }))?.list || []
  comprehensiveOptions.value = list.filter((c) => c.status === 1)
}

/** 新增投料 */
const handleAddFeed = () => {
  formData.value.feedList.push({
    seq: undefined,
    feedSeq: undefined,
    feedProc: '',
    materialCode: '',
    cat1: '',
    cat2: '',
    quantity: undefined,
    unit: '',
    deviation: undefined
  })
}

/** 删除投料 */
const handleDeleteFeed = (index: number) => {
  formData.value.feedList.splice(index, 1)
}

/** 提交表单 */
const submitForm = async () => {
  await formRef.value.validate()
  formLoading.value = true
  try {
    const data = { ...formData.value }
    // 实验方案：schemeMap 拍平为 schemeList
    const schemeList: FormulaSchemeVO[] = []
    Object.entries(formData.value.schemeMap || {}).forEach(([proc, params]) => {
      Object.entries(params || {}).forEach(([k, v]) => {
        if (v !== '' && v !== null && v !== undefined) {
          schemeList.push({ procName: proc, paramKey: k, paramValue: String(v) })
        }
      })
    })
    data.schemeList = schemeList
    data.feedList = formData.value.feedList || []
    if (formType.value === 'create') {
      await createFormula(data)
      message.success(t('common.createSuccess'))
    } else {
      await updateFormula(data)
      message.success(t('common.updateSuccess'))
    }
    dialogVisible.value = false
    await getList()
  } finally {
    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: undefined,
    section: '',
    code: '',
    version: '',
    current: '',
    sysCode: '',
    rdClass: '',
    pole: '',
    gen: '',
    cap: '',
    formula: '',
    route: '',
    routeSteps: [],
    prio: '',
    bg1: '',
    bg2: '',
    atk1: '',
    atk2: '',
    factor: '',
    purpose: '',
    status: '',
    feedList: [],
    schemeList: [],
    schemeMap: {}
  }
  formRef.value?.resetFields()
}

/** 初始化 */
onMounted(() => {
  getList()
})
</script>

<style lang="scss" scoped>
// 实验方案：工序页签（参照原型 subtabs，柔和品牌橙配色）
.scheme-head {
  font-size: 13px;
  font-weight: 700;
  color: #6b7280;
  margin-bottom: 12px;
  padding-left: 10px;
  border-left: 3px solid #f4a261;
}
.scheme-subtabs {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}
.subtab {
  padding: 7px 14px;
  border: 1px solid var(--el-border-color);
  border-radius: 99px;
  font-size: 12px;
  color: #5b6570;
  cursor: pointer;
  background: #fff;
  transition: all 0.15s;
}
.subtab:hover {
  border-color: var(--el-color-primary-light-5);
  color: var(--el-color-primary);
}
.subtab.active {
  background: var(--el-color-primary-light-9);
  border-color: var(--el-color-primary);
  color: var(--el-color-primary);
  font-weight: 600;
}
.subtab.is-disabled {
  opacity: 0.55;
  cursor: not-allowed;
  background: #f6f7f8;
  color: #9aa3ab;
  border-color: var(--el-border-color);
}
.scheme-empty {
  padding: 32px;
  text-align: center;
  color: #9aa3ab;
  font-size: 13px;
}
.scheme-hint {
  padding: 32px;
  text-align: center;
  color: #9aa3ab;
  font-size: 12px;
}
.form-sec {
  font-size: 13px;
  font-weight: 700;
  color: #6b7280;
  margin: 4px 0 12px;
  padding-left: 10px;
  border-left: 3px solid #f4a261;
}
.form-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0 16px;
}
.form-grid.two {
  grid-template-columns: repeat(2, 1fr);
}

// 深色模式适配
html.dark .scheme-head,
html.dark .form-sec {
  color: #dbe6f5;
}
html.dark .subtab {
  background: rgba(255, 255, 255, 0.04);
  color: #8ea3bf;
  border-color: rgba(255, 255, 255, 0.08);
}
html.dark .subtab:hover {
  border-color: var(--el-color-primary);
  color: var(--el-color-primary);
}
html.dark .subtab.active {
  background: rgba(64, 158, 255, 0.18);
  border-color: var(--el-color-primary);
  color: var(--el-color-primary);
}
html.dark .subtab.is-disabled {
  background: rgba(255, 255, 255, 0.03);
  color: #5c6b7e;
}
</style>
