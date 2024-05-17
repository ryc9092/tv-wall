import { useContext } from "react";
import { StoreContext } from "../store/store";
import { Actions } from "../store/reducer";
import ListIcon from "../../assets/list.png";
import UserIcon from "../../assets/user.png";
import BellIcon from "../../assets/bell.png";
import "./topbar.scss";

function TopBar() {
  const [store, dispatch] = useContext(StoreContext);

  const onSiderCollapse = () => {
    dispatch({ type: Actions.SetSiderCollapse, payload: !store.siderCollapse });
  };

  let logoLetters = [
    { letter: "I", fontSize: "38px", color: "#ebdd2d" },
    { letter: "P", fontSize: "26px", color: "#595757" },
    { letter: "E", fontSize: "26px", color: "#898989" },
    { letter: "C", fontSize: "26px", color: "#b5b5b6" },
  ];
  let logo = (
    <span>
      {logoLetters.map((letter) => (
        <span className="topbar-logo-letter " style={{ ...letter }}>
          {letter.letter}
        </span>
      ))}
    </span>
  );

  return (
    <div>
      <div className="topbar-fixed">
        <span className="topbar-container">
          <img
            src={ListIcon}
            alt="list"
            className="topbar-list-icon"
            onClick={onSiderCollapse}
          />
          {logo}
        </span>
        <span style={{ position: "absolute", right: 0, top: 4 }}>
          <img src={BellIcon} alt="bell" className="topbar-function-icon" />
          <img src={UserIcon} alt="user" className="topbar-function-icon" />
        </span>
      </div>
    </div>
  );
}

export default TopBar;
