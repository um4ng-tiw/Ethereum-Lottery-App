import "./App.css";
import { useState, useEffect } from "react";
import lottery from "./lottery";
import web3 from "./web3";

function App() {
  const [manager, setManager] = useState("Loading...");
  const [players, getPlayers] = useState([]);
  const [balance, setBalance] = useState("Loading...");
  const [etherValue, getEtherValue] = useState("");
  const [message, setMessage] = useState("");
  useEffect(() => {
    async function getManager() {
      const fetchedManager = await lottery.methods.manager().call();
      const fetchedPlayers = await lottery.methods.getPlayers().call();
      const fetchedBalance = await web3.eth.getBalance(lottery.options.address);
      setManager(fetchedManager);
      getPlayers(fetchedPlayers);
      setBalance(fetchedBalance);
    }
    getManager();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("Waiting for transaction to be on chain...");
    const accounts = await web3.eth.getAccounts();

    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(etherValue, "ether"),
    });

    setMessage(
      "Transaction sent to chain. You have entered the lottery successfully !"
    );
  };

  console.log("Manager", manager);

  const handleWinner = async (e) => {
    const accounts = await web3.eth.getAccounts();

    setMessage("Waiting for transaction to be on chain");

    await lottery.methods.pickWinner().send({
      from: accounts[0],
    });

    setMessage("Winner has been picked");
  };

  return (
    <div className="App">
      <h2>Lotter Smart Contract. Use with Metamask extension</h2>
      <p>This contract is managed by: {manager}.</p>
      <p>
        There are currently {players.length} people entered, competing to win{" "}
        {balance === "Loading..." ? "0" : web3.utils.fromWei(balance, "ether")}{" "}
        ether!
      </p>

      <hr />
      <form onSubmit={handleSubmit}>
        <h4>Want to try your luck ?</h4>
        <div>
          <label>Amount of ether to enter: </label>
          <input
            type="text"
            value={etherValue}
            onChange={(e) => getEtherValue(e.target.value)}
          />
        </div>
        <button type="Submit">Enter</button>
      </form>
      <hr />
      <h3>{message}</h3>
      <hr />
      <h4>Ready to pick a winner ?</h4>
      <button onClick={handleWinner}>Pick a winner !</button>
    </div>
  );
}

export default App;
