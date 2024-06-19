import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import Calendar from './components/calendar';

function App() {

	return (

		<BrowserRouter>

			<div id="app" className="grid">

				<Calendar/>

			</div>

		</BrowserRouter>

	);
}

export default App;
