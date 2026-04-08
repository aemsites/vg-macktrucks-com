"use strict";(self["webpackChunkmacktrucks"]=self["webpackChunkmacktrucks"]||[]).push([[325],{6487(__unused_webpack___webpack_module__,__webpack_exports__,__webpack_require__){__webpack_require__.d(__webpack_exports__,{E:()=>customElement});const customElement=tagName=>(target,context)=>{const initializer=()=>{const existingElement=customElements.get(tagName);if(!existingElement){customElements.define(tagName,target);return}const existingVersion=existingElement.version;const currentVersion=target.version;if(existingVersion&&currentVersion&&existingVersion!==currentVersion){console.warn(`vcdk warning: Attempted to register <${tagName}>v, but <${tagName}>v. was already registered. This could indicate that your application might contain duplicate instances of the same component.`)}};if(context){context.addInitializer(initializer)}else{initializer()}}},4135(__unused_webpack___webpack_module__,__webpack_exports__,__webpack_require__){__webpack_require__.d(__webpack_exports__,{F:()=>Responsive});var _volvo_vcdk_tokens_dist_web_global_breakpoints_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(8128);var lit__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__(2618);var lodash_es__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__(2326);var _web_components_vcdk_element_index_js__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__(7571);const breakpointKeys=Object.keys(_volvo_vcdk_tokens_dist_web_global_breakpoints_js__WEBPACK_IMPORTED_MODULE_0__.f);const Responsive=superClass=>{class ResponsiveClass extends superClass{static fallbackVariableValue(prefix,prop,fallbacks){if(!fallbacks.length){return""}const current=fallbacks.shift();if(fallbacks.length){return`var(--${prefix}-${prop}-${current}, ${this.fallbackVariableValue(prefix,prop,fallbacks)})`}return`var(--${prefix}-${prop}-${current})`}static responsiveVariables(prefix,props,breakpoint,fallbacks){return props.map(prop=>{const name=(0,lodash_es__WEBPACK_IMPORTED_MODULE_2__.A)(prop);if(fallbacks){return`\n    --${prefix}-${name}-fallback: ${this.fallbackVariableValue(prefix,name,[...fallbacks])};\n    --${prefix}-${name}: var(--${prefix}-${name}-${breakpoint}, var(--${prefix}-${name}-fallback));`}return`\n    --${prefix}-${name}: var(--${prefix}-${name}-${breakpoint});`}).join("")}static responsiveStyles(settings){return(0,lit__WEBPACK_IMPORTED_MODULE_1__.AH)`
        :host {
          ${(0,lit__WEBPACK_IMPORTED_MODULE_1__.iz)(this.responsiveVariables(settings.prefix,settings.props,"xs"))}
        }
        @media(min-width: ${_volvo_vcdk_tokens_dist_web_global_breakpoints_js__WEBPACK_IMPORTED_MODULE_0__.f.sm.from}px) {
          :host {
            ${(0,lit__WEBPACK_IMPORTED_MODULE_1__.iz)(this.responsiveVariables(settings.prefix,settings.props,"sm",["xs"]))}
          }
        }
        @media (min-width: ${_volvo_vcdk_tokens_dist_web_global_breakpoints_js__WEBPACK_IMPORTED_MODULE_0__.f.md.from}px) {
          :host {
            ${(0,lit__WEBPACK_IMPORTED_MODULE_1__.iz)(this.responsiveVariables(settings.prefix,settings.props,"md",["sm","xs"]))}
          }
        }
        @media (min-width: ${_volvo_vcdk_tokens_dist_web_global_breakpoints_js__WEBPACK_IMPORTED_MODULE_0__.f.lg.from}px) {
          :host {
            ${(0,lit__WEBPACK_IMPORTED_MODULE_1__.iz)(this.responsiveVariables(settings.prefix,settings.props,"lg",["md","sm","xs"]))}
          }
        }
        @media (min-width: ${_volvo_vcdk_tokens_dist_web_global_breakpoints_js__WEBPACK_IMPORTED_MODULE_0__.f.xl.from}px) {
          :host {
            ${(0,lit__WEBPACK_IMPORTED_MODULE_1__.iz)(this.responsiveVariables(settings.prefix,settings.props,"xl",["lg","md","sm","xs"]))}
          }
        }
      }`}static finalizeStyles(styles){if(!this.responsiveProperties){return _web_components_vcdk_element_index_js__WEBPACK_IMPORTED_MODULE_3__.l.finalizeStyles(styles)}const alteredStyles=[this.responsiveStyles(this.responsiveProperties)];if(styles&&Array.isArray(styles)){alteredStyles.push(...styles)}else if(styles){alteredStyles.push(styles)}return _web_components_vcdk_element_index_js__WEBPACK_IMPORTED_MODULE_3__.l.finalizeStyles(alteredStyles)}connectedCallback(){super.connectedCallback();this.setResponsiveVariables()}update(changedProperties){const responsiveProperties=this.constructor.responsiveProperties;const props=responsiveProperties?.props;if(responsiveProperties&&props.some(prop=>changedProperties.has(prop))){this.setResponsiveVariables()}super.update(changedProperties)}setResponsiveVariables(){const responsiveProperties=this.constructor.responsiveProperties;if(typeof responsiveProperties==="undefined")return;const props=responsiveProperties.props;for(const prop of props){let value=this[prop];if(!value)continue;if(!Array.isArray(value)){value=[value]}for(let i=0;i<value.length;i++){const propName=String(prop);let breakpointValue=value[i];if(responsiveProperties.styleTransform){breakpointValue=responsiveProperties.styleTransform(propName,breakpointKeys[i],breakpointValue)}if(typeof breakpointValue==="undefined"){continue}if(typeof breakpointValue==="number"){breakpointValue=`${breakpointValue}px`}const breakpoint=breakpointKeys[i];this.style.setProperty(`--${responsiveProperties.prefix}-${(0,lodash_es__WEBPACK_IMPORTED_MODULE_2__.A)(propName)}-${breakpoint}`,breakpointValue)}}}}return ResponsiveClass}},7909(__unused_webpack___webpack_module__,__unused_webpack___webpack_exports__,__webpack_require__){var system_icon=__webpack_require__(2932);var typography_styles=__webpack_require__(1669);var lit=__webpack_require__(2618);var decorators=__webpack_require__(9194);var when=__webpack_require__(302);var custom_element=__webpack_require__(6487);var vcdk_element=__webpack_require__(7571);const accordionStyles=(0,lit.AH)`
  :host {
    --vcdk-accordion-summary-padding-inline: var(--vcdk-spacing-6);
  }

  details {
    color: var(--vcdk-color-text-subtle);
    width: 100%;
    max-width: 100%;
    border-bottom: 1px solid var(--vcdk-color-border-subtle);
    display: block;
    background-color: var(--vcdk-color-bg);
  }

  summary {
    display: flex;
    width: 100%;
    gap: var(--vcdk-spacing-5);
    padding-block: var(--vcdk-spacing-7);
    padding-inline: var(--vcdk-accordion-summary-padding-inline);
    align-items: center;
    border-radius: var(--vcdk-radius-default);
    cursor: pointer;
    user-select: none;
  }

  summary:focus-visible {
    outline-width: 3px;
  }

  summary:hover {
    background-color: var(--vcdk-color-bg-hover);
    border-radius: 0;
  }

  summary:active {
    background-color: var(--vcdk-color-bg-pressed);
    border-radius: 0;
  }

  summary::-webkit-details-marker {
    display: none;
  }

  .title {
    display: flex;
    flex-grow: 1;
  }

  vcdk-system-icon::part(svg) {
    color: var(--vcdk-color-text);
  }

  .chevron {
    transition: transform 240ms;
    color: var(--vcdk-color-text);
    transition-timing-function: cubic-bezier(0.45, 0, 0.125, 1);
    margin-inline-end: var(--vcdk-spacing-3);
  }

  [open] .chevron {
    transform: rotate(-180deg);
  }

  .content {
    display: block;
    padding-inline: var(--vcdk-spacing-6);
    padding-block: var(--vcdk-spacing-4) var(--vcdk-spacing-8);
    color: var(--vcdk-color-text-subtle);
    text-align: start;
  }
`;var __decorate=undefined&&undefined.__decorate||function(decorators,target,key,desc){var c=arguments.length,r=c<3?target:desc===null?desc=Object.getOwnPropertyDescriptor(target,key):desc,d;if(typeof Reflect==="object"&&typeof Reflect.decorate==="function")r=Reflect.decorate(decorators,target,key,desc);else for(var i=decorators.length-1;i>=0;i--)if(d=decorators[i])r=(c<3?d(r):c>3?d(target,key,r):d(target,key))||r;return c>3&&r&&Object.defineProperty(target,key,r),r};class AccordionToggleEvent extends CustomEvent{constructor(type,detail){super(type,{detail,bubbles:true,composed:true,cancelable:true})}}let Accordion=class Accordion extends vcdk_element.l{constructor(){super(...arguments);this.headerTitle="";this.open=false;this.onToggleClick=e=>{e.preventDefault();const newState=!this.open;const deprecatedEvent=new AccordionToggleEvent("toggle",{open:newState});this.dispatchEvent(deprecatedEvent);const event=new AccordionToggleEvent("vcdk-toggle",{open:newState});this.dispatchEvent(event);const defaultPrevented=deprecatedEvent.defaultPrevented||event.defaultPrevented;if(!defaultPrevented){this.open=newState}}}render(){const{headerTitle,headerIcon}=this;return(0,lit.qy)`
      <details ?open=${this.open} part="details">
        <summary
          id="accordionID"
          part="summary"
          @click=${this.onToggleClick}
          aria-controls="accordionSectionID"
          aria-expanded=${this.open?"true":"false"}>
          <slot name="summary-start">
            ${(0,when.z)(headerIcon,()=>(0,lit.qy)`
                <vcdk-system-icon
                  size=${24}
                  icon=${headerIcon}></vcdk-system-icon>
              `)}
          </slot>
          <slot name="title" class="title typography-subtitle1">
            ${headerTitle}
          </slot>
          <slot name="summary-end"></slot>
          <vcdk-system-icon
            class="chevron"
            size=${24}
            icon=${"chevron-down"}></vcdk-system-icon>
        </summary>
        <slot
          part="content"
          class="content"
          role="region"
          id="accordionSectionID"
          aria-labelledby="accordionID"></slot>
      </details>
    `}};Accordion.styles=[typography_styles.IT.subtitle1,accordionStyles];__decorate([(0,decorators.MZ)({type:String})],Accordion.prototype,"headerTitle",void 0);__decorate([(0,decorators.MZ)({type:String})],Accordion.prototype,"headerIcon",void 0);__decorate([(0,decorators.MZ)({type:Boolean,reflect:true})],Accordion.prototype,"open",void 0);Accordion=__decorate([(0,custom_element.E)("vcdk-accordion")],Accordion)},5865(__unused_webpack___webpack_module__,__unused_webpack___webpack_exports__,__webpack_require__){var responsive_value=__webpack_require__(6591);var lit=__webpack_require__(2618);var decorators=__webpack_require__(9194);var class_map=__webpack_require__(3720);var style_map=__webpack_require__(1145);var custom_element=__webpack_require__(6487);var responsive=__webpack_require__(4135);var vcdk_element=__webpack_require__(7571);const spinnerStyles=(0,lit.AH)`
  @keyframes spinner-keyframes {
    0% {
      transform: rotate(-90deg);
    }
    100% {
      transform: rotate(270deg);
    }
  }

  svg {
    max-height: 100%;
    max-width: 100%;
    width: var(--vcdk-spinner-size, 38px);
    height: var(--vcdk-spinner-size, 38px);
    stroke-dasharray: calc(
        var(--vcdk-spinner-progress) * calc(2 * 3.14159265359 * 45) / 100
      )
      calc(2 * 3.14159265359 * 45);
    transform-origin: center center;
    stroke-dashoffset: 0;
    transform: rotate(-90deg);
    stroke-width: 3px;
    stroke-linecap: round;
    stroke: var(--vcdk-spinner-stroke, var(--vcdk-color-bg-selected));
  }

  .indefinite {
    stroke-dasharray: 50;
    animation: 700ms cubic-bezier(0.62, 0.63, 0, 0.53) infinite
      spinner-keyframes;
  }

  circle {
    stroke-dashoffset: 0;
  }
`;var __decorate=undefined&&undefined.__decorate||function(decorators,target,key,desc){var c=arguments.length,r=c<3?target:desc===null?desc=Object.getOwnPropertyDescriptor(target,key):desc,d;if(typeof Reflect==="object"&&typeof Reflect.decorate==="function")r=Reflect.decorate(decorators,target,key,desc);else for(var i=decorators.length-1;i>=0;i--)if(d=decorators[i])r=(c<3?d(r):c>3?d(target,key,r):d(target,key))||r;return c>3&&r&&Object.defineProperty(target,key,r),r};let Spinner=class Spinner extends((0,responsive.F)(vcdk_element.l)){render(){return(0,lit.JW)`
    <svg
      class=${(0,class_map.H)({indefinite:typeof this.progress==="undefined"})}
      part="svg"
      viewBox="20 20 40 40"
      role="progressbar"
      aria-busy="true"
      aria-live="polite"
      aria-label="${this.elementAriaLabel}"
      style=${(0,style_map.W)({"--vcdk-spinner-progress":typeof this.progress==="number"?this.progress+"%":undefined})}>
        <circle
          cx="40"
          cy="40"
          r="18"
          fill="none" />     
    </svg>
    `}};Spinner.styles=[spinnerStyles];Spinner.responsiveProperties={prefix:"vcdk-spinner",props:["size"],styleTransform:(name,_,value)=>{if(name==="size"&&typeof value==="string"){switch(value){case"small":return 18;case"large":return 80;default:return 38}}return value}};__decorate([(0,decorators.MZ)({type:Number})],Spinner.prototype,"progress",void 0);__decorate([(0,decorators.MZ)({converter:responsive_value.g})],Spinner.prototype,"size",void 0);__decorate([(0,decorators.MZ)({type:String,attribute:"element-aria-label"})],Spinner.prototype,"elementAriaLabel",void 0);Spinner=__decorate([(0,custom_element.E)("vcdk-spinner")],Spinner);var system_icon=__webpack_require__(2932);var typography_styles=__webpack_require__(1669);var when=__webpack_require__(302);const ifDefinedOrStringEmpty=value=>{if(typeof value==="number"){return value}return value?value:lit.s6};const buttonStyles=(0,lit.AH)`
  .button {
    align-items: center;
    appearance: none;
    border-radius: var(--vcdk-radius-default);
    cursor: pointer;
    display: inline-flex;
    justify-content: center;
    max-width: 100%;
    position: relative;
    text-align: center;
    text-decoration: none;
    user-select: none;
    white-space: nowrap;
    border-style: solid;
    --vcdk-button-border-width: 0px;
    border-width: var(--vcdk-button-border-width);

    &:focus-visible {
      outline-width: 3px;
      outline-offset: 2px;
    }

    /* SIZES */
    &.fullWidth {
      width: 100%;
    }

    /* Primary */
    &.variant-primary {
      background-color: var(--vcdk-color-bg-button-primary);
      color: var(--vcdk-color-text-on-button-primary);
      vcdk-system-icon::part(svg) {
        color: var(--vcdk-color-icon-on-button-primary);
      }
      &:not([aria-disabled], .loading):hover {
        background-color: var(--vcdk-color-bg-button-primary-hover);
      }
      &:not([aria-disabled], .loading):active {
        background-color: var(--vcdk-color-bg-button-primary-pressed);
      }
      &.loading,
      &[aria-disabled="true"] {
        background-color: var(--vcdk-color-bg-disabled);
      }
    }

    /* Secondary */
    &.variant-secondary {
      --vcdk-button-border-width: 1px;
      background-color: var(--vcdk-color-bg-button-secondary);
      border-color: var(--vcdk-color-border-button-secondary);
      color: var(--vcdk-color-text-on-button-secondary);
      vcdk-system-icon::part(svg) {
        color: var(--vcdk-color-icon-on-button-secondary);
      }
      &.loading,
      &[aria-disabled="true"] {
        border-color: var(--vcdk-color-border-button-secondary-disabled);
      }
      &:not([aria-disabled], .loading):hover {
        background-color: var(--vcdk-color-bg-button-secondary-hover);
      }
      &:not([aria-disabled], .loading):active {
        background-color: var(--vcdk-color-bg-button-secondary-pressed);
      }
    }

    /* Marketing */
    &.variant-marketing {
      background-color: var(--vcdk-color-bg-button-marketing);
      color: var(--vcdk-color-text-on-button-marketing);
      vcdk-system-icon::part(svg) {
        color: var(--vcdk-color-icon-on-button-marketing);
      }
      &.loading,
      &[aria-disabled="true"] {
        background-color: var(--vcdk-color-bg-disabled);
      }
      &:not([aria-disabled], .loading):hover {
        background-color: var(--vcdk-color-bg-button-marketing-hover);
      }
      &:not([aria-disabled], .loading):active {
        background-color: var(--vcdk-color-bg-button-marketing-pressed);
      }
    }

    /* Tertiary */
    &.variant-tertiary {
      background-color: var(--vcdk-color-bg-button-tertiary);
      color: var(--vcdk-color-text-on-button-tertiary);
      vcdk-system-icon::part(svg) {
        color: var(--vcdk-color-icon-on-button-tertiary);
      }
      &:not([aria-disabled], .loading):hover {
        background-color: var(--vcdk-color-bg-button-tertiary-hover);
      }
      &:not([aria-disabled], .loading):active {
        background-color: var(--vcdk-color-bg-button-tertiary-pressed);
      }
    }

    &.size-small {
      padding-block: calc(6px - var(--vcdk-button-border-width));
      padding-inline: 8px;
    }
    &.size-medium {
      padding-block: calc(8px - var(--vcdk-button-border-width));
      padding-inline: 12px;
      .text {
        padding-block: 2px;
      }
    }
    &.size-large {
      padding-block: calc(12px - var(--vcdk-button-border-width));
      padding-inline: 16px;
      .text {
        padding-block: 2px;
      }
    }

    &.loading,
    &[aria-disabled="true"] {
      cursor: not-allowed;
      color: var(--vcdk-color-text-disabled);
      & vcdk-system-icon::part(svg) {
        color: var(--vcdk-color-icon-disabled);
      }
    }
  }

  /* TEXT */
  .text {
    pointer-events: none;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-inline: 8px;
  }
  .loading .text {
    visibility: hidden;
  }

  /* SPINNER */
  .spinner {
    height: 24px;
    width: 24px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
    pointer-events: none;
  }

  /* ICON */
  .icon {
    flex-shrink: 0;
    pointer-events: none;
  }

  .loading .icon {
    opacity: 0;
  }
`;var button_component_decorate=undefined&&undefined.__decorate||function(decorators,target,key,desc){var c=arguments.length,r=c<3?target:desc===null?desc=Object.getOwnPropertyDescriptor(target,key):desc,d;if(typeof Reflect==="object"&&typeof Reflect.decorate==="function")r=Reflect.decorate(decorators,target,key,desc);else for(var i=decorators.length-1;i>=0;i--)if(d=decorators[i])r=(c<3?d(r):c>3?d(target,key,r):d(target,key))||r;return c>3&&r&&Object.defineProperty(target,key,r),r};let Button=class Button extends vcdk_element.l{constructor(){super(...arguments);this.ariaLabel="";this.autofocus=false;this.size="medium";this.variant="marketing";this.clickHandler=e=>{if(this.href)return;if(this.disabled){e.preventDefault();e.stopPropagation();return}if(this.type==="submit"&&!e.defaultPrevented){this.closest("form")?.requestSubmit()}}}render(){const{href,variant="primary",size,loading,iconStart,iconEnd,disabled,fullWidth,ariaLabel,title,type}=this;const buttonClasses={button:true,[`variant-${variant}`]:true,[`size-${size}`]:true,fullWidth:fullWidth?true:false,loading:loading?true:false};const textClasses={text:true,["typography-button"]:true};const template=(0,lit.qy)`
      ${(0,when.z)(iconStart,()=>(0,lit.qy)`
          <vcdk-system-icon
            .size=${24}
            .icon=${iconStart}
            class="icon"></vcdk-system-icon>
        `)}
      <div class=${(0,class_map.H)(textClasses)}>
        <slot></slot>
      </div>
      ${(0,when.z)(iconEnd,()=>(0,lit.qy)`
          <vcdk-system-icon
            .size=${24}
            .icon=${iconEnd}
            class="icon"></vcdk-system-icon>
        `)}
      ${(0,when.z)(loading,()=>(0,lit.qy)`
          <vcdk-spinner class="spinner"></vcdk-spinner>
        `)}
    `;if(href)return(0,lit.qy)`
        <a
          part="button"
          class=${(0,class_map.H)(buttonClasses)}
          title=${ifDefinedOrStringEmpty(title)}
          aria-label=${ifDefinedOrStringEmpty(ariaLabel)}
          aria-disabled=${disabled?"true":lit.s6}
          href=${href}
          download=${ifDefinedOrStringEmpty(this.download)}
          hreflang=${ifDefinedOrStringEmpty(this.hreflang)}
          ping=${ifDefinedOrStringEmpty(this.ping)}
          referrerpolicy=${ifDefinedOrStringEmpty(this.referrerpolicy)}
          rel=${ifDefinedOrStringEmpty(this.rel)}
          target=${ifDefinedOrStringEmpty(this.target)}
          type=${ifDefinedOrStringEmpty(type)}>
          ${template}
        </a>
      `;return(0,lit.qy)`
      <button
        part="button"
        title=${ifDefinedOrStringEmpty(title)}
        aria-label=${ifDefinedOrStringEmpty(ariaLabel)}
        aria-disabled=${disabled?"true":lit.s6}
        @click=${this.clickHandler}
        ?autofocus=${this.autofocus}
        formaction=${ifDefinedOrStringEmpty(this.formaction)}
        formenctype=${ifDefinedOrStringEmpty(this.formenctype)}
        formmethod=${ifDefinedOrStringEmpty(this.formmethod)}
        ?formnovalidate=${this.formnovalidate}
        formtarget=${ifDefinedOrStringEmpty(this.formtarget)}
        name=${ifDefinedOrStringEmpty(this.name)}
        type=${type??"button"}
        value=${ifDefinedOrStringEmpty(this.value)}
        class=${(0,class_map.H)(buttonClasses)}>
        ${template}
      </button>
    `}};Button.styles=[typography_styles.IT.button,buttonStyles];button_component_decorate([(0,decorators.MZ)({type:String})],Button.prototype,"ariaLabel",void 0);button_component_decorate([(0,decorators.MZ)({type:Boolean})],Button.prototype,"autofocus",void 0);button_component_decorate([(0,decorators.MZ)({type:String})],Button.prototype,"size",void 0);button_component_decorate([(0,decorators.MZ)({type:Boolean})],Button.prototype,"fullWidth",void 0);button_component_decorate([(0,decorators.MZ)({type:String})],Button.prototype,"iconEnd",void 0);button_component_decorate([(0,decorators.MZ)({type:String})],Button.prototype,"iconStart",void 0);button_component_decorate([(0,decorators.MZ)({type:Boolean})],Button.prototype,"loading",void 0);button_component_decorate([(0,decorators.MZ)({type:String})],Button.prototype,"variant",void 0);button_component_decorate([(0,decorators.MZ)({type:String})],Button.prototype,"download",void 0);button_component_decorate([(0,decorators.MZ)({type:String})],Button.prototype,"href",void 0);button_component_decorate([(0,decorators.MZ)({type:String})],Button.prototype,"hreflang",void 0);button_component_decorate([(0,decorators.MZ)({type:String})],Button.prototype,"ping",void 0);button_component_decorate([(0,decorators.MZ)({type:String})],Button.prototype,"referrerpolicy",void 0);button_component_decorate([(0,decorators.MZ)({type:String})],Button.prototype,"rel",void 0);button_component_decorate([(0,decorators.MZ)({type:String})],Button.prototype,"target",void 0);button_component_decorate([(0,decorators.MZ)({type:Boolean})],Button.prototype,"disabled",void 0);button_component_decorate([(0,decorators.MZ)({type:String})],Button.prototype,"form",void 0);button_component_decorate([(0,decorators.MZ)({type:String})],Button.prototype,"formaction",void 0);button_component_decorate([(0,decorators.MZ)({type:String})],Button.prototype,"formenctype",void 0);button_component_decorate([(0,decorators.MZ)({type:String})],Button.prototype,"formmethod",void 0);button_component_decorate([(0,decorators.MZ)({type:Boolean})],Button.prototype,"formnovalidate",void 0);button_component_decorate([(0,decorators.MZ)({type:String})],Button.prototype,"formtarget",void 0);button_component_decorate([(0,decorators.MZ)({type:String,reflect:true})],Button.prototype,"name",void 0);button_component_decorate([(0,decorators.MZ)({type:String})],Button.prototype,"type",void 0);button_component_decorate([(0,decorators.MZ)({type:String})],Button.prototype,"value",void 0);Button=button_component_decorate([(0,custom_element.E)("vcdk-button")],Button)},2932(__unused_webpack___webpack_module__,__unused_webpack___webpack_exports__,__webpack_require__){var task=__webpack_require__(582);const settings={rootUrl:"https://cdn.designsystem.volvogroup.com/1-2-1",domain:"https://cdn.designsystem.volvogroup.com"};var url_settings;function systemIconUrl({brand="volvo",type="filled",iconId}){return`${settings.rootUrl}/icons/${brand}/system/${type}/${iconId}.svg`}function logotypeUrl({logotype}){return`${url_settings.rootUrl}/logotypes/${logotype}.svg`}function typeFaceCssUrl({brand="volvo"}){return`${url_settings.rootUrl}/css/${brand}/typefaces.css`}var lit=__webpack_require__(2618);var decorators=__webpack_require__(9194);var if_defined=__webpack_require__(31);var unsafe_svg=__webpack_require__(8776);var uniqueId=__webpack_require__(5664);var custom_element=__webpack_require__(6487);var typography_styles=__webpack_require__(1669);var responsive_value=__webpack_require__(6591);var breakpoints=__webpack_require__(8128);var isString=__webpack_require__(9703);var isArray=__webpack_require__(2049);const breakpointKeys=Object.keys(breakpoints.f);const suffixWithPxIfUnitless=value=>{if((0,isString.A)(value))return value;return`${value}px`};const toCssVariables=(name,values)=>{if(!values)return;if(!(0,isArray.A)(values)){return{[name]:suffixWithPxIfUnitless(values)}}return values.reduce((current,next,currentIndex)=>{const breakpointKey=breakpointKeys[currentIndex];return{...current,[`${name}-${breakpointKey}`]:suffixWithPxIfUnitless(next)}},{})};const breakpointEntries=Object.entries(breakpoints.f);const responsiveValueToCssVariable=(selector,variableName)=>{const primaryVariable=`\n  ${selector} {\n    ${variableName}: var(${variableName}-xs);\n  }`;const responsiveVariables=Object.entries(breakpoints.f).splice(1).map(([breakpointKey,breakpoint],index)=>{const nextBreakpoint=breakpointEntries[index+2];const fallback=nextBreakpoint?`, var(${variableName}-${nextBreakpoint[0]})`:``;return`\n    @media(min-width: ${breakpoint.from}px) {\n      ${selector} {\n        ${variableName}: var(${variableName}-${breakpointKey} ${fallback});\n      } \n    }`});return(0,lit.iz)([primaryVariable,responsiveVariables].join(""))};var when=__webpack_require__(302);var class_map=__webpack_require__(3720);var style_map=__webpack_require__(1145);var responsive=__webpack_require__(4135);var vcdk_element=__webpack_require__(7571);const skeletonStyles=(0,lit.AH)`
  @keyframes pulse {
    0% {
      opacity: 0.12;
    }
    50% {
      opacity: 0.06;
    }
    100% {
      opacity: 0.12;
    }
  }

  ${responsiveValueToCssVariable(".skeleton[class*='typography-'].variant-typography","--vcdk-skeleton-line-height")}
  ${responsiveValueToCssVariable(".skeleton[class*='typography-'].variant-typography","--vcdk-skeleton-font-size")}

  .skeleton {
    display: block;
    height: var(--vcdk-skeleton-height, var(--vcdk-skeleton-size));
    width: var(--vcdk-skeleton-width, var(--vcdk-skeleton-size));
    cursor: progress;
    background-color: var(--vcdk-color-bg-inverse);
    overflow: hidden;
    opacity: 0.12;

    &[class*="typography-"].variant-typography {
      height: var(--vcdk-skeleton-font-size);
      margin-block-end: calc(
        var(--vcdk-skeleton-line-height) - var(--vcdk-skeleton-font-size)
      );
    }

    &:not(.variant-typography).aspect-ratio {
      aspect-ratio: var(--vcdk-skeleton-aspect-ratio);
    }

    &:not(.disable-animation, .variant-container) {
      animation: pulse 2s infinite;
    }

    &.variant-ellipse {
      border-radius: 50%;
    }

    &.variant-rounded-rectangle,
    &.variant-typography {
      border-radius: var(--vcdk-radius-default);
    }

    &.variant-container {
      border-radius: var(--vcdk-radius-large);
      border-color: var(--vcdk-color-border-subtle);
      border-width: 1px;
      opacity: 1;
      border-style: solid;
      background-color: var(--vcdk-color-bg);
    }
  }

  .hidden {
    clip: rect(0 0 0 0);
    clip-path: inset(50%);
    height: 1px;
    overflow: hidden;
    position: absolute;
    white-space: nowrap;
    width: 1px;
  }

  @media (prefers-reduced-motion: reduce) {
    .skeleton:not(.disable-animation, .variant-container) {
      animation: none;
    }
  }
`;var __decorate=undefined&&undefined.__decorate||function(decorators,target,key,desc){var c=arguments.length,r=c<3?target:desc===null?desc=Object.getOwnPropertyDescriptor(target,key):desc,d;if(typeof Reflect==="object"&&typeof Reflect.decorate==="function")r=Reflect.decorate(decorators,target,key,desc);else for(var i=decorators.length-1;i>=0;i--)if(d=decorators[i])r=(c<3?d(r):c>3?d(target,key,r):d(target,key))||r;return c>3&&r&&Object.defineProperty(target,key,r),r};let Skeleton=class Skeleton extends((0,responsive.F)(vcdk_element.l)){constructor(){super(...arguments);this.disableAnimation=false;this.typographyVariant="body";this.variant="typography";this.elementAriaDescription=null}get cssVariables(){return{...this.typographyVariant&&toCssVariables("--vcdk-skeleton-line-height",(0,typography_styles.UN)(this.typographyVariant,"line-height")),...this.typographyVariant&&toCssVariables("--vcdk-skeleton-font-size",(0,typography_styles.UN)(this.typographyVariant,"font-size"))}}render(){return(0,lit.qy)`
      <div
        class=${(0,class_map.H)({skeleton:1,"disable-animation":!!this.disableAnimation,"aspect-ratio":!!this.aspectRatio,[`typography-${this.typographyVariant}`]:!!this.typographyVariant,[`variant-${this.variant}`]:1})}
        style=${(0,style_map.W)(this.cssVariables)}>
        ${(0,when.z)(this.elementAriaDescription,()=>(0,lit.qy)`
            <div class="hidden">${this.elementAriaDescription}</div>
          `)}
        <slot aria-hidden="true"></slot>
      </div>
    `}};Skeleton.styles=[skeletonStyles,...typography_styles.FB];Skeleton.responsiveProperties={prefix:"vcdk-skeleton",props:["width","height","size","aspectRatio"]};__decorate([(0,decorators.MZ)({attribute:"aspect-ratio",converter:responsive_value.g})],Skeleton.prototype,"aspectRatio",void 0);__decorate([(0,decorators.MZ)({type:Boolean,attribute:"disable-animation"})],Skeleton.prototype,"disableAnimation",void 0);__decorate([(0,decorators.MZ)({converter:responsive_value.g})],Skeleton.prototype,"height",void 0);__decorate([(0,decorators.MZ)({converter:responsive_value.g})],Skeleton.prototype,"size",void 0);__decorate([(0,decorators.MZ)({type:String,attribute:"typography-variant"})],Skeleton.prototype,"typographyVariant",void 0);__decorate([(0,decorators.MZ)({converter:responsive_value.g})],Skeleton.prototype,"width",void 0);__decorate([(0,decorators.MZ)({type:String})],Skeleton.prototype,"variant",void 0);__decorate([(0,decorators.MZ)({type:String,attribute:"element-aria-description"})],Skeleton.prototype,"elementAriaDescription",void 0);Skeleton=__decorate([(0,custom_element.E)("vcdk-skeleton")],Skeleton);const systemIconStyles=(0,lit.AH)`
  svg {
    max-width: 100%;
    aspect-ratio: 1 / 1;
    flex-shrink: 0;
    color: var(--vcdk-color-icon, inherit);
    width: var(--vcdk-system-icon-size, 24px);
    height: var(--vcdk-system-icon-size, 24px);
    min-width: var(--vcdk-system-icon-size, 24px);
    min-height: var(--vcdk-system-icon-size, 24px);
  }
`;var system_icon_component_decorate=undefined&&undefined.__decorate||function(decorators,target,key,desc){var c=arguments.length,r=c<3?target:desc===null?desc=Object.getOwnPropertyDescriptor(target,key):desc,d;if(typeof Reflect==="object"&&typeof Reflect.decorate==="function")r=Reflect.decorate(decorators,target,key,desc);else for(var i=decorators.length-1;i>=0;i--)if(d=decorators[i])r=(c<3?d(r):c>3?d(target,key,r):d(target,key))||r;return c>3&&r&&Object.defineProperty(target,key,r),r};const templateCache={};let SystemIcon=class SystemIcon extends vcdk_element.l{constructor(){super(...arguments);this.elementRole="presentation";this.elementAriaHidden=null;this.assetsTask=new task.YZ(this,{task:async([icon,filled,brand])=>{if(!icon)return"";const url=systemIconUrl({type:filled?"filled":"lined",brand,iconId:icon});if(templateCache[url]===undefined){templateCache[url]=fetch(url).then(response=>{if(!response.ok){throw new Error(`Response from CDN returned a non ok status: ${response.status}`)}return response.text()}).then(response=>(0,unsafe_svg.T)(response)).catch(error=>{console.error(`Failed when loading icon id: "${icon}". ${error}`);throw error})}return await templateCache[url]},args:()=>[this.icon,this.filled,this.brandId]})}render(){return this.assetsTask.render({pending:()=>(0,lit.qy)`
        <vcdk-skeleton
          variant="rounded-rectangle"
          size=${(0,if_defined.J)(this.size)}></vcdk-skeleton>
      `,complete:markup=>markup,error:()=>(0,lit.qy)`
        <span style="width:${this.size}px;height:${this.size}px"></span>
      `})}updated(changedProperties){super.updated(changedProperties);this.setAttributes();this.extendSvg()}extendSvg(){if(!this.svgElement)return;if(this.elementTitle){this.elementAriaLabelledBy=this.elementAriaLabelledBy||(0,uniqueId.A)("svg-title-");this.svgElement.setAttribute("aria-labelledby",this.elementAriaLabelledBy);const titleSelector=this.svgElement.querySelector("title");if(!titleSelector){if(!document){console.warn("Document is not available, cannot create title element for SVG.");return}const title=document.createElement("title");title.id=this.elementAriaLabelledBy;title.textContent=this.elementTitle;this.svgElement.insertBefore(title,this.svgElement.firstChild)}else{titleSelector.id=this.elementAriaLabelledBy;titleSelector.textContent=this.elementTitle}}if(this.description){this.elementAriaDescribedBy=this.elementAriaDescribedBy||(0,uniqueId.A)("svg-description-");this.svgElement.setAttribute("aria-describedby",this.elementAriaDescribedBy);const descSelector=this.svgElement.querySelector("desc");if(!descSelector){const desc=document.createElementNS("http://www.w3.org/2000/svg","desc");desc.id=this.elementAriaDescribedBy;desc.textContent=this.description;this.svgElement.appendChild(desc);if(!this.elementTitle){this.svgElement.insertBefore(desc,this.svgElement.firstChild)}else{this.svgElement.querySelector("title")?.insertAdjacentElement("afterend",desc)}}else{descSelector.id=this.elementAriaDescribedBy;descSelector.textContent=this.description}}}setAttributes(){this.svgElement?.setAttribute("part","svg");this.svgElement?.setAttribute("focusable","false");if(typeof this.size==="number"){this.svgElement?.setAttribute("style",`--vcdk-system-icon-size: ${this.size}px;`)}this.elementRole?this.svgElement?.setAttribute("role",this.elementRole):lit.s6;this.elementAriaHidden?this.svgElement?.setAttribute("aria-hidden",this.elementAriaHidden):lit.s6}};SystemIcon.styles=[systemIconStyles];system_icon_component_decorate([(0,decorators.MZ)({type:Boolean})],SystemIcon.prototype,"filled",void 0);system_icon_component_decorate([(0,decorators.MZ)({type:String})],SystemIcon.prototype,"icon",void 0);system_icon_component_decorate([(0,decorators.MZ)({type:Number})],SystemIcon.prototype,"size",void 0);system_icon_component_decorate([(0,decorators.MZ)({type:String,attribute:"element-aria-labelledby"})],SystemIcon.prototype,"elementAriaLabelledBy",void 0);system_icon_component_decorate([(0,decorators.MZ)({type:String,attribute:"element-title"})],SystemIcon.prototype,"elementTitle",void 0);system_icon_component_decorate([(0,decorators.MZ)({type:String,attribute:"element-aria-describedby"})],SystemIcon.prototype,"elementAriaDescribedBy",void 0);system_icon_component_decorate([(0,decorators.MZ)({type:String})],SystemIcon.prototype,"description",void 0);system_icon_component_decorate([(0,decorators.MZ)({type:String,attribute:"element-role"})],SystemIcon.prototype,"elementRole",void 0);system_icon_component_decorate([(0,decorators.MZ)({type:String,attribute:"element-aria-hidden"})],SystemIcon.prototype,"elementAriaHidden",void 0);system_icon_component_decorate([(0,decorators.P)("svg")],SystemIcon.prototype,"svgElement",void 0);system_icon_component_decorate([(0,decorators.wk)()],SystemIcon.prototype,"assetsTask",void 0);SystemIcon=system_icon_component_decorate([(0,custom_element.E)("vcdk-system-icon")],SystemIcon)},1669(__unused_webpack___webpack_module__,__webpack_exports__,__webpack_require__){__webpack_require__.d(__webpack_exports__,{FB:()=>allTypographyClasses,IT:()=>typographyClasses,UN:()=>getTypographyValues});var _volvo_vcdk_tokens_dist_web_global_breakpoints_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(8128);var lit__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__(2618);var lodash_es__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__(2326);const typographyStyles=(0,lit__WEBPACK_IMPORTED_MODULE_1__.AH)`
  slot {
    display: inline;
    font-synthesis: none;
    margin: 0;
  }

  ::slotted(*) {
    font-synthesis: none;
    margin: 0;
  }
`;const typographyVariants=["display-statement","display1","display2","heading1","heading2","heading3","heading4","subtitle1","subtitle2","large-body","body","button","caption1","caption2"];const typographyVariantStyles=(variant,screenSize="small")=>{const kebabVariant=(0,lodash_es__WEBPACK_IMPORTED_MODULE_2__.A)(variant);return(0,lit__WEBPACK_IMPORTED_MODULE_1__.AH)`
    font-family: var(
      --vcdk-typography-${(0,lit__WEBPACK_IMPORTED_MODULE_1__.iz)(kebabVariant)}-font-family-${(0,lit__WEBPACK_IMPORTED_MODULE_1__.iz)(screenSize)}-screens
    );
    font-size: var(
      --vcdk-typography-${(0,lit__WEBPACK_IMPORTED_MODULE_1__.iz)(kebabVariant)}-size-${(0,lit__WEBPACK_IMPORTED_MODULE_1__.iz)(screenSize)}-screens
    );
    line-height: var(
      --vcdk-typography-${(0,lit__WEBPACK_IMPORTED_MODULE_1__.iz)(kebabVariant)}-line-height-${(0,lit__WEBPACK_IMPORTED_MODULE_1__.iz)(screenSize)}-screens
    );
    letter-spacing: var(
      --vcdk-typography-${(0,lit__WEBPACK_IMPORTED_MODULE_1__.iz)(kebabVariant)}-letter-spacing-${(0,lit__WEBPACK_IMPORTED_MODULE_1__.iz)(screenSize)}-screens
    );
    font-weight: var(
      --vcdk-typography-${(0,lit__WEBPACK_IMPORTED_MODULE_1__.iz)(kebabVariant)}-weight-${(0,lit__WEBPACK_IMPORTED_MODULE_1__.iz)(screenSize)}-screens
    );
  `};const typographyClasses=typographyVariants.reduce((classes,variant)=>{classes[variant]=(0,lit__WEBPACK_IMPORTED_MODULE_1__.AH)`
      .typography-${(0,lit__WEBPACK_IMPORTED_MODULE_1__.iz)(variant)},
        .typography-${(0,lit__WEBPACK_IMPORTED_MODULE_1__.iz)(variant)}
        ::slotted(*) {
        ${typographyVariantStyles(variant,"small")}
      }
      @media (min-width: ${_volvo_vcdk_tokens_dist_web_global_breakpoints_js__WEBPACK_IMPORTED_MODULE_0__.f.md.from}px) {
        .typography-${(0,lit__WEBPACK_IMPORTED_MODULE_1__.iz)(variant)},
          .typography-${(0,lit__WEBPACK_IMPORTED_MODULE_1__.iz)(variant)}
          ::slotted(*) {
          ${typographyVariantStyles(variant,"large")}
        }
      }
    `;return classes},{});const allTypographyClasses=Object.values(typographyClasses);const getTypographyValues=(variant,property)=>{const tokenProperty=property==="font-size"?"size":property;const kebabVariant=(0,lodash_es__WEBPACK_IMPORTED_MODULE_2__.A)(variant);return[`var(--vcdk-typography-${kebabVariant}-${tokenProperty}-small-screens)`,`var(--vcdk-typography-${kebabVariant}-${tokenProperty}-large-screens)`]}},6591(__unused_webpack___webpack_module__,__webpack_exports__,__webpack_require__){__webpack_require__.d(__webpack_exports__,{g:()=>responsiveValueConverter});var breakpoints;var _volvo_vcdk_tokens_dist_web_global_breakpoints_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(8128);var lit__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__(2618);const responsiveValueConverter={fromAttribute(value,type){if(!value){return null}if(value.startsWith("[")&&value.endsWith("]")){return JSON.parse(value)}if(typeof type==="undefined"){const number=Number(value);if(!Number.isNaN(number)){return number}}return lit__WEBPACK_IMPORTED_MODULE_1__.W3.fromAttribute?.(value,type)},toAttribute(value,type){if(Array.isArray(value)){return lit__WEBPACK_IMPORTED_MODULE_1__.W3.toAttribute?.(value,Array)}return lit__WEBPACK_IMPORTED_MODULE_1__.W3.toAttribute?.(value,type)}};const valueInBreakpoint=(value,breakpoint)=>{const values=Array.isArray(value)?value:[value];const breakpointIndex=Object.keys(breakpoints).indexOf(breakpoint);const currentValueIndex=Math.min(values.length-1,breakpointIndex);return values[currentValueIndex]}},7571(__unused_webpack___webpack_module__,__webpack_exports__,__webpack_require__){__webpack_require__.d(__webpack_exports__,{l:()=>VcdkElement});var context=__webpack_require__(767);const themes=null&&["volvo-light","volvo-dark","mack-light","mack-dark","renault-light","renault-dark"];const brands=["volvo","mack","renault"];const colorSchemes=null&&["light","dark"];function reverseTheme(themeId){if(themeId.includes("light")){return themeId.replace("light","dark")}return themeId.replace("dark","light")}function darkTheme(themeId){if(themeId.includes("dark")){return themeId}return reverseTheme(themeId)}var lit=__webpack_require__(2618);var decorators=__webpack_require__(9194);var noop=__webpack_require__(2302);const themeContext=(0,context.q6)(Symbol("vcdk-theme"));if(typeof document!=="undefined"){const root=new context.aU;const attach=()=>root.attach(document.body);if(document.body){attach()}else{document.addEventListener("DOMContentLoaded",attach)}}const globalVariableStyles=(0,lit.AH)`
  :host {
    --vcdk-z-index-zero: 0;
    --vcdk-z-index-over-input: 1;
    --vcdk-z-index-switch-thumb: 2;
    --vcdk-z-index-switch-input: 3;
    --vcdk-z-index-time-picker-popover: 15;
    --vcdk-z-index-search-popover: 20;
    --vcdk-z-index-drawer: 50;
    --vcdk-z-index-bottom-navigation: 50;
    --vcdk-z-index-banner: 60;
    --vcdk-z-index-modal-backdrop: 90;
    --vcdk-z-index-modal: 100;
    --vcdk-z-index-tooltip: 1000;
    --vcdk-z-index-dropdown-popover: 1100;
    --vcdk-z-index-context-menu: 1200;
    --vcdk-z-index-context-sub-menu: 1210;
    --vcdk-z-index-datepicker-overlay: 1300;
    --vcdk-z-index-calendar-overlay: 1305;
    --vcdk-z-index-snackbar: 1310;

    --vcdk-shadow-one:
      0px 0.2px 2px 0px var(--vcdk-color-bg-shadow, rgba(0, 0, 0, 0.2)),
      0px 1px 2px 0px var(--vcdk-color-bg-shadow, rgba(0, 0, 0, 0.2));
    --vcdk-shadow-two:
      0px 0.2px 2px 0px var(--vcdk-color-bg-shadow, rgba(0, 0, 0, 0.2)),
      0px 2px 4px 0px var(--vcdk-color-bg-shadow, rgba(0, 0, 0, 0.2));
    --vcdk-shadow-four:
      0px 0.3px 2px 0px var(--vcdk-color-bg-shadow, rgba(0, 0, 0, 0.2)),
      0px 3px 8px 0px var(--vcdk-color-bg-shadow, rgba(0, 0, 0, 0.2));
    --vcdk-shadow-eight:
      0px 0.6px 3px 0px var(--vcdk-color-bg-shadow, rgba(0, 0, 0, 0.2)),
      0px 8px 16px 0px var(--vcdk-color-bg-shadow, rgba(0, 0, 0, 0.2));
    --vcdk-shadow-sixteen:
      0px 1px 4px 0px var(--vcdk-color-bg-shadow, rgba(0, 0, 0, 0.2)),
      0px 16px 32px 0px var(--vcdk-color-bg-shadow, rgba(0, 0, 0, 0.2));
  }
`;const normalize=(0,lit.AH)`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  * {
    margin: 0;
  }

  html,
  body {
    height: 100%;
  }

  body {
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  img,
  picture,
  video,
  canvas,
  svg {
    display: block;
    max-width: 100%;
  }

  input,
  button,
  textarea,
  select {
    font-family: inherit;
  }

  p,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    overflow-wrap: break-word;
  }

  :host {
    color: var(--vcdk-color-text);
    cursor: inherit;
    font-family: var(
      --vcdk-typography-large-body-font-family-small-screens,
      "Volvo Novum"
    );
  }

  :host([hidden]) {
    display: none;
  }

  :focus-visible {
    outline-color: var(--vcdk-color-border-focus, #2b8ede);
    outline-style: solid;
    outline-width: 2px;
  }
`;var __decorate=undefined&&undefined.__decorate||function(decorators,target,key,desc){var c=arguments.length,r=c<3?target:desc===null?desc=Object.getOwnPropertyDescriptor(target,key):desc,d;if(typeof Reflect==="object"&&typeof Reflect.decorate==="function")r=Reflect.decorate(decorators,target,key,desc);else for(var i=decorators.length-1;i>=0;i--)if(d=decorators[i])r=(c<3?d(r):c>3?d(target,key,r):d(target,key))||r;return c>3&&r&&Object.defineProperty(target,key,r),r};class VcdkElement extends lit.WF{constructor(){super(...arguments);this.isThemeProvider=false;this.themeProvider=undefined;this.themeConsumer=new context.G(this,{context:themeContext,subscribe:true,callback:()=>{this.handleTheming()}})}static get defaultLocale(){if(typeof document!=="undefined"&&document.documentElement.lang){return document.documentElement.lang}if(typeof window!=="undefined"){return window.navigator.language}return"en-US"}get currentTheme(){let themeId=this.themeId??this.contextTheme??VcdkElement.defaultTheme;if(this.invertTheme){themeId=reverseTheme(themeId)}return themeId}get contextTheme(){return this.themeConsumer?.value?.themeId}get brandId(){return this.currentTheme?.split("-")[0]}get colorSchemeId(){return this.currentTheme?.split("-")[1]}themeChanged(){(0,noop.A)()}update(changedProperties){if(changedProperties.has("themeId")||changedProperties.has("invertTheme")){this.handleTheming()}super.update(changedProperties)}handleTheming(){if(this.currentTheme!==this.contextTheme){if(!this.isThemeProvider){this.isThemeProvider=true;this.themeProvider=new context.DT(this,{context:themeContext,initialValue:{themeId:this.currentTheme}})}else{this.themeProvider?.setValue({themeId:this.currentTheme})}this.setThemeCssClasses();this.themeChanged();return}if(this.isThemeProvider&&this.themeProvider){this.isThemeProvider=false;this.removeController(this.themeProvider);this.themeProvider=undefined;this.setThemeCssClasses();this.themeChanged()}}setThemeCssClasses(){const isDifferentTheme=this.currentTheme!==this.contextTheme;for(const brand of brands){this.classList.toggle(`vcdk-theme-${brand}`,isDifferentTheme&&this.brandId===brand)}this.classList.toggle("vcdk-mode-dark",isDifferentTheme&&this.colorSchemeId==="dark")}static finalizeStyles(styles){if(!styles){return lit.WF.finalizeStyles([globalVariableStyles,normalize])}if(Array.isArray(styles)){styles.unshift(globalVariableStyles,normalize);return lit.WF.finalizeStyles(styles)}return lit.WF.finalizeStyles([globalVariableStyles,normalize,styles])}}VcdkElement.version="9.16.0";VcdkElement.defaultTheme="volvo-light";__decorate([(0,decorators.MZ)({type:String,reflect:true})],VcdkElement.prototype,"themeId",void 0);__decorate([(0,decorators.MZ)({type:Boolean,attribute:"invert-theme",reflect:true})],VcdkElement.prototype,"invertTheme",void 0)}}]);
//# sourceMappingURL=vcdk.js.map