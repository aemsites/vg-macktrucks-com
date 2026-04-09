"use strict";(self.webpackChunkmacktrucks=self.webpackChunkmacktrucks||[]).push([[325],{6487(e,t,r){r.d(t,{E:()=>i});const i=e=>(t,r)=>{const i=()=>{const r=customElements.get(e);if(!r)return void customElements.define(e,t);const i=r.version,o=t.version;i&&o&&i!==o&&console.warn(`vcdk warning: Attempted to register <${e}>v, but <${e}>v. was already registered. This could indicate that your application might contain duplicate instances of the same component.`)};r?r.addInitializer(i):i()}},4135(e,t,r){r.d(t,{F:()=>d});var i=r(1089),o=r(2618),a=r(2326),s=r(6486);const n=Object.keys(i.f),d=e=>class extends e{static fallbackVariableValue(e,t,r){if(!r.length)return"";const i=r.shift();return r.length?`var(--${e}-${t}-${i}, ${this.fallbackVariableValue(e,t,r)})`:`var(--${e}-${t}-${i})`}static responsiveVariables(e,t,r,i){return t.map(t=>{const o=(0,a.A)(t);return i?`\n    --${e}-${o}-fallback: ${this.fallbackVariableValue(e,o,[...i])};\n    --${e}-${o}: var(--${e}-${o}-${r}, var(--${e}-${o}-fallback));`:`\n    --${e}-${o}: var(--${e}-${o}-${r});`}).join("")}static responsiveStyles(e){return o.AH`
        :host {
          ${(0,o.iz)(this.responsiveVariables(e.prefix,e.props,"xs"))}
        }
        @media(min-width: ${i.f.sm.from}px) {
          :host {
            ${(0,o.iz)(this.responsiveVariables(e.prefix,e.props,"sm",["xs"]))}
          }
        }
        @media (min-width: ${i.f.md.from}px) {
          :host {
            ${(0,o.iz)(this.responsiveVariables(e.prefix,e.props,"md",["sm","xs"]))}
          }
        }
        @media (min-width: ${i.f.lg.from}px) {
          :host {
            ${(0,o.iz)(this.responsiveVariables(e.prefix,e.props,"lg",["md","sm","xs"]))}
          }
        }
        @media (min-width: ${i.f.xl.from}px) {
          :host {
            ${(0,o.iz)(this.responsiveVariables(e.prefix,e.props,"xl",["lg","md","sm","xs"]))}
          }
        }
      }`}static finalizeStyles(e){if(!this.responsiveProperties)return s.l.finalizeStyles(e);const t=[this.responsiveStyles(this.responsiveProperties)];return e&&Array.isArray(e)?t.push(...e):e&&t.push(e),s.l.finalizeStyles(t)}connectedCallback(){super.connectedCallback(),this.setResponsiveVariables()}update(e){const t=this.constructor.responsiveProperties,r=t?.props;t&&r.some(t=>e.has(t))&&this.setResponsiveVariables(),super.update(e)}setResponsiveVariables(){const e=this.constructor.responsiveProperties;if(void 0===e)return;const t=e.props;for(const r of t){let t=this[r];if(t){Array.isArray(t)||(t=[t]);for(let i=0;i<t.length;i++){const o=String(r);let s=t[i];if(e.styleTransform&&(s=e.styleTransform(o,n[i],s)),void 0===s)continue;"number"==typeof s&&(s=`${s}px`);const d=n[i];this.style.setProperty(`--${e.prefix}-${(0,a.A)(o)}-${d}`,s)}}}}}},7909(e,t,r){r(3018);var i=r(1669),o=r(2618),a=r(2745),s=r(3720),n=r(31),d=r(302),c=r(6487),l=r(6486);const p=o.AH`
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
`;var h=function(e,t,r,i){var o,a=arguments.length,s=a<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,r):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,r,i);else for(var n=e.length-1;n>=0;n--)(o=e[n])&&(s=(a<3?o(s):a>3?o(t,r,s):o(t,r))||s);return a>3&&s&&Object.defineProperty(t,r,s),s};const v=(e,t,r)=>o.qy`
  <slot name="summary-start">
    ${(0,d.z)(r,()=>o.qy`
        <vcdk-system-icon icon=${(0,n.J)(r)}></vcdk-system-icon>
      `)}
  </slot>
  <slot
    name="title"
    class=${(0,s.H)({title:!0,"typography-subtitle1":"large"===t,"typography-subtitle2":"small"===t})}>
    ${e}
  </slot>
  <slot name="summary-end"></slot>
  <vcdk-system-icon class="chevron" icon=${"chevron-down"}></vcdk-system-icon>
`;class y extends CustomEvent{constructor(e){super(y.eventName,{detail:e,bubbles:!0,composed:!0,cancelable:!0})}}y.eventName="vcdk-toggle";let u=class extends l.l{constructor(){super(...arguments),this.headerTitle="",this.open=!1,this.disabled=!1,this.tabIndex=0,this.size="large",this._toggleEvent=e=>{const t="open"===e.newState;t!==this.open&&(this.open=t,this.dispatchEvent(new y({open:t})))}}render(){const{headerTitle:e,headerIcon:t,size:r}=this;return this.disabled?o.qy`
        <div class="details">
          <button disabled class="disabled-button" aria-expanded="false">
            ${v(e,r,t)}
          </button>
        </div>
      `:o.qy`
      <details @toggle=${this._toggleEvent} ?open=${this.open} part="details">
        <summary
          id="accordionID"
          part="summary"
          tabindex=${this.tabIndex}
          aria-controls="accordionSectionID"
          aria-expanded=${this.open&&!this.disabled?"true":"false"}>
          ${v(e,r,t)}
        </summary>
        <slot
          part="content"
          class=${(0,s.H)({content:!0,"typography-caption1":"small"===r})}
          role="region"
          id="accordionSectionID"
          aria-labelledby="accordionID"></slot>
      </details>
    `}};u.styles=[i.IT.subtitle1,i.IT.subtitle2,i.IT.caption1,p],h([(0,a.MZ)({type:String})],u.prototype,"headerTitle",void 0),h([(0,a.MZ)({type:String})],u.prototype,"headerIcon",void 0),h([(0,a.MZ)({type:Boolean,reflect:!0})],u.prototype,"open",void 0),h([(0,a.MZ)({type:Boolean,reflect:!0})],u.prototype,"disabled",void 0),h([(0,a.MZ)({type:Number})],u.prototype,"tabIndex",void 0),h([(0,a.MZ)({type:String,reflect:!0})],u.prototype,"size",void 0),u=h([(0,c.E)("vcdk-accordion")],u)},1975(e,t,r){var i=r(6591),o=r(2618),a=r(2745),s=r(1145),n=r(6487),d=r(4135),c=r(6486);const l=o.AH`
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
`;var p=function(e,t,r,i){var o,a=arguments.length,s=a<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,r):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,r,i);else for(var n=e.length-1;n>=0;n--)(o=e[n])&&(s=(a<3?o(s):a>3?o(t,r,s):o(t,r))||s);return a>3&&s&&Object.defineProperty(t,r,s),s};let h=class extends((0,d.F)(c.l)){render(){return void 0===this.progress?o.JW`
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
      </svg>`:o.JW`
      <svg
        part="svg"
        viewBox="20 20 40 40"
        role="progressbar"
        aria-busy="true"
        aria-live="polite"
        aria-label="${this.elementAriaLabel}"
        style=${(0,s.W)({"--vcdk-spinner-progress":"number"==typeof this.progress?this.progress+"%":void 0})}>
          <circle
            cx="40"
            cy="40"
            r="18"
            fill="none" />     
      </svg>
    `}};h.styles=[l],h.responsiveProperties={prefix:"vcdk-spinner",props:["size"],styleTransform:(e,t,r)=>{if("size"===e&&"string"==typeof r)switch(r){case"small":return 18;case"large":return 80;default:return 38}return r}},p([(0,a.MZ)({type:Number})],h.prototype,"progress",void 0),p([(0,a.MZ)({converter:i.g})],h.prototype,"size",void 0),p([(0,a.MZ)({type:String,attribute:"element-aria-label"})],h.prototype,"elementAriaLabel",void 0),h=p([(0,n.E)("vcdk-spinner")],h),r(3018);var v=r(1669),y=r(5905),u=function(e,t,r,i){var o,a=arguments.length,s=a<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,r):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,r,i);else for(var n=e.length-1;n>=0;n--)(o=e[n])&&(s=(a<3?o(s):a>3?o(t,r,s):o(t,r))||s);return a>3&&s&&Object.defineProperty(t,r,s),s};class m extends c.l{constructor(){super(),this.type="button",this.formNoValidate=!1,this.disabled=!1,this.customStates={set:(e,t)=>{this.internals?.states&&(t?this.internals.states.add(e):this.internals.states.delete(e))},has:e=>!!this.internals?.states&&this.internals.states.has(e)},this.onButtonClick=e=>{if(this.disabled)return e.preventDefault(),void e.stopPropagation();this.internals&&setTimeout(()=>{if(!e.defaultPrevented&&this.internals&&("submit"===this.type&&this.name&&this.internals.setFormValue(this.value??null),"submit"===this.type||"reset"===this.type)){const e=(e=>{const t=document.createElement("button"),r=["type","formAction","formEnctype","formMethod","formNoValidate","formTarget"];return Object.assign(t,(0,y.A)(e,(e,t)=>!!r.includes(t)&&void 0!==e)),Object.assign(t.style,{position:"absolute !important",width:"0 !important",height:"0 !important",clipPath:"inset(50%) !important",overflow:"hidden !important",whiteSpace:"nowrap !important"}),t})(this);try{this.internals.form?.appendChild(e),e.click()}finally{e.remove(),"submit"===this.type&&this.name&&this.internals.setFormValue(null)}}},0)};try{this.internals=this.attachInternals()}catch{console.warn("ElementInternals API is not supported in this browser. A polyfill may be required.")}}update(e){super.update(e),this.setCustomStates()}setCustomStates(){this.customStates.set("disabled",this.disabled)}formDisabledCallback(e){this.disabled=e}formResetCallback(){}formAssociatedCallback(){}click(){this.buttonEl.value?.click()}}m.shadowRootOptions={...c.l.shadowRootOptions,delegatesFocus:!0},m.formAssociated=!0,u([(0,a.MZ)({type:String,reflect:!0})],m.prototype,"type",void 0),u([(0,a.MZ)({type:String,reflect:!0})],m.prototype,"name",void 0),u([(0,a.MZ)({type:String})],m.prototype,"value",void 0),u([(0,a.MZ)({type:String})],m.prototype,"form",void 0),u([(0,a.MZ)({type:String})],m.prototype,"formAction",void 0),u([(0,a.MZ)({type:String,attribute:"formenctype"})],m.prototype,"formEnctype",void 0),u([(0,a.MZ)({type:String,attribute:"formmethod"})],m.prototype,"formMethod",void 0),u([(0,a.MZ)({type:Boolean,attribute:"formnovalidate"})],m.prototype,"formNoValidate",void 0),u([(0,a.MZ)({type:String,attribute:"formtarget"})],m.prototype,"formTarget",void 0),u([(0,a.MZ)({type:Boolean})],m.prototype,"disabled",void 0);var g=r(3720),b=r(31),f=r(8342),k=r(302),$=r(3380),x=r(6526);const w=o.AH`
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
`;var z=function(e,t,r,i){var o,a=arguments.length,s=a<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,r):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,r,i);else for(var n=e.length-1;n>=0;n--)(o=e[n])&&(s=(a<3?o(s):a>3?o(t,r,s):o(t,r))||s);return a>3&&s&&Object.defineProperty(t,r,s),s};let S=class extends m{constructor(){super(...arguments),this.buttonEl=(0,f._)(),this.ariaLabel="",this.autofocus=!1,this.size="medium",this.fullWidth=!1,this.loading=!1,this.variant="marketing",this.tabIndex=0,this.title=""}render(){const e=!!this.href,t=e?x.eu`a`:x.eu`button`;return x.qy`
      <${t}
        ${(0,f.K)(this.buttonEl)}
        class=${(0,g.H)({button:!0,[`variant-${this.variant}`]:!0,[`size-${this.size}`]:!0,fullWidth:!!this.fullWidth,loading:!!this.loading})}
        part="button"
        tabindex=${this.tabIndex}
        title=${(0,b.J)(this.title)}
        ?disabled=${(0,b.J)(e?void 0:this.disabled)}
        ?autofocus=${(0,b.J)(e?void 0:this.autofocus)}
        aria-label=${(0,b.J)(this.ariaLabel)}
        aria-disabled=${this.disabled?"true":$.s6}
        href=${(0,b.J)(e?this.href:void 0)}
        download=${(0,b.J)(e?this.download:void 0)}
        hreflang=${(0,b.J)(e?this.hreflang:void 0)}
        ping=${(0,b.J)(e?this.ping:void 0)}
        referrerpolicy=${(0,b.J)(e?this.referrerpolicy:void 0)}
        rel=${(0,b.J)(e?this.rel:void 0)}
        target=${(0,b.J)(e?this.target:void 0)}
        type=${(0,b.J)(e?void 0:this.type)}
        formaction=${(0,b.J)(e?void 0:this.formAction)}
        formenctype=${(0,b.J)(e?void 0:this.formEnctype)}
        formmethod=${(0,b.J)(e?void 0:this.formMethod)}
        ?formnovalidate=${(0,b.J)(e?void 0:this.formNoValidate)}
        formtarget=${(0,b.J)(e?void 0:this.formTarget)}
        name=${(0,b.J)(e?void 0:this.name)}
        value=${(0,b.J)(e?void 0:this.value)}
        @click=${(0,b.J)(e?void 0:this.onButtonClick)}
      >
        ${(0,k.z)(this.iconStart,e=>x.qy`
            <vcdk-system-icon .icon=${e} class="icon"></vcdk-system-icon>
          `)}
        <div class="text typography-button">
          <slot></slot>
        </div>
        ${(0,k.z)(this.iconEnd,e=>x.qy`
            <vcdk-system-icon .icon=${e} class="icon"></vcdk-system-icon>
          `)}
        ${(0,k.z)(this.loading,()=>x.qy`
            <vcdk-spinner class="spinner"></vcdk-spinner>
          `)}
      </${t}>
    `}};S.styles=[v.IT.button,w],z([(0,a.MZ)({type:String,attribute:"aria-label"})],S.prototype,"ariaLabel",void 0),z([(0,a.MZ)({type:Boolean})],S.prototype,"autofocus",void 0),z([(0,a.MZ)({type:String})],S.prototype,"size",void 0),z([(0,a.MZ)({type:Boolean})],S.prototype,"fullWidth",void 0),z([(0,a.MZ)({type:String})],S.prototype,"iconEnd",void 0),z([(0,a.MZ)({type:String})],S.prototype,"iconStart",void 0),z([(0,a.MZ)({type:Boolean})],S.prototype,"loading",void 0),z([(0,a.MZ)({type:String})],S.prototype,"variant",void 0),z([(0,a.MZ)({type:String})],S.prototype,"download",void 0),z([(0,a.MZ)({type:String})],S.prototype,"href",void 0),z([(0,a.MZ)({type:String})],S.prototype,"hreflang",void 0),z([(0,a.MZ)({type:String})],S.prototype,"ping",void 0),z([(0,a.MZ)({type:String})],S.prototype,"referrerpolicy",void 0),z([(0,a.MZ)({type:String})],S.prototype,"rel",void 0),z([(0,a.MZ)({type:String})],S.prototype,"target",void 0),z([(0,a.MZ)({type:Number})],S.prototype,"tabIndex",void 0),z([(0,a.MZ)()],S.prototype,"title",void 0),S=z([(0,n.E)("vcdk-button")],S)},3018(e,t,r){var i=r(1669),o=r(6591),a=r(1089),s=r(2618),n=r(9703),d=r(2049);const c=Object.keys(a.f),l=e=>(0,n.A)(e)?e:`${e}px`,p=(e,t)=>{if(t)return(0,d.A)(t)?t.reduce((t,r,i)=>{const o=c[i];return{...t,[`${e}-${o}`]:l(r)}},{}):{[e]:l(t)}},h=Object.entries(a.f),v=(e,t)=>{const r=`\n  ${e} {\n    ${t}: var(${t}-xs);\n  }`,i=Object.entries(a.f).splice(1).map(([r,i],o)=>{const a=h[o+2],s=a?`, var(${t}-${a[0]})`:"";return`\n    @media(min-width: ${i.from}px) {\n      ${e} {\n        ${t}: var(${t}-${r} ${s});\n      } \n    }`});return(0,s.iz)([r,i].join(""))};var y=r(2745),u=r(3720),m=r(1145),g=r(302),b=r(6487),f=r(4135),k=r(6486);const $=s.AH`
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

  ${v(".skeleton[class*='typography-'].variant-typography","--vcdk-skeleton-line-height")}
  ${v(".skeleton[class*='typography-'].variant-typography","--vcdk-skeleton-font-size")}

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
`;var x=function(e,t,r,i){var o,a=arguments.length,s=a<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,r):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,r,i);else for(var n=e.length-1;n>=0;n--)(o=e[n])&&(s=(a<3?o(s):a>3?o(t,r,s):o(t,r))||s);return a>3&&s&&Object.defineProperty(t,r,s),s};let w=class extends((0,f.F)(k.l)){constructor(){super(...arguments),this.disableAnimation=!1,this.typographyVariant="body",this.variant="typography",this.elementAriaDescription=null}get cssVariables(){return{...this.typographyVariant&&p("--vcdk-skeleton-line-height",(0,i.UN)(this.typographyVariant,"line-height")),...this.typographyVariant&&p("--vcdk-skeleton-font-size",(0,i.UN)(this.typographyVariant,"font-size"))}}render(){return s.qy`
      <div
        class=${(0,u.H)({skeleton:1,"disable-animation":!!this.disableAnimation,"aspect-ratio":!!this.aspectRatio,[`typography-${this.typographyVariant}`]:!!this.typographyVariant,[`variant-${this.variant}`]:1})}
        style=${(0,m.W)(this.cssVariables)}>
        ${(0,g.z)(this.elementAriaDescription,()=>s.qy`
            <div class="hidden">${this.elementAriaDescription}</div>
          `)}
        <slot aria-hidden="true"></slot>
      </div>
    `}};w.styles=[$,...i.FB],w.responsiveProperties={prefix:"vcdk-skeleton",props:["width","height","size","aspectRatio"]},x([(0,y.MZ)({attribute:"aspect-ratio",converter:o.g})],w.prototype,"aspectRatio",void 0),x([(0,y.MZ)({type:Boolean,attribute:"disable-animation"})],w.prototype,"disableAnimation",void 0),x([(0,y.MZ)({converter:o.g})],w.prototype,"height",void 0),x([(0,y.MZ)({converter:o.g})],w.prototype,"size",void 0),x([(0,y.MZ)({type:String,attribute:"typography-variant"})],w.prototype,"typographyVariant",void 0),x([(0,y.MZ)({converter:o.g})],w.prototype,"width",void 0),x([(0,y.MZ)({type:String})],w.prototype,"variant",void 0),x([(0,y.MZ)({type:String,attribute:"element-aria-description"})],w.prototype,"elementAriaDescription",void 0),w=x([(0,b.E)("vcdk-skeleton")],w);var z=r(7093),S=r(31),M=r(8776),A=r(5664);const Z=s.AH`
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
`;var T=r(582),I=function(e,t,r,i){var o,a=arguments.length,s=a<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,r):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,r,i);else for(var n=e.length-1;n>=0;n--)(o=e[n])&&(s=(a<3?o(s):a>3?o(t,r,s):o(t,r))||s);return a>3&&s&&Object.defineProperty(t,r,s),s};let P=class extends k.l{constructor(){var e,t;super(...arguments),this.elementRole="presentation",this.elementAriaHidden=null,this.loading=z.W0.loading,this.assetsTask=(e=this,t=()=>[this.icon,this.filled,this.currentIconSet,this.loading],new T.YZ(e,{task:async([t,r,i,o])=>{if(!t)return"";"lazy"===o&&await new Promise(t=>{const r=new IntersectionObserver(e=>{e.some(e=>e.isIntersecting)&&(r.disconnect(),t())});r.observe(e)});const a=(0,z.QK)({type:r?"filled":"lined",brand:i,iconId:t});try{return await(0,z.Dc)(a)}catch(e){throw console.error(`Failed when loading icon id: "${String(t)}". ${String(e)}`),e}},args:t}))}get sizeUnit(){return this.size?this.size+"px":"var(--vcdk-system-icon-size, 24px)"}render(){return this.assetsTask.render({pending:()=>s.qy`
        <div style="width:${this.sizeUnit};height:${this.sizeUnit}"></div>
      `,complete:e=>this.svgTemplate(e),error:()=>s.qy`
        <div style="width:${this.sizeUnit};height:${this.sizeUnit}"></div>
      `})}svgTemplate(e){const t=this.elementTitle?this.elementAriaLabelledBy||(0,A.A)("svg-title-"):void 0,r=this.description?this.elementAriaDescribedBy||(0,A.A)("svg-description-"):void 0;return s.JW`
      <svg
        class="svg"
        part="svg"
        focusable="false"
        role=${(0,S.J)(this.elementRole)}
        aria-labelledby=${(0,S.J)(t)}
        aria-describedby=${(0,S.J)(r)}
        aria-hidden=${(0,S.J)(this.elementAriaHidden)}
        style=${(0,S.J)(this.size?`--vcdk-system-icon-size: ${this.size}px;`:s.s6)}>
        ${this.elementTitle?s.JW`<title id="${t}">${this.elementTitle}</title>`:s.s6}
        ${this.description?s.JW`<desc id="${r}">${this.description}</desc>`:s.s6}
        ${(0,M.T)(e)}
      </svg>
    `}};P.styles=[Z],I([(0,y.MZ)({type:Boolean})],P.prototype,"filled",void 0),I([(0,y.MZ)({type:String})],P.prototype,"icon",void 0),I([(0,y.MZ)({type:Number})],P.prototype,"size",void 0),I([(0,y.MZ)({type:String,attribute:"element-aria-labelledby"})],P.prototype,"elementAriaLabelledBy",void 0),I([(0,y.MZ)({type:String,attribute:"element-title"})],P.prototype,"elementTitle",void 0),I([(0,y.MZ)({type:String,attribute:"element-aria-describedby"})],P.prototype,"elementAriaDescribedBy",void 0),I([(0,y.MZ)({type:String})],P.prototype,"description",void 0),I([(0,y.MZ)({type:String,attribute:"element-role"})],P.prototype,"elementRole",void 0),I([(0,y.MZ)({type:String,attribute:"element-aria-hidden"})],P.prototype,"elementAriaHidden",void 0),I([(0,y.MZ)({type:String})],P.prototype,"loading",void 0),P=I([(0,b.E)("vcdk-system-icon")],P)},1669(e,t,r){r.d(t,{FB:()=>d,IT:()=>n,UN:()=>c});var i=r(1089),o=r(2618),a=r(2326);o.AH`
  slot {
    display: inline;
    font-synthesis: none;
    margin: 0;
  }

  ::slotted(*) {
    font-synthesis: none;
    margin: 0;
  }
`;const s=(e,t="small")=>{const r=(0,a.A)(e);return o.AH`
    font-family: var(
      --vcdk-typography-${(0,o.iz)(r)}-font-family-${(0,o.iz)(t)}-screens
    );
    font-size: var(
      --vcdk-typography-${(0,o.iz)(r)}-size-${(0,o.iz)(t)}-screens
    );
    line-height: var(
      --vcdk-typography-${(0,o.iz)(r)}-line-height-${(0,o.iz)(t)}-screens
    );
    letter-spacing: var(
      --vcdk-typography-${(0,o.iz)(r)}-letter-spacing-${(0,o.iz)(t)}-screens
    );
    font-weight: var(
      --vcdk-typography-${(0,o.iz)(r)}-weight-${(0,o.iz)(t)}-screens
    );
  `},n=["display-statement","display1","display2","heading1","heading2","heading3","heading4","subtitle1","subtitle2","large-body","body","button","caption1","caption2"].reduce((e,t)=>(e[t]=o.AH`
      .typography-${(0,o.iz)(t)},
        .typography-${(0,o.iz)(t)}
        ::slotted(*) {
        ${s(t,"small")}
      }
      @media (min-width: ${i.f.md.from}px) {
        .typography-${(0,o.iz)(t)},
          .typography-${(0,o.iz)(t)}
          ::slotted(*) {
          ${s(t,"large")}
        }
      }
    `,e),{}),d=Object.values(n),c=(e,t)=>{const r="font-size"===t?"size":t,i=(0,a.A)(e);return[`var(--vcdk-typography-${i}-${r}-small-screens)`,`var(--vcdk-typography-${i}-${r}-large-screens)`]}},6591(e,t,r){r.d(t,{g:()=>o}),r(1089);var i=r(2618);const o={fromAttribute(e,t){if(!e)return null;if(e.startsWith("[")&&e.endsWith("]"))return JSON.parse(e);if(void 0===t){const t=Number(e);if(!Number.isNaN(t))return t}return i.W3.fromAttribute?.(e,t)},toAttribute:(e,t)=>Array.isArray(e)?i.W3.toAttribute?.(e,Array):i.W3.toAttribute?.(e,t)}},6486(e,t,r){r.d(t,{l:()=>p});var i=r(767);const o=["volvo","mack","renault"];var a=r(2618),s=r(2745),n=r(2302);const d=(0,i.q6)(Symbol("vcdk-theme"));if("undefined"!=typeof document){const e=new i.aU,t=()=>e.attach(document.body);document.body?t():document.addEventListener("DOMContentLoaded",t)}const c=a.AH`
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
`;var l=function(e,t,r,i){var o,a=arguments.length,s=a<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,r):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,r,i);else for(var n=e.length-1;n>=0;n--)(o=e[n])&&(s=(a<3?o(s):a>3?o(t,r,s):o(t,r))||s);return a>3&&s&&Object.defineProperty(t,r,s),s};class p extends a.WF{constructor(){super(...arguments),this.isThemeProvider=!1,this.themeProvider=void 0,this.themeConsumer=new i.G(this,{context:d,subscribe:!0,callback:()=>{this.handleTheming()}})}static get defaultLocale(){return"undefined"!=typeof document&&document.documentElement.lang?document.documentElement.lang:"undefined"!=typeof window?window.navigator.language:"en-US"}get currentTheme(){let e=this.themeId??this.contextTheme??p.defaultTheme;return this.invertTheme&&(e=function(e){return e.includes("light")?e.replace("light","dark"):e.replace("dark","light")}(e)),e}get contextTheme(){return this.themeConsumer?.value?.themeId}get contextIconSet(){return this.themeConsumer?.value?.iconSet}get currentIconSet(){return void 0!==this.iconSet&&"auto"!==this.iconSet?this.iconSet:void 0!==this.contextIconSet?this.contextIconSet:this.brandId}get brandId(){return this.currentTheme?.split("-")[0]}get colorSchemeId(){return this.currentTheme?.split("-")[1]}themeChanged(){(0,n.A)()}update(e){(e.has("themeId")||e.has("invertTheme")||e.has("iconSet"))&&this.handleTheming(),super.update(e)}handleTheming(){const e=this.currentTheme!==this.contextTheme,t=void 0!==this.iconSet&&"auto"!==this.iconSet;if(e||t){const e=void 0!==this.iconSet&&"auto"!==this.iconSet?this.iconSet:this.contextIconSet;return this.isThemeProvider?this.themeProvider?.setValue({themeId:this.currentTheme,iconSet:e}):(this.isThemeProvider=!0,this.themeProvider=new i.DT(this,{context:d,initialValue:{themeId:this.currentTheme,iconSet:e}})),this.setThemeCssClasses(),void this.themeChanged()}this.isThemeProvider&&this.themeProvider&&(this.isThemeProvider=!1,this.removeController(this.themeProvider),this.themeProvider=void 0,this.setThemeCssClasses(),this.themeChanged())}setThemeCssClasses(){const e=this.currentTheme!==this.contextTheme;for(const t of o)this.classList.toggle(`vcdk-theme-${t}`,e&&this.brandId===t);this.classList.toggle("vcdk-mode-dark",e&&"dark"===this.colorSchemeId)}static finalizeStyles(e){return e?Array.isArray(e)?(e.unshift(c),a.WF.finalizeStyles(e)):a.WF.finalizeStyles([c,e]):a.WF.finalizeStyles(c)}}p.version="10.14.0",p.defaultTheme="volvo-light",l([(0,s.MZ)({type:String,reflect:!0})],p.prototype,"themeId",void 0),l([(0,s.MZ)({type:Boolean,attribute:"invert-theme",reflect:!0})],p.prototype,"invertTheme",void 0),l([(0,s.MZ)({type:String,attribute:"icon-set"})],p.prototype,"iconSet",void 0)},1089(e,t,r){r.d(t,{f:()=>i});const i={xs:{from:0,to:599.98},sm:{from:600,to:904.98},md:{from:905,to:1239.98},lg:{from:1240,to:1439.98},xl:{from:1440,to:15360}}}}]);