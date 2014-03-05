function _J2Loop_(index, length) {
	this.index = index + 1;
	this.index0 = index;
	this.length = length;
	this.first = index == 0;
	this.last = index == length - 1;
}

_J2Loop_.prototype.cycle = function(even, odd) {
	return this.index0 % 2 == 0 ? even : odd;
}

var context = {
	scripts : [],
	charArray : [],
	addScript : function(s) {
		
		this.scripts.push(s);
	},
	addChar : function(c) {
		this.charArray.push(c);
	},
	endText : function() {
		var text = this.charArray.join('');
		if (text.length > 0) {
			this.addScript('__out__.write("' + text.replace(/"/g, '\\"').replace(/\n/g, '\\n') + '")\n');
		}
		this.charArray = [];
	},
	startFor : function(array_name, var_name) {
		this.endText();
		this.addScript('for (var _i = 0; _i < ' + array_name + '.length; _i++) {\n');
		this.addScript('var ' + var_name + ' = ' + array_name + '[_i];\n');
		this.addScript('var loop = new _J2Loop_(_i, ' + array_name +'.length);\n');
	},
	endFor : function() {
		this.endText();
		this.addScript('}\n');
	},
	startIf : function(expr) {
		this.endText();
		this.addScript('if (' + expr + '){\n');
	},
	startElse : function() {
		this.addScript('} else {\n');
	},
	startElseIf : function(expr) {
		this.endText();
		this.addScript('} else if (' + expr + '){\n');
	},
	endIf : function() {
		this.endText();
		this.addScript('}\n');
	},
	setVariable : function(var_name, var_expr) {
		this.endText();
		this.addScript('var ' + var_name + '=' + var_expr + '\n');
	},
	expr : function(expr) {
		this.endText();
		this.addScript('__out__.write(' + expr + ');\n');
	},
	toText : function() {
		this.endText();
		return this.scripts.join('');
	},
	render : function(data) {
		var text = this.toText();
	}
}

var j2 = require('./j2');
j2.parser.yy = context;

var source = require('fs').readFileSync(require('path').normalize('j2.html'), "utf8");

j2.parse(source);
var __out__ = {
	write : function(text) {
		process.stdout.write('' + text);
	}
}
// console.log('---------- template --------------');
// console.log(source);
console.log('---------- html --------------');

var script = context.toText();
var apps = ['1', '2'];
var test = 'hello world';
var ok = 3;
eval(script);