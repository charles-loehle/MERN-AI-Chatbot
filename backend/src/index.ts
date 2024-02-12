import app from './app.js';
import { connectToDatabase } from './db/connection.js';

connectToDatabase()
	.then(() => {
		const PORT = process.env.PORT || 5000;
		// connection
		app.listen(PORT, () =>
			console.log('Server open and connected to database')
		);
	})
	.catch(err => console.log(err));

