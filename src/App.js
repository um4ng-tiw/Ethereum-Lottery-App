import "./App.css";
import { useState, useEffect } from "react";
import lottery from "./lottery";

function App() {
  const [manager, setManager] = useState("Loading...");
  useEffect(() => {
    async function getManager() {
      const fetchedManager = await lottery.methods.manager().call();
      setManager(fetchedManager);
    }
    getManager();
  }, []);
  return (
    <div className="App">
      <h2>Lotter Smart Contract. Use with Metamask extension</h2>
      <p>This contract is managed by: {manager}</p>
    </div>
  );
}

export default App;
