/**
 *Copyright: Copyright (c) 2020
 *Author:JakHuang
 *Version 1.0 
 *Title: form-generator/Element UI表单设计及代码生成器 
 *GitHub: https://github.com/JakHuang/form-generator
 */
 <template>
  <div>
    <a-modal
      v-bind="$attrs"
      v-on="$listeners"
      :maskClosable="true"
      @cancel="close"
    >
      <a-row :gutter="0">
        <a-form
          :form="form"
          :model="formData"
          :rules="rules"
          :labelCol="{ span: 4 }"
          :wrapperCol="{ span: 18 }"
        >
            <a-form-item
              label="选项名"
              prop="label"
            >
              <a-input
                v-model="formData.title"
                placeholder="请输入选项名"
                clearable
              />
            </a-form-item>
            <a-form-item
              label="选项值"
              prop="value"
            >
              <a-input
                v-model="formData.key"
                placeholder="请输入选项值"
                clearable
              >
                <!-- <a-select
                  v-model="dataType"
                  :style="{width: '100px'}"
                  slot="addonAfter"
                >
                  <a-select-option
                    v-for="(item, index) in dataTypeOptions"
                    :key="item.key"
                    :value="item.value"> 
                    {{item.label}} 
                  </a-select-option>
                </a-select> -->
                
              </a-input>


            </a-form-item>
        </a-form>
      </a-row>
      <div slot="footer">
        <a-button @click="close">
          取消
        </a-button>
        <a-button
          type="primary"
          style="margin-left: 10px;"
          @click="handelConfirm"
        >
          确定
        </a-button>
      </div>
    </a-modal>
  </div>
</template>
<script>
import { isNumberStr } from './utils/index'
import { getTreeNodeId, saveTreeNodeId } from './utils/db'

const id = getTreeNodeId()

export default {
  components: {},
  inheritAttrs: false,
  props: [],
  data() {
    return {
      id,
      formData: {
        key: null,
        title: null
      },
      rules: {
        label: [
          {
            required: true,
            message: '请输入选项名',
            trigger: 'blur'
          }
        ],
        value: [
          {
            required: true,
            message: '请输入选项值',
            trigger: 'blur'
          }
        ]
      },
      dataType: 'string',
      dataTypeOptions: [
        {
          key: 1,
          label: '字符串',
          value: 'string'
        },
        {
          key: 2,
          label: '数字',
          value: 'number'
        }
      ]
    }
  },
  computed: {},
  watch: {
    // eslint-disable-next-line func-names
    // 'formData.value': function (val) {
    //   this.dataType = isNumberStr(val) ? 'number' : 'string'
    // },
    id(val) {
      saveTreeNodeId(val)
    }
  },
  beforeCreate() {
    this.form = this.$form.createForm(this, {
      onValuesChange: (props, values) => {
        console.log("props + values:", `${props} + ${props}`);
      }
    });
  },
  created() {},
  mounted() {},
  methods: {
    onOpen() {
      this.formData = {
        key: null,
        title: null,
      }
    },
    close() {
      this.formData = {
        key: null,
        title: null,
      };
      this.$emit('update:visible', false)
    },
    handelConfirm() {
      
      console.log(this.form);
      this.form.validateFields((errors, values) => {
        console.log("errors:", errors);
        console.log("values:", values);
      });

      this.formData.key = `new${this.id++}`;

      this.$emit('commit', this.formData);

      this.close()

    }
    // handelConfirm() {
    //   this.$refs.elForm.validate(valid => {
    //     if (!valid) {
    //       console.log()
    //       return
    //     }
    //     if (this.dataType === 'number') {
    //       this.formData.value = parseFloat(this.formData.value)
    //     }
    //     this.formData.id = this.id++
    //     this.$emit('commit', this.formData)
    //     this.close()
    //   })
    // }
  }
}
</script>

<style lang="stylus" scoped>
</style>
