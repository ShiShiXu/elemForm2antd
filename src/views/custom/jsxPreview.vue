<script>
import render from './preview-render.js'
import { GET_MOCK_CONF } from '../../api'
import { trigger } from '@/components/DynamicForm/components/generator/config.js'
/**
 * 校验组织机构组件是否为空
*/
const setFcOrgSelectRule = ( conf, ctx ) => {
  return { 
    validator: (rule, value, callback) => {
      var val = ctx.formModel[rule.field]
      if (Object.keys(val || {}).length === 0) {
        callback()
        return
      }

      var count = 0
      conf.tabList.forEach(key => {
        val && Array.isArray(val[key]) && (count += val[key].length)
      })
      callback(count ? undefined : new Error(`${conf.title}不能为空`))
    }, 
    trigger: trigger[conf.tag],
    type: 'object',
    required: true, 
  }
}
/**
 * 收集表单必填项并组装成ElementUI表单校验得rules选项
 * 表格除外 表格自带校验
 */
function buildRules ( conf, ctx ) {

  if ( conf.vModel === undefined ||  !trigger[conf.tag]) return
  const rules = []
  if ( conf.required ) {

    let type;

    if( conf.tag === 'a-input-number' ) {
      type = Array.isArray( conf.defaultValue ) ? 'array' : "number";
    } else if( conf.tag === 'a-rate') {
      type = Array.isArray( conf.defaultValue ) ? 'array' : "number";
    } else {
      type = Array.isArray( conf.defaultValue ) ? 'array' : "string";
    }

    // type = Array.isArray( conf.defaultValue ) ? 'array' : undefined

    let message = Array.isArray( conf.defaultValue ) ? `请至少选择一个` : conf.placeholder
    if ( message === undefined ) message = `${conf.label}不能为空`
    conf.tag === 'fc-org-select'
      ? rules.push( setFcOrgSelectRule( conf, ctx ) )
      : rules.push( { required: true, type, message, trigger: trigger[conf.tag] } )
  }
  // 自定义正则匹配
  if ( conf.regList && Array.isArray( conf.regList ) ) {
    conf.regList.forEach( item => {
      if ( item.pattern ) {
        rules.push( { pattern: eval( item.pattern ), message: item.message, trigger: trigger[conf.tag] } )
      }
    } )
  }
  ctx.ruleList[conf.vModel] = rules;
}

var setData = (ctx, val, prop, init = false) => {
  if (!prop) return
  ctx.$set(ctx.formModel, prop, val)
}

var _isMounted = false // 收集默认值 渲染完成之后防止重复收集默认值

const buildData = (ctx, value, prop) => setData(ctx, value, prop, true)

const layouts = {
  colFormItem: function (conf,  h, ctx, isList = false,) {
    buildRules(conf, ctx)
    !_isMounted && buildData(ctx, conf.defaultValue, conf.vModel)
    let labelWidth = ''
    if ( conf.labelWidth ) labelWidth = `${conf.labelWidth}px`
    if ( isList ) labelWidth = "0px"
    const required = ( !trigger[conf.tag] && conf.required ) || conf.tag === 'fc-org-select' 
    const handleInput = val => {
      setData(ctx, val, conf.vModel);

      if (conf.tag === 'fc-org-select') {
        /**
         * 组织机构组件数据复杂 
         * async-validator不一定能准确捕获到数据变化 
         * 所以在这里手动校验一次
         */
        ctx.$refs[ctx.confGlobal.formRef].validateField(conf.vModel,()=>{ })
      }
    }

    const handleBlur = val => {
      // console.log("blur event", val);
    }


    let item = <a-col span={conf.span}>
                  <a-form-model-item
                      laba-width={labelWidth} 
                      label={isList ? '' : conf.label}
                      prop={conf.vModel}
                      rules={ctx.ruleList[conf.vModel]}
                    >
                    <render
                      formData={ctx.formModel}
                      conf={conf} 
                      value={ctx.formModel[conf.vModel]} 
                      ref={conf.rowType === 'table' ? conf.vModel : undefined}
                      onInput={handleInput}
                      onChange={handleInput}
                      onBlur={handleBlur}
                    />
                  </a-form-model-item>
                </a-col>
    
    let item2 = <div>test</div>;
                
    item2 = <a-col span={conf.span}>
                  <a-form-model-item
                      laba-width={labelWidth} 
                      label={isList ? '' : conf.label}
                    >
                    <a-input value={654} type="text" />
                  </a-form-model-item>
                </a-col>
        
    if (isList) {
      var tableTitle = <a-col span={24} style="font-size: 14px;padding:6px 0px;margin-bottom: 4px;border-bottom: 1px solid #e5e5e5;">{conf.label}</a-col>
      return [tableTitle, item]
    }
    return item
  },

  rowFormItem: function (conf, h, ctx) {
     if ( conf.rowType === 'table' ) {
       ctx.tableRefs[conf.vModel] = conf
       const param = {...conf, config: conf, formSize: ctx.confGlobal.size, labelWidth: `${conf.labelWidth || ctx.confGlobal.labelWidth}px`}
       return this.colFormItem( param, h, ctx, conf.type === 'list' )
    }
    buildRules(conf, ctx)
    const props = {
      type: conf.type === 'default' ? undefined : conf.type,
      justify: conf.type === 'default' ? undefined : conf.justify,
      align: conf.type === 'default' ? undefined : conf.align,
      gutter: typeof conf.gutter === 'number' ? conf.gutter : undefined,
    }
    let row = <a-col span={conf.span || 24}>
                <a-row {...{ props: props }}>
                  { Array.isArray(conf.children) && conf.children.map( ( el ) => layouts[el.layout]( el, h, ctx ) ) }
                </a-row>
              </a-col>
    let divider
    if (conf.showDivider) {
      let explain
      if (conf.cmpType === 'custom' && conf.explain) {
        explain = <a-tooltip effect="dark" content="组件说明" placement="top">
                    <i class="a-icon-info"
                      onClick={ctx.showExplain.bind(this, conf.explain, conf.label)}
                      style="margin-right: 8px; color: #E6A23C;cursor: pointer;">
                    </i>
                  </a-tooltip>
      }
      divider = <a-col span={24}>
                  <a-divider content-position="left" >{explain} {conf.label}</a-divider>
                </a-col>
      return [divider, row]
    } 
    return row
  },
}

export default {
  data () {
    return {
      tableRefs: {},
      drawerTitle: '',
      drawerText: '',
      drawerVisible: false,
      containerWidth: 66,
      confGlobal: this.$route.params.formData || null,
      formModel: {},
      sendFormModel: {},
      ruleList: {},
    }
  },
  beforeCreate() {
    // this.form = this.$form.createForm(this, {
    //   "field1":[{"required":true,"message":"请输入单行输入框","trigger":"blur"}]
    // });
  },
  mounted(){

    if (!this.confGlobal) {
      this.getConfigByAjax();
    } else {
      this.initDefaultData(this.confGlobal);
    }
    _isMounted = true;
    
    // console.log("this.form:", this.form);

  },
  watch: {
    formModel: {
      handler(formModel) {
        for (const [key, value] of Object.entries(formModel)) {
          // 如果 value 不存在，不用操作，继续下一次循环
          if( !value ) continue;
          if( value !== this.sendFormModel[key].value ){
            this.$set(this.sendFormModel[key], "value", value);
          }
        }
      },
      deep: true
    },
  },
  methods: {
    handleUserType(e) {
      console.log(e);
    },
    buildForm (h) {
      let labelPosition = this.confGlobal.labelPosition || 'left'
      const content = this.confGlobal.fields.map(c => layouts[c.layout](c, h, this))
      const formObject = {
        props: {
          model: this.formModel,
          size: this.confGlobal.size,
          rules: this.ruleList,
          labelWidth: this.confGlobal.labelWidth + 'px',
          labelPosition: this.confGlobal.labelPosition || undefined,
          labelCol:  { span: 4 },
          wrapperCol: { span: 20 },
          labelAlign: this.confGlobal.labelPosition,
          colon: false,
        },
        ref: this.confGlobal.formRef
      }
      const btns = <a-col span="24">
                    <a-row  type="flex" justify="center">
                        <a-button onClick={this.resetForm}>重置</a-button>
                        <a-button style="margin-left: 10px;" type="primary" onClick={this.submitForm}>提交</a-button>
                      </a-row> 
                  </a-col>

            
      // 因为使用jsx时  a-form 的 model 一直无法正确填充，故采用createElement直接渲染
      return h("a-form-model", formObject, [content, btns]);
    },
    submitForm () {
      const isTableValid = this.checkTableData();
      
      this.$refs[this.confGlobal.formRef].validate( isOK => {
        if( !isOK ) return false;
        if( !isTableValid ) return false;

        // console.log('表单数据', this.formModel);
        console.log('表单数据', this.sendFormModel);

        this.$notification.open({
          message: '表单数据',
          description: '请在控制台中查看数据输出',
          placement: 'bottomRight'
        });

      });
      
    },

    resetForm() {
      this.$refs[this.confGlobal.formRef].resetFields();
      this.resetTableData()
    },

    resetTableData(){
      Object.keys(this.tableRefs).forEach(vModel => {
        // 由于render.js返回的动态组件 所以动态组件相当于是render的子组件
        const res = this.$refs[vModel]['$children'][0].reset()
      })
    },

    checkTableData () {
      let valid = true
      Object.keys(this.tableRefs).forEach(vModel => {
        const res = this.$refs[vModel].$children[0].submit()  // 返回false或表单数据
        res ? (this.formModel[vModel] = res) : (valid = false)
      })
      return valid
    },

    showExplain (explainText, title) {
      if(!explainText) return
      this.drawerTitle = title
      this.drawerText = explainText
      this.drawerVisible = true
    },

    buildDrawer (h) {
      var content = <pre style="padding-left: 1rem;">{this.drawerText}</pre>
      return h('a-drawer', {
        props: {
          title: this.drawerTitle + '说明',
          visible: this.drawerVisible,
        },
        on: {
          'update:visible': val => this.drawerVisible = val
        }
      },
      [content])
    },
    initDefaultData(config) {
      config.fields.forEach( item => {
        
        if( item.layout === 'rowFormItem' ) {
          item.children.forEach( item2 => {
            this.$set(this.formModel, item2.vModel, item2.defaultValue);

            this.$set(this.sendFormModel, item2.vModel, {
              label: item2.label,
              value: item2.defaultValue
            });
            
          })
        } else {
          this.$set(this.formModel, item.vModel, item.defaultValue);

          this.$set(this.sendFormModel, item.vModel, {
            label: item.label,
            value: item.defaultValue
          });
        }

      });
    },
    getConfigByAjax() {
      GET_MOCK_CONF().then(res => {
        this.confGlobal = Object.freeze(res.formData);
        this.initDefaultData(res.formData);
      });
    }
  },

  render (h) {
    if (!this.confGlobal) {
      return <div class="loading-mask">數據加載中...</div>
    }
    return  <div class="preview-container" style={'width:' + this.containerWidth + '%;'}>
              <a-row gutter={this.confGlobal.gutter} style="padding: 2rem;">
                {this.buildForm(h)}
              </a-row>
              <div  class="width-slider">
                <a-slider vModel={this.containerWidth} min={30} max={96}></a-slider>
              </div>
              {this.buildDrawer(h)}
            </div>
  }
}
</script>
<style lang="less" scoped>

.loading-mask {
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }

.preview-container {
  margin: 3rem auto 1rem;
  border-radius:  6px;
  box-shadow:  0 0 15px rgba(0, 0, 0, .1);

  .width-slider {
    width: 150px;
    position:  absolute;
    top:  0;
    right:  2rem;
  }

  .showDivider.form-container { 
    margin-bottom: 2rem; 
  }
}

</style>
