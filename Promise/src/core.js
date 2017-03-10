/*
* @Author: Alan
* @Date:   2017-03-10 21:02:35
* @Last Modified by:   Alan
* @Last Modified time: 2017-03-10 22:18:46
*/

'use strict';

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

function resolve(value) {
	// TODO
	if (self.status === 'pending') {
		self.status = 'resolved'
		self.data = value
		for (var i = 0; i < self.onResolvedCallback.length; i++) {
			self.onResolvedCallback[i](value)
		}
	}
}

function reject(reason) {
	// TODO
	if (self.status === 'pending') {
		self.status = 'rejectd'
		self.data = reason
		for (var i = 0; i < self.onRejectedCallback.length; i++) {
			self.onRejectedCallback[i](reason)
		}
	}
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
	onRejectd = typeof onRejected === 'function' ? onRejectd : function(reason) {return reason}

	if (self.status === 'resolved') {
		return promise2 = new Promise(function(resolve, reject)) {
			try {
				var x = onResolved(self.data)
				if (x instanceof Promise) {
					x.then(resolve, reject)
				}
				resolve(x)
			} catch(e) {
				reject(e)
			}
		})
	}

	if (self.status === 'rejected') {
		return promise2 = new Promise(function(resolve, reject)) {
			try {
				var x = onRejectd(self.data)
				if (x instance of Promise) {
					x.then(resolve, reject)
				}
			} catch(e) {
				reject(e)
			}
		})
	}

	if (self.status === 'pending') {
		return promise2 = new Promise(function(resolve, reject)) {
			self.onResolvedCallback.push(function(value) {
				try {
					var x = onResolved(self.data)
					if (x instanceof Promise) {
						x.then(resolve, reject)
					}
					resolve(x)
				} catch(e) {
					reject(e)
				}
			})

			self.onRejectedCallback.push(function(reason) {
				try {
					var x = onRejectd(self.data)
					if (x instance of Promise) {
						x.then(resolve, reject)
					}
				} catch(e) {
					reject(e)
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
			x.then(function(value) {
				resolvePromise(promise2, value, resolve, reject)
			}, reject)
		} else {
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