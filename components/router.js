import { SbRoots } from "../pages/roots.js";
import { SbPath } from "../pages/path.js";

export class SbRouter extends HTMLElement {
  #slotContent = null;
  #routes = [
    {
      route:
        /^\/roots$/,
      class: SbRoots,
    },
    {
      route:
        /^\/roots\/(?<rootName>[\w\W]*)\/path\/(?<path>[\s\S]*)$/,
      class: SbPath,
    },
    {
      route: /[\s\S]*/,
      class: SbRoots,
    },
  ];

  constructor() {
    super();

    const shadowRoot = this.attachShadow({
      mode: "open",
      slotAssignment: "manual",
    });
    shadowRoot.innerHTML = /*html*/ `
      <style>
      </style>
      <slot><div id="default">Loading Router...</div></slot>
    `;
  }

  #navigate(event) {
    // Exit early if this navigation shouldn't be intercepted,
    // e.g. if the navigation is cross-origin, or a download request
    if (!event.canIntercept) {
      return;
    }

    const url = new URL(event.destination.url);

    try {
      for (const item of this.#routes) {
        let result = item.route.exec(url.pathname);

        if (result) {
          event.intercept({
            handler: async () => {
              try {
                this.#updateView(item.class, result.groups);
              } catch (error) {
                console.error(error);
              }
            },
          });
          break;
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  #updateView(type, groups) {
    if (this.#slotContent) {
      this.#slotContent.remove();
      this.#slotContent = null;
    }

    this.#slotContent = new type(groups);
    this.appendChild(this.#slotContent);
    this.shadowRoot.querySelector("slot").assign(this.#slotContent);
  }

  connectedCallback() {
    navigation.addEventListener("navigate", this.#navigate.bind(this));
    for (const item of this.#routes) {
      let result = item.route.exec(window.location.pathname);

      if (result) {
        this.#updateView(item.class, result.groups);
        break;
      }
    }
  }
}

customElements.define("sb-router", SbRouter);