const template = `
  <a target="_new">  
    <h1 class='title'></h1>
  </a>
  <p><em class='author'></em></p>
  <p class='description'></p>
  <img></img>
`;

class SearchResult extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = template;
    this.querySelectorAll('*').forEach(e => {
      const clazz = e.getAttribute('class');
      if(clazz) {
        e.textContent = this.getAttribute(clazz);
        this.removeAttribute(clazz);
      }
    });
    this.querySelector('img')?.setAttribute('src', this.getAttribute('image'));
    this.querySelector('a').setAttribute('href', this.getAttribute('path'));
  }
}

customElements.define('search-result', SearchResult);