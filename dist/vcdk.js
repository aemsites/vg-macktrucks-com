"use strict";(self["webpackChunkmacktrucks"]=self["webpackChunkmacktrucks"]||[]).push([[325],{6487(__unused_webpack___webpack_module__,__webpack_exports__,__webpack_require__){__webpack_require__.d(__webpack_exports__,{E:()=>customElement});const customElement=tagName=>(target,context)=>{const initializer=()=>{const existingElement=customElements.get(tagName);if(!existingElement){customElements.define(tagName,target);return}const existingVersion=existingElement.version;const currentVersion=target.version;if(existingVersion&&currentVersion&&existingVersion!==currentVersion){console.warn(`vcdk warning: Attempted to register <${tagName}>v, but <${tagName}>v. was already registered. This could indicate that your application might contain duplicate instances of the same component.`)}};if(context){context.addInitializer(initializer)}else{initializer()}}},4135(__unused_webpack___webpack_module__,__webpack_exports__,__webpack_require__){__webpack_require__.d(__webpack_exports__,{F:()=>Responsive});var _volvo_vcdk_tokens_dist_web_global_breakpoints_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(1089);var lit__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__(2618);var lodash_es__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__(2326);var _web_components_vcdk_element_index_js__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__(6486);const breakpointKeys=Object.keys(_volvo_vcdk_tokens_dist_web_global_breakpoints_js__WEBPACK_IMPORTED_MODULE_0__.f);const Responsive=superClass=>{class ResponsiveClass extends superClass{static fallbackVariableValue(prefix,prop,fallbacks){if(!fallbacks.length){return""}const current=fallbacks.shift();if(fallbacks.length){return`var(--${prefix}-${prop}-${current}, ${this.fallbackVariableValue(prefix,prop,fallbacks)})`}return`var(--${prefix}-${prop}-${current})`}static responsiveVariables(prefix,props,breakpoint,fallbacks){return props.map(prop=>{const name=(0,lodash_es__WEBPACK_IMPORTED_MODULE_2__.A)(prop);if(fallbacks){return`\n    --${prefix}-${name}-fallback: ${this.fallbackVariableValue(prefix,name,[...fallbacks])};\n    --${prefix}-${name}: var(--${prefix}-${name}-${breakpoint}, var(--${prefix}-${name}-fallback));`}return`\n    --${prefix}-${name}: var(--${prefix}-${name}-${breakpoint});`}).join("")}static responsiveStyles(settings){return(0,lit__WEBPACK_IMPORTED_MODULE_1__.AH)`
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
      }`}static finalizeStyles(styles){if(!this.responsiveProperties){return _web_components_vcdk_element_index_js__WEBPACK_IMPORTED_MODULE_3__.l.finalizeStyles(styles)}const alteredStyles=[this.responsiveStyles(this.responsiveProperties)];if(styles&&Array.isArray(styles)){alteredStyles.push(...styles)}else if(styles){alteredStyles.push(styles)}return _web_components_vcdk_element_index_js__WEBPACK_IMPORTED_MODULE_3__.l.finalizeStyles(alteredStyles)}connectedCallback(){super.connectedCallback();this.setResponsiveVariables()}update(changedProperties){const responsiveProperties=this.constructor.responsiveProperties;const props=responsiveProperties?.props;if(responsiveProperties&&props.some(prop=>changedProperties.has(prop))){this.setResponsiveVariables()}super.update(changedProperties)}setResponsiveVariables(){const responsiveProperties=this.constructor.responsiveProperties;if(typeof responsiveProperties==="undefined")return;const props=responsiveProperties.props;for(const prop of props){let value=this[prop];if(!value)continue;if(!Array.isArray(value)){value=[value]}for(let i=0;i<value.length;i++){const propName=String(prop);let breakpointValue=value[i];if(responsiveProperties.styleTransform){breakpointValue=responsiveProperties.styleTransform(propName,breakpointKeys[i],breakpointValue)}if(typeof breakpointValue==="undefined"){continue}if(typeof breakpointValue==="number"){breakpointValue=`${breakpointValue}px`}const breakpoint=breakpointKeys[i];this.style.setProperty(`--${responsiveProperties.prefix}-${(0,lodash_es__WEBPACK_IMPORTED_MODULE_2__.A)(propName)}-${breakpoint}`,breakpointValue)}}}}return ResponsiveClass}},7909(__unused_webpack___webpack_module__,__unused_webpack___webpack_exports__,__webpack_require__){var system_icon=__webpack_require__(3018);var typography_styles=__webpack_require__(1669);var lit=__webpack_require__(2618);var decorators=__webpack_require__(2745);var class_map=__webpack_require__(3720);var if_defined=__webpack_require__(31);var when=__webpack_require__(302);var custom_element=__webpack_require__(6487);var vcdk_element=__webpack_require__(6486);const accordionStyles=(0,lit.AH)`
  :host {
    --vcdk-accordion-summary-padding-inline: var(--vcdk-spacing-8);
    --vcdk-accordion-padding-inline: var(
      --vcdk-accordion-summary-padding-inline,
      var(--vcdk-spacing-8)
    );
  }

  /* Small size variant */
  :host([size="small"]) summary,
  :host([size="small"]) .disabled-button {
    --vcdk-system-icon-size: 1.25rem;
  }

  details,
  .details {
    color: var(--vcdk-color-text-subtle);
    width: 100%;
    max-width: 100%;
    border-bottom: 1px solid var(--vcdk-color-border-subtle);
    display: block;
    background-color: var(--vcdk-color-bg);
  }

  summary,
  .disabled-button {
    --vcdk-system-icon-size: 1.5rem;
    align-items: center;
    border-radius: var(--vcdk-radius-default);
    cursor: pointer;
    display: flex;
    gap: var(--vcdk-spacing-5);
    padding-block: var(--vcdk-spacing-6);
    padding-inline: var(--vcdk-accordion-padding-inline);
    user-select: none;
    width: 100%;
  }

  .disabled-button {
    appearance: none;
    background: none;
    border: none;
    color: var(--vcdk-color-text-disabled);
    cursor: not-allowed;
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

  .disabled-button vcdk-system-icon::part(svg) {
    color: var(--vcdk-color-text-disabled);
  }

  .chevron {
    color: var(--vcdk-color-text);
    transition-property: transform;
    transition-duration: var(--vcdk-motion-duration-small);
    transition-timing-function: var(--vcdk-motion-easing-exit);
  }

  .disabled-button .chevron {
    color: var(--vcdk-color-text-disabled);
  }

  [open] .chevron {
    transform: rotate(-180deg);
    transition-timing-function: var(--vcdk-motion-easing-entrance);
  }

  .content {
    display: block;
    padding-inline: var(--vcdk-accordion-padding-inline);
    padding-block: var(--vcdk-spacing-4) var(--vcdk-spacing-8);
    color: var(--vcdk-color-text-subtle);
    text-align: start;
  }
`;var __decorate=undefined&&undefined.__decorate||function(decorators,target,key,desc){var c=arguments.length,r=c<3?target:desc===null?desc=Object.getOwnPropertyDescriptor(target,key):desc,d;if(typeof Reflect==="object"&&typeof Reflect.decorate==="function")r=Reflect.decorate(decorators,target,key,desc);else for(var i=decorators.length-1;i>=0;i--)if(d=decorators[i])r=(c<3?d(r):c>3?d(target,key,r):d(target,key))||r;return c>3&&r&&Object.defineProperty(target,key,r),r};const summaryTemplate=(headerTitle,size,headerIcon)=>(0,lit.qy)`
  <slot name="summary-start">
    ${(0,when.z)(headerIcon,()=>(0,lit.qy)`
        <vcdk-system-icon icon=${(0,if_defined.J)(headerIcon)}></vcdk-system-icon>
      `)}
  </slot>
  <slot
    name="title"
    class=${(0,class_map.H)({title:true,"typography-subtitle1":size==="large","typography-subtitle2":size==="small"})}>
    ${headerTitle}
  </slot>
  <slot name="summary-end"></slot>
  <vcdk-system-icon class="chevron" icon=${"chevron-down"}></vcdk-system-icon>
`;class AccordionToggleEvent extends CustomEvent{constructor(detail){super(AccordionToggleEvent.eventName,{detail,bubbles:true,composed:true,cancelable:true})}}AccordionToggleEvent.eventName="vcdk-toggle";let Accordion=class Accordion extends vcdk_element.l{constructor(){super(...arguments);this.headerTitle="";this.open=false;this.disabled=false;this.tabIndex=0;this.size="large";this._toggleEvent=e=>{const newOpenState=e.newState==="open";if(newOpenState!==this.open){this.open=newOpenState;this.dispatchEvent(new AccordionToggleEvent({open:newOpenState}))}}}render(){const{headerTitle,headerIcon,size}=this;if(this.disabled){return(0,lit.qy)`
        <div class="details">
          <button disabled class="disabled-button" aria-expanded="false">
            ${summaryTemplate(headerTitle,size,headerIcon)}
          </button>
        </div>
      `}return(0,lit.qy)`
      <details @toggle=${this._toggleEvent} ?open=${this.open} part="details">
        <summary
          id="accordionID"
          part="summary"
          tabindex=${this.tabIndex}
          aria-controls="accordionSectionID"
          aria-expanded=${this.open&&!this.disabled?"true":"false"}>
          ${summaryTemplate(headerTitle,size,headerIcon)}
        </summary>
        <slot
          part="content"
          class=${(0,class_map.H)({content:true,"typography-caption1":size==="small"})}
          role="region"
          id="accordionSectionID"
          aria-labelledby="accordionID"></slot>
      </details>
    `}};Accordion.styles=[typography_styles.IT.subtitle1,typography_styles.IT.subtitle2,typography_styles.IT.caption1,accordionStyles];__decorate([(0,decorators.MZ)({type:String})],Accordion.prototype,"headerTitle",void 0);__decorate([(0,decorators.MZ)({type:String})],Accordion.prototype,"headerIcon",void 0);__decorate([(0,decorators.MZ)({type:Boolean,reflect:true})],Accordion.prototype,"open",void 0);__decorate([(0,decorators.MZ)({type:Boolean,reflect:true})],Accordion.prototype,"disabled",void 0);__decorate([(0,decorators.MZ)({type:Number})],Accordion.prototype,"tabIndex",void 0);__decorate([(0,decorators.MZ)({type:String,reflect:true})],Accordion.prototype,"size",void 0);Accordion=__decorate([(0,custom_element.E)("vcdk-accordion")],Accordion)},1975(__unused_webpack___webpack_module__,__unused_webpack___webpack_exports__,__webpack_require__){var responsive_value=__webpack_require__(6591);var lit=__webpack_require__(2618);var decorators=__webpack_require__(2745);var style_map=__webpack_require__(1145);var custom_element=__webpack_require__(6487);var responsive=__webpack_require__(4135);var vcdk_element=__webpack_require__(6486);const spinnerStyles=(0,lit.AH)`
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

  .loader {
    animation: spin 2s linear infinite;
  }

  @keyframes spin {
    0% {
      rotate: 0deg;
    }

    100% {
      rotate: 360deg;
    }
  }

  .indefinite.active {
    stroke: var(--vcdk-spinner-stroke, var(--vcdk-color-bg-selected));
    stroke-linecap: round;
    stroke-dashoffset: 360;
    animation: active-animation 8s ease-in-out infinite;
  }

  @keyframes active-animation {
    0% {
      stroke-dasharray: 0 0 0 360 0 360;
    }
    12.5% {
      stroke-dasharray: 0 0 270 90 270 90;
    }
    25% {
      stroke-dasharray: 0 270 0 360 0 360;
    }
    37.5% {
      stroke-dasharray: 0 270 270 90 270 90;
    }
    50% {
      stroke-dasharray: 0 540 0 360 0 360;
    }
    50.001% {
      stroke-dasharray: 0 180 0 360 0 360;
    }
    62.5% {
      stroke-dasharray: 0 180 270 90 270 90;
    }
    75% {
      stroke-dasharray: 0 450 0 360 0 360;
    }
    87.5% {
      stroke-dasharray: 0 450 270 90 270 90;
    }
    87.501% {
      stroke-dasharray: 0 90 270 90 270 90;
    }
    100% {
      stroke-dasharray: 0 360 1 360 0 360;
    }
  }

  .indefinite.track {
    stroke: var(--vcdk-spinner-stroke-track, var(--vcdk-color-bg-disabled));
    stroke-linecap: round;
    stroke-dashoffset: 360;
    animation: track-animation 8s ease-in-out infinite;
  }

  @keyframes track-animation {
    0% {
      stroke-dasharray: 0 20 320 40 320 40;
    }
    12.5% {
      stroke-dasharray: 0 290 50 310 50 310;
    }
    25% {
      stroke-dasharray: 0 290 320 40 320 40;
    }
    37.5% {
      stroke-dasharray: 0 560 50 310 50 310;
    }
    37.501% {
      stroke-dasharray: 0 200 50 310 50 310;
    }
    50% {
      stroke-dasharray: 0 200 320 40 320 40;
    }
    62.5% {
      stroke-dasharray: 0 470 50 310 50 310;
    }
    62.501% {
      stroke-dasharray: 0 110 50 310 50 310;
    }
    75% {
      stroke-dasharray: 0 110 320 40 320 40;
    }
    87.5% {
      stroke-dasharray: 0 380 50 310 50 310;
    }
    100% {
      stroke-dasharray: 0 380 320 40 320 40;
    }
  }
`;var __decorate=undefined&&undefined.__decorate||function(decorators,target,key,desc){var c=arguments.length,r=c<3?target:desc===null?desc=Object.getOwnPropertyDescriptor(target,key):desc,d;if(typeof Reflect==="object"&&typeof Reflect.decorate==="function")r=Reflect.decorate(decorators,target,key,desc);else for(var i=decorators.length-1;i>=0;i--)if(d=decorators[i])r=(c<3?d(r):c>3?d(target,key,r):d(target,key))||r;return c>3&&r&&Object.defineProperty(target,key,r),r};let Spinner=class Spinner extends((0,responsive.F)(vcdk_element.l)){render(){if(typeof this.progress==="undefined"){return(0,lit.JW)`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 384" class="loader" role="progressbar"
      aria-busy="true"
      aria-live="polite"
      aria-label="${this.elementAriaLabel}">
        <circle
          r="176"
          cy="192"
          cx="192"
          stroke-width="32"
          fill="transparent"
          pathLength="360"
          class="indefinite active"
        ></circle>
        <circle
          r="176"
          cy="192"
          cx="192"
          stroke-width="32"
          fill="transparent"
          pathLength="360"
          class="indefinite track"
        ></circle>
      </svg>`}return(0,lit.JW)`
      <svg
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
    `}};Spinner.styles=[spinnerStyles];Spinner.responsiveProperties={prefix:"vcdk-spinner",props:["size"],styleTransform:(name,_,value)=>{if(name==="size"&&typeof value==="string"){switch(value){case"small":return 18;case"large":return 80;default:return 38}}return value}};__decorate([(0,decorators.MZ)({type:Number})],Spinner.prototype,"progress",void 0);__decorate([(0,decorators.MZ)({converter:responsive_value.g})],Spinner.prototype,"size",void 0);__decorate([(0,decorators.MZ)({type:String,attribute:"element-aria-label"})],Spinner.prototype,"elementAriaLabel",void 0);Spinner=__decorate([(0,custom_element.E)("vcdk-spinner")],Spinner);var system_icon=__webpack_require__(3018);var typography_styles=__webpack_require__(1669);var pickBy=__webpack_require__(5905);var vcdk_form_button_component_decorate=undefined&&undefined.__decorate||function(decorators,target,key,desc){var c=arguments.length,r=c<3?target:desc===null?desc=Object.getOwnPropertyDescriptor(target,key):desc,d;if(typeof Reflect==="object"&&typeof Reflect.decorate==="function")r=Reflect.decorate(decorators,target,key,desc);else for(var i=decorators.length-1;i>=0;i--)if(d=decorators[i])r=(c<3?d(r):c>3?d(target,key,r):d(target,key))||r;return c>3&&r&&Object.defineProperty(target,key,r),r};const createProxyButton=button=>{const proxyButton=document.createElement("button");const transferrableProps=["type","formAction","formEnctype","formMethod","formNoValidate","formTarget"];Object.assign(proxyButton,(0,pickBy.A)(button,(value,key)=>{if(!transferrableProps.includes(key))return false;return typeof value!=="undefined"}));Object.assign(proxyButton.style,{position:"absolute !important",width:"0 !important",height:"0 !important",clipPath:"inset(50%) !important",overflow:"hidden !important",whiteSpace:"nowrap !important"});return proxyButton};class VcdkFormButton extends vcdk_element.l{constructor(){super();this.type="button";this.formNoValidate=false;this.disabled=false;this.customStates={set:(customState,active)=>{if(!this.internals?.states){return}if(active){this.internals.states.add(customState)}else{this.internals.states.delete(customState)}},has:customState=>{if(!this.internals?.states)return false;return this.internals.states.has(customState)}};this.onButtonClick=e=>{if(this.disabled){e.preventDefault();e.stopPropagation();return}if(!this.internals){return}setTimeout(()=>{if(e.defaultPrevented){return}if(!this.internals){return}if(this.type==="submit"&&this.name){this.internals.setFormValue(this.value??null)}if(this.type==="submit"||this.type==="reset"){const proxy=createProxyButton(this);try{this.internals.form?.appendChild(proxy);proxy.click()}finally{proxy.remove();if(this.type==="submit"&&this.name){this.internals.setFormValue(null)}}}},0)};try{this.internals=this.attachInternals()}catch{console.warn("ElementInternals API is not supported in this browser. A polyfill may be required.")}}update(changedProperties){super.update(changedProperties);this.setCustomStates()}setCustomStates(){this.customStates.set("disabled",this.disabled)}formDisabledCallback(isDisabled){this.disabled=isDisabled}formResetCallback(){}formAssociatedCallback(){}click(){this.buttonEl.value?.click()}}VcdkFormButton.shadowRootOptions={...vcdk_element.l.shadowRootOptions,delegatesFocus:true};VcdkFormButton.formAssociated=true;vcdk_form_button_component_decorate([(0,decorators.MZ)({type:String,reflect:true})],VcdkFormButton.prototype,"type",void 0);vcdk_form_button_component_decorate([(0,decorators.MZ)({type:String,reflect:true})],VcdkFormButton.prototype,"name",void 0);vcdk_form_button_component_decorate([(0,decorators.MZ)({type:String})],VcdkFormButton.prototype,"value",void 0);vcdk_form_button_component_decorate([(0,decorators.MZ)({type:String})],VcdkFormButton.prototype,"form",void 0);vcdk_form_button_component_decorate([(0,decorators.MZ)({type:String})],VcdkFormButton.prototype,"formAction",void 0);vcdk_form_button_component_decorate([(0,decorators.MZ)({type:String,attribute:"formenctype"})],VcdkFormButton.prototype,"formEnctype",void 0);vcdk_form_button_component_decorate([(0,decorators.MZ)({type:String,attribute:"formmethod"})],VcdkFormButton.prototype,"formMethod",void 0);vcdk_form_button_component_decorate([(0,decorators.MZ)({type:Boolean,attribute:"formnovalidate"})],VcdkFormButton.prototype,"formNoValidate",void 0);vcdk_form_button_component_decorate([(0,decorators.MZ)({type:String,attribute:"formtarget"})],VcdkFormButton.prototype,"formTarget",void 0);vcdk_form_button_component_decorate([(0,decorators.MZ)({type:Boolean})],VcdkFormButton.prototype,"disabled",void 0);var class_map=__webpack_require__(3720);var if_defined=__webpack_require__(31);var ref=__webpack_require__(8342);var when=__webpack_require__(302);var html=__webpack_require__(3380);var static_html=__webpack_require__(6526);const buttonStyles=(0,lit.AH)`
  .button {
    --vcdk-system-icon-size: 1.5rem;
    --vcdk-button-border-width: 0px;
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
      backdrop-filter: blur(calc(var(--vcdk-blur-secondary-button, 0) / 2));
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
      --vcdk-system-icon-size: 1.25rem;
      min-height: 2rem;
      padding-inline: var(--vcdk-spacing-4);
    }

    &.size-medium {
      min-height: 2.5rem;
      padding-inline: var(--vcdk-spacing-5);
      .text {
        padding-block: var(--vcdk-spacing-1);
      }
    }

    &.size-large {
      min-height: 3rem;
      padding-inline: var(--vcdk-spacing-6);
      .text {
        padding-block: var(--vcdk-spacing-1);
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
    margin-inline: var(--vcdk-spacing-4);
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
`;var button_component_decorate=undefined&&undefined.__decorate||function(decorators,target,key,desc){var c=arguments.length,r=c<3?target:desc===null?desc=Object.getOwnPropertyDescriptor(target,key):desc,d;if(typeof Reflect==="object"&&typeof Reflect.decorate==="function")r=Reflect.decorate(decorators,target,key,desc);else for(var i=decorators.length-1;i>=0;i--)if(d=decorators[i])r=(c<3?d(r):c>3?d(target,key,r):d(target,key))||r;return c>3&&r&&Object.defineProperty(target,key,r),r};let Button=class Button extends VcdkFormButton{constructor(){super(...arguments);this.buttonEl=(0,ref._)();this.ariaLabel="";this.autofocus=false;this.size="medium";this.fullWidth=false;this.loading=false;this.variant="marketing";this.tabIndex=0;this.title=""}render(){const isLink=!!this.href;const tag=isLink?(0,static_html.eu)`a`:(0,static_html.eu)`button`;return(0,static_html.qy)`
      <${tag}
        ${(0,ref.K)(this.buttonEl)}
        class=${(0,class_map.H)({button:true,[`variant-${this.variant}`]:true,[`size-${this.size}`]:true,fullWidth:this.fullWidth?true:false,loading:this.loading?true:false})}
        part="button"
        tabindex=${this.tabIndex}
        title=${(0,if_defined.J)(this.title)}
        ?disabled=${(0,if_defined.J)(isLink?undefined:this.disabled)}
        ?autofocus=${(0,if_defined.J)(isLink?undefined:this.autofocus)}
        aria-label=${(0,if_defined.J)(this.ariaLabel)}
        aria-disabled=${this.disabled?"true":html.s6}
        href=${(0,if_defined.J)(isLink?this.href:undefined)}
        download=${(0,if_defined.J)(isLink?this.download:undefined)}
        hreflang=${(0,if_defined.J)(isLink?this.hreflang:undefined)}
        ping=${(0,if_defined.J)(isLink?this.ping:undefined)}
        referrerpolicy=${(0,if_defined.J)(isLink?this.referrerpolicy:undefined)}
        rel=${(0,if_defined.J)(isLink?this.rel:undefined)}
        target=${(0,if_defined.J)(isLink?this.target:undefined)}
        type=${(0,if_defined.J)(isLink?undefined:this.type)}
        formaction=${(0,if_defined.J)(isLink?undefined:this.formAction)}
        formenctype=${(0,if_defined.J)(isLink?undefined:this.formEnctype)}
        formmethod=${(0,if_defined.J)(isLink?undefined:this.formMethod)}
        ?formnovalidate=${(0,if_defined.J)(isLink?undefined:this.formNoValidate)}
        formtarget=${(0,if_defined.J)(isLink?undefined:this.formTarget)}
        name=${(0,if_defined.J)(isLink?undefined:this.name)}
        value=${(0,if_defined.J)(isLink?undefined:this.value)}
        @click=${(0,if_defined.J)(isLink?undefined:this.onButtonClick)}
      >
        ${(0,when.z)(this.iconStart,icon=>(0,static_html.qy)`
            <vcdk-system-icon .icon=${icon} class="icon"></vcdk-system-icon>
          `)}
        <div class="text typography-button">
          <slot></slot>
        </div>
        ${(0,when.z)(this.iconEnd,icon=>(0,static_html.qy)`
            <vcdk-system-icon .icon=${icon} class="icon"></vcdk-system-icon>
          `)}
        ${(0,when.z)(this.loading,()=>(0,static_html.qy)`
            <vcdk-spinner class="spinner"></vcdk-spinner>
          `)}
      </${tag}>
    `}};Button.styles=[typography_styles.IT.button,buttonStyles];button_component_decorate([(0,decorators.MZ)({type:String,attribute:"aria-label"})],Button.prototype,"ariaLabel",void 0);button_component_decorate([(0,decorators.MZ)({type:Boolean})],Button.prototype,"autofocus",void 0);button_component_decorate([(0,decorators.MZ)({type:String})],Button.prototype,"size",void 0);button_component_decorate([(0,decorators.MZ)({type:Boolean})],Button.prototype,"fullWidth",void 0);button_component_decorate([(0,decorators.MZ)({type:String})],Button.prototype,"iconEnd",void 0);button_component_decorate([(0,decorators.MZ)({type:String})],Button.prototype,"iconStart",void 0);button_component_decorate([(0,decorators.MZ)({type:Boolean})],Button.prototype,"loading",void 0);button_component_decorate([(0,decorators.MZ)({type:String})],Button.prototype,"variant",void 0);button_component_decorate([(0,decorators.MZ)({type:String})],Button.prototype,"download",void 0);button_component_decorate([(0,decorators.MZ)({type:String})],Button.prototype,"href",void 0);button_component_decorate([(0,decorators.MZ)({type:String})],Button.prototype,"hreflang",void 0);button_component_decorate([(0,decorators.MZ)({type:String})],Button.prototype,"ping",void 0);button_component_decorate([(0,decorators.MZ)({type:String})],Button.prototype,"referrerpolicy",void 0);button_component_decorate([(0,decorators.MZ)({type:String})],Button.prototype,"rel",void 0);button_component_decorate([(0,decorators.MZ)({type:String})],Button.prototype,"target",void 0);button_component_decorate([(0,decorators.MZ)({type:Number})],Button.prototype,"tabIndex",void 0);button_component_decorate([(0,decorators.MZ)()],Button.prototype,"title",void 0);Button=button_component_decorate([(0,custom_element.E)("vcdk-button")],Button)},3018(__unused_webpack___webpack_module__,__unused_webpack___webpack_exports__,__webpack_require__){var typography_styles=__webpack_require__(1669);var responsive_value=__webpack_require__(6591);var breakpoints=__webpack_require__(1089);var lit=__webpack_require__(2618);var isString=__webpack_require__(9703);var isArray=__webpack_require__(2049);const breakpointKeys=Object.keys(breakpoints.f);const suffixWithPxIfUnitless=value=>{if((0,isString.A)(value))return value;return`${value}px`};const toCssVariables=(name,values)=>{if(!values)return;if(!(0,isArray.A)(values)){return{[name]:suffixWithPxIfUnitless(values)}}return values.reduce((current,next,currentIndex)=>{const breakpointKey=breakpointKeys[currentIndex];return{...current,[`${name}-${breakpointKey}`]:suffixWithPxIfUnitless(next)}},{})};const breakpointEntries=Object.entries(breakpoints.f);const responsiveValueToCssVariable=(selector,variableName)=>{const primaryVariable=`\n  ${selector} {\n    ${variableName}: var(${variableName}-xs);\n  }`;const responsiveVariables=Object.entries(breakpoints.f).splice(1).map(([breakpointKey,breakpoint],index)=>{const nextBreakpoint=breakpointEntries[index+2];const fallback=nextBreakpoint?`, var(${variableName}-${nextBreakpoint[0]})`:``;return`\n    @media(min-width: ${breakpoint.from}px) {\n      ${selector} {\n        ${variableName}: var(${variableName}-${breakpointKey} ${fallback});\n      } \n    }`});return(0,lit.iz)([primaryVariable,responsiveVariables].join(""))};var decorators=__webpack_require__(2745);var class_map=__webpack_require__(3720);var style_map=__webpack_require__(1145);var when=__webpack_require__(302);var custom_element=__webpack_require__(6487);var responsive=__webpack_require__(4135);var vcdk_element=__webpack_require__(6486);const skeletonStyles=(0,lit.AH)`
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
    `}};Skeleton.styles=[skeletonStyles,...typography_styles.FB];Skeleton.responsiveProperties={prefix:"vcdk-skeleton",props:["width","height","size","aspectRatio"]};__decorate([(0,decorators.MZ)({attribute:"aspect-ratio",converter:responsive_value.g})],Skeleton.prototype,"aspectRatio",void 0);__decorate([(0,decorators.MZ)({type:Boolean,attribute:"disable-animation"})],Skeleton.prototype,"disableAnimation",void 0);__decorate([(0,decorators.MZ)({converter:responsive_value.g})],Skeleton.prototype,"height",void 0);__decorate([(0,decorators.MZ)({converter:responsive_value.g})],Skeleton.prototype,"size",void 0);__decorate([(0,decorators.MZ)({type:String,attribute:"typography-variant"})],Skeleton.prototype,"typographyVariant",void 0);__decorate([(0,decorators.MZ)({converter:responsive_value.g})],Skeleton.prototype,"width",void 0);__decorate([(0,decorators.MZ)({type:String})],Skeleton.prototype,"variant",void 0);__decorate([(0,decorators.MZ)({type:String,attribute:"element-aria-description"})],Skeleton.prototype,"elementAriaDescription",void 0);Skeleton=__decorate([(0,custom_element.E)("vcdk-skeleton")],Skeleton);var dist=__webpack_require__(7093);var if_defined=__webpack_require__(31);var unsafe_svg=__webpack_require__(8776);var uniqueId=__webpack_require__(5664);const systemIconStyles=(0,lit.AH)`
  .svg {
    max-width: 100%;
    aspect-ratio: 1 / 1;
    flex-shrink: 0;
    color: var(--vcdk-color-icon, inherit);
    width: var(--vcdk-system-icon-size, 1.5rem);
    height: var(--vcdk-system-icon-size, 1.5rem);
    min-width: var(--vcdk-system-icon-size, 1.5rem);
    min-height: var(--vcdk-system-icon-size, 1.5rem);
  }
`;var task=__webpack_require__(582);function createSvgAssetIconTask(host,getArgs){return new task.YZ(host,{task:async([icon,filled,brand,loading])=>{if(!icon)return"";if(loading==="lazy"){await new Promise(resolve=>{const observer=new IntersectionObserver(entries=>{if(entries.some(entry=>entry.isIntersecting)){observer.disconnect();resolve()}});observer.observe(host)})}const url=(0,dist.QK)({type:filled?"filled":"lined",brand,iconId:icon});try{return await(0,dist.Dc)(url)}catch(error){console.error(`Failed when loading icon id: "${String(icon)}". ${String(error)}`);throw error}},args:getArgs})}var system_icon_component_decorate=undefined&&undefined.__decorate||function(decorators,target,key,desc){var c=arguments.length,r=c<3?target:desc===null?desc=Object.getOwnPropertyDescriptor(target,key):desc,d;if(typeof Reflect==="object"&&typeof Reflect.decorate==="function")r=Reflect.decorate(decorators,target,key,desc);else for(var i=decorators.length-1;i>=0;i--)if(d=decorators[i])r=(c<3?d(r):c>3?d(target,key,r):d(target,key))||r;return c>3&&r&&Object.defineProperty(target,key,r),r};let SystemIcon=class SystemIcon extends vcdk_element.l{constructor(){super(...arguments);this.elementRole="presentation";this.elementAriaHidden=null;this.loading=dist.W0.loading;this.assetsTask=createSvgAssetIconTask(this,()=>[this.icon,this.filled,this.currentIconSet,this.loading])}get sizeUnit(){return`${this.size?this.size+"px":"var(--vcdk-system-icon-size, 24px)"}`}render(){return this.assetsTask.render({pending:()=>(0,lit.qy)`
        <div style="width:${this.sizeUnit};height:${this.sizeUnit}"></div>
      `,complete:markup=>this.svgTemplate(markup),error:()=>(0,lit.qy)`
        <div style="width:${this.sizeUnit};height:${this.sizeUnit}"></div>
      `})}svgTemplate(svgContent){const titleId=this.elementTitle?this.elementAriaLabelledBy||(0,uniqueId.A)("svg-title-"):undefined;const descId=this.description?this.elementAriaDescribedBy||(0,uniqueId.A)("svg-description-"):undefined;return(0,lit.JW)`
      <svg
        class="svg"
        part="svg"
        focusable="false"
        role=${(0,if_defined.J)(this.elementRole)}
        aria-labelledby=${(0,if_defined.J)(titleId)}
        aria-describedby=${(0,if_defined.J)(descId)}
        aria-hidden=${(0,if_defined.J)(this.elementAriaHidden)}
        style=${(0,if_defined.J)(this.size?`--vcdk-system-icon-size: ${this.size}px;`:lit.s6)}>
        ${this.elementTitle?(0,lit.JW)`<title id="${titleId}">${this.elementTitle}</title>`:lit.s6}
        ${this.description?(0,lit.JW)`<desc id="${descId}">${this.description}</desc>`:lit.s6}
        ${(0,unsafe_svg.T)(svgContent)}
      </svg>
    `}};SystemIcon.styles=[systemIconStyles];system_icon_component_decorate([(0,decorators.MZ)({type:Boolean})],SystemIcon.prototype,"filled",void 0);system_icon_component_decorate([(0,decorators.MZ)({type:String})],SystemIcon.prototype,"icon",void 0);system_icon_component_decorate([(0,decorators.MZ)({type:Number})],SystemIcon.prototype,"size",void 0);system_icon_component_decorate([(0,decorators.MZ)({type:String,attribute:"element-aria-labelledby"})],SystemIcon.prototype,"elementAriaLabelledBy",void 0);system_icon_component_decorate([(0,decorators.MZ)({type:String,attribute:"element-title"})],SystemIcon.prototype,"elementTitle",void 0);system_icon_component_decorate([(0,decorators.MZ)({type:String,attribute:"element-aria-describedby"})],SystemIcon.prototype,"elementAriaDescribedBy",void 0);system_icon_component_decorate([(0,decorators.MZ)({type:String})],SystemIcon.prototype,"description",void 0);system_icon_component_decorate([(0,decorators.MZ)({type:String,attribute:"element-role"})],SystemIcon.prototype,"elementRole",void 0);system_icon_component_decorate([(0,decorators.MZ)({type:String,attribute:"element-aria-hidden"})],SystemIcon.prototype,"elementAriaHidden",void 0);system_icon_component_decorate([(0,decorators.MZ)({type:String})],SystemIcon.prototype,"loading",void 0);SystemIcon=system_icon_component_decorate([(0,custom_element.E)("vcdk-system-icon")],SystemIcon)},1669(__unused_webpack___webpack_module__,__webpack_exports__,__webpack_require__){__webpack_require__.d(__webpack_exports__,{FB:()=>allTypographyClasses,IT:()=>typographyClasses,UN:()=>getTypographyValues});var _volvo_vcdk_tokens_dist_web_global_breakpoints_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(1089);var lit__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__(2618);var lodash_es__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__(2326);const typographyStyles=(0,lit__WEBPACK_IMPORTED_MODULE_1__.AH)`
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
    `;return classes},{});const allTypographyClasses=Object.values(typographyClasses);const getTypographyValues=(variant,property)=>{const tokenProperty=property==="font-size"?"size":property;const kebabVariant=(0,lodash_es__WEBPACK_IMPORTED_MODULE_2__.A)(variant);return[`var(--vcdk-typography-${kebabVariant}-${tokenProperty}-small-screens)`,`var(--vcdk-typography-${kebabVariant}-${tokenProperty}-large-screens)`]}},6591(__unused_webpack___webpack_module__,__webpack_exports__,__webpack_require__){__webpack_require__.d(__webpack_exports__,{g:()=>responsiveValueConverter});var breakpoints;var _volvo_vcdk_tokens_dist_web_global_breakpoints_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(1089);var lit__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__(2618);const responsiveValueConverter={fromAttribute(value,type){if(!value){return null}if(value.startsWith("[")&&value.endsWith("]")){return JSON.parse(value)}if(typeof type==="undefined"){const number=Number(value);if(!Number.isNaN(number)){return number}}return lit__WEBPACK_IMPORTED_MODULE_1__.W3.fromAttribute?.(value,type)},toAttribute(value,type){if(Array.isArray(value)){return lit__WEBPACK_IMPORTED_MODULE_1__.W3.toAttribute?.(value,Array)}return lit__WEBPACK_IMPORTED_MODULE_1__.W3.toAttribute?.(value,type)}};const valueInBreakpoint=(value,breakpoint)=>{const values=Array.isArray(value)?value:[value];const breakpointIndex=Object.keys(breakpoints).indexOf(breakpoint);const currentValueIndex=Math.min(values.length-1,breakpointIndex);return values[currentValueIndex]}},6486(__unused_webpack___webpack_module__,__webpack_exports__,__webpack_require__){__webpack_require__.d(__webpack_exports__,{l:()=>VcdkElement});var context=__webpack_require__(767);const themes=null&&["volvo-light","volvo-dark","mack-light","mack-dark","renault-light","renault-dark"];const brands=["volvo","mack","renault"];const iconSets=null&&["volvo","mack","renault","generic","vtna","prevost"];const colorSchemes=null&&["light","dark"];function reverseTheme(themeId){if(themeId.includes("light")){return themeId.replace("light","dark")}return themeId.replace("dark","light")}function darkTheme(themeId){if(themeId.includes("dark")){return themeId}return reverseTheme(themeId)}var lit=__webpack_require__(2618);var decorators=__webpack_require__(2745);var noop=__webpack_require__(2302);const themeContext=(0,context.q6)(Symbol("vcdk-theme"));if(typeof document!=="undefined"){const root=new context.aU;const attach=()=>root.attach(document.body);if(document.body){attach()}else{document.addEventListener("DOMContentLoaded",attach)}}const normalize=(0,lit.AH)`
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
`;var __decorate=undefined&&undefined.__decorate||function(decorators,target,key,desc){var c=arguments.length,r=c<3?target:desc===null?desc=Object.getOwnPropertyDescriptor(target,key):desc,d;if(typeof Reflect==="object"&&typeof Reflect.decorate==="function")r=Reflect.decorate(decorators,target,key,desc);else for(var i=decorators.length-1;i>=0;i--)if(d=decorators[i])r=(c<3?d(r):c>3?d(target,key,r):d(target,key))||r;return c>3&&r&&Object.defineProperty(target,key,r),r};class VcdkElement extends lit.WF{constructor(){super(...arguments);this.isThemeProvider=false;this.themeProvider=undefined;this.themeConsumer=new context.G(this,{context:themeContext,subscribe:true,callback:()=>{this.handleTheming()}})}static get defaultLocale(){if(typeof document!=="undefined"&&document.documentElement.lang){return document.documentElement.lang}if(typeof window!=="undefined"){return window.navigator.language}return"en-US"}get currentTheme(){let themeId=this.themeId??this.contextTheme??VcdkElement.defaultTheme;if(this.invertTheme){themeId=reverseTheme(themeId)}return themeId}get contextTheme(){return this.themeConsumer?.value?.themeId}get contextIconSet(){return this.themeConsumer?.value?.iconSet}get currentIconSet(){if(this.iconSet!==undefined&&this.iconSet!=="auto"){return this.iconSet}if(this.contextIconSet!==undefined){return this.contextIconSet}return this.brandId}get brandId(){return this.currentTheme?.split("-")[0]}get colorSchemeId(){return this.currentTheme?.split("-")[1]}themeChanged(){(0,noop.A)()}update(changedProperties){if(changedProperties.has("themeId")||changedProperties.has("invertTheme")||changedProperties.has("iconSet")){this.handleTheming()}super.update(changedProperties)}handleTheming(){const hasThemeChange=this.currentTheme!==this.contextTheme;const shouldProvideIconSet=this.iconSet!==undefined&&this.iconSet!=="auto";if(hasThemeChange||shouldProvideIconSet){const effectiveIconSet=this.iconSet!==undefined&&this.iconSet!=="auto"?this.iconSet:this.contextIconSet;if(!this.isThemeProvider){this.isThemeProvider=true;this.themeProvider=new context.DT(this,{context:themeContext,initialValue:{themeId:this.currentTheme,iconSet:effectiveIconSet}})}else{this.themeProvider?.setValue({themeId:this.currentTheme,iconSet:effectiveIconSet})}this.setThemeCssClasses();this.themeChanged();return}if(this.isThemeProvider&&this.themeProvider){this.isThemeProvider=false;this.removeController(this.themeProvider);this.themeProvider=undefined;this.setThemeCssClasses();this.themeChanged()}}setThemeCssClasses(){const isDifferentTheme=this.currentTheme!==this.contextTheme;for(const brand of brands){this.classList.toggle(`vcdk-theme-${brand}`,isDifferentTheme&&this.brandId===brand)}this.classList.toggle("vcdk-mode-dark",isDifferentTheme&&this.colorSchemeId==="dark")}static finalizeStyles(styles){if(!styles){return lit.WF.finalizeStyles(normalize)}if(Array.isArray(styles)){styles.unshift(normalize);return lit.WF.finalizeStyles(styles)}return lit.WF.finalizeStyles([normalize,styles])}}VcdkElement.version="10.15.0";VcdkElement.defaultTheme="volvo-light";__decorate([(0,decorators.MZ)({type:String,reflect:true})],VcdkElement.prototype,"themeId",void 0);__decorate([(0,decorators.MZ)({type:Boolean,attribute:"invert-theme",reflect:true})],VcdkElement.prototype,"invertTheme",void 0);__decorate([(0,decorators.MZ)({type:String,attribute:"icon-set"})],VcdkElement.prototype,"iconSet",void 0)},1089(__unused_webpack___webpack_module__,__webpack_exports__,__webpack_require__){__webpack_require__.d(__webpack_exports__,{f:()=>breakpoints});const breakpoints={xs:{from:0,to:599.98},sm:{from:600,to:904.98},md:{from:905,to:1239.98},lg:{from:1240,to:1439.98},xl:{from:1440,to:15360}}}}]);
//# sourceMappingURL=vcdk.js.map