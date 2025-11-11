import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import 'bootstrap/dist/css/bootstrap.css';
import {BrowserRouter} from "react-router-dom";

const devBase = '/frontend'
const rawBase = import.meta.env.BASE_URL ?? '/'
const prodBase = typeof rawBase === 'string' ? rawBase : '/'
const basename = import.meta.env.MODE === 'development' ? devBase : prodBase
const normalizedBasename = basename.endsWith('/') && basename.length > 1 ? basename.slice(0, -1) : basename

ReactDOM.createRoot(document.getElementById('root')!).render(
    <BrowserRouter basename={normalizedBasename}>
        <App />
    </BrowserRouter>
)
