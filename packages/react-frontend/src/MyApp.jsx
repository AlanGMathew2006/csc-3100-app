// src/MyApp.jsx
import Table from "./Table";
import { useState, useEffect } from "react";
import Form from "./Form";

function MyApp() {
  const [characters, setCharacters] = useState([]);

  function fetchUsers() {
    return fetch("http://localhost:8000/users");
  }

  function postUser(person) {
    return fetch("http://localhost:8000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(person),
    });
  }

  function updateList(person) {
    postUser(person)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to add user: ${response.status}`);
        }
        return response.json();
      })
      .then((savedPerson) => {
        setCharacters((prevCharacters) => [...prevCharacters, savedPerson]);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function removeOneCharacter(id) {
    fetch(`http://localhost:8000/users/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to delete user: ${response.status}`);
        }
        setCharacters((prevCharacters) =>
          prevCharacters.filter((character) => character.id !== id),
        );
      })
      .catch((error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    fetchUsers()
      .then((res) => res.json())
      .then((json) => setCharacters(json["users_list"]))
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div className="container">
      <Table characterData={characters} removeCharacter={removeOneCharacter} />
      <Form handleSubmit={updateList} />
    </div>
  );
}

export default MyApp;
