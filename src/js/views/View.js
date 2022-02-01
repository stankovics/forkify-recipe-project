import { mark } from 'regenerator-runtime';
import icons from 'url:../../img/icons.svg';
export default class View {
  _data;

  /**
   * Render the recived object to the DOM
   * @param {Object | Object[]} data The data to be rendered (e.g. recipe)
   * @param {boolean} [render=true] If false, create markup string listead of rendering to the DOM
   * @returns {undefined | string} A markup string is returned if render = false
   * @this {object} View instance
   * @author Stefan Stankovic
   * @todo Finish the implementation
   */

  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();
    this._data = data;
    const markup = this._generateMarkup();
    if (!render) return markup;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup();

    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll('*')); // it returns a node list and we are converting node list into array.

    const curElements = Array.from(this._parentElement.querySelectorAll('*')); // it returns a node list and we are converting node list into array.
    console.log(newElements);
    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];
      // Updates changed TEXT
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      )
        // console.log('💥', newEl.firstChild.nodeValue.trim());
        curEl.textContent = newEl.textContent;

      //Updates changed ATTRIBUTES

      if (!newEl.isEqualNode(curEl))
        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );
    });
  }
  /*
Document.createRange() method returns a new Range object. The Range interface represents a fragment of a document that can contain nodes and parts of text nodes.
A range can be created by using the Document.createRange() method. Range objects can also be retrieved by using the getRangeAt() method of the Selection object or the caretRangeFromPoint() method of the Document object.

There also is the Range() constructor available.

Range.createContextualFragment()
Returns a DocumentFragment created from a given string of code.
The DocumentFragment interface represents a minimal document object that has no parent.

It is used as a lightweight version of Document that stores a segment of a document structure comprised of nodes just like a standard document. The key difference is due to the fact that the document fragment isn't part of the active document tree structure. Changes made to the fragment don't affect the document (even on reflow) or incur any performance impact when changes are made.

*Usage notes*
A common use for DocumentFragment is to create one, assemble a DOM subtree within it, then append or insert the fragment into the DOM using Node interface methods such as appendChild() or insertBefore(). Doing this moves the fragment's nodes into the DOM, leaving behind an empty DocumentFragment. Because all of the nodes are inserted into the document at once, only one reflow and render is triggered instead of potentially one for each node inserted if they were inserted separately
*/
  _clear() {
    this._parentElement.innerHTML = ''; // clear parent element. on this way current html code is deleted and it leaves space for new html code that is added with insertAdjacentHTML();
  }
  renderSpinner() {
    const markup = `<div class="spinner">
        <svg>
          <use href="${icons}#icon-loader"></use>
        </svg>
      </div>
        `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  renderError(message = this._errorMessage) {
    const markup = `
        <div class="message">
                <div>
                  <svg>
                    <use href="src/img/${icons}#icon-smile-triangle"></use>
                  </svg>
                </div>
                <p>${message}</p>
              </div>us
        `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  renderMessage(message = this._message) {
    const markup = `
        <div class="error">
                <div>
                  <svg>
                    <use href="src/img/${icons}#icon-alert-triangle"></use>
                  </svg>
                </div>
                <p>${message}</p>
              </div>
        `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
