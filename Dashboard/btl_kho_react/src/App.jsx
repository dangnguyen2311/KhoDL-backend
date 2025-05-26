// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import DoanhThu from "./components/DoanhThu.jsx";
import {Route, Routes} from "react-router";
import YeuCau1 from "./components/YeuCau1.jsx";
import YeuCau2 from "./components/YeuCau2.jsx";
import CustomerOrderList from "./components/CustomerOrderList.jsx";
import CustomerLocation from "./components/CustomerLocation.jsx";
import CustomerType from "./components/CustomerType.jsx";
import {HomePage} from "./components/HomePage.jsx";
import FactHangNhapTable from './components/FactHangNhapTable.jsx';
import FactDatHang from './components/FactDatHang.jsx';


function App() {
  // const [count, setCount] = useState(0)

    return (
        <Routes>
            <Route path={"/"} element={<HomePage/>}></Route>
            <Route path={"/doanhthu"} element={<DoanhThu/>}/>
            <Route path={"/yc1"} element={<YeuCau1/>}></Route>
            <Route path={"/yc2"} element={<YeuCau2/>}></Route>
            <Route path={"/order-yc2"} element={<CustomerOrderList/>}></Route>
            <Route path={"/location-yc6"} element={<CustomerLocation/>}></Route>
            <Route path={"/KH-type-yc9" } element={<CustomerType/>}></Route>
            <Route path={"/factHN"} element={<FactHangNhapTable/>}></Route>
            <Route path={"/factDH"} element={<FactDatHang/>}></Route>
        </Routes>
    );
}

export default App
