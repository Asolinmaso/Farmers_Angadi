import { FaHome } from "react-icons/fa";
import { FaLeaf } from "react-icons/fa";
import { GiFarmer } from "react-icons/gi";
import { CgWebsite } from "react-icons/cg";
import { RiContactsBook2Line } from "react-icons/ri";

export const navOptions = [
    {
        name: "Home",
        link: "/",
        icon: (classname) => {
            return <FaHome className={classname}/>
        }
    },
    {
        name: "About Us",
        link: "/about",
        icon: (classname) => {
            return <GiFarmer className={classname}/>
        }
    },
    {
        name: "Product",
        link: "/products",
        icon: (classname) => {
            return <FaLeaf className={classname}/>
        }
    },
    {
        name: "Contact",
        link: "/contact",
        icon: (classname) => {
            return <RiContactsBook2Line className={classname}/>
        }
    },
    {
        name: "Blog",
        link: "/blog",
        icon: (classname) => {
            return <CgWebsite className={classname}/>
        }
    },
]
