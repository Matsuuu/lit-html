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

  const titleAttr = 'div-title';
  const selected = true;
  const role = 'button-role';
  let incremented = 0;
  const onClick = () => {
    incremented += 1;
  };

  function renderAttributeTemplate() {
    render(
      html`<div ?disabled=${true} title=${titleAttr} type="button" ${attr`?selected=${selected} @click=${onClick} class="foobar" role=${role}`}></div>`,
      container
    );
  }

  test('sets attr on element', () => {
    renderAttributeTemplate();
    const div = container.firstElementChild;

    (div as HTMLDivElement).click();
    console.log(div);

    // Normal attributes
    assert.isOk(div?.hasAttribute('disabled'));
    assert.equal(div?.getAttribute('title'), titleAttr);
    assert.equal(div?.getAttribute('type'), 'button');

    // Directive attributes
    assert.isOk(div?.hasAttribute('disabled'));
    assert.equal(div?.getAttribute('class'), 'foobar');
    assert.equal(div?.getAttribute('role'), role);
    assert.equal(incremented, 1);
  });
});
