/*
* @Author: Alan
* @Date:   2017-03-10 19:43:05
* @Last Modified by:   Alan
* @Last Modified time: 2017-03-10 20:54:21
*/

'use strict';

var promise = new Promise((resolve, reject) => {
	// simulate asyncronous operations
	setTimeout(() => {
		resolve({val: 'success'})
	}, Math.random() * 2000 + 1000);
})

var t1 = new Date().getTime()
var t2
promise
	.then((res) => {
		t2 = new Date().getTime()
		console.log((t2 - t1) / 1000, res);
		// after asyncronous operation
		console.log('*'.repeat(20));
	})

// before asyncronous opertion
console.log('*'.repeat(20));

var promise1 = new Promise((resolve, reject) => {
	resolve(1)
});

promise1.then((val) => {
	console.log(val);
	return val + 1
}).then((val) => {
	console.log(val);
	console.log('*'.repeat(20));
});




