<template>
<div class="fc-table-box" :class="[config.type]">

    <a-table 
      v-if="['table', 'default'].includes(config.type)"
      :data-source="testFormData"
      :columns="columns"
      bordered
      class="fc-table"
      @cell-click="focusInput" 
      v-bind="config.tableConf || {}"
      :show-summary="config['show-summary']"
      :summary-method="getTableSummaries">

      
      <span slot="customTitle"><a-icon type="smile-o" />是 Name 啊</span>
      <span slot="customTitle"><a-icon type="smile-o" /> Name</span>

      <!-- 序号 -->
      <template slot-scope="scope">
        <div class="row-action">
          <span class="index">
            {{scope.$index + 1}}
          </span>
          <a-popconfirm title="确定删除该行数据吗？" @onConfirm="removeRow(scope.$index)">
            <i slot="reference" class="a-icon-delete delete-btn"></i>
          </a-popconfirm>
        </div>
      </template>

      <!-- 组件列 -->
      <a-table-column
        v-for="(head, cindex) in tableData"
        :rowKey="head.formId"
        :width="head['min-width']"
        :prop="head.vModel"
        v-if="false"
        >
         <template slot="header">
           <span style="color: #f56c6c;" v-if="head.required">*</span>
           {{head['label']}}
         </template>
        <template slot-scope="scope">
             <!-- 单选框组 多选框组 都替换成下拉 并添加options -->
              <template v-if="['a-select', 'a-checkbox-group','a-radio-group'].includes(head.tag)">
                <a-select  
                v-model="tableFormData[scope.$index][cindex].value" placeholder="请选择"
                :multiple="head.tag === 'a-checkbox-group' || getConfById(head.formId).multiple"
                @change="onFormDataChange(scope.$index, cindex, 'a-select')"
                > 
                  <a-option
                    v-for="(opt, oindex) in head.options" 
                    :key="oindex"
                    :label="opt.label"
                    :value="opt.value">
                  </a-option>
                </a-select>
              </template>
              <!-- 上传 -->
              <template v-else-if="head.tag === 'a-upload'">
                <a-upload
                v-bind="getConfById(head.formId)" 
                :on-success="(res) => onUploadSuccess(res, tableFormData[scope.$index][cindex])"
                @mouseleave.native="hideUploadList"
                @mouseenter.native="showUploadList">
                  <span slot="default" >
                    已上传
                    {{tableFormData[scope.$index][cindex].value.length}}
                  </span>
                </a-upload>
              </template>
              <!-- 其他 -->
              <component 
                v-else 
                :is="head.tag" 
                :rowIndex="scope.$index"
                v-model="tableFormData[scope.$index][cindex].value" 
                v-bind="getConfById(head.formId)"
                :formData="formData"
                @change="onFormDataChange(scope.$index, cindex, head.tag)">
              </component>
              <div class="error-tip" v-show="!tableFormData[scope.$index][cindex].valid">
                不能为空
              </div>
        </template>
      </a-table-column>

    </a-table>

    <template v-if="config.type === 'list'">
      <div v-for="(row, rindex) in tableFormData" :key="rindex" class="list-row">
        <a-tooltip content="删除">
          <i class="a-icon-delete delete-btn" @click="removeRow(rindex)"></i>
        </a-tooltip>
        <div v-for="(conf, cindex) in config.children" :key="cindex" class="row-item" :class="{error: !tableFormData[rindex][cindex].valid}">
          <div :style="{width: labelWidth}">
            <span style="color: #f56c6c;" v-if="conf.required">*</span>
            {{conf.label}}
          </div>
            <div :style="{'margin-left': labelWidth}">
              <render
                :formData="formData"
                :conf="Object.assign({rowIndex: rindex},conf)"
                :size="formSize"
                :value="tableFormData[rindex][cindex]"
                :key="conf.renderKey"
                style="max-width: 350px;"
                @input="payload => {
                  $set(tableFormData[rindex][cindex], 'value', payload);
                  onFormDataChange(rindex, cindex, conf.tag);
                }" />
            </div>
            <span class="error-tip" >
              不能为空
            </span>
        </div>
      </div>
    </template>

    <div class="list-summary" v-if="config.type === 'list' && config['show-summary']">
        <div style="padding:6px 12px;float:left;">合计</div>
        <div style="overflow: hidden;padding-top: 6px;;">
          <div v-for="(val, name) in listSummation" :key="name" >
            {{val.label}}：{{val.sum}}
          </div>
        </div>
      </div>
    
    <div class="actions">
      <a-button @click="addRow" type="text">
        <i class="el-icon-plus"></i>
        {{ config.actionText }}
        </a-button>
    </div>
    
</div>
</template>
<script>
import { useableProps } from './config'
import render from './render.js'
// useableProps —— 需要的组件属性 很多属性在表格中没用 需要过滤
export default {
  name: "fc-input-table",
  props:{
    config: {
      type: Object,
      default: ()=> {}
    },
    value: {
      type: Array,
      default: ()=>([])
    },
    formData: Object,
    labelWidth: String,
    formSize: String
  },

  data () {
    return {
      testFormData:  [
        {
          key: '1',
          name: 'John Brown',
          age: 32,
          address: 'New York No. 1 Lake Park',
          tags: ['nice', 'developer'],
        },
        {
          key: '2',
          name: 'Jim Green',
          age: 42,
          address: 'London No. 1 Lake Park',
          tags: ['loser'],
        }
      ],
      columns: [
        {
          dataIndex: 'name',
          key: 'name',
          slots: { title: 'customTitle' },
          scopedSlots: { customRender: 'name' },
        },
        {
          title: 'Age',
          dataIndex: 'age',
          key: 'age',
        },
        {
          title: 'Address',
          dataIndex: 'address',
          key: 'address',
        },
        {
          title: 'Tags',
          key: 'tags',
          dataIndex: 'tags',
          scopedSlots: { customRender: 'tags' },
        },
        {
          title: 'Action',
          key: 'action',
          scopedSlots: { customRender: 'action' },
        },
      ],

      tableFormData:[],
      tableData: [],
      listSummation: {},
      isAddRow: true // list类型下 添加行数据 number类型组件会进行校验 产生不需要的结果 在这里进行添加行数据判断 hack
    };
  },

  created () {
    this.tableData = this.config.type === 'table' ? this.filterProps() : this.config.children;

    if (this.value && this.value.length) {
      this.value.forEach(t => this.addRow(t))
    }else{
      this.addRow()
    }
  },
  methods:{
    clearAddRowFlag () {
      this.$nextTick(() => {
        this.isAddRow = false
      })
    },
    /**
     * @event cell-click Table 单元格点击事件
     * 点击单元格 聚焦单元格中的input
     */
    focusInput (row, column, cell, event) {
      const child = cell.querySelector('.cell').firstElementChild
      const input = child && child.querySelector('input')
      input && input.focus()
    },
    /**
     * 过滤不需要的组件配置， 表格中的组件需要统一样式
     */
    filterProps () {
      const conf = this.config.children;

      if (!conf) return []
      const getUseableProp = item => useableProps.find(t => t.tag === item.tag)

      return conf.map( item => {

        const useable = getUseableProp(item);

        const res = useable ? useable.props.reduce((r, key) => (r[key] = item[key], r), {}) : item;
        return useable.forceProp ? Object.assign({}, res, useable.forceProp) : res
      })
    },
    
    onFormDataChange (rowIndex, colIndex, tag) {
      if (this.isAddRow) return
      const data = this.tableFormData[rowIndex][colIndex]
      data.required && (data.valid = this.checkData(data))
      if (['fc-amount', 'a-input-number'].includes(tag)) { // 金额变动 更新数据 触发计算公式更新
        const newVal = this.tableFormData.map(row => row.reduce((p, c) => (p[c.vModel] = c.value, p), {}))
        this.$emit('input', newVal)
        if (this.config.type === 'list') {
          this.getListSummaries()
        }
      }
    },
    /**
     * 校验单个表单数据
     * @param {CmpConfig} 组件配置对象
     */
    checkData ({ tag, value}) {
      if([null, undefined, ''].includes(value)) return false
      if(tag === 'fc-org-select') return this.checkOrgData(value)
      if(Array.isArray(value)) return value.length > 0
      return true
    },
    /**
     * 对组织机构部门控数据单独校验
     */
    checkOrgData (data) {
      const isArray = Array.isArray
      if(typeof data !== 'object' || isArray(data)) return false
      let count = 0
      for(let key in data){
        count += isArray(data[key]) ? data[key].length : 0
      }
      return count > 0
    },
    /**
     * 校验表格数据必填项
     */
    submit () {
      let res = true
      const checkCol = col => col.required && !this.checkData(col) && (res = col.valid = false) 
      this.tableFormData.forEach(row => row.forEach(checkCol))
      return res ? this.tableFormData.map(row => row.reduce((p, c) => (p[c.vModel] = c.value, p), {})) : false
    },
    /**
     * 根据formid获取完整组件配置
     */
    getConfById (formId) {
      return this.tableData.find(t => t.formId === formId)
    },
    /**
     * 获取默认行数据
     */
    getEmptyRow (val) {
      return this.tableData.map((t) => {
        let res = {
          tag: t.tag,
          formId: t.formId,
          value: val && val[t.vModel] || t.defaultValue,
          options: t.options, // 下拉 单选 多选
          valid: true,
          vModel: t.vModel,
          required: t.required
        }
        if(t.tag === 'a-upload') this.$set(res, 'value', t.defaultValue)
        return res
      })
    },

    removeRow (index) {
      this.tableFormData.splice(index, 1)
    },
 
    addRow (val) {
      this.isAddRow = true
      if (!Array.isArray(this.tableFormData)) {
        this.tableFormData = []
      }
      this.tableFormData.push(this.getEmptyRow(val))
      this.clearAddRowFlag()
    },

    getCmpValOfRow (row, key) {
      // 获取数字相关组件的输入值
      const isNumCmp = tag => ['fc-amount','a-input-number', 'a-slider'].includes(tag)
      const target =  row.find(t => t.vModel === key)
      if (!target) return NaN
      if(isNumCmp(target.tag)) return target.value || 0
      return NaN
    },

    getListSummaries () {
      this.tableData.forEach(row => {
        const isNumCmp = tag => ['fc-amount','a-input-number', 'a-slider'].includes(tag)
        if (!isNumCmp(row.tag)) return
        const sum = this.tableFormData
            .reduce((sum, d) => sum + this.getCmpValOfRow(d, row.vModel), 0)
        this.$set(this.listSummation, row.vModel, {
          label: row.label,
          sum
        })
      })
    },
    /**
     * 对表格进行合计 目前只支持数字，金额，滑块
     */
    getTableSummaries (param) {
      const { columns, data } = param;
      const sums = [];
      if(this.tableData.length + 1 !== columns.length) return []  // 防止多次加载
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        const sumVal = data.reduce((sum, d) => sum + this.getCmpValOfRow(d, column.property), 0)
        sums[index] = Number.isNaN(sumVal) ? '' : sumVal
      });
      return sums;
    },

    

    onUploadSuccess(response, target) {
      !Array.isArray(target.value) && (target.value = [])
      target.value.push(response)
    },

    showUploadList (ev) {
      const btn = ev.currentTarget
      const { offsetX, clientX, clientY, offsetY } = ev
      const list = btn.querySelector('.a-upload-list--text')
      list && list.classList.add('show')
      const unit = v => v + 'px'
      list.style.left = unit(clientX - offsetX)
      list.style.top = unit(clientY - offsetY + btn.clientHeight)
    },

    hideUploadList (ev) {
      const btn = ev.currentTarget
      const list = btn.querySelector('.a-upload-list--text')
      list && setTimeout(() => list.classList.remove('show'), 500)
    },

    reset () {
      this.tableData.map((t) => {
        let index = this.tableFormData[0].findIndex(c => c.vModel === t.vModel)
        if (index === -1) return
        for (let i = 0; i < this.tableFormData.length; i++) {
          this.tableFormData[i][index].value = t.defaultValue
        }
      })
    }
  },

  components:{
    render
  }
};
</script>
<style lang="less" scoped>
// Color variables (appears count calculates by raw css)
@color0: #ffffff; // Appears 4 times
@color1: #f56c6c; // Appears 3 times
@color2: #e5e5e5; // Appears 2 times
@color3: #ff0000; // Appears 2 times

// Width variables (appears count calculates by raw css)
@width1: 100%; // Appears 5 times
@width2: 10px; // Appears 2 times

// Height variables (appears count calculates by raw css)
@height1: 40px; // Appears 2 times
@height2: 10px; // Appears 2 times

.fc-table-box {
	margin-bottom: 0px;
	.row-action {
		align-items: center;
		display: flex;
		justify-content: center;
		.a-icon-delete {
			cursor: pointer;
			opacity: 0;
			position: absolute;
			transform: translate(-50%, -50%);
			z-index: -1;
		}
	}
	.actions {
		border-top: none;
		border: 1px solid #ebeef5;
		text-align: center;
	}
	.list-summary {
		border-top: none;
		border: 1px solid @color2;
		line-height: 24px;
		overflow: hidden;
	}
}
.fc-table-box.list {
	.list-row {
		border-bottom: 1px solid @color2;
		padding: 18px 0 10px;
		position: relative;
		text-align: left;
		&:hover {
			.delete-btn {
				display: block;
			}
		}
		.delete-btn {
			cursor: pointer;
			display: none;
			position: absolute;
			right: 10px;
			top: 20px;
			z-index: 999;
			&:hover {
				color: #000000;
			}
		}
		.row-item {
			margin-bottom: 18px;
			position: relative;
		}
		.row-item.error {
			.error-tip {
				top: 74%;
				z-index: 1;
			}
		}
		.row-item.error {
      .a-input__inner {
			border-color: @color1;
		}
    }
		.row-item>div {
			&:first-child {
				box-sizing: border-box;
				color: #606266;
				float: left;
				font-size: 14px;
				line-height: 32px;
				padding: 0 12px 0 0;
				text-align: right;
				vertical-align: middle;
			}
		}
	}
	.error-tip {
		color: @color1;
		font-size: 12px;
		left: 100px;
		min-height: auto;
		padding-left: 6px;
		position: absolute;
		top: 0;
		transition: bottom 0.3s;
		z-index: -1;
	}
}
.fc-table-box.table {
  .a-table__row {
    &:hover {
      .index {
        display: none;
      }
      .a-icon-delete {
        opacity: 1;
        z-index: 9;
      }
    }
  }
}
.fc-table-box.table {
  .a-input__inner {
    border: none;
    padding-left: 10px;
    padding-right: 10px;
    text-align: left;
    width: @width1;
  }
}
.fc-table-box.table {
  .a-textarea__inner {
    border: none;
    padding-left: 10px;
    padding-right: 10px;
    text-align: left;
    width: @width1;
  }
}
.fc-table-box.table {
  .a-date-editor {
	.a-input__prefix {
		left: -10px;
		top: 1px;
	}
	.a-input__suffix {
		right: 0;
		top: 1px;
	}
}
}
.fc-table-box.table {
  .a-input-number {
	width: @width1;
}
}
.fc-table-box.table {
  .a-upload--text {
	height: 100%;
	padding-top: 6px;
	white-space: nowrap;
	width: @width1;
}
}
.fc-table-box.table {
  .input-box {
	border: none !important;
	min-height: @height1 !important;
	padding-left: 0 !important;
}
}
.fc-table-box.table {
  .a-table {
	.a-table__body {
		td {
			background: @color0 !important;
			padding: 0;
			.error-tip {
				color: @color1;
				font-size: 12px;
				padding-left: 6px;
			}
			.cell {
				position: relative;
			}
			.cell>div {
				min-height: @height1;
				width: @width1;
			}
			&:not(:first-child) {
        vertical-align: top;
          &::after {
            background: @color0;
            border-right: none;
            border-top: none;
            border: 2px solid transparent;
            bottom: 0;
            content: "";
            height: @height2;
            left: 0;
            position: absolute;
            transition: border-color 0.3s;
            width: @width2;
          }
          &::before {
            background: @color0;
            border-bottom: none;
            border-left: none;
            border: 2px solid transparent;
            content: "";
            height: @height2;
            position: absolute;
            right: 0;
            top: 0;
            transition: border-color 0.3s;
            width: @width2;
          }
      }
      &:hover {
        &::after {
          border-color: @color3;
        }
        &::before {
          border-color: @color3;
        }
      }
    }
  }
}
}
.fc-table-box.table {
  .fc-org-select {
    position: relative;
  }
}
.fc-table-box.table {
  .a-slider {
    padding-left: 10px;
  }
}
.fc-table-box.table {
  .a-upload-list--text {
    background: @color0;
    box-shadow: 2px 2px 8px 2px rgba(0,0,0,0.1);
    display: none;
    margin-left: -6px;
    max-width: 250px;
    position: fixed;
    transition: margin-top 0.3s;
    z-index: 9;
  }
}
.fc-table-box.table {
  .a-upload-list--text.show {
    display: block;
  }
}
</style>
