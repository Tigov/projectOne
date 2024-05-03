
import './custom.scss';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Login } from './components/Login/Login';
import { Register } from './components/Login/Register';
import { Reimb } from './components/Reimb/Reimb';
import { Dashboard } from './components/Dashboard/Dashboard';

function App() {

  return (
    <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login/>}/>
            <Route path="/" element={<Login/>}/>
            <Route path="/register" element={<Register/>}/>
            <Route path="/dashboard" element={<Dashboard/>}/>
          </Routes>
        </BrowserRouter>
    </div>
  );
}

export default App;
