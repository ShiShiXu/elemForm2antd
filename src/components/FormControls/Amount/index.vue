<template>
  <div class="fc-amount">
    <el-input-number style="width: 100%;" 
    v-model="innerValue" v-bind="$props" 
    v-on="$listeners" 
    @input="handleInput">
  </el-input-number>
    <div class="explain-text" v-if="showChinese">大写：{{chinese}}</div>
  </div>
</template>
<script>
import {getAmountChinese} from '@/utils'
export default {
  name: 'fc-amount',
  model: {
    prop: 'value',
    event: 'change'
  },
  props: ["value", "cmpType", "tag","tagIcon", "precision", "labelWidth", "step-strictly", "controls", "controls-position", "regList", "changeTag", "proCondition", "showChinese", "formId", "renderKey", "layout"],
  data () {
    return {
      innerValue: this.value
    }
  },
  computed:{
    chinese(){
      return this.showChinese ? getAmountChinese(this.innerValue) : ''
    }
  },
  methods: {
    handleInput (event) {
      console.log("fc-amount handleInput:", event)
      this.$emit('change', event)   
    },
  },
  watch:{
    
    value (val) {
      if (val !== this.innerValue) {
        this.innerValue = val
      }
    }
  }
}
</script>
<style lang="stylus" scoped>
.explain-text {
  font-size: 12px;
  color: #aaa;
  line-height: 20px;
}
</style>