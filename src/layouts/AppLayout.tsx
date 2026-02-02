import { Outlet } from "react-router";
import "./AppLayout.scss";
import { SideBar } from "../components/SideBar/SideBar";
import { TopToolBar } from "../components/TopToolBar/TopToolBar";

export const AppLayout = () => {
  return (
    <div className="app-layout">
      <SideBar />
      <TopToolBar />
      <main
        className="content"
        style={{ background: "#95E1D3", padding: "20px" }}
      >
        <Outlet />
      </main>
    </div>
  );
};
