import { Outlet } from "react-router";
import "./AppLayout.scss";
import { SideBar } from "../components/SideBar/SideBar";
import { TopToolBar } from "../components/TopToolBar/TopToolBar";

export const AppLayout = () => {
  return (
    <div className="app-layout">
      <SideBar />
      <TopToolBar />
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
};
