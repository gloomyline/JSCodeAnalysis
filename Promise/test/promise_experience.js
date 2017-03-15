var promise = new Promise((resolve, reject) => {
	setTimeout(() => {
		resolve({val : 'success'});
		console.log('11111', new Date().getTime());
	}, 2000 );
	setTimeout(() => {
		resolve({val : 'err'});
		console.log('2222', new Date().getTime());
	}, 3000);
})

// promise.then(val => {
// 	console.log('get value after success:', val, new Date().getTime());
// }).catch(err => {
// 	console.log('error occured after rejected', err);
// })

var promise1 = promise.then(() => {
	
})
console.log(promise !== promise1);