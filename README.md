# Keyboard

This keyboard plugin provides a clean hackable keyboard UI for your web app

## Usage

1. Install `npm install fatlard1993/keyboard`
2. Include it into your js
3. Create a new keyboard `const myKeyboard = new Keyboard(options)`

### Options

To extend the keyboard past its default abilities you will need to provide some options:

#### keyDefinitions

`keyDefinitions` allow you to customize or add custom keys for use when defining a layout

Example:
```
const options = {
	keyDefinitions: {
		esc: { key: 'escape', text: 'Esc' },
		fakeShift: { class: 'shift', text: '' }
	}
};
```

#### layouts

`layouts` allow you to customize or add custom keyboard layouts to switch between

Example:
```
const options = {
	layouts: {
		useless: [
			['1', '2', '5', '6', '8', '9'],
			['esc', 'fakeShift']
		]
	}
};
```