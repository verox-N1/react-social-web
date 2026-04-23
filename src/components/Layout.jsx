import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

const HEADER_HEIGHT = 85; // stessa altezza dell'header reale

export default function Layout(){
    return(
        <div className="container">
            <Header/>
            
            {/* Wrapper per compensare header fisso */}
            <div style={{ paddingTop: HEADER_HEIGHT }}>
                <Outlet/>
            </div>

            <Footer/>
        </div>
    )
}