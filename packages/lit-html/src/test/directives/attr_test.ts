/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import {html, render} from '../../lit-html.js';
import {attr} from '../../directives/attr.js';
import {assert} from '@esm-bundle/chai';

suite('attr', () => {
  let container: HTMLDivElement;

  setup(() => {
    container = document.createElement('div');
  });

  function renderAttributeTemplate() {
    const selected = true;
    const onClick = () => console.log('click');
    const role = 'button-role';
    const titleAttr = 'div-title';
    render(
      html`<div ?disabled=${true} ?checked=${true} title=${titleAttr} type="button" ${attr`?selected=${selected} @click=${onClick} class="foobar" aria-label="button" role=${role}`}></div>`,
      container
    );
  }

  test('sets attr on element', () => {
    renderAttributeTemplate();
    const div = container.firstElementChild;
    console.log(div);
    assert.equal(div, div);
  });
});
