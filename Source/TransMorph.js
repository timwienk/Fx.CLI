/*
---
name: Fx.CLI/TransMorph
description: CLI TransMorph animation.
license: MIT license
authors: [Tim Wienk]
requires: [Core/Fx, Core/Fx.Transitions]
provides: TransMorph
inspiration: http://github.com/cheeaun/Fx.TransMorph and Fx.Diff by Ryan Florence for less writing to stdout
...
*/

exports.TransMorph = new Class({

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

	step: function(){
		var time = Date.now();
		if (time < this.time + this.options.duration){
			var delta = {},
				d = (time - this.time) / this.options.duration;
				t = this.transition(d);
			for (p in this.from){
				var trans = this.transitions[p];
				delta[p] = (trans) ? trans(d) : t;
			}
			this.set(this.compute(this.from, this.to, delta));
		} else {
			this.set(this.compute(this.from, this.to, 1));
			this.complete();
		}
	},

	compute: function(from, to, delta){
		var now = {};
		for (var p in from) now[p] = this.parent(from[p], to[p], (typeOf(delta) == 'object') ? delta[p] : delta);
		return now;
	},

	start: function(properties, transitions){
		if (!this.check(properties, transitions)) return this;
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
		transitions = transitions || {};
		Object.each(transitions, function(trans, key){
			transitions[key] = this.getTransition(trans);
		}, this);
		this.transitions = transitions;
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
	},

	getTransition: function(transition){
		var trans = transition || this.options.transition || Fx.Transitions.Sine.easeInOut;
		if (typeof trans == 'string'){
			var data = trans.split(':');
			trans = Fx.Transitions;
			trans = trans[data[0]] || trans[data[0].capitalize()];
			if (data[1]) trans = trans['ease' + data[1].capitalize() + (data[2] ? data[2].capitalize() : '')];
		}
		return trans;
	}

});
