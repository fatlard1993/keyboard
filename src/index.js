import dom from 'dom';

class SoftKeyboard extends HTMLElement {
	constructor(){
		super();

		this.events = {};
		this.pointerEvents = {};
		this.keys = {};
		this.keyRows = [];

		this.layouts = Object.assign({}, SoftKeyboard.layouts);
		this.setLayouts = Object.assign({}, SoftKeyboard.setLayouts);
		this.keyDefinitions = Object.assign({}, SoftKeyboard.keyDefinitions);
		this.setKeyDefinitions = Object.assign({}, SoftKeyboard.setKeyDefinitions);

		return this;
	}

	static get observedAttributes(){
		return ['hidden', 'layout'];
	}

	static keyDefinitions = {
		simple: { key: 'simple', text: 'ABC' },
		number: { key: 'number', text: '123' }
	}

	static layouts = {
		simple: [
			['simple', 'number'],
			['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
			['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
			['shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'backspace'],
			[',', '.', 'space', '!', 'return'],
		],
		number: [
			['simple', 'number'],
			['1', '2', '3', 'backspace'],
			['4', '5', '6', 'clear'],
			['7', '8', '9', 'done'],
			['.', '0', '-', 'e'],
		]
	}

	static setKeyDefinitions = (keyDefinitions) => {
		this.keyDefinitions = Object.assign(this.keyDefinitions, keyDefinitions);
	}

	static setLayouts = (layouts) => {
		this.layouts = Object.assign(this.layouts, layouts);
	}

	static log = new Log({ tag: 'keyboard' });

	on = (name, func) => { // todo implement native keyboard events https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/KeyboardEvent
		this.addEventListener(name, func);

		return { cancel: (name, func) => { this.off(name, func); } };
	}

	off = (name, func) => {
		this.removeEventListener(name, func);
	}

	fire = (name, data) => {
		this.dispatchEvent(new CustomEvent(name, { detail: data }));
	}

	fix = (name = this.layout) => {
		var layout = this.layouts[name];

		if(!name || !layout) return;

		for(var x = 0, xCount = layout.length; x < xCount; ++x){
			for(var y = 0, yCount = layout[x].length; y < yCount; ++y){
				if(this.keys[`${x}_${y}`]) this.keys[`${x}_${y}`].elem.style.width = ((this.clientWidth / yCount) - (y + 1 === yCount ? 0 : 1)) +'px';
			}
		}
	}

	connectedCallback(){
		this.setLayout(this.layout);

		dom.maintenance.init([this.fix]);

		dom.onPointerDown(this, this.onPointerDown);
		dom.onPointerUp(this, this.onPointerUp);
	}

	disconnectedCallback(){
		this.pointerDownOff();
		this.pointerUpOff();
	}

	attributeChangedCallback(attribute, oldVal, newVal){
		if(attribute === 'layout') this.setLayout(newVal);

		else if(attribute === 'hidden') this[newVal ? 'hide' : 'show']();
	}

	generateKey(key){
		if(typeof key !== 'string') return;

		var elem = dom.createElem('button');

		if(this.keyDefinitions[key]){
			var name = key;

			elem.classList.add(name);

			key = Object.assign({ name, key: name }, this.keyDefinitions[key]);

			if(key.class) elem.classList.add(typeof key.class === 'object' && key.class.length ? key.class : key.class.split(' '));

			elem.textContent = typeof key.text === 'string' ? key.text : name;
		}

		else {
			elem.textContent = key;
			elem.className = key;

			key = { key };
		}

		key.elem = elem;

		return key;
	}

	flushKeyup = () => {
		Object.keys(this.pointerEvents).forEach((id) => { this.onPointerUp(this.pointerEvents[id]); });
	}

	setLayout(name){
		if(typeof name !== 'string' || !this.layouts[name]) return;

		this.layout = name;

		var layout = this.layouts[name];

		dom.empty(this); // todo re-use elements remove extra, add as-needed

		this.keyRows = [];
		this.keys = {};

		for(var x = 0, xCount = Math.max(layout.length, this.keyRows.length); x < xCount; ++x){
			this.keyRows[x] = this.keyRows[x] || dom.createElem('div', { appendTo: this });

			for(var y = 0, yCount = Math.max(layout[x] && layout[x].length, this.keyRows[x].children.length); y < yCount; ++y){
				var position = `${x}_${y}`;

				var key = this.generateKey(layout[x][y]);

				key.elem.setAttribute('data-pos', position);

				this.keyRows[x].appendChild(key.elem);

				this.keys[position] = key;
			}
		}

		if(this.hidden) this.show();

		else this.fix();
	}

	onPointerDown(evt){
		if(evt.which && evt.which !== 1) return;

		evt.stop();

		var position = evt.target.getAttribute('data-pos');

		if(!position) return;

		evt.target.classList.add('active');

		evt.id = evt.which || evt.changedTouches[0].identifier;

		evt = Object.assign(evt, this.keys[position]);

		this.pointerEvents[evt.id] = evt;

		this.fire('keyDown', evt);

		// clearTimeout(this.keyupTimeout);

		// this.keyupTimeout = setTimeout(this.flushKeyup.bind(this), (this.options.keyDownLimit) * 1000);
	}

	onPointerUp(evt){
		if(document.activeElement !== document.body) document.activeElement.blur();

		if(evt.which && evt.which !== 1) return;

		evt.stop();

		evt = this.pointerEvents[evt.which || evt.changedTouches[0].identifier];

		if(!evt) return;

		var position = evt.target.getAttribute('data-pos');

		if(!position) return;

		evt.target.classList.remove('active');

		evt = Object.assign(evt, this.keys[position]);

		this.fire('keyUp', evt);

		delete this.pointerEvents[evt.id];
	}

	show(){
		dom.show(this, '', this.fix);
	}

	hide(){
		dom.disappear(this);
	}
}

window.customElements.define('soft-keyboard', SoftKeyboard);

if(typeof module === 'object') module.exports = SoftKeyboard;