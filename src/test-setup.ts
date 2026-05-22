import 'zone.js';
import 'zone.js/testing';

// Stencil (used by Ionic) expects constructable stylesheet APIs in the DOM.
// jsdom may expose CSSStyleSheet but not adoptedStyleSheets, so we polyfill both
// document and shadow root targets before Ionic modules are evaluated.
const supportsConstructableStylesheets =
  typeof CSSStyleSheet !== 'undefined' && typeof CSSStyleSheet.prototype.replaceSync === 'function';

if (supportsConstructableStylesheets && typeof document !== 'undefined') {
  const documentWithSheets = document as Document & { adoptedStyleSheets?: CSSStyleSheet[] };
  if (!documentWithSheets.adoptedStyleSheets) {
    Object.defineProperty(documentWithSheets, 'adoptedStyleSheets', {
      configurable: true,
      writable: true,
      value: [],
    });
  }
}

if (
  supportsConstructableStylesheets &&
  typeof ShadowRoot !== 'undefined' &&
  !Object.prototype.hasOwnProperty.call(ShadowRoot.prototype, 'adoptedStyleSheets')
) {
  const shadowSheets = new WeakMap<ShadowRoot, CSSStyleSheet[]>();

  Object.defineProperty(ShadowRoot.prototype, 'adoptedStyleSheets', {
    configurable: true,
    get() {
      return shadowSheets.get(this) ?? [];
    },
    set(value: CSSStyleSheet[]) {
      shadowSheets.set(this, value ?? []);
    },
  });
}
