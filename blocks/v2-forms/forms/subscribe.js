import { getMetadata } from '../../../scripts/aem.js';

const formContent = `
<div class="v2-forms__fields-container">
  <span class="v2-forms__input-fields">
    <input
      class="email-input"
      name="email"
      placeholder=""
      type="email"
      inputmode="email"
      autocomplete="off"
      autocapitalize="off"
      autocorrect="off"
      spellcheck="false"
      maxlength="254"
      required
    />
    <input type="hidden" id="form-locale" name="form-locale" value="${getMetadata('locale')}" />
    <button class="submit-button" type="submit" aria-label=""></button>
  </span>
  <span class="v2-forms__validation-message">
      This field is required
  </span>
</div>
`;

export default formContent;
