// server.js
import app from './src/app.js';
import { config } from 'dotenv';

config();

const port = 4000;
app.listen(port, () => {
  console.log(`Server running pada http://localhost:${port}`);
});