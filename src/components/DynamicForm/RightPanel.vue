/**
 *Copyright: Copyright (c) 2020
 *Author:JakHuang
 *Version 1.0 
 *Title: form-generator/Element UI表单设计及代码生成器 
 *GitHub: https://github.com/JakHuang/form-generator
 */
 <template>
  <div class="right-board">

    <a-tabs v-model="currentTab" tabPosition="top">
      <a-tab-pane key="field" tab="组件属性"></a-tab-pane>
      <a-tab-pane key="form" tab="表单属性"></a-tab-pane>
    </a-tabs>

    <div class="field-box">
      <div class="right-scrollbar">

        <a-form v-show="currentTab==='field' && showField" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-form-model-item v-if="activeData.label!==undefined" label="标题">
            <a-input v-model="activeData.label" placeholder="请输入标题" />
          </a-form-model-item>
          <a-form-model-item v-if="activeData.placeholder!==undefined" label="占位提示">
            <a-input v-model="activeData.placeholder" placeholder="请输入占位提示" />
          </a-form-model-item>
          <a-form-model-item v-if="activeData['start-placeholder']!==undefined" label="开始占位">
            <a-input v-model="activeData['start-placeholder']" placeholder="请输入占位提示" />
          </a-form-model-item>
          <a-form-model-item v-if="activeData['end-placeholder']!==undefined" label="结束占位">
            <a-input v-model="activeData['end-placeholder']" placeholder="请输入占位提示" />
          </a-form-model-item>
          <a-form-model-item v-if="activeData.span !== undefined" label="表单栅格">
            <a-slider v-model="activeData.span" :max="24" :min="1" :marks="{12:''}" @change="spanChange" />
          </a-form-model-item>
          <a-form-model-item v-if="activeData.showDivider !== undefined" label="显示分割线">
            <a-switch v-model="activeData.showDivider" />
          </a-form-model-item>
          <a-form-model-item v-if="activeData['show-summary'] !== undefined" label="显示合计">
            <a-switch v-model="activeData['show-summary']" />
          </a-form-model-item>

          <a-form-model-item
            v-if="activeData.justify !== undefined && activeData.type==='flex'"
            label="水平排列"
          >
            <a-select v-model="activeData.justify" 
            placeholder="请选择水平排列"
            allowClear @change="onJustifySelected">
              <a-select-option
                v-for="(item, index) in justifyOptions"
                :key="index"
                :value="item.value"
              />{{item.label}}</a-select>
          </a-form-model-item>

          <a-form-model-item v-if="activeData.align!==undefined && activeData.type==='flex'" label="垂直排列">
            <a-radio-group v-model="activeData.align" button-style="solid">
              <a-radio-button value="top">top</a-radio-button>
              <a-radio-button value="middle">middle</a-radio-button>
              <a-radio-button value="bottom">bottom</a-radio-button>
            </a-radio-group>
          </a-form-model-item>
          <a-form-model-item v-if="activeData.labelWidth!==undefined" label="标签宽度">
            <a-input-number v-model.number="activeData.labelWidth"  placeholder="请输入标签宽度" />
          </a-form-model-item>
          <a-form-model-item v-if="activeData.style&&activeData.style.width!==undefined" label="组件宽度">
            <a-input v-model="activeData.style.width" placeholder="请输入组件宽度" clearable />
          </a-form-model-item>
          

          <a-form-model-item v-if="activeData.vModel!==undefined && activeData.layout !== 'rowFormItem' && notObject(activeData.defaultValue)" label="默认值">
            <a-input v-model="activeData.defaultValue" />
          </a-form-model-item>
          
          <a-form-model-item v-if="activeData.tag==='a-checkbox-group'" label="至少应选">
            <a-input-number
              :value="activeData.min"
              :min="0"
              placeholder="至少应选"
              @change="$set(activeData, 'min', $event?$event:undefined)"
            />
          </a-form-model-item>

          <a-form-model-item v-if="activeData.tag==='a-checkbox-group'" label="最多可选">
            <a-input-number
              :value="activeData.max"
              :min="0"
              placeholder="最多可选"
              @change="$set(activeData, 'max', $event?$event:undefined)"
            />
          </a-form-model-item>
          
          <a-form-model-item v-if="activeData.autosize !== undefined" label="最小行数">
            <a-input-number v-model="activeData.autosize.minRows" :min="1" placeholder="最小行数" />
          </a-form-model-item>
          <a-form-model-item v-if="activeData.autosize !== undefined" label="最大行数">
            <a-input-number v-model="activeData.autosize.maxRows" :min="1" placeholder="最大行数" />
          </a-form-model-item>
          <a-form-model-item v-if="activeData.min !== undefined" label="最小值">
            <a-input-number v-model="activeData.min" placeholder="最小值" />
          </a-form-model-item>
          <a-form-model-item v-if="activeData.max !== undefined" label="最大值">
            <a-input-number v-model="activeData.max" placeholder="最大值" />
          </a-form-model-item>
          <a-form-model-item v-if="activeData.step !== undefined" label="步长">
            <a-input-number v-model="activeData.step" placeholder="步数" />
          </a-form-model-item>
          <a-form-model-item v-if="['a-input-number','fc-amount'].includes(activeData.tag)" label="精度">
            <a-input-number v-model="activeData.precision" :min="0" placeholder="精度" />
          </a-form-model-item>
          <a-form-model-item v-if="['a-input-number','fc-amount'].includes(activeData.tag)" label="按钮位置">
            <a-radio-group v-model="activeData['controls-position']" button-style="solid">
              <a-radio-button value="">默认</a-radio-button>
              <a-radio-button value="right">右侧</a-radio-button>
            </a-radio-group>
          </a-form-model-item>
          <a-form-model-item v-if="activeData.maxlength !== undefined" label="最多输入">
            <a-input v-model="activeData.maxlength" placeholder="请输入字符长度">
              <template slot="append">个字符</template>
            </a-input>
          </a-form-model-item>
          <a-form-model-item v-if="activeData.actionText !== undefined" label="动作文字">
            <a-input v-model="activeData.actionText" placeholder="请输入动作文字" />
          </a-form-model-item>
          <a-form-model-item v-if="activeData.tag === 'fc-input-table'" label="类型">
            <a-select size="small" @change="onTypeSelected">
              <a-option value="list">列表</a-option>
              <a-option value="table">表格</a-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item
            v-if="activeData.type !== undefined && ['a-date-picker','fc-date-duration'].includes(activeData.tag)"
            label="时间类型"
          >
            <a-select
              v-model="activeData.type"
              placeholder="请选择时间类型"
              :style="{ width: '100%' }"
              @change="dateTypeChange"
            >
              <a-select-option
                v-for="(item, index) in dateOptions"
                :key="index"
                :value="item.value"
              > {{item.label}} </a-select-option>
            </a-select>
          </a-form-model-item>

          <a-form-model-item label="文件类型" v-if="activeData.accept !== undefined">
            <a-select placeholder="请选择文件类型" allowClear @change="onFileSelected">
              <a-select-option value="image/*"> 图片 </a-select-option>
              <a-select-option value="video/*"> 视频 </a-select-option>
              <a-select-option value="audio/*"> 音频 </a-select-option>
              <a-select-option value=".xls,.xlsx"> excel </a-select-option>
              <a-select-option value=".doc,.docx"> word </a-select-option>
              <a-select-option value=".pdf"> pdf </a-select-option>
              <a-select-option value=".txt"> txt </a-select-option>
            </a-select>
          </a-form-model-item>

                
          <a-form-model-item v-if="activeData.fileSize !== undefined" label="文件大小">
            <a-input v-model.number="activeData.fileSize"  placeholder="请输入文件大小">
              <a-select slot="addonAfter" v-model="activeData.sizeUnit" style="width: 80px">
                <a-select-option value="KB">KB</a-select-option>
                <a-select-option value="MB">MB</a-select-option>
                <a-select-option value="GB">GB</a-select-option>
              </a-select>
            </a-input>
          </a-form-model-item>

          <a-form-model-item v-if="activeData['list-type'] !== undefined" label="列表类型" :wrapper-col="{ span: 18 }">
            <a-radio-group v-model="activeData['list-type']" button-style="solid">
              <a-radio-button value="text">text</a-radio-button>
              <a-radio-button value="picture">picture</a-radio-button>
              <a-radio-button value="picture-card">picture-card</a-radio-button>
            </a-radio-group>
          </a-form-model-item>
          <a-form-model-item
            v-if="activeData.buttonText !== undefined"
            v-show="'picture-card' !== activeData['list-type']"
            label="按钮文字"
          >
            <a-input v-model="activeData.buttonText" placeholder="请输入按钮文字" />
          </a-form-model-item>
          <a-form-model-item v-if="activeData['range-separator'] !== undefined" label="分隔符">
            <a-input v-model="activeData['range-separator']" placeholder="请输入分隔符" />
          </a-form-model-item>
          <a-form-model-item v-if="activeData['picker-options'] !== undefined" label="时间段">
            <a-input v-model="activeData['picker-options'].selectableRange" placeholder="请输入时间段" />
          </a-form-model-item>
          <a-form-model-item v-if="activeData.format !== undefined" label="时间格式">
            
            <!-- <a-input
              :value="activeData.format"
              placeholder="请输入时间格式"
              @input="setTimeValue($event)"
            /> -->

            <a-input
              v-model="activeData.format"
              placeholder="请输入时间格式"
              @change="setTimeValue(activeData.format)"
            />

          </a-form-model-item>
          <a-form-model-item v-if="activeData['showDuration'] !== undefined" label="计算时长">
            <a-switch v-model="activeData['showDuration']" 
              placeholder="自动计算时长" @change="requireChange" />
          </a-form-model-item>
          <template
            v-if="['a-checkbox-group', 'a-radio-group', 'a-select'].indexOf(activeData.tag) > -1"
          >
            <a-divider>选项</a-divider>
            <draggable
              :list="activeData.options"
              :animation="340"
              group="selectItem"
              handle=".option-drag"
            >
              <div v-for="(item, index) in activeData.options" :key="index" class="select-item">
                <div class="select-line-icon option-drag">
                  <i class="a-icon-s-operation" />
                </div>
                <!-- <a-input v-model="item.label" placeholder="选项名" size="small" /> -->
                <a-input
                  placeholder="选项值"
                  v-model="item.value"
                  @change="setOptionValue(item, $event)"
                />
                <div
                  class="close-btn select-line-icon"
                  @click="activeData.options.splice(index, 1)"
                >
                  <i class="a-icon-remove-outline" />
                </div>
              </div>
            </draggable>
            <div style="margin-left: 20px;">
              <a-button
                style="padding-bottom: 0"
                icon="a-icon-circle-plus-outline"
                type="text"
                @click="addSelectItem"
              >添加选项</a-button>
            </div>
            <a-divider />
          </template>

          <template v-if="['a-cascader'].indexOf(activeData.tag) > -1">
            <a-divider>选项</a-divider>
            
            <a-form-model-item label="数据类型">
              <a-radio-group v-model="activeData.dataType" button-style="solid">
                <a-radio-button value="dynamic">动态数据</a-radio-button>
                <a-radio-button value="static">静态数据</a-radio-button>
              </a-radio-group>
            </a-form-model-item>

            <template v-if="activeData.dataType === 'dynamic'">
              <a-form-model-item label="标签键名">
                <a-input v-model="activeData.labelKey" placeholder="请输入标签键名" />
              </a-form-model-item>
              <a-form-model-item label="值键名">
                <a-input v-model="activeData.valueKey" placeholder="请输入值键名" />
              </a-form-model-item>
              <a-form-model-item label="子级键名">
                <a-input v-model="activeData.childrenKey" placeholder="请输入子级键名" />
              </a-form-model-item>
            </template>

            <!-- replaceFields 是数据别名的映射
            <a-tree
              v-if="activeData.dataType === 'static'"
              class="draggable-tree"
              :tree-data="activeData.options"
              :replaceFields="{
                children: 'children', 
                title: 'label', 
                key: 'value' 
              }"
              @dragenter="onDragEnter"
              @drop="onDrop"
              draggable
            /> -->

            <a-tree
              v-if="activeData.dataType === 'static'"
              class="draggable-tree"
              :tree-data="activeData.options"
              @dragenter="onDragEnter"
              @drop="onDrop"
            />

            <div v-if="activeData.dataType === 'static'" style="margin-left: 20px">
              <a-button
                style="padding-bottom: 0"
                icon="a-icon-circle-plus-outline"
                type="text"
                @click="addTreeItem"
              >添加父级</a-button>
            </div>
            <a-divider />

          </template>

          <a-form-model-item v-if="activeData.optionType !== undefined" label="选项样式">
            <a-radio-group v-model="activeData.optionType" button-style="solid">
              <a-radio-button value="default">默认</a-radio-button>
              <a-radio-button value="button">按钮</a-radio-button>
            </a-radio-group>
          </a-form-model-item>
          <!-- <a-form-model-item v-if="activeData['active-color'] !== undefined" label="开启颜色">
            <a-color-picker v-model="activeData['active-color']" />
          </a-form-model-item>
          <a-form-model-item v-if="activeData['inactive-color'] !== undefined" label="关闭颜色">
            <a-color-picker v-model="activeData['inactive-color']" />
          </a-form-model-item> -->

          <a-form-model-item v-if="activeData['allow-half'] !== undefined" label="允许半选">
            <a-switch v-model="activeData['allow-half']" />
          </a-form-model-item>
          <a-form-model-item v-if="activeData['show-text'] !== undefined" label="辅助文字">
            <a-switch v-model="activeData['show-text']" @change="rateTextChange" />
          </a-form-model-item>
          <a-form-model-item v-if="activeData['show-score'] !== undefined" label="显示分数">
            <a-switch v-model="activeData['show-score']" @change="rateScoreChange" />
          </a-form-model-item>
          <a-form-model-item v-if="activeData['show-stops'] !== undefined" label="显示间断点">
            <a-switch v-model="activeData['show-stops']" />
          </a-form-model-item>
          <a-form-model-item v-if="activeData.range !== undefined" label="范围选择">
            <a-switch v-model="activeData.range" @change="rangeChange" />
          </a-form-model-item>

          <!-- Antd Design 无颜色选择组件 -->
          <!-- <a-form-model-item
            v-if="activeData.border !== undefined && activeData.optionType === 'default'"
            label="是否带边框"
          >
            <a-switch v-model="activeData.border" />
          </a-form-model-item>-->
          <!-- <a-form-model-item v-if="activeData.tag === 'a-color-picker'" label="颜色格式">
            <a-select
              v-model="activeData['color-format']"
              placeholder="请选择颜色格式"
              :style="{ width: '100%' }"
              @change="colorFormatChange"
            >
              <a-option
                v-for="(item, index) in colorFormatOptions"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </a-select>
          </a-form-model-item> -->

          <template v-if="activeData.tag === 'fc-org-select'">
            <a-form-model-item label="弹框名称" v-if="activeData.title !== undefined">
              <a-input v-model="activeData.title" placeholder="请输入弹框名称" />
            </a-form-model-item>

            <a-form-model-item label="可选数量" v-if="activeData.maxNum !== undefined">
                <a-input-number v-model="activeData.maxNum" placeholder="请输入" />
            </a-form-model-item>
            <a-form-model-item label="按钮类型" >
              <a-select v-model="activeData.buttonType">
                <a-select-option value="button"> Button </a-select-option>
                <a-select-option value="input"> Input </a-select-option>
              </a-select>
            </a-form-model-item>

            <template v-if="activeData.buttonType === 'button' && activeData.tagConfig">
              <a-divider>标签展示</a-divider>
              
              <a-form-model-item label="大小" v-if="activeData.tagConfig.size !== undefined">
                  <a-radio-group v-model="activeData.tagConfig.size" button-style="solid">
                    <a-radio-button value="medium">中等</a-radio-button>
                    <a-radio-button value="small">较小</a-radio-button>
                    <a-radio-button value="mini">迷你</a-radio-button>
                  </a-radio-group>
              </a-form-model-item>

              <a-form-model-item label="主题" v-if="activeData.tagConfig.effect !== undefined">
                <a-select placeholder="请选择" @change="onThemeSelected">
                  <a-select-option
                    v-for="item in themeOptions"
                    :key="item.value"
                    :value="item.value"
                    :disabled="item.disabled">{{item.label}}
                  </a-select-option>
                </a-select>
              </a-form-model-item>

              <a-form-model-item label="标签样式" v-if="activeData.tagConfig.type !== undefined">
                  <a-select placeholder="请选择" @change="onTagSelected">
                  <a-select-option
                    v-for="item in typeOptions"
                    :key="item.value"
                    :value="item.value"
                    :disabled="item.disabled">{{item.label}}
                  </a-select-option>
                </a-select>
              </a-form-model-item>

              <a-form-model-item label="渐变动画" v-if="activeData.tagConfig['disable-transitions'] !== undefined">
                  <!-- <a-switch v-model="activeData.tagConfig['disable-transitions']" 
                    :inactive-value="true" :active-value="false" 
                    placeholder="请输入" /> -->
                  <a-switch  placeholder="请输入" @change="onTransitionsSwitch" />
              </a-form-model-item>

              <a-form-model-item label="边框描边" v-if="activeData.tagConfig.hit !== undefined">
                  <a-switch v-model="activeData.tagConfig.hit" placeholder="请输入" />
              </a-form-model-item>

            </template>
          </template>


          <a-form-model-item
            v-if="activeData.size !== undefined &&
              (activeData.optionType === 'button' ||
                activeData.border ||
                activeData.tag === 'a-color-picker')"
            label="选项尺寸"
          >
            <a-radio-group v-model="activeData.size" button-style="solid">
              <a-radio-button value="medium">中等</a-radio-button>
              <a-radio-button value="small">较小</a-radio-button>
              <a-radio-button value="mini">迷你</a-radio-button>
            </a-radio-group>
          </a-form-model-item>
          <a-form-model-item v-if="activeData.tag === 'a-cascader'" label="是否多选">
            <a-switch v-model="activeData.props.props.multiple" />
          </a-form-model-item>
          <a-form-model-item v-if="activeData.tag === 'a-cascader'" label="可否筛选">
            <a-switch v-model="activeData.filterable" />
          </a-form-model-item>
          <a-form-model-item v-if="activeData.showTip !== undefined" label="显示提示">
            <a-switch v-model="activeData.showTip" />
          </a-form-model-item>
          
          <a-form-model-item
            v-if="activeData.tag === 'a-upload' && activeData.multiple !== undefined"
            label="多选文件"
          >
            <a-switch v-model="activeData.multiple" />
          </a-form-model-item>
          <a-form-model-item v-if="activeData['auto-upload'] !== undefined" label="自动上传">
            <a-switch v-model="activeData['auto-upload']" />
          </a-form-model-item>
          
          <a-form-model-item v-if="activeData.expression !== undefined" label="计算公式">
            <div @click="expDialogVisible = true;" 
            class="pane-calc-preview">
              <span 
                v-for="(item, index) in activeData.expression"
                :key="index"
                :class="{'calc-btn': typeof item !== 'string',
                'error': typeof item !== 'string' && item.label === '无效的值'}" >
                  {{typeof item !== 'string' ? item.label : item}}
              </span>
            </div>
          </a-form-model-item>
          
          <!-- <a-form-model-item v-if="activeData.required !== undefined" label="是否必填"> -->
          <a-form-model-item label="是否必填">
            <a-switch v-model="activeData.required" @change="requireChange" :disabled="!couldChangeRequire" />
              <a-tooltip placement="topLeft" :title="flowTipsTitle">
                <span
                  v-show="activeData.proCondition"
                  style="font-size:12px;color#aaa;"
                > (勾选后可作为流程条件)</span>
              </a-tooltip>
          </a-form-model-item>

          <a-form-model-item v-if="activeData.showChinese !== undefined" label="显示大写">
            <a-switch v-model="activeData.showChinese" />
          </a-form-model-item>

          <a-form-model-item label="作为摘要">
            <a-switch v-model="activeData.asSummary"  />
          </a-form-model-item>

          <a-form-model-item v-if="activeData.tag === 'a-select'" label="是否可搜索">
            <a-switch v-model="activeData.filterable" />
          </a-form-model-item>
          
          <a-form-model-item v-if="activeData.tag === 'a-select'" label="是否多选">
            <a-switch v-model="activeData.multiple" @change="multipleChange" />
          </a-form-model-item>

          <a-form-model-item v-if="activeData.cmpType === 'custom'" label="组件说明">
            <a-input type="textarea" v-model="activeData.explain" />
          </a-form-model-item>
        </a-form>

        <!-- 表单属性 -->
        <a-form v-show="currentTab === 'form'" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-form-model-item label="表单名">
            <a-input v-model="formConf.formRef" placeholder="请输入表单名(ref)" />
          </a-form-model-item>
          <a-form-model-item label="表单尺寸">
            <a-radio-group v-model="formConf.size" button-style="solid">
              <a-radio-button value="medium">中等</a-radio-button>
              <a-radio-button value="small">较小</a-radio-button>
              <a-radio-button value="mini">迷你</a-radio-button>
            </a-radio-group>
          </a-form-model-item>
          <a-form-model-item label="标签对齐" :wrapper-col="{ span: 18 }">
            
            <a-radio-group v-model="formConf.labelPosition" button-style="solid">
              <a-radio-button value="left">左对齐</a-radio-button>
              <a-radio-button value="right">右对齐</a-radio-button>
              <a-radio-button value="top">顶部对齐</a-radio-button>
            </a-radio-group>

          </a-form-model-item>
          <a-form-model-item label="标签宽度">
            <a-input-number v-model="formConf.labelWidth" placeholder="标签宽度" />
          </a-form-model-item>
          <a-form-model-item label="栅格间隔">
            <a-input-number v-model="formConf.gutter" :min="0" placeholder="栅格间隔" />
          </a-form-model-item>
        </a-form>

      </div>
    </div>

    <treeNode-dialog :visible.sync="dialogVisible" title="添加选项" @commit="addNode" />
    <!-- <icons-dialog
      :visible.sync="iconsVisible"
      :current="activeData[currentIconModel]"
      @select="setIcon"
    /> -->
    <icons-dialog
      :visible.sync="iconsVisible"
      :current="activeData[currentIconModel]"
      @select="setIcon"
    />

    <a-modal
      title="编辑计算公式"
      class="calc-dialog"
      width="600px"
      :dialog-style="{ top: '80px' }"
      :visible.sync="expDialogVisible"
      @ok="onExpDialogClose(false)"
      @cancel="onExpDialogClose(false)"
    >
    
      <div class="calc-box">
        <a-alert style="color: green;" v-show="!expValid"
          message="编辑的公式不符合计算法则，无法计算" 
          type="error"
          :closable="true"
          @close="setExpValid(true)"
          show-icon>
        </a-alert>
        <div class="calc-preview" :class="{error: !expValid}">
          计算公式 = 
          <span 
            v-for="(item, index) in expressionTemp" 
            :key="index"
            :class="{'calc-btn': typeof item !== 'string',
            'error': typeof item !== 'string' && item.label === '无效的值'}"
            >
          {{typeof item !== 'string' ? item.label : item}}
          </span>
          <div class="preview-actions">
            <i class="el-icon-price-tag" style="transform: rotate(-90deg);"  @click="expressionTemp.pop()"></i>
            <i class="el-icon-delete" @click="expressionTemp = []"></i>
          </div>
        </div>
        <div class="calc-tip">编辑计算公式可用来完成审批单内数据的自动结算，例如：采购单内设置计算公式“合计=单价×数量”，发起人填写单价、数量后，组件将自动计算出合计金额，免手动计算</div>
        <div>
          <span>计算对象：</span>
          <span 
            v-for="item in calculateCmps" 
            :key="item.vModel"
            @click="expressionTemp.push(item)"
            class="calc-btn" >
          {{item.label}}
          </span>
        </div>
        <div style="margin: 10px 0;">
          <span>计算符号：</span>
          <span 
          v-for="item in ['+', '-', '×', '÷', '(', ')']" 
          class="calc-btn" 
          :key="item"
          @click="expressionTemp.push(item)">{{item}}</span>
        </div>

        <div style="margin: 10px 0;">
          <span style="float: left;">数字键盘：</span>
          <div style="width: 110px;line-height: 2.5;overflow: hidden;">
            <span 
              :key="item"
              class="calc-btn" 
              v-for="item in ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '.']" 
              @click="expressionTemp.push(item)" >{{item}}</span>
            </div>
        </div>
      </div>
      <!-- <span slot="footer" class="dialog-footer">
        <a-button @click="expDialogVisible = false;expressionTemp = []" size="mini">取 消</a-button>
        <a-button type="primary" @click="checkExpression"  size="mini">确 定</a-button>
      </span> -->

      <template slot="footer" class="dialog-footer">
        <a-button key="back" @click="onExpDialogCancel(false)"> 取 消 </a-button>
        <a-button key="submit" type="primary"  @click="checkExpression">确 定 </a-button>
      </template>

    </a-modal>

  </div>
</template>

<script>
import { isArray } from "util";
import TreeNodeDialog from "./TreeNodeDialog";
import { isNumberStr } from "./utils/index";
import IconsDialog from "./IconsDialog";
import {
  inputComponents,
  selectComponents,
  layoutComponents
} from "./components/generator/config";
import { saveFormConf } from "./utils/db";
import draggable from "vuedraggable";
import {mergeNumberOfExps, validExp, toRPN, calcRPN} from '@/utils/index.js'
const dateTimeFormat = {
  date: "YYYY-MM-DD",
  week: "YYYY 第 WW 周",
  month: "YYYY-MM",
  year: "YYYY",
  datetime: "YYYY-MM-DD HH:mm:ss",
  daterange: "YYYY-MM-DD",
  monthrange: "YYYY-MM",
  datetimerange: "YYYY-MM-DD HH:mm:ss"
};

export default {
  components: {
    TreeNodeDialog,
    IconsDialog,
    draggable
  },
  props: ["showField", "activeData", "formConf", "couldChangeRequire"],
  data() {
    return {
      flowTipsTitle: `流程条件：流程设计里可用于区分流程走向。例如：金额大于500需要主管+经理审批；小于500只需要主管审批。`,
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
      expressionTemp: [],
      proConditionCmp: ["a-input-number", "a-select", "a-radio-group"], // 可作为流程图条件的组件
      currentTab: "field",
      currentNode: null,
      dialogVisible: false,
      iconsVisible: false,
      currentIconModel: null,
      expDialogVisible: false,
      expValid: true,
      themeOptions:[
        {value: 'dark', label: '深色'},
        {value: 'light', label: '亮色'},
        {value: 'plain', label: '扁平'},
      ],
      typeOptions:[{
        value: 'success',
        label: 'success'
      },
      {
        value: 'info',
        label: 'info'
      },
      {
        value: 'warning',
        label: 'warning'
      },
      {
        value: 'danger',
        label: 'danger'
      }],
      dateTypeOptions: [
        {
          label: "日(date)",
          value: "date"
        },
        {
          label: "月(month)",
          value: "month"
        },
        {
          label: "年(year)",
          value: "year"
        },
        {
          label: "日期时间(datetime)",
          value: "datetime"
        }
      ],
      dateRangeTypeOptions: [
        {
          label: "日期范围(daterange)",
          value: "daterange"
        },
        {
          label: "月范围(monthrange)",
          value: "monthrange"
        },
        {
          label: "日期时间范围(datetimerange)",
          value: "datetimerange"
        }
      ],
      colorFormatOptions: [
        {
          label: "hex",
          value: "hex"
        },
        {
          label: "rgb",
          value: "rgb"
        },
        {
          label: "rgba",
          value: "rgba"
        },
        {
          label: "hsv",
          value: "hsv"
        },
        {
          label: "hsl",
          value: "hsl"
        }
      ],
      justifyOptions: [
        {
          label: "start",
          value: "start"
        },
        {
          label: "end",
          value: "end"
        },
        {
          label: "center",
          value: "center"
        },
        {
          label: "space-around",
          value: "space-around"
        },
        {
          label: "space-between",
          value: "space-between"
        }
      ],
      layoutTreeProps: {
        label(data, node) {
          return data.componentName || `${data.label}: ${data.vModel}`;
        }
      }
    };
  },
  computed: {
    // documentLink() {
    //   return (
    //     this.activeData.document
    //     || 'https://element.eleme.cn/#/zh-CN/component/installation'
    //   )
    // },
    dateOptions() {
      if (
        this.activeData.type !== undefined &&
        ['a-date-picker','fc-date-duration'].includes(this.activeData.tag)
      ) {
        if (this.activeData["start-placeholder"] === undefined) {
          return this.dateTypeOptions;
        }
        return this.dateRangeTypeOptions;
      }
      return [];
    },
    tagList() {
      return [
        {
          label: "输入型组件",
          options: inputComponents
        },
        {
          label: "选择型组件",
          options: selectComponents
        }
      ];
    },
    calculateCmps () {
      const calcList = []
      const loop = (data, parent) => {
        if(!data) return
        if(Array.isArray(data.children)) {
          loop(data.children, data)
        }
        if(Array.isArray(data)) data.forEach(d => loop(d, parent)) 
        if (['a-input-number', 'fc-amount'].includes(data.tag)){
          const isTableChild = parent && parent.rowType === 'table'
          calcList.push({
            vModel: isTableChild ? parent.vModel + '.' + data.vModel : data.vModel,
            label: isTableChild ? parent.label + '.' + data.label : data.label
          })
        }
      }
      loop(this.$store.state.formItemList)
      return calcList
    }
  },
  watch: {
    formConf: {
      handler(val) {
        saveFormConf(val);
      },
      deep: true
    },
    activeData (val) {
      if (val.tag !== 'fc-calculate') return
      this.reloadExpressionTemp()
    }
  },
  methods: {
    onExpDialogCancel( bool = false ) {
      this.expDialogVisible = bool;
      this.expressionTemp = [];
      // this.setExpValid(false);
    },
    setExpValid( bool ) {
      console.log("setExpValid");
      this.expValid = bool;
    },
    notObject(val) {
      return val === null || val === undefined || Object(val) !== val
    },
    reloadExpressionTemp(){
      const isValid = d => {
        const target = this.calculateCmps.find(cmp => cmp.vModel === d.vModel && cmp.label === d.label)
        return target ? true : false
      }
      this.expressionTemp = this.activeData.expression.map(t => {
        return typeof t === 'string' || isValid(t) ? t : { vModel: t.vModel, label: '无效的值'}
      })
      this.activeData.expression = this.expressionTemp
    },
    onTransitionsSwitch( value ) {
      this.$set(this.activeData.tagConfig, "disable-transitions", !value);
    },
    requireChange(required) {
      // 下拉 单选 计数 日期区间 时间区间 需要写进流程条件中
      if (!this.activeData.proCondition) return;
      if (required && !this.activeData.multiple) {
        // 没有设置时长的时间范围组件不能作为流程条件
        const isRangeCmp = ['fc-date-duration','fc-time-duration'].includes(this.activeData.tag)
        const showDuration = this.activeData.showDuration
        if( isRangeCmp && !showDuration){
          this.$store.commit("delPCondition", this.activeData.formId);
          return 
        }
        this.$store.commit("addPCondition", this.activeData);
      } else {
        this.$store.commit("delPCondition", this.activeData.formId);
      }
    },
    checkExpression(){
      let formatExp = mergeNumberOfExps(this.expressionTemp)
      const temp = formatExp.map(t => typeof t === 'object' ? 1 : t)
      this.expValid = validExp(temp, false)
      if(this.expValid) {
        this.activeData.expression = this.expressionTemp // calcRPN(toRPN(formatExp))
        this.expDialogVisible = false
      }
    },
    addReg() {
      this.activeData.regList.push({
        pattern: "",
        message: ""
      });
    },
    addSelectItem() {
      this.activeData.options.push({
        label: "",
        value: ""
      });
    },
    addTreeItem() {
      ++this.idGlobal;
      this.dialogVisible = true;
      this.currentNode = this.activeData.options;
    },
    renderContent(h, { node, data, store }) {
      return (
        <div class="custom-tree-node">
          <span>{node.label}</span>
          <span class="node-operation">
            <i
              on-click={() => this.append(data)}
              class="a-icon-plus"
              title="添加"
            ></i>
            <i
              on-click={() => this.remove(node, data)}
              class="a-icon-delete"
              title="删除"
            ></i>
          </span>
        </div>
      );
    },
    append(data) {
      if (!data.children) {
        this.$set(data, "children", []);
      }
      this.dialogVisible = true;
      this.currentNode = data.children;
    },
    remove(node, data) {
      const { parent } = node;
      const children = parent.data.children || parent.data;
      const index = children.findIndex(d => d.id === data.id);
      children.splice(index, 1);
    },
    addNode(data) {
      this.currentNode.push(data);
    },
    onDrop(info) {
      console.log(info);
      const dropKey = info.node.eventKey;
      const dragKey = info.dragNode.eventKey;
      const dropPos = info.node.pos.split('-');
      const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);
      const loop = (data, key, callback) => {
        data.forEach((item, index, arr) => {
          if (item.key === key) {
            return callback(item, index, arr);
          }
          if (item.children) {
            return loop(item.children, key, callback);
          }
        });
      };
      // const data = [...this.gData];

      const data = [ ...this.activeData.options ];

      // Find dragObject
      let dragObj;
      loop(data, dragKey, (item, index, arr) => {
        arr.splice(index, 1);
        dragObj = item;
      });
      if (!info.dropToGap) {
        // Drop on the content
        loop(data, dropKey, item => {
          item.children = item.children || [];
          // where to insert 示例添加到尾部，可以是随意位置
          item.children.push(dragObj);
        });
      } else if (
        (info.node.children || []).length > 0 && // Has children
        info.node.expanded && // Is expanded
        dropPosition === 1 // On the bottom gap
      ) {
        loop(data, dropKey, item => {
          item.children = item.children || [];
          // where to insert 示例添加到尾部，可以是随意位置
          item.children.unshift(dragObj);
        });
      } else {
        let ar;
        let i;
        loop(data, dropKey, (item, index, arr) => {
          ar = arr;
          i = index;
        });
        if (dropPosition === -1) {
          ar.splice(i, 0, dragObj);
        } else {
          ar.splice(i + 1, 0, dragObj);
        }
      }
      // this.gData = data;

      this.$set(this.activeData, "options", data);

    },
    onDragEnter() {},
    setOptionValue(item, event) {
      let val = event.target.value;
      let res = isNumberStr(val) ? +val : val;
      item.label = res;
      item.value = res;
    },
    setDefaultValue(val) {
      if (Array.isArray(val)) {
        return val.join(",");
      }
      if (["string", "number"].indexOf(val) > -1) {
        return val;
      }
      if (typeof val === "boolean") {
        return `${val}`;
      }
      return val;
    },
    onDefaultValueInput(str) {
      if (isArray(this.activeData.defaultValue)) {
        // 数组
        this.$set(
          this.activeData,
          "defaultValue",
          str.split(",").map(val => (isNumberStr(val) ? +val : val))
        );
      } else if (["true", "false"].indexOf(str) > -1) {
        // 布尔
        this.$set(this.activeData, "defaultValue", JSON.parse(str));
      } else {
        // 字符串和数字
        this.$set(
          this.activeData,
          "defaultValue",
          isNumberStr(str) ? +str : str
        );
      }
    },
    onTypeSelected(value) {
      console.log(value);
      this.$set(this.activeData, "type", value);
    },
    onJustifySelected(value) {
      this.$set(this.activeData, "justify", value);
    },
    onThemeSelected(value) {
      this.$set(this.activeData.tagConfig, "effect", value);
    },
    onTagSelected(value) {
      this.$set(this.activeData.tagConfig, "type", value);
    },
    onFileSelected(value) {
      console.log(value);
      this.$set(this.activeData, "accept", value);
    },
    onSwitchValueInput(val, name) {
      if (["true", "false"].indexOf(val) > -1) {
        this.$set(this.activeData, name, JSON.parse(val));
      } else {
        this.$set(this.activeData, name, isNumberStr(val) ? +val : val);
      }
    },
    setTimeValue(val, type) {
      const valueFormat = type === "week" ? dateTimeFormat.date : val;
      this.$set(this.activeData, "defaultValue", null);
      this.$set(this.activeData, "value-format", valueFormat);
      this.$set(this.activeData, "format", val);
    },
    spanChange(val) {
      // this.formConf.span = val;
    },
    multipleChange(val) {
      this.$set(this.activeData, "defaultValue", val ? [] : "");
    },
    dateTypeChange(val) {
      this.$set(this.activeData, "type", val);
      this.setTimeValue(dateTimeFormat[val], val);
    },
    rangeChange(val) {
      this.$set(
        this.activeData,
        "defaultValue",
        val ? [this.activeData.min, this.activeData.max] : this.activeData.min
      );
    },
    rateTextChange(val) {
      if (val) this.activeData["show-score"] = false;
    },
    rateScoreChange(val) {
      if (val) this.activeData["show-text"] = false;
    },
    colorFormatChange(val) {
      this.activeData.defaultValue = null;
      this.activeData["show-alpha"] = val.indexOf("a") > -1;
      this.activeData.renderKey = this.activeData.formId + new Date().getTime(); // 更新renderKey,重新渲染该组件
    },
    openIconsDialog(model) {
      this.iconsVisible = true;
      this.currentIconModel = model;
    },
    setIcon(val) {
      this.activeData[this.currentIconModel] = val;
    },
    tagChange(tagIcon) {
      let target = inputComponents.find(item => item.tagIcon === tagIcon);
      if (!target)
        target = selectComponents.find(item => item.tagIcon === tagIcon);
      this.$emit("tag-change", target);
    }
  }
};
</script>

<style lang="less" scoped>
@import '~@/assets/style/global.less';


.calc-dialog  .el-dialog__body{
  padding-top: 0;
  padding-bottom: 0;
}

.right-board {
  border-left: 1px solid #f1e8e8;
  width: 350px;
  position: absolute;
  right: 0;
  top: 0;
  padding-top: 3px;

  .field-box {
    position: relative;
    height: calc(100vh - 114px);
    box-sizing: border-box;
    .scrollbar();
  }

  .div {
    height: calc(100% - 48px);
  }
}

.select-item {
  display: flex;
  border: 1px dashed #fff;
  box-sizing: border-box;

  & .close-btn {
    cursor: pointer;
    color: #f56c6c;
  }

  & .el-input + .el-input {
    margin-left: 4px;
  }
}

.select-item + .select-item {
  margin-top: 4px;
}

.select-item.sortable-chosen {
  border: 1px dashed #409eff;
}

.select-line-icon {
  line-height: 32px;
  font-size: 22px;
  padding: 0 4px;
  color: #777;
}

.option-drag {
  cursor: move;
}

.time-range {
  .el-date-editor {
    width: 227px;
  }

  ::v-deep .el-icon-time {
    display: none;
  }
}

.document-link {
  position: absolute;
  display: block;
  width: 26px;
  height: 26px;
  top: 0;
  left: 0;
  cursor: pointer;
  background: #409eff;
  z-index: 1;
  border-radius: 0 0 6px 0;
  text-align: center;
  line-height: 26px;
  color: #fff;
  font-size: 18px;
}

.node-label {
  font-size: 14px;
}

.node-icon {
  color: #bebfc3;
}

.calc-btn{
  padding: 4px 8px;
  margin:0 6px;
  background: #e5e5e5;
  cursor: pointer;
  &.error{
    background: #f56c6c;
    color: white;
  }
  &:hover{
    background: #f5f5f5;
  }
}

.pane-calc-preview{
  padding: 0 10px;
  cursor: pointer;min-height: 32px;
  border: 1px solid #e5e5e5;
  border-radius: 4px;
  font-size: 12px;
}
.calc-dialog{
  // >>> .el-dialog__body{
  //   padding-top: 0;
  // }
  .calc-box{
    font-size: 12px;
    line-height: 2;
    .calc-tip{
      margin: 10px 0;
      font-size: 12px;
      color: #aaa;
    }

    .calc-preview{
      border: 1px solid #e5e5e5;
      border-radius: 4px;
      min-height: 60px;
      padding: 4px 10px;
      position: relative;

      &.error{
        border: 1px solid red;
      }
      
      .preview-actions{
        position: absolute;
        bottom: 0;
        right: 0;
        > i {
          font-size: 14px;
          margin-right: 8px;
          cursor: pointer;
          &:hover{
            color: red;
          }
        }
      }
    }
  }
}
</style>
