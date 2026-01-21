import "../css/author.css";

export default class AuthorWidget {
  constructor(parent) {
    this.parent = parent;
  }

  static get markup() {
    return `
        <div class="author">
            <div>
                <img src="https://avatars.githubusercontent.com/u/188052302?v=4" class="avatar" alt="Lampropeltiss Avatar">
            </div>
            <div>Homework done by Lampropeltiss</div>
        </div>`;
  }

  insertWidget() {
    this.parent.innerHTML = AuthorWidget.markup;
  }
}
