/*
* @Author: gloomyline
* @Date:   2017-03-15 10:21:40
* @Last Modified by:   gloomyline
* @Last Modified time: 2017-03-15 11:54:52
*/

'use strict';

var Promise = require('../src/core2')

var promise = new Promise((resolve, reject) => {
	setTimeout(() => {
		resolve({val: 'asyncronous success'})
	}, 2000);
})

promise
	.then((val) => {
		console.log(val.val);
	})
