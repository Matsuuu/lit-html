import {AsyncDirective, directive} from '../async-directive.js';
import {_Σ as p, ElementPart, AttributePart, nothing} from '../lit-html.js';

interface AttributeDirectiveBinding {
  name: string;
  creator: typeof p._AttributePart;
  value: any;
}

type AttributeDirectiveBindingMap = {
  [key: string]: AttributeDirectiveBinding;
};

class AttributeDirective extends AsyncDirective {
  private _initialized = false;

  render(..._props: Array<unknown>) {
    return nothing;
  }

  update(part: ElementPart, attributes: any) {
    if (!this._initialized) {
      this._initialized = true;
      this.mapAttributes(attributes, part);
      return nothing;
    }

    return nothing;
  }

  mapAttributes(attributes: any, part: ElementPart) {
    const elem = part.element;

    const attributeList = this.parseAttributes(attributes);
    const values = attributes.slice(1);
    const attributeValueMap = this.getAttributeValueMap(attributeList, values);

    Object.values(attributeValueMap).forEach(
      (val: AttributeDirectiveBinding) => {
        const part: AttributePart = new val.creator(
          elem as HTMLElement,
          val.name,
          ['', ''],
          this.__part._$parent,
          undefined
        );

        part._$setValue(val.value, this._$parent);
      }
    );
  }

  parseAttributes(attributes: any): string[] {
    const attributeList: string[] = [];
    for (const attr of attributes[0]) {
      const attributeName = attr.toLowerCase().trim();
      // When multiple attributes are after each other, they are in the same array key in the template literal
      const chainedAttributes = attributeName.split('" ');
      chainedAttributes.forEach((a: any) => attributeList.push(a));
    }
    return attributeList;
  }

  getAttributeValueMap(
    attributes: any,
    values: any
  ): AttributeDirectiveBindingMap {
    let iterator = 0;
    const attributeValueMap: AttributeDirectiveBindingMap = {};

    for (const attr of attributes) {
      const attributeName = attr.toLowerCase().trim();
      if (attributeName.length <= 0) continue;

      if (/=./.exec(attr)) {
        const attrSplit = attributeName
          .split('=')
          .map((att: string) => att.replace(/"/g, ''));
        const name: string = attrSplit[0];
        const value = attrSplit[1];

        const binding = {
          name,
          creator: p._AttributePart,
          value,
        } as AttributeDirectiveBinding;

        attributeValueMap[name] = binding;
      } else {
        const m = /([.?@])?(.*)/.exec(attributeName)!;
        const creator =
          m[1] === '.'
            ? p._PropertyPart
            : m[1] === '?'
            ? p._BooleanAttributePart
            : m[1] === '@'
            ? p._EventPart
            : p._AttributePart;

        let name = m[2];
        if (name.substring(name.length - 1) === '=') {
          name = name.substring(0, name.length - 1);
        }
        const value = values[iterator];

        const binding = {
          name,
          creator,
          value,
        } as AttributeDirectiveBinding;
        attributeValueMap[name] = binding;
        iterator++;
      }
    }
    return attributeValueMap;
  }
}

export const attr = directive(AttributeDirective);
