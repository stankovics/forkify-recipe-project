import View from './View.js';
import icons from 'url:../../img/icons.svg';
class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _message = 'Recipe was successfully uploaded';

  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');

  constructor() {
    super();
    this._addHandlerShowWindow();
    this._addHandlerHideWindow();
  }
  toggleWindow() {
    // it needs to be a separate method for toggle, not inside the _addHandlerShowWindow() method. If it's inside the addHandlerShowWindow() this keyword will point to element where is .addEventListener attached. That's why we are using bind() inside the _addHandlerShowWindow.
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  }
  _addHandlerShowWindow() {
    //This method will be used only inside this Class. That's why it's called in the controlor.
    this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
  }
  _addHandlerHideWindow() {
    this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
    this._overlay.addEventListener('click', this.toggleWindow.bind(this));
  }
  addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      const dataArr = [...new FormData(this)]; // new FormData(this) will return an object, and that's why we are destructirng it to get array.
      const data = Object.fromEntries(dataArr); // Object.fromEntries() takes and array and convert it into an object.
      handler(data);
    });
  }

  // _generateMarkup() {
}
export default new AddRecipeView();
