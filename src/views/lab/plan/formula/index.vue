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
          <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
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
      <el-table-column label="配方描述" align="center" prop="description" min-width="200" />
      <el-table-column label="版本" align="center" prop="version" min-width="80" />
      <el-table-column label="当前版本" align="center" prop="isCurrent" min-width="90" />
      <el-table-column label="研发分类" align="center" prop="rdClass" min-width="110" />
      <el-table-column label="正负极" align="center" prop="pole" min-width="80" />
      <el-table-column label="优先级" align="center" prop="prio" min-width="80" />
      <el-table-column label="状态" align="center" min-width="90">
        <template #default="scope">
          <el-tag :type="statusTagType(scope.row.status)" effect="light">{{ statusLabel(scope.row.status) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="170px"
      />
      <el-table-column label="操作" align="center" width="170" fixed="right">
        <template #default="scope">
          <div class="flex items-center justify-center">
            <!-- 新建：编辑 可见；提交评审 / 复制 / 取消 进更多 -->
            <template v-if="scope.row.status === FormulaStatus.NEW">
              <el-button
                link
                type="primary"
                @click="openForm('update', scope.row.id)"
                v-hasPermi="['lab:formula:update']"
              >
                编辑
              </el-button>
              <el-dropdown trigger="click">
                <el-button link type="primary"><Icon icon="ep:d-arrow-right" /> 更多</el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item
                      @click="handleSubmitReview(scope.row)"
                      v-if="checkPermi(['lab:formula:update'])"
                    >
                      提交评审
                    </el-dropdown-item>
                    <el-dropdown-item
                      @click="handleCopy(scope.row)"
                      v-if="checkPermi(['lab:formula:create'])"
                    >
                      复制
                    </el-dropdown-item>
                    <el-dropdown-item
                      @click="handleCancel(scope.row)"
                      v-if="checkPermi(['lab:formula:update'])"
                    >
                      取消
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </template>
            <!-- 评审中：编辑 可见；下达 / 复制 / 取消 进更多 -->
            <template v-else-if="scope.row.status === FormulaStatus.REVIEWING">
              <el-button
                link
                type="primary"
                @click="openForm('update', scope.row.id)"
                v-hasPermi="['lab:formula:update']"
              >
                编辑
              </el-button>
              <el-dropdown trigger="click">
                <el-button link type="primary"><Icon icon="ep:d-arrow-right" /> 更多</el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item
                      @click="handleRelease(scope.row)"
                      v-if="checkPermi(['lab:formula:update'])"
                    >
                      下达
                    </el-dropdown-item>
                    <el-dropdown-item
                      @click="handleCopy(scope.row)"
                      v-if="checkPermi(['lab:formula:create'])"
                    >
                      复制
                    </el-dropdown-item>
                    <el-dropdown-item
                      @click="handleCancel(scope.row)"
                      v-if="checkPermi(['lab:formula:update'])"
                    >
                      取消
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </template>
            <!-- 已下达：查看 可见；复制 / 取消 进更多 -->
            <template v-else-if="scope.row.status === FormulaStatus.RELEASED">
              <el-button link type="primary" @click="openForm('view', scope.row.id)">查看</el-button>
              <el-dropdown trigger="click">
                <el-button link type="primary"><Icon icon="ep:d-arrow-right" /> 更多</el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item
                      @click="handleCopy(scope.row)"
                      v-if="checkPermi(['lab:formula:create'])"
                    >
                      复制
                    </el-dropdown-item>
                    <el-dropdown-item
                      @click="handleCancel(scope.row)"
                      v-if="checkPermi(['lab:formula:update'])"
                    >
                      取消
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </template>
            <!-- 取消：查看 可见；复制 进更多 -->
            <template v-else-if="scope.row.status === FormulaStatus.CANCELED">
              <el-button link type="primary" @click="openForm('view', scope.row.id)">查看</el-button>
              <el-dropdown trigger="click">
                <el-button link type="primary"><Icon icon="ep:d-arrow-right" /> 更多</el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item
                      @click="handleCopy(scope.row)"
                      v-if="checkPermi(['lab:formula:create'])"
                    >
                      复制
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </template>
          </div>
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

  <!-- 表单弹窗：新增/修改/查看 -->
  <el-dialog v-model="dialogVisible" :title="dialogTitle" width="1100px" append-to-body>
    <!-- 查看模式：fieldset 原生禁用全部表单控件 -->
    <fieldset :disabled="formReadonly" class="form-readonly-fieldset">
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
              <el-form-item label="当前版本" prop="isCurrent">
                <el-radio-group v-model="formData.isCurrent">
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
                <el-select v-model="formData.rdClass" placeholder="请选择研发分类" class="!w-100%" clearable>
                  <el-option v-for="item in RdClassEnum" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="正负极" prop="pole">
                <el-select v-model="formData.pole" placeholder="请选择正负极" class="!w-100%" clearable>
                  <el-option v-for="item in PoleEnum" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
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
                <el-select v-model="formData.prio" placeholder="请选择优先级" class="!w-100%" clearable>
                  <el-option v-for="item in PrioEnum" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
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
                <el-tag :type="statusTagType(formData.status)" effect="light">
                  {{ statusLabel(formData.status) }}
                </el-tag>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="配方描述" prop="description">
            <el-input
              v-model="formData.description"
              type="textarea"
              :rows="2"
              placeholder="请输入配方描述"
            />
          </el-form-item>
        </el-tab-pane>

        <!-- 投料信息（仅配方段/合成段，参照示例图片 投料.png：按投料工序分组卡片） -->
        <el-tab-pane v-if="showPlanTabs" label="投料信息" name="feed">
          <div v-for="proc in feedProcOptions" :key="proc" class="feed-card">
            <div class="feed-card-title">{{ proc }}及加料顺序</div>
            <el-table :data="feedRowsByProc(proc)" border size="small">
              <el-table-column label="投料顺序" align="center" width="120">
                <template #default="{ row }">
                  <el-input-number v-model="row.feedSeq" :min="1" :precision="0" controls-position="right" class="!w-100%" />
                </template>
              </el-table-column>
              <el-table-column label="试剂名称" min-width="220">
                <template #default="{ row }">
                  <el-select
                    v-model="row.materialName"
                    placeholder="请选择"
                    filterable
                    class="!w-100%"
                    @change="onMaterialChange(row, row.materialName)"
                  >
                    <el-option
                      v-for="m in materialOptionsFor(proc)"
                      :key="m.code"
                      :label="`${m.name}（${m.code}）`"
                      :value="m.name"
                    />
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="物料编号" align="center" width="120">
                <template #default="{ row }">{{ row.materialCode || '—' }}</template>
              </el-table-column>
              <el-table-column label="一级分类" align="center" width="110">
                <template #default="{ row }">{{ row.cat1 || '—' }}</template>
              </el-table-column>
              <el-table-column label="二级分类" align="center" width="110">
                <template #default="{ row }">{{ row.cat2 || '—' }}</template>
              </el-table-column>
              <el-table-column label="加料质量(g)" align="center" width="170">
                <template #default="{ row }">
                  <el-input-number v-model="row.quantity" :min="0" controls-position="right" class="!w-100%" />
                </template>
              </el-table-column>
              <el-table-column label="允差（%）" align="center" width="180">
                <template #default="{ row }">
                  <div class="flex items-center gap-4px">
                    <el-select v-model="row.tolerance" class="!w-64px" size="small">
                      <el-option label="±" value="±" />
                    </el-select>
                    <el-input-number
                      v-model="row.deviation"
                      :min="0"
                      :precision="2"
                      controls-position="right"
                      class="!flex-1"
                      size="small"
                    />
                  </div>
                </template>
              </el-table-column>
              <el-table-column align="center" label="操作" width="70">
                <template #default="{ $index }">
                  <el-button link type="danger" @click="handleDeleteFeed(proc, $index)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-button type="primary" plain size="small" class="mt-8px" @click="handleAddFeed(proc)">
              <Icon icon="ep:plus" class="mr-5px" /> 新增一行
            </el-button>
          </div>
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
                <div class="config-select-wrap">
                  <el-select v-model="formData.schemeMap['合浆']['脱泡方法']" placeholder="请选择脱泡方法" class="!w-100%">
                    <el-option
                      v-for="m in defoamOptions"
                      :key="m.id"
                      :label="m.projectName"
                      :value="m.projectName"
                    />
                  </el-select>
                  <el-button
                    v-if="!formReadonly && findMethodByName(defoamOptions, formData.schemeMap['合浆']['脱泡方法'])"
                    link
                    type="primary"
                    @click="openConfigEdit('method', findMethodByName(defoamOptions, formData.schemeMap['合浆']['脱泡方法']))"
                  >查看</el-button>
                </div>
                <div
                  v-if="isEditedShow('method', findMethodByName(defoamOptions, formData.schemeMap['合浆']['脱泡方法']))"
                  class="config-changed-tip"
                >配置项已更改</div>
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

            <!-- 表征：合成段参照合成段-表征.png（检测参数方案+判定依据），配方段为检查项表格+综合判定 -->
            <div v-else-if="step.procName === '表征'">
              <!-- 合成段 -->
              <div v-if="formData.section === '合成段'" class="char-syn">
                <div v-for="item in charItems" :key="item" class="char-syn-row">
                  <div class="char-syn-info">
                    <div class="char-syn-name">{{ item }}</div>
                    <div class="char-syn-status">{{ charIncomplete(item) ? '配置不完整' : '已配置' }}</div>
                  </div>
                  <div class="char-syn-field">
                    <div class="char-syn-label"><i class="req">*</i> 检测参数方案</div>
                    <div class="config-select-wrap">
                      <el-select
                        v-model="formData.schemeMap['表征'][`${item}-方案`]"
                        placeholder="请选择检测参数方案"
                        class="!w-100%"
                      >
                        <el-option
                          v-for="m in methodOptions[item] || []"
                          :key="m.id"
                          :label="m.projectName"
                          :value="m.projectName"
                        />
                      </el-select>
                      <el-button
                        v-if="!formReadonly && findMethodByName(methodOptions[item] || [], formData.schemeMap['表征'][`${item}-方案`])"
                        link
                        type="primary"
                        @click="openConfigEdit('method', findMethodByName(methodOptions[item] || [], formData.schemeMap['表征'][`${item}-方案`]))"
                      >查看</el-button>
                    </div>
                    <div
                      v-if="isEditedShow('method', findMethodByName(methodOptions[item] || [], formData.schemeMap['表征'][`${item}-方案`]))"
                      class="config-changed-tip"
                    >配置项已更改</div>
                  </div>
                  <div class="char-syn-field">
                    <div class="char-syn-label">判定依据</div>
                    <template v-if="item === 'XRD检测'">
                      <div class="char-syn-static">XRD 仅记录检测结果，无需配置判定标准</div>
                    </template>
                    <template v-else>
                      <el-radio-group v-model="formData.schemeMap['表征']['离子电导率检测-判定方式']">
                        <el-radio value="按标准判定">按标准判定</el-radio>
                        <el-radio value="仅记录结果">仅记录结果</el-radio>
                      </el-radio-group>
                      <div class="config-select-wrap mt-8px">
                        <el-select
                          v-if="formData.schemeMap['表征']['离子电导率检测-判定方式'] === '按标准判定'"
                          v-model="formData.schemeMap['表征']['离子电导率检测-判断标准']"
                          placeholder="请选择判断标准"
                          class="!w-100%"
                        >
                          <el-option
                            v-for="j in judgeOptions['离子电导率检测'] || []"
                            :key="j.id"
                            :label="j.name"
                            :value="j.name"
                          />
                        </el-select>
                        <el-button
                          v-if="!formReadonly && formData.schemeMap['表征']['离子电导率检测-判定方式'] === '按标准判定' && findJudgeByName(judgeOptions['离子电导率检测'] || [], formData.schemeMap['表征']['离子电导率检测-判断标准'])"
                          link
                          type="primary"
                          @click="openConfigEdit('judge', findJudgeByName(judgeOptions['离子电导率检测'] || [], formData.schemeMap['表征']['离子电导率检测-判断标准']))"
                        >查看</el-button>
                      </div>
                      <div
                        v-if="formData.schemeMap['表征']['离子电导率检测-判定方式'] === '按标准判定' && isEditedShow('judge', findJudgeByName(judgeOptions['离子电导率检测'] || [], formData.schemeMap['表征']['离子电导率检测-判断标准']))"
                        class="config-changed-tip"
                      >配置项已更改</div>
                    </template>
                  </div>
                </div>
              </div>
              <!-- 配方段 -->
              <template v-else>
                <div class="form-sec">表征检测项</div>
                <el-table :data="charItems" border size="small">
                  <el-table-column label="检测项" min-width="160">
                    <template #default="{ row }">{{ row }}</template>
                  </el-table-column>
                  <el-table-column label="检测方法">
                    <template #default="{ row }">
                      <div class="config-select-wrap">
                        <el-select v-model="formData.schemeMap['表征'][`${row}-方法`]" placeholder="请选择" class="!w-100%">
                          <el-option
                            v-for="m in methodOptions[row] || []"
                            :key="m.id"
                            :label="m.projectName"
                            :value="m.projectName"
                          />
                        </el-select>
                        <el-button
                          v-if="!formReadonly && findMethodByName(methodOptions[row] || [], formData.schemeMap['表征'][`${row}-方法`])"
                          link
                          type="primary"
                          @click="openConfigEdit('method', findMethodByName(methodOptions[row] || [], formData.schemeMap['表征'][`${row}-方法`]))"
                        >查看</el-button>
                      </div>
                      <div
                        v-if="isEditedShow('method', findMethodByName(methodOptions[row] || [], formData.schemeMap['表征'][`${row}-方法`]))"
                        class="config-changed-tip"
                      >配置项已更改</div>
                    </template>
                  </el-table-column>
                  <el-table-column label="检测判定">
                    <template #default="{ row }">
                      <div class="config-select-wrap">
                        <el-select v-model="formData.schemeMap['表征'][`${row}-判定`]" placeholder="请选择" class="!w-100%">
                          <el-option v-for="j in judgeOptions[row] || []" :key="j.id" :label="j.name" :value="j.name" />
                        </el-select>
                        <el-button
                          v-if="!formReadonly && findJudgeByName(judgeOptions[row] || [], formData.schemeMap['表征'][`${row}-判定`])"
                          link
                          type="primary"
                          @click="openConfigEdit('judge', findJudgeByName(judgeOptions[row] || [], formData.schemeMap['表征'][`${row}-判定`]))"
                        >查看</el-button>
                      </div>
                      <div
                        v-if="isEditedShow('judge', findJudgeByName(judgeOptions[row] || [], formData.schemeMap['表征'][`${row}-判定`]))"
                        class="config-changed-tip"
                      >配置项已更改</div>
                    </template>
                  </el-table-column>
                </el-table>
                <div class="form-sec" style="margin-top: 16px">综合判定</div>
                <div class="config-select-wrap">
                  <el-select
                    v-model="formData.schemeMap['表征']['综合判定']"
                    placeholder="请选择综合判定"
                    class="!w-340px"
                  >
                    <el-option v-for="c in comprehensiveOptions" :key="c.id" :label="c.name" :value="c.name" />
                  </el-select>
                  <el-button
                    v-if="!formReadonly && findComprehensiveByName(comprehensiveOptions, formData.schemeMap['表征']['综合判定'])"
                    link
                    type="primary"
                    @click="openConfigEdit('comprehensive', findComprehensiveByName(comprehensiveOptions, formData.schemeMap['表征']['综合判定']))"
                  >查看</el-button>
                </div>
                <div
                  v-if="isEditedShow('comprehensive', findComprehensiveByName(comprehensiveOptions, formData.schemeMap['表征']['综合判定']))"
                  class="config-changed-tip"
                >配置项已更改</div>
              </template>
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

            <!-- 混料：声共振时间 + 加速度 -->
            <div v-else-if="step.procName === '混料'" class="form-grid two">
              <el-form-item label="声共振时间(min)">
                <el-input-number v-model="formData.schemeMap['混料']['声共振时间']" :min="0" class="!w-100%" />
              </el-form-item>
              <el-form-item label="加速度">
                <div class="flex items-center gap-4px !w-100%">
                  <el-input-number v-model="formData.schemeMap['混料']['加速度']" :min="0" class="!flex-1" />
                  <el-select v-model="formData.schemeMap['混料']['加速度单位']" class="!w-90px">
                    <el-option v-for="u in accUnitOptions" :key="u" :label="u" :value="u" />
                  </el-select>
                </div>
              </el-form-item>
            </div>

            <!-- 烧结：温度曲线设置（参照合成段-烘干.png） -->
            <div v-else-if="step.procName === '烧结'">
              <div class="form-sec">温度曲线设置</div>
              <div class="form-grid two">
                <el-form-item label="起始温度（估算）">
                  <div class="flex items-center gap-4px !w-100%">
                    <el-input-number
                      v-model="formData.schemeMap['烧结']['起始温度(℃)']"
                      :min="-100"
                      class="!flex-1"
                    />
                    <span class="unit">℃</span>
                  </div>
                </el-form-item>
              </div>
              <div class="tip-text">
                按顺序设置 1～8 段，温度降低时自动自然降温，到温后保温。目标温度升高时按速率升温；降低时自动自然降温，升温速率不参与降温；相同时直接保温。各段到温后开始保温。
              </div>
              <div class="flex items-center justify-between mt-12px">
                <div class="form-sec" style="margin: 0">分段参数设置</div>
                <el-button type="primary" plain size="small" @click="addSinterSeg">+ 新增程序段</el-button>
              </div>
              <el-table :data="sinterSegs" border size="small" class="mt-8px">
                <el-table-column label="段" align="center" width="60">
                  <template #default="{ $index }">
                    <span class="seg-badge">{{ $index + 1 }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="温控方式（自动）" align="center" width="120">
                  <template #default="{ $index }">
                    <el-tag v-if="sinterMode($index)" :type="sinterTagType(sinterMode($index))" size="small">
                      {{ sinterMode($index) }}
                    </el-tag>
                    <span v-else class="seg-placeholder">—</span>
                  </template>
                </el-table-column>
                <el-table-column label="目标温度(℃)" align="center">
                  <template #default="{ row }">
                    <el-input-number v-model="row.target" :min="-100" controls-position="right" class="!w-100%" />
                  </template>
                </el-table-column>
                <el-table-column label="升温速率(℃/min)" align="center">
                  <template #default="{ row, $index }">
                    <el-input-number
                      v-if="sinterMode($index) !== '自然降温'"
                      v-model="row.rate"
                      :min="0"
                      :precision="1"
                      controls-position="right"
                      class="!w-100%"
                    />
                    <span v-else class="seg-placeholder">—</span>
                  </template>
                </el-table-column>
                <el-table-column label="到温后保温时间(min)" align="center">
                  <template #default="{ row }">
                    <el-input-number v-model="row.hold" :min="0" controls-position="right" class="!w-100%" />
                  </template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="110">
                  <template #default="{ $index }">
                    <el-button link :disabled="$index === 0" @click="moveSinterSeg($index, -1)" title="上移">
                      <Icon icon="ep:arrow-up" />
                    </el-button>
                    <el-button
                      link
                      :disabled="$index === sinterSegs.length - 1"
                      @click="moveSinterSeg($index, 1)"
                      title="下移"
                    >
                      <Icon icon="ep:arrow-down" />
                    </el-button>
                    <el-button link type="danger" @click="deleteSinterSeg($index)" title="删除">
                      <Icon icon="ep:delete" />
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
              <div class="form-sec" style="margin-top: 16px">升降温曲线</div>
              <div class="curve-stats">
                <span>程序段 {{ sinterSegs.length }} / 8</span>
                <span>最高温度 {{ sinterChart.maxTemp }}℃</span>
                <span>预计总时长 {{ formatSinterEst(sinterChart.estMin) }}</span>
              </div>
              <svg :viewBox="sinterViewBox" class="curve-svg">
                <g v-for="g in sinterGrids" :key="g.key">
                  <line :x1="g.x1" :y1="g.y1" :x2="g.x2" :y2="g.y2" class="grid-line" />
                  <text :x="g.tx" :y="g.ty" class="grid-text" :text-anchor="g.anchor">{{ g.label }}</text>
                </g>
                <g>
                  <line
                    v-for="(ln, i) in sinterChart.lines"
                    :key="i"
                    :x1="ln.x1"
                    :y1="ln.y1"
                    :x2="ln.x2"
                    :y2="ln.y2"
                    :class="ln.cool ? 'curve-cool' : 'curve-solid'"
                  />
                </g>
              </svg>
              <div class="curve-tip">自然降温曲线及后续时间轴仅为示意，实际耗时以设备达温为准。</div>
            </div>

            <!-- 粉碎：破碎时间 + 破碎转速 -->
            <div v-else-if="step.procName === '粉碎'" class="form-grid two">
              <el-form-item label="破碎时间(min)">
                <el-input-number v-model="formData.schemeMap['粉碎']['破碎时间']" :min="0" class="!w-100%" />
              </el-form-item>
              <el-form-item label="破碎转速">
                <div class="flex items-center gap-4px !w-100%">
                  <el-input-number
                    v-model="formData.schemeMap['粉碎']['破碎转速']"
                    :min="0"
                    :max="3000"
                    placeholder="请输入0-3000"
                    class="!flex-1"
                  />
                  <span class="unit">r/min</span>
                </div>
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
    </fieldset>
    <template #footer>
      <el-button type="primary" @click="submitForm" :disabled="formLoading" v-if="!formReadonly">确 定</el-button>
      <el-button @click="dialogVisible = false">{{ formReadonly ? '关 闭' : '取 消' }}</el-button>
    </template>
  </el-dialog>

  <!-- 供应商检测配置-查看/编辑弹窗（支持编辑，暂存浏览器缓存） -->
  <ConfigEditDialog
    v-model="configEditVisible"
    :type="configEditType"
    :source="configEditSource"
    :segment-code="SECTION_CODE[formData.section] || ''"
    @saved="onConfigSaved"
  />
</template>

<script setup lang="ts">
import { ElNotification } from 'element-plus'
import { checkPermi } from '@/utils/permission'
import { dateFormatter } from '@/utils/formatTime'
import {
  FormulaFeedVO,
  FormulaSchemeVO,
  FormulaVO,
  FormulaConfigOverrideVO,
  cancelFormula,
  copyFormula,
  createFormula,
  getFormula,
  getFormulaConfigOverrideList,
  getFormulaPage,
  releaseFormula,
  saveFormulaConfigOverrides,
  submitReviewFormula,
  updateFormula
} from '@/api/lab/formula'
import ConfigEditDialog from './components/ConfigEditDialog.vue'
import { ConfigEditType, getConfigCache, isConfigChanged, setConfigCache } from './components/configCache'
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
// 研发分类枚举
const RdClassEnum = [
  { value: '材料开发', label: '材料开发' },
  { value: '工艺优化', label: '工艺优化' },
  { value: '体系验证', label: '体系验证' }
]
// 正负极枚举
const PoleEnum = [
  { value: '正极', label: '正极' },
  { value: '负极', label: '负极' },
  { value: '双极', label: '双极' }
]
// 优先级枚举
const PrioEnum = [
  { value: '高', label: '高' },
  { value: '中', label: '中' },
  { value: '低', label: '低' }
]
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
// 投料工序枚举：配方段 → 液体加料/固体加料/锆球加料；合成段 → 固体加料
const FEED_PROC_OPTIONS: Record<string, string[]> = {
  配方段: ['液体加料', '固体加料', '锆球加料'],
  合成段: ['固体加料']
}
const feedProcOptions = computed(() => FEED_PROC_OPTIONS[formData.value.section] || [])

// 物料假数据（物料维护接口暂未就绪，后续切换为接口获取）
interface MaterialOption {
  name: string
  code: string
  cat1: string
  cat2: string
  feedProc: string
}
const MOCK_MATERIALS: MaterialOption[] = [
  // 液体加料
  { name: '去离子水', code: 'MAT-L-001', cat1: '液体物料', cat2: '溶剂', feedProc: '液体加料' },
  { name: 'NMP', code: 'MAT-L-002', cat1: '液体物料', cat2: '溶剂', feedProc: '液体加料' },
  { name: 'PVDF胶液', code: 'MAT-L-003', cat1: '液体物料', cat2: '粘结剂', feedProc: '液体加料' },
  { name: '电解液', code: 'MAT-L-004', cat1: '液体物料', cat2: '电解质', feedProc: '液体加料' },
  // 固体加料
  { name: '磷酸铁锂', code: 'MAT-S-001', cat1: '固体物料', cat2: '正极活性材料', feedProc: '固体加料' },
  { name: '三元材料NCM811', code: 'MAT-S-002', cat1: '固体物料', cat2: '正极活性材料', feedProc: '固体加料' },
  { name: '石墨', code: 'MAT-S-003', cat1: '固体物料', cat2: '负极活性材料', feedProc: '固体加料' },
  { name: '导电炭黑SP', code: 'MAT-S-004', cat1: '固体物料', cat2: '导电剂', feedProc: '固体加料' },
  { name: 'PVDF粉料', code: 'MAT-S-005', cat1: '固体物料', cat2: '粘结剂', feedProc: '固体加料' },
  { name: '磷酸氢二钾', code: 'MAT-S-006', cat1: '固体物料', cat2: '辅料', feedProc: '固体加料' },
  // 锆球加料
  { name: '锆球3mm', code: 'MAT-Z-001', cat1: '研磨介质', cat2: '锆球', feedProc: '锆球加料' },
  { name: '锆球5mm', code: 'MAT-Z-002', cat1: '研磨介质', cat2: '锆球', feedProc: '锆球加料' },
  { name: '锆球10mm', code: 'MAT-Z-003', cat1: '研磨介质', cat2: '锆球', feedProc: '锆球加料' }
]
/** 物料下拉选项：按已选投料工序过滤，未选工序时展示全部 */
const materialOptionsFor = (feedProc?: string) =>
  feedProc ? MOCK_MATERIALS.filter((m) => m.feedProc === feedProc) : MOCK_MATERIALS

/** 选中物料：自动填充物料编号、一级分类、二级分类（未选工序时顺带填充默认工序） */
const onMaterialChange = (row: FormulaFeedVO, name: string) => {
  const mat = MOCK_MATERIALS.find((m) => m.name === name)
  if (mat) {
    row.materialCode = mat.code
    row.cat1 = mat.cat1
    row.cat2 = mat.cat2
    if (!row.feedProc) {
      row.feedProc = mat.feedProc
    }
  }
}
// 配方状态数字枚举（与后端 FormulaStatusEnum 对齐：1-新建、2-评审中、3-已下达、4-取消）
const FormulaStatus = {
  NEW: 1,
  REVIEWING: 2,
  RELEASED: 3,
  CANCELED: 4
} as const
// 状态下拉选项
const statusOptions = [
  { value: FormulaStatus.NEW, label: '新建' },
  { value: FormulaStatus.REVIEWING, label: '评审中' },
  { value: FormulaStatus.RELEASED, label: '已下达' },
  { value: FormulaStatus.CANCELED, label: '取消' }
]
/** 状态值 → 名称 */
const statusLabel = (status?: number) => statusOptions.find((s) => s.value === status)?.label ?? '-'
/** 状态值 → el-tag 类型 */
const statusTagType = (status?: number) => {
  switch (status) {
    case FormulaStatus.NEW:
      return 'info'
    case FormulaStatus.REVIEWING:
      return 'warning'
    case FormulaStatus.RELEASED:
      return 'success'
    case FormulaStatus.CANCELED:
      return 'danger'
    default:
      return 'info'
  }
}

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

/** 右下角状态流转提示（深色弹窗，对齐截图样式） */
const flowNotify = (content: string) => {
  const notify = ElNotification({
    title: '',
    message: content,
    position: 'bottom-right',
    customClass: 'status-flow-toast',
    duration: 3500,
    showClose: false
  })
  // 兜底自动关闭：鼠标悬停时 Element Plus 会暂停计时，避免弹窗一直不消失
  setTimeout(() => notify.close(), 3500)
}

/** 提交评审：新建 → 评审中 */
const handleSubmitReview = async (row: FormulaVO) => {
  try {
    await message.confirm(`确认提交评审配方「${row.code}」？`)
    await submitReviewFormula(row.id)
    flowNotify(`配方 ${row.code} 已提交评审，状态「评审中」`)
    await getList()
  } catch {}
}

/** 下达：评审中 → 已下达 */
const handleRelease = async (row: FormulaVO) => {
  try {
    await message.confirm(`确认下达配方「${row.code}」？`)
    await releaseFormula(row.id)
    flowNotify(`配方 ${row.code} 已流转至「已下达」，可在「实验任务调度」中一键排产`)
    await getList()
  } catch {}
}

/** 取消：新建/评审中/已下达 → 取消 */
const handleCancel = async (row: FormulaVO) => {
  try {
    await message.confirm(`确认取消配方「${row.code}」？`)
    await cancelFormula(row.id)
    flowNotify(`配方 ${row.code} 已取消`)
    await getList()
  } catch {}
}

/** 复制配方：生成一个新配方（状态新建，编号加 -C 后缀） */
const handleCopy = async (row: FormulaVO) => {
  try {
    await message.confirm(`确认复制配方「${row.code}」？复制后将生成新配方（编号 ${row.code}-C，状态新建）。`)
    const newId = await copyFormula(row.id)
    flowNotify(`已复制生成新配方（ID ${newId}），可点击「编辑」调整编号等信息`)
    await getList()
  } catch {}
}

// ==================== 表单弹窗 ====================
const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中
const formType = ref('') // 表单的类型：create - 新增；update - 修改；view - 查看
const formReadonly = ref(false) // 查看模式：禁用全部表单控件
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
// 供应商检测配置-查看/编辑弹窗（支持编辑，保存暂存浏览器缓存，配方确认时入库）
const configEditVisible = ref(false) // 编辑弹窗是否展示
const configEditType = ref<ConfigEditType>('method') // 编辑类型：method/judge/comprehensive
const configEditSource = ref<SyncMethodVO | SyncJudgeVO | SyncComprehensiveVO | null>(null) // 当前编辑的供应商配置
const editedTick = ref(0) // 变更刷新计数：驱动“配置项已更改”提示重新计算

/** 打开检测配置查看/编辑弹窗 */
const openConfigEdit = (type: ConfigEditType, source: SyncMethodVO | SyncJudgeVO | SyncComprehensiveVO | null) => {
  if (!source) {
    return
  }
  configEditType.value = type
  configEditSource.value = source
  configEditVisible.value = true
}

/** 编辑弹窗保存（暂存缓存）后：刷新“配置项已更改”提示 */
const onConfigSaved = () => {
  editedTick.value++
}

/** 判断选择项对应的供应商配置是否已更改（缓存中有且与原始不同） */
const isEditedShow = (type: ConfigEditType, source: SyncMethodVO | SyncJudgeVO | SyncComprehensiveVO | null) => {
  void editedTick.value // 建立响应式依赖，editedTick 变化时重算
  return !!source && isConfigChanged(type, (source as { dataId: string }).dataId)
}

/** 按名称从选项列表中查找选中的供应商配置对象（返回 null 表示未选择） */
const findMethodByName = (list: SyncMethodVO[], name?: string) =>
  name ? (list.find((m) => m.projectName === name) ?? null) : null
const findJudgeByName = (list: SyncJudgeVO[], name?: string) =>
  name ? (list.find((j) => j.name === name) ?? null) : null
const findComprehensiveByName = (list: SyncComprehensiveVO[], name?: string) =>
  name ? (list.find((c) => c.name === name) ?? null) : null

/** 配方保存（确认）时，将浏览器缓存中的检测配置变更统一入库（关联配方id + 供应商dataId） */
const syncConfigOverrides = async (formulaId: number) => {
  const overrides: FormulaConfigOverrideVO[] = []
  // 合成段表征：判定方式为“仅记录结果”时，选中的判断标准对应配置变更不入库
  const judgeWay = formData.value.schemeMap['表征']?.['离子电导率检测-判定方式']
  const skipJudgeDataIds = new Set<string>()
  if (judgeWay === '仅记录结果') {
    const selectedJudge = findJudgeByName(judgeOptions['离子电导率检测'] || [], formData.value.schemeMap['表征']['离子电导率检测-判断标准'])
    if (selectedJudge) {
      skipJudgeDataIds.add((selectedJudge as SyncJudgeVO).dataId)
    }
  }
  Object.keys(localStorage).forEach((key) => {
    if (!key.startsWith('lab_formula_config_edit:')) {
      return
    }
    const [, type, dataId] = key.split(':')
    if (type === 'judge' && skipJudgeDataIds.has(dataId)) {
      return
    }
    const item = getConfigCache(type as ConfigEditType, dataId)
    if (item && item.configJson !== item.originalJson) {
      overrides.push({
        formulaId,
        dataId,
        configType: type,
        configJson: item.configJson,
        originalJson: item.originalJson
      })
    }
  })
  if (overrides.length > 0) {
    await saveFormulaConfigOverrides(overrides)
  }
}
// 涂布线棒厚度规格（μm）
const coatingSpecs = [3, 5, 10, 15, 20]

const formData = ref({
  id: undefined,
  section: '',
  code: '',
  version: '',
  isCurrent: '',
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
  description: '',
  status: FormulaStatus.NEW,
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
  dialogTitle.value = type === 'create' ? '新增配方' : type === 'view' ? '查看配方' : '编辑配方'
  formType.value = type
  formReadonly.value = type === 'view' // 查看模式：字段只读
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
      // 编辑回显：按物料编号补齐物料名称
      formData.value.feedList.forEach((f) => {
        if (!f.materialName && f.materialCode) {
          const mat = MOCK_MATERIALS.find((m) => m.code === f.materialCode)
          f.materialName = mat?.name || ''
        }
      })
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
      // 将已入库的检测配置变更回填到浏览器缓存（回显“配置项已更改”并支持继续编辑）
      try {
        const overrides = await getFormulaConfigOverrideList(id)
        overrides.forEach((o) => {
          if (o.dataId && o.configType) {
            setConfigCache(o.configType as ConfigEditType, o.dataId, o.configJson ?? '{}', o.originalJson ?? '{}')
          }
        })
        editedTick.value++
      } catch {}
    } finally {
      formLoading.value = false
    }
  }
}

/** 工段变化：重置工艺路线、实验方案与投料信息，并按工段加载路线 */
const handleSectionChange = async () => {
  formData.value.route = ''
  formData.value.routeSteps = []
  formData.value.schemeMap = {}
  formData.value.feedList = []
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

/** 工艺路线变化：加载工序列表，初始化实验方案页签；切换路线时清空投料信息 */
const handleRouteChange = async (code?: string, preserve = false) => {
  formData.value.route = code || ''
  formData.value.routeSteps = []
  if (!code) {
    formData.value.schemeMap = {}
    formData.value.feedList = []
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
    formData.value.feedList = []
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
    if (formData.value.section === '合成段') {
      charItems.value.forEach((it) => {
        d[`${it}-方案`] = ''
      })
      d['离子电导率检测-判定方式'] = '按标准判定'
      d['离子电导率检测-判断标准'] = ''
    } else {
      charItems.value.forEach((it) => {
        d[`${it}-方法`] = ''
        d[`${it}-判定`] = ''
      })
      d['综合判定'] = ''
    }
  } else if (proc === '涂布') {
    d['正负极类型'] = ''
    d['膜材数量'] = 1
    buildCoatingRows(d, 1)
  } else if (proc === '烘干') {
    d['目标温度(℃)'] = undefined
    d['烘干时间(min)'] = undefined
  } else if (proc === '混料') {
    d['声共振时间'] = undefined
    d['加速度'] = undefined
    d['加速度单位'] = 'g'
  } else if (proc === '烧结') {
    d['起始温度(℃)'] = 0
    d['程序段'] = [newSinterSeg()]
  } else if (proc === '粉碎') {
    d['破碎时间'] = undefined
    d['破碎转速'] = undefined
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

// 混料-加速度单位
const accUnitOptions = ['g', 'm/s²', 'mm/s²']

// ============ 烧结-温度曲线（参照合成段-烘干.png） ============
const newSinterSeg = () => ({ target: undefined, rate: undefined, hold: undefined })
const sinterSegs = computed(() => (formData.value.schemeMap['烧结']?.['程序段'] || []) as { target?: number; rate?: number; hold?: number }[])
const addSinterSeg = () => {
  const segs = sinterSegs.value
  if (segs.length >= 8) {
    message.warning('最多可配置 8 段程序段')
    return
  }
  segs.push(newSinterSeg())
}
const moveSinterSeg = (index: number, dir: number) => {
  const segs = sinterSegs.value
  const to = index + dir
  if (to < 0 || to >= segs.length) {
    return
  }
  const tmp = segs[index]
  segs[index] = segs[to]
  segs[to] = tmp
}
const deleteSinterSeg = (index: number) => {
  sinterSegs.value.splice(index, 1)
}
/** 温控方式（自动）：与前一段目标温度对比；首段与起始温度对比 */
const sinterMode = (index: number): string => {
  const segs = sinterSegs.value
  const cur = Number(segs[index]?.target)
  if (isNaN(cur)) {
    return ''
  }
  const prev =
    index === 0
      ? Number(formData.value.schemeMap['烧结']?.['起始温度(℃)']) || 0
      : Number(segs[index - 1]?.target)
  if (isNaN(prev)) {
    return ''
  }
  if (cur > prev) {
    return '升温'
  }
  if (cur < prev) {
    return '自然降温'
  }
  return '保温'
}
const sinterTagType = (mode: string) => (mode === '升温' ? 'primary' : mode === '保温' ? 'warning' : 'info')
/** 时间/温度 → 时长展示 */
const formatSinterMin = (v: number): string => (v < 60 ? `${Math.round(v)} min` : `${(v / 60).toFixed(1)} h`)
const formatSinterEst = (estMin: number): string => (estMin < 60 ? `${Math.round(estMin)} min` : `${(estMin / 60).toFixed(1)} h`)
/** 升降温曲线：估算时间轴并换算为 SVG 坐标 */
const CHART_W = 720
const CHART_H = 220
const PAD = { l: 46, r: 16, t: 18, b: 26 }
const sinterViewBox = computed(() => `0 0 ${CHART_W} ${CHART_H}`)
const sinterChart = computed(() => {
  const segs = sinterSegs.value
  const start = Number(formData.value.schemeMap['烧结']?.['起始温度(℃)']) || 0
  const raw: { x1: number; y1: number; x2: number; y2: number; cool: boolean }[] = []
  let t = 0
  let prevT = start
  let maxTemp = start
  let estMin = 0
  segs.forEach((s, i) => {
    const target = Number(s.target)
    if (isNaN(target)) {
      return
    }
    maxTemp = Math.max(maxTemp, target)
    const mode = sinterMode(i)
    if (mode === '升温') {
      const rate = Number(s.rate) || 1
      const dur = Math.max(0, Math.abs(target - prevT) / rate)
      const t0 = t
      t += dur
      estMin += dur
      raw.push({ x1: t0, y1: prevT, x2: t, y2: target, cool: false })
    } else if (mode === '保温') {
      const hold = Number(s.hold) || 0
      const t0 = t
      t += hold
      estMin += hold
      raw.push({ x1: t0, y1: target, x2: t, y2: target, cool: false })
    } else if (mode === '自然降温') {
      const t0 = t
      t += 20 // 示意时长
      raw.push({ x1: t0, y1: prevT, x2: t, y2: target, cool: true })
    }
    prevT = target
  })
  const plotW = CHART_W - PAD.l - PAD.r
  const plotH = CHART_H - PAD.t - PAD.b
  const tempMax = Math.max(100, Math.ceil(Math.max(start, maxTemp) / 50) * 50)
  const dur = Math.max(60, t)
  const toX = (v: number) => PAD.l + (v / dur) * plotW
  const toY = (v: number) => PAD.t + plotH - (v / tempMax) * plotH
  return {
    lines: raw.map((l) => ({ ...l, x1: toX(l.x1), y1: toY(l.y1), x2: toX(l.x2), y2: toY(l.y2) })),
    maxTemp: Math.max(start, maxTemp),
    totalTime: t,
    estMin
  }
})
/** 曲线网格与刻度 */
const sinterGrids = computed(() => {
  const { maxTemp, totalTime } = sinterChart.value
  const plotW = CHART_W - PAD.l - PAD.r
  const plotH = CHART_H - PAD.t - PAD.b
  const tempMax = Math.max(100, Math.ceil(maxTemp / 50) * 50)
  const dur = Math.max(60, totalTime)
  const grids: { key: string; x1: number; y1: number; x2: number; y2: number; tx: number; ty: number; label: string; anchor: string }[] = []
  const ySteps = 4
  for (let i = 0; i <= ySteps; i++) {
    const v = (tempMax / ySteps) * i
    const y = PAD.t + plotH - (v / tempMax) * plotH
    grids.push({
      key: `y${i}`,
      x1: PAD.l,
      y1: y,
      x2: CHART_W - PAD.r,
      y2: y,
      tx: PAD.l - 6,
      ty: y + 4,
      label: `${v}℃`,
      anchor: 'end'
    })
  }
  const xSteps = 4
  for (let i = 0; i <= xSteps; i++) {
    const v = (dur / xSteps) * i
    const x = PAD.l + (v / dur) * plotW
    grids.push({
      key: `x${i}`,
      x1: x,
      y1: PAD.t,
      x2: x,
      y2: CHART_H - PAD.b,
      tx: x,
      ty: CHART_H - PAD.b + 16,
      label: formatSinterMin(v),
      anchor: 'middle'
    })
  }
  return grids
})

// 合成段表征：配置完整度判断（XRD 仅参数方案；离子电导率按标准判定时还需判断标准）
const charIncomplete = (item: string): boolean => {
  const map = formData.value.schemeMap['表征'] || {}
  if (!map[`${item}-方案`]) {
    return true
  }
  if (item === '离子电导率检测' && map['离子电导率检测-判定方式'] === '按标准判定' && !map['离子电导率检测-判断标准']) {
    return true
  }
  return false
}

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
    // 烧结程序段：JSON 字符串还原为数组
    if (row.paramKey === '程序段' && typeof row.paramValue === 'string') {
      try {
        map[row.procName][row.paramKey] = JSON.parse(row.paramValue)
      } catch {}
    }
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

/** 指定投料工序下的行（按投料工序分组展示） */
const feedRowsByProc = (proc: string) => formData.value.feedList.filter((f) => f.feedProc === proc)

/** 新增投料：投料顺序自动计数（当前卡片最大顺序 + 1） */
const handleAddFeed = (proc: string) => {
  const rows = feedRowsByProc(proc)
  const maxSeq = rows.reduce((max, r) => Math.max(max, r.feedSeq || 0), 0)
  formData.value.feedList.push({
    feedProc: proc,
    feedSeq: maxSeq + 1,
    materialName: '',
    materialCode: '',
    cat1: '',
    cat2: '',
    quantity: undefined,
    unit: 'g',
    deviation: undefined,
    tolerance: '±'
  })
}

/** 删除投料（按行定位到真实 feedList 下标） */
const handleDeleteFeed = (proc: string, index: number) => {
  const row = feedRowsByProc(proc)[index]
  if (!row) {
    return
  }
  const i = formData.value.feedList.indexOf(row)
  if (i > -1) {
    formData.value.feedList.splice(i, 1)
  }
}

/** 提交表单 */
const submitForm = async () => {
  if (!formRef) return
  // 校验失败（如配方编号为空）：Element Plus validate 会 reject，需捕获并提示，避免“保存无反应”
  try {
    await formRef.value.validate()
  } catch {
    message.warning('请完善必填项后再保存')
    return
  }
  formLoading.value = true
  try {
    const data = { ...formData.value }
    // 实验方案：schemeMap 拍平为 schemeList
    const schemeList: FormulaSchemeVO[] = []
    Object.entries(formData.value.schemeMap || {}).forEach(([proc, params]) => {
      Object.entries(params || {}).forEach(([k, v]) => {
        if (v !== '' && v !== null && v !== undefined) {
          schemeList.push({
            procName: proc,
            paramKey: k,
            paramValue: Array.isArray(v) ? JSON.stringify(v) : String(v)
          })
        }
      })
    })
    data.schemeList = schemeList
    data.feedList = formData.value.feedList || []
    // 保存配方（新增/更新），并拿到配方 id 用于检测配置变更入库
    let formulaId: number = formData.value.id ?? 0
    if (formType.value === 'create') {
      const newId = await createFormula(data)
      formulaId = newId as number
      message.success(t('common.createSuccess'))
    } else {
      await updateFormula(data)
      message.success(t('common.updateSuccess'))
    }
    // 将浏览器缓存中的检测配置变更统一入库（关联配方id + 供应商dataId）
    await syncConfigOverrides(formulaId)
    dialogVisible.value = false
    await getList()
  } catch (e) {
    // 接口错误：axios 拦截器已统一提示，这里兜底避免页面报错
    console.error(e)
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
    isCurrent: '',
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
    description: '',
    status: FormulaStatus.NEW,
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
// 投料信息：按投料工序分组的卡片表格（参照示例图片 投料.png）
.feed-card {
  background: #fff;
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 8px;
  padding: 14px;
  margin-bottom: 16px;
}
.feed-card-title {
  font-size: 14px;
  font-weight: 700;
  color: #313a43;
  margin-bottom: 12px;
}
html.dark .feed-card {
  background: rgba(255, 255, 255, 0.04);
}
html.dark .feed-card-title {
  color: #dbe6f5;
}

// 合成段表征（参照合成段-表征.png）
.char-syn {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.char-syn-row {
  display: grid;
  grid-template-columns: 140px 1fr 1fr;
  gap: 16px;
  align-items: start;
  background: #fff;
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 8px;
  padding: 14px;
}
.char-syn-name {
  font-size: 14px;
  font-weight: 700;
  color: #313a43;
}
.char-syn-status {
  font-size: 12px;
  color: #9aa3ab;
  margin-top: 4px;
}
.char-syn-label {
  font-size: 12px;
  color: #5b6570;
  margin-bottom: 6px;
}
.char-syn-label .req {
  color: #f56c6c;
  font-style: normal;
}
.char-syn-static {
  font-size: 12px;
  color: #9aa3ab;
  line-height: 1.6;
}
html.dark .char-syn-row {
  background: rgba(255, 255, 255, 0.04);
}
html.dark .char-syn-name {
  color: #dbe6f5;
}
html.dark .char-syn-label {
  color: #8ea3bf;
}

// 供应商检测配置：选择项 + 查看按钮 + 配置项已更改提示
.config-select-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
}
.config-changed-tip {
  margin-top: 2px;
  font-size: 12px;
  color: var(--accent-orange);
  line-height: 1.4;
}
html.dark .config-changed-tip {
  color: var(--accent-orange);
}

// 烧结温度曲线（参照合成段-烘干.png）
.tip-text {
  font-size: 12px;
  color: #8a919c;
  line-height: 1.7;
  margin-bottom: 4px;
}
.unit {
  color: #6b7280;
  font-size: 13px;
}
.seg-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: var(--el-color-primary);
  color: #fff;
  font-size: 12px;
}
.seg-placeholder {
  color: #b0b8c2;
}
.curve-stats {
  display: flex;
  gap: 24px;
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 8px;
}
.curve-svg {
  width: 100%;
  height: auto;
  background: #fff;
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 8px;
}
.grid-line {
  stroke: #e5e9ef;
  stroke-width: 1;
}
.grid-text {
  font-size: 10px;
  fill: #9aa3ab;
}
.curve-solid {
  stroke: #f4a261;
  stroke-width: 2;
}
.curve-cool {
  stroke: #9aa3ab;
  stroke-width: 2;
  stroke-dasharray: 5 4;
}
.curve-tip {
  font-size: 12px;
  color: #9aa3ab;
  margin-top: 6px;
}
html.dark .curve-svg {
  background: rgba(255, 255, 255, 0.04);
}
html.dark .grid-line {
  stroke: rgba(255, 255, 255, 0.12);
}
html.dark .curve-stats,
html.dark .unit {
  color: #8ea3bf;
}

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

<!-- 状态流转 toast 与 fieldset 重置（ElNotification 挂载于 body，样式需全局生效） -->
<style lang="scss">
.form-readonly-fieldset {
  border: 0;
  margin: 0;
  padding: 0;
  min-width: 0;
}
// 右下角状态流转深色弹窗（对齐截图样式：深炭底、白字、无图标）
// background/color 加 !important，避免浅色主题下 .el-notification 的白色覆盖导致文字看不清
.status-flow-toast {
  background: #2c3e50 !important;
  border: none !important;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  padding: 12px 16px;
  color: #fff !important;

  .el-notification__title {
    display: none;
  }
  .el-notification__icon {
    display: none;
  }
  .el-notification__content {
    margin: 0;
    padding: 0;
    color: #fff !important;
    font-size: 14px;
    line-height: 20px;
    text-align: left;
  }
  .el-notification__closeBtn {
    color: rgba(255, 255, 255, 0.6);
  }
}
</style>
