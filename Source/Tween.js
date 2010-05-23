/*
---
name: Fx.CLI/Tween
description: CLI Tween animation.
license: MIT license
authors: [Tim Wienk]
requires: [Core/Fx, Core/Fx.Transitions]
provides: Tween
inspiration: Fx.Diff by Ryan Florence for less writing to stdout
...
*/

exports.Tween = new Class({

	Extends: Fx,

	options: {
		link: 'chain',
		char: 'o',
		nochar: ' ',
		direction: 'x',
		max: 24,
		fn: function(){}
	},

	count: 0,

	functions: {
		x: function(text){
			this.options.fn("\r" + text);
		},
		y: function(text, max){
			this.options.fn("\033[" + max + "A\r" + text.split('').join("\n\r"));
		},
		wave: function(text){
			this.options.fn(text + "\n");
		}
	},

	initialize: function(options){
		this.parent(options);
		if (this.options.direction == 'y'){
			var text = '';
			for (var i = 0, j = this.options.max; i < j; ++i){
				text += "\n";
			}
			this.options.fn(text);
		}
	},

	set: function(now){
		now = now.round();

		if (this.options.direction != 'wave'){
			var diff = now - this.count
			if (diff) this.count += diff;
			else return this;
		}

		var text = '', max = this.options.max;
		for (var i = 0; i <= max; ++i){
			text += (i === now) ? this.options.char : this.options.nochar;
		}
		this.functions[this.options.direction].apply(this, [text, max]);
		return this;
	}

});
