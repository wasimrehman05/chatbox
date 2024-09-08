import React from "react";
import "./App.css";
import { ChatBox } from "./components/ChatBox";

function App(): JSX.Element {
  return (
    <div className="App">
      <h1>ChatBox Ava</h1>
      <ChatBox />
    </div>
  );
}

export default App;
