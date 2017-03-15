/*
* @Author: Alan
* @Date:   2017-03-10 21:02:35
* @Last Modified by:   gloomyline
* @Last Modified time: 2017-03-15 11:31:49
*/

'use strict';

try {
	module.exports = Promise
} catch(e) {
	console.log(e)
}

// Construtor
/*
 * constructor of Promise receive on exector func 
 * exector will call its two arguments which respectively are resolve and reject
 * when it exec completely 
 */
var promise = new Promise((resove, reject) => {
	/*
	 * if works, call resolve and preference value
	 * if not, call reject and preference reason
	 */
})

function resolve(self, value) {
	// TODO
	if (value instanceof Promise) {
		return value.then(resolve, reject)
	}
	setTimeout(() => {
		if (self.status === 'pending') { // exec all of callback funcs asyncronously
			self.status = 'resolved'
			self.data = value
			for (var i = 0; i < self.onResolvedCallback.length; i++) {
				self.onResolvedCallback[i](value)
			}
		}
	});	

	// console.log(self);
}

function reject(self, reason) {
	// TODO
	setTimeout(() => {					// exec all of callback funcs asyncronously
		if (self.status === 'pending') {
			self.status = 'rejectd'
			self.data = reason
			for (var i = 0; i < self.onRejectedCallback.length; i++) {
				self.onRejectedCallback[i](reason)
			}
		}
	});
}

function Promise(executor) {
	var self = this
	self.status = 'pending' 		// current status of Promise
	self.data = undefined   		// value of Promise
	self.onResolvedCallback = []	// callback set of Promise resolve
	self.onRejectedCallback = [] 	// callback set of Promise reject
	
	try {
		executor(resolve.bind(self), reject.bind(self))		// exec executor and preference arguments
	} catch(e) {
		reject.bind(self)(e)
	}
}

/*
 * method then receive two arguments, 
 * they respectively are onResolved and onRejectd 
 * which are corresponding to success and fail of the callback
 */
Promise.prototype.then = function (onResolved, onRejectd) {
	var self = this
	var promise2

	onResolved = typeof onResolved === 'function' ? onResolved : function(value) {return value}
	onRejectd = typeof onRejected === 'function' ? onRejectd : function(reason) {throw reason}

	if (self.status === 'resolved') {
		return promise2 = new Promise(function(resolve, reject) {
			setTimeout(() => {
				try {
					var x = onResolved(self.data)
					// if (x instanceof Promise) {
					// 	x.then(resolve, reject)
					// }
					// resolve(x)
					resolvePromise(promise2, x, resolve, reject)
				} catch(reason) {
					reject(reason)
				}
			});
		})
	}

	if (self.status === 'rejected') {
		return promise2 = new Promise(function(resolve, reject) {
			setTimeout(() => {
				try {
					var x = onRejectd(self.data)
					// if (x instanceof Promise) {
					// 	x.then(resolve, reject)
					// }
					resolvePromise(promise2, x, resolve, reject)
				} catch(reason) {
					reject(reason)
				}	
			});
		})
	}

	if (self.status === 'pending') {
		return promise2 = new Promise(function(resolve, reject) {
			self.onResolvedCallback.push(function(value) {
				try {
					var x = onResolved(self.data)
					// if (x instanceof Promise) {
					// 	x.then(resolve, reject)
					// }
					// resolve(x)
					resolvePromise(promise2, x, resolve, reject)
				} catch(reason) {
					reject(reason)
				}
			})

			self.onRejectedCallback.push(function(reason) {
				try {
					var x = onRejectd(self.data)
					// if (x instanceof Promise) {
					// 	x.then(resolve, reject)
					// }
					resolvePromise(promise2, x, resolve, reject)
				} catch(reason) {
					reject(reason)
				}
			})
		})
	}
}

Promise.prototype.catch = function (onRejectd) {
	var self = this
	return self.then(null, onRejected)
}

function resolvePromise(promise2, x, resolve, reject) {
	var then
	var thenCalledOrThrow = false

	if (promise2 === x) {
		return reject(new TypeError('Chaining cycle detectd for promise!'))
	}

	if (x instanceof Promise) {
		if (x.status === 'pending') {
			x.then((value) => {
				resolvePromise(promise2, value, resolve, reject)
			}, reject)
		} else { // if it is resolved, it will never resolved by a Promise unless a static value
			x.then(resolve, reject)
		}

		return
	}

	if ((x !== null) && ((typeof x === 'object') || (typeof x === 'function'))) {
		try {
			then = x.then
			if (typeof then === 'function') {
				then.call(x, function rs(y) {
					if (thenCalledOrThrow) return
					thenCalledOrThrow = true
					return resolvePromise(promise2, y, resolve, reject)
				}, function rj(r) {
					if (thenCalledOrThrow) return
					thenCalledOrThrow = true
					return reject(r)
				})
			} else {
				resolve(x)
			}
		} catch(e) {
			if (thenCalledOrThrow) return
			thenCalledOrThrow = true
			return reject(e)
		}
	} else {
		resolve(x)
	}
}
