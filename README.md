# whipdb
Simple Mongo front-end with dev-friendly REST API.

## How it Works
1. Sign up
2. Add/Edit collections and documents through the web interface
3. Add/Edit programmatically through the REST API

	- GET	whipdb.com/\_\_\_\_/users?key=123456789
	- GET	whipdb.com/\_\_\_\_/users?name=Bob?key=123456789
	- POST	whipdb.com/\_\_\_\_/users?key=123456789
	- PUT	whipdb.com/\_\_\_\_/users?name=Bob?key=123456789
	- DELETE	whipdb.com/\_\_\_\_/users?name=Bob?key=123456789