const template = `
  <input type="text"></input>
  <button type="submit">Search</button>
`
class SearchInput extends HTMLElement {
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

    this.#input.value = "Express";
    this.#button.addEventListener('click', () => this.#search());
  }

  #match(item) {
    return item.title.indexOf('xpress') > 0;
  }

  async #search() {
    const toCopy = ['path','image','title','author','description'];
    const fetched = await fetch(this.#src);
    const data = JSON.parse(await fetched.text()).data;
    const results = data.filter(item => this.#match(item));
    this.#target.innerHTML = '';
    results.forEach(item => {
      const result = document.createElement('search-result');
      toCopy.forEach(attr => { 
        result.setAttribute(attr, item[attr]);
      });
      this.#target.append(result);
    })
  }

}

customElements.define('search-input', SearchInput);