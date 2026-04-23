import SideBarClient from "./SideBarClient";
import { auth } from "@/auth";

const Sidebar = async () => {
    const session = await auth();

    return (
        <SideBarClient session={session} />
    )
}

export default Sidebar;