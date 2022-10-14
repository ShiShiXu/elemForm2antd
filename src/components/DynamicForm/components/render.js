/**
 *Copyright: Copyright (c) 2020
 *Author:JakHuang
 *Version 1.0 
 *Title: form-generator/Element UI表单设计及代码生成器 
 *GitHub: https://github.com/JakHuang/form-generator
 */

import { makeMap } from '../utils';

// 参考https://github.com/vuejs/vue/blob/v2.6.10/src/platforms/web/server/util.js
const isAttr = makeMap(
  'accept,accept-charset,accesskey,action,align,alt,async,autocomplete,'
  + 'autofocus,autoplay,autosave,bgcolor,border,buffered,challenge,charset,'
  + 'checked,cite,class,code,codebase,color,cols,colspan,content,http-equiv,'
  + 'name,contenteditable,contextmenu,controls,coords,data,datetime,default,'
  + 'defer,dir,dirname,disabled,download,draggable,dropzone,enctype,method,for,'
  + 'form,formaction,headers,height,hidden,high,href,hreflang,http-equiv,'
  + 'icon,id,ismap,itemprop,keytype,kind,label,lang,language,list,loop,low,'
  + 'manifest,max,maxlength,media,method,GET,POST,min,multiple,email,file,'
  + 'muted,name,novalidate,open,optimum,pattern,ping,placeholder,poster,'
  + 'preload,radiogroup,readonly,rel,required,reversed,rows,rowspan,sandbox,'
  + 'scope,scoped,seamless,selected,shape,size,type,text,password,sizes,span,'
  + 'spellcheck,src,srcdoc,srclang,srcset,start,step,style,summary,tabindex,'
  + 'target,title,type,usemap,value,width,wrap'
)

const componentChild = {
  'a-input': {
    prepend ( h, conf, key ) {
      return <template slot="prepend">{conf[key]}</template>
    },
    append ( h, conf, key ) {
      return <template slot="append">{conf[key]}</template>
    }
  },
  'a-select': {
    options ( h, conf, key ) {
      const list = []
      conf.options.forEach( item => {
        list.push( <a-option label={item.label} value={item.value} disabled={item.disabled}></a-option> )
      } )
      return list
    }
  },
  'a-radio-group': {
    options ( h, conf, key ) {
      const list = []
      conf.options.forEach( item => {
        if ( conf.optionType === 'button' ) list.push( <a-radio-button label={item.value}>{item.label}</a-radio-button> )
        else list.push( <a-radio label={item.value} border={conf.border}>{item.label}</a-radio> )
      } )
      return list
    }
  },
  'a-checkbox-group': {
    options ( h, conf, key ) {
      const list = []
      conf.options.forEach( item => {
        if ( conf.optionType === 'button' ) {
          list.push( <a-checkbox-button label={item.value}>{item.label}</a-checkbox-button> )
        } else {
          list.push( <a-checkbox label={item.value} border={conf.border}>{item.label}</a-checkbox> )
        }
      } )
      return list
    }
  },
  'a-upload': {
    'list-type': ( h, conf, key ) => {
      const list = []
      if ( conf['list-type'] === 'picture-card' ) {
        list.push( <i class="a-icon-plus"></i> )
      } else {
        list.push( <a-button size="small" type="primary" icon="a-icon-upload">{conf.buttonText}</a-button> )
      }
      if ( conf.showTip ) {
        list.push( <div slot="tip" class="a-upload__tip">只能上传不超过 {conf.fileSize}{conf.sizeUnit} 的{conf.accept}文件</div> )
      }
      return list
    }
  },
}


function vModel ( self, dataObject, defaultValue ) {
  // console.log("self:", self);
  dataObject.props.value = defaultValue;

  // dataObject.on.input = val => { // elementUI input 绑定
  //   // console.log(val);
  //   self.$emit( 'input', val );
  // }

  let check = (data) =>{
    return Object.prototype.toString.call(data);
  }
  
  // Antd input 绑定
  dataObject.on = {
    input: event => { 
      console.log("render input 1:", event);
  
      if( check(event) === '[object InputEvent]' ) {
        self.$emit( 'input', event.target.value);
      } else {
        self.$emit( 'input', event);
      } 
    },
    change: event => { 
      console.log("render input 2:", event);
  
      if( check(event) === '[object InputEvent]' ) {
        self.$emit( 'input', event.target.value);
      } else {
        self.$emit( 'input', event);
      } 
    },
  }
  
  

}

export default {
  props: ['conf'],
  // h 是一个函数：
  render ( h ) {
    const dataObject = {
      attrs: {},
      props: {},
      on: {},
      style: {}
    }
    // console.log("this.conf:", this.conf);
    const confClone = JSON.parse( JSON.stringify( this.conf ) )
    const children = []

    const childObjs = componentChild[confClone.tag]
    if ( childObjs ) {
      Object.keys( childObjs ).forEach( key => {
        const childFunc = childObjs[key]
        if ( confClone[key] ) {
          children.push( childFunc( h, confClone, key ) )
        }
      } )
    }

    Object.keys( confClone ).forEach( key => {
      const val = confClone[key];
      // console.log("key", key);

      if ( key === 'vModel' ) {
        vModel( this, dataObject, confClone.defaultValue )
      } else if ( dataObject[key] ) {
        dataObject[key] = val
      } else if ( !isAttr( key ) ) {
        dataObject.props[key] = val
      } else {
        dataObject.attrs[key] = val
      }
    } );


    // return h( 
    //   this.conf.tag, // 标签名|组件名|字符串模板
    //   dataObject, // 一个与模板中 attribute 对应的数据对象。可选。
    //   children 
    // )

    console.log("Tag:", this.conf.tag);
    console.log("DataObject:", dataObject);
    console.log("Children:", children);
    
    return h( 
      this.conf.tag, // 标签名|组件名|字符串模板
      dataObject, // 一个与模板中 attribute 对应的数据对象。可选。
      children 
    )
  }
}
