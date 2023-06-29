import React, { useEffect, useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faTachometerAlt, faFolderPlus, faPlus, faUser, faSearch } from "@fortawesome/free-solid-svg-icons";
import classes from "./topbar.module.css";
import axios from "axios";
import { Link, useNavigate, useLocation } from "react-router-dom";
import useFetchUserName from "../../hooks/useFetchUserName/useFetchUserName";
import { faFolder } from "@fortawesome/free-solid-svg-icons";

const Topbar = () => {
  const navigate = useNavigate();
  const userName = useFetchUserName();
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);
  const modalRef = useRef(null);
  const [listMenu, setListMenu] = useState([]);

  useEffect(() => {
    const fetchLists = async () => {
      try {
        const response = await axios.get("http://localhost:8080/lists");
        setListMenu(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchLists();
  }, []);

  const handleCollectionClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  const handleOutsideClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      handleCloseModal();
    }
  };

  const handleAddTaskClick = () => {
    if (location.pathname === "/taskmanager") {
      setShowModal(true);
    } else if (location.pathname.startsWith("/lists/")) {
      const listId = location.pathname.split("/")[2];
      navigate(`/lists/${listId}/NewTask`);
    }
  };

  const listId = location.pathname.split("/")[2];

  return (
    <div className={classes.topbar}>
      <div className={classes.container}>
        <div className={classes.one}>
          <div className={classes.dash} onClick={() => navigate("/taskmanager")}>
            <FontAwesomeIcon icon={faHome} />
            <span>Dashboard</span>
          </div>
          <div className={classes.dash} id={classes.collection} onClick={handleCollectionClick}>
            <FontAwesomeIcon icon={faFolderPlus} />
            <span>Collections</span>
          </div>
        </div>
        <div className={classes.two}>
          <div className={classes.addtask} onClick={handleAddTaskClick}>
            <FontAwesomeIcon icon={faPlus} />
          </div>
          <div className={classes.search}>
            <FontAwesomeIcon icon={faSearch} />
          </div>
          <div className={classes.imgdiv}>
            <span>Hello, {userName}</span>
            <FontAwesomeIcon className={classes.user} icon={faUser} />
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className={classes.modal} onClick={handleCloseModal}>
          <div ref={modalRef} className={classes.modalContent} onClick={handleModalClick}>
            <div className={classes.modalCon}>
              <div className={classes.modalHeader}>
                <h2>Select a Collection</h2>
              </div>
              <div className={classes.collectionContainer}>
                {listMenu.map((list) => (
                  <Link to={`/lists/${list._id}/NewTask`} key={list._id} className={`${classes.list_menu_item}`} onClick={handleCloseModal}>
                    <div className={`${classes.card} card`} >
                      <span className={classes.icon}style={{ backgroundColor: list.color }}>
                        <FontAwesomeIcon icon={faFolder} />
                      </span>
                      <span className={classes.title}>{list.title}</span>
                    </div>
                  </Link>
                ))}
              </div>
              <Link className={classes.Link} to="/NewList">
                <button className={classes.btn}>New List</button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Topbar;
