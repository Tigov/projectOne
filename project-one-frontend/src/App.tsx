import "./App.css"
import './custom.scss';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Login } from './components/Login/Login';
import { Register } from './components/Login/Register';
import { Dashboard } from './components/Dashboard/Dashboard';
import { CreateReimb } from './components/EditData/CreateReimb';
import { EditReimb } from "./components/EditData/EditReimb";
import { EditUser } from "./components/EditData/EditUser";
import { AllReimbs } from "./components/Dashboard/AllReimbs";
import { AllUserPending } from "./components/Dashboard/AllUserPending";


function App() {

  return (
    <div className="App bg-light">
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login/>}/>
            <Route path="/" element={<Login/>}/>
            <Route path="/register" element={<Register/>}/>
            <Route path="/dashboard" element={<Dashboard/>}/>
            <Route path="/edit-reimb/:id" element={<EditReimb />} />
            <Route path="/edit-user/:userId" element={<EditUser />} />
            <Route path="/create" element={<CreateReimb/>}/>
            <Route path="/allUserPending/:userId" element={<AllUserPending/>}/>
            <Route path="/allReimbs" element={<AllReimbs/>}/>
          </Routes>
        </BrowserRouter>
    </div>
  );
}

export default App;
