import {
  WidgetApi,
} from '@uipath/widget.sdk';

declare const api: WidgetApi;

const template = document.createElement('template');
template.innerHTML = `
  <style>

    :host {
      all: initial;
      font-family: noto-sans;

    }

    .col {
      padding-left: 1.6rem;
      padding-right: 0.4rem;
      font-size: 1.4rem;
    }

    .col h3 {
      font-size: 1.6rem;
    }

    .main {
      height: var(--main-window-tab-content-height);
      display: flex;
      flex-direction: column;

      border-color: var(--foreground-divider);
      border-right-width: 0.1rem;
      border-right-style: solid;
    }

    .list {
      overflow: auto;
    }

    .process {
      margin-top: 0.8rem;
      font-weight: 500;
    }

    ::-webkit-scrollbar {
      width: 0.8rem;
      background-color: transparent;
    }

    ::-webkit-scrollbar-thumb {
        border-radius: 0.4rem;
    }

    ::-webkit-scrollbar-thumb {
        background-color: var(--scrollbar-color);
    }

  </style>

  <div class="col main">
    <h3>Processes</h3>
    <div class="list">
    </div>
  </div>

  <div class="col">
    <h3>Second column content</h3>
    searchbox value:
    "<span class="box"></span>"
  </div>
`;

export class MainComponent extends HTMLDivElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    const listRoot = this.shadowRoot.querySelector('.list');

    api.processList$
    .subscribe(processes => {
      listRoot.innerHTML = '';

      processes.forEach(p => {
        const el = document.createElement('div');
        el.className = 'process';
        el.innerHTML = p.name;
        listRoot.appendChild(el);
      });
    });

    const box = this.shadowRoot.querySelector('.box');

    api.searchValue$.subscribe(value => {
      box.innerHTML = value;
    })
  }
}
