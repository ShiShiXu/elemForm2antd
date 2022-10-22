/**
 *Copyright: Copyright (c) 2020
 *Author:JakHuang
 *Version 1.0 
 *Title: form-generator/Element UI表单设计及代码生成器 
 *GitHub: https://github.com/JakHuang/form-generator
 */
 <script>
import draggable from 'vuedraggable'
import render from './components/render'

function layoutIsNotFound() {
  throw new Error(`没有与${this.element.layout}匹配的layout`)
}

function renderChildren(h, element, index, parent) {
  if (!Array.isArray(element.children)) return null
  return element.children.map((el, i) => {
    const layout = layouts[el.layout]
    if (layout) {
      return layout.call(this, h, el, i, element.children, element)
    }
    return layoutIsNotFound()
  })
}

const components = {
  itemBtns(h, element, index, parent, root) {
    const { copyItem, deleteItem } = this.$listeners
    const visibility ='visibility:' + (root && root.cmpType === 'custom' ? 'hidden;' : 'visible;')
    return  [
      <span class="drawing-item-delete" style={visibility} title="删除" onClick={event => {
        deleteItem(index, parent); event.stopPropagation()
      }}>
        <div>
          <svg-icon style="position: relative;top: -2px;" icon-class="delete" />
        </div>
      </span>
    ]
  }
}

const layouts = {
  colFormItem(h, element, index, parent, root) {
    const { activeItem } = this.$listeners
    let className = this.activeId === element.formId ? 'drawing-item active-from-item' : 'drawing-item'
    if (this.formConf.unFocusedComponentBorder) className += ' unfocus-bordered'
    
    return (
        <a-col span={element.span} class={className} nativeOnClick={event => { (activeItem(element),event.stopPropagation()) }}>
            <a-form-item 
              class={"cst-ant-form-item"} 
              label={element.label} 
              labelCol={{ span: `${element.labelWidth}` }} 
              wrapperCol={{ span: `${24 - element.labelWidth}` }}
              colon={false}
              nativeOnClick={event => { (activeItem(element),event.stopPropagation()) }} required={element.required}>
              <render 
                    key={element.renderKey}
                    conf={element} 
                    onInput={ event => {
                      console.log("Render onInput:", event);
                      this.$set(element, 'defaultValue', event);
                    }}
                    onChange={ (event, dateString) => {
                      console.log("Render onChange:", event);
                      this.$set(element, 'defaultValue', event);
                    }}
                  />
            </a-form-item>
          { components.itemBtns.apply(this, arguments)}
        </a-col>
    )

  },

  rowFormItem(h, element, index, parent) {
    const { activeItem } = this.$listeners
    const { put } = this.$attrs
    const className = this.activeId === element.formId ? 'drawing-row-item active-from-item' : 'drawing-row-item'
   
    let child = renderChildren.apply(this, arguments)
    if (element.type === 'flex') {
      child = <a-row type={element.type} justify={element.justify} align={element.align} >
                {child}
              </a-row>
    }
    const group = {name: 'componentsGroup', put:(...arg) => put(...arg, element)}
    const isCustom = element.cmpType === 'custom'
    return (
      <a-col span={element.span}>
        <a-row class={className} style="margin-left:0;"
          nativeOnClick={event => { (activeItem(element), event.stopPropagation()) }}>
          <span class="component-name" >{element.label}</span>
          <draggable list={element.children} animation={0} group={group} disabled={isCustom} class="drag-wrapper">
            {child}
          </draggable>
          { components.itemBtns.apply(this, arguments)}
          {
            element.rowType === 'table' && 
              <div style="text-align: center;background: white;color: #4e79ff;padding: .4rem 1rem;">
                {element.actionText}
              </div>
          } 
        </a-row>
      </a-col>
    )
  }

}

export default {
  components: {
    render,
    draggable
  },
  props: [
    'element',
    'index',
    'drawingList',
    'activeId',
    'formConf'
  ],
  render(h) {
    const layout = layouts[this.element.layout];

    if (layout) {
      return layout.call(this, h, this.element, this.index, this.drawingList)
    }
    return layoutIsNotFound()
  }
}
</script>
