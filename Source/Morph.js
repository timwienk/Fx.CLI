/*
---
name: Fx.CLI/Morph
description: CLI Morph animation.
license: MIT license
authors: [Tim Wienk]
requires: [Core/Fx, Core/Fx.Transitions]
provides: Morph
inspiration: Fx.Diff by Ryan Florence for less writing to stdout
...
*/
exports.Morph = new Class({

	Extends: Fx,

	options: {
		link: 'chain',
		char: 'o',
		nochar: ' ',
		max: {
			x: 79,
			y: 24
		},
		fn: function(){}
	},

	count: {
		x: 0,
		y: 0
	},

	initialize: function(options){
		this.parent(options);
		var text = '';
		for (var i = 0, j = this.options.max.y; i < j; ++i){
			text += "\n";
		}
		this.options.fn(text);
	},

	compute: function(from, to, delta){
		var now = {};
		for (var p in from) now[p] = this.parent(from[p], to[p], delta);
		return now;
	},

	start: function(properties){
		if (!this.check(properties)) return this;
		var from = {}, to = {};
		for (var p in properties){
			if (typeOf(properties[p]) === 'array'){
				from[p] = properties[p][0];
				to[p] = properties[p][1];
			} else {
				from[p] = properties[p];
				to[p] = properties[p];
			}
		}
		return this.parent(from, to);
	},

	set: function(now){
		now.x = (now.x || 0).round();
		now.y = (now.y || 0).round();

		var diff = {
			x: now.x - this.count.x,
			y: now.y - this.count.y
		}
		if (diff.x || diff.y) this.count = now;
		else return this;

		var max = this.options.max, text = "\033[" + max.y + "A\r";
		for (var i = 0; i <= max.y; ++i){
			if (i === now.y){
				for (var j = 0; j <= max.x; ++j){
					text += (j === now.x) ? this.options.char : this.options.nochar;
				}
			} else {
				for (var j = 0; j <= max.x; ++j){
					text += this.options.nochar;
				}
			}
			text += "\n\r";
		}
		this.options.fn(text.substr(0, text.length - 2));
		return this;
	}

});
