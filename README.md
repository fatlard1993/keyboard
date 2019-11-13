# Keyboard

This keyboard plugin provides a clean hackable keyboard element for your web app

## Usage

1. Install `npm install fatlard1993/keyboard`
2. Include it into your js, check out [pageCompiler](https://github.com/fatlard1993/pageCompiler)
3. Add a keyboard element to your html `<soft-keyboard/>`

### Changing

#### `layout`

This reflects the current layout (one of SoftKeyboard.prototype.layouts)

Change it in js: `myKeyboardElem.layout = 'useless';` Or in html: `<soft-keyboard layout="useless"/>`

#### `hidden`

This reflects the keyboards current visible state.

Change it in js: `myKeyboardElem.hidden = true;` Or in html: `<soft-keyboard hidden/>`

### Extending

To extend the keyboard past its default abilities create more `layouts`. Need special keys? Create `keyDefinitions`

#### `keyDefinitions`

`keyDefinitions` allow you to customize or add custom keys for use in layout definitions

Example:
```
SoftKeyboard.setKeyDefinitions({
	esc: { key: 'escape', text: 'Esc' },
	fakeShift: { class: 'shift', text: '' }
});
```

#### `layouts`

`layouts` allow you to customize or add custom keyboard layouts to switch between

Example:
```
SoftKeyboard.setLayouts({
	useless: [
		['1', '2', '5', '6', '8', '9'],
		['esc', 'fakeShift']
	]
});
```