/* ************************************************************************************************
 *                                                                                                *
 * Please read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectangle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  return { width, height, getArea() { return width * height; } };
  // throw new Error('Not implemented');
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
  // throw new Error('Not implemented');
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  return Object.setPrototypeOf(JSON.parse(json), proto);
  // throw new Error('Not implemented');
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id[attr].class:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurrences
 *
 * All types of selectors can be combined using the combination ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string representation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

class Builder {
  constructor() {
    this.tmp = '';
    this.elementTmp = '';
    this.idTmp = '';
    this.classTmp = '';
    this.attrTmp = '';
    this.pseudoClassTmp = '';
    this.pseudoElementTmp = '';
  }

  clone() {
    const clone = new Builder();
    clone.elementTmp = this.elementTmp;
    clone.idTmp = this.idTmp;
    clone.classTmp = this.classTmp;
    clone.attrTmp = this.attrTmp;
    clone.pseudoClassTmp = this.pseudoClassTmp;
    clone.pseudoElementTmp = this.pseudoElementTmp;
    return clone;
  }

  clear() {
    this.tmp = '';
    this.elementTmp = '';
    this.idTmp = '';
    this.classTmp = '';
    this.attrTmp = '';
    this.pseudoClassTmp = '';
    this.pseudoElementTmp = '';
  }

  element(value) {
    if (this.elementTmp) {
      throw new Error(
        'Element, id and pseudo-element should not occur more then one time inside the selector',
      );
    }
    if (this.idTmp || this.attrTmp || this.classTmp
      || this.pseudoClassTmp || this.pseudoElementTmp) {
      throw new Error(
        'Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element',
      );
    }
    this.elementTmp += value;
    const clone = this.clone();
    this.clear();
    return clone;
  }

  id(value) {
    if (this.idTmp) {
      throw new Error(
        'Element, id and pseudo-element should not occur more then one time inside the selector',
      );
    }
    if (this.attrTmp || this.classTmp
      || this.pseudoClassTmp || this.pseudoElementTmp) {
      throw new Error(
        'Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element',
      );
    }
    this.idTmp += `#${value}`;
    const clone = this.clone();
    this.clear();
    return clone;
  }

  class(value) {
    if (this.attrTmp || this.pseudoClassTmp || this.pseudoElementTmp) {
      throw new Error(
        'Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element',
      );
    }
    this.classTmp += `.${value}`;
    const clone = this.clone();
    this.clear();
    return clone;
  }

  attr(value) {
    if (this.pseudoClassTmp || this.pseudoElementTmp) {
      throw new Error(
        'Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element',
      );
    }
    this.attrTmp += `[${value}]`;
    const clone = this.clone();
    this.clear();
    return clone;
  }

  pseudoClass(value) {
    if (this.pseudoElementTmp) {
      throw new Error(
        'Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element',
      );
    }
    this.pseudoClassTmp += `:${value}`;
    const clone = this.clone();
    this.clear();
    return clone;
  }

  pseudoElement(value) {
    if (this.pseudoElementTmp) {
      throw new Error(
        'Element, id and pseudo-element should not occur more then one time inside the selector',
      );
    }
    this.pseudoElementTmp += `::${value}`;
    const clone = this.clone();
    this.clear();
    return clone;
  }

  combine(selector1, combinator, selector2) {
    const part2 = selector2.stringify();
    const part1 = selector1.stringify();
    const clone = this.clone();
    this.clear();
    clone.tmp = `${part1} ${combinator} ${part2}`;
    return clone;
  }

  stringify() {
    let result = '';
    if (this.tmp) {
      result = this.tmp;
      this.clear();
      return result;
    }

    result = `${this.elementTmp}${this.idTmp}${this.attrTmp}${this.classTmp}${this.pseudoClassTmp}${this.pseudoElementTmp}`;
    this.clear();
    return result;
  }
}

const cssSelectorBuilder = new Builder();

module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
