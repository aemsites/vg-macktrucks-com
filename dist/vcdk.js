"use strict";(self.webpackChunkmacktrucks=self.webpackChunkmacktrucks||[]).push([[325],{6487(e,t,r){r.d(t,{E:()=>o});const o=e=>(t,r)=>{const o=()=>{const r=customElements.get(e);if(!r)return void customElements.define(e,t);const o=r.version,i=t.version;o&&i&&o!==i&&console.warn(`vcdk warning: Attempted to register <${e}>v, but <${e}>v. was already registered. This could indicate that your application might contain duplicate instances of the same component.`)};r?r.addInitializer(o):o()}},4135(e,t,r){r.d(t,{F:()=>d});var o=r(8128),i=r(2618),n=r(2326),s=r(7571);const a=Object.keys(o.f),d=e=>class extends e{static fallbackVariableValue(e,t,r){if(!r.length)return"";const o=r.shift();return r.length?`var(--${e}-${t}-${o}, ${this.fallbackVariableValue(e,t,r)})`:`var(--${e}-${t}-${o})`}static responsiveVariables(e,t,r,o){return t.map(t=>{const i=(0,n.A)(t);return o?`\n    --${e}-${i}-fallback: ${this.fallbackVariableValue(e,i,[...o])};\n    --${e}-${i}: var(--${e}-${i}-${r}, var(--${e}-${i}-fallback));`:`\n    --${e}-${i}: var(--${e}-${i}-${r});`}).join("")}static responsiveStyles(e){return i.AH`
        :host {
          ${(0,i.iz)(this.responsiveVariables(e.prefix,e.props,"xs"))}
        }
        @media(min-width: ${o.f.sm.from}px) {
          :host {
            ${(0,i.iz)(this.responsiveVariables(e.prefix,e.props,"sm",["xs"]))}
          }
        }
        @media (min-width: ${o.f.md.from}px) {
          :host {
            ${(0,i.iz)(this.responsiveVariables(e.prefix,e.props,"md",["sm","xs"]))}
          }
        }
        @media (min-width: ${o.f.lg.from}px) {
          :host {
            ${(0,i.iz)(this.responsiveVariables(e.prefix,e.props,"lg",["md","sm","xs"]))}
          }
        }
        @media (min-width: ${o.f.xl.from}px) {
          :host {
            ${(0,i.iz)(this.responsiveVariables(e.prefix,e.props,"xl",["lg","md","sm","xs"]))}
          }
        }
      }`}static finalizeStyles(e){if(!this.responsiveProperties)return s.l.finalizeStyles(e);const t=[this.responsiveStyles(this.responsiveProperties)];return e&&Array.isArray(e)?t.push(...e):e&&t.push(e),s.l.finalizeStyles(t)}connectedCallback(){super.connectedCallback(),this.setResponsiveVariables()}update(e){const t=this.constructor.responsiveProperties,r=t?.props;t&&r.some(t=>e.has(t))&&this.setResponsiveVariables(),super.update(e)}setResponsiveVariables(){const e=this.constructor.responsiveProperties;if(void 0===e)return;const t=e.props;for(const r of t){let t=this[r];if(t){Array.isArray(t)||(t=[t]);for(let o=0;o<t.length;o++){const i=String(r);let s=t[o];if(e.styleTransform&&(s=e.styleTransform(i,a[o],s)),void 0===s)continue;"number"==typeof s&&(s=`${s}px`);const d=a[o];this.style.setProperty(`--${e.prefix}-${(0,n.A)(i)}-${d}`,s)}}}}}},7909(e,t,r){r(2932);var o=r(1669),i=r(2618),n=r(9194),s=r(302),a=r(6487),d=r(7571);const c=i.AH`
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
`;var l=function(e,t,r,o){var i,n=arguments.length,s=n<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,r):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,r,o);else for(var a=e.length-1;a>=0;a--)(i=e[a])&&(s=(n<3?i(s):n>3?i(t,r,s):i(t,r))||s);return n>3&&s&&Object.defineProperty(t,r,s),s};class p extends CustomEvent{constructor(e,t){super(e,{detail:t,bubbles:!0,composed:!0,cancelable:!0})}}let v=class extends d.l{constructor(){super(...arguments),this.headerTitle="",this.open=!1,this.onToggleClick=e=>{e.preventDefault();const t=!this.open,r=new p("toggle",{open:t});this.dispatchEvent(r);const o=new p("vcdk-toggle",{open:t});this.dispatchEvent(o);r.defaultPrevented||o.defaultPrevented||(this.open=t)}}render(){const{headerTitle:e,headerIcon:t}=this;return i.qy`
      <details ?open=${this.open} part="details">
        <summary
          id="accordionID"
          part="summary"
          @click=${this.onToggleClick}
          aria-controls="accordionSectionID"
          aria-expanded=${this.open?"true":"false"}>
          <slot name="summary-start">
            ${(0,s.z)(t,()=>i.qy`
                <vcdk-system-icon
                  size=${24}
                  icon=${t}></vcdk-system-icon>
              `)}
          </slot>
          <slot name="title" class="title typography-subtitle1">
            ${e}
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
    `}};v.styles=[o.IT.subtitle1,c],l([(0,n.MZ)({type:String})],v.prototype,"headerTitle",void 0),l([(0,n.MZ)({type:String})],v.prototype,"headerIcon",void 0),l([(0,n.MZ)({type:Boolean,reflect:!0})],v.prototype,"open",void 0),v=l([(0,a.E)("vcdk-accordion")],v)},5865(e,t,r){var o=r(6591),i=r(2618),n=r(9194),s=r(3720),a=r(1145),d=r(6487),c=r(4135),l=r(7571);const p=i.AH`
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
`;var v=function(e,t,r,o){var i,n=arguments.length,s=n<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,r):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,r,o);else for(var a=e.length-1;a>=0;a--)(i=e[a])&&(s=(n<3?i(s):n>3?i(t,r,s):i(t,r))||s);return n>3&&s&&Object.defineProperty(t,r,s),s};let h=class extends((0,c.F)(l.l)){render(){return i.JW`
    <svg
      class=${(0,s.H)({indefinite:void 0===this.progress})}
      part="svg"
      viewBox="20 20 40 40"
      role="progressbar"
      aria-busy="true"
      aria-live="polite"
      aria-label="${this.elementAriaLabel}"
      style=${(0,a.W)({"--vcdk-spinner-progress":"number"==typeof this.progress?this.progress+"%":void 0})}>
        <circle
          cx="40"
          cy="40"
          r="18"
          fill="none" />     
    </svg>
    `}};h.styles=[p],h.responsiveProperties={prefix:"vcdk-spinner",props:["size"],styleTransform:(e,t,r)=>{if("size"===e&&"string"==typeof r)switch(r){case"small":return 18;case"large":return 80;default:return 38}return r}},v([(0,n.MZ)({type:Number})],h.prototype,"progress",void 0),v([(0,n.MZ)({converter:o.g})],h.prototype,"size",void 0),v([(0,n.MZ)({type:String,attribute:"element-aria-label"})],h.prototype,"elementAriaLabel",void 0),h=v([(0,d.E)("vcdk-spinner")],h);r(2932);var y=r(1669),g=r(302);const u=e=>"number"==typeof e?e:e||i.s6,m=i.AH`
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
`;var b=function(e,t,r,o){var i,n=arguments.length,s=n<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,r):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,r,o);else for(var a=e.length-1;a>=0;a--)(i=e[a])&&(s=(n<3?i(s):n>3?i(t,r,s):i(t,r))||s);return n>3&&s&&Object.defineProperty(t,r,s),s};let f=class extends l.l{constructor(){super(...arguments),this.ariaLabel="",this.autofocus=!1,this.size="medium",this.variant="marketing",this.clickHandler=e=>{if(!this.href)return this.disabled?(e.preventDefault(),void e.stopPropagation()):void("submit"!==this.type||e.defaultPrevented||this.closest("form")?.requestSubmit())}}render(){const{href:e,variant:t="primary",size:r,loading:o,iconStart:n,iconEnd:a,disabled:d,fullWidth:c,ariaLabel:l,title:p,type:v}=this,h={button:!0,[`variant-${t}`]:!0,[`size-${r}`]:!0,fullWidth:!!c,loading:!!o},y={text:!0,"typography-button":!0},m=i.qy`
      ${(0,g.z)(n,()=>i.qy`
          <vcdk-system-icon
            .size=${24}
            .icon=${n}
            class="icon"></vcdk-system-icon>
        `)}
      <div class=${(0,s.H)(y)}>
        <slot></slot>
      </div>
      ${(0,g.z)(a,()=>i.qy`
          <vcdk-system-icon
            .size=${24}
            .icon=${a}
            class="icon"></vcdk-system-icon>
        `)}
      ${(0,g.z)(o,()=>i.qy`
          <vcdk-spinner class="spinner"></vcdk-spinner>
        `)}
    `;return e?i.qy`
        <a
          part="button"
          class=${(0,s.H)(h)}
          title=${u(p)}
          aria-label=${u(l)}
          aria-disabled=${d?"true":i.s6}
          href=${e}
          download=${u(this.download)}
          hreflang=${u(this.hreflang)}
          ping=${u(this.ping)}
          referrerpolicy=${u(this.referrerpolicy)}
          rel=${u(this.rel)}
          target=${u(this.target)}
          type=${u(v)}>
          ${m}
        </a>
      `:i.qy`
      <button
        part="button"
        title=${u(p)}
        aria-label=${u(l)}
        aria-disabled=${d?"true":i.s6}
        @click=${this.clickHandler}
        ?autofocus=${this.autofocus}
        formaction=${u(this.formaction)}
        formenctype=${u(this.formenctype)}
        formmethod=${u(this.formmethod)}
        ?formnovalidate=${this.formnovalidate}
        formtarget=${u(this.formtarget)}
        name=${u(this.name)}
        type=${v??"button"}
        value=${u(this.value)}
        class=${(0,s.H)(h)}>
        ${m}
      </button>
    `}};f.styles=[y.IT.button,m],b([(0,n.MZ)({type:String})],f.prototype,"ariaLabel",void 0),b([(0,n.MZ)({type:Boolean})],f.prototype,"autofocus",void 0),b([(0,n.MZ)({type:String})],f.prototype,"size",void 0),b([(0,n.MZ)({type:Boolean})],f.prototype,"fullWidth",void 0),b([(0,n.MZ)({type:String})],f.prototype,"iconEnd",void 0),b([(0,n.MZ)({type:String})],f.prototype,"iconStart",void 0),b([(0,n.MZ)({type:Boolean})],f.prototype,"loading",void 0),b([(0,n.MZ)({type:String})],f.prototype,"variant",void 0),b([(0,n.MZ)({type:String})],f.prototype,"download",void 0),b([(0,n.MZ)({type:String})],f.prototype,"href",void 0),b([(0,n.MZ)({type:String})],f.prototype,"hreflang",void 0),b([(0,n.MZ)({type:String})],f.prototype,"ping",void 0),b([(0,n.MZ)({type:String})],f.prototype,"referrerpolicy",void 0),b([(0,n.MZ)({type:String})],f.prototype,"rel",void 0),b([(0,n.MZ)({type:String})],f.prototype,"target",void 0),b([(0,n.MZ)({type:Boolean})],f.prototype,"disabled",void 0),b([(0,n.MZ)({type:String})],f.prototype,"form",void 0),b([(0,n.MZ)({type:String})],f.prototype,"formaction",void 0),b([(0,n.MZ)({type:String})],f.prototype,"formenctype",void 0),b([(0,n.MZ)({type:String})],f.prototype,"formmethod",void 0),b([(0,n.MZ)({type:Boolean})],f.prototype,"formnovalidate",void 0),b([(0,n.MZ)({type:String})],f.prototype,"formtarget",void 0),b([(0,n.MZ)({type:String,reflect:!0})],f.prototype,"name",void 0),b([(0,n.MZ)({type:String})],f.prototype,"type",void 0),b([(0,n.MZ)({type:String})],f.prototype,"value",void 0),f=b([(0,d.E)("vcdk-button")],f)},2932(e,t,r){var o=r(582);const i="https://cdn.designsystem.volvogroup.com/1-2-1";var n=r(2618),s=r(9194),a=r(31),d=r(8776),c=r(5664),l=r(6487),p=r(1669),v=r(6591),h=r(8128),y=r(9703),g=r(2049);const u=Object.keys(h.f),m=e=>(0,y.A)(e)?e:`${e}px`,b=(e,t)=>{if(t)return(0,g.A)(t)?t.reduce((t,r,o)=>{const i=u[o];return{...t,[`${e}-${i}`]:m(r)}},{}):{[e]:m(t)}},f=Object.entries(h.f),k=(e,t)=>{const r=`\n  ${e} {\n    ${t}: var(${t}-xs);\n  }`,o=Object.entries(h.f).splice(1).map(([r,o],i)=>{const n=f[i+2],s=n?`, var(${t}-${n[0]})`:"";return`\n    @media(min-width: ${o.from}px) {\n      ${e} {\n        ${t}: var(${t}-${r} ${s});\n      } \n    }`});return(0,n.iz)([r,o].join(""))};var x=r(302),$=r(3720),w=r(1145),z=r(4135),A=r(7571);const S=n.AH`
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

  ${k(".skeleton[class*='typography-'].variant-typography","--vcdk-skeleton-line-height")}
  ${k(".skeleton[class*='typography-'].variant-typography","--vcdk-skeleton-font-size")}

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
`;var M=function(e,t,r,o){var i,n=arguments.length,s=n<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,r):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,r,o);else for(var a=e.length-1;a>=0;a--)(i=e[a])&&(s=(n<3?i(s):n>3?i(t,r,s):i(t,r))||s);return n>3&&s&&Object.defineProperty(t,r,s),s};let T=class extends((0,z.F)(A.l)){constructor(){super(...arguments),this.disableAnimation=!1,this.typographyVariant="body",this.variant="typography",this.elementAriaDescription=null}get cssVariables(){return{...this.typographyVariant&&b("--vcdk-skeleton-line-height",(0,p.UN)(this.typographyVariant,"line-height")),...this.typographyVariant&&b("--vcdk-skeleton-font-size",(0,p.UN)(this.typographyVariant,"font-size"))}}render(){return n.qy`
      <div
        class=${(0,$.H)({skeleton:1,"disable-animation":!!this.disableAnimation,"aspect-ratio":!!this.aspectRatio,[`typography-${this.typographyVariant}`]:!!this.typographyVariant,[`variant-${this.variant}`]:1})}
        style=${(0,w.W)(this.cssVariables)}>
        ${(0,x.z)(this.elementAriaDescription,()=>n.qy`
            <div class="hidden">${this.elementAriaDescription}</div>
          `)}
        <slot aria-hidden="true"></slot>
      </div>
    `}};T.styles=[S,...p.FB],T.responsiveProperties={prefix:"vcdk-skeleton",props:["width","height","size","aspectRatio"]},M([(0,s.MZ)({attribute:"aspect-ratio",converter:v.g})],T.prototype,"aspectRatio",void 0),M([(0,s.MZ)({type:Boolean,attribute:"disable-animation"})],T.prototype,"disableAnimation",void 0),M([(0,s.MZ)({converter:v.g})],T.prototype,"height",void 0),M([(0,s.MZ)({converter:v.g})],T.prototype,"size",void 0),M([(0,s.MZ)({type:String,attribute:"typography-variant"})],T.prototype,"typographyVariant",void 0),M([(0,s.MZ)({converter:v.g})],T.prototype,"width",void 0),M([(0,s.MZ)({type:String})],T.prototype,"variant",void 0),M([(0,s.MZ)({type:String,attribute:"element-aria-description"})],T.prototype,"elementAriaDescription",void 0),T=M([(0,l.E)("vcdk-skeleton")],T);const Z=n.AH`
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
`;var E=function(e,t,r,o){var i,n=arguments.length,s=n<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,r):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,r,o);else for(var a=e.length-1;a>=0;a--)(i=e[a])&&(s=(n<3?i(s):n>3?i(t,r,s):i(t,r))||s);return n>3&&s&&Object.defineProperty(t,r,s),s};const P={};let R=class extends A.l{constructor(){super(...arguments),this.elementRole="presentation",this.elementAriaHidden=null,this.assetsTask=new o.YZ(this,{task:async([e,t,r])=>{if(!e)return"";const o=function({brand:e="volvo",type:t="filled",iconId:r}){return`${i}/icons/${e}/system/${t}/${r}.svg`}({type:t?"filled":"lined",brand:r,iconId:e});return void 0===P[o]&&(P[o]=fetch(o).then(e=>{if(!e.ok)throw new Error(`Response from CDN returned a non ok status: ${e.status}`);return e.text()}).then(e=>(0,d.T)(e)).catch(t=>{throw console.error(`Failed when loading icon id: "${e}". ${t}`),t})),await P[o]},args:()=>[this.icon,this.filled,this.brandId]})}render(){return this.assetsTask.render({pending:()=>n.qy`
        <vcdk-skeleton
          variant="rounded-rectangle"
          size=${(0,a.J)(this.size)}></vcdk-skeleton>
      `,complete:e=>e,error:()=>n.qy`
        <span style="width:${this.size}px;height:${this.size}px"></span>
      `})}updated(e){super.updated(e),this.setAttributes(),this.extendSvg()}extendSvg(){if(this.svgElement){if(this.elementTitle){this.elementAriaLabelledBy=this.elementAriaLabelledBy||(0,c.A)("svg-title-"),this.svgElement.setAttribute("aria-labelledby",this.elementAriaLabelledBy);const e=this.svgElement.querySelector("title");if(e)e.id=this.elementAriaLabelledBy,e.textContent=this.elementTitle;else{if(!document)return void console.warn("Document is not available, cannot create title element for SVG.");const e=document.createElement("title");e.id=this.elementAriaLabelledBy,e.textContent=this.elementTitle,this.svgElement.insertBefore(e,this.svgElement.firstChild)}}if(this.description){this.elementAriaDescribedBy=this.elementAriaDescribedBy||(0,c.A)("svg-description-"),this.svgElement.setAttribute("aria-describedby",this.elementAriaDescribedBy);const e=this.svgElement.querySelector("desc");if(e)e.id=this.elementAriaDescribedBy,e.textContent=this.description;else{const e=document.createElementNS("http://www.w3.org/2000/svg","desc");e.id=this.elementAriaDescribedBy,e.textContent=this.description,this.svgElement.appendChild(e),this.elementTitle?this.svgElement.querySelector("title")?.insertAdjacentElement("afterend",e):this.svgElement.insertBefore(e,this.svgElement.firstChild)}}}}setAttributes(){this.svgElement?.setAttribute("part","svg"),this.svgElement?.setAttribute("focusable","false"),"number"==typeof this.size&&this.svgElement?.setAttribute("style",`--vcdk-system-icon-size: ${this.size}px;`),this.elementRole?this.svgElement?.setAttribute("role",this.elementRole):n.s6,this.elementAriaHidden?this.svgElement?.setAttribute("aria-hidden",this.elementAriaHidden):n.s6}};R.styles=[Z],E([(0,s.MZ)({type:Boolean})],R.prototype,"filled",void 0),E([(0,s.MZ)({type:String})],R.prototype,"icon",void 0),E([(0,s.MZ)({type:Number})],R.prototype,"size",void 0),E([(0,s.MZ)({type:String,attribute:"element-aria-labelledby"})],R.prototype,"elementAriaLabelledBy",void 0),E([(0,s.MZ)({type:String,attribute:"element-title"})],R.prototype,"elementTitle",void 0),E([(0,s.MZ)({type:String,attribute:"element-aria-describedby"})],R.prototype,"elementAriaDescribedBy",void 0),E([(0,s.MZ)({type:String})],R.prototype,"description",void 0),E([(0,s.MZ)({type:String,attribute:"element-role"})],R.prototype,"elementRole",void 0),E([(0,s.MZ)({type:String,attribute:"element-aria-hidden"})],R.prototype,"elementAriaHidden",void 0),E([(0,s.P)("svg")],R.prototype,"svgElement",void 0),E([(0,s.wk)()],R.prototype,"assetsTask",void 0),R=E([(0,l.E)("vcdk-system-icon")],R)},1669(e,t,r){r.d(t,{FB:()=>d,IT:()=>a,UN:()=>c});var o=r(8128),i=r(2618),n=r(2326);i.AH`
  slot {
    display: inline;
    font-synthesis: none;
    margin: 0;
  }

  ::slotted(*) {
    font-synthesis: none;
    margin: 0;
  }
`;const s=(e,t="small")=>{const r=(0,n.A)(e);return i.AH`
    font-family: var(
      --vcdk-typography-${(0,i.iz)(r)}-font-family-${(0,i.iz)(t)}-screens
    );
    font-size: var(
      --vcdk-typography-${(0,i.iz)(r)}-size-${(0,i.iz)(t)}-screens
    );
    line-height: var(
      --vcdk-typography-${(0,i.iz)(r)}-line-height-${(0,i.iz)(t)}-screens
    );
    letter-spacing: var(
      --vcdk-typography-${(0,i.iz)(r)}-letter-spacing-${(0,i.iz)(t)}-screens
    );
    font-weight: var(
      --vcdk-typography-${(0,i.iz)(r)}-weight-${(0,i.iz)(t)}-screens
    );
  `},a=["display-statement","display1","display2","heading1","heading2","heading3","heading4","subtitle1","subtitle2","large-body","body","button","caption1","caption2"].reduce((e,t)=>(e[t]=i.AH`
      .typography-${(0,i.iz)(t)},
        .typography-${(0,i.iz)(t)}
        ::slotted(*) {
        ${s(t,"small")}
      }
      @media (min-width: ${o.f.md.from}px) {
        .typography-${(0,i.iz)(t)},
          .typography-${(0,i.iz)(t)}
          ::slotted(*) {
          ${s(t,"large")}
        }
      }
    `,e),{}),d=Object.values(a),c=(e,t)=>{const r="font-size"===t?"size":t,o=(0,n.A)(e);return[`var(--vcdk-typography-${o}-${r}-small-screens)`,`var(--vcdk-typography-${o}-${r}-large-screens)`]}},6591(e,t,r){r.d(t,{g:()=>i});r(8128);var o=r(2618);const i={fromAttribute(e,t){if(!e)return null;if(e.startsWith("[")&&e.endsWith("]"))return JSON.parse(e);if(void 0===t){const t=Number(e);if(!Number.isNaN(t))return t}return o.W3.fromAttribute?.(e,t)},toAttribute:(e,t)=>Array.isArray(e)?o.W3.toAttribute?.(e,Array):o.W3.toAttribute?.(e,t)}},7571(e,t,r){r.d(t,{l:()=>h});var o=r(767);const i=["volvo","mack","renault"];function n(e){return e.includes("light")?e.replace("light","dark"):e.replace("dark","light")}var s=r(2618),a=r(9194),d=r(2302);const c=(0,o.q6)(Symbol("vcdk-theme"));if("undefined"!=typeof document){const e=new o.aU,t=()=>e.attach(document.body);document.body?t():document.addEventListener("DOMContentLoaded",t)}const l=s.AH`
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
`,p=s.AH`
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
`;var v=function(e,t,r,o){var i,n=arguments.length,s=n<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,r):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,r,o);else for(var a=e.length-1;a>=0;a--)(i=e[a])&&(s=(n<3?i(s):n>3?i(t,r,s):i(t,r))||s);return n>3&&s&&Object.defineProperty(t,r,s),s};class h extends s.WF{constructor(){super(...arguments),this.isThemeProvider=!1,this.themeProvider=void 0,this.themeConsumer=new o.G(this,{context:c,subscribe:!0,callback:()=>{this.handleTheming()}})}static get defaultLocale(){return"undefined"!=typeof document&&document.documentElement.lang?document.documentElement.lang:"undefined"!=typeof window?window.navigator.language:"en-US"}get currentTheme(){let e=this.themeId??this.contextTheme??h.defaultTheme;return this.invertTheme&&(e=n(e)),e}get contextTheme(){return this.themeConsumer?.value?.themeId}get brandId(){return this.currentTheme?.split("-")[0]}get colorSchemeId(){return this.currentTheme?.split("-")[1]}themeChanged(){(0,d.A)()}update(e){(e.has("themeId")||e.has("invertTheme"))&&this.handleTheming(),super.update(e)}handleTheming(){if(this.currentTheme!==this.contextTheme)return this.isThemeProvider?this.themeProvider?.setValue({themeId:this.currentTheme}):(this.isThemeProvider=!0,this.themeProvider=new o.DT(this,{context:c,initialValue:{themeId:this.currentTheme}})),this.setThemeCssClasses(),void this.themeChanged();this.isThemeProvider&&this.themeProvider&&(this.isThemeProvider=!1,this.removeController(this.themeProvider),this.themeProvider=void 0,this.setThemeCssClasses(),this.themeChanged())}setThemeCssClasses(){const e=this.currentTheme!==this.contextTheme;for(const t of i)this.classList.toggle(`vcdk-theme-${t}`,e&&this.brandId===t);this.classList.toggle("vcdk-mode-dark",e&&"dark"===this.colorSchemeId)}static finalizeStyles(e){return e?Array.isArray(e)?(e.unshift(l,p),s.WF.finalizeStyles(e)):s.WF.finalizeStyles([l,p,e]):s.WF.finalizeStyles([l,p])}}h.version="9.16.0",h.defaultTheme="volvo-light",v([(0,a.MZ)({type:String,reflect:!0})],h.prototype,"themeId",void 0),v([(0,a.MZ)({type:Boolean,attribute:"invert-theme",reflect:!0})],h.prototype,"invertTheme",void 0)}}]);