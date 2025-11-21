import { matcher } from './fuzzy-matcher.js';

const template = `
  <input type="text" value="Hack"></input>
  <button type="submit">Search</button>
`
class SearchInput extends HTMLElement {
  #toCopy = ['path','image','title','author','description'];
  #target;
  #input;
  #button;
  #src;

  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = template;

    this.#input = this.querySelector('input');
    this.#button = this.querySelector('button');

    this.#target = document.querySelector(this.attributes.target?.value);
    if(!this.#target) {
      throw new Error("'target' attribute is required, must point to search results");
    }

    this.#src = this.attributes.src?.value;
    if(!this.#src) {
      throw new Error("'src' attribute is required, must point to data source");
    }

    this.#button.addEventListener('click', () => this.#search());
  }

  #match(item) {
    let matchSource = "";
    this.#toCopy.forEach(attr => {
      matchSource += item[attr] + ' ';
    })
    return matcher(this.#input.value, matchSource);
  }

  async #search() {
    const fetched = await fetch(this.#src);
    const data = JSON.parse(await fetched.text()).data;
    const results = data.filter(item => this.#match(item));

    this.#target.innerHTML = '';
    results.filter(item => this.#match(item)).forEach(item => {
      const result = document.createElement('search-result');
      this.#toCopy.forEach(attr => { 
        result.setAttribute(attr, item[attr]);
      });
      this.#target.append(result);
    })
  }

}

customElements.define('search-input', SearchInput);