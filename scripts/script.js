helloMessage = 'Hello World!';
console.log(helloMessage);
console.log(`Hello from the ${process.env.NODE_ENV} environment`);
helloMessage = 'New Message';
printNTimes(helloMessage, 3);
console.log(`Hello from ${process.env.MESSAGE}`);
console.log(process.env.MESSAGE2);

function printNTimes(message, times) {
	for (let i = 0; i < times; i++) {
		console.log(message);
	}
}
